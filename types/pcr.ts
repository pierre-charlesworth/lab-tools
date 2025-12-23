/**
 * PCR-specific type definitions
 */

export interface PCRReagent {
  name: string;
  stockConcentration: string; // e.g., "5X", "10 mM", "2X"
  finalConcentration: string; // e.g., "1X", "2 mM", "0.5X"
  volumePerReaction?: number; // µL per reaction (calculated)
}

export interface PCRKitPreset {
  id: string;
  name: string;
  manufacturer: string;
  description?: string;
  reagents: PCRReagent[];
  defaultReactionVolume: number; // µL
  supportsEnhancer: boolean;
  enhancer?: PCRReagent; // Optional GC enhancer
  notes?: string[];
}

export interface MasterMixCalculation {
  reactionVolume: number; // µL
  sampleCount: number;
  effectiveSampleCount: number; // With overfill
  overfillEnabled: boolean;
  enhancerEnabled: boolean;
  reagentVolumes: {
    name: string;
    volumePerReaction: number; // µL
    totalVolume: number; // µL (volumePerReaction × effectiveSampleCount)
  }[];
  waterVolume: number; // µL per reaction
  totalWaterVolume: number; // µL (waterVolume × effectiveSampleCount)
}
