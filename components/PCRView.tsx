import React from 'react';
import { PrimerAnalyst } from './pcr/PrimerAnalyst';
import { MasterMix } from './pcr/MasterMix';
import { VisualCycler } from './pcr/VisualCycler';

/**
 * PCRView - Main container for the PCR module
 *
 * Includes:
 * - Primer Analyst: Tm calculation and primer pair validation
 * - Master Mix Calculator: PCR reagent volume calculations
 * - Thermocycler Visualizer: Visual PCR protocol with playback animation
 */
export const PCRView: React.FC = () => {
  return (
    <div className="w-full min-h-screen space-y-8">
      <PrimerAnalyst />

      {/* Divider */}
      <div className="w-full border-t border-[var(--md-outline-variant)]"></div>

      <MasterMix />

      {/* Divider */}
      <div className="w-full border-t border-[var(--md-outline-variant)]"></div>

      <VisualCycler />
    </div>
  );
};
