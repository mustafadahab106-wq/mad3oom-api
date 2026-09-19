export type PackageId = 'featured_7d' | 'golden_30d';

export type Package = {
  id: PackageId;
  nameAr: string;
  nameEn: string;
  priceAED: number;
  days: number;
};

export const PACKAGES: Package[] = [
  { id: 'featured_7d', nameAr: 'مميز - 7 أيام', nameEn: 'Featured - 7 days', priceAED: 49, days: 7 },
  { id: 'golden_30d', nameAr: 'ذهبي - 30 يوم', nameEn: 'Golden - 30 days', priceAED: 149, days: 30 },
];

export function getPackage(id: string): Package {
  const pkg = PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown package: ${id}`);
  return pkg;
}
