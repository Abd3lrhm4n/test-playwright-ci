// Product Data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 79.99,
        description: 'Premium noise-canceling headphones with 30-hour battery life',
        icon: '🎧'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        description: 'Fitness tracking, heart rate monitor, and notifications',
        icon: '⌚'
    },
    {
        id: 3,
        name: 'Laptop Stand',
        price: 49.99,
        description: 'Ergonomic aluminum stand for better posture',
        icon: '💻'
    },
    {
        id: 4,
        name: 'Wireless Mouse',
        price: 29.99,
        description: 'Ergonomic design with precision tracking',
        icon: '🖱️'
    },
    {
        id: 5,
        name: 'USB-C Hub',
        price: 39.99,
        description: '7-in-1 hub with HDMI, USB ports, and SD card reader',
        icon: '🔌'
    },
    {
        id: 6,
        name: 'Portable Charger',
        price: 34.99,
        description: '20,000mAh power bank with fast charging',
        icon: '🔋'
    },
    {
        id: 7,
        name: 'Webcam HD',
        price: 89.99,
        description: '1080p webcam with auto-focus and built-in microphone',
        icon: '📷'
    },
    {
        id: 8,
        name: 'Bluetooth Speaker',
        price: 59.99,
        description: 'Waterproof speaker with 12-hour playtime',
        icon: '🔊'
    },
    {
        id: 9,
        name: 'Mechanical Keyboard',
        price: 129.99,
        description: 'RGB backlit with cherry MX switches',
        icon: '⌨️'
    }
];

// Shopping Cart
let cart = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCartFromStorage();
    setupEventListeners();
});

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.icon}</div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            addToCart(productId);
        }
    });
    
    // Cart icon
    document.getElementById('cartIcon').addEventListener('click', openCart);
    
    // Close cart
    document.getElementById('closeCart').addEventListener('click', closeCart);
    
    // Close cart when clicking outside
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') {
            closeCart();
        }
    });
    
    // Clear cart
    document.getElementById('clearCart').addEventListener('click', clearCart);
    
    // Checkout
    document.getElementById('checkout').addEventListener('click', checkout);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }
    
    updateCart();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
    showToast('Item removed from cart');
}

// Update product quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCartToStorage();
    }
}

// Update cart display
function updateCart() {
    updateCartCount();
    updateCartItems();
    updateCartSummary();
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Update cart items in modal
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });
}

// Create cart item element
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-image">${item.icon}</div>
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-controls">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
    `;
    
    return div;
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Open cart modal
function openCart() {
    document.getElementById('cartModal').classList.add('active');
    updateCart();
}

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showToast('Cart is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        saveCartToStorage();
        showToast('Cart cleared');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.1;
    const finalTotal = total + tax;
    
    alert(`Thank you for your purchase!\n\nOrder Summary:\nSubtotal: $${total.toFixed(2)}\nTax: $${tax.toFixed(2)}\nTotal: $${finalTotal.toFixed(2)}\n\nYour order has been placed successfully!`);
    
    cart = [];
    updateCart();
    saveCartToStorage();
    closeCart();
    showToast('Order placed successfully!');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
