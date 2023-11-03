import { UI_MESSAGES } from '../../shared/config/ui-messages';
import { updatePrompt } from '../lib/updatePrompt';
import { updateAppInfo } from './model/updateAppInfo';

export async function infoUpdate() {
  const { INFO, CONFIRM, OPERATION_FAILURE, OPERATION_SUCCESS } = UI_MESSAGES.MENU.APP_UPDATE.ITEM_2.PROMPT;
  const [UI, result] = updatePrompt(INFO, CONFIRM);

  if (result === UI.Button.YES) {
    try {
      const { message } = await updateAppInfo();
      if (message === 'success') UI.alert(OPERATION_SUCCESS);
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
