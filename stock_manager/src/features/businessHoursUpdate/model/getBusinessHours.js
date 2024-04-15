import { businessSheetMap, englishDays } from '../config';
import { getCellValues } from '../lib/getCellValues';

/**
 * TO DO
 * agregar a la api --> info: "Urquiza y Cándido Pujato"
 *                      takeAwayCost: 0
 * 
 *   {
      label: 'Delivery',
      info: '',
      price: numbers.deliveryCostNumber,
    },
 */
export function getBusinessHours({ sheet }) {
  const businessMap = {};

  Object.entries(businessSheetMap).forEach(([key, value]) => {
    if (typeof value === 'string') {
      businessMap[key] = getCellValues({
        range: value,
        sheet,
      });
    }
    if (key === 'businessHours') {
      const { delivery, takeAway } = value;
      [
        delivery.normalStart,
        delivery.normalClose,
        delivery.extendedStart,
        delivery.extendedClose,
        takeAway.earlyAfternoonStart,
        takeAway.earlyAfternoonClose,
        takeAway.normalNightStart,
        takeAway.normalNightClose,
        takeAway.extendedNightStart,
        takeAway.extendedNightClose,
      ].forEach((hourRange) => {
        const hour = getCellValues({
          range: hourRange,
          sheet,
        });
        if (typeof hour !== 'number') {
          throw new Error('Los horarios deben ponerse en números, no en letras');
        }
      });

      businessMap[key] = {
        delivery: {
          normalNight: {
            from: getCellValues({
              range: delivery.normalStart,
              sheet,
            }),
            to: getCellValues({
              range: delivery.normalClose,
              sheet,
            }),
          },
          extendedNight: {
            from: getCellValues({
              range: delivery.extendedStart,
              sheet,
            }),
            to: getCellValues({
              range: delivery.extendedClose,
              sheet,
            }),
          },
        },
        takeAway: {
          earlyAfternoon: {
            from: getCellValues({
              range: takeAway.earlyAfternoonStart,
              sheet,
            }),
            to: getCellValues({
              range: takeAway.earlyAfternoonClose,
              sheet,
            }),
          },
          normalNight: {
            from: getCellValues({
              range: takeAway.normalNightStart,
              sheet,
            }),
            to: getCellValues({
              range: takeAway.normalNightClose,
              sheet,
            }),
          },
          extendedNight: {
            from: getCellValues({
              range: takeAway.extendedNightStart,
              sheet,
            }),
            to: getCellValues({
              range: takeAway.extendedNightClose,
              sheet,
            }),
          },
        },
      };
    }

    if (key === 'grid') {
      businessMap.grid = value.map(({ day, delivery, takeAway }) => {
        const { label: dayLabel } = englishDays.filter(({ regex }) =>
          regex.test(getCellValues({ range: day, sheet }))
        )[0];
        return {
          day: dayLabel,
          delivery: getCellValues({ range: delivery, sheet }),
          takeAway: getCellValues({ range: takeAway, sheet }),
        };
      });
    }
  });

  return businessMap;
}
