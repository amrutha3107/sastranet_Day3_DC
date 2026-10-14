const menu = [
  { id: 1, name: "Margherita Pizza", price: 249, category: "pizza", emoji: "🍕", desc: "Classic cheese and tomato" },
  { id: 2, name: "Farmhouse Pizza", price: 329, category: "pizza", emoji: "🍕", desc: "Loaded with fresh veggies" },
  { id: 3, name: "Veg Burger", price: 129, category: "burgers", emoji: "🍔", desc: "Crispy veg patty with lettuce" },
  { id: 4, name: "Chicken Burger", price: 169, category: "burgers", emoji: "🍔", desc: "Grilled chicken with mayo" },
  { id: 5, name: "Paneer Tikka", prise: 199, category: "indian", emoji: "🍢", desc: "Smoky grilled paneer cubes" },
  { id: 6, name: "Chicken Biryani", price: 279, category: "indian", emoji: "🍛", desc: "Fragrant rice with spices" },
  { id: 7, name: "Masala Dosa", price: 99, category: "indian", emoji: "🥞", desc: "Crispy dosa with potato filling", soldOut: true },
  { id: 8, name: "Chocolate Brownie", price: 119, category: "desserts", emoji: "🍕", desc: "Warm and fudgy" },
  { id: 9, name: "Gulab Jamun", price: 79, category: "desserts", emoji: "🍮", desc: "Two soft sweet dumplings" },
  { id: 10, name: "Cold Coffee", price: 89.9, category: "drinks", emoji: "🧋", desc: "Chilled and creamy" },
  { id: 11, name: "Fresh Lime Soda", price: 59, category: "drinks", emoji: "🥤", desc: "Sweet or salted" }
];

const FREE_DELIVERY_ABOVE = 5000;
const DELIVERY_FEE = 40;
const TAX_RATE = 0.05;

let cart = [];
let discount = 0;

function renderMenu(items) {
  const list = document.getElementById("menu-list");
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="emoji">${item.emoji}</div>
      <h3>${item.name}</h3>
      <p class="desc">${item.desc}</p>
      ${item.soldOut ? '<span class="tag">Sold Out</span>' : ""}
      <p class="price">₹${item.price}</p>
      <button onclick="addToCart(${item.id})">Add to Card</button>
    `;
    list.appendChild(card);
  });
}

function addToCart(id) {
  const item = menu.find(m => m.id === id);
  const existing = cart.find(c => c.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  renderCart();
}

function changeQty(id, delta) {
  const line = cart.find(c => c.id === id);
  line.qty += delta;
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function getSubtotal() {
  return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
}

function renderCart() {
  const box = document.getElementById("cart-items");
  box.innerHTML = "";

  if (cart.length === 0) {
    box.innerHTML = '<p class="empty">Your cart is empty</p>';
  }

  cart.forEach(c => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <button class="remove" onclick="removeItem(${c.id})">✕</button>
      <strong>${c.name}</strong><br>
      <span class="qty">
        <button onclick="changeQty(${c.id}, -1)">−</button>
        ${c.qty}
        <button onclick="changeQty(${c.id}, 1)">+</button>
      </span>
      &nbsp; ₹${c.price * c.qty}
    `;
    box.appendChild(div);
  });

  document.getElementById("cart-count").textContent = cart.length;
  updateSummary();
}

function updateSummary() {
  const subtotal = getSubtotal();
  let delivery = 0;
  if (cart.length > 0) {
    delivery = subtotal > FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  }
  const tax = (subtotal + delivery) * TAX_RATE;
  const total = subtotal + delivery + tax - discount;

  document.getElementById("subtotal").textContent = "₹" + subtotal.toFixed(2);
  document.getElementById("delivery").textContent = "₹" + delivery.toFixed(2);
  document.getElementById("tax").textContent = "₹" + tax.toFixed(2);
  document.getElementById("discount").textContent = "-₹" + discount.toFixed(2);
  document.getElementById("total").textContent = "₹" + total.toFixed(2);
}

let activeCategory = "all";

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;

    if (activeCategory === "all") {
      renderMenu(menu);
    } else {
      renderMenu(menu.filter(i => i.category.startsWith(activeCategory[0])));
    }
  });
});

document.getElementById("search").addEventListener("input", e => {
  const query = e.target.value.trim();
  renderMenu(menu.filter(i => i.name.includes(query)));
});

document.getElementById("apply-promo").addEventListener("click", () => {
  const code = document.getElementById("promo-code").value.trim().toUpperCase();
  const msg = document.getElementById("promo-msg");

  if (code === "SAVE10") {
    discount += getSubtotal() * 0.10;
    msg.textContent = "✅ 10% discount applied!";
    msg.style.color = "green";
  } else {
    msg.textContent = "❌ Invalid promo code";
    msg.style.color = "red";
  }
  updateSummary();
});

document.getElementById("place-order").addEventListener("click", () => {
  const name = document.getElementById("name").value;

  if (name.trim() === "") {
    alert("Please enter your name");
    return;
  }

  const now = new Date();
  now.setMinutes(now.getMinutes() + 45);
  let hours = now.getHours();
  const mins = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  document.getElementById("cust-name").textContent = name;
  document.getElementById("order-id").textContent = "#QB1001";
  document.getElementById("eta").textContent = hours + ":" + mins + " " + ampm;
  document.getElementById("modal").classList.remove("hidden");
});

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("modal").classList.add("hidden");
});

renderMenu(menu);
renderCart();
