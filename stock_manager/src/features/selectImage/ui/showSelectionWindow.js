export function showSelectionWindow() {
  const html = HtmlService.createHtmlOutputFromFile('index.html')
    .setWidth(425)
    .setHeight(600)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);

  SpreadsheetApp.getUi().showModalDialog(html, 'Seleccionar Imagen para la App');
}
