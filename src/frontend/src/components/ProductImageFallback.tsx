/**
 * Beautiful CSS-based fallback shown when a product image fails to load.
 * Shows a green gradient background with a leaf SVG icon and the product name.
 * Never shows a broken X — always a polished placeholder.
 */

const CATEGORY_GRADIENTS: Record<string, string> = {
  herbalSupplements: "from-emerald-600 to-green-500",
  immunity: "from-amber-500 to-orange-400",
  digestiveHealth: "from-teal-600 to-cyan-500",
  fitness: "from-blue-600 to-indigo-500",
  multivitamins: "from-purple-600 to-violet-500",
  ayurvedicCare: "from-orange-600 to-amber-500",
};

interface ProductImageFallbackProps {
  name: string;
  categoryLabel?: string;
  className?: string;
}

export function ProductImageFallback({
  name,
  categoryLabel = "",
  className = "w-full h-full",
}: ProductImageFallbackProps) {
  const gradient =
    CATEGORY_GRADIENTS[categoryLabel] ?? "from-emerald-600 to-green-500";

  return (
    <div
      className={`${className} bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3 select-none`}
      aria-label={`Product image for ${name}`}
    >
      {/* Leaf/herb SVG icon */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-90 drop-shadow-sm"
        aria-hidden="true"
      >
        <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.15)" />
        {/* Leaf shape */}
        <path
          d="M26 10 C26 10 38 16 38 28 C38 36 32 42 26 42 C20 42 14 36 14 28 C14 16 26 10 26 10Z"
          fill="rgba(255,255,255,0.9)"
        />
        {/* Leaf vein */}
        <path
          d="M26 14 L26 40"
          stroke="rgba(0,100,50,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M26 22 C22 24 18 26 16 30"
          stroke="rgba(0,100,50,0.3)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M26 28 C30 30 34 30 36 28"
          stroke="rgba(0,100,50,0.3)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      {/* Product name */}
      <p className="text-white text-xs font-semibold text-center px-3 leading-snug opacity-95 line-clamp-2 max-w-[90%]">
        {name}
      </p>
    </div>
  );
}
