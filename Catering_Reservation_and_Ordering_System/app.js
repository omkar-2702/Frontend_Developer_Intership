// Simple logging function (can be replaced by proper logging library)
function logAction(action, details = {}) {
  console.log(`[LOG] ${action}`, details);
}

// Fake user registration stored in localStorage
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;

      const user = { name, email, password };
      localStorage.setItem("currentUser", JSON.stringify(user));
      logAction("USER_REGISTER", { email });
      alert("Registered and logged in (demo only).");
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      // Demo: directly set currentUser
      let user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (!user) {
        alert("No user registered. Please register first.");
        return;
      }
      if (user.email !== email) {
        alert("Email not matched with registered user (demo check).");
        return;
      }
      logAction("USER_LOGIN", { email });
      alert("Login successful (demo).");
    });
  }

  // Profile page load
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  if (profileName && profileEmail) {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (user) {
      profileName.textContent = user.name;
      profileEmail.textContent = user.email;
    } else {
      profileName.textContent = "Guest";
      profileEmail.textContent = "Not logged in";
    }
  }

  // Data store for products and orders using localStorage
  function getProducts() {
    return JSON.parse(localStorage.getItem("products") || "[]");
  }
  function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function getOrders() {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  }
  function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  // Seed some demo products if none
  if (!localStorage.getItem("products")) {
    const demoProducts = [
      { id: 1, name: "Traditional Indian Veg Thali", desc: "Pure veg thali for 50 people.", price: 8000 },
      { id: 2, name: "Wedding Buffet Package", desc: "Full wedding menu for 200 guests.", price: 60000 },
      { id: 3, name: "Birthday Party Snacks", desc: "Snacks and drinks for 30 guests.", price: 5000 }
    ];
    saveProducts(demoProducts);
  }

  // Render products on products.html
  const productList = document.getElementById("productList");
  if (productList) {
    const products = getProducts();
    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p><strong>Price:</strong> ₹${p.price}</p>
        <button data-id="${p.id}">Add to Cart</button>
      `;
      productList.appendChild(card);
    });

    productList.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const id = Number(e.target.getAttribute("data-id"));
        const products = getProducts();
        const prod = products.find((p) => p.id === id);
        const cart = getCart();
        cart.push(prod);
        saveCart(cart);
        logAction("ADD_TO_CART", { productId: id });
        alert("Added to cart.");
      }
    });
  }

  // Render cart on cart.html
  const cartItems = document.getElementById("cartItems");
  if (cartItems) {
    const cart = getCart();
    if (cart.length === 0) {
      cartItems.innerHTML = "<p>No items in cart.</p>";
    } else {
      cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <p><strong>${item.name}</strong> - ₹${item.price}</p>
          <button data-index="${index}">Remove</button>
        `;
        cartItems.appendChild(div);
      });

      cartItems.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
          const index = Number(e.target.getAttribute("data-index"));
          const cart = getCart();
          cart.splice(index, 1);
          saveCart(cart);
          logAction("REMOVE_FROM_CART", { index });
          location.reload();
        }
      });
    }
  }

  // Place order
  const placeOrderForm = document.getElementById("placeOrderForm");
  if (placeOrderForm) {
    placeOrderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const eventDate = document.getElementById("eventDate").value;
      const eventAddress = document.getElementById("eventAddress").value;
      const cart = getCart();
      if (cart.length === 0) {
        alert("Cart is empty.");
        return;
      }
      const orders = getOrders();
      const newOrder = {
        id: Date.now(),
        items: cart,
        eventDate,
        eventAddress,
        status: "Pending"
      };
      orders.push(newOrder);
      saveOrders(orders);
      saveCart([]);
      logAction("PLACE_ORDER", { orderId: newOrder.id });
      alert("Order placed successfully.");
      window.location.href = "orders.html";
    });
  }

  // Render user orders
  const orderList = document.getElementById("orderList");
  if (orderList) {
    const orders = getOrders();
    if (orders.length === 0) {
      orderList.innerHTML = "<p>No orders yet.</p>";
    } else {
      orders.forEach((order) => {
        const div = document.createElement("div");
        div.className = "item";
        const total = order.items.reduce((sum, i) => sum + i.price, 0);
        div.innerHTML = `
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${order.eventDate}</p>
          <p><strong>Address:</strong> ${order.eventAddress}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> ₹${total}</p>
        `;
        orderList.appendChild(div);
      });
    }
  }

  // Admin: add product
  const adminProductForm = document.getElementById("adminProductForm");
  if (adminProductForm) {
    adminProductForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("prodName").value;
      const desc = document.getElementById("prodDesc").value;
      const price = Number(document.getElementById("prodPrice").value);

      const products = getProducts();
      const newProduct = {
        id: Date.now(),
        name,
        desc,
        price
      };
      products.push(newProduct);
      saveProducts(products);
      logAction("ADMIN_ADD_PRODUCT", { productId: newProduct.id });
      alert("Product added.");
      adminProductForm.reset();
    });
  }

  // Admin: view all orders
  const adminOrderList = document.getElementById("adminOrderList");
  if (adminOrderList) {
    const orders = getOrders();
    if (orders.length === 0) {
      adminOrderList.innerHTML = "<p>No orders placed yet.</p>";
    } else {
      orders.forEach((order) => {
        const div = document.createElement("div");
        div.className = "item";
        const itemsSummary = order.items.map((i) => i.name).join(", ");
        div.innerHTML = `
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Items:</strong> ${itemsSummary}</p>
          <p><strong>Date:</strong> ${order.eventDate}</p>
          <p><strong>Address:</strong> ${order.eventAddress}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        `;
        adminOrderList.appendChild(div);
      });
    }
  }
});
