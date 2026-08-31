import { WebSocketServer } from "ws";
import { orchestratorService } from "../services/orchestrator/OrchestratorService.js";
import { logger } from "../utils/logger.js";

/**
 * Lightweight WebSocket layer for live session events, separate from the
 * Agora RTC audio path itself. This channel carries control/UI events:
 * ASR partial/final transcripts in, persona text + "who's speaking" events out.
 *
 * Expected client -> server messages:
 *   { type: "join", sessionId }
 *   { type: "candidate_final_transcript", sessionId, text }
 *
 * Server -> client messages:
 *   { type: "persona_response", personaId, personaName, role, text }
 *   { type: "error", message }
 */
export function attachSessionSocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws/session" });

  wss.on("connection", (ws) => {
    logger.info("WebSocket client connected");

    ws.on("message", async (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      }

      try {
        switch (msg.type) {
          case "join": {
            ws.sessionId = msg.sessionId;
            ws.send(JSON.stringify({ type: "joined", sessionId: msg.sessionId }));
            break;
          }

          case "candidate_final_transcript": {
            const { sessionId, text } = msg;
            const response = await orchestratorService.handleCandidateTurn(sessionId, text);
            ws.send(JSON.stringify({ type: "persona_response", ...response }));
            break;
          }

          default:
            ws.send(JSON.stringify({ type: "error", message: `Unknown message type: ${msg.type}` }));
        }
      } catch (err) {
        logger.error("WS handler error", err);
        ws.send(JSON.stringify({ type: "error", message: err.message }));
      }
    });

    ws.on("close", () => logger.info("WebSocket client disconnected"));
  });

  return wss;
}
