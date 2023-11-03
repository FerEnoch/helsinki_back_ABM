import { updatePrompt } from '../lib/updatePrompt';
import { UI_MESSAGES } from '../../shared/config/ui-messages';
import { databaseController } from './model/databaseController';

export default async function stockUpdate() {
  const { INFO, CONFIRM, OPERATION_FAILURE } = UI_MESSAGES.MENU.APP_UPDATE.ITEM_1.PROMPT;
  const [UI, result] = updatePrompt(INFO, CONFIRM);

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
      UI.alert(OPERATION_FAILURE);
    }
  }
}