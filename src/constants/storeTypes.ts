export const SUPPORTED_STORE_TYPES = [
  '3d',
  '3d_pay',
  '3d_half',
  '3d_full',
  '3d_hosting',
  '3d_pay_hosting',
  'pay_hosting',
  'pay',
  'opt_pay_hosting'
] as const;

export type StoreType = typeof SUPPORTED_STORE_TYPES[number];

export function isSupportedStoreType(type: string): type is StoreType {
  return SUPPORTED_STORE_TYPES.includes(type.toLowerCase() as StoreType);
}

/**
 * Normalize store type to the canonical format (lowercase)
 */
export function normalizeStoreType(type: string): StoreType {
  const normalized = type.toLowerCase() as StoreType;
  if (!SUPPORTED_STORE_TYPES.includes(normalized)) {
    throw new Error(`Unsupported store type: ${type}. Supported types: ${SUPPORTED_STORE_TYPES.join(', ')}`);
  }
  return normalized;
}
