document.addEventListener('DOMContentLoaded', function () {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    if (!wishlistBtns.length) {
        console.warn('Wishlist button(s) not found');
        return;
    }

    // Shopify customer object
    const shopifyCustomerId = window.Shopify && window.Shopify.customer ? window.Shopify.customer.id : null;

    // Generate or get session ID
    let sessionId = localStorage.getItem('wishlist_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('wishlist_session_id', sessionId);
    }

    wishlistBtns.forEach(function (btn) {
        btn.addEventListener('click', async function () {
            const product = {
                id: this.getAttribute('data-product-id'),
                name: this.getAttribute('data-product-name'),
                image: this.getAttribute('data-product-image'),
                price: this.getAttribute('data-product-price')
            };

            if (!product.id) {
                console.warn('Missing product ID');
                return;
            }

            // Get or initialize localStorage wishlist
            let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const exists = wishlist.find(item => item.id === product.id);

            if (!exists) {
                wishlist.push(product);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                console.log('✅ Product added to localStorage wishlist');
            } else {
                console.log('⚠️ Product already in wishlist');
            }

            // Sync to your backend
            try {
                const response = await fetch('https://zewana-wishlist.onrender.com/wishlist/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customerId: shopifyCustomerId,
                        sessionId: shopifyCustomerId ? null : sessionId,
                        action: 'add',
                        product
                    })
                });

                if (!response.ok) throw new Error('Failed to sync with backend');
                console.log('✅ Wishlist synced with backend');
            } catch (error) {
                console.error('❌ Backend sync failed:', error);
            }
        });
    });
});
