/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GlobalCMSState, Expedition, Ambassador, ImpactProject, BlogPost } from '../types';

const INITIAL_EXPEDITIONS: Expedition[] = [
  {
    id: 'bosque-valdiviano',
    slug: 'bosque-valdiviano',
    title: 'Expedición Bosque Valdiviano',
    subtitle: 'Alerces Milenarios y Selva Fría de Sudamérica',
    status: 'active',
    duration: '5 Días / 4 Noches',
    physicalLevel: 'Medio',
    dates: ['24-28 Noviembre 2026', '12-16 Enero 2027'],
    price: '1.450 €',
    maxGroupSize: 10,
    featuredImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    responsibleGuideId: 'claudio-araya',
    storySummary: 'Nadie protege lo que no conoce. Esta expedición es un documental interactivo de la selva fría sudamericana, donde caminaremos entre alerces de 3.000 años, instalaremos cámaras de monitoreo de fauna silvestre y apoyaremos a comunidades de conservación locales.',
    chapters: [
      {
        title: 'La Selva Fría y el Aroma del Musgo',
        description: 'La Reserva Costera Valdiviana alberga uno de los ecosistemas más raros del planeta: un bosque lluvioso templado que sobrevivió a las glaciaciones. Sentiremos el impacto del aire más puro del continente y aprenderemos sobre la geología de la Cordillera de la Costa.',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'El Encuentro con el Alerce Abuelo',
        description: 'Caminaremos en silencio absoluto hasta encontrar el Alerce Abuelo, un árbol monumental de más de 3.000 años. Sus anillos de crecimiento guardan información crítica sobre el clima de los últimos milenios, sirviendo como bibliotecas científicas vivientes.',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Monitoreo de Fauna Silvestre',
        description: 'En conjunto con guardaparques de fundaciones aliadas, nos internaremos en zonas protegidas para instalar y revisar cámaras trampa. Buscaremos huellas del tímido pudú y del gato colocolo, aportando datos reales al catastro de conservación de la reserva.',
        image: 'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Navegación e Impacto Comunitario',
        description: 'Navegaremos el río San Pedro en embarcaciones guiadas por pescadores locales y artesanos Huilliche. Compartiremos sus historias, conoceremos su cosmovisión y sembraremos árboles nativos cultivados por ellos para restaurar cuencas dañadas.',
        image: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=800&auto=format&fit=crop'
      }
    ],
    itinerary: [
      {
        day: 'Día 1',
        title: 'Inmersión y Encuentro en Valdivia',
        description: 'Reunión del grupo en Valdivia. Traslado en lancha navegando por ríos costeros hasta el refugio ecológico de la Reserva Costera Valdiviana. Charla introductoria de Claudio Araya sobre ecología forestal y primera cena con ingredientes de recolección local silvestre.',
        accommodation: 'Refugio Costero de Conservación Raulif'
      },
      {
        day: 'Día 2',
        title: 'El Sendero de los Alerces Sagrados',
        description: 'Trekking suave de 8 km por el sendero principal de Alerces. Almuerzo tipo picnic orgánico bajo el dosel del bosque lluvioso. Encuentro con el Alerce Abuelo. Ejercicio de ecología profunda (baño de bosque) guiado para agudizar los sentidos.',
        accommodation: 'Refugio Costero de Conservación Raulif'
      },
      {
        day: 'Día 3',
        title: 'Taller Científico: Cámaras Trampa y Huellas',
        description: 'Acompañaremos a biólogos en el campo. Aprendizaje de rastreo de mamíferos, revisión de tarjetas de memoria de cámaras trampa previamente instaladas y procesamiento de datos reales de fauna. Fogata nocturna con lectura de leyendas locales.',
        accommodation: 'Refugio Costero de Conservación Raulif'
      },
      {
        day: 'Día 4',
        title: 'Navegación y Vivero Comunitario',
        description: 'Kayaking y navegación costera suave. Visita al vivero de restauración liderado por la comunidad indígena local. Participación activa en la siembra de plántulas de Raulí y Coihue en áreas degradadas de la cuenca costera.',
        accommodation: 'Hotel Flotante de Conservación Valdivia'
      },
      {
        day: 'Día 5',
        title: 'Cierre de Ciclo e Integración',
        description: 'Sesión matutina de integración del grupo, entrega de certificados de embajadores de conservación Raulif, almuerzo de despedida y traslado al aeropuerto o terminal de Valdivia para el retorno a Europa.',
        accommodation: 'Retorno'
      }
    ],
    whatsIncluded: [
      'Todos los traslados internos en lanchas y vehículos terrestres privados.',
      'Alojamiento por 4 noches en refugio de conservación y hotel boutique sostenible.',
      'Alimentación completa (desayuno, almuerzo, cena) basada en productos de cercanía y orgánicos.',
      'Guías científicos bilingües certificados en primeros auxilios en áreas silvestres (WFR).',
      'Equipamiento científico de campo para uso grupal (cámaras trampa, lupas, binoculares).',
      'Donación de 25 árboles nativos plantados a tu nombre en proyectos de restauración activos.',
      'Entradas y permisos para todas las reservas y parques nacionales protegidos.'
    ],
    whatsNotIncluded: [
      'Vuelos internacionales desde Europa (España/Alemania) a Chile.',
      'Vuelos domésticos Santiago - Valdivia.',
      'Seguro de viaje internacional obligatorio con cobertura de rescate.',
      'Bebidas alcohólicas premium o gastos personales extras.'
    ],
    faqs: [
      {
        question: '¿Qué nivel de estado físico se requiere?',
        answer: 'Se requiere un estado físico medio. Las caminatas son de ritmo lento (slow trekking) de entre 6 y 10 kilómetros por día, con desniveles moderados de no más de 400 metros. El enfoque de Raulif es la observación y la ciencia de campo, no el rendimiento atlético.'
      },
      {
        question: '¿Cómo funciona el impacto científico de mi viaje?',
        answer: 'Un porcentaje del costo de tu expedición financia directamente el sueldo de biólogos locales, el mantenimiento de equipos de monitoreo y la compra de plántulas para reforestación. Además, participas de forma activa en la recopilación de datos de campo.'
      },
      {
        question: '¿Dónde nos hospedamos?',
        answer: 'Nos hospedamos en refugios ecológicos de alta calidad que operan bajo estrictas normas de bajo impacto, calefaccionados con energías limpias y que emplean a personas de las comunidades locales.'
      }
    ]
  },
  {
    id: 'araucarias-fuego-hielo',
    slug: 'araucarias-fuego-hielo',
    title: 'Expedición Araucarias de Fuego y Hielo',
    subtitle: 'El Ecosistema Volcánico de Conguillío',
    status: 'soon',
    duration: '6 Días / 5 Noches',
    physicalLevel: 'Alto',
    dates: ['Marzo 2027 (Próximamente)'],
    price: '1.680 €',
    maxGroupSize: 8,
    featuredImage: 'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    responsibleGuideId: 'sofia-walker',
    storySummary: 'Una expedición de alto impacto visual y geológico en el Parque Nacional Conguillío. Caminaremos sobre lavas milenarias petrificadas rodeados de milenarios bosques de Araucaria Araucana, bajo la imponente mirada del volcán Llaima.',
    chapters: [],
    itinerary: [],
    whatsIncluded: [],
    whatsNotIncluded: [],
    faqs: []
  },
  {
    id: 'patagonia-glaciares',
    slug: 'patagonia-glaciares',
    title: 'Expedición Patagonia Silvestre',
    subtitle: 'Fiordos y Glaciares Secretos de Campos de Hielo',
    status: 'soon',
    duration: '8 Días / 7 Noches',
    physicalLevel: 'Desafiante',
    dates: ['Febrero 2027 (Próximamente)'],
    price: '2.950 €',
    maxGroupSize: 8,
    featuredImage: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1200&auto=format&fit=crop'
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    responsibleGuideId: 'claudio-araya',
    storySummary: 'El viaje definitivo de conservación de glaciares. Exploraremos fiordos inexplorados y aprenderemos de la mano de glaciólogos a registrar el retroceso del hielo patagónico, apoyando iniciativas científicas en el extremo sur del planeta.',
    chapters: [],
    itinerary: [],
    whatsIncluded: [],
    whatsNotIncluded: [],
    faqs: []
  }
];

