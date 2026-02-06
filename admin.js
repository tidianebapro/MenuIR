const STORAGE_KEY = "menuirData";

const defaultCategories = [
  {
    id: "pizza",
    name: "Pizza",
    dishes: [
      {
        id: "margherita",
        name: "Margherita",
        price: "12 €",
        ingredients: "Tomate San Marzano, mozzarella fior di latte, basilic frais.",
        vegan: false,
        thumbnail:
          "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
        youtubeId: "5K8U4y5wM0U",
      },
      {
        id: "verdura",
        name: "Verdura grillée",
        price: "13 €",
        ingredients: "Poivrons rôtis, courgettes, oignons rouges, pesto vegan.",
        vegan: true,
        thumbnail:
          "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
        youtubeId: "E8gmARGvPlI",
      },
    ],
  },
  {
    id: "burger",
    name: "Burger",
    dishes: [
      {
        id: "smoky",
        name: "Smoky BBQ",
        price: "15 €",
        ingredients: "Boeuf maturé, cheddar affiné, sauce BBQ maison.",
        vegan: false,
        thumbnail:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
        youtubeId: "gVZ2KxL4r1M",
      },
      {
        id: "green",
        name: "Green Avocado",
        price: "14 €",
        ingredients: "Steak végétal, avocat, pickles, mayo vegan.",
        vegan: true,
        thumbnail:
          "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=600&q=80",
        youtubeId: "SQHcA4Uj6T0",
      },
    ],
  },
  {
    id: "pasta",
    name: "Pâtes",
    dishes: [
      {
        id: "truffle",
        name: "Crème de truffe",
        price: "18 €",
        ingredients: "Tagliatelles fraîches, crème, copeaux de truffe noire.",
        vegan: false,
        thumbnail:
          "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
        youtubeId: "B1J6Ou4q8vE",
      },
      {
        id: "mediterranean",
        name: "Méditerranéennes",
        price: "16 €",
        ingredients: "Pesto basilic, tomates confites, roquette, citron.",
        vegan: true,
        thumbnail:
          "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=600&q=80",
        youtubeId: "H_jK4sqa4y8",
      },
    ],
  },
];

const loadCategories = () => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultCategories;
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultCategories;
  } catch (error) {
    return defaultCategories;
  }
};

const saveCategories = () => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

const categories = loadCategories();

if (!window.localStorage.getItem(STORAGE_KEY)) {
  saveCategories();
}

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
      buildDragItem(dish.name, () => removeDish(current.id, index))
    );
  });
};

const removeCategory = (id) => {
  const index = categories.findIndex((category) => category.id === id);
  if (index >= 0) {
    categories.splice(index, 1);
    saveCategories();
    renderCategories();
  }
};

const removeDish = (categoryId, dishIndex) => {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return;
  category.dishes.splice(dishIndex, 1);
  saveCategories();
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
    saveCategories();
    renderCategories();
  } else if (list === dishList) {
    const current = categories.find((c) => c.id === categorySelect.value);
    if (!current) return;
    const newOrder = [...dishList.querySelectorAll("li span")].map(
      (item) => item.textContent
    );
    current.dishes = newOrder
      .map((name) => current.dishes.find((dish) => dish.name === name))
      .filter(Boolean);
    saveCategories();
    renderDishes();
  }
};

addCategoryBtn.addEventListener("click", () => {
  const name = newCategoryInput.value.trim();
  if (!name) return;
  categories.push({ id: name.toLowerCase(), name, dishes: [] });
  saveCategories();
  newCategoryInput.value = "";
  renderCategories();
});

addDishBtn.addEventListener("click", () => {
  const name = newDishInput.value.trim();
  const current = categories.find((c) => c.id === categorySelect.value);
  if (!name || !current) return;
  current.dishes.push({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    price: "Prix à définir",
    ingredients: "Ingrédients à définir.",
    vegan: false,
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    youtubeId: "5K8U4y5wM0U",
  });
  saveCategories();
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
