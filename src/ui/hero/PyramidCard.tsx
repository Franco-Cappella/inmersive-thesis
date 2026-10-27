import { hero } from "@/content/hero";

// Respaldo sin WebGL (y placeholder mientras carga el 3D): la misma pirámide en SVG.
// Es una tarjeta con dos caras: IT al frente y OT al dorso (ya invertida), que gira con --flip.
// En modo lectura se muestran las dos caras lado a lado.

type Shape = { id: string; letra: string; points: string; labelY: number; size: number };

// Pirámide de 280 de base y 240 de alto (viewBox 300×260), en tres capas con separación.
const IT: Shape[] = [
  { id: "c", letra: "C", points: "150,10 193.2,84 106.8,84", labelY: 66, size: 26 },
  { id: "i", letra: "I", points: "102.2,92 197.8,92 241,166 59,166", labelY: 140, size: 30 },
  { id: "a", letra: "A", points: "54.3,174 245.7,174 290,250 10,250", labelY: 223, size: 34 },
];
// OT: la misma pirámide reflejada en vertical (y' = 260 − y). A queda arriba.
const OT: Shape[] = IT.map((s) => ({
  ...s,
  points: s.points
    .split(" ")
    .map((p) => {
      const [x, y] = p.split(",").map(Number);
      return `${x},${260 - y}`;
    })
    .join(" "),
  labelY: 260 - s.labelY + s.size * 0.7,
}));

function Face({ mundo, shapes }: { mundo: "it" | "ot"; shapes: Shape[] }) {
  const first = mundo === "it" ? "c" : "a";
  const orden = hero.triada
    .slice()
    .sort((a, b) => a[mundo] - b[mundo])
    .map((t) => t.letra)
    .join(" · ");
  return (
    <div className={`pyr-card__face pyr-card__face--${mundo}`}>
      <svg viewBox="0 0 300 260" role="presentation" focusable="false">
        {shapes.map((s) => (
          <g key={s.id} className={s.id === first ? "pyr-card__layer is-first" : "pyr-card__layer"}>
            <polygon points={s.points} />
            <text x="150" y={s.labelY} textAnchor="middle" fontSize={s.size}>
              {s.letra}
            </text>
          </g>
        ))}
      </svg>
      <p className="pyr-card__caption">
        <strong>{hero.mundos[mundo].sigla}</strong> {orden}
      </p>
    </div>
  );
}

export function PyramidCard() {
  return (
    <div className="pyr-card" aria-hidden="true">
      <div className="pyr-card__inner">
        <Face mundo="it" shapes={IT} />
        <Face mundo="ot" shapes={OT} />
      </div>
    </div>
  );
}
