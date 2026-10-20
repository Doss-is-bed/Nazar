// Вікна
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");


// Відкрити Login
function openLogin() {
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
}


// Відкрити Sign up
function openRegister() {
    registerModal.style.display = "flex";
    loginModal.style.display = "none";
}


// Закрити Login
function closeLogin() {
    loginModal.style.display = "none";
}


// Закрити Sign up
function closeRegister() {
    registerModal.style.display = "none";
}

const searchInput = document.getElementById("animeSearch");
const searchButton = document.getElementById("searchButton");
const filterOverlay = document.getElementById("filterOverlay");
const openFilters = document.getElementById("openFilters");
const closeFilters = document.getElementById("closeFilters");
const applyFilters = document.getElementById("applyFilters");
const resetFilters = document.getElementById("resetFilters");
const animeSort = document.getElementById("animeSort");
const filterCount = document.getElementById("filterCount");
const resultsMessage = document.getElementById("resultsMessage");

const catalogue = document.querySelector(".anime-grid");

// Відкрити та закрити вікно
openFilters.addEventListener("click", () => {
    filterOverlay.classList.add("active");
});

closeFilters.addEventListener("click", () => {
    filterOverlay.classList.remove("active");
});

filterOverlay.addEventListener("click", (event) => {
    if (event.target === filterOverlay) {
        filterOverlay.classList.remove("active");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        filterOverlay.classList.remove("active");
    }
});

// Отримати вибрані значення з групи чекбоксів
function getSelectedValues(containerId) {
    return Array.from(
        document.querySelectorAll(
            `#${containerId} input[type="checkbox"]:checked`
        )
    ).map(input => input.value);
}

// Основна функція фільтрації
function filterAnime() {
    if (!catalogue) return;

    const cards = Array.from(
        catalogue.querySelectorAll(".anime-card")
    );

    const query = searchInput.value.trim().toLocaleLowerCase();

    const genres = getSelectedValues("genreOptions");
    const years = getSelectedValues("yearOptions");
    const types = getSelectedValues("typeOptions");
    const sort = animeSort.value;

    let visibleCards = [];

    cards.forEach(card => {
        const title = (
            card.dataset.title ||
            card.querySelector(".anime-title")?.textContent ||
            ""
        ).toLocaleLowerCase();

        const cardGenres = (card.dataset.genres || "")
            .split(",")
            .map(value => value.trim().toLowerCase())
            .filter(Boolean);

        const year = card.dataset.year || "";
        const type = card.dataset.type || "";

        const matchesSearch = title.includes(query);

        // Аніме має містити всі вибрані жанри
        const matchesGenres = genres.every(genre =>
            cardGenres.includes(genre.toLowerCase())
        );

        // Якщо вибрано кілька років або типів,
        // достатньо збігу з одним із них
        const matchesYear =
            years.length === 0 || years.includes(year);

        const matchesType =
            types.length === 0 || types.includes(type);

        const matches =
            matchesSearch &&
            matchesGenres &&
            matchesYear &&
            matchesType;

        card.hidden = !matches;

        if (matches) {
            visibleCards.push(card);
        }
    });

    // Сортування знайдених тайтлів
    visibleCards.sort((a, b) => {
        const titleA = (
            a.dataset.title ||
            a.querySelector(".anime-title")?.textContent ||
            ""
        ).toLocaleLowerCase();

        const titleB = (
            b.dataset.title ||
            b.querySelector(".anime-title")?.textContent ||
            ""
        ).toLocaleLowerCase();

        const yearA = Number(a.dataset.year) || 0;
        const yearB = Number(b.dataset.year) || 0;
        const ratingA = Number(a.dataset.rating) || 0;
        const ratingB = Number(b.dataset.rating) || 0;
        const popularityA = Number(a.dataset.popularity) || 0;
        const popularityB = Number(b.dataset.popularity) || 0;

        switch (sort) {
            case "title-asc":
                return titleA.localeCompare(titleB);

            case "title-desc":
                return titleB.localeCompare(titleA);

            case "year-desc":
                return yearB - yearA;

            case "year-asc":
                return yearA - yearB;

            case "rating-desc":
                return ratingB - ratingA;

            case "popularity-desc":
                return popularityB - popularityA;

            default:
                return 0;
        }
    });

    // Розставити картки у відсортованому порядку
    visibleCards.forEach(card => catalogue.appendChild(card));

    // Показати кількість активних фільтрів
    const activeCount =
        genres.length + years.length + types.length;

    filterCount.textContent = activeCount;
    filterCount.style.display = activeCount > 0 ? "inline-flex" : "none";

    // Повідомлення про результати
    resultsMessage.textContent =
        `Знайдено тайтлів: ${visibleCards.length} із ${cards.length}`;
}

// Пошук працює під час введення тексту
searchInput.addEventListener("input", filterAnime);

// Кнопка пошуку також запускає фільтрацію
searchButton.addEventListener("click", filterAnime);

// Застосувати фільтри
applyFilters.addEventListener("click", () => {
    filterAnime();
    filterOverlay.classList.remove("active");
});

// Зміна сортування застосовується відразу
animeSort.addEventListener("change", filterAnime);

// Скинути всі фільтри
resetFilters.addEventListener("click", () => {
    document.querySelectorAll(
        "#genreOptions input, #yearOptions input, #typeOptions input"
    ).forEach(input => {
        input.checked = false;
    });

    searchInput.value = "";
    animeSort.value = "default";

    filterAnime();
});

// Початкове відображення
filterAnime();
