const UPDATE_OPERATION_SUCCESS = ({ totalProducts, totalCombos }) =>
  `👍 La app se actualizó exitosamente con ${totalProducts} productos y ${totalCombos} combos`;

const UPDATE_OPERATION_FAILURE = 'Algo salió mal 😭 No es posible actualizar completa o parcialmente la aplicación 😢';
const UPDATE_OPERATION_NOT_NECESSARY = 'Todos los productos y combos ya están actualizados en la app 😉';

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
        FUNCTION: 'productsUpdate',
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
          OPERATION_SUCCESS: '👍 Aplicación actualizada con éxito',
          OPERATION_FAILURE: UPDATE_OPERATION_FAILURE,
          OPERATION_NOT_NECESSARY: UPDATE_OPERATION_NOT_NECESSARY,
        },
      },
      ITEM_3: {
        LABEL: '📲 Horarios',
        FUNCTION: 'businessHours',
        PROMPT: {
          INFO: 'Estas a punto de modificar la grilla de horarios de la app',
          CONFIRM: '¿Estás seguro?',
          OPERATION_SUCCESS: '👍 Horarios de la aplicación actualizados con éxito',
          OPERATION_FAILURE: UPDATE_OPERATION_FAILURE,
          OPERATION_NOT_NECESSARY: UPDATE_OPERATION_NOT_NECESSARY,
        },
      },
    },
  },
};

export const ERROR_MESSAGES = {
  GENERIC: `😕 La aplicación no se pudo actualizar totalmente porque ocurrió algún problema...`,
  CUOTA_EXCEEDED: `
  ERROR CATASTROFICO 😭
  Se ha excedido la cuota de la base de datos... La aplicación quedará desactualizada hasta el final del día... 🙇
  Intentar seguir con las actualizaciones mañana.
  `,
};
