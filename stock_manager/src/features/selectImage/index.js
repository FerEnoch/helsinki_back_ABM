import { shouldAddImage } from './lib/shouldAddImage';

export default function onEdit(e) {
  const { range: selectedCell, source: spreadSheet } = e;

  const addImageAction = shouldAddImage({ selectedCell, spreadSheet });
  if (!addImageAction) return;

  if (!selectedCell.getValue()) {
    // UI danger style is now done by the sheet validation rules
    // selectedCell.setBackgroundRGB(255, 0, 0);
    spreadSheet.toast('📷 Producto sin imagen! Agrégala desde el menú', '📲 APP', 6);
    return;
  }

  const cellValue = selectedCell.getValue().toString();
  const isValidLink = cellValue.includes('https://drive.google.com/uc?export=view&id=');
  if (!isValidLink) {
    // UI danger style is now done by the sheet validation rules
    // selectedCell.setBackgroundRGB(255, 0, 0);
    spreadSheet.toast('🖇 Link Inválido! ⚠ No va a funcionar en la app', '📲 APP', 6);
  }
}
