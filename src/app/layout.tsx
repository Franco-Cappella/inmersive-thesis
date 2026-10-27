import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/source-serif-4/opsz.css";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/hero.css";
import "@/styles/chapters.css";
import { site } from "@/content/hero";

// La imagen para compartir es src/app/opengraph-image.png (convención de archivo de Next).
// Sin metadataBase: en Vercel Next arma la URL absoluta con el dominio del deploy.
export const metadata: Metadata = {
  title: `${site.titulo} · Tesina IT/OT`,
  description: site.descripcion,
  openGraph: {
    title: site.titulo,
    description: site.descripcion,
    type: "website",
    locale: "es_AR",
  },
  twitter: { card: "summary_large_image" },
};

// Sin maximumScale: el zoom del navegador queda habilitado (accesibilidad).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c9ccce",
};

// Aplica ?estudio= antes del primer pintado para que no parpadee la paleta equivocada.
const estudioScript = `try{var e=new URLSearchParams(location.search).get("estudio");if(e==="plano"||e==="noche")document.documentElement.dataset.estudio=e}catch(_){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-estudio="sala" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: estudioScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
