# Pendientes de rigor en la tesina

Revisión de `docs/fuente/TESINA_FINAL.md` contra las figuras y las fuentes. Lo que está acá **bloquea la presentación** hasta resolverse, porque el sitio cita la tesina tal cual.

## 1 · Las figuras no coinciden con sus pies de figura (importante)

La tesina dice "Figura 3" y "Figura 4" con dos imágenes, pero las imágenes embebidas son otras:

| Pie en la tesina | Imagen real |
|---|---|
| Figura 3: *Arquitectura de ciberseguridad industrial basada en el Modelo Purdue y la segmentación por Zonas y Conductos* | Un gráfico SANS: *"¿Cuántos años de experiencia tiene en ciberseguridad ICS/OT?"* (1–5 años: 38,7 %) |
| Figura 4: *Comparativa de visibilidad: escaneo activo frente a monitoreo pasivo con DPI* | Un gráfico SANS: *"¿Qué certificaciones de ciberseguridad ICS/OT tiene?"* |

Para la figura 3 hace falta el diagrama de zonas y conductos (o citar el gráfico que realmente se usa). La figura 4 tiene que ser una comparativa de visibilidad, o eliminarse.

**Acción:** reemplazar las imágenes o corregir los pies. El sitio **no** usa las figuras 3 y 4.

## 2 · Atribución de la figura 1

La primera imagen es un diagrama de niveles 0 a 5 con DMZ industrial (estilo Rockwell / Cisco). La tesina la atribuye a un blog de NIST. Verificar en la fuente original y citar al autor real del diagrama.

## 3 · El escenario de apertura se lee como un hecho

"¿El resultado? Una válvula de alivio trabada... pérdidas estimadas en $180,000 USD. Ningún ciberataque tuvo lugar esa noche." Por el tono suena a caso real. Si es hipotético, decirlo en el texto ("Imaginemos…" ya aparece al principio, pero el cierre no). El sitio lo rotula como *escenario hipotético*.

## 4 · Afirmaciones sin fuente

- La tabla de vida útil: "ciclos de vida de 3 a 5 años" (IT) y "15 a 30 años" (OT).
- Las tres características de los protocolos industriales (sin autenticación, texto plano, pilas frágiles).
- Los tres mecanismos de la Sección 2 (parche, escaneo, MFA).
- La tríada AIC (Disponibilidad, Integridad, Confidencialidad) como "tríada invertida".
- ISA/IEC 62443 se cita sin año ni parte (por ejemplo IEC 62443-3-2, zonas y conductos).

## 5 · Sobre Oldsmar

La tesina cuenta bien el cambio de versión (la conclusión oficial nunca se publicó). Conviene dejar una frase explícita de que el caso se usa como ejemplo de **exposición**, no como ataque comprobado. El sitio lo dice así.

## 6 · Datos a confirmar contra la fuente original

No se pudieron abrir las webs de origen desde el entorno de desarrollo (bloqueadas), así que lo siguiente quedó sin verificar en el texto:

- ABB 2023 "Value of Reliability": 3.215 respondentes y mediana de USD 125.000 por hora.
- Siemens TCOD 2024: USD 2,3 M por hora en automotriz.
- SANS 2024: 45,8 % de compromiso en IT (este dato sí coincide con el gráfico).
- Testimonio de Blount ante el Senado (8 de junio de 2021).
- Títulos, autores y fechas exactos de BBC Mundo (Stuxnet), WeLiveSecurity (Industroyer) y Tampa Bay Times (Oldsmar).
- NIST SP 800-82 Rev. 3: autores y año.

## 7 · Formato de referencias

La tesina no tiene lista de referencias formal, solo enlaces en el texto. `src/content/references.ts` la arma en estilo APA 7, con `verificar` en cada entrada dudosa. Antes de entregar, pasarla al formato que pida la cátedra.

## 8 · Datos de portada

Falta el título oficial, la institución, la materia, el año y el apellido. El sitio muestra "Tesina · Franco · 2026" como provisorio.

## 9 · Frase de la declaración de IA

Dice "Gemini(Google)" sin espacio. Corregir el texto al pasar a la versión final.
