import { canonicalEncode, MerkleTree, stableStringify, verifyProof } from './merkle-primitives';

const TREE_TAG = 'ledger_test_v1';

describe('Merkle primitives', () => {
  it('stableStringify orders object keys deterministically', () => {
    const first = stableStringify({ b: 1, a: 2, nested: { z: 9, y: 8 } });
    const second = stableStringify({ nested: { y: 8, z: 9 }, a: 2, b: 1 });

    expect(first).toEqual(second);
  });

  it('canonicalEncode produces consistent bytes for equivalent objects', () => {
    const encoded = canonicalEncode({ ref: 'alpha', sequence: [3, 2, 1] });
    const encodedAgain = canonicalEncode({ sequence: [3, 2, 1], ref: 'alpha' });

    expect(Array.from(encoded)).toEqual(Array.from(encodedAgain));
  });

  it('produces consistent roots and verifiable proofs', async () => {
    const leaves = [
      { id: 1, payload: 'oak' },
      { id: 2, payload: 'pine' },
      { id: 3, payload: 'yew' },
    ];

    const tree = await MerkleTree.fromValues(leaves, TREE_TAG);
    const secondTree = await MerkleTree.fromValues(leaves, TREE_TAG);

    expect(tree.getRoot()).toEqual(secondTree.getRoot());

    const proof = tree.getProof(1);
    const isValid = await verifyProof(proof, TREE_TAG);

    expect(isValid).toBeTrue();
  });
});
