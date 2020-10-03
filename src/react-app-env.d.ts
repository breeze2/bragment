/// <reference types="react-scripts" />

declare module 'file-icons-js' {
  class FileIcons {
    public getClass: (name: string) => string;
    public getClassWithColor: (name: string) => string | null;
  }
  const fileIcons: FileIcons;
  export default fileIcons;
}

declare module 'language-detect' {
  const detect: {
    filename: (name: string) => string | undefined;
  };
  export default detect;
}
