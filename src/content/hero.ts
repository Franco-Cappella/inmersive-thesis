import type { SourceKey } from "./references";

// Datos generales del sitio.
export const site = {
  titulo: "La tríada invertida",
  autor: "Franco",
  nombre: ["Franco", "Capela"], // el nombre completo, grande en el pie

  anio: 2026,
  descripcion:
    "Recorrido inmersivo de la tesina sobre por qué las estrategias de ciberseguridad IT fracasan al aplicarse sin adaptación en los entornos OT de plantas industriales.",
};

export type Mundo = "it" | "ot";

export type FilaFicha = {
  rotulo: string;
  it: string;
  ot: string;
  fuentes?: SourceKey[];
};

// Hero: la tabla "El dilema ontológico: la tríada invertida" (Sección 1), condensada.
export const hero = {
  pregunta: "¿Por qué la ciberseguridad IT fracasa al entrar a la planta industrial?",
  guia: "Scrolleá para bajar de IT a OT",
  cierre: "Prioridades diametralmente opuestas.",
  mundos: {
    it: { sigla: "IT", nombre: "Tecnología de la información", lema: "Protege datos" },
    ot: { sigla: "OT", nombre: "Tecnología operativa", lema: "Mueve procesos físicos" },
  },
  // Las tres letras son las mismas en los dos mundos: lo que cambia es el orden.
  triada: [
    { id: "c", letra: "C", nombre: "Confidencialidad", it: 1, ot: 3 },
    { id: "i", letra: "I", nombre: "Integridad", it: 2, ot: 2 },
    { id: "a", letra: "A", nombre: "Disponibilidad", it: 3, ot: 1 },
  ],
  ficha: [
    { rotulo: "Protege", it: "Datos y privacidad", ot: "El proceso físico, 24 h × 365 días" },
    { rotulo: "Equipos", it: "Windows · Linux", ot: "PLC · RTU · RTOS" },
    { rotulo: "Vida útil", it: "3 a 5 años", ot: "15 a 30 años" },
    {
      rotulo: "Parches",
      it: "Continuos",
      ot: "Probados antes, en ventana de mantenimiento",
      fuentes: ["nist-800-82r3"],
    },
  ] satisfies FilaFicha[],
  // Tabla completa de la tesina, textual: es el contenido real para lectores de
  // pantalla y para el modo lectura. La versión animada del hero es decorativa.
  tabla: {
    caption: "Prioridades y entorno de la ciberseguridad IT y OT (tabla de la Sección 1 de la tesina)",
    filas: [
      {
        dimension: "Prioridad N° 1",
        it: "Confidencialidad: proteger datos corporativos, propiedad intelectual y privacidad contra accesos no autorizados.",
        ot: "Disponibilidad: garantizar que el proceso físico opere de forma ininterrumpida las 24 horas del día, los 365 días del año.",
      },
      {
        dimension: "Prioridad N° 2",
        it: "Integridad: asegurar que la información almacenada o en tránsito no sea alterada.",
        ot: "Integridad: prevenir alteraciones en los comandos que modifiquen parámetros físicos (temperatura, velocidad, presión).",
      },
      {
        dimension: "Prioridad N° 3",
        it: "Disponibilidad: aceptar tolerancias de reinicio o desconexión en servidores para tareas de mantenimiento.",
        ot: "Confidencialidad: importante, pero secundaria frente al riesgo inminente de daño físico o pérdida de vidas humanas.",
      },
      {
        dimension: "Entorno operativo",
        it: "Sistemas operativos dinámicos (Windows, Linux), ciclos de vida de 3 a 5 años y parches continuos.",
        ot: "Dispositivos empotrados legados (PLCs, RTUs), ciclos de vida de 15 a 30 años y sistemas operativos en tiempo real (RTOS).",
      },
    ],
  },
};

// Descripción en texto de la figura del hero (el Canvas es decorativo y aria-hidden).
export const heroFigura =
  "Una pirámide de tres capas: arriba Confidencialidad, en el medio Integridad y en la base Disponibilidad. Al bajar de IT a OT la pirámide gira 180 grados y queda invertida: Disponibilidad pasa a estar arriba y Confidencialidad abajo.";
