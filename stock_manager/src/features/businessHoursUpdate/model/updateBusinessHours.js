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
export function updateBusinessHours() {
  const businessMap = {};

  Object.entries(businessSheetMap).forEach(([key, value]) => {
    if (typeof value === 'string') {
      businessMap[key] = getCellValues(value);
    }
    if (key === 'businessHours') {
      businessMap[key] = {
        delivery: {
          normalNight: {
            from: getCellValues(value.delivery.normalStart),
            to: getCellValues(value.delivery.normalClose),
          },
          extendedNight: {
            from: getCellValues(value.delivery.extendedStart),
            to: getCellValues(value.delivery.extendedClose),
          },
        },
        takeAway: {
          earlyAfternoon: {
            from: getCellValues(value.takeAway.earlyAfternoonStart),
            to: getCellValues(value.takeAway.earlyAfternoonClose),
          },
          normalNight: {
            from: getCellValues(value.takeAway.normalNightStart),
            to: getCellValues(value.takeAway.normalNightClose),
          },
          extendedNight: {
            from: getCellValues(value.takeAway.extendedNightStart),
            to: getCellValues(value.takeAway.extendedNightClose),
          },
        },
      };
    }

    if (key === 'grid') {
      businessMap.grid = value.map(({ day, delivery, takeAway }) => {
        const { label: dayLabel } = englishDays.filter(({ regex }) => regex.test(getCellValues(day)))[0];
        return {
          day: dayLabel,
          delivery: getCellValues(delivery),
          takeAway: getCellValues(takeAway),
        };
      });
    }
  });

  return businessMap;
}
