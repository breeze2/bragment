import { memo, useEffect, useRef } from 'react';
import {
  createMonacoEditor,
  setMonacoEditorLanguage,
} from '../../../api/editor';
import styles from '../../../styles/CreateFragmentDialog.module.scss';

export interface IGistCodeEditor {
  language: string;
  value?: string;
  onChange?: (value: string) => void;
}

function GistCodeEditor(props: IGistCodeEditor) {
  const { language, value, onChange } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReturnType<typeof createMonacoEditor> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    if (containerRef.current) {
      editorRef.current = createMonacoEditor(
        containerRef.current,
        language,
        value
      );
      editorRef.current.onDidChangeModelContent((event) => {
        if (onChangeRef.current && editorRef.current) {
          onChangeRef.current(editorRef.current.getValue());
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== value) {
      editor.setValue(value || '');
    }
  }, [value]);
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      setMonacoEditorLanguage(editor, language);
    }
  }, [language]);

  return <div className={styles.gistCodeEditor} ref={containerRef} />;
}

export default memo(GistCodeEditor);
