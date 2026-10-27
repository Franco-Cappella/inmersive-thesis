import type { Shot } from "@/scroll/rig";
import type { SourceKey } from "./references";

// Capítulos que siguen al hero. Cada uno condensa una parte de la tesina en
// una idea, una figura y una o dos oraciones. Los datos y las citas tienen que
// coincidir con TESINA_FINAL.md; lo que no tiene fuente va en `pendientes`.
// `escena` describe lo que va a mostrar el mundo 3D cuando se construya
// (docs/GUION.md) y sirve como descripción en texto de esa figura.

export type Figura =
  | {
      tipo: "reloj";
      etiqueta: string;
      pasos: { hora: string; texto: string }[];
      cierre: string;
    }
  | { tipo: "brecha"; antes: string; despues: string; consecuencia: string }
  | {
      tipo: "trama";
      leyenda: string;
      campos: { hex: string; nombre: string }[];
      rasgos: { titulo: string; texto: string }[];
    }
  | { tipo: "pregunta"; pregunta: string; hipotesis: string; refutaria: string; sostendria: string }
  | { tipo: "golpes"; items: { control: string; efecto: string }[] }
  | {
      tipo: "cifras";
      items: { valor: string; texto: string; fuente: SourceKey }[];
      nota: string;
    }
  | { tipo: "casos"; items: { nombre: string; texto: string; fuentes: SourceKey[] }[] }
  | {
      tipo: "barras";
      pregunta: string;
      items: { rotulo: string; valor: number }[];
      nota: string;
    }
  | { tipo: "pilares"; items: { titulo: string; texto: string; fuentes: SourceKey[] }[] }
  | { tipo: "cita"; texto: string };

// Estado del mundo 3D que cambia de capítulo en capítulo (0..1). Se acumula:
// cada capítulo declara solo lo que CAMBIA y hereda el resto del anterior.
export type SceneFx = {
  dim: number; // velo sobre el 3D: 1 = el capítulo se lee sobre el campo liso
  triad: number; // la pirámide del hero: 1 = presente, 0 = guardada (los capítulos usan la planta)
  patch: number; // 01: el parche viaja de la torre IT al PLC de la planta
  halt: number; // 01: la planta se detiene (HMI en blanco, flujo cortado, válvula en alarma)
  bridge: number; // 02: se rompe el air gap: enlaces de IT (y la nube) a la planta y paquetes que cruzan
  hits: number; // 05: tres controles IT, tres formas de parar, uno por tramo (ver CONFLICTO_TRAMOS)
  attack: number; // 07: los cuatro casos, uno por tramo (ver CASOS_TRAMOS en src/scroll/timing.ts)
  zones: number; // 09: zonas y conductos, monitoreo pasivo y gemelo digital (ver MATIZ_TRAMOS)
};
export const FX_INICIAL: SceneFx = { dim: 0, triad: 1, patch: 0, halt: 0, bridge: 0, hits: 0, attack: 0, zones: 0 };

// Estado acumulado al terminar el capítulo i (i = -1: el final del hero).
export const fxOf = (i: number): SceneFx =>
  chapters.slice(0, i + 1).reduce<SceneFx>((acc, ch) => ({ ...acc, ...ch.fx }), { ...FX_INICIAL });

export type Chapter = {
  id: string;
  titulo: string; // de 3 a 8 palabras
  bajada: string; // una o dos oraciones, sin viñetas
  figura: Figura;
  fuentes: SourceKey[];
  pendientes?: string[];
  escena: string;
  // Solo los capítulos con escena 3D construida:
  weight?: number; // alto de la sección en viewports: cuánto scroll dura la escena
  camara?: { landscape: Shot; portrait: Shot }; // sin cámara, se queda la del capítulo anterior
  fx?: Partial<SceneFx>;
};

