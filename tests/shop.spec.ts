import { test, expect } from '@playwright/test';

test.describe('TechShop - Product Display and Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all 9 products on the page', async ({ page }) => {
    const productCards = page.locator('.product-card');
    await expect(productCards).toHaveCount(9);

    for (let i = 0; i < 9; i++) {
      const card = productCards.nth(i);
      await expect(card.locator('.product-name')).toBeVisible();
      await expect(card.locator('.product-description')).toBeVisible();
      await expect(card.locator('.product-price')).toBeVisible();
      await expect(card.locator('.add-to-cart-btn')).toBeVisible();
    }
  });

  test('should verify product names match expected data', async ({ page }) => {
    const expectedProducts = [
      'Wireless Headphones',
      'Smart Watch',
      'Laptop Stand',
      'Wireless Mouse',
      'USB-C Hub',
      'Portable Charger',
      'Webcam HD',
      'Bluetooth Speaker',
      'Mechanical Keyboard',
    ];

    const productNames = page.locator('.product-name');
    for (let i = 0; i < expectedProducts.length; i++) {
      const name = productNames.nth(i);
      await expect(name).toContainText(expectedProducts[i]);
    }
  });

  test('should verify product prices are displayed correctly', async ({
    page,
  }) => {
    const expectedPrices = [
      '$79.99',
      '$199.99',
      '$49.99',
      '$29.99',
      '$39.99',
      '$34.99',
      '$89.99',
      '$59.99',
      '$129.99',
    ];

    const productPrices = page.locator('.product-price');
    for (let i = 0; i < expectedPrices.length; i++) {
      const price = productPrices.nth(i);
      await expect(price).toContainText(expectedPrices[i]);
    }
  });

  test('should increase cart count when adding a single product to cart', async ({
    page,
  }) => {
    const cartCount = page.locator('#cartCount');
    await expect(cartCount).toContainText('0');

    const addToCartButton = page.locator('.add-to-cart-btn').first();
    await addToCartButton.click();

    await expect(cartCount).toContainText('1');
  });

  test('should increase cart count when adding multiple products', async ({
    page,
  }) => {
    const cartCount = page.locator('#cartCount');

    await page.locator('.add-to-cart-btn').nth(0).click();
    await expect(cartCount).toContainText('1');

    await page.locator('.add-to-cart-btn').nth(1).click();
    await expect(cartCount).toContainText('2');

    await page.locator('.add-to-cart-btn').nth(2).click();
    await expect(cartCount).toContainText('3');
  });

  test('should increase cart count when adding the same product multiple times', async ({
    page,
  }) => {
    const cartCount = page.locator('#cartCount');
    const addToCartButton = page.locator('.add-to-cart-btn').first();

    await addToCartButton.click();
    await expect(cartCount).toContainText('1');

    await addToCartButton.click();
    await expect(cartCount).toContainText('2');

    await addToCartButton.click();
    await expect(cartCount).toContainText('3');
  });

  test('should show toast notification when adding product to cart', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').first().click();

    const toast = page.locator('#toast');
    await expect(toast).toHaveClass(/show/);

    const toastMessage = page.locator('#toastMessage');
    await expect(toastMessage).toContainText(
      'Wireless Headphones added to cart!',
    );
  });
});

test.describe('TechShop - Shopping Cart Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open cart modal when clicking cart icon', async ({ page }) => {
    await page.locator('.add-to-cart-btn').first().click();
    await page.locator('#cartIcon').click();

    const modal = page.locator('#cartModal');
    await expect(modal).toHaveClass(/active/);
  });

  test('should display cart items in modal', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(3).click();

    await page.locator('#cartIcon').click();

    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(2);

    await expect(page.locator('.cart-item-name').first()).toContainText(
      'Wireless Headphones',
    );
    await expect(page.locator('.cart-item-name').nth(1)).toContainText(
      'Wireless Mouse',
    );
  });

  test('should show empty cart message when no items in cart', async ({
    page,
  }) => {
    await page.locator('#cartIcon').click();

    const emptyMessage = page.locator('.empty-cart');
    await expect(emptyMessage).toContainText('Your cart is empty');
  });

  test('should close cart modal when clicking close button', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').first().click();
    await page.locator('#cartIcon').click();

    let modal = page.locator('#cartModal');
    await expect(modal).toHaveClass(/active/);

    await page.locator('#closeCart').click();
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should close cart modal when clicking outside', async ({ page }) => {
    await page.locator('.add-to-cart-btn').first().click();
    await page.locator('#cartIcon').click();

    let modal = page.locator('#cartModal');
    await expect(modal).toHaveClass(/active/);

    await page.locator('#cartModal').click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should calculate subtotal correctly', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(3).click();

    await page.locator('#cartIcon').click();

    const subtotal = page.locator('#cartSubtotal');
    await expect(subtotal).toContainText('$109.98');
  });

  test('should calculate tax as 10% of subtotal', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('#cartIcon').click();

    const tax = page.locator('#cartTax');
    await expect(tax).toContainText('$8');
  });

  test('should calculate total with tax included', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('#cartIcon').click();

    const total = page.locator('#cartTotal');
    await expect(total).toContainText('$87.99');
  });

  test('should update quantity with +/- buttons', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('#cartIcon').click();

    let quantityDisplay = page.locator('.quantity-display').first();
    await expect(quantityDisplay).toContainText('1');

    await page.locator('.quantity-btn').first().click();
    await expect(quantityDisplay).toContainText('2');

    await page.locator('.quantity-btn').first().click();
    await expect(quantityDisplay).toContainText('3');

    const buttons = await page
      .locator('.cart-item-controls .quantity-btn')
      .all();
    await buttons[1].click();
    await expect(quantityDisplay).toContainText('2');
  });

  test('should remove item from cart when quantity reaches zero', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('#cartIcon').click();

    let cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(1);

    const buttons = await page
      .locator('.cart-item-controls .quantity-btn')
      .all();
    await buttons[1].click();

    await expect(page.locator('.empty-cart')).toContainText(
      'Your cart is empty',
    );
  });

  test('should remove item when clicking delete button', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(1).click();

    await page.locator('#cartIcon').click();

    let cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(2);

    await page.locator('.remove-btn').first().click();

    cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(1);

    await expect(page.locator('.cart-item-name')).toContainText('Smart Watch');
  });

  test('should clear entire cart with Clear Cart button', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(1).click();
    await page.locator('.add-to-cart-btn').nth(2).click();

    await page.locator('#cartIcon').click();

    let cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(3);

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#clearCart').click();

    await expect(page.locator('.empty-cart')).toContainText(
      'Your cart is empty',
    );
    await expect(page.locator('#cartCount')).toContainText('0');
  });

  test('should show confirmation dialog when clearing cart', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').first().click();
    await page.locator('#cartIcon').click();

    let dialogTriggered = false;
    page.once('dialog', (dialog) => {
      dialogTriggered = true;
      expect(dialog.message).toContain('Are you sure');
      dialog.dismiss();
    });

    await page.locator('#clearCart').click();

    expect(dialogTriggered).toBe(true);

    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(1);
  });
});

