import { dialog, ipcMain } from 'electron'

export function registerFileHandlers(): void {
  ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    return result.canceled ? null : result.filePaths[0]
  })
}
