// State Management
let cart = {}; // Object to store items by ID: { 1: { name: 'Item', price: 20, qty: 1 } }
let total = 0;

// Config (For WhatsApp)
const WA_PHONE = "917816058171"; // Updated store owner's number

// Add to Cart Function
function addToCart(id, name, price) {
    if (cart[id]) {
        cart[id].qty++;
    } else {
        cart[id] = { name, price, qty: 1 };
    }
    updateCartUI();
    toggleCart(true); // Open cart automatically on add
}

// Update Cart UI
function updateCartUI() {
    const container = document.getElementById("cartItemsContainer");
    const countBadge = document.getElementById("cartCount");
    const totalSpan = document.getElementById("cartTotal");

    container.innerHTML = "";
    let itemCount = 0;
    total = 0;

    const items = Object.entries(cart);

    if (items.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">Your cart is empty 😔</div>';
        countBadge.textContent = 0;
        totalSpan.textContent = "₹0";
        return;
    }

    items.forEach(([id, item]) => {
        itemCount += item.qty;
        total += item.price * item.qty;

        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <span>₹${item.price} x ${item.qty}</span>
            </div>
            <div class="item-controls">
                <button class="qty-btn" onclick="changeQty('${id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty('${id}', 1)">+</button>
                <button class="remove-btn" onclick="removeItem('${id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        container.appendChild(el);
    });

    countBadge.textContent = itemCount;
    totalSpan.textContent = "₹" + total;
}

// Change Quantity
function changeQty(id, change) {
    if (cart[id]) {
        cart[id].qty += change;
        if (cart[id].qty <= 0) {
            delete cart[id];
        }
        updateCartUI();
    }
}

// Remove Item
function removeItem(id) {
    delete cart[id];
    updateCartUI();
}

// Toggle Cart Sidebar
function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay");

    if (forceOpen) {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    } else {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    }
}

// Scroll to Menu
function scrollToMenu() {
    document.getElementById("menu").scrollIntoView({ behavior: 'smooth' });
}

// Checkout Modal
function openCheckout() {
    if (total === 0) {
        alert("Your cart is empty!");
        return;
    }
    document.getElementById("checkoutModal").classList.add("active");

    // Update Mini Summary
    const mini = document.getElementById("orderSummaryMini");
    let summaryText = `<h4>Order Summary</h4><ul>`;
    Object.values(cart).forEach(item => {
        summaryText += `<li>${item.name} x ${item.qty} - ₹${item.price * item.qty}</li>`;
    });
    summaryText += `</ul><p><strong>Total: ₹${total}</strong></p>`;
    mini.innerHTML = summaryText;
}

function closeCheckout() {
    document.getElementById("checkoutModal").classList.remove("active");
}

// Retrieve Form Data
function getFormData() {
    return {
        name: document.getElementById("custName").value,
        phone: document.getElementById("custPhone").value,
        address: document.getElementById("custAddress").value
    };
}

// WhatsApp Order
// WhatsApp Order
function orderWhatsApp(e) {
    if (e) e.preventDefault();

    const data = getFormData();
    if (!data.name || !data.phone || !data.address) {
        alert("Please fill in all details");
        return;
    }

    let message = `*New Order from ${data.name}*\n\n`;
    Object.values(cart).forEach(item => {
        message += `${item.name} x ${item.qty}\n`;
    });
    message += `\n*Total: ₹${total}*\n`;
    message += `\n*Details:*\nPhone: ${data.phone}\nAddress: ${data.address}`;

    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    // Optional: Clear cart after redirect
    cart = {};
    updateCartUI();
    closeCheckout();
}

// Simulated Order (Redirected to WhatsApp)
function handleOrder(e) {
    orderWhatsApp(e);
}


