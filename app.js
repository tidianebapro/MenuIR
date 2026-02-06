const data = [
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

const categoriesEl = document.getElementById("categories");
const sliderEl = document.getElementById("dishSlider");
const cardEl = document.getElementById("dishCard");
const cardBodyEl = document.getElementById("dishCardBody");
const closeCardBtn = document.getElementById("closeCard");
const videoEmbedEl = document.getElementById("videoEmbed");
const veganFilterBtn = document.getElementById("veganFilter");
const billModal = document.getElementById("billModal");
const billButton = document.getElementById("billButton");
const closeModalBtn = document.getElementById("closeModal");
const submitBillBtn = document.getElementById("submitBill");
const tableNumberInput = document.getElementById("tableNumber");
const modalStatus = document.getElementById("modalStatus");

let activeCategory = data[0];
let filterVegan = false;

const buildVideoEmbed = (youtubeId) => {
  const params = new URLSearchParams({
    autoplay: "1",
    loop: "1",
    mute: "1",
    controls: "0",
    playsinline: "1",
    modestbranding: "1",
    playlist: youtubeId,
  });
  return `<iframe src="https://www.youtube.com/embed/${youtubeId}?${params.toString()}" title="video" allow="autoplay; fullscreen"></iframe>`;
};

const setVideo = (dish) => {
  videoEmbedEl.innerHTML = buildVideoEmbed(dish.youtubeId);
};

const renderCategories = () => {
  categoriesEl.innerHTML = "";
  data.forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-btn";
    button.textContent = category.name;
    button.setAttribute("data-id", category.id);
    if (category.id === activeCategory.id) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderDishes();
    });
    categoriesEl.appendChild(button);
  });
};

const renderDishes = () => {
  sliderEl.innerHTML = "";
  const dishes = activeCategory.dishes.filter((dish) =>
    filterVegan ? dish.vegan : true
  );

  dishes.forEach((dish) => {
    const card = document.createElement("article");
    card.className = "dish-card-preview";
    card.innerHTML = `
      <div class="dish-thumb" style="background-image: url('${dish.thumbnail}')"></div>
      <div class="dish-info">
        <h3>${dish.name}</h3>
        <span class="price">${dish.price}</span>
      </div>
    `;
    card.addEventListener("click", () => openDish(dish));
    sliderEl.appendChild(card);
  });

  if (dishes.length === 0) {
    sliderEl.innerHTML =
      '<div class="dish-card-preview" style="padding: 1rem;">Aucun plat vegan dans cette catégorie.</div>';
  }
};

const openDish = (dish) => {
  setVideo(dish);
  cardBodyEl.innerHTML = `
    <h2>${dish.name}</h2>
    <span class="price">${dish.price}</span>
    ${dish.vegan ? '<span class="badge">🌿 Vegan</span>' : ""}
    <p class="ingredients">${dish.ingredients}</p>
  `;
  cardEl.classList.add("open");
};

closeCardBtn.addEventListener("click", () => {
  cardEl.classList.remove("open");
});

let touchStartX = 0;
cardEl.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

cardEl.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (delta > 80) {
    cardEl.classList.remove("open");
  }
});

veganFilterBtn.addEventListener("click", () => {
  filterVegan = !filterVegan;
  veganFilterBtn.setAttribute("aria-pressed", String(filterVegan));
  renderDishes();
});

billButton.addEventListener("click", () => {
  billModal.classList.add("show");
  billModal.setAttribute("aria-hidden", "false");
  tableNumberInput.value = "";
  modalStatus.textContent = "";
});

closeModalBtn.addEventListener("click", () => {
  billModal.classList.remove("show");
  billModal.setAttribute("aria-hidden", "true");
});

submitBillBtn.addEventListener("click", () => {
  const tableNumber = tableNumberInput.value.trim();
  if (!tableNumber) {
    modalStatus.textContent = "Merci de saisir un numéro de table.";
    return;
  }

  const requests = JSON.parse(
    window.localStorage.getItem("billRequests") || "[]"
  );
  requests.push({
    table: tableNumber,
    time: new Date().toISOString(),
  });
  window.localStorage.setItem("billRequests", JSON.stringify(requests));
  modalStatus.textContent = `Demande envoyée pour la table ${tableNumber}.`;
  setTimeout(() => {
    billModal.classList.remove("show");
    billModal.setAttribute("aria-hidden", "true");
  }, 1200);
});

renderCategories();
renderDishes();
openDish(activeCategory.dishes[0]);
