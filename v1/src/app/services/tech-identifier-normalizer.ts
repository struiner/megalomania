export type EnumNormalizationMap = Record<string, string>;

export interface NormalizedEnumValue {
  canonical?: string;
  normalized: string;
  isKnown: boolean;
}

export const normalizeIdentifier = (value: string): string => value
  .trim()
  .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
  .replace(/[^a-zA-Z0-9]+/g, '_')
  .replace(/_{2,}/g, '_')
  .replace(/^_+|_+$/g, '')
  .toLowerCase();

export const buildEnumNormalizationMap = (enumObject: Record<string, string>): EnumNormalizationMap => {
  const map: EnumNormalizationMap = {};
  Object.values(enumObject).forEach((value) => {
    const normalized = normalizeIdentifier(String(value));
    if (!map[normalized]) {
      map[normalized] = value;
    }
  });
  return map;
};

export const normalizeEnumValue = (
  rawValue: unknown,
  map: EnumNormalizationMap,
): NormalizedEnumValue => {
  const normalized = normalizeIdentifier(String(rawValue ?? ''));
  const canonical = map[normalized];
  return {
    normalized,
    canonical,
    isKnown: Boolean(canonical),
  };
};

export const mapValuesToCanonical = (values: unknown[], map: EnumNormalizationMap): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((value) => {
    const mapped = normalizeEnumValue(value, map);
    const candidate = mapped.canonical ?? mapped.normalized;
    if (!candidate || seen.has(candidate)) {
      return;
    }
    seen.add(candidate);
    result.push(candidate);
  });

  return result.sort((left, right) => left.localeCompare(right));
};
