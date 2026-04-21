import { z } from "zod";
import { AICapability } from "../provider";
import { getProviderFor } from "../config";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const RecommendationSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string(),
      reason: z.string(),
      score: z.number(),
    })
  ),
});

export class RecommendationEngine {
  async getRecommendations(
    petSpecies: string,
    context: { weather?: string; style?: string; limit?: number } = {}
  ) {
    const cacheKey = `rec:${petSpecies}:${JSON.stringify(context)}`;
    const hash = crypto.createHash("md5").update(cacheKey).digest("hex");

    const cached = await prisma.aiCache.findUnique({ where: { cacheKey: hash } });
    if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
      return JSON.parse(cached.output);
    }

    const prompt = `Recommend pet clothing products for a ${petSpecies}. Context: ${JSON.stringify(context)}. Return product IDs with reasons.`;
    const provider = getProviderFor(AICapability.TEXT_GENERATION);

    try {
      const result = await provider.generateStructured(prompt, RecommendationSchema);

      await prisma.aiCache.upsert({
        where: { cacheKey: hash },
        create: {
          cacheKey: hash,
          provider: provider.name,
          serviceType: "recommendation",
          input: prompt,
          output: JSON.stringify(result),
          expiresAt: new Date(Date.now() + 3600000),
        },
        update: {
          output: JSON.stringify(result),
          expiresAt: new Date(Date.now() + 3600000),
        },
      });

      return result;
    } catch {
      return { products: [] };
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
