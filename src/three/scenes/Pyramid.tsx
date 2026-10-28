"use client";

import { Edges, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, CylinderGeometry, Group, MathUtils, Mesh, MeshStandardMaterial } from "three";
import { hero } from "@/content/hero";
import { PYRAMID_Y, rig } from "@/scroll/rig";
import { FONT_URL, bell, easeOutBack, range, smooth } from "../helpers";
import type { Palette } from "../palette";

// La tríada como pirámide de tres capas. En IT (flip = 0) la punta es Confidencialidad;
// al girar 180° sobre el eje X queda invertida y Disponibilidad pasa a estar arriba.
// Cada capa conserva su identidad: lo que cambia es el orden, igual que en la tesina.

const H = 1; // altura de cada capa
const GAP = 0.14; // separación entre capas en reposo
const A_BASE = 1.75; // semilado de la base
const apothem = (y: number) => (A_BASE * (1.5 - y)) / 3; // pirámide continua de y = 1.5 a y = -1.5

type Layer = {
  id: "c" | "i" | "a";
  letra: string;
  y: number; // centro de la capa
  offset: number; // separación en reposo (punta hacia arriba, base hacia abajo)
  aTop: number;
  aBot: number;
  labelY: number; // altura local de la letra (la punta es angosta: va más abajo)
  labelSize: number;
  dropStart: number; // orden del armado inicial: primero la base
};

const LAYERS: Layer[] = hero.triada.map((t, i) => {
  const yTop = 1.5 - i * H;
  const yBot = yTop - H;
  return {
    id: t.id as Layer["id"],
    letra: t.letra,
    y: (yTop + yBot) / 2,
    offset: (1 - i) * GAP,
    aTop: apothem(yTop),
    aBot: apothem(yBot),
    labelY: i === 0 ? -0.2 : -0.02,
    labelSize: i === 0 ? 0.4 : 0.56,
    dropStart: (2 - i) * 0.17,
  };
});

// Posición y rotación de la letra sobre la cara frontal (+Z) o trasera (-Z) de una capa.
// La trasera se monta "dada vuelta": después del giro de 180° queda derecha y mirando a cámara.
function faceLabel(l: Layer, side: 1 | -1) {
  const theta = Math.atan((l.aBot - l.aTop) / H);
  const z = (l.aTop + l.aBot) / 2 - l.labelY * Math.tan(theta) + 0.012;
  return {
    position: [0, l.labelY, side * z] as [number, number, number],
    rotation: [side === 1 ? -theta : Math.PI + theta, 0, 0] as [number, number, number],
  };
}

function PyramidLayer({ layer, index, palette }: { layer: Layer; index: number; palette: Palette }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);
  const edges = useRef<{ material: { color: Color } }>(null);
  const geometry = useMemo(
    () => new CylinderGeometry(layer.aTop * Math.SQRT2, layer.aBot * Math.SQRT2, H, 4, 1, false, Math.PI / 4),
    [layer],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  const c = useMemo(
    () => ({
      surface: new Color(palette.surface),
      flow: new Color(palette.flow),
      warn: new Color(palette.warn),
      ink: new Color(palette.ink),
      tmp: new Color(),
    }),
    [palette],
  );

  useFrame(() => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;
    const { flip, intro } = rig.hero;
    const spread = bell(flip); // 0 en reposo, 1 a mitad del giro
    const drop = 1 - easeOutBack(range(intro, layer.dropStart, layer.dropStart + 0.5));
    m.position.y = layer.y + layer.offset * (1 + spread * 4.2) + drop * 7;
    m.rotation.y = (1 - index) * spread * 0.55; // la punta y la base giran en sentidos opuestos
    // fx.triad: los capítulos guardan la pirámide y el 10 la rearma capa por capa, en el orden de
    // prioridad de OT (A, I, C). En el hero vale 1 y no cambia nada.
    const pop = easeOutBack(range(rig.fx.triad, layer.dropStart, layer.dropStart + 0.5));
    m.visible = pop > 0.001;
    m.scale.setScalar(Math.max(0.001, pop));

    // Color = estado: azul en la prioridad N° 1 de cada mundo, ámbar durante el choque.
    const first = layer.id === "c" ? 1 - smooth(flip, 0.3, 0.5) : layer.id === "a" ? smooth(flip, 0.5, 0.7) : 0;
    const clash = bell(range(flip, 0.22, 0.78));
    mat.color.copy(c.surface).lerp(c.flow, first * 0.82).lerp(c.warn, clash * 0.45);
    mat.emissive.copy(c.flow).lerp(c.warn, clash);
    mat.emissiveIntensity = first * 1.6 + clash * 0.45; // poco emisivo en el choque: que se lea el volumen
    if (edges.current) edges.current.material.color.copy(c.ink).lerp(c.warn, clash);
  });

  const front = faceLabel(layer, 1);
  const back = faceLabel(layer, -1);
  return (
    <mesh ref={mesh} geometry={geometry} position={[0, layer.y + layer.offset, 0]}>
      <meshStandardMaterial
        ref={material}
        color={palette.surface}
        roughness={palette.rough}
        metalness={palette.metalness}
        flatShading
      />
      <Edges ref={edges as never} threshold={20} color={palette.edge[0]} lineWidth={1.4} transparent opacity={palette.edge[1]} />
      <Text font={FONT_URL} fontSize={layer.labelSize} color={palette.ink} anchorX="center" anchorY="middle" {...front}>
        {layer.letra}
      </Text>
      <Text font={FONT_URL} fontSize={layer.labelSize} color={palette.ink} anchorX="center" anchorY="middle" {...back}>
        {layer.letra}
      </Text>
    </mesh>
  );
}

export function Pyramid({ palette }: { palette: Palette }) {
  const lift = useRef<Group>(null);
  const yaw = useRef<Group>(null);
  const tumble = useRef<Group>(null);
  useFrame((state) => {
    if (!lift.current || !yaw.current || !tumble.current) return;
    const { flip, descent } = rig.hero;
    const t = rig.snap ? 0 : state.clock.elapsedTime;
    lift.current.position.y = MathUtils.lerp(PYRAMID_Y.it, PYRAMID_Y.ot, descent) + Math.sin(t * 0.9) * 0.06;
    // Los capítulos usan la planta: la pirámide se guarda y vuelve si un capítulo la pide (cada capa escala sola).
    lift.current.visible = rig.fx.triad > 0.001;
    yaw.current.rotation.y = -0.38 + Math.sin(t * 0.25) * 0.16 + bell(flip) * 0.9;
    // Gira hacia adelante: a mitad del giro la punta apunta a la cámara y las tres capas se ven como
    // cuadrados concéntricos que rotan entre sí. Hacia atrás, la base quedaba de frente como un cuadrado
    // plano que tapaba el cuadro. El final es el mismo (180° para un lado o para el otro).
    tumble.current.rotation.x = Math.PI * flip;
  });
  return (
    <group ref={lift} position={[0, PYRAMID_Y.it, 0]}>
      <group ref={yaw}>
        <group ref={tumble}>
          {LAYERS.map((l, i) => (
            <PyramidLayer key={l.id} layer={l} index={i} palette={palette} />
          ))}
        </group>
      </group>
    </group>
  );
}
