import { expect, test } from "vite-plus/test";
import { nui, noop, inBrowser, resourceName } from "../src/index";
import { createRoot } from "solid-js";

test("nui.send", () => {
  const result = createRoot(() => nui.send({ action: "test" }));

  expect(result).toHaveProperty("trigger");
  expect(result).toHaveProperty("data");
});

test("nui.receive", () => {
  const result = createRoot(() => nui.receive({ action: "test", callback: noop }));

  expect(result).toBeUndefined();
});

test("inBrowser", () => {
  expect(inBrowser()).toBeTypeOf("boolean");
});

test("noop", () => {
  expect(noop()).toBeUndefined();
});

test("resourceName", () => {
  expect(resourceName()).toBeTypeOf("string");
});
