class Wishlist {
  constructor(config = {}) {
    this.items = [];
    this.backendUrl = config.backendUrl || 'https://zewana-wishlist.onrender.com';
    this.customerId = config.customerId || null;
    this.sessionId = this.getOrCreateSessionId();
    this.loadFromLocalStorage();
  }

  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('wishlist_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('wishlist_session_id', sessionId);
    }
    return sessionId;
  }

  loadFromLocalStorage() {
    try {
      this.items = JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
      this.items = [];
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(this.items));
  }

  async addItem(product) {
    if (!product.id) {
      throw new Error('Product ID is required');
    }

    const exists = this.items.find(item => item.id === product.id);
    if (!exists) {
      this.items.push(product);
      this.saveToLocalStorage();

      try {
        await this.syncWithBackend('add', product);
        return { success: true, message: 'Product added to wishlist' };
      } catch (error) {
        console.error('Backend sync failed:', error);
        return { success: true, message: 'Product added locally, but sync failed' };
      }
    }
    return { success: false, message: 'Product already in wishlist' };
  }

  async removeItem(productId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== productId);
    
    if (this.items.length !== initialLength) {
      this.saveToLocalStorage();
      try {
        await this.syncWithBackend('remove', { id: productId });
        return { success: true, message: 'Product removed from wishlist' };
      } catch (error) {
        console.error('Backend sync failed:', error);
        return { success: true, message: 'Product removed locally, but sync failed' };
      }
    }
    return { success: false, message: 'Product not found in wishlist' };
  }

  getItems() {
    return this.items;
  }

  async syncWithBackend(action, product) {
    const response = await fetch(`${this.backendUrl}/wishlist/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: this.customerId,
        sessionId: this.customerId ? null : this.sessionId,
        action,
        product
      })
    });

    if (!response.ok) {
      throw new Error('Failed to sync with backend');
    }

    return response.json();
  }

  initializeButtons() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    if (!wishlistBtns.length) {
      console.warn('Wishlist button(s) not found');
      return;
    }

    wishlistBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const product = {
          id: btn.getAttribute('data-product-id'),
          name: btn.getAttribute('data-product-name'),
          image: btn.getAttribute('data-product-image'),
          price: btn.getAttribute('data-product-price')
        };

        const result = await this.addItem(product);
        console.log(result.message);
      });
    });
  }
}

module.exports = Wishlist;
