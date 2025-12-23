/**
 * PCR Math Utilities
 *
 * Implements primer analysis functions including:
 * - Tm calculation using Nearest-Neighbor method (SantaLucia 1998)
 * - GC content checking
 * - 3' clamp validation
 */

// Nearest-Neighbor thermodynamic parameters (SantaLucia 1998)
// ΔH (kcal/mol) and ΔS (cal/mol·K) for DNA/DNA duplexes
const NN_PARAMS: Record<string, { dH: number; dS: number }> = {
  'AA': { dH: -7.9, dS: -22.2 },
  'TT': { dH: -7.9, dS: -22.2 },
  'AT': { dH: -7.2, dS: -20.4 },
  'TA': { dH: -7.2, dS: -21.3 },
  'CA': { dH: -8.5, dS: -22.7 },
  'TG': { dH: -8.5, dS: -22.7 },
  'GT': { dH: -8.4, dS: -22.4 },
  'AC': { dH: -8.4, dS: -22.4 },
  'CT': { dH: -7.8, dS: -21.0 },
  'AG': { dH: -7.8, dS: -21.0 },
  'GA': { dH: -8.2, dS: -22.2 },
  'TC': { dH: -8.2, dS: -22.2 },
  'CG': { dH: -10.6, dS: -27.2 },
  'GC': { dH: -9.8, dS: -24.4 },
  'GG': { dH: -8.0, dS: -19.9 },
  'CC': { dH: -8.0, dS: -19.9 }
};

// Initiation parameters
const INIT_DH = 0.2; // kcal/mol
const INIT_DS = -5.7; // cal/mol·K

// Terminal AT penalty
const TERMINAL_AT_DH = 2.2; // kcal/mol
const TERMINAL_AT_DS = 6.9; // cal/mol·K

// Gas constant
const R = 1.987; // cal/mol·K

export interface TmResult {
  tm: number; // Melting temperature in °C
  gcContent: number; // GC percentage (0-100)
  length: number; // Primer length
  isValid: boolean;
  error?: string;
}

export interface GCCheckResult {
  gcContent: number; // GC percentage (0-100)
  status: 'ok' | 'warning' | 'error';
  message: string;
}

export interface ClampCheckResult {
  has3PrimeClamp: boolean;
  clampType: 'G/C' | 'none';
  status: 'ok' | 'warning';
  message: string;
}

/**
 * Calculate melting temperature using Nearest-Neighbor method (SantaLucia 1998)
 *
 * @param sequence - DNA sequence (5' to 3')
 * @param saltConc - Salt concentration in mM (default: 50 mM)
 * @param primerConc - Primer concentration in nM (default: 250 nM)
 * @returns TmResult object with Tm and additional info
 */
export function calculateTm(
  sequence: string,
  saltConc: number = 50,
  primerConc: number = 250
): TmResult {
  // Normalize sequence
  const seq = sequence.toUpperCase().trim();

  // Validation
  if (!seq) {
    return {
      tm: 0,
      gcContent: 0,
      length: 0,
      isValid: false,
      error: 'Empty sequence'
    };
  }

  // Check for valid DNA bases
  if (!/^[ATGC]+$/.test(seq)) {
    return {
      tm: 0,
      gcContent: 0,
      length: seq.length,
      isValid: false,
      error: 'Invalid bases (only A, T, G, C allowed)'
    };
  }

  // Minimum length check
  if (seq.length < 15) {
    return {
      tm: 0,
      gcContent: calculateGCContent(seq),
      length: seq.length,
      isValid: false,
      error: 'Primer too short (min 15 bp)'
    };
  }

  // Maximum length check
  if (seq.length > 35) {
    return {
      tm: 0,
      gcContent: calculateGCContent(seq),
      length: seq.length,
      isValid: false,
      error: 'Primer too long (max 35 bp)'
    };
  }

  // Calculate ΔH and ΔS using nearest-neighbor method
  let deltaH = INIT_DH;
  let deltaS = INIT_DS;

  // Sum nearest-neighbor contributions
  for (let i = 0; i < seq.length - 1; i++) {
    const dinucleotide = seq.substring(i, i + 2);
    const params = NN_PARAMS[dinucleotide];

    if (params) {
      deltaH += params.dH;
      deltaS += params.dS;
    }
  }

  // Terminal AT penalty
  const firstBase = seq[0];
  const lastBase = seq[seq.length - 1];

  if (firstBase === 'A' || firstBase === 'T') {
    deltaH += TERMINAL_AT_DH;
    deltaS += TERMINAL_AT_DS;
  }

  if (lastBase === 'A' || lastBase === 'T') {
    deltaH += TERMINAL_AT_DH;
    deltaS += TERMINAL_AT_DS;
  }

  // Salt correction (von Ahsen et al. 2001)
  const saltCorrectedDS = deltaS + 0.368 * (seq.length - 1) * Math.log(saltConc / 1000);

  // Calculate Tm
  // Tm = (ΔH * 1000) / (ΔS + R * ln(primerConc / 4000000000)) - 273.15
  // Note: primerConc converted from nM to M (divide by 1e9)
  const primerConcM = primerConc / 1e9;
  const tm = (deltaH * 1000) / (saltCorrectedDS + R * Math.log(primerConcM / 4)) - 273.15;

  return {
    tm: Math.round(tm * 10) / 10, // Round to 1 decimal
    gcContent: calculateGCContent(seq),
    length: seq.length,
    isValid: true
  };
}