export const chapters: Chapter[] = [
  {
    id: "escenario",
    titulo: "03:14 AM: el parche que apagó la planta",
    bajada:
      "Escenario hipotético. El SOC corporativo despliega un parche de rutina y, a 800 kilómetros, una planta de procesamiento se detiene.",
    figura: {
      tipo: "reloj",
      etiqueta: "Escenario hipotético",
      pasos: [
        { hora: "03:14", texto: "Alerta crítica de Windows: el parche se despliega en forma remota." },
        { hora: "03:17", texto: "Las HMI se congelan y el SCADA pierde contacto con los PLC." },
        { hora: "03:17", texto: "Sin datos de presión, salta la parada de emergencia." },
        { hora: "+3 h", texto: "Válvula de alivio trabada. Pérdidas estimadas: USD 180.000." },
      ],
      cierre: "Ningún ciberataque tuvo lugar esa noche: la planta fue derribada por las políticas de ciberseguridad de su propia empresa.",
    },
    fuentes: [],
    escena:
      "La planta vista desde arriba. Un paquete (el parche) baja desde un rack de la oficina hasta un gabinete PLC; la pantalla HMI se pone en blanco, el flujo de las cañerías se corta y la válvula pasa de ámbar a rojo mientras se enciende la baliza de parada de emergencia.",
    weight: 2.2,
    camara: {
      landscape: { position: [-7.5, -1.6, 8.5], target: [-0.6, -6.3, -3.2] },
      portrait: { position: [-3.4, -2.2, 12.5], target: [-3.6, -7.3, -3.4] },
    },
    fx: { triad: 0, patch: 1, halt: 1 },
  },
  {
    id: "convergencia",
    titulo: "Industria 4.0: se rompe el air gap",
    bajada:
      "Para optimizar la cadena de suministro, las plantas conectaron sensores y controladores a la nube y al ERP. Esa convergencia expuso una incompatibilidad crítica entre los dos mundos.",
    figura: {
      tipo: "brecha",
      antes: "IT y OT separadas por un aislamiento físico (air gap)",
      despues: "Sensores y PLC conectados a plataformas en la nube y al ERP",
      consecuencia: "Dos culturas, una sola red",
    },
    fuentes: ["nist-blog-legacy"],
    pendientes: ["La convergencia se afirma sin fuente propia: el enlace de NIST es la fuente de la figura de esa sección."],
    weight: 2,
    camara: {
      landscape: { position: [-1, -0.6, 17], target: [7.5, -2.6, -4] },
      portrait: { position: [0.6, -1.4, 23.5], target: [0.6, -2.4, -4] },
    },
    // La planta vuelve a funcionar (se apaga al entrar) y se rompe el air gap (actúa en la estadía).
    fx: { patch: 0, halt: 0, bridge: 1 },
    escena:
      "Vista de los dos pisos: arriba la oficina, abajo la planta, y entre los dos el air gap marcado como un borde. Los enlaces bajan desde los racks y desde la nube hasta un PLC, un tanque y una válvula; el borde pasa a ámbar y los paquetes empiezan a cruzar hacia la planta.",
  },
  {
    id: "protocolos",
    titulo: "Protocolos que confían en cualquiera",
    bajada:
      "Modbus TCP, PROFINET, EtherNet/IP y DNP3 nacieron en una época de redes cerradas, donde la confianza se asumía.",
    figura: {
      tipo: "trama",
      leyenda: "Trama Modbus TCP de ejemplo: escribe el valor 100 en un registro del PLC. No lleva usuario, clave ni firma.",
      campos: [
        { hex: "00 01", nombre: "Transacción" },
        { hex: "00 00", nombre: "Protocolo" },
        { hex: "00 06", nombre: "Longitud" },
        { hex: "01", nombre: "Unidad" },
        { hex: "06", nombre: "Función: escribir registro" },
        { hex: "00 01", nombre: "Dirección" },
        { hex: "00 64", nombre: "Valor: 100" },
      ],
      rasgos: [
        { titulo: "Sin autenticación", texto: "El PLC ejecuta cualquier trama válida sin verificar quién la envía." },
        { titulo: "Texto plano", texto: "Nada se cifra, para no sumar latencia (jitter) en ciclos de milisegundos." },
        { titulo: "Pilas frágiles", texto: "Un escaneo de puertos puede saturar la pila TCP/IP del controlador y tirarlo." },
      ],
    },
    fuentes: [],
    pendientes: ["La tesina no cita fuente para estas tres características."],
    // Sin escena propia todavía: el 3D se atenúa.
    fx: { dim: 1 },
    escena:
      "Primer plano de un gabinete PLC. Llega una trama en texto plano y el PLC la ejecuta: la válvula se mueve sin que nadie se identifique.",
  },
  {
    id: "pregunta",
    titulo: "La pregunta y la apuesta",
    bajada: "Antes de buscar fuentes, la hipótesis quedó por escrito, junto con la evidencia que la refutaría.",
    figura: {
      tipo: "pregunta",
      pregunta:
        "¿Por qué las estrategias tradicionales de ciberseguridad IT fracasan e incrementan la tasa de paradas no programadas al implementarse sin adaptación en entornos de Tecnologías Operativas (OT)?",
      hipotesis:
        "Parches automáticos, escaneo activo y MFA, aplicados tal cual, incrementan las paradas no programadas: en OT manda la disponibilidad; en IT, la confidencialidad.",
      refutaria:
        "Que la segmentación por zonas y conductos (ISA/IEC 62443) o un Zero Trust industrial adaptado permitan esos controles sin paradas, o que las grandes detenciones se expliquen mejor por ataques, errores humanos o fallas mecánicas.",
      sostendria:
        "Casos documentados y guías oficiales en los que un parche, un escaneo o una decisión pensada para IT haya detenido un proceso físico.",
    },
    fuentes: [],
    escena: "Sin escena nueva: la pirámide invertida del inicio queda de fondo, atenuada, mientras se lee la pregunta.",
  },
  {
    id: "conflicto",
    titulo: "Tres controles IT, tres formas de parar",
    bajada:
      "Aplicar políticas corporativas en una planta sin adaptarlas equivale a usar herramientas de precisión en un entorno con tolerancia cero al fallo físico.",
    figura: {
      tipo: "golpes",
      items: [
        {
          control: "Parche automático",
          efecto: "Reiniciar el servidor SCADA corta el diálogo con los PLC. Sin datos, salta la parada de emergencia.",
        },
        {
          control: "Escaneo activo",
          efecto: "Una ráfaga de paquetes satura la pila TCP/IP de un PLC o RTU legado y bloquea el hardware.",
        },
        {
          control: "MFA en plena alarma",
          efecto: "Validar un token para corregir una sobrepresión suma segundos que pueden volver accidente una maniobra de rutina.",
        },
      ],
    },
    fuentes: [],
    pendientes: ["La Sección 2 no cita fuentes para estos tres mecanismos."],
    escena:
      "Tres golpes sobre la misma planta, uno por vez, y en cada uno la planta se detiene: una actualización reinicia el SCADA y la pantalla de la HMI se apaga hasta que salta la parada de emergencia; una ráfaga de paquetes de un escáner baja hasta el controlador, que queda bloqueado en rojo; y un reloj de token corre junto a la válvula mientras la presión sube, hasta que llega tarde.",
    weight: 2.4,
    camara: {
      landscape: { position: [-9.5, -3.6, 5.5], target: [1.5, -6.8, -4] },
      portrait: { position: [-3.6, -3.4, 11.5], target: [-3.8, -6.6, -3.4] },
    },
    fx: { dim: 0, hits: 1 },
  },
  {
    id: "costo",
    titulo: "Lo que cuesta una hora detenida",
    bajada: "Son paradas por cualquier causa, no solo por ciberseguridad, pero alcanzan para dimensionar el problema.",
    figura: {
      tipo: "cifras",
      items: [
        {
          valor: "USD 125.000",
          texto: "Mediana de una hora de parada no planificada, según 3.215 responsables de mantenimiento industrial.",
          fuente: "abb-2023",
        },
        {
          valor: "USD 2,3 M",
          texto: "Costo de una hora de parada en la industria automotriz.",
          fuente: "siemens-2024",
        },
      ],
      nota: "Frente a esas cifras, los USD 180.000 del escenario inicial (tres horas) son una estimación conservadora.",
    },
    fuentes: ["abb-2023", "siemens-2024"],
    escena: "La planta queda detenida detrás del velo, como la dejó el último golpe. Las cifras crecen en HTML, no en 3D.",
    fx: { dim: 1 },
  },
  {
    id: "casos",
    titulo: "Cuatro casos que no se leen en bloque",
    bajada:
      "Cada caso prueba algo distinto. Leídos con cuidado, muestran cómo la falta de segmentación y de visibilidad convierte un incidente IT en una detención física.",
    figura: {
      tipo: "casos",
      items: [
        {
          nombre: "Colonial Pipeline",
          texto:
            "El ransomware afectó los sistemas IT. El oleoducto se detuvo para aislar el ataque y evitar que llegara a OT: la parada fue una decisión, no el código malicioso.",
          fuentes: ["blount-2021"],
        },
        {
          nombre: "Oldsmar",
          texto:
            "Escritorio remoto, contraseñas débiles y un sistema sin soporte expusieron el SCADA. En 2023 el exadministrador de la ciudad sostuvo que fue un error de un empleado, y las conclusiones oficiales nunca se publicaron.",
          fuentes: ["cisa-aa21-042a", "tbt-oldsmar-2023"],
        },
        {
          nombre: "Stuxnet",
          texto: "Alteró la lógica de controladores programables y derivó en la destrucción física de centrifugadoras.",
          fuentes: ["bbc-stuxnet"],
        },
        {
          nombre: "Industroyer",
          texto: "Ejecutó comandos sobre el protocolo IEC 60870-5-104 y desconectó subestaciones eléctricas.",
          fuentes: ["eset-industroyer"],
        },
      ],
    },
    fuentes: ["blount-2021", "cisa-aa21-042a", "tbt-oldsmar-2023", "bbc-stuxnet", "eset-industroyer"],
    escena:
      "La misma vista de los dos pisos. Cada caso actúa por turno: en Colonial Pipeline los racks de la oficina se ponen en rojo, la empresa corta los enlaces con la planta y la planta se detiene sin que el ataque baje; en Oldsmar un recorrido en ámbar llega a la válvula desde el acceso remoto (exposición: el caso quedó en discusión); en Stuxnet e Industroyer los recorridos rojos llegan a un controlador cada uno.",
    weight: 2.6,
    camara: {
      landscape: { position: [-2.5, -0.4, 20], target: [6.5, -2.8, -4] },
      portrait: { position: [-1.2, -1, 25.5], target: [-1.2, -2.6, -4] },
    },
    fx: { dim: 0, attack: 1, hits: 0 },
  },
  {
    id: "datos",
    titulo: "La puerta de entrada es IT",
    bajada:
      "En la encuesta SANS 2024, el vector inicial más citado en incidentes OT fue un compromiso en IT que logró pasar a la red de control.",
    figura: {
      tipo: "barras",
      pregunta: "¿Cuáles fueron los vectores de ataque iniciales en sus incidentes OT? (selección múltiple)",
      items: [
        { rotulo: "Compromiso en IT que permitió pasar a OT", valor: 45.8 },
        { rotulo: "Servicios remotos externos", valor: 23.7 },
        { rotulo: "Dispositivo accesible desde internet", valor: 23.7 },
        { rotulo: "Estación de ingeniería comprometida", valor: 20.3 },
        { rotulo: "Medios extraíbles comprometidos", valor: 20.3 },
        { rotulo: "Cadena de suministro comprometida", valor: 20.3 },
        { rotulo: "Compromiso al navegar (drive-by)", valor: 18.5 },
        { rotulo: "Adjunto de spearphishing", valor: 18.5 },
        { rotulo: "Explotación de una aplicación expuesta", valor: 13.6 },
        { rotulo: "Historiador de datos comprometido", valor: 10.2 },
        { rotulo: "Compromiso inalámbrico", valor: 10.2 },
        { rotulo: "Desconocido", valor: 8.5 },
        { rotulo: "Activo transitorio (incluye laptops de proveedores)", valor: 8.5 },
        { rotulo: "Otro", valor: 3.4 },
      ],
      nota: "Pregunta de selección múltiple: los porcentajes no suman 100.",
    },
    fuentes: ["sans-2024"],
    fx: { dim: 1 }, // el gráfico va en HTML: el 3D se tapa
    escena: "El 3D se aparta (fondo atenuado) y el gráfico ocupa la pantalla: las barras crecen y la de 45,8 % se marca en rojo.",
  },
  {
    id: "matiz",
    titulo: "No es la seguridad: es el trasplante",
    bajada:
      "Sometida a su criterio de falsabilidad, la hipótesis se matiza: la parada no es una consecuencia fatal de la seguridad, sino de trasplantar herramientas corporativas sin adaptarlas.",
    figura: {
      tipo: "pilares",
      items: [
        {
          titulo: "Zonas y conductos",
          texto:
            "Segmentación según ISA/IEC 62443 y el modelo Purdue, con DMZ de OT y Zero Trust industrial adaptado: un incidente corporativo no llega a los controladores.",
          fuentes: ["isa-iec-62443", "cisa-ics-rp"],
        },
        {
          titulo: "Escuchar en vez de golpear",
          texto:
            "Monitoreo pasivo con inspección profunda de paquetes (DPI) desde puertos espejo: interpreta Modbus TCP, PROFINET o DNP3 sin sumar latencia.",
          fuentes: ["nist-800-82r3"],
        },
        {
          titulo: "Probar antes de parchear",
          texto:
            "Parches validados en testbeds o gemelos digitales y desplegados en ventanas de mantenimiento o paradas programadas.",
          fuentes: ["nist-800-82r3"],
        },
      ],
    },
    fuentes: ["isa-iec-62443", "cisa-ics-rp", "nist-800-82r3"],
    escena:
      "La misma vista de los dos pisos, con los recorridos de los casos todavía ahí. Aparecen las zonas (oficina, DMZ y dos celdas de planta) y una compuerta en cada cruce del air gap: el rojo se retrae hasta la compuerta y los controladores vuelven a la normalidad, mientras el tráfico legítimo sigue pasando. Después, un sensor pasivo recibe copias del tráfico desde un puerto espejo, y un gemelo digital del controlador pasa de prueba (ámbar) a validado (azul).",
    weight: 2.6,
    fx: { dim: 0, zones: 1 },
  },
  {
    id: "postura",
    titulo: "Confirmada, con matiz",
    bajada:
      "Las herramientas IT paran la planta cuando se aplican de forma ciega y descontextualizada. La resiliencia está en mantener visibilidad constante sin sumar latencia ni interrupciones injustificadas.",
    figura: {
      tipo: "cita",
      texto:
        "La ciberseguridad industrial del siglo XXI no consiste en apagar la planta para protegerla, sino en dotarla de la resiliencia necesaria para operar de forma ininterrumpida en un entorno hiperconectado.",
    },
    fuentes: [],
    escena: "La cámara se aleja: la planta sigue funcionando, segmentada, y la pirámide AIC queda estable sobre ella.",
    weight: 1.8,
    camara: {
      landscape: { position: [-8, 4, 31], target: [10, -3.2, -5] },
      portrait: { position: [-1, 4, 40], target: [-1, -2.5, -5] },
    },
    fx: { triad: 1 },
  },
];
