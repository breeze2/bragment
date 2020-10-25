import { editor as MonacoEditor } from 'monaco-editor';
import { extToLanguageDictionary } from './config';
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
    formatOnPaste: true,
    value,
    wordWrap: 'on',
    scrollbar: {
      alwaysConsumeMouseWheel: false,
      horizontalScrollbarSize: 8,
      verticalScrollbarSize: 8,
    },
    lineNumbersMinChars: 3,
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
  const matches = fileName.match(/(\.[^.]+)/g);
  while (matches && matches.length) {
    const language = extToLanguageDictionary[matches.join('')];
    if (language) {
      return language;
    }
    matches.shift();
  }
}
export function updateMonacoEditorLanguageByFileName(
  editor: MonacoEditor.IStandaloneCodeEditor,
  fileName: string
) {
  const language = detectLanguageByFileName(fileName);
  return setMonacoEditorLanguage(editor, language || DEFAULT_LANGUAGE);
}
