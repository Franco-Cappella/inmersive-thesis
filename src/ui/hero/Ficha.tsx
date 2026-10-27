import type { CSSProperties } from "react";
import { hero } from "@/content/hero";
import { refById, refNumber } from "@/content/references";
import { Flap, Tile } from "./Flap";

// Ficha animada del hero: IT y OT en el mismo lugar. Es decorativa (aria-hidden):
// el contenido real está en la tabla de HeroTable.
export function Ficha() {
  const { it, ot } = hero.mundos;
  return (
    <div className="ficha panel" aria-hidden="true">
      <div className="ficha__head">
        <span className="ficha__sigla">
          <Flap from={it.sigla[0]} to={ot.sigla[0]} />
          <Tile>{it.sigla[1]}</Tile>
        </span>
        <span className="ficha__nombres">
          <span className="swap ficha__nombre">
            <span className="v-it">{it.nombre}</span>
            <span className="v-ot">{ot.nombre}</span>
          </span>
          <span className="swap ficha__lema">
            <span className="v-it">{it.lema}</span>
            <span className="v-ot">{ot.lema}</span>
          </span>
        </span>
      </div>

      <div className="prio">
        <p className="prio__titulo">
          Prioridades<span className="prio__dagger">†</span>
        </p>
        <div className="prio__tabla">
          {[1, 2, 3].map((n) => (
            <span key={n} className="prio__rank" style={{ "--rank": n } as CSSProperties}>
              {n}
            </span>
          ))}
          {hero.triada.map((t) => (
            <span key={t.id} className="prio__name" data-id={t.id} style={{ "--rank": t.it } as CSSProperties}>
              <span className="prio__letra">{t.letra}</span> {t.nombre}
            </span>
          ))}
        </div>
      </div>

      <dl className="ficha__filas">
        {hero.ficha.map((f) => (
          <div key={f.rotulo} className="ficha__fila">
            <dt>
              {f.rotulo}
              {f.pendiente && <span className="prio__dagger">†</span>}
              {f.fuentes?.map((k) => (
                <sup key={k}>[{refNumber[k]}]</sup>
              ))}
            </dt>
            <dd className="swap">
              <span className="v-it">{f.it}</span>
              <span className="v-ot">{f.ot}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="ficha__pie">
        <span className="prio__dagger">†</span> {hero.pendienteTriada}{" "}
        {hero.ficha.flatMap((f) => (f.pendiente ? [f.pendiente] : [])).join(" ")}
        {hero.ficha.flatMap((f) =>
          (f.fuentes ?? []).map((k) => (
            <span key={k}>
              {" "}
              [{refNumber[k]}] {refById[k].corta}
            </span>
          )),
        )}
      </p>
    </div>
  );
}
