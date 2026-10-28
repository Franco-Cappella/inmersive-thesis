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

// Aplica ?estudio=, ?lectura y ?presentacion antes del primer pintado: sin esto la página se pintaba en modo
// normal y saltaba medio segundo después, cuando React leía la URL (el texto de la presentación es más grande y
// la lectura cambia todo el diseño). Después, Site.tsx mantiene estos atributos al día.
const modosScript = `try{var q=new URLSearchParams(location.search),d=document.documentElement.dataset,e=q.get("estudio");if(e==="plano"||e==="noche")d.estudio=e;if(q.has("lectura"))d.reading="true";if(q.has("presentacion"))d.presenting="true"}catch(_){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-estudio="sala" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modosScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
