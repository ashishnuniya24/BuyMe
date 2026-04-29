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

function getWishlistItems() {
    return JSON.parse(localStorage.getItem("wishlistedProducts") || "{}");
}

function saveWishlistItems(wishlistItems) {
    localStorage.setItem("wishlistedProducts", JSON.stringify(wishlistItems));
    updateNavWishlistCount();
}

function getWishlistCount() {
    return Object.keys(getWishlistItems()).length;
}

function updateNavWishlistCount() {
    const badge = document.getElementById("wishlist-count");

    if (!badge) {
        return;
    }

    const count = getWishlistCount();
    badge.textContent = count;
    badge.classList.toggle("d-none", count === 0);
}

function getCurrentUser() {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch (err) {
        console.error("Failed to parse currentUser", err);
        return null;
    }
}

function logoutCurrentUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    updateNavbarAuthState();
    window.location.href = "index.html";
}

function updateNavbarAuthState() {
    const actions = document.querySelector(".site-actions");

    if (!actions) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.name) {
        actions.innerHTML = `
            <a href="login.html" class="btn btn-outline-light">Login</a>
            <a href="signup.html" class="btn btn-info text-dark">Sign Up</a>
        `;
        return;
    }

    actions.innerHTML = `
        <span class="btn btn-light disabled">${currentUser.name}</span>
        <button type="button" class="btn btn-outline-light js-logout-btn">Logout</button>
    `;

    const logoutButton = actions.querySelector(".js-logout-btn");

    if (logoutButton) {
        logoutButton.addEventListener("click", logoutCurrentUser);
    }
}

function getSearchApiBase() {
    return window.location.port === "5500" || window.location.protocol === "file:" ? "https://buyme-h69i.onrender.com" : "";
}

function normalizeSearchTerm(value) {
    return String(value).trim().toLowerCase();
}

async function fetchSearchSuggestions() {
    const response = await fetch(`${getSearchApiBase()}/api/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch search suggestions");
    }

    const products = await response.json();
    return products.map((product) => product.name).filter(Boolean);
}

function closeSearchSuggestions(form) {
    const suggestionList = form.querySelector(".site-search-suggestions");

    if (!suggestionList) {
        return;
    }

    suggestionList.hidden = true;
    suggestionList.innerHTML = "";
}

function renderSearchSuggestions(form, input, suggestions) {
    let suggestionList = form.querySelector(".site-search-suggestions");

    if (!suggestionList) {
        suggestionList = document.createElement("div");
        suggestionList.className = "site-search-suggestions";
        suggestionList.hidden = true;
        form.appendChild(suggestionList);
    }

    const query = normalizeSearchTerm(input.value);

    if (!query) {
        closeSearchSuggestions(form);
        return;
    }

    const filteredSuggestions = suggestions.filter((name) => normalizeSearchTerm(name).includes(query)).slice(0, 6);

    if (!filteredSuggestions.length) {
        closeSearchSuggestions(form);
        return;
    }

    suggestionList.innerHTML = "";

    filteredSuggestions.forEach((name) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "site-search-suggestion-item";
        button.textContent = name;
        button.addEventListener("mousedown", (event) => {
            event.preventDefault();
            input.value = name;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            closeSearchSuggestions(form);
        });
        suggestionList.appendChild(button);
    });

    suggestionList.hidden = false;
}

async function setupNavbarSearchSuggestions() {
    const forms = document.querySelectorAll(".js-nav-search-form");

    if (!forms.length) {
        return;
    }

    try {
        const suggestions = await fetchSearchSuggestions();
        const uniqueSuggestions = [...new Set(suggestions)].sort((left, right) => left.localeCompare(right));

        forms.forEach((form) => {
            const input = form.querySelector(".js-nav-search-input");

            if (!input || form.dataset.suggestionsBound === "true") {
                return;
            }

            form.dataset.suggestionsBound = "true";

            input.addEventListener("input", () => {
                renderSearchSuggestions(form, input, uniqueSuggestions);
            });

            input.addEventListener("focus", () => {
                renderSearchSuggestions(form, input, uniqueSuggestions);
            });

            input.addEventListener("blur", () => {
                window.setTimeout(() => closeSearchSuggestions(form), 100);
            });
        });

        document.addEventListener("click", (event) => {
            forms.forEach((form) => {
                if (!form.contains(event.target)) {
                    closeSearchSuggestions(form);
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
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

function addToCart(name, price, image, colors, id) {
    let cart = getCart();
    const existing = cart.find((item) => item.name === name);

    if (existing) {
        existing.quantity += 1;
        if (!existing.image && image) {
            existing.image = image;
        }
        if (!existing.colors && colors) {
            existing.colors = colors;
        }
        if (!existing.id && id) {
            existing.id = id;
        }
    } else {
        cart.push({
            name,
            price,
            image,
            colors,
            id,
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
    updateNavWishlistCount();
    updateNavbarAuthState();
    setupNavbarSearchForms();
    setupNavbarSearchSuggestions();
});