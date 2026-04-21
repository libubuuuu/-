import { z } from "zod";

export enum AICapability {
  TEXT_GENERATION = "text_generation",
  STRUCTURED_OUTPUT = "structured_output",
  IMAGE_TO_3D = "image_to_3d",
  IMAGE_ANALYSIS = "image_analysis",
}

export interface GenerationOptions {
  format?: "glb" | "obj" | "gltf";
  quality?: "low" | "medium" | "high";
  skeletonType?: "cat" | "dog";
}

export interface GenerationResult {
  jobId: string;
  status: "pending" | "processing";
}

export interface GenerationStatus {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  modelUrl?: string;
  error?: string;
}

export interface TextOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ImageAnalysis {
  species: "cat" | "dog";
  breed?: string;
  dominantColor?: string;
  size?: string;
  tags?: string[];
}

export interface AIProvider {
  name: string;
  capabilities: AICapability[];
  generate3DModel(imageUrl: string, options?: GenerationOptions): Promise<GenerationResult>;
  getGenerationStatus(jobId: string): Promise<GenerationStatus>;
  generateText(prompt: string, options?: TextOptions): Promise<string>;
  generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T>;
  analyzeImage(imageUrl: string): Promise<ImageAnalysis>;
}

export class AIProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();

  register(name: string, provider: AIProvider) {
    this.providers.set(name, provider);
  }

  getProvider(capability: AICapability, preferred?: string): AIProvider {
    if (preferred) {
      const provider = this.providers.get(preferred);
      if (provider && provider.capabilities.includes(capability)) {
        return provider;
      }
    }
    for (const [_, provider] of this.providers) {
      if (provider.capabilities.includes(capability)) {
        return provider;
      }
    }
    throw new Error(`No registered AI provider for capability: ${capability}`);
  }

  getProviderByName(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const registry = new AIProviderRegistry();
