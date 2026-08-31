/**
 * assessment.service.js
 * Post-interview (and eventually live) analysis: flags vague/contradictory
 * answers and builds the structured, transcript-linked final report.
 *
 * Live vagueness/contradiction detection should hook into
 * OrchestratorService.handleCandidateTurn once an LLM provider is wired up
 * (ask the LLM to classify the candidate's last answer against prior turns).
 */
class AssessmentService {
  /**
   * Very simple heuristic placeholder: flags short answers as "possibly vague".
   * Replace with an LLM-based classifier for real use.
   */
  detectVagueAnswer(text) {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return wordCount > 0 && wordCount < 8;
  }

  buildFinalReport(contextStoreReport) {
    const { sessionId, transcript, flags, finalDifficulty } = contextStoreReport;

    const candidateTurns = transcript.filter((t) => t.speaker === "candidate");
    const personaTurns = transcript.filter((t) => t.speaker !== "candidate");

    return {
      sessionId,
      summary: {
        totalExchanges: candidateTurns.length,
        finalDifficulty,
        flaggedMoments: flags.length,
      },
      flags,
      transcript,
      personasInvolved: [...new Set(personaTurns.map((t) => t.personaId).filter(Boolean))],
      generatedAt: new Date().toISOString(),
    };
  }
}

export const assessmentService = new AssessmentService();
