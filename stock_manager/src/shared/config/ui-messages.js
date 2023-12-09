const UPDATE_OPERATION_SUCCESS = (prodQuantity) =>
  `👍 Aplicación actualizada exitosamente con ${prodQuantity} productos`;
const UPDATE_OPERATION_FAILURE = 'Algo salió mal 😭 No es posible actualizar completa o parcialmente la aplicación 😢';
const UPDATE_OPERATION_NOT_NECESSARY = 'La aplicación está actualizada 😉';

export const UI_MESSAGES = {
  MENU: {
    SELECT_IMAGE: {
      LABEL: '📷 Agregar imagen',
      ITEM_1: {
        LABEL: '🔗 Cargar URL',
        FUNCTION: 'showSelectionWindow',
      },
    },
    APP_UPDATE: {
      LABEL: '📱 Actualizar App',
      ITEM_1: {
        LABEL: '📲 Stock',
        FUNCTION: 'productsUpdate', // deprecate stockUpdate
        PROMPT: {
          INFO: 'Estás a punto de modificar info de producto',
          CONFIRM:
            'Recuerda siempre hacer la mayor cantidad de cambios que necesites antes de actualizar\n¿Estás seguro?',
          OPERATION_SUCCESS: UPDATE_OPERATION_SUCCESS,
          OPERATION_FAILURE: UPDATE_OPERATION_FAILURE,
          OPERATION_NOT_NECESSARY: UPDATE_OPERATION_NOT_NECESSARY,
          RESTART_OPERATION: `La actualización tomó demasiado tiempo y quedan productos por actualizar.
             Por favor reiníciala para terminar el trabajo`,
        },
      },
      ITEM_2: {
        LABEL: '📲 Información',
        FUNCTION: 'infoUpdate',
        PROMPT: {
          INFO: 'Estas a punto de modificar información',
          CONFIRM:
            'Recuerda siempre hacer la mayor cantidad de cambios que necesites antes de actualizar\n¿Estás seguro?',
          OPERATION_SUCCESS: '👍 Aplicación actualizada exitosamente',
          OPERATION_FAILURE: UPDATE_OPERATION_FAILURE,
          OPERATION_NOT_NECESSARY: UPDATE_OPERATION_NOT_NECESSARY,
        },
      },
    },
  },
};
