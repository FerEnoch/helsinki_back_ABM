export function getCellValues({ range, sheet }) {
  const value = range && sheet.getRange(range).getValue();
  return value || 0;
}
