import { memo, useEffect, useRef } from 'react';
import { createCodeEditor } from '../../api/coditor';
import styles from './index.module.scss';

export interface ICodeEditor {
  fileExtension?: string;
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
}

function CodeEditor(props: ICodeEditor) {
  const { fileExtension, language, value, onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof createCodeEditor> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = createCodeEditor(containerRef.current);
      editorRef.current.onContentUpdate((content) => {
        if (onChangeRef.current && editorRef.current) {
          onChangeRef.current(content);
        }
      });
    }
  }, []);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.getContent() !== value) {
      editor.setContent(value || '');
    }
  }, [value]);
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && language) {
      editor.setLanguage(language);
    }
  }, [language]);
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && fileExtension) {
      editor.setLanguage(fileExtension);
    }
  }, [fileExtension]);

  return <div className={styles.codeEditor} ref={containerRef} />;
}

export default memo(CodeEditor);
