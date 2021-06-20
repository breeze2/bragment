import { CodeEditor, fileExtensionToLanguageMap } from '@yickfung/coditor-core';

export function createCodeEditor(
  el: HTMLElement,
  content?: string,
  language?: string
) {
  return new CodeEditor(el, { language, content });
}

export function detectFileExtension(fileName: string) {
  const matches = fileName.match(/(\.[^.]+)/g);
  while (matches && matches.length) {
    const ext = matches.join('');
    const language = fileExtensionToLanguageMap.get(ext);
    if (language) {
      return ext;
    }
    matches.shift();
  }
}
