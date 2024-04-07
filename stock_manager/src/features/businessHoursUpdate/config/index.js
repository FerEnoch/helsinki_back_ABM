export const businessSheetMap = {
  deliveryCost: 'B2',
  openToOrders: 'B3',
  businessHours: {
    delivery: {
      normalStart: 'B16',
      normalClose: 'C16',
      extendedStart: 'B17',
      extendedClose: 'C17',
    },
    takeAway: {
      earlyAfternoonStart: 'B21',
      earlyAfternoonClose: 'C21',
      normalNightStart: 'B22',
      normalNightClose: 'C22',
      extendedNightStart: 'B23',
      extendedNightClose: 'C23',
    },
  },
  grid: [
    {
      day: 'A6', // lunes
      delivery: 'B6',
      takeAway: 'C6',
    },
    {
      day: 'A7', // martes
      delivery: 'B7',
      takeAway: 'C7',
    },
    {
      day: 'A8', // miércoles
      delivery: 'B8',
      takeAway: 'C8',
    },
    {
      day: 'A9', // jueves
      delivery: 'B9',
      takeAway: 'C9',
    },
    {
      day: 'A10', // viernes
      delivery: 'B10',
      takeAway: 'C10',
    },
    {
      day: 'A11', // sábado
      delivery: 'B11',
      takeAway: 'C11',
    },
    {
      day: 'A12', // domingo
      delivery: 'B12',
      takeAway: 'C12',
    },
  ],
};

export const englishDays = [
  {
    regex: /lunes/i,
    label: 'monday',
  },
  {
    regex: /martes/i,
    label: 'tuesday',
  },
  {
    regex: /mi[eé]rcoles/i,
    label: 'wednesday',
  },
  {
    regex: /jueves/i,
    label: 'thursday',
  },
  {
    regex: /viernes/i,
    label: 'friday',
  },
  {
    regex: /s[aá]bado/i,
    label: 'saturday',
  },
  {
    regex: /domingo/i,
    label: 'sunday',
  },
];
