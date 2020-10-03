import detect from 'language-detect';
import { editor as MonacoEditor } from 'monaco-editor';
import languages from './languages.json';
import TomorrowDarkJson from './themes/TomorrowDark.json';
import TomorrowLightJson from './themes/TomorrowLight.json';

export enum ETheme {
  TomorrowDark = 'TomorrowDark',
  TomorrowLight = 'TomorrowLight',
}

export const DEFAULT_LANGUAGE = 'plaintext';

MonacoEditor.defineTheme(
  ETheme.TomorrowDark,
  TomorrowDarkJson as MonacoEditor.IStandaloneThemeData
);
MonacoEditor.defineTheme(
  ETheme.TomorrowLight,
  TomorrowLightJson as MonacoEditor.IStandaloneThemeData
);

MonacoEditor.setTheme(ETheme.TomorrowLight);

export function setMonacoEditorTheme(theme: ETheme) {
  MonacoEditor.setTheme(theme);
}
export function createMonacoEditor(
  el: HTMLElement,
  language = DEFAULT_LANGUAGE,
  value = ''
) {
  return MonacoEditor.create(el, {
    automaticLayout: true,
    fontSize: 14,
    language,
    minimap: {
      enabled: false,
    },
    contextmenu: false,
    value,
    wordWrap: 'on',
    scrollbar: {
      alwaysConsumeMouseWheel: false,
    },
  });
}
export function setMonacoEditorLanguage(
  editor: MonacoEditor.IStandaloneCodeEditor,
  language: string
) {
  const model = editor.getModel();
  if (model) {
    return MonacoEditor.setModelLanguage(model, language);
  }
}
export function detectLanguageByFileName(fileName: string) {
  const language = detect.filename(fileName)?.toLocaleLowerCase();
  if (language && (languages as string[]).some((el) => el === language)) {
    return language;
  }
}
export function updateMonacoEditorLanguageByFileName(
  editor: MonacoEditor.IStandaloneCodeEditor,
  fileName: string
) {
  const language = detectLanguageByFileName(fileName);
  return setMonacoEditorLanguage(editor, language || DEFAULT_LANGUAGE);
}
