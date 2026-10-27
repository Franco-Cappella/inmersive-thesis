<!--
Copia SOLO DE TEXTO de la tesina original (TESINA_FINAL.md). Las 4 imágenes embebidas
se quitaron: aparecen como "[Imagen N ...]". Es la fuente de verdad del contenido del sitio.
Si la tesina cambia, reemplazar este archivo y revisar src/content/ y docs/PENDIENTES-TESINA.md.
Ojo: las figuras 3 y 4 de la tesina no coinciden con sus pies (ver docs/PENDIENTES-TESINA.md).
-->

# **Sección 1: El Choque de Mundos — CIA vs. AIC**

Imagina que son las 03:14 AM de un martes. En la consola del equipo corporativo de ciberseguridad (SOC), una alerta de vulnerabilidad crítica en sistemas Windows activa el protocolo automatizado de la compañía. Se despliega de forma remota un parche de seguridad de rutina.

Tres minutos después, en la planta de procesamiento a 800 kilómetros de distancia, las pantallas HMI (*Human-Machine Interface*) de la sala de control se congelan en un cuadro blanco. La comunicación TCP/IP entre el servidor SCADA y los Controladores Lógicos Programables (PLCs) de la línea de llenado químico se interrumpe durante el reinicio forzado del sistema. Los sensores de presión dejan de reportar datos en tiempo real. Ante la pérdida súbita de visibilidad operativa, los sistemas de seguridad física disparan la parada de emergencia (*Emergency Shut Down*).

¿El resultado? Una válvula de alivio trabada por la purga abrupta, tres horas de inactividad no programada y pérdidas estimadas en \$180,000 USD. Ningún ciberataque tuvo lugar esa noche: la planta fue derribada por las políticas de ciberseguridad de su propia empresa.

### **La paradoja de la convergencia digital**

En la era de la Industria 4.0, la promesa de la transformación digital exigió derribar el histórico aislamiento físico (*air-gap*) que separaba a las redes de tecnología de la información (IT) de la tecnología operativa (OT). Las plantas industriales conectaron sus sensores y controladores a plataformas analíticas en la nube y sistemas ERP para optimizar la cadena de suministro.

