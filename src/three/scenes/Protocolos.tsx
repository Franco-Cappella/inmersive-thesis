"use client";

import { Billboard, Line, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Group, MeshBasicMaterial } from "three";
import { chapters } from "@/content/story";
import { rig } from "@/scroll/rig";
import { bell, FONT_URL, glow, range, smooth } from "../helpers";
import type { Palette } from "../palette";
import { pipePath } from "../paths";
import { frameAccepted } from "../signals";
import { ROUTE } from "./Escenario";
import { PLC_POS } from "./OTFloor";

// Capítulo 03 · "Protocolos que confían en cualquiera". Línea de tiempo dentro de la estadía (fx.frame de 0 a 1):
//   0.00–0.48  la trama Modbus de la figura baja por el cable del 01, con sus bytes a la vista (texto plano)
//   0.48–0.56  entra al gabinete PLC
//   0.50–0.62  el PLC la acepta: su luz destella, sin pedir usuario, clave ni firma (frameAccepted)
//   0.58–0.92  la válvula gira (OTFloor vía valveTurn)

// Los bytes salen del contenido (la misma trama que muestra el texto del capítulo), en dos renglones:
// la cabecera MBAP (transacción, protocolo, longitud y unidad) y la orden (función, dirección y valor).
const figura = chapters.find((c) => c.id === "protocolos")?.figura;
const campos = figura?.tipo === "trama" ? figura.campos.map((c) => c.hex) : [];
const BYTES = `${campos.slice(0, 4).join(" ")}\n${campos.slice(4).join(" ")}`;

const [px, py, pz] = PLC_POS;
const START = 0.42; // la trama aparece ya dentro del cuadro, a mitad del tramo vertical del cable
const CARD = { w: 1.15, h: 0.34 };

function FrameCard({ palette }: { palette: Palette }) {
  const curve = useMemo(() => pipePath(ROUTE, 0.45), []);
  const points = useMemo(() => curve.getSpacedPoints(80).slice(Math.floor(START * 80)), [curve]);
  const card = useRef<Group>(null);
  const cable = useRef<Group>(null);
  const border = useMemo(() => glow(palette.warn, 1.6), [palette]);

  useFrame(() => {
    const f = rig.fx.frame;
    const travel = range(f, 0.04, 0.48);
    const enter = smooth(f, 0.48, 0.56); // entra al gabinete
    if (card.current) {
      card.current.visible = f > 0.02 && enter < 1;
      curve.getPointAt(Math.min(0.999, START + (1 - START) * travel), card.current.position);
      card.current.position.y += 0.3 * (1 - enter); // flota sobre el cable y baja al entrar
      card.current.scale.setScalar(Math.max(0.001, smooth(f, 0.02, 0.08) * (1 - enter)));
    }
    if (cable.current) cable.current.visible = f > 0.02 && f < 0.6;
  });

  return (
    <>
      <group ref={cable} visible={false}>
        <Line points={points} color={palette.warn} lineWidth={1.2} dashed dashSize={0.18} gapSize={0.12} />
      </group>
      <group ref={card} visible={false}>
        <Billboard>
          <mesh>
            <planeGeometry args={[CARD.w + 0.04, CARD.h + 0.04]} />
            <meshBasicMaterial color={border} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[CARD.w, CARD.h]} />
            <meshBasicMaterial color={palette.field} toneMapped={false} />
          </mesh>
          <Text
            font={FONT_URL}
            fontSize={0.085}
            lineHeight={1.35}
            textAlign="center"
            color={palette.ink}
            anchorX="center"
            anchorY="middle"
            position={[0, 0, 0.004]}
          >
            {BYTES}
          </Text>
        </Billboard>
      </group>
    </>
  );
}

// El PLC acepta la trama: su luz de estado destella. Nadie le preguntó quién la mandaba.
function AcceptFlash() {
  const material = useRef<MeshBasicMaterial>(null);
  const white = useMemo(() => new Color("#ffffff").multiplyScalar(2.6), []);
  useFrame(() => {
    if (!material.current) return;
    const v = bell(range(rig.fx.frame, 0.5, 0.64)) * frameAccepted();
    material.current.opacity = v;
    material.current.visible = v > 0.01;
  });
  return (
    <mesh position={[px + 0.2, py + 0.55, pz + 0.315]}>
      <planeGeometry args={[0.3, 0.14]} />
      <meshBasicMaterial ref={material} color={white} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export function Protocolos({ palette }: { palette: Palette }) {
  return (
    <group>
      <FrameCard palette={palette} />
      <AcceptFlash />
    </group>
  );
}
