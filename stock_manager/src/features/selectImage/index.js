import { shouldAddImage } from './lib/shouldAddImage';

export default function onEdit(e) {
  const { range: selectedCell, source: spreadSheet } = e;

  const addImageAction = shouldAddImage({ selectedCell, spreadSheet });
  if (!addImageAction) return;

  if (!selectedCell.getValue()) {
    spreadSheet.toast('📷 La imagen es importante! Agrégala desde el menú', '📲 APP', 6);
    return;
  }

  const cellValue = selectedCell.getValue().toString();
  const isValidLink = cellValue.includes('https://drive.google.com/uc?export=view&id=');
  if (!isValidLink) {
    spreadSheet.toast('🖇 Link Inválido! ⚠ No va a funcionar en la app', '📲 APP', 6);
  }
}