Sin embargo, esta convergencia expuso una incompatibilidad cultural y filosófica crítica entre ambos mundos:  
*[Imagen 1 de la tesina original: no incluida en este archivo]*  
[Fuente de la imagen](https://www.nist.gov/blogs/manufacturing-innovation-blog/supporting-digital-transformation-legacy-components) 

### **El dilema ontológico: La tríada invertida**

El fracaso de la ciberseguridad IT al ingresar a la planta industrial reside en que ambas disciplinas operan bajo prioridades diametralmente opuestas:

| Dimensión | Ciberseguridad IT (Information Technology) | Ciberseguridad OT (Operational Technology) |
| :---- | :---- | :---- |
| **Prioridad N° 1** | **Confidencialidad:** Proteger datos corporativos, propiedad intelectual y privacidad contra accesos no autorizados. | **Disponibilidad:** Garantizar que el proceso físico opere de forma ininterrumpida las 24 horas del día, los 365 días del año. |
| **Prioridad N° 2** | **Integridad:** Asegurar que la información almacenada o en tránsito no sea alterada. | **Integridad:** Prevenir alteraciones en los comandos que modifiquen parámetros físicos (temperatura, velocidad, presión). |
| **Prioridad N° 3** | **Disponibilidad:** Aceptar tolerancias de reinicio o desconexión en servidores para tareas de mantenimiento. | **Confidencialidad:** Importante, pero secundaria frente al riesgo inminente de daño físico o pérdida de vidas humanas. |
| **Entorno operativo** | Sistemas operativos dinámicos (Windows, Linux), ciclos de vida de 3 a 5 años y parches continuos. | Dispositivos empotrados legados (PLCs, RTUs), ciclos de vida de 15 a 30 años y sistemas operativos en tiempo real (RTOS). |

### **La fragilidad de los protocolos industriales**

Mientras que en IT los protocolos de comunicación modernos nacieron diseñados con cifrado y autenticación nativa (como HTTPS, SSH o TLS), el ecosistema OT se construyó en una época donde las redes eran cerradas y la confianza se asume implícita.

Los protocolos de control industrial más difundidos —como Modbus TCP, PROFINET, EtherNet/IP o DNP3— se caracterizan por:

1. **Inexistencia de autenticación:** Cualquier dispositivo conectado a la red que envíe una trama Modbus válida a un PLC será ejecutado sin verificar la identidad del emisor.  
2. **Tráfico en texto plano:** Los parámetros de control y comandos de detención viajan sin cifrar para no introducir latencia (*jitter*) en los ciclos de escaneo del proceso industrial, los cuales requieren respuestas en el orden de los milisegundos.  
3. **Pilas red frágiles:** Los microcontroladores de un PLC o RTU no poseen la capacidad de procesamiento ni la memoria de un servidor corporativo. Un simple escaneo activo de puertos (como una ráfaga de paquetes desde un escáner de vulnerabilidades IT) puede saturar la pila TCP/IP del controlador y forzar un fallo de hardware (*kernel panic*).

### **Pregunta de investigación, hipótesis y criterio de refutación**

A partir de este choque de arquitecturas, este trabajo aborda el siguiente interrogante:

**¿Por qué las estrategias tradicionales de ciberseguridad IT fracasan e incrementan la tasa de paradas no programadas al implementarse sin adaptación en entornos de Tecnologías Operativas (OT)?**

Antes de salir a buscar fuentes, dejé por escrito una hipótesis inicial concreta, para no caer en el error de buscar solo la evidencia que confirmara lo que ya pensaba:

**La aplicación directa de controles de ciberseguridad IT, como la gestión automatizada de parches, el escaneo activo de vulnerabilidades y la autenticación multifactor, incrementa las paradas no programadas en plantas industriales, porque en OT la prioridad crítica es la disponibilidad y la continuidad operativa en tiempo real, mientras que en IT lo es la confidencialidad de los datos.**

Para que esa hipótesis pudiera ponerse a prueba, definí también qué evidencia me haría cambiar de idea. La refutaría encontrar marcos o arquitecturas, como la segmentación por zonas y conductos de la norma ISA/IEC 62443 o el Zero Trust industrial adaptado, que permitan aplicar esos mismos controles sin generar paradas no programadas. También la debilitaría comprobar que las grandes detenciones en plantas conectadas se explican mejor por otras causas, como ataques externos, errores humanos o fallas mecánicas, que por la aplicación de controles IT. En cambio, la sostendrían casos documentados y guías técnicas oficiales en los que un parche, un escaneo o una decisión de seguridad pensada para IT haya detenido un proceso físico.

A lo largo de este análisis, pondré a prueba si la ciberseguridad en la Industria 4.0 puede abordarse como un problema de "traducción de software corporativo" o si exige un modelo de gestión del riesgo operacional y resiliencia física.

**Sección 2: Anatomía del Conflicto — Cuando la Teoría IT Rompe la Operación OT**

Aplicar políticas de ciberseguridad corporativa en una planta sin adaptarlas equivale a usar herramientas de precisión en un entorno con tolerancia cero al fallo físico. Al trasladar a la red industrial las prácticas habituales del mundo informático, la teoría de IT choca de frente con la realidad operativa de la planta.

Un claro ejemplo es la gestión automatizada de parches. Reiniciar un servidor SCADA para actualizar el sistema operativo puede interrumpir el canal de comunicación con los controladores de campo. Al perder ese flujo de datos constante, los sistemas de seguridad interpretan una falla inminente y disparan paradas de emergencia automáticas, provocando un downtime costoso y desgaste en la maquinaria. Para dimensionar ese costo, la encuesta [Value of Reliability](https://new.abb.com/news/detail/107660/abb-survey-reveals-unplanned-downtime-costs-125-000-per-hour) de ABB (2023), respondida por 3.215 responsables de mantenimiento industrial, ubica la mediana de una hora de parada no planificada en cerca de USD 125.000, y el informe [The True Cost of Downtime 2024](https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/TCOD-2024_original.pdf) de Siemens la eleva a USD 2,3 millones por hora en la industria automotriz. Son cifras de paradas por cualquier causa, no solo por ciberseguridad, pero alcanzan para ver que las tres horas del escenario inicial, estimadas en USD 180.000, son una cifra conservadora.

Del mismo modo, los escaneos activos de vulnerabilidades mediante ráfagas de paquetes saturan fácilmente las limitadas pilas TCP/IP de los PLCs y RTUs legados, provocando el bloqueo del hardware.

Por último, exigir autenticación multifactor (MFA) o contraseñas complejas ante una alerta crítica introduce una latencia humana inviable. Cuando un operador debe ajustar parámetros en una interfaz HMI para evitar una sobrepresión, obligarlo a validar un token telefónico suma segundos críticos que transforman una maniobra de rutina en un accidente físico o ambiental.

**Sección 3: Evidencia Estadística y Análisis de Casos Reales — El Impacto Crítico del Downtime Operacional**

La verdadera brecha entre la seguridad informática tradicional y el entorno industrial no reside en diferencias superficiales de software, sino en el costo devastador del tiempo de inactividad no programado (*downtime*). En los entornos de producción continua, cada minuto de detención del proceso implica pérdidas financieras exponenciales y riesgos directos sobre la integridad de las instalaciones y el personal. La evidencia empírica demuestra que las paradas no planificadas no sólo son desencadenadas por intrusiones cibernéticas maliciosas, sino también por decisiones de aislamiento de emergencia ante la falta de visibilidad cruzada entre las redes de la empresa.

Casos emblemáticos confirman cómo la vulneración de la continuidad operativa se transforma en el verdadero vector de daño industrial. Durante el incidente de Colonial Pipeline, la ausencia de una segmentación clara entre la red de facturación corporativa y la red de control provocó el apagado preventivo del oleoducto durante varios días, paralizando el suministro de combustible a escala regional por mero pánico operativo al no poder aislar ni tener visibilidad en la red de facturación IT. De forma similar, la filtración en la planta de tratamiento de agua de Oldsmar evidenció cómo la exposición de interfaces de control SCADA mediante herramientas de acceso remoto tradicional permite la manipulación de parámetros físicos críticos de sustancias químicas como la soda cáustica, amenazando la estabilidad de la operación. En un nivel de mayor complejidad técnica, códigos maliciosos como Stuxnet e Industroyer fueron concebidos específicamente para alterar la lógica de los controladores programables y ejecutar comandos sobre protocolos industriales como Modbus o IEC 60870-5-104, derivando en la destrucción física de centrifugadoras y la desconexión no autorizada de subestaciones eléctricas 

\[citando:[Fuente Stuxnet](https://www.bbc.com/mundo/noticias/2015/10/151007_iwonder_finde_tecnologia_virus_stuxnet),[Fuente Industroyer](https://www.welivesecurity.com/la-es/2022/06/13/industroyer-amenaza-cibernetica-derribo-red-electrica/)\].

Estos casos, sin embargo, no deben leerse en bloque. En Colonial Pipeline, el propio director ejecutivo, Joseph Blount, declaró ante el Senado de Estados Unidos que el ransomware afectó a los sistemas IT y que la orden de detener todo el oleoducto se dio para aislar el ataque y evitar que el malware llegara a la red OT ([testimonio ante el Senado](https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf)). La parada, entonces, no la causó el código malicioso sino una decisión de seguridad tomada sin visibilidad suficiente sobre la red operativa, lo que respalda la idea de que la falta de segmentación convierte un incidente IT en una detención física. En Oldsmar, el aviso conjunto [AA21-042A](https://www.cisa.gov/news-events/alerts/2021/02/11/compromise-us-water-treatment-facility) del FBI, CISA y la EPA atribuyó el acceso al sistema SCADA a software de escritorio remoto, contraseñas débiles y un sistema operativo sin soporte. Pero en 2023 el exadministrador de la ciudad, Al Braithwaite, sostuvo que no hubo ataque y que el episodio fue probablemente un error de un empleado, y las conclusiones oficiales de la investigación nunca se publicaron ([Tampa Bay Times](https://www.tampabay.com/news/pinellas/2023/04/11/oldsmar-cyberattack-water-supply-poisoning-fbi-update/)). Esa discrepancia no elimina el caso, pero cambia lo que demuestra: más que un ataque exitoso, Oldsmar muestra lo expuesta que estaba una interfaz de control a herramientas de acceso remoto de uso corporativo y lo rápido que un parámetro químico puede alterarse desde una pantalla.

A diferencia del mundo informático convencional, donde la indisponibilidad temporal de un servidor corporativo representa un inconveniente administrativo diferido, en las tecnologías operativas una parada no planificada genera costos millonarios inmediatos, pérdidas de materia prima y severos riesgos de seguridad física. Por este motivo, la disponibilidad continua en tiempo real se mantiene como la métrica suprema de la planta, confirmando que cualquier control o parche de ciberseguridad que interrumpa el ciclo operativo sin una adaptación específica resulta tan contraproducente para la organización como la amenaza que pretende mitigar.

*[Imagen 2 de la tesina original: no incluida en este archivo]*  
[Fuente del gráfico](https://www.sans.org/white-papers/sans-2024-state-ics-ot-cybersecurity)   
Los datos recopilados de este informe(SANS 2024 State of ICS/OT Cybersecurity) confirman que la principal puerta de entrada a los entornos industriales no proviene de vulnerabilidades complejas en el hardware de control, sino de la propia red corporativa. Con un 45.8% de los incidentes iniciados por un compromiso en IT que logra pivotar hacia la red OT, la estadística evidencia que la falta de una segmentación estricta y el desconocimiento de los flujos de comunicación entre ambos mundos son la causa raíz de la mayoría de las interrupciones en la producción. 

# **Sección 4: Criterio de Falsabilidad y el Matiz Moderno — La Prueba de la Hipótesis**

Sometida al criterio de falsabilidad, la hipótesis inicial —que afirma que aplicar ciberseguridad en OT genera inevitablemente paradas de planta— debe matizarse. La interrupción operativa no es una consecuencia fatal de la seguridad en sí misma, sino el resultado directo de trasplantar herramientas informáticas corporativas a entornos industriales sin adaptar sus dinámicas temporales y físicas.

Cuando las salvaguardas se diseñan respetando la naturaleza de la planta, la contradicción entre protección y continuidad desaparece. El primer pilar de esta solución es la segmentación estricta de red según la norma **ISA/IEC 62443** y el Modelo Purdue, evolucionando hacia un paradigma de **Zero Trust Industrial adaptado**. Agrupar activos en *Zonas*, filtrar el tráfico a través de *Conductos* con cortafuegos industriales y establecer una DMZ de OT permite asumir que ninguna red es intrínsecamente segura, validando cada comunicación sin introducir latencia y evitando que los incidentes de la red corporativa trasciendan a los controladores de proceso. 

*[Imagen 3 de la tesina original: no incluida en este archivo]*

*Figura 3: Arquitectura de ciberseguridad industrial basada en el Modelo Purdue y la segmentación por Zonas y Conductos de la norma IEC 62443\.*

[Fuente: CISA \- National Cyber Awareness System / Industrial Control Systems Architecture](https://www.cisa.gov/resources-tools/resources/ics-recommended-practices)

El segundo avance clave es el reemplazo de los escaneos activos de vulnerabilidades por el **monitoreo pasivo de red** con **Inspección Profunda de Paquetes (DPI)**. En lugar de inyectar ráfagas de tráfico que saturan los microcontroladores legados, los sensores escuchan copias del flujo de datos mediante puertos espejo. Esto permite interpretar la semántica de protocolos nativos como Modbus TCP, PROFINET o DNP3 e identificar anomalías en tiempo real sin alterar la latencia ni forzar caídas de hardware.

*[Imagen 4 de la tesina original: no incluida en este archivo]*

*Figura 4: Comparativa de visibilidad en redes industriales: Escaneo Activo tradicional (IT) frente a Monitoreo Pasivo no invasivo con Inspección Profunda de Paquetes (OT).*

[Fuente del gráfico](https://csrc.nist.gov/pubs/sp/800/82/r3/final)

Finalmente, marcos como la guía **NIST SP 800-82 Rev. 3** estructuran la gestión de parches e identidades mediante la validación previa en *testbeds* o **gemelos digitales (*Digital Twins*)** —entornos espejo que replican de forma exacta la lógica y respuesta en tiempo real de la planta—, garantizando que una actualización no altere la lógica del PLC antes de ser desplegada durante ventanas de mantenimiento o paradas programadas. Se demuestra así el matiz de la premisa: la ciberseguridad no destruye la operación continua por naturaleza, sino por incompatibilidad de diseño, siendo perfectamente factible elevar la resiliencia industrial sin generar un solo minuto de parada no programada. 

# **Sección 5: Postura Final y Conclusión — Reinventar la Ciberseguridad en las Industrias**

El dilema de la ciberseguridad en la Tecnología Operativa (*OT*) no debe interpretarse como una confrontación de culpabilidades entre el CISO corporativo y el Director de Planta. Mientras el primero prioriza la protección irrestricta de los datos y el cumplimiento normativo, el segundo responde ante la continuidad física del proceso productivo y la seguridad de las instalaciones. Este aparente choque cultural no se resuelve forzando a una disciplina a someterse a los mandatos de la otra, sino comprendiendo que la convergencia industrial exige una **reinvención estructural de las prácticas de ciberseguridad**. Trasplantar controles informáticos concebidos para oficinas a entornos de control en tiempo real es una aproximación errónea que confunde la protección con la alteración del entorno operativo.

A partir de la evidencia analizada, la hipótesis planteada en este estudio se confirma de forma matizada. Las herramientas y políticas tradicionales de IT fracasan y desencadenan paradas de planta no programadas únicamente cuando se aplican de forma ciega y descontextualizada. La vulnerabilidad inherente de las plantas industriales, construidas sobre protocolos legados sin cifrado ni autenticación nativa, exige un marco defensivo que no genere paradas preventivas infundadas. En lugar de reaccionar con aislamiento impulsivo ante alertas en la red corporativa, la dirección operativa debe mantener una vigilancia continua sobre las amenazas y vectores de ataque informáticos más comunes que puedan pivotar hacia la red de producción, evaluando con rigor técnico la necesidad extrema de una detención antes de ejecutarla. La resiliencia moderna reside en mantener la visibilidad constante sin introducir latencia ni interrupciones injustificadas.

Mirando hacia el futuro de la Industria 4.0, las tecnologías emergentes están llamadas a resolver de manera definitiva la histórica tensión entre la Tríada CIA (Confidencialidad, Integridad, Disponibilidad) y la Tríada AIC (Disponibilidad, Integridad, Confidencialidad). El avance del monitoreo inteligente no invasivo mediante Inspección Profunda de Paquetes (*DPI*), la microsegmentación dinámica bajo normas como la **ISA/IEC 62443** y el modelado analítico en **gemelos digitales (*Digital Twins*)** demuestran que es técnicamente factible elevar los estándares de protección sin sacrificar un solo segundo de disponibilidad. La ciberseguridad industrial del siglo XXI no consiste en apagar la planta para protegerla, sino en dotarla de la resiliencia necesaria para operar de forma ininterrumpida en un entorno hiperconectado.

# **Declaración de transparencia sobre el uso de IA**

Este artículo se escribió con apoyo de inteligencia artificial generativa y quiero dejar registrado cómo la usé. Trabajé con Claude (Anthropic) y Gemini(Google) como tutor metodológico y copiloto de redacción: me ayudó a ordenar el esquema en cinco secciones, a reformular en prosa párrafos que partían de mis borradores, a buscar y resumir fuentes (CISA, NIST, SANS, ABB, Siemens y el testimonio de Colonial Pipeline ante el Senado de Estados Unidos) y a incorporar las correcciones del borrador, como la explicitación de la hipótesis y del criterio de refutación al comienzo del texto. La elección del tema, la pregunta de investigación, la hipótesis, la selección de casos y la postura de la conclusión son mías, y revisé cada dato y cada enlace contra su fuente original.
