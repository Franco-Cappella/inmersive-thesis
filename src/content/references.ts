// Bibliografía del sitio. Sale de los enlaces que cita la tesina (TESINA_FINAL.md).
// La tesina no trae una lista de referencias formal: esto es una base en estilo
// APA 7 para completar. `verificar` marca lo que no se pudo confirmar contra la
// fuente original (título exacto, autor, fecha) y hay que revisar antes de la defensa.

export type Reference = {
  key: string;
  corta: string; // para llamadas en línea: "ABB, 2023"
  cita: string; // como se muestra en la bibliografía
  url?: string;
  verificar?: string;
};

export const references = [
  {
    key: "nist-blog-legacy",
    corta: "NIST (blog)",
    cita: "NIST Manufacturing Innovation Blog. (s. f.). Supporting digital transformation with legacy components [Entrada de blog].",
    url: "https://www.nist.gov/blogs/manufacturing-innovation-blog/supporting-digital-transformation-legacy-components",
    verificar: "Título exacto, autor y fecha. La tesina la usa como fuente de la figura 1 (diagrama de niveles 0 a 5 con DMZ industrial).",
  },
  {
    key: "abb-2023",
    corta: "ABB, 2023",
    cita: "ABB. (2023). ABB survey reveals unplanned downtime costs $125,000 per hour [Comunicado sobre la encuesta Value of Reliability].",
    url: "https://new.abb.com/news/detail/107660/abb-survey-reveals-unplanned-downtime-costs-125-000-per-hour",
    verificar: "Título y fecha exactos del comunicado.",
  },
  {
    key: "siemens-2024",
    corta: "Siemens, 2024",
    cita: "Siemens. (2024). The true cost of downtime 2024 [Informe].",
    url: "https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/TCOD-2024_original.pdf",
  },
  {
    key: "bbc-stuxnet",
    corta: "BBC Mundo, 2015",
    cita: "BBC Mundo. (2015, 7 de octubre). [Artículo sobre el virus Stuxnet].",
    url: "https://www.bbc.com/mundo/noticias/2015/10/151007_iwonder_finde_tecnologia_virus_stuxnet",
    verificar: "Título y autor: no se pudieron confirmar desde el entorno de desarrollo.",
  },
  {
    key: "eset-industroyer",
    corta: "ESET, 2022",
    cita: "WeLiveSecurity (ESET). (2022, 13 de junio). Industroyer: una amenaza cibernética que derribó una red eléctrica.",
    url: "https://www.welivesecurity.com/la-es/2022/06/13/industroyer-amenaza-cibernetica-derribo-red-electrica/",
    verificar: "Título exacto en español (está reconstruido desde la URL y la versión en inglés).",
  },
  {
    key: "blount-2021",
    corta: "Blount, 2021",
    cita: "Blount, J. (2021, 8 de junio). Testimony before the U.S. Senate Committee on Homeland Security and Governmental Affairs [Testimonio].",
    url: "https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf",
  },
  {
    key: "cisa-aa21-042a",
    corta: "CISA AA21-042A",
    cita: "CISA, FBI y EPA. (2021, 11 de febrero). Compromise of U.S. water treatment facility (Alerta AA21-042A).",
    url: "https://www.cisa.gov/news-events/alerts/2021/02/11/compromise-us-water-treatment-facility",
  },
  {
    key: "tbt-oldsmar-2023",
    corta: "Tampa Bay Times, 2023",
    cita: "Tampa Bay Times. (2023, 11 de abril). [Actualización sobre el caso Oldsmar: el exadministrador de la ciudad sostiene que no hubo ciberataque].",
    url: "https://www.tampabay.com/news/pinellas/2023/04/11/oldsmar-cyberattack-water-supply-poisoning-fbi-update/",
    verificar: "Título y autores exactos.",
  },
  {
    key: "sans-2024",
    corta: "SANS, 2024",
    cita: "SANS Institute. (2024). SANS 2024 state of ICS/OT cybersecurity [White paper].",
    url: "https://www.sans.org/white-papers/sans-2024-state-ics-ot-cybersecurity",
    verificar: "Autores del informe.",
  },
  {
    key: "cisa-ics-rp",
    corta: "CISA",
    cita: "CISA. (s. f.). ICS recommended practices.",
    url: "https://www.cisa.gov/resources-tools/resources/ics-recommended-practices",
  },
  {
    key: "nist-800-82r3",
    corta: "NIST SP 800-82r3",
    cita: "Stouffer, K., Pease, M., Tang, C., Zimmerman, T., Pillitteri, V., Lightman, S., Hahn, A., Saravia, S., Sherule, A. y Thompson, M. (2023). Guide to operational technology (OT) security (NIST SP 800-82 Rev. 3). National Institute of Standards and Technology.",
    url: "https://csrc.nist.gov/pubs/sp/800/82/r3/final",
    verificar: "Autores y año: no se pudieron confirmar desde el entorno de desarrollo. La tesina no cita el documento formalmente.",
  },
  {
    key: "isa-iec-62443",
    corta: "ISA/IEC 62443",
    cita: "ISA/IEC 62443. Seguridad para sistemas de automatización y control industrial (serie de normas).",
    verificar: "La tesina la cita sin referencia formal: falta indicar la parte (por ejemplo 62443-3-2, zonas y conductos) y el año.",
  },
] as const satisfies readonly Reference[];

export type SourceKey = (typeof references)[number]["key"];

export const refById = Object.fromEntries(references.map((r) => [r.key, r])) as Record<SourceKey, Reference>;

// Número de cada fuente en la bibliografía, para las llamadas [n] del texto.
export const refNumber = Object.fromEntries(references.map((r, i) => [r.key, i + 1])) as Record<SourceKey, number>;

// Texto literal de la tesina (sección final). Va completo: es una declaración formal.
export const declaracionIA =
  "Este artículo se escribió con apoyo de inteligencia artificial generativa y quiero dejar registrado cómo la usé. Trabajé con Claude (Anthropic) y Gemini(Google) como tutor metodológico y copiloto de redacción: me ayudó a ordenar el esquema en cinco secciones, a reformular en prosa párrafos que partían de mis borradores, a buscar y resumir fuentes (CISA, NIST, SANS, ABB, Siemens y el testimonio de Colonial Pipeline ante el Senado de Estados Unidos) y a incorporar las correcciones del borrador, como la explicitación de la hipótesis y del criterio de refutación al comienzo del texto. La elección del tema, la pregunta de investigación, la hipótesis, la selección de casos y la postura de la conclusión son mías, y revisé cada dato y cada enlace contra su fuente original.";
