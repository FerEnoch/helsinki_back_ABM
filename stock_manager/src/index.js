import { getOAuthToken } from './features/selectImage/config/getOAuthToken';
import { getDeveloperKey } from './features/selectImage/config/getDeveloperKey';
import { onEdit } from './features/selectImage';
import { onOpen } from './entities/sheetData/onOpen';
import { selectPicture } from './features/selectImage/model/selectPicture';
import { shouldAddImage } from './features/selectImage/lib/shouldAddImage';
import { showSelectionWindow } from './features/selectImage/ui/showSelectionWindow';
import { infoUpdate } from './features/infoUpdate';
import { productsUpdate } from './features/prodInfoUpdate';
import { businessHours } from './features/businessHoursUpdate';

const currentMode = process.env.STAGING ? 'prod-testing' : process.env.NODE_ENV;
console.log( /* eslint-disable-line */
  `Currently on ${currentMode}-mode` 
)

global.onOpen = onOpen;
global.onEdit = onEdit;
global.getOAuthToken = getOAuthToken;
global.getDeveloperKey = getDeveloperKey;
global.showSelectionWindow = showSelectionWindow;
global.selectPicture = selectPicture;
global.shouldAddImage = shouldAddImage;
global.infoUpdate = infoUpdate;
global.productsUpdate = productsUpdate;
global.businessHours = businessHours;
