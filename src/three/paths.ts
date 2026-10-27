import { CurvePath, LineCurve3, QuadraticBezierCurve3, Vector3 } from "three";
import type { Vec3 } from "@/scroll/rig";

// Recorrido "de cañería": tramos rectos con codos redondeados en cada esquina.
// Sirve para cañerías (TubeGeometry) y para rutas de paquetes (getPointAt).
export function pipePath(points: Vec3[], bend = 0.4) {
  const p = points.map((v) => new Vector3(...v));
  const path = new CurvePath<Vector3>();
  let cursor = p[0].clone();
  for (let i = 1; i < p.length - 1; i++) {
    const inDir = p[i].clone().sub(p[i - 1]).normalize();
    const outDir = p[i + 1].clone().sub(p[i]).normalize();
    const a = p[i].clone().addScaledVector(inDir, -bend);
    const b = p[i].clone().addScaledVector(outDir, bend);
    path.add(new LineCurve3(cursor, a));
    path.add(new QuadraticBezierCurve3(a, p[i].clone(), b));
    cursor = b;
  }
  path.add(new LineCurve3(cursor, p[p.length - 1].clone()));
  return path;
}
