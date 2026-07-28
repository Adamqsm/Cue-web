/**
 * The duotone recipe: night shadows × limestone highlights, with mids pulled
 * slightly cool and dark so mixed photo sources read as one city after dark.
 * Applied via `.duo img { filter: url(#cue-duo) }` — photography only;
 * product-UI screenshots stay true-colour. Values are fixed (not theme
 * tokens): the same treatment reads correctly on both grounds.
 */
export default function DuoFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <filter id="cue-duo" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        {/* shadow → #1F242C, highlight → #E7E1D4 */}
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.122 0.48 0.906" />
          <feFuncG type="table" tableValues="0.141 0.46 0.882" />
          <feFuncB type="table" tableValues="0.173 0.44 0.831" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}
