# Día de la defensa

Lista adaptada de la sección 14 de la skill a este proyecto (Next.js en export estático, carpeta `out/`). La exposición es de Franco: este documento ordena el recorrido y los respaldos, no dice qué decir.

## Antes del día

- [ ] `npm run build` y copiar la carpeta `out/` a un pendrive (y a la compu de la defensa, si se puede).
- [ ] En la compu de la defensa, un servidor estático que funcione **sin internet**. Cualquiera de estos sirve (los dos se probaron con el recorrido completo):
  - `npx serve out` (Node). Ojo: `npx` baja `serve` la primera vez; correrlo una vez con internet antes, o instalarlo con `npm i -g serve`.
  - `python3 -m http.server 8000` parado adentro de `out/` y abrir `http://localhost:8000`.
  - `file://` (doble clic en `index.html`) **no** sirve: los módulos de JavaScript necesitan un servidor.
- [ ] Con el sitio servido y **el wifi apagado**: `node scripts/offline.cjs http://localhost:PUERTO` (ver el README). Tiene que decir "externos: 0" y llegar hasta "Ref" con la consola limpia.
- [ ] Ensayo con el proyector o la resolución real, en `?presentacion&ensayo`: el cronómetro arranca con la primera flecha, muestra la parada actual y se pone ámbar a los 8 minutos y rojo a los 9. La tabla de abajo propone un reparto. El día de la defensa, abrir sin `&ensayo`.
- [ ] Si la compu no sostiene el 3D (se ve entrecortado): abrir con `?calidad=baja`; si tampoco, `?calidad=estatica` o `?lectura`.
- [ ] Grabar el video de respaldo en esa misma compu: `node scripts/video.cjs http://localhost:PUERTO video 4` y pasarlo a mp4 (README).
- [ ] Tener abierta la tesina: cada dato del sitio sale de ahí, con su fuente en Referencias.
- [ ] Si el jurado quiere el sitio en papel: `node scripts/pdf.cjs http://localhost:PUERTO tesina-sitio.pdf` (el modo lectura en A4).

## El recorrido en el modo presentación

`P` (o `?presentacion`) y después `→` / `←`, o un control remoto que mande esas teclas. Son 27 paradas: las del hero, una por capítulo y, en los capítulos con escena, paradas extra para que la escena actúe (una por golpe en el 05, una por caso en el 07 y una por pilar en el 09). El viaje entre paradas dura entre 1,2 y 3,2 segundos según la distancia.

Si el proyector tiene poca altura (1280×720 o 1024×768), el texto de algunos capítulos no entra entero al costado de la escena: el panel sube solo, tramo a tramo, para que el golpe, el caso o el pilar que se enciende se vea completo. No hace falta hacer nada; conviene verlo una vez en el ensayo.

Los tiempos son una propuesta para repartir unos 7 a 8 minutos; se ajustan en el ensayo.

| # | Parada | Qué se ve | Tiempo sugerido |
|---|---|---|---|
| 1 | IT | La pirámide C · I · A sobre los racks: en la oficina manda la confidencialidad | 30 s |
| 2 | OT | La pirámide da vuelta y baja a la planta: manda la disponibilidad | 30 s |
| 3 | 01 · 03:14 AM | El escenario hipotético y su reloj | 20 s |
| 4 | 01 · final | El parche baja al PLC, la HMI se congela, salta la parada de emergencia | 25 s |
| 5 | 02 · Industria 4.0 | Antes y después: IT y OT separados y unidos | 15 s |
| 6 | 02 · final | Se rompe el air gap: enlaces y paquetes que cruzan a la planta | 20 s |
| 7 | 03 · Protocolos | La trama Modbus y sus tres rasgos | 15 s |
| 8 | 03 · final | La trama en texto plano llega al PLC, que la ejecuta, y la válvula gira | 20 s |
| 9 | 04 · La pregunta | Pregunta, hipótesis y qué la refutaría o la sostendría | 30 s |
| 10 | 05 · Tres controles | Los tres golpes en lista | 10 s |
| 11 | 05 · parche | La HMI se apaga y salta la parada de emergencia | 15 s |
| 12 | 05 · escaneo | La ráfaga bloquea el controlador | 15 s |
| 13 | 05 · MFA | El reloj del token corre hasta la sobrepresión | 15 s |
| 14 | 06 · Una hora detenida | USD 125.000 y USD 2,3 M (paradas por cualquier causa) | 20 s |
| 15 | 07 · Cuatro casos | La lista de casos | 10 s |
| 16 | 07 · Colonial Pipeline | Racks en rojo y la planta detenida por decisión | 15 s |
| 17 | 07 · Oldsmar | Recorrido en ámbar: exposición, caso en discusión | 15 s |
| 18 | 07 · Stuxnet | Recorrido rojo hasta un controlador | 15 s |
| 19 | 07 · Industroyer | Recorrido rojo hasta el otro controlador | 15 s |
| 20 | 08 · La puerta de entrada | Barras de la encuesta SANS 2024: el vector inicial más citado, con 45,8 %, fue un compromiso en IT que pasó a OT (selección múltiple) | 20 s |
| 21 | 09 · El trasplante | La hipótesis se matiza | 10 s |
| 22 | 09 · zonas y conductos | La DMZ y las zonas frenan los cuatro recorridos | 15 s |
| 23 | 09 · escuchar | El sensor pasivo en el puerto espejo | 15 s |
| 24 | 09 · probar | El gemelo digital valida el parche | 15 s |
| 25 | 10 · Confirmada, con matiz | La postura y la cita de cierre | 15 s |
| 26 | 10 · final | La torre entera en marcha y la pirámide A · I · C | 20 s |
| 27 | Referencias | Fuentes y declaración de uso de IA | 10 s |
| | | **Total** | **unos 7 min 50 s** |

## Respaldos, en orden

1. `?calidad=baja`: el mismo recorrido sin efectos de posprocesado.
2. `?calidad=estatica`: sin 3D; el hero en SVG y los capítulos sobre el campo liso.
3. `?lectura`: todo el texto en flujo normal, sin 3D. Sirve también para el jurado.
4. El video grabado con `scripts/video.cjs`.

## Antes de presentar el sitio

Los pendientes de rigor de `docs/PENDIENTES-TESINA.md` (sobre todo las figuras 3 y 4) se resuelven en la tesina antes de mostrar el sitio: el sitio solo condensa lo que dice la tesina.
