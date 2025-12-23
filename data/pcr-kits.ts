/**
 * PCR Kit Presets
 *
 * Reagent volume calculations for common PCR master mixes
 */

import { PCRKitPreset } from '../types/pcr';

/**
 * NEB Q5 High-Fidelity DNA Polymerase
 *
 * Source: NEB Q5 High-Fidelity DNA Polymerase Protocol (M0491)
 * https://www.neb.com/products/m0491-q5-high-fidelity-dna-polymerase
 *
 * Standard 50 µL Reaction:
 * - 5X Q5 Reaction Buffer: 10 µL (1X final)
 * - 10 mM dNTPs: 1 µL (200 µM final)
 * - 10 µM Forward Primer: 2.5 µL (0.5 µM final)
 * - 10 µM Reverse Primer: 2.5 µL (0.5 µM final)
 * - Template DNA: variable
 * - Q5 High-Fidelity DNA Polymerase: 0.5 µL
 * - Nuclease-Free Water: to 50 µL
 *
 * Optional: 5X Q5 High GC Enhancer (for GC-rich templates >65% GC)
 * - Replaces water, adds 10 µL (1X final)
 */
export const NEB_Q5_HiFi: PCRKitPreset = {
  id: 'neb-q5-hifi',
  name: 'NEB Q5 High-Fidelity',
  manufacturer: 'New England Biolabs',
  description: 'High-fidelity PCR enzyme with 3\'→5\' exonuclease activity for amplification of complex or GC-rich templates.',
  defaultReactionVolume: 50,
  supportsEnhancer: true,
  reagents: [
    {
      name: '5X Q5 Reaction Buffer',
      stockConcentration: '5X',
      finalConcentration: '1X',
      volumePerReaction: 10 // 50 µL × (1/5) = 10 µL
    },
    {
      name: '10 mM dNTPs',
      stockConcentration: '10 mM',
      finalConcentration: '200 µM',
      volumePerReaction: 1 // (200 µM / 10000 µM) × 50 µL = 1 µL
    },
    {
      name: '10 µM Forward Primer',
      stockConcentration: '10 µM',
      finalConcentration: '0.5 µM',
      volumePerReaction: 2.5 // (0.5 µM / 10 µM) × 50 µL = 2.5 µL
    },
    {
      name: '10 µM Reverse Primer',
      stockConcentration: '10 µM',
      finalConcentration: '0.5 µM',
      volumePerReaction: 2.5
    },
    {
      name: 'Template DNA',
      stockConcentration: 'variable',
      finalConcentration: '<1000 ng',
      volumePerReaction: 2 // Typical: 1-2 µL, user adjustable
    },
    {
      name: 'Q5 DNA Polymerase',
      stockConcentration: '2 U/µL',
      finalConcentration: '0.02 U/µL',
      volumePerReaction: 0.5 // 0.5 µL × 2 U/µL = 1 unit
    }
  ],
  enhancer: {
    name: '5X Q5 High GC Enhancer',
    stockConcentration: '5X',
    finalConcentration: '1X',
    volumePerReaction: 10 // Replaces 10 µL of water
  },
  notes: [
    'Use Q5 High GC Enhancer for templates with >65% GC content',
    'Typical annealing temperature: Tm + 3°C',
    'Extension time: 20-30 sec/kb',
    'Template: 1 pg - 1 µg (plasmid), 1 ng - 1 µg (genomic DNA)',
    'Add template and polymerase last to prevent degradation'
  ]
};

/**
 * Taq Polymerase (Standard)
 *
 * Generic Taq polymerase for routine PCR applications
 *
 * Standard 50 µL Reaction:
 * - 10X Taq Buffer: 5 µL (1X final)
 * - 25 mM MgCl2: 3 µL (1.5 mM final)
 * - 10 mM dNTPs: 1 µL (200 µM final)
 * - 10 µM Forward Primer: 2.5 µL (0.5 µM final)
 * - 10 µM Reverse Primer: 2.5 µL (0.5 µM final)
 * - Template DNA: variable
 * - Taq DNA Polymerase: 0.25 µL (5 U/µL = 1.25 units)
 * - Nuclease-Free Water: to 50 µL
 */
export const Taq_Standard: PCRKitPreset = {
  id: 'taq-standard',
  name: 'Taq Polymerase (Standard)',
  manufacturer: 'Generic',
  description: 'Standard Taq polymerase for routine PCR amplification of targets up to 5 kb.',
  defaultReactionVolume: 50,
  supportsEnhancer: false,
  reagents: [
    {
      name: '10X Taq Buffer',
      stockConcentration: '10X',
      finalConcentration: '1X',
      volumePerReaction: 5 // 50 µL × (1/10) = 5 µL
    },
    {
      name: '25 mM MgCl2',
      stockConcentration: '25 mM',
      finalConcentration: '1.5 mM',
      volumePerReaction: 3 // (1.5 mM / 25 mM) × 50 µL = 3 µL
    },
    {
      name: '10 mM dNTPs',
      stockConcentration: '10 mM',
      finalConcentration: '200 µM',
      volumePerReaction: 1
    },
    {
      name: '10 µM Forward Primer',
      stockConcentration: '10 µM',
      finalConcentration: '0.5 µM',
      volumePerReaction: 2.5
    },
    {
      name: '10 µM Reverse Primer',
      stockConcentration: '10 µM',
      finalConcentration: '0.5 µM',
      volumePerReaction: 2.5
    },
    {
      name: 'Template DNA',
      stockConcentration: 'variable',
      finalConcentration: '10-100 ng',
      volumePerReaction: 2
    },
    {
      name: 'Taq DNA Polymerase',
      stockConcentration: '5 U/µL',
      finalConcentration: '0.025 U/µL',
      volumePerReaction: 0.25 // 0.25 µL × 5 U/µL = 1.25 units
    }
  ],
  notes: [
    'Standard Taq lacks 3\'→5\' exonuclease (proofreading) activity',
    'Typical annealing temperature: Tm - 5°C',
    'Extension time: 1 min/kb',
    'Optimal for targets <5 kb',
    'Add polymerase last to prevent degradation'
  ]
};

/**
 * All available PCR kit presets
 */
export const PCR_KIT_PRESETS: PCRKitPreset[] = [
  NEB_Q5_HiFi,
  Taq_Standard
];

/**
 * Get a PCR kit preset by ID
 */
export function getPCRKitById(id: string): PCRKitPreset | undefined {
  return PCR_KIT_PRESETS.find(kit => kit.id === id);
}
