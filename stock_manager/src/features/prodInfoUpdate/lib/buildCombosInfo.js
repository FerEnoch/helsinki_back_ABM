import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

export function buildCombosInfo(combos) {
  const { COMBOS } = SPREADSHEET;
  return new Map([
    [
      COMBOS,
      combos.map((combo) => {
        return {
          isCombo: true,
          ...combo,
        };
      }),
    ],
  ]);
}
