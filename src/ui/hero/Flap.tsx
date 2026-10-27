// Cartel de paletas (split-flap): la paleta superior cae y cambia una letra por otra.
// El progreso viene de la variable CSS --flap (0..1) que escribe el timeline del hero.
export function Flap({ from, to }: { from: string; to: string }) {
  return (
    <span className="flap" aria-hidden="true">
      <span className="flap__half flap__half--top">
        <span className="flap__glyph">{to}</span>
      </span>
      <span className="flap__half flap__half--bottom">
        <span className="flap__glyph">{from}</span>
      </span>
      <span className="flap__leaf">
        <span className="flap__half flap__half--top flap__face">
          <span className="flap__glyph">{from}</span>
        </span>
        <span className="flap__half flap__half--bottom flap__face flap__face--back">
          <span className="flap__glyph">{to}</span>
        </span>
      </span>
    </span>
  );
}

export function Tile({ children }: { children: string }) {
  return (
    <span className="flap flap--static" aria-hidden="true">
      <span className="flap__half flap__half--top">
        <span className="flap__glyph">{children}</span>
      </span>
      <span className="flap__half flap__half--bottom">
        <span className="flap__glyph">{children}</span>
      </span>
    </span>
  );
}
