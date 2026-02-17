# TechShop - Express Shopping Website

A simple shopping website built with Node.js, Express, HTML, CSS, and JavaScript - perfect for testing with Playwright CI.

## Features

- 📦 Product catalog with 9 different items
- 🛒 Shopping cart functionality
- ➕ Add/remove items from cart
- 🔢 Adjust item quantities
- 💰 Price calculation with tax (10%)
- 💾 Cart persistence using localStorage
- 📱 Responsive design
- 🚀 Express server for easy deployment
- ✅ Perfect for Playwright E2E testing

## Project Structure

```
techshop/
├── server.js           # Express server
├── package.json        # Node dependencies
├── .gitignore         # Git ignore file
├── README.md          # This file
└── public/            # Static files
    ├── index.html     # Main HTML file
    ├── styles.css     # Styling
    └── script.js      # Shopping cart logic
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 3. Open in Browser

Visit: **http://localhost:3000**

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## API Endpoints

- `GET /` - Main shopping page
- `GET /health` - Health check endpoint (returns JSON status)

## Testing with Playwright

### Install Playwright

```bash
npm init playwright@latest
```

### Example Playwright Configuration

Create `playwright.config.js`:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example Test File

Create `tests/shopping.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('TechShop E2E Tests', () => {
  
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1.logo')).toHaveText('TechShop');
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/');
    
    // Add first product to cart
    await page.click('[data-product-id="1"]');
    
    // Check cart count increased
    await expect(page.locator('#cartCount')).toHaveText('1');
  });

  test('should open cart modal', async ({ page }) => {
    await page.goto('/');
    
    // Add product
    await page.click('[data-product-id="1"]');
    
    // Open cart
    await page.click('#cartIcon');
    
    // Verify modal is visible
    await expect(page.locator('#cartModal')).toBeVisible();
  });

  test('should update quantity', async ({ page }) => {
    await page.goto('/');
    
    // Add product and open cart
    await page.click('[data-product-id="1"]');
    await page.click('#cartIcon');
    
    // Increase quantity
    await page.click('.quantity-btn:has-text("+")');
    
    // Check quantity display
    await expect(page.locator('.quantity-display')).toHaveText('2');
    await expect(page.locator('#cartCount')).toHaveText('2');
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/');
    
    // Add product and open cart
    await page.click('[data-product-id="1"]');
    await page.click('#cartIcon');
    
    // Remove item
    await page.click('.remove-btn');
    
    // Verify empty cart message
    await expect(page.locator('.empty-cart')).toBeVisible();
  });

  test('should clear entire cart', async ({ page }) => {
    await page.goto('/');
    
    // Add multiple products
    await page.click('[data-product-id="1"]');
    await page.click('[data-product-id="2"]');
    
    // Open cart and clear
    await page.click('#cartIcon');
    await page.click('#clearCart');
    
    // Confirm dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Verify cart is empty
    await expect(page.locator('.empty-cart')).toBeVisible();
  });

  test('should calculate total correctly', async ({ page }) => {
    await page.goto('/');
    
    // Add product (price $79.99)
    await page.click('[data-product-id="1"]');
    await page.click('#cartIcon');
    
    // Check calculations
    await expect(page.locator('#cartSubtotal')).toHaveText('$79.99');
    await expect(page.locator('#cartTax')).toHaveText('$8.00');
    await expect(page.locator('#cartTotal')).toHaveText('$87.99');
  });

  test('should complete checkout', async ({ page }) => {
    await page.goto('/');
    
    // Add product
    await page.click('[data-product-id="1"]');
    await page.click('#cartIcon');
    
    // Listen for alert
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Thank you for your purchase');
      dialog.accept();
    });
    
    // Checkout
    await page.click('#checkout');
    
    // Verify cart is empty after checkout
    await expect(page.locator('#cartCount')).toHaveText('0');
  });

});
```

### Run Tests

```bash
npx playwright test
```

With UI:
```bash
npx playwright test --ui
```

## GitHub Actions CI/CD

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: 18
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run Playwright tests
      run: npx playwright test
    
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Deployment

### Heroku

```bash
heroku create your-app-name
git push heroku main
```

### Vercel

```bash
npm i -g vercel
vercel
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t techshop .
docker run -p 3000:3000 techshop
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Key Testable Elements

### Product Cards
- `.add-to-cart-btn` - Add to cart buttons (each has `data-product-id` attribute)
- `.product-name` - Product names
- `.product-price` - Product prices

### Cart
- `#cartIcon` - Cart icon (shows item count)
- `#cartCount` - Cart count badge
- `#cartModal` - Cart modal overlay
- `#cartItems` - Cart items container

### Actions
- `#clearCart` - Clear all items
- `#checkout` - Checkout button
- `#closeCart` - Close modal

## License

MIT
