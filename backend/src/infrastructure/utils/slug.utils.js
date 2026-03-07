// Convierte cualquier texto en un slug URL-amigable
// "Audífonos Bluetooth Pro 2024" → "audifonos-bluetooth-pro-2024"
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .normalize('NFD')                    // Descompone caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '')     // Elimina los acentos
        .replace(/[^a-z0-9\s-]/g, '')       // Elimina caracteres especiales
        .trim()
        .replace(/\s+/g, '-');              // Espacios → guiones
};