/** Pixel GitHub mark. SVG rather than a font icon so it stays crisp when scaled. */
export default function GhGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 10 10"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <path
        fill="currentColor"
        d="M3 0h4v1h1v1h1v4h-1v1h-2v1h1v3h-2v-2h-2v2h-2v-1h1v-1h-1v-1h-1v-1h1v-1h-1v-4h1v-1h1z"
      />
    </svg>
  );
}