const INITIAL_AMBASSADORS: Ambassador[] = [
  {
    id: 'claudio-araya',
    name: 'Claudio Araya',
    role: 'Biólogo de Conservación & Guía Científico',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
    bio: 'Claudio ha dedicado más de 15 años a estudiar los bosques templados lluviosos de Chile. Ex-investigador de la Universidad Austral de Chile, se especializa en mamíferos endémicos y ecología acústica forestal. Su pasión es transformar cada excursión en una cátedra viva de conservación interactiva.',
    specialty: 'Ecología Forestal, Rastreo de Fauna Silvestre, Bioacústica',
    languages: ['Español', 'Inglés', 'Alemán'],
    certifications: ['Doctor en Ecología y Evolución', 'Guía UIAGM Trekking', 'Wilderness First Responder (WFR)'],
    quote: 'La naturaleza es la única biblioteca donde cada hoja es un libro de sabiduría viva. Nuestro viaje consiste en aprender a leerla para protegerla.',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'sofia-walker',
    name: 'Sofía Walker',
    role: 'Fotógrafa de Naturaleza & Educadora Ambiental',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop',
    bio: 'Sofía es una galardonada fotógrafa cuyas imágenes han sido publicadas en medios de conservación global. Cree fervientemente que una sola fotografía puede salvar un bosque entero al despertar la empatía humana por lo salvaje. Enseña composición de impacto visual en terreno.',
    specialty: 'Fotografía de Conservación, Ornitología, Educación Ambiental',
    languages: ['Español', 'Inglés', 'Francés'],
    certifications: ['Licenciada en Ciencias Ambientales', 'Fotógrafa de Conservación iLCP Fellow', 'WFR Rescue Specialist'],
    quote: 'La fotografía de naturaleza no busca capturar belleza, busca registrar el alma de los ecosistemas para que nadie pueda fingir que no los destruimos.',
    gallery: [
      'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

const INITIAL_PROJECTS: ImpactProject[] = [
  {
    id: 'reforestacion-alerces',
    title: 'Reforestación de Alerces en Cuencas Costeras',
    category: 'Reforestación',
    description: 'Recuperación de microcuencas hídricas mediante la siembra activa de árboles nativos endémicos.',
    metricValue: '4,500+',
    metricLabel: 'Árboles Nativos Sembrados',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
    location: 'Cordillera de la Costa, Valdivia',
    details: 'Este proyecto trabaja de la mano con las comunidades Mapuche Huilliche locales, quienes gestionan los viveros forestales nativos comunitarios. Cada expedición de Raulif adquiere plántulas locales asegurando ingresos justos a los agricultores de la zona y luego nuestro equipo y viajeros las plantan en zonas degradadas por antiguas explotaciones forestales.'
  },
  {
    id: 'aulas-de-selva',
    title: 'Aulas de Selva: Educación Ambiental Rural',
    category: 'Educación',
    description: 'Equipamiento y desarrollo de talleres de ciencias del bosque para niños en escuelas rurales aisladas.',
    metricValue: '12',
    metricLabel: 'Escuelas Apoyadas Gratuitamente',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop',
    location: 'Región de Los Ríos, Los Lagos y Araucanía',
    details: 'Financiamos talleres dinámicos donde los niños de colegios rurales ingresan a las reservas naturales científicas equipados con lupas, binoculares y guías de identificación de aves. El dinero del motor de sostenibilidad de Raulif permite becar el 100% de estas salidas de campo que empoderan a los futuros guardianes del territorio.'
  },
  {
    id: 'monitoreo-fauna',
    title: 'Red de Cámaras Trampa para Fauna Amenazada',
    category: 'Conservación',
    description: 'Monitoreo científico de mamíferos endémicos para establecer corredores biológicos seguros.',
    metricValue: '350 ha',
    metricLabel: 'Área Bajo Monitoreo Activo',
    image: 'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=600&auto=format&fit=crop',
    location: 'Reserva Costera Valdiviana',
    details: 'Gracias a los patrocinios y membresías del motor de impacto, hemos consolidado una red de monitoreo acústico e infrarrojo de fauna silvestre. El estudio de especies elusivas como el pudú o el marsupial monito del monte nos permite mapear sus rutas de alimentación para proteger la selva de carreteras u otras amenazas.'
  }
];

const INITIAL_BLOG: BlogPost[] = [
  {
    id: '1',
    title: 'El lenguaje secreto de los Alerces Milenarios',
    slug: 'lenguaje-secreto-alerces',
    excerpt: '¿Cómo se comunican los gigantes del bosque chileno a través de redes fúngicas subterráneas? Un viaje científico bajo la hojarasca.',
    content: `El bosque templado lluvioso valdiviano no es simplemente una colección de árboles individuales. Es una súper estructura viva que respira y se comunica de formas que apenas estamos comenzando a comprender.

En el corazón de este bosque habita el **Alerce (Fitzroya cupressoides)**, un gigante capaz de vivir más de 3.600 años. Pero, ¿cómo logra un árbol sobrevivir a plagas, fuegos, glaciaciones y sequías durante tres milenios?

La respuesta se encuentra debajo de nuestros pies: la red de micorrizas.

### Las Redes de Micorrizas: El Internet de la Selva
Las raíces de los alerces están íntimamente entrelazadas con kilómetros de filamentos de hongos microscópicos conocidos como micorrizas. Esta simbiosis beneficia a ambos reinos:
1. **Los hongos** reciben carbono y azúcares que los alerces generan mediante fotosíntesis.
2. **Los árboles** reciben nutrientes críticos como fósforo, nitrógeno y minerales que los hongos extraen del suelo rocoso con precisión química.

Pero esta relación va mucho más allá del intercambio alimentario. A través de estas autopistas fúngicas subterráneas, los alerces ancianos transfieren activamente azúcares a las plántulas jóvenes que crecen en las sombras profundas del bosque, donde la luz solar es insuficiente para hacer fotosíntesis. Los árboles abuelos actúan como nodrizas de las futuras generaciones (representadas en la **F** de nuestra organización).

### Señales de Alerta Química
Cuando un árbol es atacado por insectos o patógenos, envía señales bioquímicas y eléctricas a través de las micorrizas hacia sus vecinos sanos. Estos últimos, al recibir la alarma, comienzan a producir inmediatamente defensas químicas (taninos amargos) en sus hojas para evitar ser devorados cuando la plaga llegue.

En **Raulif**, defendemos la idea de que conocer estos asombrosos sistemas de cooperación natural es el primer paso indispensable para protegerlos. Al caminar junto a nosotros por el sendero valdiviano, no solo verás árboles monumentales; serás testigo de la mayor red de cooperación solidaria del planeta.`,
    authorId: 'claudio-araya',
    publishedAt: '2026-06-15',
    readTime: '4 min lectura',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop',
    tags: ['Conservación', 'Ciencia', 'Bosque Valdiviano'],
    isPublished: true
  },
  {
    id: '2',
    title: 'Fotografía para salvar un bosque: la mirada empática',
    slug: 'fotografia-salvar-bosque',
    excerpt: 'Cómo el encuadre, la luz y la paciencia pueden movilizar el activismo ambiental internacional. Guía práctica de fotografía de impacto.',
    content: `Se suele decir que los biólogos estudian la naturaleza con el cerebro, mientras que los fotógrafos la sienten con el corazón. Para lograr la verdadera conservación, necesitamos ambas herramientas.

La **fotografía de conservación** difiere de la simple fotografía de paisajes en un aspecto ético fundamental: su propósito principal no es generar una imagen estéticamente perfecta, sino documentar la relación entre un ser vivo, su hábitat y las amenazas que enfrenta para inspirar un cambio conductual en el observador.

### 1. El Retrato del Ecosistema como Sujeto
Para humanizar a la selva, debemos retratarla como si fuera una persona. En lugar de amplias panorámicas genéricas, busca los "primeros planos del bosque":
- El ojo húmedo de un pudú entre la maleza.
- El rocío suspendido sobre un liquen que solo crece en aire 100% puro.
- El detalle táctil de la corteza de un Raulí.

### 2. La Ética sobre la Captura
El fotógrafo de conservación jamás altera el entorno por una foto. No cortamos ramas para despejar la vista, no acosamos a los animales con flash directo ni invadimos sus zonas de anidación. En nuestras expediciones de Raulif, priorizamos la integridad de la fauna. La paciencia, camuflados en el dosel forestal, es nuestra mejor lente de aumento.

### 3. Del Pixel a la Acción
Una gran foto es inútil si se queda en un disco duro. Creemos firmemente que al compartir tu reportaje fotográfico de la expedición con tu comunidad en Europa (España, Alemania y más), creas un puente emocional directo hacia la naturaleza chilena. Logras que personas que nunca han pisado el hemisferio sur entiendan que el pulmón frío valdiviano les pertenece a ellos también.`,
    authorId: 'sofia-walker',
    publishedAt: '2026-07-02',
    readTime: '5 min lectura',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop',
    tags: ['Fotografía', 'Educación', 'Aventura'],
    isPublished: true
  }
];

const INITIAL_STATE: GlobalCMSState = {
  home: {
    heroTitle: 'Conocer para Proteger',
    heroSubtitle: 'Construimos la principal comunidad europea para explorar la salvaje naturaleza de Chile y resguardarla para las futuras generaciones.',
    heroImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1600&auto=format&fit=crop',
    heroVideoUrl: '',
    missionTitle: 'Nuestra Misión No Es Vender Viajes',
    missionQuote: 'Nadie protege aquello que no conoce.',
    missionText: 'Creemos que viajar es un acto de profunda responsabilidad. Por eso diseñamos expediciones que funcionan como documentales interactivos en el territorio chileno. Cada huella que dejamos debe ser positiva. Transformamos el turismo de aventura en una herramienta directa para financiar la conservación de bosques lluviosos templados, la educación en escuelas rurales y el monitoreo científico de especies vulnerables.',
    storyPreviewTitle: 'Raulif: La Huella Compartida',
    storyPreviewText: 'Inspirados por el Raulí, árbol icónico de los bosques húmedos del sur de Chile, y guiados por la F de las Futuras Generaciones. El símbolo de nuestra huella digital nos recuerda que cada paso en la Tierra cuenta.',
    storyPreviewImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop'
  },
  historia: {
    title: 'El Origen de Raulif',
    subtitle: 'Nuestra huella en el planeta puede ser una marca de vida y conservación.',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1600&auto=format&fit=crop',
    originText1: 'Raulif nació de una profunda inquietud compartida entre naturalistas europeos y biólogos chilenos: la velocidad de degradación de los últimos bosques vírgenes del planeta y la desconexión emocional de la humanidad con la biosfera.',
    originText2: 'Chile posee uno de los mayores refugios de biodiversidad templada del planeta en su Cordillera de la Costa y su Patagonia silvestre. Entendimos que no bastaba con publicar estudios científicos; era vital llevar a personas sensibles a encontrarse con estos ecosistemas cara a cara, generando un lazo de pertenencia que trascienda fronteras y active un compromiso de por vida.',
    symbolTitle: 'El Significado Detrás del Símbolo',
    symbolText: 'Nuestro nombre fusiona "Raulí" —árbol nativo majestuoso que representa la fuerza y adaptabilidad de los bosques templados— y la letra "F", símbolo inquebrantable de las Futuras Generaciones que heredarán la salud de esta tierra. El imagotipo incorpora una huella digital que traza los anillos de crecimiento del árbol, recordándonos que toda aventura humana deja un impacto. Nuestra misión existencial es que tu huella sea activamente regenerativa.',
    symbolImage: 'https://images.unsplash.com/photo-1589412227181-fc7e68df6d0d?q=80&w=800&auto=format&fit=crop',
    missionTitle: 'Nuestra Misión',
    missionText: 'Conectar de forma profunda a las personas con los ecosistemas naturales más salvajes de Chile, integrándolas activamente en iniciativas de conservación científica y educación socio-ambiental para inspirar y financiar su protección perpetua.',
    visionTitle: 'Nuestra Visión a 20 Años',
    visionText: 'Convertirnos en la red comunitaria de conservación ambiental más influyente de Europa y Chile, uniendo a científicos, exploradores, educadores y comunidades locales bajo un modelo de startup regenerativa que demuestre que el dinero es un catalizador para mantener viva la salud de los bosques silvestres del mundo.',
    philosophyTitle: 'Filosofía Regenerativa',
    philosophyText: 'No creemos en el ecoturismo pasivo o contemplativo. Para Raulif, el dinero nunca será el fin supremo; es la herramienta que nos permite mantener activa la misión. Rechazamos el turismo masivo. Creamos expediciones limitadas, con bases científicas rigurosas, donde cada viajero asume un rol activo de guardaparque y educador solidario.'
  },
  expediciones: INITIAL_EXPEDITIONS,
  embajadores: INITIAL_AMBASSADORS,
  impacto: {
    summary: 'A través de nuestro Motor de Sostenibilidad, cada expedición financia directamente programas reales en el territorio. Uniendo fuerzas con fundaciones locales y la comunidad, convertimos la curiosidad viajera en hectáreas protegidas.',
    reforestedCount: 4500,
    schoolsSupported: 12,
    conservedHectares: 350,
    projects: INITIAL_PROJECTS
  },
  blog: INITIAL_BLOG,
  seo: {
    home: {
      title: 'RAULIF | Conocer para Proteger la Naturaleza de Chile',
      description: 'Únete a la comunidad europea que viaja a Chile para vivir expediciones de conservación interactiva y apoyar la reforestación activa del bosque templado.',
      keywords: 'viajes conservación chile, ecoturismo valdivia, senderismo científico chile, reforestación alerces, raulif chile, viajar con proposito',
      ogImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1200&auto=format&fit=crop'
    },
    historia: {
      title: 'Nuestra Historia | El Propósito y Filosofía de RAULIF',
      description: 'Descubre cómo fusionamos el Raulí y el compromiso con las Futuras Generaciones para impulsar un modelo de turismo regenerativo y de conservación en Chile.',
      keywords: 'origen raulif, significado raulif, turismo regenerativo chile, bosque templado lluvioso chile, conservación de bosques chile',
      ogImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop'
    },
    expediciones: {
      title: 'Expediciones Raulif | Experiencias Científicas y de Conservación',
      description: 'No vendemos paquetes turísticos. Diseñamos documentales interactivos guiados por científicos en el bosque lluvioso templado y glaciares de Chile.',
      keywords: 'expediciones cientificas chile, turismo cientifico valdivia, trekking alerces milenarios, viajar a chile de forma sostenible',
      ogImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop'
    },
    bosqueValdiviano: {
      title: 'Expedición Bosque Valdiviano | Slow Trekking y Monitoreo de Fauna',
      description: 'Participa activamente en el monitoreo acústico del pudú y la siembra de alerces milenarios. 5 días de inmersión total en la selva costera de Chile.',
      keywords: 'reserva costera valdiviana trekking, pudu monitoreo camaras trampa, slow trekking chile, alerces abuelos valdivia',
      ogImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop'
    },
    embajadores: {
      title: 'Nuestros Embajadores | Científicos y Conservacionistas de Raulif',
      description: 'Conoce al equipo de doctores en ecología y fotógrafos internacionales que lideran nuestras expediciones científicas en el territorio chileno.',
      keywords: 'guias cientificos chile, biólogos conservación chile, fotógrafos conservación, claudio araya biologo, sofia walker fotografa',
      ogImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop'
    },
    impacto: {
      title: 'El Impacto de Raulif | Transparencia de Conservación y Educación',
      description: 'El 100% de nuestras donaciones y una porción mayoritaria de las expediciones financia reforestación nativa, educación ambiental rural y cámaras trampa.',
      keywords: 'impacto ecologico chile, reforestacion bosques chile, escuelas rurales educacion ambiental, transparencia raulif',
      ogImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop'
    },
    blog: {
      title: 'El Bosque Escrito | Blog de Conservación y Exploración de Raulif',
      description: 'Artículos científicos de fondo, consejos de fotografía de conservación y crónicas de expediciones en las reservas de Chile.',
      keywords: 'blog de conservación chile, micorrizas alerces chile, como fotografiar animales chile, articulos ecologia forestal',
      ogImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
    },
    contacto: {
      title: 'Contacto | Únete al Movimiento de Conservación Raulif',
      description: 'Resuelve tus dudas sobre viajes científicos, voluntariado o patrocinio con nuestro equipo en España y Chile.',
      keywords: 'contacto raulif, oficinas raulif españa chile, dudas expedicion chile',
      ogImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1200&auto=format&fit=crop'
    }
  },
  newsletter: [
    { id: 'sub-1', email: 'alberto.conservacion@gmail.com', createdAt: '2026-07-15T12:00:00.000Z' },
    { id: 'sub-2', email: 'elena.trekking@outlook.es', createdAt: '2026-07-18T15:30:00.000Z' }
  ],
  waitlist: [
    {
      id: 'wait-1',
      expeditionId: 'bosque-valdiviano',
      name: 'Marta Gómez Ortiz',
      email: 'marta.gomez@gmail.com',
      phone: '+34 612 345 678',
      preferredDate: '24-28 Noviembre 2026',
      notes: 'Apasionada por la fotografía de conservación y el senderismo costero.',
      createdAt: '2026-07-17T09:45:00.000Z'
    }
  ],
  contactoSubmissions: [
    {
      id: 'con-1',
      name: 'Ignacio Müller',
      email: 'ignacio@muller.de',
      subject: 'Oportunidades de Patrocinio Científico',
      message: 'Hola equipo Raulif. Me encanta la visión del motor de impacto. Soy representante de una marca de equipamiento outdoor en Alemania y quisiéramos saber si podemos donar equipos científicos.',
      createdAt: '2026-07-18T18:20:00.000Z'
    }
  ]
};

const LOCAL_STORAGE_KEY = 'raulif_cms_state';

export function getCMSState(): GlobalCMSState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure key arrays are properly seeded if loaded stale state
      return {
        ...INITIAL_STATE,
        ...parsed,
        home: { ...INITIAL_STATE.home, ...parsed.home },
        historia: { ...INITIAL_STATE.historia, ...parsed.historia },
        impacto: { ...INITIAL_STATE.impacto, ...parsed.impacto },
        seo: { ...INITIAL_STATE.seo, ...parsed.seo },
      };
    }
  } catch (e) {
    console.error('Error reading localStorage state:', e);
  }
  return INITIAL_STATE;
}

export function saveCMSState(state: GlobalCMSState): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    // Trigger custom event to notify other components of state changes
    window.dispatchEvent(new Event('cms_state_updated'));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
}

export function resetCMSState(): GlobalCMSState {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    window.dispatchEvent(new Event('cms_state_updated'));
  } catch (e) {
    console.error('Error resetting state:', e);
  }
  return INITIAL_STATE;
}
