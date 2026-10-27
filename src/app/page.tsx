import { Site } from "@/ui/Site";

// Una sola página. Site es un Client Component; Next lo prerenderiza a HTML en el
// build, así que todo el texto de la tesina ya está en out/index.html (también sin JS).
export default function Page() {
  return <Site />;
}
