import { getPackage, PACKAGES } from './packages';

describe('packages', () => {
  it('has exactly the two published plans with sane prices and durations', () => {
    expect(PACKAGES).toHaveLength(2);

    const featured = PACKAGES.find((p) => p.id === 'featured_7d');
    expect(featured).toBeDefined();
    expect(featured!.priceAED).toBe(49);
    expect(featured!.days).toBe(7);

    const golden = PACKAGES.find((p) => p.id === 'golden_30d');
    expect(golden).toBeDefined();
    expect(golden!.priceAED).toBe(149);
    expect(golden!.days).toBe(30);
  });

  it('getPackage returns the matching plan by id', () => {
    expect(getPackage('featured_7d').days).toBe(7);
    expect(getPackage('golden_30d').priceAED).toBe(149);
  });

  it('getPackage throws for an unknown plan id (prevents a client from inventing a cheaper plan)', () => {
    expect(() => getPackage('free_forever')).toThrow();
  });
});
