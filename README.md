# Wishlist CDN

A comprehensive wishlist management package for e-commerce applications with local storage persistence and backend synchronization support.

## Features

- 🔄 Automatic synchronization with backend
- 💾 Local storage persistence
- 🔑 Support for both guest users and logged-in customers
- 🎯 Easy integration with existing e-commerce platforms
- 🛍️ Built-in Shopify compatibility

## Installation

```bash
npm install wishlist-cdn
```

## Usage

### Basic Setup

```javascript
const Wishlist = require('wishlist-cdn');

// Initialize with configuration
const wishlist = new Wishlist({
  backendUrl: 'https://your-api.com', // Optional: defaults to provided backend
  customerId: 'customer_123' // Optional: for logged-in users
});

// Initialize wishlist buttons (automatically sets up click handlers)
wishlist.initializeButtons();
```

### HTML Setup

Add wishlist buttons to your products:

```html
<button 
  class="wishlist-btn"
  data-product-id="123"
  data-product-name="Awesome Product"
  data-product-image="/path/to/image.jpg"
  data-product-price="99.99"
>
  Add to Wishlist
</button>
```

### Manual Product Management

```javascript
// Add a product
const product = {
  id: '123',
  name: 'Awesome Product',
  image: '/path/to/image.jpg',
  price: '99.99'
};

const result = await wishlist.addItem(product);
console.log(result.message); // 'Product added to wishlist'

// Remove a product
const removeResult = await wishlist.removeItem('123');
console.log(removeResult.message); // 'Product removed from wishlist'

// Get all items
const items = wishlist.getItems();
```

## API Reference

### Constructor

```javascript
new Wishlist(config)
```

- `config.backendUrl` (optional): Custom backend URL
- `config.customerId` (optional): Customer ID for logged-in users

### Methods

- `initializeButtons()`: Set up click handlers for wishlist buttons
- `async addItem(product)`: Add a product to wishlist
- `async removeItem(productId)`: Remove a product from wishlist
- `getItems()`: Get all wishlist items

## License

MIT
