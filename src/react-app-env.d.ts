/// <reference types="react-scripts" />

declare module 'file-icons-js' {
  class Icon {}
  export const getClass: (name: string, match?: Icon) => string;
  export const getClassWithColor: (name: string, match?: Icon) => string;
}

declare module 'language-detect' {
  const detect: {
    filename: (name: string) => string | undefined;
  };
  export default detect;
}
