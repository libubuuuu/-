import { AICapability } from "../provider";
import { getProviderFor } from "../config";
import { z } from "zod";

const DesignSuggestionSchema = z.object({
  fabrics: z.array(z.object({
    name: z.string(),
    color: z.string(),
    reason: z.string(),
  })),
  accessories: z.array(z.object({
    name: z.string(),
    position: z.string(),
    reason: z.string(),
  })),
});

export class DesignAssistant {
  async getSuggestions(
    petType: string,
    baseGarment: string
  ) {
    const prompt = `Suggest fabric and accessory combinations for a ${petType} wearing a ${baseGarment}. Return creative and fun outfit ideas.`;
    const provider = getProviderFor(AICapability.TEXT_GENERATION);

    try {
      return await provider.generateStructured(prompt, DesignSuggestionSchema);
    } catch {
      return { fabrics: [], accessories: [] };
    }
  }
}

export const designAssistant = new DesignAssistant();
