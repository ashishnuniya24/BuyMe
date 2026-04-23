function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateNavCartCount();
}

function getCartItemCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}

function updateNavCartCount() {
    const badge = document.getElementById("cart-count");

    if (!badge) {
        return;
    }

    const count = getCartItemCount();
    badge.textContent = count;
    badge.classList.toggle("d-none", count === 0);
}

function setupNavbarSearchForms() {
    const forms = document.querySelectorAll(".js-nav-search-form");

    forms.forEach((form) => {
        if (form.dataset.bound === "true") {
            return;
        }

        form.dataset.bound = "true";

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const input = form.querySelector(".js-nav-search-input");
            const query = input ? input.value.trim() : "";
            const targetUrl = query
                ? `products.html?search=${encodeURIComponent(query)}`
                : "products.html";

            window.location.href = targetUrl;
        });
    });
}

function addToCart(name, price) {
    let cart = getCart();
    const existing = cart.find((item) => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    saveCart(cart);
}

function increaseQuantity(index) {
    let cart = getCart();
    cart[index].quantity += 1;
    saveCart(cart);

    if (typeof displayCart === "function") {
        displayCart();
    }
}

function decreaseQuantity(index) {
    let cart = getCart();

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    saveCart(cart);

    if (typeof displayCart === "function") {
        displayCart();
    }
}

function clearCart() {
    localStorage.removeItem("cart");
    updateNavCartCount();

    if (typeof displayCart === "function") {
        displayCart();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateNavCartCount();
    setupNavbarSearchForms();
});