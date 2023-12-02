import { UI_MESSAGES } from '../../shared/config/ui-messages';
import { updatePrompt } from '../lib/updatePrompt';
import { prodInfoUpdate } from './model/prodInfoUpdate';

export async function productsUpdate() {
  const { INFO, CONFIRM, OPERATION_FAILURE, OPERATION_SUCCESS, OPERATION_NOT_NECESSARY } =
    UI_MESSAGES.MENU.APP_UPDATE.ITEM_1.PROMPT;
  const [UI, result] = updatePrompt(INFO, CONFIRM);

  if (result === UI.Button.YES) {
    try {
      const { message, totalProducts, isNeededToUpdateProductsInfo } = await prodInfoUpdate();
      if (message === 'success') {
        if (isNeededToUpdateProductsInfo) {
          UI.alert(OPERATION_SUCCESS(totalProducts));
        } else {
          Logger.log(`Se analizaron ${totalProducts} productos y no fue necesario actualizar ninguno`);
          UI.alert(OPERATION_NOT_NECESSARY);
        }
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
