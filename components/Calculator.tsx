
import React, { useMemo } from 'react';
import { Experiment, CalculationResult, GrowthDataPoint } from '../types';
import { FlaskConical, Clock, Droplets, AlertCircle, Play, RotateCcw, Timer, Info, Hourglass, HelpCircle, Syringe, Ruler, Minimize2 } from 'lucide-react';
import { GrowthChart } from './GrowthChart';
import { calculateResults, calculateTracking, generateChartData } from '../utils/calculations';

interface CalculatorProps {
  experiment: Experiment;
  onUpdate: (updates: Partial<Experiment>) => void;
  isDarkMode: boolean;
  currentTime: Date;
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group/tooltip relative inline-flex items-center justify-center align-middle normal-case z-50">
    <div className="cursor-help text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] transition-colors p-1.5 -m-1.5 rounded-full hover:bg-[var(--md-surface-container)]">
      <HelpCircle className="w-4 h-4" />
    </div>
    <div className="
      absolute bottom-full right-0 mb-2 w-48
      px-3 py-2
      bg-[var(--md-on-surface)] dark:bg-[var(--md-surface-container-highest)]
      text-[var(--md-surface)] dark:text-[var(--md-on-surface)]
      text-xs font-normal tracking-wide leading-5
      rounded-[var(--md-radius)] shadow-[var(--md-shadow-md)]
      opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible
      transition-all duration-200 ease-out transform scale-95 group-hover/tooltip:scale-100 origin-bottom-right
      pointer-events-none text-left z-50
    ">
      {text}
    </div>
  </div>
);

// M3 Compliant Outlined Text Field
const M3TextField: React.FC<{
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  disabled?: boolean;
  type?: string;
  inputMode?: "text" | "decimal" | "numeric";
  step?: string;
  suffix?: string;
  tooltip?: string;
  icon?: React.ElementType;
}> = ({ label, value, onChange, disabled, type = "number", inputMode = "decimal", step, suffix, tooltip, icon: Icon }) => {
  return (
    <div className="relative hover:z-30 transition-z duration-0">
      <input
        type={type}
        inputMode={inputMode}
        step={step}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" " /* Required for peer-placeholder-shown */
        className={`
          peer block w-full h-14 rounded-[var(--md-radius)] border bg-transparent px-4 py-2.5
          text-base font-mono text-[var(--md-on-surface)]
          border-[var(--md-outline)]
          focus:border-[var(--md-primary)] focus:ring-1 focus:ring-[var(--md-primary)] focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--md-surface-container)]
          placeholder-transparent
          transition-colors duration-200
          appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]
          ${Icon ? 'pl-11' : ''}
          ${suffix || tooltip ? 'pr-12' : ''}
        `}
      />
      
      {/* Floating Label */}
      <label className={`
        absolute left-3 top-0 -translate-y-1/2 px-1 text-xs text-[var(--md-on-surface-variant)] transition-all duration-200
        bg-[var(--md-surface)]
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[var(--md-on-surface-variant)]
        peer-focus:top-0 peer-focus:text-xs peer-focus:text-[var(--md-primary)]
        peer-disabled:opacity-50
        ${Icon ? 'peer-placeholder-shown:left-11' : ''}
        pointer-events-none select-none truncate max-w-[calc(100%-2rem)]
      `}>
        {label}
      </label>

      {/* Leading Icon */}
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-on-surface-variant)] pointer-events-none peer-focus:text-[var(--md-primary)] transition-colors duration-200">
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Trailing Suffix / Tooltip */}
      {(suffix || tooltip) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
           {suffix && <span className="text-[var(--md-on-surface-variant)] text-sm font-medium pointer-events-none">{suffix}</span>}
           {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      )}
    </div>
  );
};

