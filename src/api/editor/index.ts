import { editor } from 'monaco-editor';
import TomorrowDark from './themes/TomorrowDark.json';
import TomorrowLight from './themes/TomorrowLight.json';

export enum ETheme {
  TomorrowDark = 'TomorrowDark',
  TomorrowLight = 'TomorrowLight',
}

editor.defineTheme(
  ETheme.TomorrowDark,
  TomorrowDark as editor.IStandaloneThemeData
);
editor.defineTheme(
  ETheme.TomorrowLight,
  TomorrowLight as editor.IStandaloneThemeData
);

editor.setTheme(ETheme.TomorrowLight);

export function setMonacoEditorTheme(theme: ETheme) {
  editor.setTheme(theme);
}
export function createMonacoEditor(
  el: HTMLElement,
  language: string,
  value: string = ''
) {
  return editor.create(el, {
    automaticLayout: true,
    fontSize: 14,
    language,
    minimap: {
      enabled: false,
    },
    value,
    wordWrap: 'on',
  });
}
