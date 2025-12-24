import React, { useState, useMemo } from 'react';
import { Beaker, Info } from 'lucide-react';
import { PCR_KIT_PRESETS } from '../../data/pcr-kits';
import { MasterMixCalculation, PCRKitPreset } from '../../types/pcr';

export const MasterMix: React.FC = () => {
  const [selectedKitId, setSelectedKitId] = useState(PCR_KIT_PRESETS[0].id);
  const [reactionVolume, setReactionVolume] = useState(50);
  const [sampleCount, setSampleCount] = useState(1);
  const [overfillEnabled, setOverfillEnabled] = useState(true);
  const [enhancerEnabled, setEnhancerEnabled] = useState(false);

  const kit = useMemo(() => {
    return PCR_KIT_PRESETS.find(k => k.id === selectedKitId) || PCR_KIT_PRESETS[0];
  }, [selectedKitId]);

  // Calculate master mix volumes
  const calculation = useMemo((): MasterMixCalculation => {
    const effectiveSampleCount = overfillEnabled ? Math.ceil(sampleCount * 1.1) : sampleCount;
    const scaleFactor = reactionVolume / kit.defaultReactionVolume;

    // Calculate reagent volumes
    const reagentVolumes = kit.reagents.map(reagent => {
      const volumePerReaction = (reagent.volumePerReaction || 0) * scaleFactor;
      const totalVolume = volumePerReaction * effectiveSampleCount;
      return {
        name: reagent.name,
        volumePerReaction,
        totalVolume
      };
    });

    // Add enhancer if enabled
    if (enhancerEnabled && kit.enhancer) {
      const volumePerReaction = (kit.enhancer.volumePerReaction || 0) * scaleFactor;
      const totalVolume = volumePerReaction * effectiveSampleCount;
      reagentVolumes.push({
        name: kit.enhancer.name,
        volumePerReaction,
        totalVolume
      });
    }

    // Calculate water volume
    const totalReagentVolume = reagentVolumes.reduce((sum, r) => sum + r.volumePerReaction, 0);
    const waterVolume = Math.max(0, reactionVolume - totalReagentVolume);
    const totalWaterVolume = waterVolume * effectiveSampleCount;

    return {
      reactionVolume,
      sampleCount,
      effectiveSampleCount,
      overfillEnabled,
      enhancerEnabled,
      reagentVolumes,
      waterVolume,
      totalWaterVolume
    };
  }, [reactionVolume, sampleCount, overfillEnabled, enhancerEnabled, kit]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Single Consolidated Card */}
      <div className="glass-card rounded-[var(--md-radius-lg)] border border-[var(--md-outline-variant)]">
        {/* Header with Icon and Title */}
        <div className="bg-[var(--md-surface-container)] px-6 py-5 rounded-t-[var(--md-radius-lg)] border-b border-[var(--md-outline-variant)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Beaker className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--md-on-surface)]">Master Mix Calculator</h1>
              <p className="text-sm text-[var(--md-on-surface-variant)]">{kit.name} - {kit.manufacturer}</p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Kit Selector Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--md-on-surface)]">PCR Kit</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--md-on-surface)]">
                Select Kit
              </label>
              <select
                value={selectedKitId}
                onChange={(e) => setSelectedKitId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[var(--md-on-surface)]"
              >
                {PCR_KIT_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.manufacturer})
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--md-on-surface-variant)]">{kit.description}</p>
            </div>
          </div>

          {/* Reaction Parameters Section */}
          <div className="space-y-6 pt-2 border-t border-[var(--md-outline-variant)]">
            <h3 className="font-semibold text-[var(--md-on-surface)]">Reaction Parameters</h3>

            <div className="grid md:grid-cols-2 gap-6">
          {/* Reaction Volume */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--md-on-surface)]">
              Reaction Volume (µL)
            </label>
            <input
              type="number"
              value={reactionVolume}
              onChange={(e) => setReactionVolume(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[var(--md-on-surface)]"
              min="1"
              step="1"
            />
            <p className="text-xs text-[var(--md-on-surface-variant)]">Standard: 50 µL, Miniaturized: 20-25 µL</p>
          </div>

          {/* Sample Count */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--md-on-surface)]">
              Sample Count
            </label>
            <input
              type="number"
              value={sampleCount}
              onChange={(e) => setSampleCount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[var(--md-on-surface)]"
              min="1"
              step="1"
            />
            <p className="text-xs text-[var(--md-on-surface-variant)]">
              {overfillEnabled && `+10% overfill: ${calculation.effectiveSampleCount} reactions`}
            </p>
          </div>
        </div>

            {/* Toggles */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Overfill Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overfillEnabled}
                  onChange={(e) => setOverfillEnabled(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-[var(--md-outline)] bg-[var(--md-surface-container)] checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                />
                <span className="text-sm font-medium text-[var(--md-on-surface)]">Add 10% Overfill</span>
              </label>

              {/* Enhancer Toggle */}
              {kit.supportsEnhancer && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enhancerEnabled}
                    onChange={(e) => setEnhancerEnabled(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-[var(--md-outline)] bg-[var(--md-surface-container)] checked:bg-purple-600 checked:border-purple-600 focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-[var(--md-on-surface)]">Add GC Enhancer</span>
                </label>
              )}
            </div>
          </div>

          {/* Master Mix Composition Section */}
          <div className="space-y-4 pt-2 border-t border-[var(--md-outline-variant)]">
            <h3 className="font-semibold text-[var(--md-on-surface)]">Master Mix Composition</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--md-outline-variant)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--md-on-surface)]">Reagent</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--md-on-surface)]">Stock</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--md-on-surface)]">Final</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--md-on-surface)]">
                  Per Rxn (µL)
                </th>
                <th className="text-right py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                  Total (µL)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Reagents */}
              {calculation.reagentVolumes.map((reagent, index) => {
                const reagentData = kit.reagents.find(r => r.name === reagent.name) ||
                  (enhancerEnabled && kit.enhancer?.name === reagent.name ? kit.enhancer : null);

                return (
                  <tr
                    key={index}
                    className="border-b border-[var(--md-outline-variant)] hover:bg-[var(--md-surface-container)] transition-colors"
                  >
                    <td className="py-3 px-4 text-[var(--md-on-surface)]">{reagent.name}</td>
                    <td className="py-3 px-4 text-right text-[var(--md-on-surface-variant)] font-mono text-xs">
                      {reagentData?.stockConcentration}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--md-on-surface-variant)] font-mono text-xs">
                      {reagentData?.finalConcentration}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--md-on-surface)] font-mono">
                      {reagent.volumePerReaction.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-mono font-semibold">
                      {reagent.totalVolume.toFixed(1)}
                    </td>
                  </tr>
                );
              })}

              {/* Water */}
              <tr className="border-b border-[var(--md-outline-variant)] hover:bg-[var(--md-surface-container)] transition-colors">
                <td className="py-3 px-4 text-[var(--md-on-surface)]">Nuclease-Free Water</td>
                <td className="py-3 px-4 text-right text-[var(--md-on-surface-variant)] font-mono text-xs">—</td>
                <td className="py-3 px-4 text-right text-[var(--md-on-surface-variant)] font-mono text-xs">—</td>
                <td className="py-3 px-4 text-right text-[var(--md-on-surface)] font-mono">
                  {calculation.waterVolume.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-mono font-semibold">
                  {calculation.totalWaterVolume.toFixed(1)}
                </td>
              </tr>

              {/* Total */}
              <tr className="bg-[var(--md-surface-container)] font-semibold">
                <td className="py-3 px-4 text-[var(--md-on-surface)]">Total</td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-right text-[var(--md-on-surface)] font-mono">
                  {calculation.reactionVolume.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 font-mono font-bold">
                  {(calculation.reactionVolume * calculation.effectiveSampleCount).toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
            </div>

            {/* Summary Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <p>
                    <span className="font-semibold">Preparing master mix for {calculation.effectiveSampleCount} reactions</span>
                    {overfillEnabled && ` (${sampleCount} samples + 10% overfill)`}
                  </p>
                  <p>Mix all components except template DNA and polymerase. Aliquot {calculation.reactionVolume - 2} µL into PCR tubes, then add template and enzyme.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Protocol Notes Section */}
          {kit.notes && kit.notes.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[var(--md-outline-variant)]">
              <h4 className="text-xs uppercase tracking-wider text-[var(--md-on-surface-variant)] font-bold">Protocol Notes</h4>
              <ul className="text-xs text-[var(--md-on-surface-variant)] space-y-1">
                {kit.notes.map((note, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-[var(--md-outline)]">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
