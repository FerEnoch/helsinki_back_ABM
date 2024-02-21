import { UI_MESSAGES } from '../../shared/config/ui-messages';
import { updatePrompt } from '../lib/updatePrompt';
import { MAX_TASK_TIME_IN_MIN } from './config.js/checkExecutionTime';
import { prodInfoUpdate } from './model/prodInfoUpdate';

export async function productsUpdate() {
  const { INFO, CONFIRM, OPERATION_FAILURE, OPERATION_SUCCESS, OPERATION_NOT_NECESSARY, RESTART_OPERATION } =
    UI_MESSAGES.MENU.APP_UPDATE.ITEM_1.PROMPT;
  const [UI, result] = updatePrompt(INFO, CONFIRM);

  if (result === UI.Button.YES) {
    try {
      const { message, totalProducts, totalCombos, isNeededToRevalidateCache } = await prodInfoUpdate();
      if (message === 'success') {
        if (isNeededToRevalidateCache) {
          UI.alert(OPERATION_SUCCESS({ totalProducts, totalCombos }));
        } else {
          Logger.log(
            `Se analizaron ${totalProducts} productos y ${totalCombos} combos, y no fue necesario actualizar ninguno`
          );
          UI.alert(OPERATION_NOT_NECESSARY);
        }
      }
      if (message === 'retry') {
        Logger.log(`It's ${new Date().toLocaleTimeString(
          'es-AR'
        )} - Exceeded max execution time of ${MAX_TASK_TIME_IN_MIN} minutes 
        Please restart operation...`);
        UI.alert(RESTART_OPERATION);
      }
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
