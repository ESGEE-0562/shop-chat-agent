import test from "node:test";
import assert from "node:assert/strict";
import { normaliseOrderLookupInput } from "../app/services/order-lookup-validation.js";

test("requires both customer identifiers before an order lookup", () => {
  assert.throws(
    () => normaliseOrderLookupInput({ shopDomain: "https://elteesydney.com.au", orderNumber: "1234" }),
    /both email address and order number/,
  );
  assert.throws(
    () => normaliseOrderLookupInput({ shopDomain: "https://elteesydney.com.au", email: "customer@example.com" }),
    /both email address and order number/,
  );
});

test("normalises valid order lookup values", () => {
  assert.deepEqual(normaliseOrderLookupInput({
    shopDomain: " https://elteesydney.com.au ",
    email: " Customer@Example.COM ",
    orderNumber: " #1234 ",
  }), {
    shopDomain: "https://elteesydney.com.au",
    email: "customer@example.com",
    orderNumber: "#1234",
  });
});

test("requires the Shopify storefront origin", () => {
  assert.throws(
    () => normaliseOrderLookupInput({ email: "customer@example.com", orderNumber: "1234" }),
    /Shopify storefront origin/,
  );
});

test("rejects Shopify search operators in the order number", () => {
  const base = {
    shopDomain: "https://elteesydney.com.au",
    email: "customer@example.com",
  };

  for (const orderNumber of [
    "1234 email:target@example.com",
    "*",
    "1234 OR name:*",
    "1234\"",
  ]) {
    assert.throws(
      () => normaliseOrderLookupInput({ ...base, orderNumber }),
      /unsupported characters/,
    );
  }
});

test("allows ordinary Shopify order prefixes and suffixes", () => {
  assert.equal(normaliseOrderLookupInput({
    shopDomain: "https://elteesydney.com.au",
    email: "customer@example.com",
    orderNumber: "#ELTEE-1234_AU.1",
  }).orderNumber, "#ELTEE-1234_AU.1");
});
