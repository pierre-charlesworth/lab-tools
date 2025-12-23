import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';
import { PCRProtocol, PCRStep } from '../../types/pcr';

/**
 * VisualCycler - PCR Thermocycler Visualizer
 *
 * Renders a Temperature vs Time graph with playback animation
 * Includes ramp rates for realistic temperature transitions
 */
export const VisualCycler: React.FC = () => {
  // Default NEB Q5 protocol
  const [protocol, setProtocol] = useState<PCRProtocol>({
    id: 'neb-q5-standard',
    name: 'NEB Q5 Standard Protocol',
    initialDenaturation: { name: 'Initial Denaturation', temperature: 98, duration: 30 },
    cycles: 35,
    cycleSteps: {
      denature: { name: 'Denature', temperature: 98, duration: 10 },
      anneal: { name: 'Anneal', temperature: 60, duration: 20 },
      extend: { name: 'Extend', temperature: 72, duration: 30 }
    },
    finalExtension: { name: 'Final Extension', temperature: 72, duration: 120 },
    hold: { name: 'Hold', temperature: 4, duration: Infinity },
    rampRate: 3 // °C/second
  });

  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>();

  // UI state
  const [isParametersExpanded, setIsParametersExpanded] = useState(false);

  // Calculate time points and temperatures for the entire protocol
  const protocolData = useMemo(() => {
    const points: { time: number; temperature: number; step: string }[] = [];
    let currentT = 0;
    let currentTemp = 25; // Room temperature start

    // Helper to add ramp
    const addRamp = (targetTemp: number, stepName: string) => {
      const deltaT = Math.abs(targetTemp - currentTemp);
      const rampTime = deltaT / protocol.rampRate;

      // Add intermediate points for smooth ramp
      const steps = Math.max(2, Math.ceil(rampTime));
      for (let i = 0; i <= steps; i++) {
        const fraction = i / steps;
        points.push({
          time: currentT + (rampTime * fraction),
          temperature: currentTemp + ((targetTemp - currentTemp) * fraction),
          step: stepName
        });
      }
      currentT += rampTime;
      currentTemp = targetTemp;
    };

    // Helper to add hold
    const addHold = (duration: number, stepName: string) => {
      points.push({ time: currentT, temperature: currentTemp, step: stepName });
      currentT += duration;
      points.push({ time: currentT, temperature: currentTemp, step: stepName });
    };

    // 1. Initial Denaturation
    addRamp(protocol.initialDenaturation.temperature, protocol.initialDenaturation.name);
    addHold(protocol.initialDenaturation.duration, protocol.initialDenaturation.name);

    // 2. Cycling (denature, anneal, extend) × N
    for (let cycle = 0; cycle < protocol.cycles; cycle++) {
      // Denature
      addRamp(protocol.cycleSteps.denature.temperature, `Cycle ${cycle + 1}: Denature`);
      addHold(protocol.cycleSteps.denature.duration, `Cycle ${cycle + 1}: Denature`);

      // Anneal
      addRamp(protocol.cycleSteps.anneal.temperature, `Cycle ${cycle + 1}: Anneal`);
      addHold(protocol.cycleSteps.anneal.duration, `Cycle ${cycle + 1}: Anneal`);

      // Extend
      addRamp(protocol.cycleSteps.extend.temperature, `Cycle ${cycle + 1}: Extend`);
      addHold(protocol.cycleSteps.extend.duration, `Cycle ${cycle + 1}: Extend`);
    }

    // 3. Final Extension
    addRamp(protocol.finalExtension.temperature, protocol.finalExtension.name);
    addHold(protocol.finalExtension.duration, protocol.finalExtension.name);

    // 4. Hold
    addRamp(protocol.hold.temperature, protocol.hold.name);
    addHold(60, protocol.hold.name); // Show 60s of hold for visualization

    return {
      points,
      totalTime: currentT,
      maxTemp: Math.max(...points.map(p => p.temperature)),
      minTemp: Math.min(...points.map(p => p.temperature))
    };
  }, [protocol]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = undefined;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimestampRef.current) / 1000; // Convert to seconds
      lastTimestampRef.current = timestamp;

      setCurrentTime(prev => {
        const next = prev + deltaTime; // Real-time speed (1x)
        if (next >= protocolData.totalTime) {
          setIsPlaying(false);
          return protocolData.totalTime;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, protocolData.totalTime]);

  // Calculate current temperature from current time
  const currentTemperature = useMemo(() => {
    if (protocolData.points.length === 0) return 25;

    // Find the two points that bracket currentTime
    for (let i = 0; i < protocolData.points.length - 1; i++) {
      const p1 = protocolData.points[i];
      const p2 = protocolData.points[i + 1];

      if (currentTime >= p1.time && currentTime <= p2.time) {
        const fraction = (currentTime - p1.time) / (p2.time - p1.time);
        return p1.temperature + (p2.temperature - p1.temperature) * fraction;
      }
    }

    return protocolData.points[protocolData.points.length - 1].temperature;
  }, [currentTime, protocolData.points]);

  const currentStep = useMemo(() => {
    for (let i = protocolData.points.length - 1; i >= 0; i--) {
      if (currentTime >= protocolData.points[i].time) {
        return protocolData.points[i].step;
      }
    }
    return 'Initializing';
  }, [currentTime, protocolData.points]);

  // SVG Graph dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Scale functions with live scrolling
  const xScale = (time: number) => {
    // When playing, show a 10-minute (600 second) window centered on current time
    // Window: [currentTime - 2min, currentTime + 8min]
    if (isPlaying) {
      const windowSize = 600; // 10 minutes in seconds
      const windowStart = Math.max(0, currentTime - 120); // 2 minutes before current
      const windowEnd = windowStart + windowSize;

      // Clamp to protocol bounds
      const actualStart = Math.max(0, windowStart);
      const actualEnd = Math.min(protocolData.totalTime, windowEnd);

      const normalizedTime = (time - actualStart) / (actualEnd - actualStart);
      return padding.left + normalizedTime * graphWidth;
    } else {
      // When paused/stopped, show full protocol
      return padding.left + (time / protocolData.totalTime) * graphWidth;
    }
  };

  const yScale = (temp: number) => {
    const range = protocolData.maxTemp - protocolData.minTemp;
    const padding_temp = range * 0.1; // 10% padding
    return height - padding.bottom - ((temp - (protocolData.minTemp - padding_temp)) / (range + 2 * padding_temp)) * graphHeight;
  };

  // Generate SVG path (with filtering for visible window when playing)
  const pathData = useMemo(() => {
    if (protocolData.points.length === 0) return '';

    let visiblePoints = protocolData.points;

    // When playing, only show points within the visible window
    if (isPlaying) {
      const windowSize = 600; // 10 minutes
      const windowStart = Math.max(0, currentTime - 120);
      const windowEnd = windowStart + windowSize;

      visiblePoints = protocolData.points.filter(p =>
        p.time >= windowStart && p.time <= windowEnd
      );

      if (visiblePoints.length === 0) return '';
    }

    const pathCommands = visiblePoints.map((point, index) => {
      const x = xScale(point.time);
      const y = yScale(point.temperature);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });

    return pathCommands.join(' ');
  }, [protocolData.points, isPlaying, currentTime]);

  // Generate gradient fill path (path + baseline)
  const fillPath = useMemo(() => {
    if (protocolData.points.length === 0 || !pathData) return '';

    let visiblePoints = protocolData.points;

    // When playing, only show points within the visible window
    if (isPlaying) {
      const windowSize = 600;
      const windowStart = Math.max(0, currentTime - 120);
      const windowEnd = windowStart + windowSize;

      visiblePoints = protocolData.points.filter(p =>
        p.time >= windowStart && p.time <= windowEnd
      );

      if (visiblePoints.length === 0) return '';
    }

    const baseline = height - padding.bottom;
    const firstX = xScale(visiblePoints[0].time);
    const lastX = xScale(visiblePoints[visiblePoints.length - 1].time);

    return `${pathData} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
  }, [pathData, protocolData.points, isPlaying, currentTime]);

  // Current position marker
  const markerX = xScale(currentTime);
  const markerY = yScale(currentTemperature);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update protocol values
  const updateStep = (stepPath: string, field: 'temperature' | 'duration', value: number) => {
    setProtocol(prev => {
      const updated = { ...prev };
      const keys = stepPath.split('.');
      let target: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }

      target[keys[keys.length - 1]][field] = value;
      return updated;
    });

    // Reset animation
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Single Consolidated Card */}
      <div className="glass-card rounded-2xl p-6 border border-[var(--md-outline-variant)] space-y-6">
        {/* Header with Protocol Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--md-on-surface)]">Thermocycler Visualizer</h1>
              <p className="text-sm text-[var(--md-on-surface-variant)]">Visual PCR protocol editor & simulator</p>
            </div>
          </div>
        </div>

        {/* Protocol Selector Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--md-on-surface)]">
            Protocol
          </label>
          <select
            value={protocol.id}
            className="w-full px-4 py-2 rounded-xl bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)]"
            disabled
            title="Saved protocols from Library (Coming Soon)"
          >
            <option value={protocol.id}>{protocol.name}</option>
          </select>
          <p className="text-xs text-[var(--md-on-surface-variant)]">Saved protocols will be available once Library module is integrated</p>
        </div>

        {/* Graph Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[var(--md-on-surface)]">Temperature Profile</h3>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-[var(--md-on-surface-variant)] bg-[var(--md-surface-container)] px-3 py-1.5 rounded-lg">
              {formatTime(currentTime)} / {formatTime(protocolData.totalTime)}
            </div>
            <div className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-500/20">
              {currentTemperature.toFixed(1)}°C
            </div>
          </div>
        </div>

        {/* SVG Graph */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: '300px' }}>
            <defs>
              <linearGradient id="temp-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
              const y = padding.top + fraction * graphHeight;
              const temp = protocolData.maxTemp - fraction * (protocolData.maxTemp - protocolData.minTemp);
              return (
                <g key={`grid-${fraction}`}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="var(--md-outline-variant)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.3"
                  />
                  <text
                    x={padding.left - 10}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fill="var(--md-on-surface-variant)"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {Math.round(temp)}°C
                  </text>
                </g>
              );
            })}

            {/* Filled area under curve */}
            <path
              d={fillPath}
              fill="url(#temp-gradient)"
            />

            {/* Temperature path */}
            <path
              d={pathData}
              fill="none"
              stroke="rgb(168, 85, 247)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Current position marker */}
            {isPlaying && (
              <g>
                {/* Vertical line */}
                <line
                  x1={markerX}
                  y1={padding.top}
                  x2={markerX}
                  y2={height - padding.bottom}
                  stroke="rgb(168, 85, 247)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.5"
                />
                {/* Pulsing marker */}
                <circle cx={markerX} cy={markerY} r="8" fill="rgba(168, 85, 247, 0.2)">
                  <animate attributeName="r" from="6" to="12" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={markerX} cy={markerY} r="4" fill="rgb(168, 85, 247)" stroke="white" strokeWidth="2" />
              </g>
            )}

            {/* X-axis */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="var(--md-outline-variant)"
              strokeWidth="1"
            />

            {/* Y-axis */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={height - padding.bottom}
              stroke="var(--md-outline-variant)"
              strokeWidth="1"
            />

            {/* Axis labels */}
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              fill="var(--md-on-surface-variant)"
              fontSize="12"
              fontWeight="600"
            >
              Time (min:sec)
            </text>
            <text
              x={padding.left - 45}
              y={height / 2}
              textAnchor="middle"
              fill="var(--md-on-surface-variant)"
              fontSize="12"
              fontWeight="600"
              transform={`rotate(-90, ${padding.left - 45}, ${height / 2})`}
            >
              Temperature (°C)
            </text>
          </svg>
        </div>

        {/* Current step indicator */}
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/20 rounded-xl">
          <div className="text-xs text-purple-900 dark:text-purple-200">
            <span className="font-semibold">Current Step:</span> {currentStep}
          </div>
        </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="px-6 py-2.5 bg-[var(--md-surface-container)] hover:bg-[var(--md-surface-container-high)] text-[var(--md-on-surface)] rounded-xl font-medium flex items-center gap-2 transition-colors border border-[var(--md-outline-variant)]"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Collapsible Protocol Parameters Section */}
        <div className="border-t border-[var(--md-outline-variant)] pt-6">
          <button
            onClick={() => setIsParametersExpanded(!isParametersExpanded)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--md-surface-container)] hover:bg-[var(--md-surface-container-high)] transition-colors border border-[var(--md-outline-variant)]"
          >
            <h3 className="font-semibold text-[var(--md-on-surface)]">Protocol Parameters</h3>
            {isParametersExpanded ? (
              <ChevronUp className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
            )}
          </button>

          {isParametersExpanded && (
            <div className="mt-4 space-y-6">{/* Protocol Parameters Content */}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Initial Denaturation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--md-on-surface)] uppercase tracking-wider">Initial Denaturation</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={protocol.initialDenaturation.temperature}
                  onChange={(e) => updateStep('initialDenaturation', 'temperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Duration (sec)
                </label>
                <input
                  type="number"
                  value={protocol.initialDenaturation.duration}
                  onChange={(e) => updateStep('initialDenaturation', 'duration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Cycles */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--md-on-surface)] uppercase tracking-wider">Cycles</h4>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                Number of Cycles
              </label>
              <input
                type="number"
                value={protocol.cycles}
                onChange={(e) => setProtocol({ ...protocol, cycles: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* Denature */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--md-on-surface)] uppercase tracking-wider">Denature</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={protocol.cycleSteps.denature.temperature}
                  onChange={(e) => updateStep('cycleSteps.denature', 'temperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Duration (sec)
                </label>
                <input
                  type="number"
                  value={protocol.cycleSteps.denature.duration}
                  onChange={(e) => updateStep('cycleSteps.denature', 'duration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Anneal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--md-on-surface)] uppercase tracking-wider">Anneal</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={protocol.cycleSteps.anneal.temperature}
                  onChange={(e) => updateStep('cycleSteps.anneal', 'temperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Duration (sec)
                </label>
                <input
                  type="number"
                  value={protocol.cycleSteps.anneal.duration}
                  onChange={(e) => updateStep('cycleSteps.anneal', 'duration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Extend */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--md-on-surface)] uppercase tracking-wider">Extend</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={protocol.cycleSteps.extend.temperature}
                  onChange={(e) => updateStep('cycleSteps.extend', 'temperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Duration (sec)
                </label>
                <input
                  type="number"
                  value={protocol.cycleSteps.extend.duration}
                  onChange={(e) => updateStep('cycleSteps.extend', 'duration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Final Extension */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--md-on-surface)] uppercase tracking-wider">Final Extension</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={protocol.finalExtension.temperature}
                  onChange={(e) => updateStep('finalExtension', 'temperature', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[var(--md-on-surface-variant)]">
                  Duration (sec)
                </label>
                <input
                  type="number"
                  value={protocol.finalExtension.duration}
                  onChange={(e) => updateStep('finalExtension', 'duration', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--md-surface-container)] border border-[var(--md-outline-variant)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-[var(--md-on-surface)] font-mono text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

              {/* Protocol info */}
              <div className="mt-6 p-3 bg-[var(--md-surface-container)] rounded-xl border border-[var(--md-outline-variant)]">
                <div className="text-xs text-[var(--md-on-surface-variant)] space-y-1">
                  <p><span className="font-semibold">Total Time:</span> {formatTime(protocolData.totalTime)}</p>
                  <p><span className="font-semibold">Ramp Rate:</span> {protocol.rampRate}°C/sec</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
