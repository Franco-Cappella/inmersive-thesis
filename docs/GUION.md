# Guion: capítulo por capítulo

Cada capítulo tiene **una idea**, **una figura** en HTML (se lee sin 3D) y **un movimiento** del mundo 3D. La presentación oral de 5 a 9 minutos usa estas mismas paradas (`← →` en modo presentación).

Texto: título de 3 a 8 palabras y una bajada de una o dos oraciones, en prosa. Datos y citas tal como están en la tesina.

| # | Capítulo (tesina) | Figura en pantalla | Qué hace el 3D | Estado |
|---|---|---|---|---|
| hero | Pregunta y tríada CIA/AIC (Sección 1) | Ficha IT/OT con cartel de paletas y prioridades que se reordenan | Pirámide C·I·A: gira y baja de IT a OT | **Hecho** |
| 01 | Escenario hipotético: el parche que apagó la planta | Reloj 03:14 → +3 h. Marcado como *hipotético* | El parche baja de un rack al PLC; HMI en blanco, flujo cortado, válvula ámbar → rojo, baliza ESD | **Hecho** |
| 02 | Industria 4.0: se rompe el air gap | Antes / después: bloques IT y OT separados y unidos | Borde del air gap entre los dos pisos; bajan enlaces (racks y nube → PLC, tanque, válvula), el borde pasa a ámbar y cruzan paquetes | **Hecho** |
| 03 | Protocolos que confían en cualquiera | Trama Modbus con sus campos en hexadecimal | Primer plano de un PLC que ejecuta una trama sin identificar al emisor | Pendiente 3D |
| 04 | La pregunta y la apuesta | Pregunta, hipótesis, refutación y sostén | Sin escena nueva: la pirámide queda de fondo, atenuada | Hecho en HTML |
| 05 | Tres controles IT, tres formas de parar | Parche, escaneo y MFA como tres golpes sobre la planta | Tres golpes sobre la misma planta: SCADA apagado, PLC en rojo, reloj de latencia | Pendiente 3D |
| 06 | Lo que cuesta una hora detenida | Cifras grandes: USD 125.000 y USD 2,3 M | Un contador corre en la sala de control (las cifras en HTML) | Hecho en HTML |
| 07 | Cuatro casos que no se leen en bloque | Colonial Pipeline, Oldsmar, Stuxnet, Industroyer (cada uno se enciende cuando actúa) | Un caso por tramo: Colonial (racks en rojo, corte y planta detenida), Oldsmar (ámbar a la válvula), Stuxnet e Industroyer (rojo hasta un PLC) | **Hecho** |
| 08 | La puerta de entrada es IT | Barras SANS 2024 (45,8 % compromiso en IT) | El 3D se atenúa y el gráfico toma la pantalla | Hecho en HTML |
| 09 | No es la seguridad: es el trasplante | Tres pilares: zonas y conductos, monitoreo pasivo, probar antes de parchear (cada uno se enciende cuando actúa) | Un pilar por tramo: la DMZ y las zonas frenan los recorridos de los casos; un sensor pasivo escucha un puerto espejo; un gemelo digital valida el parche | **Hecho** |
| 10 | Confirmada, con matiz | Cita de cierre | La cámara sube y se aleja: la torre entera (oficina, DMZ y planta) sigue operando, segmentada, y la pirámide AIC se rearma capa por capa | **Hecho** |
| refs | Bibliografía y declaración de IA | Lista con verificaciones marcadas | Sin 3D | Hecho |

## Cómo se agrega la escena de un capítulo