test.describe('TechShop - Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show thank you message on checkout with order summary', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('#cartIcon').click();

    let alertMessage = '';
    page.once('dialog', (dialog) => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.locator('#checkout').click();

    expect(alertMessage).toContain('Thank you for your purchase!');
    expect(alertMessage).toContain('Order Summary:');
    expect(alertMessage).toContain('Subtotal: $79.99');
    expect(alertMessage).toContain('Tax: $8');
    expect(alertMessage).toContain('Total: $87.99');
    expect(alertMessage).toContain('Your order has been placed successfully!');
  });

  test('should clear cart after successful checkout', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(1).click();

    await expect(page.locator('#cartCount')).toContainText('2');

    await page.locator('#cartIcon').click();

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#checkout').click();

    await expect(page.locator('#cartCount')).toContainText('0');

    await page.locator('#cartIcon').click();
    await expect(page.locator('.empty-cart')).toContainText(
      'Your cart is empty',
    );
  });

  test('should close cart modal after successful checkout', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').first().click();

    await page.locator('#cartIcon').click();
    let modal = page.locator('#cartModal');
    await expect(modal).toHaveClass(/active/);

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#checkout').click();

    await expect(modal).not.toHaveClass(/active/);
  });

  test('should show error when checking out with empty cart', async ({
    page,
  }) => {
    await page.locator('#cartIcon').click();
    await page.locator('#checkout').click();

    const toast = page.locator('#toast');
    await expect(toast).toHaveClass(/show/);
    await expect(page.locator('#toastMessage')).toContainText(
      'Your cart is empty',
    );
  });

  test('should calculate correct totals in checkout for multiple items with different quantities', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('#cartIcon').click();

    const buttons = await page.locator('.quantity-btn').all();
    await buttons[0].click();

    await page.locator('#closeCart').click();

    await page.locator('.add-to-cart-btn').nth(3).click();
    await page.locator('#cartIcon').click();

    let alertMessage = '';
    page.once('dialog', (dialog) => {
      alertMessage = dialog.message();
      dialog.accept();
    });

    await page.locator('#checkout').click();

    expect(alertMessage).toContain('Subtotal: $189.97');
  });

  test('should show success toast after checkout', async ({ page }) => {
    await page.locator('.add-to-cart-btn').first().click();
    await page.locator('#cartIcon').click();

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#checkout').click();

    const toast = page.locator('#toast');
    await expect(toast).toHaveClass(/show/);
    await expect(page.locator('#toastMessage')).toContainText(
      'Order placed successfully!',
    );
  });
});

test.describe('TechShop - Local Storage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should persist cart data to localStorage', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(1).click();

    const cartData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    });

    expect(cartData).toHaveLength(2);
    expect(cartData[0].name).toBe('Wireless Headphones');
    expect(cartData[1].name).toBe('Smart Watch');
  });

  test('should load cart from localStorage on page reload', async ({
    page,
  }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await page.locator('.add-to-cart-btn').nth(1).click();

    await page.reload();

    await expect(page.locator('#cartCount')).toContainText('2');

    await page.locator('#cartIcon').click();
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(2);
  });

  test('should maintain cart across page navigation', async ({ page }) => {
    await page.locator('.add-to-cart-btn').nth(0).click();
    await expect(page.locator('#cartCount')).toContainText('1');

    await page.getByRole('link', { name: 'Home' }).click();

    await expect(page.locator('#cartCount')).toContainText('1');
  });
});
