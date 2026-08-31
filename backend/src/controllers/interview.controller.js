import { randomUUID } from "crypto";

import {
  orchestratorService,
} from "../services/orchestrator/OrchestratorService.js";

import { agoraService } from "../services/agora.service.js";

import { assessmentService } from "../services/assessment.service.js";

import { logger } from "../utils/logger.js";

/*
 * Temporary in-memory storage for active Agora agents.
 *
 * sessionId -> agentId
 *
 * This is fine for our current development/testing stage.
 */
const activeAgents = new Map();

/**
 * POST /api/interview/start
 *
 * Creates:
 * 1. Interview session
 * 2. Agora RTC token for candidate
 * 3. Agora Conversational AI agent
 *
 * Candidate and AI agent use the SAME Agora channel.
 */
export async function startInterview(req, res) {
  try {
    const {
      resumeSummary = "",
      candidateProfile = {},
    } = req.body || {};

    // Create unique interview/session ID
    const sessionId = randomUUID();

    /*
     * Start our existing interview/orchestrator session
     */
    orchestratorService.startSession({
      sessionId,
      resumeSummary,
      candidateProfile,
    });

    /*
     * Generate Agora RTC token for the candidate
     */
    const rtcToken = await agoraService.generateRtcToken({
      channelName: sessionId,
      uid: 0,
    });

    /*
     * Start Agora Conversational AI agent
     *
     * IMPORTANT:
     * The AI agent joins the SAME channel as the candidate.
     */
    const agent = await agoraService.startAgent({
      channelName: sessionId,
    });

    const openingResponse =
      await orchestratorService.startInterviewQuestion(sessionId);

    await agoraService.speak({
      agentId: agent.agentId,
      text: openingResponse.text,
    });

    /*
     * Remember which Agora agent belongs to this interview.
     *
     * We need this later when the candidate clicks
     * "End Interview".
     */
    activeAgents.set(sessionId, agent.agentId);

    /*
     * Send everything the frontend needs.
     */
    res.status(201).json({
      sessionId,

      rtc: rtcToken,

      agent: {
        agentId: agent.agentId,
        channelName: agent.channelName,
        agentRtcUid: agent.agentRtcUid,
      },
    });
  } catch (err) {
    logger.error("startInterview failed", err);

    res.status(500).json({
      error: err.message || "Failed to start interview",
    });
  }
}

/**
 * POST /api/interview/:sessionId/turn
 *
 * Existing text-based fallback.
 *
 * This is NOT the main voice path.
 * We keep it for testing the orchestrator.
 */
export async function submitTurn(req, res) {
  try {
    const { sessionId } = req.params;

    const { text } = req.body || {};

    if (!text?.trim()) {
      return res.status(400).json({
        error: "text is required",
      });
    }

    const response =
      await orchestratorService.handleCandidateTurn(
        sessionId,
        text.trim()
      );

    res.json(response);
  } catch (err) {
    logger.error("submitTurn failed", err);

    res.status(500).json({
      error:
        err.message ||
        "Failed to process turn",
    });
  }
}

/**
 * POST /api/interview/:sessionId/end
 *
 * Ends:
 * 1. Agora AI agent
 * 2. Interview session
 * 3. Final assessment
 */
export async function endInterview(req, res) {
  try {
    const { sessionId } = req.params;

    /*
     * Stop Agora Conversational AI agent
     */
    const agentId = activeAgents.get(sessionId);

    if (agentId) {
      try {
        await agoraService.stopAgent(agentId);

        logger.info(
          `Agora agent stopped for session: ${sessionId}`
        );
      } catch (agentError) {
        /*
         * Don't prevent the final report just because
         * stopping the agent failed.
         */
        logger.error(
          "Failed to stop Agora agent:",
          agentError
        );
      }

      activeAgents.delete(sessionId);
    }

    /*
     * End our interview/orchestrator session
     */
    const rawReport =
      orchestratorService.endSession(sessionId);

    if (!rawReport) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    /*
     * Build final assessment
     */
    const finalReport =
      assessmentService.buildFinalReport(rawReport);

    res.json(finalReport);
  } catch (err) {
    logger.error("endInterview failed", err);

    res.status(500).json({
      error:
        err.message ||
        "Failed to end interview",
    });
  }
}