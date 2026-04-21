import type { GenerationOptions, GenerationResult, GenerationStatus } from "../provider";
import { AICapability } from "../provider";
import { getProviderFor } from "../config";

export class ThreeDGeneratorService {
  async generatePetModel(
    imageUrl: string,
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    const provider = getProviderFor(AICapability.IMAGE_TO_3D);
    return provider.generate3DModel(imageUrl, options);
  }

  async checkJobStatus(jobId: string): Promise<GenerationStatus> {
    const provider = getProviderFor(AICapability.IMAGE_TO_3D);
    return provider.getGenerationStatus(jobId);
  }
}

export const threeDGenerator = new ThreeDGeneratorService();
