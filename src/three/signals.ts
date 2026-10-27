import { CASOS_TRAMOS, CONFLICTO_TRAMOS, MATIZ_TRAMOS } from "@/scroll/timing";
import { rig } from "@/scroll/rig";
import { range, smooth } from "./helpers";

// Señales derivadas de rig.fx que comparten varias escenas (planta, enlaces y casos).
// Se leen en useFrame: nunca pasan por React.

// Progreso 0..1 del golpe i del capítulo 05 (0 parche automático, 1 escaneo activo, 2 MFA en plena alarma).
export const hitBeat = (i: number) => range(rig.fx.hits, CONFLICTO_TRAMOS[i][0], CONFLICTO_TRAMOS[i][1]);

// Cada golpe dura su tramo: cuando empieza el siguiente, la planta se repone (son tres formas distintas de parar).
const hitHold = (i: number, a: number, b: number) => {
  const next = CONFLICTO_TRAMOS[i + 1]?.[0];
  return smooth(hitBeat(i), a, b) * (next === undefined ? 1 : 1 - smooth(rig.fx.hits, next, next + 0.04));
};

// 05, parche: el servidor SCADA se reinicia (la HMI se apaga) y, sin datos, salta la parada de emergencia.
export const scadaReboot = () => hitHold(0, 0.3, 0.42);
export const esdTrip = () => hitHold(0, 0.5, 0.62);

// 05, escaneo: la ráfaga satura la pila TCP/IP del controlador de la izquierda y lo deja bloqueado.
export const scanLock = () => hitHold(1, 0.55, 0.7);

// 05, MFA: el reloj del token corre mientras sube la presión; cuando termina, ya es tarde.
export const tokenWait = () => range(hitBeat(2), 0.1, 0.75);
export const overpressure = () => hitHold(2, 0.72, 0.85);

// 05: en cada golpe la planta se detiene.
const hitStop = () => Math.max(esdTrip(), hitHold(1, 0.65, 0.8), overpressure());

// Progreso 0..1 del caso i del capítulo 07 (0 Colonial, 1 Oldsmar, 2 Stuxnet, 3 Industroyer).
export const caseBeat = (i: number) => range(rig.fx.attack, CASOS_TRAMOS[i][0], CASOS_TRAMOS[i][1]);

// Colonial Pipeline: el ransomware queda en IT (los racks en rojo, y así se quedan).
export const itInfection = () => smooth(caseBeat(0), 0, 0.45);

// Colonial Pipeline: la empresa corta los enlaces con la planta y la detiene por decisión.
// Dura solo su tramo: cuando empieza Oldsmar, la planta vuelve a funcionar.
export const colonialCut = () =>
  smooth(caseBeat(0), 0.45, 0.65) * (1 - smooth(rig.fx.attack, CASOS_TRAMOS[1][0], CASOS_TRAMOS[1][0] + 0.04));

// Progreso 0..1 del pilar i del capítulo 09 (0 zonas y conductos, 1 monitoreo pasivo, 2 gemelo digital).
export const pillarBeat = (i: number) => range(rig.fx.zones, MATIZ_TRAMOS[i][0], MATIZ_TRAMOS[i][1]);

// 09: la DMZ se cierra sobre el air gap (reemplaza al borde punteado del 02).
export const dmzShown = () => smooth(pillarBeat(0), 0, 0.2);

// 09: cuánto bloquea la segmentación. Los recorridos de los casos se cortan en la compuerta
// y lo que estaba comprometido en la planta vuelve a la normalidad. IT sigue con su incidente.
export const segmentation = () => smooth(pillarBeat(0), 0.3, 0.8);

// Oldsmar: la válvula queda expuesta (advertencia, no alarma: el caso quedó en discusión).
export const oldsmarExposure = () => smooth(caseBeat(1), 0.55, 0.75) * (1 - segmentation());

// Stuxnet (gabinete 0, a la derecha) e Industroyer (gabinete 1, a la izquierda): el controlador en alarma.
// También el de la izquierda cuando lo bloquea el escaneo del 05.
export const plcCompromised = (cabinet: number) =>
  Math.max(smooth(caseBeat(cabinet === 0 ? 2 : 3), 0.55, 0.75) * (1 - segmentation()), cabinet === 1 ? scanLock() : 0);

// El proceso corre cuando llegamos a la planta; se corta si la planta se detiene (01), en cada golpe (05)
// o por la decisión de Colonial (07).
export const plantFlow = () =>
  smooth(rig.hero.descent, 0.45, 0.95) * (1 - smooth(rig.fx.halt, 0.55, 0.75)) * (1 - hitStop()) * (1 - colonialCut());
