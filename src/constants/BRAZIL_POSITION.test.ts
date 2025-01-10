import { BRAZIL_POSITION } from './BRAZIL_POSITION';

describe('BRAZIL_POSITION', () => {
  it('should have correct latitude and longitude', () => {
    expect(BRAZIL_POSITION[0]).toEqual(-14.4095261);
    expect(BRAZIL_POSITION[1]).toEqual(-51.31668);
  });
});
