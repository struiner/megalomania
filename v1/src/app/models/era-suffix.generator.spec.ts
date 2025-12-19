import { Era } from "./goods.model";
import { EraSuffixGenerator } from "./era-suffix.generator";
import { getEraSuffixForCulture } from "./goods.model";

describe("EraSuffixGenerator", () => {
  it("uses the culture initial for alliteration when provided", () => {
    const suffix = EraSuffixGenerator.generateSuffix({
      era: Era.Marble,
      seed: "culture-alliteration",
      culture: "Verdant Vale",
    });

    expect(suffix.toLowerCase().startsWith("v")).toBeTrue();
  });

  it("falls back to the era initial when no culture is provided", () => {
    const suffix = EraSuffixGenerator.generateSuffix({
      era: Era.Golden,
      seed: "era-fallback",
    });

    expect(suffix.toLowerCase().startsWith("g")).toBeTrue();
  });

  it("produces deterministic results for the same seed and culture", () => {
    const first = EraSuffixGenerator.generateSuffix({
      era: Era.Arcane,
      seed: "repeatable-seed",
      culture: "Arcanum",
    });
    const second = EraSuffixGenerator.generateSuffix({
      era: Era.Arcane,
      seed: "repeatable-seed",
      culture: "Arcanum",
    });

    expect(first).toBe(second);
  });

  it("varies output when the seed changes", () => {
    const one = EraSuffixGenerator.generateSuffix({
      era: Era.Astral,
      seed: "alpha-seed",
      culture: "Aster",
    });
    const two = EraSuffixGenerator.generateSuffix({
      era: Era.Astral,
      seed: "beta-seed",
      culture: "Aster",
    });

    expect(one).not.toBe(two);
  });

  it("integrates through the goods helper to maintain determinism", () => {
    const helperResult = getEraSuffixForCulture(Era.Reclaimed, "helper-seed", "Riverfolk");
    const generatorResult = EraSuffixGenerator.generateSuffix({
      era: Era.Reclaimed,
      seed: "helper-seed",
      culture: "Riverfolk",
    });

    expect(helperResult).toBe(generatorResult);
    expect(helperResult.toLowerCase().startsWith("r")).toBeTrue();
  });
});
