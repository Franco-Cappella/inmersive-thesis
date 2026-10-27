import type { CSSProperties } from "react";
import { hero } from "@/content/hero";
import type { Figura } from "@/content/story";
import { ui } from "@/content/ui";
import { SourceRefs } from "./Sources";

// Una figura por capítulo: la idea en grande y el texto mínimo. Todo es HTML real
// (se lee sin 3D, se selecciona y se imprime); el 3D del capítulo se suma después.
export function FiguraView({ figura }: { figura: Figura }) {
  switch (figura.tipo) {
    case "reloj":
      return (
        <div className="fig fig--reloj">
          <p className="fig-reloj__hora" aria-hidden="true">
            {figura.pasos[0].hora}
          </p>
          <span className="tag">{figura.etiqueta}</span>
          <ol className="fig-reloj__pasos">
            {figura.pasos.map((p, i) => (
              <li key={i}>
                <time>{p.hora}</time>
                <span>{p.texto}</span>
              </li>
            ))}
          </ol>
          <p className="fig-reloj__cierre">{figura.cierre}</p>
        </div>
      );
    case "brecha":
      return (
        <div className="fig fig--brecha">
          <div className="fig-brecha__fila">
            <span className="fig-brecha__rotulo">{ui.antes}</span>
            <span className="fig-brecha__bloques fig-brecha__bloques--separados" aria-hidden="true">
              <span>{hero.mundos.it.sigla}</span>
              <span>{hero.mundos.ot.sigla}</span>
            </span>
            <span className="fig-brecha__texto">{figura.antes}</span>
          </div>
          <div className="fig-brecha__fila">
            <span className="fig-brecha__rotulo">{ui.despues}</span>
            <span className="fig-brecha__bloques" aria-hidden="true">
              <span>{hero.mundos.it.sigla}</span>
              <span>{hero.mundos.ot.sigla}</span>
            </span>
            <span className="fig-brecha__texto">{figura.despues}</span>
          </div>
          <p className="fig-brecha__consecuencia">{figura.consecuencia}</p>
        </div>
      );
    case "trama":
      return (
        <div className="fig fig--trama">
          <figure className="fig-trama__frame">
            <ol className="fig-trama__bytes">
              {figura.campos.map((c, i) => (
                <li key={i}>
                  <code>{c.hex}</code>
                  <span>{c.nombre}</span>
                </li>
              ))}
            </ol>
            <figcaption>{figura.leyenda}</figcaption>
          </figure>
          <ul className="fig-trama__rasgos">
            {figura.rasgos.map((r) => (
              <li key={r.titulo}>
                <strong>{r.titulo}</strong>
                <span>{r.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "pregunta":
      return (
        <div className="fig fig--pregunta">
          <blockquote className="fig-pregunta__q">{figura.pregunta}</blockquote>
          <dl className="fig-pregunta__apuesta">
            <div>
              <dt>{ui.hipotesis}</dt>
              <dd>{figura.hipotesis}</dd>
            </div>
            <div>
              <dt>{ui.refutaria}</dt>
              <dd>{figura.refutaria}</dd>
            </div>
            <div>
              <dt>{ui.sostendria}</dt>
              <dd>{figura.sostendria}</dd>
            </div>
          </dl>
        </div>
      );
    case "golpes":
      return (
        <ol className="fig fig--golpes">
          {figura.items.map((g) => (
            <li key={g.control}>
              <strong>{g.control}</strong>
              <span>{g.efecto}</span>
            </li>
          ))}
        </ol>
      );
    case "cifras":
      return (
        <div className="fig fig--cifras">
          {figura.items.map((c) => (
            <figure key={c.valor} className="cifra">
              <p className="cifra__valor">
                {/* el contador anima la copia visible; el lector de pantalla lee el valor final */}
                <span aria-hidden="true" data-contador>
                  {c.valor}
                </span>
                <span className="sr-only">{c.valor}</span>
              </p>
              <figcaption>
                {c.texto} <SourceRefs keys={[c.fuente]} />
              </figcaption>
            </figure>
          ))}
          <p className="fig__nota">{figura.nota}</p>
        </div>
      );
    case "casos":
      return (
        <ul className="fig fig--casos">
          {figura.items.map((c) => (
            <li key={c.nombre}>
              <h3>{c.nombre}</h3>
              <p>{c.texto}</p>
              <SourceRefs keys={c.fuentes} />
            </li>
          ))}
        </ul>
      );
    case "barras": {
      const max = Math.max(...figura.items.map((i) => i.valor));
      return (
        <figure className="fig fig--barras">
          <table>
            <caption>{figura.pregunta}</caption>
            <tbody>
              {figura.items.map((it, i) => (
                <tr key={it.rotulo} className={i === 0 ? "is-top" : undefined}>
                  <th scope="row">{it.rotulo}</th>
                  <td>
                    <span className="barra" style={{ "--v": it.valor / max } as CSSProperties} />
                    <span className="barra__valor">{it.valor.toLocaleString("es-AR")} %</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <figcaption className="fig__nota">{figura.nota}</figcaption>
        </figure>
      );
    }
    case "pilares":
      return (
        <ol className="fig fig--pilares">
          {figura.items.map((p) => (
            <li key={p.titulo}>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
              <SourceRefs keys={p.fuentes} />
            </li>
          ))}
        </ol>
      );
    case "cita":
      return (
        <blockquote className="fig fig--cita">
          <p>{figura.texto}</p>
        </blockquote>
      );
  }
}
