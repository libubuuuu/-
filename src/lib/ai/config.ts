import { registry } from "./provider";
import { MockProvider } from "./providers/mock-provider";
import type { AICapability } from "./provider";

export interface AIConfig {
  imageTo3D: string;
  textGeneration: string;
  imageAnalysis: string;
}

export const aiConfig: AIConfig = {
  imageTo3D: process.env.AI_3D_PROVIDER || "mock",
  textGeneration: process.env.AI_TEXT_PROVIDER || "mock",
  imageAnalysis: process.env.AI_IMAGE_ANALYSIS_PROVIDER || "mock",
};

export function initAIProviders() {
  const mock = new MockProvider();
  registry.register("mock", mock);

  // Add real providers here when API keys are configured:
  // if (process.env.TRIPO3D_API_KEY) {
  //   registry.register("tripo3d", new Tripo3DProvider());
  // }
  // if (process.env.OPENAI_API_KEY) {
  //   registry.register("openai", new OpenAIProvider());
  // }
  // if (process.env.ANTHROPIC_API_KEY) {
  //   registry.register("anthropic", new AnthropicProvider());
  // }
}

export function getProviderFor(capability: AICapability) {
  const map: Record<AICapability, string> = {
    [AICapability.IMAGE_TO_3D]: aiConfig.imageTo3D,
    [AICapability.TEXT_GENERATION]: aiConfig.textGeneration,
    [AICapability.IMAGE_ANALYSIS]: aiConfig.imageAnalysis,
    [AICapability.STRUCTURED_OUTPUT]: aiConfig.textGeneration,
  };
  return registry.getProvider(capability, map[capability]);
}
