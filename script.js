class ShoppingCart {
  constructor() {
    this.cart = [];
    this.cartSidebar = document.getElementById('cart-sidebar');
    this.cartSidebarItems = document.getElementById('cart-sidebar-items');
    this.cartSidebarTotal = document.getElementById('cart-sidebar-total');
    this.cartSidebarOverlay = document.getElementById('cart-sidebar-overlay');
    this.cartCountBadge = document.getElementById('cart-count-badge'); 
    this.cartAlert = document.getElementById('cart-alert'); // add this line
    this.init();
  }

  init() {
    // Add to cart button listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = {
          id: btn.getAttribute('data-id'),
          name: btn.getAttribute('data-name'),
          price: parseFloat(btn.getAttribute('data-price')),
          image: btn.getAttribute('data-image'),
        };
        this.addToCart(product);
        
      });
    });

    // Cart icon opens cart
    const cartIconBtn = document.getElementById('cart-icon-btn');
    if (cartIconBtn) {
      cartIconBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCart();
      });
    }

    // Close cart button 
    const closeBtn = document.getElementById('close-cart-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCart());
    }

    // Overlay click closes cart
    if (this.cartSidebarOverlay) {
      this.cartSidebarOverlay.addEventListener('click', () => this.closeCart());
    }
  }

  addToCart(product) {
    const existing = this.cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.renderCart();
    this.updateCartCountBadge(); // update badge
    this.showCartAlert(); // show alert
  }

  showCartAlert() {
    if (this.cartAlert) {
      this.cartAlert.style.display = 'block';
      setTimeout(() => {
        if (this.cartAlert) this.cartAlert.style.display = 'none';
      }, 1500);
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.renderCart();
    this.updateCartCountBadge(); // update badge
  }

  changeQuantity(productId, delta) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.renderCart();
        this.updateCartCountBadge(); // update badge
      }
    }
  }

  openCart() {
    this.cartSidebar.classList.add('open');
    this.cartSidebarOverlay.classList.add('open');
    this.renderCart();
  }

  closeCart() {
    this.cartSidebar.classList.remove('open');
    this.cartSidebarOverlay.classList.remove('open');
  }

  renderCart() {
    this.cartSidebarItems.innerHTML = '';
    let total = 0;
    if (this.cart.length === 0) {
      this.cartSidebarItems.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      this.cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-sidebar-item';
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-sidebar-item-details">
            <div>${item.name}</div>
            <div>$${item.price} x ${item.quantity}</div>
          </div>
          <div class="cart-sidebar-item-controls">
            <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
            <button class="remove-btn" data-id="${item.id}">remove</button>
          </div>
        `;
        this.cartSidebarItems.appendChild(div);
      });
    }
    this.cartSidebarTotal.textContent = total.toFixed(2);

    // Add listeners for qty and remove buttons
    this.cartSidebarItems.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const delta = parseInt(btn.getAttribute('data-delta'), 10);
        this.changeQuantity(id, delta);
      });
    });
    this.cartSidebarItems.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.removeFromCart(id);
      });
    });
  }

  updateCartCountBadge() {
    if (!this.cartCountBadge) return;
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (count > 0) {
      this.cartCountBadge.textContent = count;
      this.cartCountBadge.style.display = 'inline-block';
    } else {
      this.cartCountBadge.style.display = 'none';
    }
  }
}

window.ShoppingCart = ShoppingCart;
