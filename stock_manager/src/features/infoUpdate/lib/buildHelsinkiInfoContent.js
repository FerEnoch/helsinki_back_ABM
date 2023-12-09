import { COLUMN_HEADERS, INITIAL_URL_FRAGMENTS } from '../../../entities/sheetData/config/spreadsheet';
import { validateKey } from '../../databaseUpdate/lib/validateKey';

/**
 * Info array always would be length === 1, but account array can be more
 * @param {[]} info
 * @param {[]} account
 * @returns {object[]}
 */
export function buildHelsinkiInfoContent(info, account, faq) {
  const { MAIN_SHEET_INFO, MAIN_SHEET_ACCOUNT } = COLUMN_HEADERS;
  const infoToFirestore = [];

  info.forEach((row, index, infoArray) => {
    if (index === 0) {
      const infoObject = {};
      row.forEach((value, valueIndex) => {
        const validatedKey = validateKey(value, MAIN_SHEET_INFO);
        const dataField = String(infoArray[index + 1][valueIndex]);
        infoObject[validatedKey] = dataField;
      });
      infoToFirestore.push(infoObject);
    }
  });

  faq.forEach((row, index, faqArray) => {
    if (index === 0) {
      const faqObject = {};
      row.forEach((question, questionIndex) => {
        const answer = faqArray[index + 1][questionIndex];
        faqObject[question] = answer;
      });
      infoToFirestore.push(faqObject);
    }
  });

  account.forEach((row, index, accountArray) => {
    const paymentsMethods = accountArray.length - 1;
    if (index === 0) {
      for (let i = paymentsMethods; i > 0; i -= 1) {
        const method = {};
        row.forEach((value, valueIndex) => {
          const validatedKey = validateKey(value, MAIN_SHEET_ACCOUNT);
          const dataField = String(accountArray[index + i][valueIndex]);

          method[validatedKey] = dataField;

          INITIAL_URL_FRAGMENTS.forEach((fragment) => {
            if (dataField.includes(fragment)) {
              method.imageID = dataField.slice(fragment.length);
            }
          });
        });
        infoToFirestore.push(method);
      }
    }
  });

  return infoToFirestore;
}
