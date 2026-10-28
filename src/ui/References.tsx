import { site } from "@/content/hero";
import { declaracionIA, references } from "@/content/references";
import { ui } from "@/content/ui";

export function References() {
  return (
    <section id="referencias" className="refs" data-section="referencias" aria-labelledby="referencias-title">
      {/* Decorativo: el nombre real, para lectores de pantalla, está en el pie (Site.tsx) */}
      <p className="refs__nombre" aria-hidden="true">
        {site.nombre.map((parte) => (
          <span key={parte}>{parte}</span>
        ))}
      </p>
      <div className="refs__inner">
        <h2 id="referencias-title">{ui.referencias}</h2>
        <p className="refs__nota">{ui.referenciasNota}</p>
        <ol className="refs__lista">
          {references.map((r) => (
            <li key={r.key} id={`ref-${r.key}`}>
              <span className="refs__cita">{r.cita}</span>{" "}
              {"url" in r && r.url && (
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.url.replace(/^https?:\/\//, "").split("/")[0]}
                </a>
              )}
            </li>
          ))}
        </ol>
        <h2 id="uso-ia" className="refs__ia-titulo">
          {ui.declaracion}
        </h2>
        <p className="refs__ia">{declaracionIA}</p>
        <p className="refs__pie">{ui.pie}</p>
      </div>
    </section>
  );
}
