import { DATABASE_OPERATIONS } from '../../../shared/api/config/database-operations';
import { handleCreateAction } from '../lib/handleCreateAction';
import { handleDeleteAction } from '../lib/handleDeleteAction';
import { handleUpdateAction } from '../lib/handleUpdateAction';

const { /* LEAVE, */ CREATE, UPDATE, DELETE } = DATABASE_OPERATIONS;

export const PROD_CATEGORY_CRUD_CONTROLLER = {
  // [LEAVE]: noChangeDataLogger,
  [CREATE]: handleCreateAction,
  [UPDATE]: handleUpdateAction,
  [DELETE]: handleDeleteAction,
};
