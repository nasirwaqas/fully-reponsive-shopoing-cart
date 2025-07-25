document.addEventListener('DOMContentLoaded', function () {
    class shoppingCart {
        constructor() {
            this.cart = this.loadCartFromLocalStorage();
            this.cartSidebar = document.getElementById("cart-sidebar");
            this.cartCountBadge = document.getElementById("cart-count-badge");
            this.renderCart();
            this.updateCartCountBadge();
            this.init();
        }
        init() {
            const btn = document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const product = {
                        id: btn.getAttribute('data-id'),
                        name: btn.getAttribute('data-name'),
                        price: btn.getAttribute('data-price'),
                        image: btn.getAttribute('data-image'),

                    }
                    this.addToCart(product);
                })
            })

            const cartIconBtn = document.getElementById('cart-icon-btn');
            if (cartIconBtn) {
                cartIconBtn.addEventListener('click', () => {
                    this.openCart();
                });
            }
            const closeBtn = document.getElementById('close-cart-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeCart();
                });
            }

        }
        openCart(){
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) {
                cartSidebar.classList.add('open');
            }
        };
        closeCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            if (cartSidebar) {
                cartSidebar.classList.remove('open');
            }
        }
        addToCart(product) {
            const existingProduct = this.cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity +=1;
            } else {
                product.quantity = 1;
                this.cart.push({ ...product, quantity: 1 });
            }
            this.saveDataToLocalStorage();
        }
        saveDataToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(this.cart));

        }
        loadCartFromLocalStorage() {
            const cartData = localStorage.getItem('cart');
            return cartData ? JSON.parse(cartData) : [];

        }
    }
    new shoppingCart();
    });