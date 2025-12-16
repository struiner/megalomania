import { Canonicalizer, prefixBytes } from './stable-stringify';
import { Hasher } from './hash';
import { HashHex, LedgerEntry } from './types';

export class EntryFactory {
  constructor(private readonly canon: Canonicalizer, private readonly hasher: Hasher) {}

  create<TExt>(body: Omit<LedgerEntry<TExt>, 'id'>): LedgerEntry<TExt> {
    const bytes = this.canon.encode(body);
    const id = this.hasher.toHex(this.hasher.hash(prefixBytes('ENTRY|', bytes)));
    return { ...body, id };
  }
}

export function entryIdFromBody(canon: Canonicalizer, hasher: Hasher, body: Omit<LedgerEntry, 'id'>): HashHex {
  const bytes = canon.encode(body);
  return hasher.toHex(hasher.hash(prefixBytes('ENTRY|', bytes)));
}
