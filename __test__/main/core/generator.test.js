import { expect, test } from "vitest";
import Generator from "../../../src/main/core/generator";
import defaultSettings from "../../../src/main/settings";

test("Generator should return empty HTML when no words are provided", () => {
  const generator = new Generator(defaultSettings);

  expect(generator.generate([], {}, false)).toEqual({
    hitCount: 0,
    html: `<div style="cursor:inherit;font-family:'hiragino kaku gothic pro', meiryo, sans-serif; padding:10px;">
</div>`,
  });

  expect(generator.generate(["hasOwnProperty"], {}, false)).toEqual({
    hitCount: 0,
    html: `<div style="cursor:inherit;font-family:'hiragino kaku gothic pro', meiryo, sans-serif; padding:10px;">
</div>`,
  });

  expect(generator.generate(["test"], { test: "テスト" }, false)).toEqual({
    hitCount: 1,
    html: `<div style="cursor:inherit;font-family:'hiragino kaku gothic pro', meiryo, sans-serif; padding:10px;">
      <span style="font-size:x-large;color:#000088;font-weight:bold;font-family:Georgia;">
        test
      </span>
      <span style="cursor:pointer;visibility:hidden;" data-md-pronunciation="test" data-md-hovervisible="true">🔊</span>
      <br/>
      <span style="font-size:small;color:#101010;">
        テスト
      </span>
</div>`,
  });

  expect(generator.generate(["test"], { test: "テスト ■TEST" }, false)).toEqual({
    hitCount: 1,
    html: `<div style="cursor:inherit;font-family:'hiragino kaku gothic pro', meiryo, sans-serif; padding:10px;">
      <span style="font-size:x-large;color:#000088;font-weight:bold;font-family:Georgia;">
        test
      </span>
      <span style="cursor:pointer;visibility:hidden;" data-md-pronunciation="test" data-md-hovervisible="true">🔊</span>
      <br/>
      <span style="font-size:small;color:#101010;">
        テスト <span style="color:#003366;margin-left:1em;font-size:0.9em;">■TEST</span>
      </span>
</div>`,
  });
});

test("Generator should handle null search in replaceRules without error", () => {
  const settings = {
    ...defaultSettings,
    replaceRules: [{ search: null, replace: "xxx" }],
  };
  new Generator(settings); // No error
});

test("Generator should fail to compile regexp with invalid search pattern", () => {
  const settings = {
    ...defaultSettings,
    replaceRules: [{ search: "\\", replace: "xxx" }],
  };

  // Fail to compile regexp
  new Generator(settings);
});

test("Generator should escape headwords exactly once", () => {
  const generator = new Generator(defaultSettings);
  const { html } = generator.generate(["AT&T", "<b>"], { "AT&T": "test1", "<b>": "test2" }, false);

  const container = document.createElement("div");
  container.innerHTML = html;
  expect(container.querySelector("b")).toBeNull();
  expect(container.textContent).toContain("AT&T");
  expect(container.textContent).toContain("<b>");
  const pronunciations = [...container.querySelectorAll("[data-md-pronunciation]")];
  expect(pronunciations.map((e) => e.getAttribute("data-md-pronunciation"))).toEqual(["AT&T", "<b>"]);
});

test("Phrase priority preserves group order, filters misses, and leaves inputs unchanged", () => {
  const words = ["in", "missing phrase", "in practice", "inside", "in fact", "invalid phrase", "well-known"];
  const originalWords = [...words];
  const descriptions = {
    in: "単語",
    "in practice": "実際には",
    inside: "内部",
    "in fact": "実際のところ",
    "invalid phrase": null,
    "well-known": "有名な",
  };
  const settings = {
    ...defaultSettings,
    contentTemplate: "{{#words}}[{{head}}:{{isFirst}}:{{isLast}}:{{isShort}}]{{/words}}",
  };
  const original = new Generator(settings).generate(words, descriptions);
  expect(original.html).toBe(
    "[in:true:false:false][in practice:false:false:false][inside:false:false:false][in fact:false:false:false][well-known:false:true:false]",
  );
  const prioritized = new Generator({ ...settings, prioritizePhrases: true }).generate(words, descriptions);
  expect(prioritized.html).toBe(
    "[in practice:true:false:false][in fact:false:false:false][in:false:false:true][inside:false:false:false][well-known:false:true:false]",
  );
  expect(prioritized.hitCount).toBe(original.hitCount);
  expect(words).toEqual(originalWords);
  expect(descriptions.in).toBe("単語");
});

test("Phrase priority handles whitespace, empty results, and a single short word", () => {
  const generator = new Generator({
    ...defaultSettings,
    prioritizePhrases: true,
    contentTemplate: "{{#words}}[{{head}}:{{isFirst}}:{{isLast}}:{{isShort}}]{{/words}}",
  });
  expect(generator.generate([], {}).html).toBe("");
  expect(generator.generate(["missing phrase"], {}).html).toBe("");
  expect(generator.generate(["in"], { in: "単語" }).html).toBe("[in:true:true:false]");
  expect(generator.generate([" in ", "in\tpractice"], { " in ": "単語", "in\tpractice": "句" }).html).toBe(
    "[in\tpractice:true:false:false][ in :false:true:false]",
  );
  expect(generator.generate(["in", "in practice"], { in: "単語", "in practice": "句" }, false).html).toBe(
    "[in practice:true:false:false][in:false:true:false]",
  );
});