/**
 * Calculate GC content percentage
 *
 * @param sequence - DNA sequence
 * @returns GC percentage (0-100)
 */
function calculateGCContent(sequence: string): number {
  const seq = sequence.toUpperCase();
  const gcCount = (seq.match(/[GC]/g) || []).length;
  return Math.round((gcCount / seq.length) * 1000) / 10; // Round to 1 decimal
}

/**
 * Check GC content and return status
 *
 * Ideal range: 40-60%
 * Acceptable range: 30-70%
 *
 * @param sequence - DNA sequence
 * @returns GCCheckResult with status and message
 */
export function checkGCContent(sequence: string): GCCheckResult {
  const gcContent = calculateGCContent(sequence);

  if (gcContent >= 40 && gcContent <= 60) {
    return {
      gcContent,
      status: 'ok',
      message: 'Optimal GC content'
    };
  } else if (gcContent >= 30 && gcContent <= 70) {
    return {
      gcContent,
      status: 'warning',
      message: gcContent < 40 ? 'GC content slightly low' : 'GC content slightly high'
    };
  } else {
    return {
      gcContent,
      status: 'error',
      message: gcContent < 30 ? 'GC content too low' : 'GC content too high'
    };
  }
}

/**
 * Check for 3' GC clamp (last 5 bases should have 2-3 G or C)
 *
 * @param sequence - DNA sequence (5' to 3')
 * @returns ClampCheckResult with status and message
 */
export function check3PrimeClamp(sequence: string): ClampCheckResult {
  const seq = sequence.toUpperCase().trim();

  if (seq.length < 5) {
    return {
      has3PrimeClamp: false,
      clampType: 'none',
      status: 'warning',
      message: 'Sequence too short for clamp check'
    };
  }

  // Get last 5 bases (3' end)
  const last5 = seq.slice(-5);
  const gcCount = (last5.match(/[GC]/g) || []).length;

  // Last base should be G or C
  const lastBase = seq[seq.length - 1];
  const hasTerminalGC = lastBase === 'G' || lastBase === 'C';

  if (hasTerminalGC && gcCount >= 2 && gcCount <= 3) {
    return {
      has3PrimeClamp: true,
      clampType: 'G/C',
      status: 'ok',
      message: `Good 3' clamp (${gcCount} G/C in last 5 bases)`
    };
  } else if (hasTerminalGC && gcCount >= 1) {
    return {
      has3PrimeClamp: true,
      clampType: 'G/C',
      status: 'ok',
      message: `Weak 3' clamp (${gcCount} G/C in last 5 bases)`
    };
  } else {
    return {
      has3PrimeClamp: false,
      clampType: 'none',
      status: 'warning',
      message: 'No 3\' GC clamp - may reduce specificity'
    };
  }
}

/**
 * Analyze primer pair compatibility
 *
 * @param forward - Forward primer sequence
 * @param reverse - Reverse primer sequence
 * @returns Compatibility analysis with warnings
 */
export function analyzePrimerPair(forward: string, reverse: string): {
  tmDifference: number;
  status: 'ok' | 'warning' | 'error';
  message: string;
} {
  const fwdTm = calculateTm(forward);
  const revTm = calculateTm(reverse);

  if (!fwdTm.isValid || !revTm.isValid) {
    return {
      tmDifference: 0,
      status: 'error',
      message: 'Invalid primer sequences'
    };
  }

  const tmDiff = Math.abs(fwdTm.tm - revTm.tm);

  if (tmDiff <= 2) {
    return {
      tmDifference: tmDiff,
      status: 'ok',
      message: 'Excellent Tm match'
    };
  } else if (tmDiff <= 5) {
    return {
      tmDifference: tmDiff,
      status: 'warning',
      message: 'Acceptable Tm difference'
    };
  } else {
    return {
      tmDifference: tmDiff,
      status: 'error',
      message: `Tm mismatch too high (${tmDiff.toFixed(1)}°C)`
    };
  }
}
