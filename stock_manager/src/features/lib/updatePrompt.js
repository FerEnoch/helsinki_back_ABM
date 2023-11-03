export function updatePrompt(title, prompt) {
  const UI = SpreadsheetApp.getUi();
  const result = UI.alert(title, prompt, UI.ButtonSet.YES_NO);

  return [UI, result];
}
