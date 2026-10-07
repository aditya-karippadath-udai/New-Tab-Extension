import React from 'react';
import { useClock } from '../../hooks/useClock';
import { useSettings } from '../../context/SettingsContext';
import { Gauge, Sparkles, Zap } from 'lucide-react';
import { getGreeting } from '../../utils/dateUtils';

interface SpeedometerClockProps {
  onToggleMode?: () => void;
}

export const SpeedometerClock: React.FC<SpeedometerClockProps> = ({ onToggleMode }) => {
  const { settings, accentTheme, effectiveTheme } = useSettings();
  const {
    now,
    hours,
    minutes,
    seconds,
    period,
    formattedDate,
  } = useClock(settings.timeFormat24, settings.showSeconds);

  const hoursRaw = now.getHours();
  const minutesRaw = now.getMinutes();
  const secondsRaw = now.getSeconds();
  const millisecondsRaw = now.getMilliseconds();

  // Angular calculations
  // Continuous needle sweeps for ultra-smooth automotive look
  const secondAngle = (secondsRaw + millisecondsRaw / 1000) * 6; // 360 / 60 = 6 deg
  const minuteAngle = (minutesRaw + secondsRaw / 60) * 6;
  const hourAngle = ((hoursRaw % 12) + minutesRaw / 60 + secondsRaw / 3600) * 30; // 360 / 12 = 30 deg

  const isDark = effectiveTheme === 'dark';
  const greetingText = getGreeting(settings.userName);

  // Dial center & radius
  const cx = 160;
  const cy = 160;
  const radius = 135;

  // Generate speedometer tick marks (60 total)
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6; // 0 to 354
    const rad = ((angle - 90) * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const isRedline = i >= 45 && i <= 58;

    const tickLength = isMajor ? 12 : 6;
    const outerR = radius - 8;
    const innerR = outerR - tickLength;

    const x1 = cx + innerR * Math.cos(rad);
    const y1 = cy + innerR * Math.sin(rad);
    const x2 = cx + outerR * Math.cos(rad);
    const y2 = cy + outerR * Math.sin(rad);

    // Number position for major ticks
    const numR = innerR - 12;
    const numX = cx + numR * Math.cos(rad);
    const numY = cy + numR * Math.sin(rad);

    // Number text: outer speedometer value (0, 10, 20... or 05, 10... 60)
    const speedVal = i === 0 ? '60' : String(i).padStart(2, '0');
    // Inner hour value
    const hourVal = i === 0 ? '12' : String(i / 5);

    return {
      index: i,
      angle,
      isMajor,
      isRedline,
      x1,
      y1,
      x2,
      y2,
      numX,
      numY,
      speedVal,
      hourVal,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center select-none py-2">
      {/* Speedometer Gauge Dial */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 drop-shadow-2xl">
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic outer bezel gradient */}
            <radialGradient id="bezel-metallic" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="#262626" />
              <stop offset="92%" stopColor="#404040" />
              <stop offset="96%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>

            {/* Dark carbon-effect dial face */}
            <radialGradient id="dial-face" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#121721" />
              <stop offset="60%" stopColor="#0a0d14" />
              <stop offset="90%" stopColor="#06080d" />
              <stop offset="100%" stopColor="#020306" />
            </radialGradient>

            {/* Hub metallic gradient */}
            <radialGradient id="hub-cap" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#475569" />
              <stop offset="80%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Center screw highlight */}
            <radialGradient id="hub-screw" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            {/* Needle drop shadow */}
            <filter id="needle-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
            </filter>

            {/* Needle glow */}
            <filter id="needle-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Bezel Ring */}
          <circle
            cx={cx}
            cy={cy}
            r="156"
            fill="url(#bezel-metallic)"
            stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="2"
          />

          {/* Accent Rim Glow Line */}
          <circle
            cx={cx}
            cy={cy}
            r="147"
            fill="none"
            stroke={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.4)'}
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Dial Face Background */}
          <circle
            cx={cx}
            cy={cy}
            r="144"
            fill="url(#dial-face)"
          />

          {/* Subtle concentric gauge texture rings */}
          <circle cx={cx} cy={cy} r="120" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="95" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="65" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

          {/* Redline zone arc (between 45 and 60 minutes, i.e. 270deg to 360deg) */}
          <path
            d={`M ${cx - 120} ${cy} A 120 120 0 0 1 ${cx} ${cy - 120}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
            filter="drop-shadow(0 0 4px #ef4444)"
          />

          {/* Speedometer Tick Marks */}
          {ticks.map((t) => (
            <line
              key={`tick-${t.index}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={
                t.isRedline
                  ? '#ef4444'
                  : t.isMajor
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.35)'
              }
              strokeWidth={t.isMajor ? 2.2 : 1.2}
              strokeLinecap="round"
            />
          ))}

          {/* Speedometer Numerals (00, 10, 20, 30, 40, 50, 60 / Hours) */}
          {ticks
            .filter((t) => t.isMajor)
            .map((t) => (
              <text
                key={`num-${t.index}`}
                x={t.numX}
                y={t.numY + 4}
                textAnchor="middle"
                className={`font-mono text-[9px] font-bold select-none ${
                  t.isRedline ? 'fill-red-400' : 'fill-neutral-300'
                }`}
              >
                {t.speedVal}
              </text>
            ))}

          {/* Speedometer Header Branding */}
          <g transform={`translate(${cx}, 85)`}>
            <text
              textAnchor="middle"
              className="fill-cyan-400 font-mono text-[8px] font-bold tracking-widest uppercase"
            >
              CHRONO · SPEED
            </text>
            <text
              y="11"
              textAnchor="middle"
              className="fill-neutral-500 font-mono text-[7px] tracking-wider"
            >
              KM/H · TIME
            </text>
          </g>

          {/* Odometer Digital Window (Recessed LCD Display) */}
          <g transform={`translate(${cx - 55}, 185)`}>
            {/* Odometer bezel */}
            <rect
              width="110"
              height="36"
              rx="6"
              fill="#080b12"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.2"
            />
            {/* Subtle inner shadow */}
            <rect
              x="1.5"
              y="1.5"
              width="107"
              height="33"
              rx="5"
              fill="rgba(0,0,0,0.4)"
            />

            {/* Live digital readout */}
            <text
              x="55"
              y="18"
              textAnchor="middle"
              className="fill-cyan-300 font-mono font-bold text-[12px] tabular-nums tracking-wider"
            >
              {hours}:{minutes}{settings.showSeconds ? `:${seconds}` : ''} {period || ''}
            </text>

            {/* Trip odometer label */}
            <text
              x="55"
              y="29"
              textAnchor="middle"
              className="fill-neutral-500 font-mono text-[7px] tracking-wider uppercase"
            >
              TRIP · {formattedDate.split(',')[1]?.trim() || 'TODAY'}
            </text>
          </g>

          {/* 1. Hour Needle (Thick sport gauge pointer) */}
          <g
            transform={`rotate(${hourAngle}, ${cx}, ${cy})`}
            filter="url(#needle-shadow)"
          >
            {/* Tail */}
            <path
              d={`M ${cx - 3.5} ${cy + 18} L ${cx + 3.5} ${cy + 18} L ${cx + 3} ${cy} L ${cx - 3} ${cy} Z`}
              fill="#475569"
            />
            {/* Needle body */}
            <path
              d={`M ${cx - 3.5} ${cy} L ${cx + 3.5} ${cy} L ${cx + 1} ${cy - 68} L ${cx - 1} ${cy - 68} Z`}
              fill="#cbd5e1"
            />
            {/* Luminous tip */}
            <polygon
              points={`${cx - 2},${cy - 52} ${cx + 2},${cy - 52} ${cx},${cy - 72}`}
              fill="#38bdf8"
            />
          </g>

          {/* 2. Minute Needle (Main Speedometer Pointer) */}
          <g
            transform={`rotate(${minuteAngle}, ${cx}, ${cy})`}
            filter="url(#needle-shadow)"
          >
            {/* Counterweight Tail with aerodynamic hole */}
            <path
              d={`M ${cx - 4.5} ${cy + 26} L ${cx + 4.5} ${cy + 26} L ${cx + 3.5} ${cy} L ${cx - 3.5} ${cy} Z`}
              fill="#334155"
            />
            <circle cx={cx} cy={cy + 16} r="2.5" fill="#0f172a" />

            {/* Main speedometer needle blade */}
            <path
              d={`M ${cx - 3} ${cy} L ${cx + 3} ${cy} L ${cx + 1} ${cy - 104} L ${cx - 1} ${cy - 104} Z`}
              fill="#f8fafc"
            />

            {/* Illuminated glowing center stripe */}
            <line
              x1={cx}
              y1={cy - 12}
              x2={cx}
              y2={cy - 108}
              stroke="#06b6d4"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* 3. Second Needle (Vibrant Redline Tachometer Sweep Needle) */}
          {settings.showSeconds && (
            <g
              transform={`rotate(${secondAngle}, ${cx}, ${cy})`}
              filter="url(#needle-glow)"
            >
              {/* Needle tail */}
              <line
                x1={cx}
                y1={cy + 30}
                x2={cx}
                y2={cy}
                stroke="#ef4444"
                strokeWidth="1.6"
              />
              <circle cx={cx} cy={cy + 22} r="3.5" fill="#ef4444" />

              {/* Needle blade */}
              <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy - 116}
                stroke="#ef4444"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {/* High-visibility arrow tip */}
              <circle cx={cx} cy={cy - 114} r="1.8" fill="#f87171" />
            </g>
          )}

          {/* 4. Center Hub (Machined Concentric Metallic Cap) */}
          <circle
            cx={cx}
            cy={cy}
            r="14"
            fill="url(#hub-cap)"
            stroke="#0f172a"
            strokeWidth="1.5"
            filter="url(#needle-shadow)"
          />
          <circle
            cx={cx}
            cy={cy}
            r="8"
            fill="url(#hub-screw)"
            stroke="#1e293b"
            strokeWidth="0.8"
          />
          <circle cx={cx} cy={cy} r="2" fill="#0f172a" />
        </svg>
      </div>

      {/* Speedometer Footer Info */}
      <div className="mt-2 text-center">
        {settings.showDate && (
          <div className="text-xs sm:text-sm font-medium text-neutral-300 tracking-wide">
            {formattedDate}
          </div>
        )}
        {settings.showGreeting && (
          <div className="mt-1 text-xs text-neutral-400 font-normal">
            {greetingText}
          </div>
        )}
      </div>
    </div>
  );
};
