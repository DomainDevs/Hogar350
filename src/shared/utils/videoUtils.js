// videoUtils.js
// -------------------------------
// Diccionario de términos permitidos (contenido inmobiliario)
// -------------------------------
const allowedTerms = [
  // Tipos de propiedad
  "casa", "casas", "apartamento", "departamento", "lote", "terreno", "consultorio",
  "habitación", "habitación compartida", "dpto", "penthouse", "ático", "cabaña",
  "villa", "chalet", "finca", "rancho", "edificio de oficinas", "edificio de apartamentos",
  "bodega", "local comercial", "oficina", "garaje", "parqueadero", "estudio", "loft",
  // Operaciones
  "venta", "arriendo", "alquiler", "compartir", "renta", "subarriendo", "preventa", "estrenar",
  "transferencia", "negocio inmobiliario", "permuta", "inversión", "opción de compra",
  // Etapas / proyectos
  "construcción", "casa en construcción", "proyecto", "proyectos de vivienda",
  "proyecto inmobiliario", "vivienda nueva", "construcción nueva", "plan maestro", "urbanización",
  "desarrollo", "desarrollo urbano", "zonas residenciales", "obra gris", "obra blanca",
  // Temas de hogar y decoración
  "hogar", "interiores", "decoración", "remodelación", "remodelar", "reformas", "diseño de interiores",
  "mobiliario", "amueblado", "equipado", "jardín", "terraza", "balcón", "patio",
  "piscina", "garage", "cochera", "zonas comunes", "seguridad", "ascensor",
  // Bienes raíces y propiedades
  "inmueble", "inmobiliaria", "propiedad", "bien raíz", "real estate", "lote urbanizable",
  "condominio", "apartaestudio", "mansión", "conjunto", "apartamento amoblado", "apartamento sin amoblar", "inversión inmobiliaria",
  "patrimonio", "arrendamiento", "gestión inmobiliaria", "servicios inmobiliarios",
  // Localización y comunidad
  "residencial", "edificio", "zona", "vecindario", "barrio", "urbanización", "ciudad",
  "sector", "comunidad", "localidad", "cercanía", "acceso", "transporte", "entorno",
  // Otros relacionados
  "proyecto habitacional", "inmueble comercial", "espacio comercial", "oficina corporativa",
  "negocio", "edificio industrial", "nave industrial", "desarrollo de proyectos",
  "vivienda sostenible", "vivienda ecológica", "eco-hogar", "apartamento turístico", 
  "mudarse","mudanzas","proyecto", "residencia", "bienes", "raíces", "obra", "piso", 
  // Otros idiomas
  "modern house", "house", "home", "construction", "roomie", "roommate", "roommates", 
  "flatmate", "flatmates", "share apartment", "shared apartment", "shared flat", "housemate",
  "housemates", "co-living", "co-living space", "room for rent", "rent a room", "sublet",
  "sublease", "leasing a room", "apartment share", "room sharing",
  // Compra
  "buy house", "buy home", "buy apartment", "purchase house", "purchase home", "purchase apartment",
  "real estate for sale", "property for sale", "house for sale", "apartment for sale", 
  "condo for sale", "invest in property", "investment property",
  // Arriendo / alquiler
  "rent house", "rent home", "rent apartment", "apartment for rent", "house for rent", "room for rent",
  "flat for rent", "lease house", "lease apartment", "rental property", "sublet", "sublease"
];

// -------------------------------
// Revisar si el texto contiene al menos un término permitido
// -------------------------------
const containsAllowedTerms = (text = "") => {
  const lower = text.toLowerCase();
  return allowedTerms.some(term => lower.includes(term));
};

// -------------------------------
// Extrae ID de YouTube
// -------------------------------
export const extractYouTubeId = (url) => {
  const regExp =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// -------------------------------
// Extrae ID de Vimeo
// -------------------------------
export const extractVimeoId = (url) => {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// -------------------------------
// Genera URL para iframe embebido
// -------------------------------
export const generateEmbedUrl = (url) => {
  const ytId = extractYouTubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;

  const vimeoId = extractVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;

  return '';
};

// -------------------------------
// Valida URL de video (estricto)
// -------------------------------
export const validateVideoUrl = async (url) => {
  const ytId = extractYouTubeId(url);
  const vimeoId = extractVimeoId(url);

  if (!ytId && !vimeoId) {
    return { valid: false, reason: 'Solo se permiten videos de YouTube (acceso público).' };
  }

  try {
    // -------------------------------
    // Validar YouTube
    // -------------------------------
    if (ytId) {
      const testUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`;
      const res = await fetch(testUrl);
      if (!res.ok) return { valid: false, reason: 'Video de YouTube no encontrado o restringido.' };
      const data = await res.json();

      if (!containsAllowedTerms(data.title)) {
        return { valid: false, reason: 'El video no parece relacionado con contenido inmobiliario.' };
      }
    }

    // -------------------------------
    // Validar Vimeo
    // -------------------------------
    if (vimeoId) {
      const res = await fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`);
      if (!res.ok) return { valid: false, reason: 'Video de Vimeo no encontrado o privado.' };
      const data = await res.json();
      const title = data[0]?.title || "";

      if (!data || data.length === 0 || !containsAllowedTerms(title)) {
        return { valid: false, reason: 'El video no parece relacionado con contenido inmobiliario.' };
      }
    }

    return { valid: true };
  } catch (err) {
    console.error(err);
    return { valid: false, reason: 'Error al validar el video.' };
  }
};