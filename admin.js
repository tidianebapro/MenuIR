const categories = [
  {
    id: "pizza",
    name: "Pizza",
    dishes: ["Margherita", "Verdura grillée"],
  },
  {
    id: "burger",
    name: "Burger",
    dishes: ["Smoky BBQ", "Green Avocado"],
  },
  {
    id: "pasta",
    name: "Pâtes",
    dishes: ["Crème de truffe", "Méditerranéennes"],
  },
];

const categoryList = document.getElementById("categoryList");
const categorySelect = document.getElementById("categorySelect");
const dishList = document.getElementById("dishList");
const newCategoryInput = document.getElementById("newCategory");
const addCategoryBtn = document.getElementById("addCategory");
const newDishInput = document.getElementById("newDish");
const addDishBtn = document.getElementById("addDish");
const topDishesEl = document.getElementById("topDishes");
const notificationsEl = document.getElementById("notifications");

const buildDragItem = (label, onRemove) => {
  const li = document.createElement("li");
  li.className = "drag-item";
  li.draggable = true;
  li.innerHTML = `<span>${label}</span><button aria-label="Supprimer">✕</button>`;
  li.querySelector("button").addEventListener("click", onRemove);
  return li;
};

const renderCategories = () => {
  categoryList.innerHTML = "";
  categorySelect.innerHTML = "";
  categories.forEach((category) => {
    categoryList.appendChild(
      buildDragItem(category.name, () => removeCategory(category.id))
    );
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
  renderDishes();
};

const renderDishes = () => {
  dishList.innerHTML = "";
  const current = categories.find((c) => c.id === categorySelect.value) ||
    categories[0];
  if (!current) return;
  current.dishes.forEach((dish, index) => {
    dishList.appendChild(
      buildDragItem(dish, () => removeDish(current.id, index))
    );
  });
};

const removeCategory = (id) => {
  const index = categories.findIndex((category) => category.id === id);
  if (index >= 0) {
    categories.splice(index, 1);
    renderCategories();
  }
};

const removeDish = (categoryId, dishIndex) => {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return;
  category.dishes.splice(dishIndex, 1);
  renderDishes();
};

const handleDrag = (list) => {
  let draggedItem = null;
  list.addEventListener("dragstart", (event) => {
    draggedItem = event.target.closest("li");
    event.dataTransfer.effectAllowed = "move";
  });

  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    const current = event.target.closest("li");
    if (!current || current === draggedItem) return;
    const rect = current.getBoundingClientRect();
    const next = event.clientY - rect.top > rect.height / 2;
    list.insertBefore(draggedItem, next ? current.nextSibling : current);
  });

  list.addEventListener("drop", () => {
    updateOrderFromList(list);
  });
};

const updateOrderFromList = (list) => {
  if (list === categoryList) {
    const newOrder = [...categoryList.querySelectorAll("li span")].map(
      (item) => item.textContent
    );
    categories.sort(
      (a, b) => newOrder.indexOf(a.name) - newOrder.indexOf(b.name)
    );
    renderCategories();
  } else if (list === dishList) {
    const current = categories.find((c) => c.id === categorySelect.value);
    if (!current) return;
    const newOrder = [...dishList.querySelectorAll("li span")].map(
      (item) => item.textContent
    );
    current.dishes = newOrder;
    renderDishes();
  }
};

addCategoryBtn.addEventListener("click", () => {
  const name = newCategoryInput.value.trim();
  if (!name) return;
  categories.push({ id: name.toLowerCase(), name, dishes: [] });
  newCategoryInput.value = "";
  renderCategories();
});

addDishBtn.addEventListener("click", () => {
  const name = newDishInput.value.trim();
  const current = categories.find((c) => c.id === categorySelect.value);
  if (!name || !current) return;
  current.dishes.push(name);
  newDishInput.value = "";
  renderDishes();
});

categorySelect.addEventListener("change", renderDishes);

const renderTopDishes = () => {
  const sample = [
    { name: "Margherita", views: 320 },
    { name: "Smoky BBQ", views: 260 },
    { name: "Crème de truffe", views: 210 },
  ];
  topDishesEl.innerHTML = "";
  sample.forEach((dish) => {
    const li = document.createElement("li");
    li.textContent = `${dish.name} · ${dish.views} vues`;
    topDishesEl.appendChild(li);
  });
};

const renderNotifications = () => {
  const requests = JSON.parse(
    window.localStorage.getItem("billRequests") || "[]"
  )
    .slice(-5)
    .reverse();
  notificationsEl.innerHTML = "";
  if (requests.length === 0) {
    notificationsEl.innerHTML =
      '<li class="notification">Aucune demande pour le moment.</li>';
    return;
  }
  requests.forEach((request) => {
    const li = document.createElement("li");
    li.className = "notification";
    const time = new Date(request.time).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    li.innerHTML = `<div>Table ${request.table}</div><time>${time}</time>`;
    notificationsEl.appendChild(li);
  });
};

handleDrag(categoryList);
handleDrag(dishList);
renderCategories();
renderTopDishes();
renderNotifications();

setInterval(renderNotifications, 4000);
