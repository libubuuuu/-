import { z } from "zod";
import type {
  AIProvider,
  AICapability,
  GenerationOptions,
  GenerationResult,
  GenerationStatus,
  TextOptions,
  ImageAnalysis,
} from "../provider";
import { AICapability } from "../provider";

export class MockProvider implements AIProvider {
  name = "mock";
  capabilities: AICapability[] = [
    AICapability.TEXT_GENERATION,
    AICapability.STRUCTURED_OUTPUT,
    AICapability.IMAGE_TO_3D,
    AICapability.IMAGE_ANALYSIS,
  ];

  private jobs = new Map<string, GenerationStatus>();

  async generate3DModel(imageUrl: string, options?: GenerationOptions): Promise<GenerationResult> {
    const jobId = `mock-3d-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const status: GenerationStatus = {
      jobId,
      status: "pending",
    };
    this.jobs.set(jobId, status);

    // Simulate async processing
    setTimeout(() => {
      this.jobs.set(jobId, { ...status, status: "processing" });
    }, 1000);

    setTimeout(() => {
      this.jobs.set(jobId, {
        ...status,
        status: "completed",
        modelUrl: `/assets/mock-pet-${options?.skeletonType || "dog"}.glb`,
      });
    }, 3000);

    return { jobId, status: "pending" };
  }

  async getGenerationStatus(jobId: string): Promise<GenerationStatus> {
    return this.jobs.get(jobId) ?? { jobId, status: "failed", error: "Job not found" };
  }

  async generateText(prompt: string, options?: TextOptions): Promise<string> {
    return `[AI Generated] ${prompt.slice(0, 50)}...`;
  }

  async generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
    return schema.parse({
      description: `AI generated description for: ${prompt.slice(0, 30)}`,
      tags: ["pet", "clothing", "cute"],
      score: 0.8,
    }) as T;
  }

  async analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
    return {
      species: Math.random() > 0.5 ? "cat" : "dog",
      breed: "Mixed",
      dominantColor: "#f5f5f5",
      tags: ["cute", "fluffy"],
    };
  }
}
