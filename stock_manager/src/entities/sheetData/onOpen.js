import { UI_MESSAGES } from '../../shared/config/ui-messages';

export function onOpen() {
  const {
    APP_UPDATE: {
      LABEL: updateApplication,
      ITEM_1: { LABEL: stock, FUNCTION: appUpdate },
      ITEM_2: { LABEL: info, FUNCTION: infoUpdate },
      ITEM_3: { LABEL: businessHours, FUNCTION: updateBusinessHours },
    },
    SELECT_IMAGE: {
      LABEL: selectImage,
      ITEM_1: { LABEL: loadURL, FUNCTION: loadURLFunction },
    },
  } = UI_MESSAGES.MENU;

  const UI = SpreadsheetApp.getUi();
  UI.createMenu(selectImage).addItem(loadURL, loadURLFunction).addToUi();
  UI.createMenu(updateApplication)
    .addItem(stock, appUpdate)
    .addSeparator()
    .addItem(info, infoUpdate)
    .addSeparator()
    .addItem(businessHours, updateBusinessHours)
    .addToUi();
}
