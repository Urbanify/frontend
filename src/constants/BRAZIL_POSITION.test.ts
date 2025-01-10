import { BRAZIL_POSITION } from './BRAZIL_POSITION';

describe('BRAZIL_POSITION', () => {
  it('should have correct latitude and longitude', () => {
    expect(BRAZIL_POSITION.lat).toEqual(-14.4095261);
    expect(BRAZIL_POSITION.lng).toEqual(-51.31668);
  });
});
