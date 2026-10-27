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
| 07 | Cuatro casos que no se leen en bloque | Colonial Pipeline, Oldsmar, Stuxnet, Industroyer | La torre de red: cada caso traza su recorrido en rojo de IT hacia OT | Pendiente 3D |
| 08 | La puerta de entrada es IT | Barras SANS 2024 (45,8 % compromiso en IT) | El 3D se atenúa y el gráfico toma la pantalla | Hecho en HTML |
| 09 | No es la seguridad: es el trasplante | Tres pilares: zonas y conductos, monitoreo pasivo, probar antes de parchear | Compuertas de zona y conductos; el recorrido rojo choca y se detiene | Pendiente 3D |
| 10 | Confirmada, con matiz | Cita de cierre | La cámara se aleja: la planta sigue operando, segmentada | Pendiente 3D |
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
- **07 · casos.** Cada caso traza su camino en rojo desde la torre IT. En Colonial Pipeline el corte lo hace la propia empresa, sin que el ataque llegue a la planta (el rojo se apaga en el nivel OT).
- **09 · matiz.** Aparecen volúmenes de zona y conductos con compuertas. El recorrido rojo se estrella contra un conducto. Un sensor pasivo escucha una copia del tráfico.
- **10 · postura.** La cámara sube y se aleja. La pirámide AIC queda estable sobre una planta que sigue funcionando.

## Reglas de movimiento

- La cámara y los estados 3D se mueven con el scroll (`scrub`), nunca con tiempo fijo.
- Los títulos entran con SplitText por línea (0,9 s); los párrafos con un stagger corto.
- En reduced motion no hay interpolación: cada capítulo salta a su estado final, con fundidos de 200 ms.
- Nada se mueve en bucle salvo los LEDs de los racks y el paquete de la cañería, que son ambientales y sutiles.
