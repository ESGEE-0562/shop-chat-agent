export function normaliseOrderLookupInput(input = {}) {
  const shopDomain = typeof input.shopDomain === "string" ? input.shopDomain.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const orderNumber = typeof input.orderNumber === "string" ? input.orderNumber.trim() : "";

  if (!shopDomain) throw new Error("Order lookup requires a Shopify storefront origin");
  if (!email || !orderNumber) throw new Error("Order lookup requires both email address and order number");

  return { shopDomain, email, orderNumber };
}
