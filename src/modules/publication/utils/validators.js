// =========================
// Helpers internos privados
// =========================
const normalizeText = (text) =>
  text.replace(/\s+/g, ' ').trim();

const isMostlyUppercase = (text, threshold = 0.9) => {
  const letters = text.match(/[a-zA-ZÁÉÍÓÚáéíóúÑñ]/g) || [];
  const uppercase = text.match(/[A-ZÁÉÍÓÚÑ]/g) || [];

  if (letters.length === 0) return false;

  return (uppercase.length / letters.length) > threshold;
};

const hasExcessivePunctuation = (text) =>
  /!{3,}|\.{4,}|\?{3,}/.test(text);

const hasRepeatedCharacters = (text) =>
  /(.)\1{5,}/.test(text);

const hasExcessiveWordRepetition = (text, limit = 6) => {
  const words = text.toLowerCase().split(/\s+/);
  const frequency = {};

  for (const word of words) {
    if (word.length > 3) {
      frequency[word] = (frequency[word] || 0) + 1;
      if (frequency[word] > limit) return true;
    }
  }

  return false;
};

// =========================
// Validadores públicos
// =========================
export const validateTitulo = (titulo) => {
  const value = normalizeText(titulo).trim().replace(/\s+/g, ' '); // Normalizar texto: trim + espacios múltiples a uno solo
  if (!value) //Obligatorio
    return 'Este campo es obligatorio';

  if (value.length < 20) // Longitud mínima
    return 'El título es muy corto (mínimo 20 caracteres)';

  if (value.length > 50) // Longitud máxima
    return 'El título es demasiado largo (máximo 50 caracteres)';

  if (isMostlyUppercase(value)) // Evitar todo en mayúsculas
    return 'El título no debe estar escrito solo en mayúsculas';

  // Regex de caracteres permitidos
  const regex = /^[0-9A-Za-zÁÉÍÓÚÜáéíóúüÑñ.,;:!?'"()\/\[\]\- ]+$/;

  // Verificar caracteres inválidos
  if (!regex.test(value)) {
    const invalidChars = Array.from(value)
      .filter(c => !regex.test(c));
    const uniqueInvalid = [...new Set(invalidChars)].join(' ');
    return `El título contiene caracteres no permitidos: ${uniqueInvalid}`;
  }
  return '';
};

export const validateNombre = (nombre) => {
  const value = normalizeText(nombre);

  if (!value)
    return 'Este campo es obligatorio';

  if (value.length < 3)
    return 'El nombre es muy corto (mínimo 3 caracteres)';

  if (value.length > 80)
    return 'El nombre es demasiado largo (máximo 80 caracteres)';

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(value))
    return 'El nombre solo puede contener letras y espacios';

  return '';
};


export const validateApellido = (apellido) => {
  const value = normalizeText(apellido);

  if (!value)
    return 'Este campo es obligatorio';

  if (value.length < 3)
    return 'El apellido es muy corto (mínimo 3 caracteres)'; //Paz

  if (value.length > 120)
    return 'El apellido es demasiado largo (máximo 120 caracteres)';

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(value))
    return 'El apellido solo puede contener letras y espacios';

  return '';
};

export const validaterazonSocial = (razonSocial) => {
  const value = normalizeText(razonSocial).trim().replace(/\s+/g, ' '); // Normalizar texto: trim + espacios múltiples a uno solo

  if (!value) //Obligatorio
    return 'Este campo es obligatorio';

  if (value.length < 3) // Longitud mínima
    return 'La razón social es muy corta (mínimo 3 caracteres)';

  if (value.length > 150) // Longitud máxima
    return 'La razón social es demasiado larga (máximo 150 caracteres)';

  // Regex de caracteres permitidos
  const regex = /^[0-9A-Za-zÁÉÍÓÚÜáéíóúüÑñ.,&'()\/\- ]+$/;

  // Verificar caracteres inválidos
  if (!regex.test(value)) {
    const invalidChars = Array.from(value)
      .filter(c => !regex.test(c));
    const uniqueInvalid = [...new Set(invalidChars)].join(' ');
    return `La razón social contiene caracteres no permitidos: ${uniqueInvalid}`;
  }

  return '';
};

export const validateTelefonoColombia = (telefono) => {
  const clean = telefono.replace(/\s+/g, '').replace(/-/g, '');

  if (!/^(?:\+57)?3\d{9}$/.test(clean))
    return 'Teléfono inválido (debe comenzar con 3 y tener 10 dígitos)';

  return '';
};

export const validateEmail = (email) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Email inválido';

  return '';
};

export const validateDescripcion = (descripcion) => {
  const value = normalizeText(descripcion);
  const len = value.length;

  if (len < 120) // Longitud
    return 'La descripción debe tener al menos 120 caracteres';

  if (len > 500)
    return 'La descripción no puede exceder 500 caracteres';

  if (isMostlyUppercase(value)) // Mayúsculas
    return 'La descripción no debe estar escrita solo en mayúsculas';

  if (hasExcessivePunctuation(value)) // Puntuación / repetición
    return 'Evita el uso excesivo de signos de puntuación';

  if (hasRepeatedCharacters(value))
    return 'El texto contiene secuencias repetitivas inválidas';

  if (hasExcessiveWordRepetition(value))
    return 'Evita repetir demasiado las mismas palabras';

  // Validación de caracteres permitidos
  const allowedCharsRegex = /^[0-9A-Za-zÁÉÍÓÚÜáéíóúüÑñ.,;:!?\-'"()\/\[\]{}@#$%€\s]+$/;
  if (!allowedCharsRegex.test(value)) {
    // Detectar los caracteres inválidos
    const invalidChars = Array.from(value).filter(c => !allowedCharsRegex.test(c));
    // Eliminar duplicados y unir
    const uniqueInvalid = [...new Set(invalidChars)].join(' ');
    return `La descripción contiene caracteres no permitidos: ${uniqueInvalid}`;
  }

  return '';
};

export const validateDireccion = (direccion) => {
  const value = normalizeText(direccion).trim().replace(/\s+/g, ' ');
  const len = value.length;

  if (!value)
    return 'La dirección es obligatoria';

  if (len < 8)
    return 'La dirección es demasiado corta';

  if (len > 150)
    return 'La dirección es demasiado larga';

  if (isMostlyUppercase(value))
    return 'La dirección no debe estar escrita solo en mayúsculas';

  if (hasRepeatedCharacters(value))
    return 'La dirección contiene caracteres repetitivos inválidos';

  if (!/\d/.test(value))
    return 'La dirección debe incluir un número';

  if (/^\d+$/.test(value))
    return 'La dirección no puede contener solo números';

  // Regex de caracteres permitidos
  const regex = /^[0-9A-Za-zÁÉÍÓÚÜáéíóúüÑñ.,#\-\/\s]+$/;
  if (!regex.test(value)) {
    const invalidChars = [...new Set(Array.from(value).filter(c => !regex.test(c)))].join(' ');
    return `La dirección contiene caracteres no permitidos: ${invalidChars}`;
  }

  return '';
};