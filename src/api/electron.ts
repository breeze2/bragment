import electron from 'electron';

export function openDirectoryDialog() {
  return electron.remote.dialog.showOpenDialogSync({
    properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
  });
}
