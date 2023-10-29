import { firebaseDatabaseCreateFiles } from '../../features/databaseUpdate/model/firebaseDatabaseCreateFiles';
import { firebaseDatabaseDeleteFiles } from '../../features/databaseUpdate/model/firebaseDatabaseDeleteFiles';
import { firebaseDatabaseUpdateFiles } from '../../features/databaseUpdate/model/firebaseDatabaseUpdateFiles';
import {
  addProductsToWebAppCache,
  deleteProductsInWebAppCache,
  updateProductsInWebAppCache,
} from '../../features/databaseUpdate/model/updateWebAppCache';
import { DATABASE_OPERATIONS } from './config/database-operations';
import { noChangeDataLogger } from './model/noChangeDataLogger';

export const DATABASE_API_ACTIONS = {
  [DATABASE_OPERATIONS.LEAVE]: noChangeDataLogger,
  [DATABASE_OPERATIONS.ADD]: firebaseDatabaseCreateFiles,
  [DATABASE_OPERATIONS.UPDATE]: firebaseDatabaseUpdateFiles,
  [DATABASE_OPERATIONS.DELETE]: firebaseDatabaseDeleteFiles,
};

export const WEB_APP_API_ACTIONS = {
  [DATABASE_OPERATIONS.ADD]: addProductsToWebAppCache,
  [DATABASE_OPERATIONS.UPDATE]: updateProductsInWebAppCache,
  [DATABASE_OPERATIONS.DELETE]: deleteProductsInWebAppCache,
};
