export function onOpen() {
  const UI = SpreadsheetApp.getUi();
  UI.createMenu('📷 Agregar imagen').addItem('🔗 Cargar URL', 'showSelectionWindow').addToUi();
  UI.createMenu('📱 Actualizar App').addItem('📲 Actualizar', 'appUpdate').addToUi();
}
