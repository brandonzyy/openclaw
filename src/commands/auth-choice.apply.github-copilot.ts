import { toAgentModelListLike } from "../config/model-input.js";
import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";
import { applyAuthProfileConfig } from "./onboard-auth.js";

// GitHub Copilot support removed
export async function applyAuthChoiceGitHubCopilot(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice !== "github-copilot") {
    return null;
  }

  await params.prompter.note(
    "GitHub Copilot support has been removed.",
    "GitHub Copilot",
  );

  return { config: params.config };
}
