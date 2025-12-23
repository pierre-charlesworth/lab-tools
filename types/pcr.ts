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

/**
 * PCR Protocol Step - Single temperature stage
 */
export interface PCRStep {
  name: string; // e.g., "Initial Denaturation", "Denature", "Anneal", "Extend", "Final Extension"
  temperature: number; // °C
  duration: number; // seconds
}

/**
 * PCR Protocol - Complete thermocycler program
 */
export interface PCRProtocol {
  id: string;
  name: string;
  description?: string;
  initialDenaturation: PCRStep; // e.g., 98°C for 30s
  cycles: number; // Number of cycles to repeat
  cycleSteps: {
    denature: PCRStep; // e.g., 98°C for 10s
    anneal: PCRStep; // e.g., 60°C for 20s
    extend: PCRStep; // e.g., 72°C for 30s/kb
  };
  finalExtension: PCRStep; // e.g., 72°C for 2min
  hold: PCRStep; // e.g., 4°C forever
  rampRate: number; // °C/second (default: 3)
}
