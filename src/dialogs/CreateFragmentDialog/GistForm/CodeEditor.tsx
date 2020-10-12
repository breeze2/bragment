import React from 'react';
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

const GistCodeEditor: React.FC<IGistCodeEditor> = React.memo((props) => {
  const { language, value, onChange } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<ReturnType<typeof createMonacoEditor> | null>(
    null
  );
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
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
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React.useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.getValue() !== value) {
      editor.setValue(value || '');
    }
  }, [value]);
  React.useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      setMonacoEditorLanguage(editor, language);
    }
  }, [language]);

  return <div className={styles.gistCodeEditor} ref={containerRef} />;
});

export default GistCodeEditor;
