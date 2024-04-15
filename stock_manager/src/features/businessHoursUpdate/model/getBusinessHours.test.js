import { finalBusinessGrid } from '../test/finalBusinessGrid';
import { getBusinessHours } from './getBusinessHours';

jest.mock('../lib/getCellValues', () => ({
  getCellValues: jest.fn(({ range }) => {
    if (range === 'B2') return 750;
    if (range === 'B3') return 10;
    if (range === 'B16') return 20;
    if (range === 'C16') return 0.15;
    if (range === 'B17') return 20;
    if (range === 'C17') return 1.45;
    if (range === 'B21') return 15;
    if (range === 'C21') return 17;
    if (range === 'B22') return 20;
    if (range === 'C22') return 0.15;
    if (range === 'B23') return 20;
    if (range === 'C23') return 1.45;
    if (range === 'A6') return 'Lunes';
    if (range === 'B6') return 'Cerrado';
    if (range === 'C6') return 'Cerrado';
    if (range === 'A7') return 'Martes';
    if (range === 'B7') return 'Cerrado';
    if (range === 'C7') return 'Cerrado';
    if (range === 'A8') return 'Miercoles';
    if (range === 'B8') return 'Horario normal';
    if (range === 'C8') return 'Noche normal';
    if (range === 'A9') return 'Jueves';
    if (range === 'B9') return 'Horario normal';
    if (range === 'C9') return 'Noche normal';
    if (range === 'A10') return 'Viernes';
    if (range === 'B10') return 'Horario extendido';
    if (range === 'C10') return 'Noche extendido';
    if (range === 'A11') return 'Sábado';
    if (range === 'B11') return 'Horario extendido';
    if (range === 'C11') return 'Siesta y noche extendido';
    if (range === 'A12') return 'Domingo';
    if (range === 'B12') return 'Cerrado';
    if (range === 'C12') return 'Cerrado';

    return null;
  }),
}));

describe('Build business hours from sheet', () => {
  it('Should get values correctly', () => {
    expect(getBusinessHours({ sheet: 'test' })).toMatchObject(finalBusinessGrid);
  });
});
