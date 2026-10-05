import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { cborDecode } from "./cbor.js";

// Run potentially non-terminating inputs outside the test process. A missing
// bounds check must fail this regression instead of hanging the entire suite.
function decodeInProcess(bytes: number[]) {
  return spawnSync(
    process.execPath,
    [
      "--eval",
      `import { cborDecode } from ${JSON.stringify(new URL("./cbor.ts", import.meta.url).href)};
      try {
        const value = cborDecode(Uint8Array.from(${JSON.stringify(bytes)}).buffer);
        console.log(JSON.stringify({ value }));
      } catch (error) {
        console.log(JSON.stringify({ error: error.message }));
      }`,
    ],
    { encoding: "utf8", timeout: 1000 }
  );
}

describe("cborDecode()", () => {
  test.each(
    [
      [],
      [0xbf],
      [0x9f],
      [0x5f],
      [0x7f],
      [0xbf, 0x01],
      [0xa1, 0x01],
      [0x81],
      [0x18],
      [0x19, 0x00],
      [0x1a, 0x00],
      [0x1b, 0x00],
      [0xfa, 0x00],
      [0xfb, 0x00],
      [0x41],
      [0x61],
      [0x61, 0xc2, 0xa2],
      [0x7f, 0x61, 0xc2, 0xa2, 0xff],
      [0x9b, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    ].map((bytes) => ({ bytes }))
  )("rejects truncated input %j without hanging", ({ bytes }) => {
    const result = decodeInProcess(bytes);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).error).toBeString();
  });

  test.each([
    [[0x5f, 0x40, 0x42, 0x01, 0x02, 0xff], { "0": 1, "1": 2 }],
    [[0x7f, 0x60, 0x61, 0x61, 0x62, 0xc2, 0xa2, 0xff], "a¢"],
    [[0x9f, 0x01, 0x02, 0xff], [1, 2]],
    [[0xbf, 0x61, 0x61, 0x01, 0xff], { a: 1 }],
  ])("decodes valid indefinite input %j", (bytes, value) => {
    const result = decodeInProcess(bytes as number[]);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ value });
  });

  test("preserves definite ABI arrays", () => {
    expect(cborDecode(Uint8Array.from([0x81, 0xa0]).buffer)).toEqual([{}]);
  });
});