export const Calculator: React.FC<CalculatorProps> = ({ experiment, onUpdate, isDarkMode, currentTime }) => {
  
  const handleChange = (field: keyof Experiment, value: string | 'total_volume' | 'fixed_media') => {
    onUpdate({ [field]: value });
  };

  const handleStartTracking = () => {
    onUpdate({ trackingStartTime: new Date().getTime() });
  };

  const handleResetTracking = () => {
    onUpdate({ trackingStartTime: null });
  };

  // Helper to format volume
  const formatVolume = (volInMl: number) => {
    if (volInMl < 1) {
      return { 
        value: (volInMl * 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }), 
        unit: 'µL',
        isMicroliter: true
      };
    }
    return { 
      value: volInMl.toLocaleString(undefined, { maximumFractionDigits: 2 }), 
      unit: 'mL',
      isMicroliter: false
    };
  };

  const results = useMemo(() => 
    calculateResults(experiment, experiment.trackingStartTime, currentTime), 
    [experiment, currentTime]
  );

  const trackingStatus = useMemo(() => 
    calculateTracking(experiment, experiment.trackingStartTime, currentTime, results),
    [experiment, currentTime, results]
  );

  const { data: chartData, stationaryStart: stationaryPhaseStartTime } = useMemo(() => 
    generateChartData(experiment, results, trackingStatus),
    [experiment, results, trackingStatus]
  );

  const inocVol = formatVolume(results.inoculumVolume);
  const mediaVol = formatVolume(results.mediaVolume);
  const totalVol = formatVolume(results.mediaVolume + results.inoculumVolume);
  const lagTimeVal = parseFloat(String(experiment.lagTime)) || 0;
  
  const isTracking = !!experiment.trackingStartTime;

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* INPUT CARD */}
        <div className="glass-card rounded-[var(--md-radius-lg)] transition-colors duration-300 relative">
          <div className={`
            bg-[var(--md-surface-container)] px-6 py-5
            rounded-t-[var(--md-radius-lg)]
            ${isTracking ? 'rounded-b-[var(--md-radius-lg)] border-b-0 md:rounded-b-none md:border-b' : 'border-b'}
            border-[var(--md-outline-variant)]
            flex items-center justify-between transition-all duration-300
          `}>
            <div className="flex items-center gap-3">
              <FlaskConical className="text-[var(--md-primary)] w-5 h-5" />
              <h2 className="text-lg font-semibold font-sans tracking-wide text-[var(--md-on-surface)]">Parameters</h2>
            </div>
            {/* Input Name field - Custom style for Header */}
            <input
              type="text"
              value={experiment.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-transparent text-right text-sm font-medium text-[var(--md-on-surface-variant)] focus:text-[var(--md-on-surface)] outline-none border-b border-transparent focus:border-[var(--md-primary)] transition-all w-32 placeholder-[var(--md-on-surface-variant)]"
              placeholder="Exp Name"
              aria-label="Experiment Name"
            />
          </div>
          
          <div className={`p-6 space-y-8 ${isTracking ? 'hidden md:block' : ''}`}>
            {/* Dilution Section */}
            <div className="space-y-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-[var(--md-on-surface-variant)] uppercase tracking-widest flex items-center">
                  Dilution Setup
                </h3>
              </div>

              {/* Mode Toggle */}
              <div className="p-1 bg-[var(--md-surface-container)] rounded-[var(--md-radius)] border border-[var(--md-outline-variant)] flex relative mb-6">
                <button
                  className={`flex-1 py-2 text-xs font-medium rounded-[var(--md-radius)] transition-all duration-200 z-10 ${
                    experiment.calculationMode === 'total_volume'
                    ? 'bg-[var(--md-surface)] text-[var(--md-on-surface)] shadow-[var(--md-shadow-sm)]'
                    : 'text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]'
                  }`}
                  onClick={() => handleChange('calculationMode', 'total_volume')}
                  disabled={!!experiment.trackingStartTime}
                >
                  Target Total Vol
                </button>
                <button
                   className={`flex-1 py-2 text-xs font-medium rounded-[var(--md-radius)] transition-all duration-200 z-10 ${
                     experiment.calculationMode === 'fixed_media'
                     ? 'bg-[var(--md-surface)] text-[var(--md-on-surface)] shadow-[var(--md-shadow-sm)]'
                     : 'text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)]'
                   }`}
                   onClick={() => handleChange('calculationMode', 'fixed_media')}
                   disabled={!!experiment.trackingStartTime}
                >
                  Add to Media
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <M3TextField
                  label="Inoculum OD₆₀₀"
                  value={experiment.inoculumOD}
                  onChange={(val) => handleChange('inoculumOD', val)}
                  disabled={!!experiment.trackingStartTime}
                  tooltip="Optical Density (OD600) of your overnight or starter culture."
                  icon={Syringe}
                />
                
                <M3TextField
                  label={experiment.calculationMode === 'total_volume' ? 'Target Vol' : 'Media Vol'}
                  value={experiment.targetVolume}
                  onChange={(val) => handleChange('targetVolume', val)}
                  disabled={!!experiment.trackingStartTime}
                  suffix="mL"
                  icon={Ruler}
                />
              </div>

              <M3TextField
                label="Start OD₆₀₀"
                value={experiment.targetStartOD}
                onChange={(val) => handleChange('targetStartOD', val)}
                disabled={!!experiment.trackingStartTime}
                step="0.01"
                tooltip="The target OD600 immediately after mixing media and inoculum."
                icon={Minimize2}
              />
            </div>

            <div className="border-t border-[var(--md-outline-variant)] pt-8 space-y-5 transition-colors duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-[var(--md-on-surface-variant)] uppercase tracking-widest flex items-center">
                   Growth Prediction
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <M3TextField
                  label="Harvest OD"
                  value={experiment.targetHarvestOD}
                  onChange={(val) => handleChange('targetHarvestOD', val)}
                  disabled={!!experiment.trackingStartTime}
                  step="0.1"
                  tooltip="Target OD for harvesting. Determines carrying capacity (K)."
                />
                
                <M3TextField
                  label="Doubling Time"
                  value={experiment.doublingTime}
                  onChange={(val) => handleChange('doublingTime', val)}
                  disabled={!!experiment.trackingStartTime}
                  suffix="min"
                  tooltip="Time for population to double during exponential growth."
                />
              </div>

              <M3TextField
                  label="Lag Phase"
                  value={experiment.lagTime}
                  onChange={(val) => handleChange('lagTime', val)}
                  disabled={!!experiment.trackingStartTime}
                  suffix="min"
                  icon={Hourglass}
                  tooltip="Estimated time before exponential growth begins."
              />

              <div className="flex items-start gap-3 text-sm text-[var(--md-on-surface-variant)] bg-[var(--md-surface-container)] p-4 rounded-[var(--md-radius)] border border-[var(--md-outline-variant)] transition-colors duration-300">
                 <Info className="w-4 h-4 mt-0.5 shrink-0 text-[var(--md-on-surface-variant)]" />
                 <p className="flex flex-wrap items-center gap-1 leading-relaxed">
                   Model assumes {lagTimeVal}m lag phase followed by Logistic growth (K={results.carryingCapacity.toFixed(1)}).
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS CARD */}
        <div className="space-y-6 md:space-y-8">
          <div className={`
            glass-card rounded-[var(--md-radius-lg)]
            text-[var(--md-on-surface)] relative group shadow-[var(--md-shadow-sm)] transition-colors duration-300
            ${isTracking ? 'p-4 md:p-6' : 'p-6'}
          `}>

             <div className="relative z-10">
               <div className={`
                 flex items-center gap-2 text-[var(--md-primary)]
                 ${isTracking ? 'mb-0 md:mb-8' : 'mb-8'}
               `}>
                 <Droplets className="w-5 h-5" />
                 <h2 className="text-lg font-semibold font-sans tracking-wide text-[var(--md-on-surface)]">Protocol Recipe</h2>
               </div>
               
               <div className={isTracking ? 'hidden md:block' : ''}>
                {results.isValid && !results.error ? (
                  <div className="space-y-8">
                      {/* Media Display - Swapped for Fixed Media Mode */}
                      <div className="flex items-end justify-between border-b border-[var(--md-outline-variant)] pb-4 transition-colors duration-300">
                        <span className="text-[var(--md-on-surface-variant)] text-sm font-medium">
                          {experiment.calculationMode === 'fixed_media' ? 'Use Base Media' : 'Add Fresh Media'}
                        </span>
                        <div className="text-right">
                          <span className="text-3xl font-medium text-[var(--md-on-surface)] font-mono tracking-tight transition-colors duration-300">
                            {mediaVol.value}
                          </span>
                          <span className="text-sm ml-1 text-[var(--md-on-surface-variant)] font-medium">{mediaVol.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <span className="text-[var(--md-on-surface-variant)] text-sm font-medium">Add Inoculum</span>
                        <div className="text-right">
                          <span className="text-4xl font-semibold text-[var(--md-primary)] font-mono tracking-tight transition-colors duration-300">
                            {inocVol.value}
                          </span>
                          <span className="text-sm ml-1 text-[var(--md-on-surface-variant)] font-medium">{inocVol.unit}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-dashed border-[var(--md-outline-variant)] flex justify-between items-center text-sm text-[var(--md-on-surface-variant)] transition-colors duration-300">
                        <span className="uppercase tracking-wider text-xs">Final Total Volume</span>
                        <span className="font-mono text-[var(--md-on-surface)]">
                          {totalVol.value} {totalVol.unit}
                        </span>
                      </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-[var(--md-on-surface-variant)]">
                      <AlertCircle className="w-6 h-6 mb-3 opacity-30" />
                      <p className="text-center text-sm tracking-wider uppercase">{results.error || "Enter valid parameters"}</p>
                  </div>
                )}
               </div>
             </div>
          </div>

          <div className="glass-card rounded-[var(--md-radius-lg)] border border-[var(--md-outline-variant)] p-6 flex flex-col justify-between h-auto min-h-[200px] shadow-[var(--md-shadow-sm)] transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-[var(--md-primary)]">
                  <Clock className="w-5 h-5" />
                  <h2 className="text-lg font-semibold font-sans tracking-wide text-[var(--md-on-surface)]">Time Course</h2>
                </div>
                {experiment.trackingStartTime && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[var(--md-primary-container)] text-[var(--md-on-primary-container)] border border-[var(--md-primary)] rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--md-primary)]"></span>
                    Running
                  </div>
                )}
              </div>

              {results.isValid && results.minutesToHarvest > 0 ? (
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-[var(--md-surface-container)] p-4 rounded-[var(--md-radius)] border border-[var(--md-outline-variant)] transition-colors duration-300">
                      <p className="text-xs text-[var(--md-on-surface-variant)] uppercase font-bold tracking-wider mb-2">
                        {experiment.trackingStartTime ? 'Total Duration' : 'Time to Harvest'}
                      </p>
                      <p className="text-2xl font-light text-[var(--md-on-surface)] font-mono">
                        {Math.floor(results.minutesToHarvest / 60)}<span className="text-base text-[var(--md-on-surface-variant)]">h</span>
                        {' '}{Math.round(results.minutesToHarvest % 60)}<span className="text-base text-[var(--md-on-surface-variant)]">m</span>
                      </p>
                    </div>
                    <div className="bg-[var(--md-surface-container)] p-4 rounded-[var(--md-radius)] border border-[var(--md-outline-variant)] transition-colors duration-300">
                      <p className="text-xs text-[var(--md-on-surface-variant)] uppercase font-bold tracking-wider mb-2">Completion</p>
                      <p className="text-2xl font-light text-[var(--md-on-surface)] font-mono">
                        {results.harvestDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-[var(--md-on-surface-variant)] mt-1 uppercase tracking-wide">
                        {results.harvestDate && results.harvestDate.getDate() !== (experiment.trackingStartTime ? new Date(experiment.trackingStartTime) : currentTime).getDate() ? 'Tomorrow' : 'Today'}
                      </p>
                    </div>
                </div>
              ) : (
                <div className="text-center text-[var(--md-on-surface-variant)] py-4 text-xs tracking-wider uppercase">
                  {results.isValid ? "Set Harvest OD > Start OD" : "Awaiting Parameters"}
                </div>
              )}
            </div>

            {/* Tracking Controls */}
            {results.isValid && results.minutesToHarvest > 0 && (
              <div className="mt-8 pt-8 border-t border-[var(--md-outline-variant)] transition-colors duration-300">
                {!experiment.trackingStartTime ? (
                  <button
                    onClick={handleStartTracking}
                    className="w-full py-4 bg-[var(--md-primary)] hover:bg-[var(--md-primary)] text-[var(--md-on-primary)] rounded-[var(--md-radius)] font-medium text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[var(--md-shadow-lg)] hover:shadow-[var(--md-shadow-xl)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Timer
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] text-[var(--md-on-surface)] p-4 rounded-[var(--md-radius)] font-mono transition-colors duration-300">
                      <div className="flex items-center gap-2 text-[var(--md-on-surface-variant)] text-xs uppercase tracking-wider">
                        <Timer className="w-3 h-3" />
                        Elapsed
                      </div>
                      <div className="text-xl text-[var(--md-primary)] tracking-tight">
                        {trackingStatus?.formattedTime}
                      </div>
                    </div>
                    <button
                      onClick={handleResetTracking}
                      className="w-full py-3 text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] hover:bg-[var(--md-surface-container)] rounded-[var(--md-radius)] font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {results.isValid && results.minutesToHarvest > 0 && (
         <GrowthChart 
           data={chartData} 
           startOD={parseFloat(String(experiment.targetStartOD))}
           targetOD={parseFloat(String(experiment.targetHarvestOD))}
           harvestPoint={{ time: results.minutesToHarvest, od: parseFloat(String(experiment.targetHarvestOD)) }}
           currentPoint={trackingStatus ? { time: trackingStatus.elapsedMinutes, od: trackingStatus.currentOD } : undefined}
           phases={{
             lagDuration: lagTimeVal,
             stationaryStart: stationaryPhaseStartTime
           }}
           isDarkMode={isDarkMode}
         />
      )}
    </div>
  );
};
