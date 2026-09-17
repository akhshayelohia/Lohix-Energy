import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  voltage: string;
  capacity: string;
  className?: string;
};

// Illustrated stand-in for a 2W pack until product photography is uploaded.
export function PackRender({ voltage, capacity, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tall = parseFloat(capacity) >= 40;

  const x = 96;
  const y = 132;
  const w = 196;
  const h = tall ? 292 : 252;
  const d = 58;
  const dy = 36;
  const bottom = y + h;
  const cx = x + w / 2 + d / 2;
  const lx = x + 34;

  return (
    <svg
      viewBox="0 0 420 500"
      role="img"
      aria-label={`LOHIX ${voltage} ${capacity} battery pack illustration`}
      className={cn("select-none", className)}
    >
      <defs>
        <linearGradient id={`front-${uid}`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#20272b" />
          <stop offset="0.55" stopColor="#11161a" />
          <stop offset="1" stopColor="#090c0e" />
        </linearGradient>
        <linearGradient id={`side-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#141a1d" />
          <stop offset="1" stopColor="#040607" />
        </linearGradient>
        <linearGradient id={`top-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#343d42" />
          <stop offset="1" stopColor="#1c2226" />
        </linearGradient>
        <linearGradient id={`edge-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`floor-${uid}`}>
          <stop offset="0" style={{ stopColor: "var(--lohix-lime)", stopOpacity: 0.5 }} />
          <stop offset="1" style={{ stopColor: "var(--lohix-lime)", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx={cx} cy={bottom - 6} rx="190" ry="44" fill={`url(#floor-${uid})`} />
      <ellipse
        cx={cx}
        cy={bottom - 8}
        rx="158"
        ry="24"
        fill="none"
        className="stroke-lohix-lime"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />

      <path
        d={`M ${x + w} ${y} L ${x + w + d} ${y - dy} L ${x + w + d} ${bottom - dy} L ${x + w} ${bottom} Z`}
        fill={`url(#side-${uid})`}
      />
      <path
        d={`M ${x} ${y} L ${x + d} ${y - dy} L ${x + w + d} ${y - dy} L ${x + w} ${y} Z`}
        fill={`url(#top-${uid})`}
      />
      <path
        d={`M ${x + w} ${y} L ${x + w + d} ${y - dy}`}
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      <path
        d={`M ${cx - 46} ${y - dy / 2 + 8} C ${cx - 46} ${y - dy / 2 - 22}, ${cx + 46} ${y - dy / 2 - 22}, ${cx + 46} ${y - dy / 2 + 8}`}
        fill="none"
        stroke="#5b666c"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - 46} ${y - dy / 2 + 8} C ${cx - 46} ${y - dy / 2 - 22}, ${cx + 46} ${y - dy / 2 - 22}, ${cx + 46} ${y - dy / 2 + 8}`}
        fill="none"
        stroke="#a9b4ba"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <rect x={x} y={y} width={w} height={h} rx="8" fill={`url(#front-${uid})`} />
      <rect x={x} y={y} width={w * 0.55} height={h} rx="8" fill={`url(#sheen-${uid})`} />
      <line x1={x + 6} y1={y + 0.5} x2={x + w - 6} y2={y + 0.5} stroke={`url(#edge-${uid})`} />

      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={x + 18 + i * 13}
          y={y + 18}
          width="9"
          height="5"
          rx="1.5"
          className="fill-lohix-lime"
          fillOpacity={i < 3 ? 0.95 : 0.2}
        />
      ))}
      <circle cx={x + w - 26} cy={y + 21} r="9" fill="#07090a" stroke="#4a5358" strokeWidth="1.5" />
      <circle cx={x + w - 26} cy={y + 21} r="3.5" className="fill-lohix-lime" fillOpacity="0.85" />

      <rect
        x={x + 16}
        y={y + 42}
        width={w - 32}
        height={h - 62}
        rx="10"
        fill="#07090b"
        stroke="#fff"
        strokeOpacity="0.07"
      />
      <text
        x={lx}
        y={y + 90}
        fill="#fff"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="30"
        fontWeight="800"
        letterSpacing="1.5"
      >
        LOHIX
      </text>
      <rect x={lx} y={y + 102} width="30" height="3" rx="1.5" className="fill-lohix-lime" />
      <text
        x={lx}
        y={y + 146}
        className="fill-lohix-lime"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="27"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        {voltage}
      </text>
      <text
        x={lx}
        y={y + 178}
        fill="#fff"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="27"
        fontWeight="700"
        letterSpacing="-0.5"
      >
        {capacity}
      </text>
      <text
        x={lx}
        y={y + 204}
        fill="#fff"
        fillOpacity="0.45"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="1.6"
      >
        LiFePO4 · SMART BMS
      </text>
      <path
        d="M 13 0 L 0 18 H 10 L 7 32 L 22 12 H 12 L 15 0 Z"
        transform={`translate(${x + w - 58} ${y + 62}) scale(1.2)`}
        className="fill-lohix-lime"
      />
      <text
        x={lx}
        y={bottom - 34}
        fill="#fff"
        fillOpacity="0.35"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="7.5"
        fontWeight="600"
        letterSpacing="1.4"
      >
        BUILT IN INDIA
      </text>
    </svg>
  );
}
