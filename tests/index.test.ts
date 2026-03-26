import { expect, test } from "vite-plus/test";
import { nui, noop, inBrowser, resourceName } from "../src/index";

test("nui.send", () => {
  expect(nui.send({ action: "test" })).toBeInstanceOf(Promise);
});

test("nui.receive", () => {
  expect(nui.receive({ action: "test", callback: noop })).toBeUndefined();
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
