// ─────────────────────────────────────────────────────────────
//  CrashRating — StarRating
//  Displays 1–5 gold stars with an optional label.
//  Handles integer ratings from NHTSA (5-star scale).
// ─────────────────────────────────────────────────────────────
"use client";

const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

interface StarRatingProps {
  rating: number | string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  labelClassName?: string;
  starClassName?: string;
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export function StarRating({
  rating,
  size = "md",
  showLabel = true,
  labelClassName = "",
  starClassName = "",
}: StarRatingProps) {
  const numeric =
    typeof rating === "string" ? Number(rating) : rating;
  const valid =
    isNaN(numeric) || numeric < 0 ? 0 : Math.min(5, numeric);
  const full = Math.round(valid);

  const sizeClass = sizeMap[size];

  const Star = ({ filled }: { filled: boolean }) => (
    <svg
      className={`${sizeClass} ${starClassName}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      opacity={filled ? 1 : 0.25}
    >
      <path d={STAR_PATH} />
    </svg>
  );

  if (valid === 0) {
    return (
      <div
        className={`flex items-center gap-1 text-gold ${starClassName}`}
      >
        {[...Array(5)].map((_, i) => (
          <Star key={`empty-${i}`} filled={false} />
        ))}
        {showLabel && (
          <span
            className={`text-sm font-medium text-text-dim ${labelClassName}`}
          >
            Not rated
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[...Array(full)].map((_, i) => (
          <Star key={`full-${i}`} filled={true} />
        ))}
        {[...Array(5 - full)].map((_, i) => (
          <Star key={`empty-${i}`} filled={false} />
        ))}
      </div>
      {showLabel && (
        <span
          className={`text-sm font-medium text-text-muted ${labelClassName}`}
        >
          {valid.toFixed(1)}/5
        </span>
      )}
    </div>
  );
}
