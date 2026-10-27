import Link from "next/link";
import { ui } from "@/content/ui";

// 404 en castellano (en el export estático sale como out/404.html). Sin 3D: solo el panel.
export default function NotFound() {
  return (
    <main id="contenido" className="no-encontrada">
      <div className="no-encontrada__panel">
        <p className="chapter__num">404</p>
        <h1>{ui.noEncontrada.titulo}</h1>
        <p>{ui.noEncontrada.texto}</p>
        <Link href="/">{ui.noEncontrada.volver}</Link>
      </div>
    </main>
  );
}
