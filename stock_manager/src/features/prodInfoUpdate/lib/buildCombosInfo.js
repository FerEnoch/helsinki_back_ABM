import { SPREADSHEET } from '../../../entities/sheetData/config/spreadsheet';

export function buildCombosInfo(combos) {
  const { COMBOS } = SPREADSHEET;
  return new Map(
    Object.entries({
      category: COMBOS,
      combos: combos.map((combo, index) => {
        return {
          id: `*00${index}`,
          category: 'combos',
          type: 'combo',
          ...combo,
        };
      }),
    })
  );
}
