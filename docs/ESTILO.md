# Dirección de arte

## Regla central

**El color significa estado, nunca decoración.** Inspirado en las HMI de alto rendimiento (ISA-101): el campo es gris, la maqueta es neutra y el color aparece solo cuando algo es normal o anormal.

| Token | Significado | Dónde aparece |
|---|---|---|
| `--c-flow` azul | Proceso normal, prioridad N° 1 | Prioridad de cada mundo, flujo de las cañerías |
| `--c-warn` ámbar | Advertencia, choque de prioridades | Pendientes de fuente, el momento del giro |
| `--c-alarm` rojo | Alarma, ataque | Golpes de los controles, recorridos de los casos |
| grafito / gris | Todo lo demás | Texto, racks, tanques |

## Los tres estudios

Los tres están implementados en `src/styles/tokens.css` y `src/three/palette.ts`. Se eligen con el selector del encabezado o con `?estudio=`.

| Estudio | Campo | Material | Luz | Tipografía del display | Cuándo conviene |
|---|---|---|---|---|---|
| **Sala de control** (default) | gris HMI `#c9ccce` | mate, rugoso | difusa, sin sombras duras | Archivo condensado, 800 | Lo más fiel a la industria y a la norma ISA-101 |
| **Plano P&ID** | papel `#eeede7` | tinta sobre papel | plana, casi sin sombra | Archivo ancho, mayúsculas | Lo más académico; buena impresión |
| **Planta de noche** | campo `#0f1316` | metal mojado, reflejos | sodio ámbar y niebla | Archivo condensado, 900 | Lo más llamativo; lo más común en el género "ciberseguridad", por eso va último |

**Recomendación:** Sala de control. Es sobria, usa el color como lenguaje y no depende de un fondo oscuro. Plano P&ID queda como respaldo para imprimir.

## Clichés prohibidos

- Hacker con capucha, lluvia de código tipo Matrix, binario `0101`.
- Candados o escudos brillantes, globo azul con arcos.
- Neón cyberpunk, calaveras y glitch como recurso permanente.
- Marcas de diseño genérico: etiquetas en mayúsculas sobre cada título, una palabra del título en otro color, tarjetas idénticas con sombra, flechas `→` en cada botón.

## Tipografía

- **Display:** Archivo Variable, con el eje de ancho (`wdth`) para la rotulación industrial.
- **Texto:** Source Serif 4 Variable, académica y legible.
- **Cifras:** `tabular-nums` en datos y contadores.
- **Monoespaciada:** solo en la trama Modbus.
- Cuerpo de 16 px como mínimo y líneas de menos de 68 caracteres.

## Movimiento de interfaz

Siguiendo el criterio de Emil Kowalski: entradas con `cubic-bezier(0.23, 1, 0.32, 1)`, nada de `ease-in`, nada de `transition: all`, menos de 300 ms. Los toggles `L` y `P` cambian sin animación. El scroll narrativo sí puede durar más porque es el cambio de "diapositiva".
