import type { ApplyAuthChoiceParams, ApplyAuthChoiceResult } from "./auth-choice.apply.js";

// Hugging Face support removed
export async function applyAuthChoiceHuggingface(
  params: ApplyAuthChoiceParams,
): Promise<ApplyAuthChoiceResult | null> {
  if (params.authChoice !== "huggingface-api-key") {
    return null;
  }

  await params.prompter.note(
    "Hugging Face support has been removed.",
    "Hugging Face",
  );

  return { config: params.config };
}
