import { HashHex } from './types';

export function stableStringify(value: unknown): string {
  return stringify(value);
}

function stringify(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'null';

  const type = typeof value;

  switch (type) {
    case 'number': {
      if (!Number.isFinite(value as number)) {
        throw new Error('Non-finite numbers are not allowed in canonical encoding');
      }
      return JSON.stringify(value);
    }
    case 'string':
    case 'boolean':
      return JSON.stringify(value);
    case 'bigint':
      return JSON.stringify((value as bigint).toString());
    case 'object': {
      if (Array.isArray(value)) {
        const items = (value as unknown[]).map((v) => stringify(v)).join(',');
        return `[${items}]`;
      }

      const entries = Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => {
          const v = (value as Record<string, unknown>)[key];
          return `${JSON.stringify(key)}:${stringify(v)}`;
        })
        .join(',');

      return `{${entries}}`;
    }
    default:
      throw new Error(`Unsupported type in canonical encoding: ${type}`);
  }
}

export interface Canonicalizer {
  encode(value: unknown): Uint8Array;
}

export class JsonCanonicalizer implements Canonicalizer {
  encode(value: unknown): Uint8Array {
    const s = stableStringify(value);
    return new TextEncoder().encode(s);
  }
}

export function prefixBytes(prefix: string, bytes: Uint8Array): Uint8Array {
  const p = new TextEncoder().encode(prefix);
  const out = new Uint8Array(p.length + bytes.length);
  out.set(p, 0);
  out.set(bytes, p.length);
  return out;
}

export const ZERO_HASH: HashHex = '0'.repeat(64);
