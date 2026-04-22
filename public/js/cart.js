function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(name, price) {
    let cart = getCart();

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);
}

function increaseQuantity(index) {
    let cart = getCart();
    cart[index].quantity += 1;
    saveCart(cart);
    displayCart();
}

function decreaseQuantity(index) {
    let cart = getCart();

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    saveCart(cart);
    displayCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
}