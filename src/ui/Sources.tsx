import { refById, refNumber, type SourceKey } from "@/content/references";
import { ui } from "@/content/ui";

// Llamadas a la bibliografía: [n] enlaza a #ref-<clave>.
export function SourceRefs({ keys }: { keys: readonly SourceKey[] }) {
  if (!keys.length) return null;
  return (
    <p className="sources">
      <span className="sources__label">{ui.fuentes}</span>
      {keys.map((k) => (
        <a key={k} className="sources__ref" href={`#ref-${k}`} title={refById[k].cita}>
          [{refNumber[k]}]
        </a>
      ))}
    </p>
  );
}
