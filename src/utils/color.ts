import Color from 'color';

export function darkenColor(color: string, level: number) {
  return Color(color).darken(level).hex();
}

export function lightedColor(color: string, level: number) {
  return Color(color).lighten(level).hex();
}
