# Guion: capítulo por capítulo

Cada capítulo tiene **una idea**, **una figura** en HTML (se lee sin 3D) y **un movimiento** del mundo 3D. La presentación oral de 5 a 9 minutos usa estas mismas paradas (`← →` en modo presentación).

Texto: título de 3 a 8 palabras y una bajada de una o dos oraciones, en prosa. Datos y citas tal como están en la tesina.

| # | Capítulo (tesina) | Figura en pantalla | Qué hace el 3D | Estado |
|---|---|---|---|---|
| hero | Pregunta y tríada CIA/AIC (Sección 1) | Ficha IT/OT con cartel de paletas y prioridades que se reordenan | Pirámide C·I·A: gira y baja de IT a OT | **Hecho** |
| 01 | Escenario hipotético: el parche que apagó la planta | Reloj 03:14 → +3 h. Marcado como *hipotético* | Un paquete (parche) baja de la torre IT; la válvula pasa a rojo | Pendiente 3D |
| 02 | Industria 4.0: se rompe el air gap | Antes / después: bloques IT y OT separados y unidos | Hueco entre IT y OT que se cierra; paquetes cruzan | Pendiente 3D |
| 03 | Protocolos que confían en cualquiera | Trama Modbus con sus campos en hexadecimal | Primer plano de un PLC que ejecuta una trama sin identificar al emisor | Pendiente 3D |
| 04 | La pregunta y la apuesta | Pregunta, hipótesis, refutación y sostén | Sin escena nueva: la pirámide queda de fondo, atenuada | Hecho en HTML |
| 05 | Tres controles IT, tres formas de parar | Parche, escaneo y MFA como tres golpes sobre la planta | Tres golpes sobre la misma planta: SCADA apagado, PLC en rojo, reloj de latencia | Pendiente 3D |
| 06 | Lo que cuesta una hora detenida | Cifras grandes: USD 125.000 y USD 2,3 M | Un contador corre en la sala de control (las cifras en HTML) | Hecho en HTML |
| 07 | Cuatro casos que no se leen en bloque | Colonial Pipeline, Oldsmar, Stuxnet, Industroyer | La torre de red: cada caso traza su recorrido en rojo de IT hacia OT | Pendiente 3D |
| 08 | La puerta de entrada es IT | Barras SANS 2024 (45,8 % compromiso en IT) | El 3D se atenúa y el gráfico toma la pantalla | Hecho en HTML |
| 09 | No es la seguridad: es el trasplante | Tres pilares: zonas y conductos, monitoreo pasivo, probar antes de parchear | Compuertas de zona y conductos; el recorrido rojo choca y se detiene | Pendiente 3D |
| 10 | Confirmada, con matiz | Cita de cierre | La cámara se aleja: la planta sigue operando, segmentada | Pendiente 3D |
| refs | Bibliografía y declaración de IA | Lista con verificaciones marcadas | Sin 3D | Hecho |

## Movimientos por capítulo (para el 3D pendiente)

- **01 · escenario.** Plano de la planta de noche desde arriba. El parche baja como un paquete. Las HMI se apagan (color cae a gris). La válvula de alivio pasa de ámbar a rojo cuando se traba.
- **02 · convergencia.** La torre de red (niveles 5 a 0) aparece apilada. Entre IT y OT hay un hueco que se cierra con un cable de datos. Los paquetes empiezan a cruzar hacia la planta.
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
