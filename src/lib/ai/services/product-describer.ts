import { AICapability } from "../provider";
import { getProviderFor } from "../config";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export class ProductDescriber {
  async generateDescription(
    name: string,
    imageUrl: string,
    petType?: string,
    fabricType?: string
  ): Promise<{ description: string; tags: string[]; score: number }> {
    const cacheKey = `product-desc:${name}:${imageUrl}`;
    const hash = crypto.createHash("md5").update(cacheKey).digest("hex");

    const cached = await prisma.aiCache.findUnique({ where: { cacheKey: hash } });
    if (cached && (!cached.expiresAt || cached.expiresAt > new Date())) {
      return JSON.parse(cached.output);
    }

    const prompt = `Write an appealing product description for pet clothing: "${name}". Pet type: ${petType || "any"}. Fabric: ${fabricType || "cotton"}. Make it fun and descriptive.`;
    const provider = getProviderFor(AICapability.TEXT_GENERATION);

    const description = await provider.generateText(prompt);
    const result = { description, tags: ["pet", "clothing"], score: 0.7 };

    await prisma.aiCache.upsert({
      where: { cacheKey: hash },
      create: {
        cacheKey: hash,
        provider: provider.name,
        serviceType: "product_description",
        input: prompt,
        output: JSON.stringify(result),
        expiresAt: new Date(Date.now() + 86400000),
      },
      update: {
        output: JSON.stringify(result),
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    return result;
  }
}

export const productDescriber = new ProductDescriber();
