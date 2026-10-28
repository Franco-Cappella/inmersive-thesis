"use client";

import { Edges, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineCurve3,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from "three";
import { rig, type Vec3 } from "@/scroll/rig";
import { easeOutBack, glow, range, smooth } from "../helpers";
import { PacketFlow } from "../PacketFlow";
import type { Palette } from "../palette";
import { dmzShown, pillarBeat } from "../signals";
import { GAP_Y, LINKS } from "./Convergencia";
import { IT_FLOOR_Y } from "./ITFloor";
import { OT_FLOOR_Y } from "./OTFloor";

// Capítulo 09 · "No es la seguridad: es el trasplante". Un pilar por tramo de fx.zones
// (MATIZ_TRAMOS en src/scroll/timing.ts), en el orden de la lista del texto:
//   Zonas y conductos     la DMZ se cierra sobre el air gap, aparecen las zonas (oficina y dos celdas
//                         de planta) y una compuerta en cada enlace legítimo. Los recorridos de los
//                         casos se retraen hasta la DMZ (Casos vía segmentation) y la planta vuelve a azul.
//   Escuchar, no golpear  un puerto espejo copia el tráfico de un enlace a un sensor pasivo.
//   Probar antes          el parche baja a un gemelo digital del controlador: prueba (ámbar) → validado (azul).

// La DMZ ocupa el lugar del air gap: una losa entre la oficina y la planta.
export const DMZ_H = 0.6;
export const DMZ_TOP = GAP_Y + DMZ_H / 2;
const DMZ_BOTTOM = GAP_Y - DMZ_H / 2;

// Todas las zonas comparten la planta del edificio: apiladas, arman la torre (oficina, DMZ, planta).
const X = 11.2;
const Z: [number, number] = [-12, -0.6];
type Zone = { min: Vec3; max: Vec3; grow: "x" | "y"; at: [number, number]; fill: number };
const ZONES: Zone[] = [
  { min: [-X, DMZ_BOTTOM, Z[0]], max: [X, DMZ_TOP, Z[1]], grow: "x", at: [0, 0.2], fill: 0.22 }, // DMZ
  { min: [-X, IT_FLOOR_Y, Z[0]], max: [X, IT_FLOOR_Y + 3.3, Z[1]], grow: "y", at: [0.08, 0.3], fill: 0.035 }, // oficina
  { min: [-X, OT_FLOOR_Y, Z[0]], max: [-0.3, DMZ_BOTTOM - 0.4, Z[1]], grow: "y", at: [0.12, 0.34], fill: 0.035 }, // celda izquierda
  { min: [0.3, OT_FLOOR_Y, Z[0]], max: [X, DMZ_BOTTOM - 0.4, Z[1]], grow: "y", at: [0.16, 0.38], fill: 0.035 }, // celda derecha
];

// Un conducto por cada enlace legítimo de la escena 02, donde su tramo vertical cruza la DMZ.
const GATES: Vec3[] = LINKS.map(([[x, , z]]) => [x, GAP_Y, z]);

// Monitoreo pasivo: el puerto espejo está sobre el enlace de la izquierda (rack → válvula).
const [tapX, , tapZ] = LINKS[2][0];
const TAP: Vec3 = [tapX, DMZ_BOTTOM - 0.85, tapZ];
const SENSOR: Vec3 = [tapX - 1.5, TAP[1], tapZ + 0.85];
const SENSOR_BARS = 4;

// Gemelo digital del controlador de la derecha. El parche baja de la DMZ al gemelo, no a la planta.
const CABINET = { w: 0.95, h: 1.8, d: 0.6 };
const TWIN: Vec3 = [1.3, OT_FLOOR_Y + CABINET.h / 2, -1.6];

function ZoneBox({ zone, palette }: { zone: Zone; palette: Palette }) {
  const { min, max, grow, at, fill } = zone;
  const size: Vec3 = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const geometry = useMemo(() => new BoxGeometry(max[0] - min[0], max[1] - min[1], max[2] - min[2]), [min, max]);
  const edges = useMemo(() => new EdgesGeometry(geometry), [geometry]);
  useEffect(
    () => () => {
      geometry.dispose();
      edges.dispose();
    },
    [geometry, edges],
  );
  const group = useRef<Group>(null);
  const face = useRef<MeshBasicMaterial>(null);
  const line = useRef<LineBasicMaterial>(null);
  // "y" crece desde el piso de la zona; "x" se cierra desde el centro, como una persiana.
  const anchor: Vec3 =
    grow === "y" ? [(min[0] + max[0]) / 2, min[1], (min[2] + max[2]) / 2] : [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  const offsetY = grow === "y" ? size[1] / 2 : 0;

  useFrame(() => {
    const t = grow === "x" ? dmzShown() : smooth(pillarBeat(0), at[0], at[1]);
    if (!group.current) return;
    group.current.visible = t > 0.001;
    group.current.scale.set(grow === "x" ? Math.max(0.001, t) : 1, grow === "y" ? Math.max(0.001, t) : 1, 1);
    if (face.current) face.current.opacity = fill * t;
    if (line.current) line.current.opacity = 0.55 * t;
  });

  return (
    <group ref={group} position={anchor} visible={false}>
      <mesh geometry={geometry} position={[0, offsetY, 0]}>
        <meshBasicMaterial ref={face} color={palette.ink} transparent opacity={0} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edges} position={[0, offsetY, 0]}>
        <lineBasicMaterial ref={line} color={palette.ink} transparent opacity={0} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

// Compuertas de los conductos: cada enlace atraviesa la suya y su luz queda en azul (el tráfico legítimo pasa).
// Los cuerpos y las luces de las tres van instanciados (una llamada de dibujo cada uno); el contorno queda por
// compuerta, porque cada una crece por su cuenta.
const GATE_SIZE: Vec3 = [0.72, DMZ_H + 0.24, 0.72];
const GATE_LED: Vec3 = [0, 0, 0.365];
const gateGrowth = (i: number) => range(pillarBeat(0), 0.14 + i * 0.03, 0.32 + i * 0.03);

function Gates({ palette }: { palette: Palette }) {
  const bodies = useRef<InstancedMesh>(null);
  const leds = useRef<InstancedMesh>(null);
  const outlines = useRef<(Group | null)[]>([]);
  const geometry = useMemo(() => new BoxGeometry(...GATE_SIZE), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const led = useMemo(() => glow(palette.flow, 2.4), [palette]);
  const dummy = useMemo(() => new Object3D(), []);

  useFrame(() => {
    const b = bodies.current;
    const l = leds.current;
    if (!b || !l) return;
    const shown = gateGrowth(0) > 0;
    b.visible = shown;
    l.visible = shown;
    GATES.forEach((p, i) => {
      const t = gateGrowth(i);
      const s = Math.max(0.001, easeOutBack(t));
      dummy.position.set(...p);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      b.setMatrixAt(i, dummy.matrix);
      dummy.position.set(p[0] + GATE_LED[0] * s, p[1] + GATE_LED[1] * s, p[2] + GATE_LED[2] * s);
      dummy.updateMatrix();
      l.setMatrixAt(i, dummy.matrix);
      const o = outlines.current[i];
      if (o) {
        o.visible = t > 0;
        o.scale.setScalar(s);
      }
    });
    if (shown) {
      b.instanceMatrix.needsUpdate = true;
      l.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={bodies} args={[geometry, undefined, GATES.length]} visible={false} frustumCulled={false}>
        <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
      </instancedMesh>
      <instancedMesh ref={leds} args={[undefined, undefined, GATES.length]} visible={false} frustumCulled={false}>
        <planeGeometry args={[0.46, 0.09]} />
        <meshBasicMaterial color={led} toneMapped={false} />
      </instancedMesh>
      {GATES.map((p, i) => (
        <group
          key={i}
          ref={(g) => {
            outlines.current[i] = g;
          }}
          position={p}
          visible={false}
        >
          <Edges geometry={geometry} threshold={20} color={palette.edge[0]} lineWidth={1} transparent opacity={palette.edge[1] * 0.7} />
        </group>
      ))}
    </>
  );
}

function Sensor({ palette }: { palette: Palette }) {
  const body = useRef<Group>(null);
  const tap = useRef<Group>(null);
  const bars = useRef<InstancedMesh>(null);
  const curve = useMemo(() => new LineCurve3(new Vector3(...TAP), new Vector3(...SENSOR)), []);
  const routes = useMemo(() => [{ curve, count: 3, speed: 0.5, visibility: () => smooth(pillarBeat(1), 0.25, 0.4) }], [curve]);
  const reach: Vec3 = [SENSOR[0] - TAP[0], SENSOR[1] - TAP[1], SENSOR[2] - TAP[2]];
  const c = useMemo(
    () => ({ on: glow(palette.flow, 2.6), off: new Color(palette.ink).multiplyScalar(0.4), copy: glow(palette.flow, 1.6), bar: new Color() }),
    [palette],
  );
  // Los cuatro campos del sensor, instanciados: una llamada de dibujo, un color por campo.
  useLayoutEffect(() => {
    const m = bars.current;
    if (!m) return;
    const d = new Object3D();
    for (let i = 0; i < SENSOR_BARS; i++) {
      d.position.set((-0.3 + i * 0.2) * 1.25, 0, 0.38);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, c.off);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [c]);

  useFrame((state) => {
    const b = pillarBeat(1);
    if (body.current) {
      const t = range(b, 0, 0.16);
      body.current.visible = t > 0;
      body.current.scale.setScalar(Math.max(0.001, easeOutBack(t)));
    }
    // El cable del puerto espejo sale del enlace y llega al sensor.
    if (tap.current) {
      const t = range(b, 0.1, 0.3);
      tap.current.visible = t > 0;
      tap.current.scale.setScalar(Math.max(0.001, t));
    }
    // El sensor interpreta lo que recibe: sus campos se encienden de a uno.
    const m = bars.current;
    if (m?.instanceColor) {
      for (let i = 0; i < SENSOR_BARS; i++) {
        const lit = smooth(b, 0.4 + i * 0.12, 0.48 + i * 0.12);
        const flicker = rig.snap ? 1 : 0.8 + 0.2 * Math.sin(state.clock.elapsedTime * (5 + i * 1.7));
        m.setColorAt(i, c.bar.copy(c.off).lerp(c.on, lit * flicker));
      }
      m.instanceColor.needsUpdate = true;
    }
  });

  return (
    <>
      <group ref={tap} position={TAP} visible={false}>
        <mesh>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshBasicMaterial color={c.on} toneMapped={false} />
        </mesh>
        <Line points={[[0, 0, 0], reach]} color={palette.flow} lineWidth={1.5} dashed dashSize={0.12} gapSize={0.08} />
      </group>
      {/* Copias del tráfico: solo viajan hacia el sensor, que no le envía nada a la red */}
      <PacketFlow routes={routes} size={0.07} color={c.copy} />
      <group ref={body} position={SENSOR} visible={false}>
        <mesh scale={1.25}>
          <boxGeometry args={[0.95, 0.36, 0.6]} />
          <meshStandardMaterial color={palette.metal} roughness={palette.rough} metalness={palette.metalness} />
          <Edges threshold={20} color={palette.edge[0]} lineWidth={1} transparent opacity={palette.edge[1] * 0.8} />
        </mesh>
        <instancedMesh ref={bars} args={[undefined, undefined, SENSOR_BARS]}>
          <planeGeometry args={[0.17, 0.09]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
    </>
  );
}

function Twin({ palette }: { palette: Palette }) {
  const group = useRef<Group>(null);
  const face = useRef<MeshBasicMaterial>(null);
  const line = useRef<LineBasicMaterial>(null);
  const light = useRef<MeshBasicMaterial>(null);
  const patch = useRef<Mesh>(null);
  const cable = useRef<Group>(null);
  const geometry = useMemo(() => new BoxGeometry(CABINET.w, CABINET.h, CABINET.d), []);
  const edges = useMemo(() => new EdgesGeometry(geometry), [geometry]);
  useEffect(
    () => () => {
      geometry.dispose();
      edges.dispose();
    },
    [geometry, edges],
  );
  const route = useMemo(
    () => new LineCurve3(new Vector3(TWIN[0], DMZ_BOTTOM, TWIN[2]), new Vector3(TWIN[0], TWIN[1] + CABINET.h / 2 + 0.12, TWIN[2])),
    [],
  );
  const c = useMemo(
    () => ({
      warn: glow(palette.warn, 1.3),
      flow: glow(palette.flow, 1.3),
      warnLit: glow(palette.warn, 2.6),
      flowLit: glow(palette.flow, 2.6),
      off: new Color(palette.ink).multiplyScalar(0.4),
      patch: glow(palette.warn, 3.2),
      state: new Color(),
      lit: new Color(),
    }),
    [palette],
  );

  useFrame((state) => {
    const b = pillarBeat(2);
    const shown = smooth(b, 0, 0.15);
    const travel = range(b, 0.12, 0.42);
    const testing = smooth(b, 0.42, 0.48);
    const ok = smooth(b, 0.72, 0.86); // validado: el gemelo pasa de ámbar a azul
    if (group.current) group.current.visible = shown > 0.001;
    c.state.copy(c.warn).lerp(c.flow, ok);
    if (face.current) {
      face.current.color.copy(c.state);
      face.current.opacity = 0.2 * shown;
    }
    if (line.current) {
      line.current.color.copy(c.state);
      line.current.opacity = shown;
    }
    if (light.current) {
      const pulse = rig.snap ? 1 : 0.6 + 0.4 * Math.sin(state.clock.elapsedTime * 6);
      c.lit.copy(c.warnLit).multiplyScalar(pulse).lerp(c.flowLit, ok);
      light.current.color.copy(c.off).lerp(c.lit, testing);
    }
    if (patch.current) {
      patch.current.visible = travel > 0 && travel < 1;
      route.getPointAt(Math.min(travel, 0.999), patch.current.position);
    }
    if (cable.current) cable.current.visible = travel > 0 && ok < 1;
  });

  return (
    <>
      <group ref={group} position={TWIN} visible={false}>
        <mesh geometry={geometry}>
          <meshBasicMaterial ref={face} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial ref={line} transparent opacity={0} toneMapped={false} />
        </lineSegments>
        <mesh position={[0.2, 0.55, CABINET.d / 2 + 0.01]}>
          <boxGeometry args={[0.22, 0.08, 0.02]} />
          <meshBasicMaterial ref={light} color={c.off} toneMapped={false} />
        </mesh>
      </group>
      <group ref={cable} visible={false}>
        <Line points={[route.v1, route.v2]} color={palette.warn} lineWidth={1.5} dashed dashSize={0.18} gapSize={0.12} />
      </group>
      <mesh ref={patch} visible={false}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshBasicMaterial color={c.patch} toneMapped={false} />
      </mesh>
    </>
  );
}

export function Matiz({ palette }: { palette: Palette }) {
  return (
    <group>
      {ZONES.map((z, i) => (
        <ZoneBox key={i} zone={z} palette={palette} />
      ))}
      <Gates palette={palette} />
      <Sensor palette={palette} />
      <Twin palette={palette} />
    </group>
  );
}
