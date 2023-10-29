import { getColumnHeader } from './getColumnHeader';

export function notUpdateScriptMessage(editedRow, editedColumn, value) {
  const editedHeader = getColumnHeader(editedColumn);
  return `No actualizar stock -->
   fila editada: ${editedRow}
   columna: "${editedHeader}"
   contenido editado: "${value}"`;
}