1. En `src/content/story.ts`, al capítulo: `weight` (cuántas pantallas dura), `camara` (`landscape` y `portrait`) y `fx` (solo lo que cambia; se hereda el resto).
2. Si hace falta un estado nuevo, sumarlo a `SceneFx` y a `FX_INICIAL` (mismo archivo).
3. La escena va en `src/three/scenes/` y lee `rig.fx` en `useFrame`. Se monta en `src/three/Experience.tsx`.
4. El director (`src/scroll/useStoryTimeline.ts`) ya mueve la cámara durante la entrada del capítulo y anima los `fx` durante la estadía. No hay que tocarlo.
5. `fx.dim = 1` tapa el 3D con el velo (capítulos sin escena). Un capítulo con escena propia tiene que volver a `dim: 0`.
6. Convención del director: lo que un capítulo **apaga** (un valor que baja, por ejemplo la planta detenida del 01) se resetea durante la entrada; lo que **prende** (un valor que sube) actúa durante la estadía, con el panel fijo.
7. `fx.triad` guarda la pirámide del hero (el 01 la pone en 0). Si un capítulo la quiere de vuelta (la postura final), la pone en 1.
8. Si el texto del panel tiene que moverse al ritmo de la escena (como el reloj del 01), los tiempos van en `src/scroll/timing.ts` y se usan en las dos capas.

## Movimientos por capítulo (para el 3D pendiente)

- **01 · escenario (hecho).** La planta desde arriba. El parche baja como un paquete ámbar por un cable desde un rack hasta el gabinete PLC. La HMI pasa de azul a un cuadro blanco, el flujo se corta, la válvula de alivio pasa de ámbar a rojo y se enciende la baliza de parada de emergencia.
- **02 · convergencia (hecho).** Vista de los dos pisos. Primero aparece el borde del air gap (en tinta); después bajan tres enlaces (dos desde los racks de la oficina y uno desde la nube, fuera de cuadro) hasta el gabinete PLC, la válvula y un tanque; el borde pasa a ámbar y los paquetes cruzan hacia la planta.
- **03 · protocolos.** La cámara entra en un gabinete PLC. Una trama llega en texto plano; el PLC la ejecuta y la válvula se mueve sin que se identifique nadie.
- **05 · controles.** Tres impactos en secuencia sobre la planta. Latencia representada como un reloj que corre y una presión que sube.
- **07 · casos (hecho).** Un caso por tramo de la estadía, sincronizado con la lista del texto. Colonial Pipeline: los racks de la oficina se ponen en rojo, la empresa corta los enlaces (pasan a gris) y la planta se detiene sin que el rojo baje. Oldsmar: recorrido en **ámbar** (exposición, no ataque comprobado) desde el acceso remoto hasta la válvula. Stuxnet e Industroyer: recorridos rojos hasta un controlador cada uno, que pasa a alarma.
- **09 · matiz (hecho).** Misma vista que el 07, con los recorridos de los casos todavía ahí. Un pilar por tramo de la estadía, sincronizado con la lista del texto. Zonas y conductos: la DMZ se cierra sobre el air gap (el borde punteado del 02 se apaga), aparecen las zonas (oficina y dos celdas de planta) y una compuerta en cada enlace legítimo; cada recorrido se retrae hasta la DMZ y queda una marca donde se frenó; los controladores y la válvula vuelven a la normalidad, los racks de la oficina siguen en rojo. Escuchar en vez de golpear: un puerto espejo en un enlace le copia el tráfico a un sensor pasivo, que no le envía nada a la red. Probar antes de parchear: el parche baja de la DMZ a un gemelo digital del controlador, que pasa de prueba (ámbar) a validado (azul).
- **10 · postura (hecho).** La cámara sube y se aleja hasta ver la torre entera: los racks de la oficina siguen en rojo, los ataques frenados sobre la DMZ y la planta funcionando, con sus compuertas, el sensor y el gemelo. Durante la estadía, la pirámide vuelve donde terminó el hero y se rearma capa por capa en el orden de prioridad de OT: A, I, C.

## Reglas de movimiento

- La cámara y los estados 3D se mueven con el scroll (`scrub`), nunca con tiempo fijo.
- Los títulos entran con SplitText por línea (0,9 s); los párrafos con un stagger corto.
- En reduced motion no hay interpolación: cada capítulo salta a su estado final, con fundidos de 200 ms.
- Nada se mueve en bucle salvo los LEDs de los racks y el paquete de la cañería, que son ambientales y sutiles.
- En el modo presentación, cada → lleva a la siguiente parada (`src/content/stops.ts`). Las escenas que actúan por tramos (los casos del 07, los pilares del 09) tienen una parada al final de cada tramo, así la persona que expone cuenta un caso por vez. El viaje dura 1,2 s por pantalla recorrida (entre 1,2 y 3,2 s).
