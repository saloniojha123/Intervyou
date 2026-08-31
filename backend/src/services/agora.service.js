import agoraToken from "agora-token";
const { RtcTokenBuilder, RtcRole } = agoraToken;

import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

const TOKEN_TTL_SECONDS = 3600;

class AgoraService {
  isConfigured() {
    return Boolean(
      config.agora.appId &&
      config.agora.appCertificate &&
      config.agora.customerId &&
      config.agora.customerSecret &&
      config.agora.pipelineId
    );
  }

  getAuthHeader() {
    const credentials = Buffer.from(
      `${config.agora.customerId}:${config.agora.customerSecret}`
    ).toString("base64");

    return `Basic ${credentials}`;
  }

  async generateRtcToken({ channelName, uid = 0 }) {
    if (!config.agora.appId || !config.agora.appCertificate) {
      throw new Error("Agora App ID / App Certificate not configured");
    }

    const expireTs =
      Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

    const token = RtcTokenBuilder.buildTokenWithUid(
      config.agora.appId,
      config.agora.appCertificate,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      expireTs,
      expireTs
    );

    return {
      appId: config.agora.appId,
      channelName,
      uid,
      token,
      expiresIn: TOKEN_TTL_SECONDS,
    };
  }

  /**
   * Start the published Conversational AI agent
   * in the same RTC channel as the candidate.
   */
  async startAgent({ channelName, agentRtcUid = 9999 }) {
    if (!this.isConfigured()) {
      throw new Error(
        "Agora Conversational AI credentials are not fully configured"
      );
    }

    const agentToken = await this.generateRtcToken({
      channelName,
      uid: agentRtcUid,
    });

    const url =
      `https://api.agora.io/api/conversational-ai-agent/v2` +
      `/projects/${config.agora.appId}/join`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: config.agora.agentName,

        pipeline_id: config.agora.pipelineId,

        properties: {
          channel: channelName,

          agent_rtc_uid: String(agentRtcUid),

          remote_rtc_uids: ["*"],

          token: agentToken.token,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error("Agora agent start failed:", data);

      throw new Error(
        data?.reason ||
          data?.detail ||
          "Failed to start Agora conversational agent"
      );
    }

    logger.info(
      `Agora agent started: ${data.agent_id} on channel ${channelName}`
    );

    return {
      agentId: data.agent_id,
      channelName,
      agentRtcUid,
    };
  }

  /**
   * Make the Agora agent speak our already-generated
   * interviewer response through its configured TTS.
   */
  async speak({ agentId, text }) {
    if (!agentId) {
      throw new Error("Agora agentId is required");
    }

    if (!text?.trim()) {
      return;
    }

    const url =
      `https://api.agora.io/api/conversational-ai-agent/v2` +
      `/projects/${config.agora.appId}` +
      `/agents/${agentId}/speak`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        text: text.trim(),
        priority: "INTERRUPT",
        interruptable: true,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      logger.error("Agora TTS failed:", data);

      throw new Error(
        data?.reason ||
          data?.detail ||
          "Agora TTS broadcast failed"
      );
    }

    logger.info(`Agora TTS speaking: ${text.slice(0, 80)}...`);

    return data;
  }

  /**
   * Stop the Agora conversational AI agent.
   */
  async stopAgent(agentId) {
    if (!agentId) return;

    const url =
      `https://api.agora.io/api/conversational-ai-agent/v2` +
      `/projects/${config.agora.appId}` +
      `/agents/${agentId}/leave`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },

      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      logger.error("Failed to stop Agora agent:", data);

      throw new Error(
        data?.reason ||
          data?.detail ||
          "Failed to stop Agora agent"
      );
    }

    logger.info(`Agora agent stopped: ${agentId}`);
  }
}

export const agoraService = new AgoraService();