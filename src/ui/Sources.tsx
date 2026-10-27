import { refById, refNumber, type SourceKey } from "@/content/references";
import { ui } from "@/content/ui";

// Llamadas a la bibliografía: [n] enlaza a #ref-<clave>. Lo que no tiene fuente
// se muestra como "fuente pendiente" hasta que se resuelva (nunca se inventa una cifra).
export function SourceRefs({ keys, pending }: { keys: readonly SourceKey[]; pending?: readonly string[] }) {
  if (!keys.length && !pending?.length) return null;
  return (
    <p className="sources">
      {keys.length > 0 && <span className="sources__label">{ui.fuentes}</span>}
      {keys.map((k) => (
        <a key={k} className="sources__ref" href={`#ref-${k}`} title={refById[k].cita}>
          [{refNumber[k]}]
        </a>
      ))}
      {pending?.map((p) => (
        <span key={p} className="pending" title={p}>
          {ui.pendiente}<span className="sr-only">: {p}</span>
        </span>
      ))}
    </p>
  );
}
