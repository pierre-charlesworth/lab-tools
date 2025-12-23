import React from 'react';
import { PrimerAnalyst } from './pcr/PrimerAnalyst';
import { MasterMix } from './pcr/MasterMix';

/**
 * PCRView - Main container for the PCR module
 *
 * Includes:
 * - Primer Analyst: Tm calculation and primer pair validation
 * - Master Mix Calculator: PCR reagent volume calculations
 *
 * Future expansion: Tm Calculator, Thermocycler Visualizer
 */
export const PCRView: React.FC = () => {
  return (
    <div className="w-full min-h-screen space-y-8">
      <PrimerAnalyst />

      {/* Divider */}
      <div className="w-full border-t border-[var(--md-outline-variant)]"></div>

      <MasterMix />
    </div>
  );
};
