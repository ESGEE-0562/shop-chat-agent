import assert from 'node:assert/strict';
import test from 'node:test';

import { selectAdminSession } from '../app/services/admin-session-selection.js';

const elteeOffline = {
  shop: 'lava-tribe.myshopify.com',
  accessToken: 'eltee-offline-token',
  isOnline: false
};

test('selects the exact requested shop when multiple shops are installed', () => {
  const otherShop = {
    shop: 'other-store.myshopify.com',
    accessToken: 'other-token',
    isOnline: false
  };

  assert.equal(
    selectAdminSession([otherShop, elteeOffline], 'lava-tribe.myshopify.com'),
    elteeOffline
  );
});

test('supports a custom storefront domain when exactly one shop is installed', () => {
  assert.equal(
    selectAdminSession([elteeOffline], 'elteesydney.com.au'),
    elteeOffline
  );
});

test('fails closed for a custom domain when multiple shops are installed', () => {
  const otherShop = {
    shop: 'other-store.myshopify.com',
    accessToken: 'other-token',
    isOnline: false
  };

  assert.equal(
    selectAdminSession([elteeOffline, otherShop], 'elteesydney.com.au'),
    null
  );
});

test('ignores sessions without usable credentials', () => {
  assert.equal(
    selectAdminSession([
      { shop: 'other-store.myshopify.com', accessToken: '', isOnline: false },
      elteeOffline
    ], 'elteesydney.com.au'),
    elteeOffline
  );
});
