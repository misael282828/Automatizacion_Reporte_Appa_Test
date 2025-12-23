// Enum que usará el TEST (limpio y legible)
export enum EditorColor {
  ROJO = 'ROJO',
  VERDE = 'VERDE',
  NARANJA = 'NARANJA',
  MORADO = 'MORADO',
  GRIS = 'GRIS',
}

// Map interno (detalle de implementación)
export const EditorColorHex: Record<EditorColor, string> = {
  [EditorColor.ROJO]: '#E03E2D',
  [EditorColor.VERDE]: '#2DC26B',
  [EditorColor.NARANJA]: '#E67E23',
  [EditorColor.MORADO]: '#B96AD9',
  [EditorColor.GRIS]: '#7E8C8D',
};
