import { UI_MESSAGES } from './config/ui-messages';
import { databaseController } from './model/databaseController';

export default async function appUpdate() {
  const UI = SpreadsheetApp.getUi();
  const result = UI.alert(
    UI_MESSAGES.UPDATE_CONFIRMATION.INFO,
    UI_MESSAGES.UPDATE_CONFIRMATION.CONFIRM,
    UI.ButtonSet.YES_NO
  );

  if (result === UI.Button.YES) {
    try {
      const appUpdated = await databaseController();
      UI.alert(appUpdated);
    } catch (e) {
      console.error(e.message); /* eslint-disable-line */
      if (e.cause === 429) {
        UI.alert(e.message);
        return;
      }
      UI.alert(UI_MESSAGES.UPDATE_FAILURE);
    }
  }
}
