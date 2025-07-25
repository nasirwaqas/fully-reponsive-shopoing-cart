document.addEventListener('DOMContentLoaded', function () {
  class shoppingCart {
    constructor() {
      this.cart = this.loadCartFromLocalStorage();
      this.cartSidebar = document.getElementById("cart-sidebar");
      this.cartalertbtn = document.getElementById("cart-alert");
      this.cartCountBadge = document.getElementById("cart-count-badge");
      this.renderCart();
      this.init();
      this.updateCartCountBadge();
    }
    init() {
      const btn = document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const product = {
            id: btn.getAttribute('data-id'),
            name: btn.getAttribute('data-name'),
            price: btn.getAttribute('data-price'),
            image: btn.getAttribute('data-image'),
          };
          this.addToCart(product);
          console.log("Product added to cart:", product);
        });
      });
      const cartIconBtn = document.getElementById('cart-icon-btn');
      if (cartIconBtn) {
        cartIconBtn.addEventListener('click', () => {
          this.openCart();
        });
      }
      const closeBtn = document.getElementById('close-cart-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () =>
          this.closeCart());
      }
    }

    openCart() {
      if (this.cartSidebar) this.cartSidebar.classList.add('open');
    }
    closeCart() {
      if (this.cartSidebar) this.cartSidebar.classList.remove('open');
    }
    closeAlert(){
      if(this.cartalertbtn) this.cartalertbtn.classList.remove('open');
    }
    openAlert() {
      if (this.cartalertbtn) this.cartalertbtn.classList.add('open');
    }

    addToCart(product) {
      const existingProduct = this.cart.find(item => item.id === product.id);
      const closeAlert = document.getElementById('closeBtn');
       closeAlert.addEventListener('click', () => {
          this.closeAlert();
        });
      if (existingProduct) {
        existingProduct.quantity += 1;
        this.openAlert();
        setTimeout(() => {
          this.closeAlert();
        }, 1500);
        console.log(closeAlert);
        console.log(existingProduct);
      } else {
        product.quantity = 1;
        this.cart.push({ ...product, quantity: 1 });
        this.openAlert();
        setTimeout(() => {
          this.closeAlert();
        }, 1500);
        console.log(closeAlert);
      this.saveDataToLocalStorage();
      this.renderCart();
      this.updateCartCountBadge();
    }
  }
    loadCartFromLocalStorage() {
      const cartData = localStorage.getItem('cart');
      return cartData ? JSON.parse(cartData) : [];
    }
    saveDataToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    updateCartCountBadge() {
      const totalItems = this.cart.reduce((acc, item) => acc + item.quantity, 0);
      if (totalItems > 0) {
        this.cartCountBadge.textContent = totalItems;
        this.cartCountBadge.style.display = 'block';
      } else {
        this.cartCountBadge.style.display = 'none';
      };
    }
    renderCart() {
      const cartSidebarItems = document.getElementById('cart-sidebar-items');
      const cartSidebarTotal = document.getElementById('cart-sidebar-total');
      if (!cartSidebarItems) return;

      cartSidebarItems.innerHTML = '';
      let total = 0;

      this.cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item-row';
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-details">
            <div class="cart-item-row">
              <p class="cart-item-name">${item.name}</p>
            </div>
            <div class="cart-item-row">
              <p class="cart-item-price">${item.price}</p>
              <span>x</span>
              <p class="cart-item-quantity">${item.quantity}</p>
            </div>
          </div>
          <button class="increment-operator" data-id="${item.id}">+</button>
          <button class="decrement-operator" data-id="${item.id}">-</button>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        `;
        cartSidebarItems.appendChild(itemDiv);

        // Add event listeners for operations
        itemDiv.querySelector('.increment-operator').onclick = () => {
          item.quantity += 1;
          this.saveDataToLocalStorage();
          this.renderCart();
        };
        itemDiv.querySelector('.decrement-operator').onclick = () => {
          if (item.quantity > 1) {
            item.quantity -= 1;
            this.saveDataToLocalStorage();
            this.renderCart();
          }
        };
        itemDiv.querySelector('.remove-btn').onclick = () => {
          this.cart = this.cart.filter(i => i.id !== item.id);
          this.saveDataToLocalStorage();
          this.renderCart();
          this.updateCartCountBadge();
        };
      });

      if (cartSidebarTotal) {
        cartSidebarTotal.textContent = total;
      }
    }
  }
  new shoppingCart();
});
