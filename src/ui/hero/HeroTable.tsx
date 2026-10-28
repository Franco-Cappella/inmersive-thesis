import { hero, heroFigura } from "@/content/hero";
import { SourceRefs } from "../Sources";

// Contenido real del hero: la tabla de la tesina, textual. En modo normal queda solo
// para lectores de pantalla (la ficha animada es decorativa); en modo lectura se ve.
export function HeroTable() {
  const fuentes = hero.ficha.flatMap((f) => f.fuentes ?? []);
  return (
    <div className="hero__tabla">
      <p className="sr-only">{heroFigura}</p>
      <table>
        <caption>{hero.tabla.caption}</caption>
        <thead>
          <tr>
            <th scope="col">Dimensión</th>
            <th scope="col">Ciberseguridad IT</th>
            <th scope="col">Ciberseguridad OT</th>
          </tr>
        </thead>
        <tbody>
          {hero.tabla.filas.map((f) => (
            <tr key={f.dimension}>
              <th scope="row">{f.dimension}</th>
              <td>{f.it}</td>
              <td>{f.ot}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SourceRefs keys={fuentes} />
    </div>
  );
}
