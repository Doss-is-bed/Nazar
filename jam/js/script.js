/* =====================================================
   Zenit — скрипти сайту
   Підключається після data.js на кожній сторінці.
   Який код запускати, визначає <body data-page="...">.
   ===================================================== */

/* ---------- Допоміжні функції ---------- */

const $ = (selector, root = document) => root.querySelector(selector);

function esc(value) {
    return String(value).replace(/[&<>"']/g, ch => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
    ));
}

const params = new URLSearchParams(location.search);
const findAnime = id => ANIME.find(a => a.id === id);
const genreName = key => GENRES[key] || key;

/* ---------- Сховище (localStorage) ----------
   Усе, що користувач робить на сайті (улюблене, оцінки,
   перегляди), зберігається в його браузері. Це демо без
   сервера: на іншому пристрої дані не з'являться. */

const STORE_KEY = "zenit-state";

const defaultState = () => ({
    user: null,
    favs: [], later: [], done: [],
    ratings: {},
    watched: {}      // "id:сезон:серія": true
});

function loadState() {
    try {
        return Object.assign(defaultState(), JSON.parse(localStorage.getItem(STORE_KEY)) || {});
    } catch (e) {
        return defaultState();
    }
}

let state = loadState();

function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* приватний режим */ }
}

function toggleInList(list, id) {
    const i = state[list].indexOf(id);
    if (i === -1) state[list].push(id); else state[list].splice(i, 1);
    saveState();
    return i === -1;
}

const inList = (list, id) => state[list].includes(id);

function stats() {
    return {
        episodes: Object.keys(state.watched).length,
        rated: Object.keys(state.ratings).length,
        favs: state.favs.length,
        done: state.done.length,
        later: state.later.length
    };
}

/* ---------- Вікна Login / Sign up ---------- */

const loginModal = $("#loginModal");
const registerModal = $("#registerModal");

function openLogin() {
    if (!loginModal) return;
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
}

function openRegister() {
    if (!registerModal) return;
    registerModal.style.display = "flex";
    loginModal.style.display = "none";
}

function closeLogin() { if (loginModal) loginModal.style.display = "none"; }
function closeRegister() { if (registerModal) registerModal.style.display = "none"; }

document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeLogin(); closeRegister(); }
});

[loginModal, registerModal].forEach(modal => {
    if (modal) modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
});

/* Проста перевірка форм. Справжню авторизацію (паролі, сесії)
   можна зробити лише на сервері — тут тільки запам'ятовуємо ім'я. */

function showError(form, message) {
    $(".form-error", form).textContent = message;
}

const loginForm = $("#loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = $("#login").value.trim();
        const pass = $("#password").value;
        if (!name || !pass) return showError(loginForm, "Заповніть логін і пароль");
        state.user = { name: name.split("@")[0] };
        saveState();
        location.reload();
    });
}

const registerForm = $("#registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = $("#registerLogin").value.trim();
        const pass = $("#registerPassword").value;
        const again = $("#confirmPassword").value;
        if (!name) return showError(registerForm, "Введіть email або логін");
        if (pass.length < 6) return showError(registerForm, "Пароль має містити щонайменше 6 символів");
        if (pass !== again) return showError(registerForm, "Паролі не збігаються");
        state.user = { name: name.split("@")[0] };
        saveState();
        location.reload();
    });
}

function logout() {
    state.user = null;
    saveState();
    location.href = "index.html";
}

/* Блок акаунта внизу сайдбару */
(function renderAccount() {
    const slot = $("#accountSlot");
    if (!slot) return;
    if (state.user) {
        slot.innerHTML = `<a class="account-link" href="profile.html">
            <img src="img/icons/user-icon.jpg" alt="">
            <span>${esc(state.user.name)}</span></a>`;
    } else {
        slot.innerHTML = `<button class="sidebar-button login-button" type="button" onclick="openLogin()">Log in</button>`;
    }
})();

/* Підсвітити поточний пункт меню */
(function markActiveNav() {
    const page = document.body.dataset.nav;
    document.querySelectorAll(".sidebar-button[data-nav]").forEach(link => {
        link.classList.toggle("active", link.dataset.nav === page);
    });
})();

/* ---------- Шаблони ---------- */

function cardHTML(a) {
    return `<a class="anime-card" href="anime.html?id=${esc(a.id)}">
        <span class="poster">
            <img src="${esc(a.cover)}" alt="${esc(a.title)}" loading="lazy">
            <span class="rating">★ ${a.rating.toFixed(1)}</span>
        </span>
        <span class="anime-title">${esc(a.title)}</span>
    </a>`;
}

function renderCards(container, list, emptyHTML) {
    if (!container) return;
    container.innerHTML = list.length
        ? list.map(cardHTML).join("")
        : (emptyHTML || "");
}

function starsText(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
}

/* =====================================================
   ГОЛОВНА
   ===================================================== */

function initHome() {
    const hero = ANIME.find(a => a.id === "dandadan") || ANIME[0];

    $("#heroBg").src = hero.hero || hero.cover;
    $("#heroBg").alt = hero.title;
    $("#heroTitle").textContent = hero.title.toUpperCase();
    $("#heroDesc").textContent = hero.desc;
    $("#heroGenre").textContent = genreName(hero.genres[0]);
    $("#heroWatch").href = `watch.html?id=${hero.id}&s=1&ep=1`;
    $("#heroInfo").href = `anime.html?id=${hero.id}`;

    const later = $("#heroLater");
    const refresh = () => {
        later.classList.toggle("on", inList("later", hero.id));
        later.textContent = inList("later", hero.id) ? "✓ У списку" : "+ Дивитись пізніше";
    };
    later.addEventListener("click", () => { toggleInList("later", hero.id); refresh(); });
    refresh();

    const recs = [...ANIME].sort((a, b) => b.popularity - a.popularity);
    renderCards($("#recsRow"), recs);

    $("#categoryRow").innerHTML = CATEGORY_TILES.map(t =>
        `<a class="category-tile" href="catalogue.html?genre=${encodeURIComponent(t.genre)}"
            style="--g:${t.grad}" data-emoji="${t.emoji}">${esc(genreName(t.genre))}</a>`
    ).join("");
}

/* =====================================================
   КАТАЛОГ (пошук, жанри, фільтри, сортування)
   ===================================================== */

function initCatalogue() {
    const searchInput = $("#animeSearch");
    const searchButton = $("#searchButton");
    const filterOverlay = $("#filterOverlay");
    const animeSort = $("#animeSort");
    const filterCount = $("#filterCount");
    const resultsMessage = $("#resultsMessage");
    const chipBox = $("#genreChips");

    const checks = id => Array.from(document.querySelectorAll(`#${id} input:checked`)).map(i => i.value);

    // Швидкі жанри над сіткою
    chipBox.innerHTML = Object.keys(GENRES).map(key =>
        `<button type="button" class="chip" data-genre="${key}">${esc(GENRES[key])}</button>`
    ).join("");

    function syncChips() {
        const selected = checks("genreOptions");
        chipBox.querySelectorAll(".chip").forEach(chip =>
            chip.classList.toggle("active", selected.includes(chip.dataset.genre)));
    }

    chipBox.addEventListener("click", event => {
        const chip = event.target.closest(".chip");
        if (!chip) return;
        const box = $(`#genreOptions input[value="${chip.dataset.genre}"]`);
        if (box) box.checked = !box.checked;
        filterAnime();
    });

    function filterAnime() {
        const query = searchInput.value.trim().toLocaleLowerCase();
        const genres = checks("genreOptions");
        const years = checks("yearOptions");
        const types = checks("typeOptions");

        const list = ANIME.filter(a =>
            a.title.toLocaleLowerCase().includes(query) &&
            genres.every(g => a.genres.includes(g)) &&
            (!years.length || years.includes(String(a.year))) &&
            (!types.length || types.includes(a.type))
        );

        switch (animeSort.value) {
            case "title-asc":       list.sort((a, b) => a.title.localeCompare(b.title)); break;
            case "title-desc":      list.sort((a, b) => b.title.localeCompare(a.title)); break;
            case "year-desc":       list.sort((a, b) => b.year - a.year); break;
            case "year-asc":        list.sort((a, b) => a.year - b.year); break;
            case "rating-desc":     list.sort((a, b) => b.rating - a.rating); break;
            case "popularity-desc": list.sort((a, b) => b.popularity - a.popularity); break;
        }

        const popular = [...list].sort((a, b) => b.popularity - a.popularity).slice(0, 7);
        const empty = `<div class="empty-state">Нічого не знайдено. Спробуйте змінити пошуковий запит або скинути фільтри.</div>`;

        $("#popularSection").hidden = list.length === 0;
        renderCards($("#popularRow"), popular);
        renderCards($("#animeGrid"), list, empty);

        const active = genres.length + years.length + types.length;
        filterCount.textContent = active;
        filterCount.style.display = active ? "inline-flex" : "none";
        resultsMessage.textContent = `Знайдено тайтлів: ${list.length} із ${ANIME.length}`;
        syncChips();
    }

    // Вікно фільтрів
    $("#openFilters").addEventListener("click", () => filterOverlay.classList.add("active"));
    $("#closeFilters").addEventListener("click", () => filterOverlay.classList.remove("active"));
    filterOverlay.addEventListener("click", e => { if (e.target === filterOverlay) filterOverlay.classList.remove("active"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") filterOverlay.classList.remove("active"); });

    $("#applyFilters").addEventListener("click", () => { filterAnime(); filterOverlay.classList.remove("active"); });

    $("#resetFilters").addEventListener("click", () => {
        document.querySelectorAll("#genreOptions input, #yearOptions input, #typeOptions input")
            .forEach(input => { input.checked = false; });
        searchInput.value = "";
        animeSort.value = "default";
        filterAnime();
    });

    searchInput.addEventListener("input", filterAnime);
    searchButton.addEventListener("click", filterAnime);
    animeSort.addEventListener("change", filterAnime);

    // Параметри з посилань: catalogue.html?genre=Action&q=blue
    const genre = params.get("genre");
    if (genre) {
        const box = $(`#genreOptions input[value="${CSS.escape(genre)}"]`);
        if (box) box.checked = true;
    }
    if (params.get("q")) searchInput.value = params.get("q");

    filterAnime();
}

/* =====================================================
   СТОРІНКА АНІМЕ
   ===================================================== */

function notFound(container) {
    container.innerHTML = `<div class="detail-inner"><div class="empty-state">
        Такого тайтлу не знайдено. <a href="catalogue.html">Повернутися до каталогу</a></div></div>`;
}

function initAnime() {
    const root = $("#detailRoot");
    const a = findAnime(params.get("id"));
    if (!a) return notFound(root);

    document.title = `${a.title} — Zenit`;
    $("#detailBg").style.backgroundImage = `url("${a.hero || a.cover}")`;
    $("#crumbTitle").textContent = a.title;
    $("#animeTitle").textContent = a.title;

    const totalEps = a.seasons.filter(s => !s.soon).reduce((sum, s) => sum + s.episodes, 0);
    $("#animeMeta").textContent =
        `${a.year} · ${a.type} · ${a.seasons.filter(s => !s.soon).length} сез. · ${totalEps} еп.`;

    $("#animeDesc").textContent = a.desc;

    // Зірки: клік ставить оцінку, повторний клік на ту саму — скидає
    const starBox = $("#stars");
    const note = $("#ratingNote");

    function drawStars() {
        const mine = state.ratings[a.id] || 0;
        const shown = mine || Math.round(a.rating);
        starBox.innerHTML = [1, 2, 3, 4, 5].map(n =>
            `<button type="button" class="${n <= shown ? "on" : ""}" data-n="${n}" aria-label="Оцінка ${n}">★</button>`
        ).join("");
        note.textContent = mine
            ? `Ваша оцінка: ${mine} · рейтинг сайту ${a.rating.toFixed(1)}`
            : `Рейтинг сайту ${a.rating.toFixed(1)} · натисніть, щоб оцінити`;
    }

    starBox.addEventListener("click", event => {
        const btn = event.target.closest("button");
        if (!btn) return;
        const n = Number(btn.dataset.n);
        if (state.ratings[a.id] === n) delete state.ratings[a.id]; else state.ratings[a.id] = n;
        saveState();
        drawStars();
    });
    drawStars();

    // Статуси
    const statuses = [
        { list: "later", off: "🕒 Дивитись пізніше", on: "✓ Відкладено" },
        { list: "favs",  off: "♡ В улюблене",        on: "♥ В улюбленому" },
        { list: "done",  off: "○ Переглянуто",       on: "● Переглянуто" }
    ];
    const statusRow = $("#statusRow");
    statusRow.innerHTML = statuses.map(s => `<button type="button" class="status-btn" data-list="${s.list}"></button>`).join("");

    function drawStatuses() {
        statuses.forEach(s => {
            const btn = $(`[data-list="${s.list}"]`, statusRow);
            btn.classList.toggle("on", inList(s.list, a.id));
            btn.textContent = inList(s.list, a.id) ? s.on : s.off;
        });
    }
    statusRow.addEventListener("click", event => {
        const btn = event.target.closest("button");
        if (!btn) return;
        toggleInList(btn.dataset.list, a.id);
        drawStatuses();
    });
    drawStatuses();

    // Кнопка «Дивитись»
    const firstSeason = a.seasons.find(s => !s.soon) || a.seasons[0];
    $("#watchNow").href = `watch.html?id=${a.id}&s=${firstSeason.n}&ep=1`;

    // Сезони
    $("#seasons").innerHTML = a.seasons.map(s => s.soon
        ? `<div class="season-card soon"><span class="thumb"><b>🕒</b>Незабаром</span><span class="name">Сезон ${s.n}</span></div>`
        : `<a class="season-card" href="watch.html?id=${esc(a.id)}&s=${s.n}&ep=1">
               <span class="thumb"><img src="${esc(a.cover)}" alt=""></span>
               <span class="name">Сезон ${s.n}</span></a>`
    ).join("");

    // Жанри
    $("#genreRow").innerHTML = a.genres.map(g =>
        `<a class="genre-tag" href="catalogue.html?genre=${encodeURIComponent(g)}">${esc(genreName(g))}</a>`
    ).join("");

    // Схожі
    const similar = ANIME.filter(x => x.id !== a.id && x.genres.some(g => a.genres.includes(g))).slice(0, 7);
    renderCards($("#similarRow"), similar);
    $("#similarSection").hidden = !similar.length;
}

/* =====================================================
   ПЛЕЄР
   ===================================================== */

function initWatch() {
    const root = $("#detailRoot");
    const a = findAnime(params.get("id"));
    if (!a) return notFound(root);

    const playable = a.seasons.filter(s => !s.soon);
    const season = playable.find(s => s.n === Number(params.get("s"))) || playable[0];
    const ep = Math.min(Math.max(Number(params.get("ep")) || 1, 1), season.episodes);
    const key = n => `${a.id}:${season.n}:${n}`;
    const link = (s, n) => `watch.html?id=${a.id}&s=${s}&ep=${n}`;

    document.title = `${a.title} · епізод ${ep} — Zenit`;
    $("#detailBg").style.backgroundImage = `url("${a.hero || a.cover}")`;
    $("#crumbTitle").textContent = a.title;
    $("#crumbTitle").href = `anime.html?id=${a.id}`;
    $("#animeTitle").textContent = a.title;
    $("#animeMeta").innerHTML = `Сезон ${season.n}<br>${season.episodes} епізодів`;
    $("#animeDesc").textContent = a.desc;
    $("#playerBadge").textContent = `Епізод ${ep}`;

    // Відео або заглушка
    const player = $("#player");
    if (a.video) {
        const video = document.createElement("video");
        video.src = a.video;
        video.poster = a.hero || a.cover;
        video.controls = true;
        video.preload = "metadata";
        video.addEventListener("play", () => markSeen(true));
        video.addEventListener("ended", () => { if (ep < season.episodes) location.href = link(season.n, ep + 1); });
        player.prepend(video);
        $("#playerOverlay").remove();
    } else {
        $("#playerPoster").src = a.hero || a.cover;
        $("#playerMsg").innerHTML = "<b style=\"font-size:34px\">▶</b><br>Відео для цього епізоду ще не додано";
    }

    // Позначка «переглянуто»
    const seenBtn = $("#seenBtn");
    function drawSeen() {
        const seen = !!state.watched[key(ep)];
        seenBtn.textContent = seen ? "✓ Переглянуто" : "Позначити переглянутим";
        drawEpisodes();
    }
    function markSeen(force) {
        if (force) state.watched[key(ep)] = true;
        else if (state.watched[key(ep)]) delete state.watched[key(ep)];
        else state.watched[key(ep)] = true;
        saveState();
        drawSeen();
    }
    seenBtn.addEventListener("click", () => markSeen(false));

    // Попередній / наступний
    const prev = $("#prevEp"), next = $("#nextEp");
    prev.href = link(season.n, ep - 1);
    next.href = link(season.n, ep + 1);
    prev.classList.toggle("disabled", ep <= 1);
    next.classList.toggle("disabled", ep >= season.episodes);

    // Список епізодів
    function drawEpisodes() {
        let html = "";
        for (let n = 1; n <= season.episodes; n++) {
            html += `<a class="episode ${n === ep ? "current" : ""}" href="${link(season.n, n)}">
                <img src="${esc(a.cover)}" alt="">
                ${state.watched[key(n)] ? '<i class="seen">✓</i>' : ""}
                <span>Епізод ${n}</span></a>`;
        }
        $("#episodes").innerHTML = html;
        const cur = $(".episode.current");
        if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
    }

    // Перемикач сезонів
    $("#seasonTabs").innerHTML = playable.length > 1
        ? playable.map(s => `<a class="tab ${s.n === season.n ? "active" : ""}" href="${link(s.n, 1)}">Сезон ${s.n}</a>`).join("")
        : "";

    drawSeen();
}

/* =====================================================
   НОВИНИ
   ===================================================== */

function initNews() {
    const catBox = $("#newsCats");
    let active = "all";

    catBox.innerHTML = `<button type="button" data-cat="all" class="active">Усі</button>` +
        NEWS_CATEGORIES.map(c => `<button type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

    const fmt = iso => new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

    function draw() {
        const list = NEWS.filter(n => active === "all" || n.cat === active)
                         .sort((x, y) => y.date.localeCompare(x.date));

        const main = $("#mainNews");
        if (!list.length) {
            main.hidden = true;
            $("#newsCards").innerHTML = `<div class="empty-state">У цій категорії поки немає новин.</div>`;
            return;
        }

        const [top, ...rest] = list;
        main.hidden = false;
        $(".bg", main).style.backgroundImage = `url("${top.img}")`;
        $(".tag", main).textContent = top.cat;
        $("h2", main).textContent = top.title;
        $("p", main).textContent = top.text;

        $("#newsCards").innerHTML = rest.map(n => `<article class="news-card">
            <img src="${esc(n.img)}" alt="">
            <div class="body"><span class="tag">${esc(n.cat)}</span>
            <h3>${esc(n.title)}</h3><p>${esc(n.text)}</p>
            <time datetime="${n.date}">${fmt(n.date)}</time></div></article>`).join("");
    }

    catBox.addEventListener("click", event => {
        const btn = event.target.closest("button");
        if (!btn) return;
        active = btn.dataset.cat;
        catBox.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
        draw();
    });
    draw();
}

/* =====================================================
   «REVIEWED» — мої списки
   ===================================================== */

function initList() {
    const tabs = [
        { key: "done",    label: "Переглянуте" },
        { key: "ratings", label: "Мої оцінки" },
        { key: "favs",    label: "Улюблене" },
        { key: "later",   label: "Дивитись пізніше" }
    ];
    let active = ["done", "ratings", "favs", "later"].includes(params.get("tab")) ? params.get("tab") : "done";

    const tabBox = $("#listTabs");
    const out = $("#listOut");

    function draw() {
        const counts = {
            done: state.done.length, ratings: Object.keys(state.ratings).length,
            favs: state.favs.length, later: state.later.length
        };
        tabBox.innerHTML = tabs.map(t =>
            `<button type="button" class="tab ${t.key === active ? "active" : ""}" data-key="${t.key}">${t.label} · ${counts[t.key]}</button>`
        ).join("");

        const empty = `<div class="empty-state">Тут поки порожньо. Перегляньте <a href="catalogue.html">каталог</a> і додайте тайтли.</div>`;

        if (active === "ratings") {
            const rows = Object.entries(state.ratings)
                .map(([id, n]) => ({ a: findAnime(id), n }))
                .filter(r => r.a)
                .sort((x, y) => y.n - x.n);
            out.className = "review-list";
            out.innerHTML = rows.length ? rows.map(({ a, n }) => `
                <a class="review-item" href="anime.html?id=${esc(a.id)}">
                    <img src="${esc(a.cover)}" alt="">
                    <div class="t">${esc(a.title)}<small>${a.genres.map(genreName).join(", ")}</small></div>
                    <div class="s">${starsText(n)}</div></a>`).join("") : empty;
        } else {
            const list = state[active].map(findAnime).filter(Boolean);
            out.className = "anime-grid";
            renderCards(out, list, empty);
            if (!list.length) out.className = "";
        }
    }

    tabBox.addEventListener("click", event => {
        const btn = event.target.closest("button");
        if (!btn) return;
        active = btn.dataset.key;
        draw();
    });
    draw();
}

/* =====================================================
   ПРОФІЛЬ / ДОСЯГНЕННЯ / НАГОРОДИ
   ===================================================== */

function initProfile() {
    if (!state.user) {
        $("#profileRoot").innerHTML = `<div class="empty-state">Ви не увійшли в акаунт.
            <a href="#" onclick="openLogin(); return false;">Увійти</a> або
            <a href="#" onclick="openRegister(); return false;">створити акаунт</a>.</div>`;
        return;
    }

    $("#profileName").textContent = state.user.name;
    const s = stats();
    const ratings = Object.values(state.ratings);
    const avg = ratings.length ? (ratings.reduce((x, y) => x + y, 0) / ratings.length).toFixed(1) : "—";

    $("#statsRow").innerHTML = [
        [s.episodes, "переглянутих епізодів"],
        [s.done, "переглянутих тайтлів"],
        [s.favs, "в улюбленому"],
        [avg, "середня оцінка"]
    ].map(([n, label]) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`).join("");

    const favs = state.favs.map(findAnime).filter(Boolean);
    renderCards($("#profileFavs"), favs,
        `<div class="empty-state" style="flex:1">Улюблених поки немає.</div>`);

    $("#logoutBtn").addEventListener("click", logout);
}

function initAchievements() {
    const s = stats();
    $("#badges").innerHTML = ACHIEVEMENTS.map(item => {
        const value = Math.min(s[item.stat], item.goal);
        const done = value >= item.goal;
        return `<div class="badge-card ${done ? "done" : ""}">
            <div class="ico">${item.ico}</div>
            <div style="flex:1"><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p>
            <div class="bar"><i style="width:${value / item.goal * 100}%"></i></div>
            <p style="margin:6px 0 0">${value} / ${item.goal}${done ? " · отримано" : ""}</p></div></div>`;
    }).join("");
}

function initAwards() {
    const top = [...ANIME].sort((a, b) => b.rating - a.rating).slice(0, 3);
    const medals = ["🥇", "🥈", "🥉"];
    // Порядок на подіумі: 2-ге, 1-ше, 3-тє
    const order = [1, 0, 2].filter(i => top[i]);
    $("#podium").innerHTML = order.map(i => `
        <a class="place p${i + 1}" href="anime.html?id=${esc(top[i].id)}">
            <img src="${esc(top[i].cover)}" alt="${esc(top[i].title)}">
            <span class="medal">${medals[i]}</span>${esc(top[i].title)}
            <br><small>★ ${top[i].rating.toFixed(1)}</small></a>`).join("");

    const popular = [...ANIME].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
    $("#popularList").innerHTML = popular.map((a, i) => `
        <a class="review-item" href="anime.html?id=${esc(a.id)}">
            <img src="${esc(a.cover)}" alt="">
            <div class="t">${i + 1}. ${esc(a.title)}<small>${a.genres.map(genreName).join(", ")}</small></div>
            <div class="s">★ ${a.rating.toFixed(1)}</div></a>`).join("");
}

/* ---------- Запуск потрібного коду ---------- */

const pages = {
    home: initHome, catalogue: initCatalogue, anime: initAnime, watch: initWatch,
    news: initNews, list: initList, profile: initProfile,
    achievements: initAchievements, awards: initAwards
};

const page = document.body.dataset.page;
if (pages[page]) pages[page]();
// Профіль ділить розмітку з досягненнями та нагородами
if (page === "achievements" || page === "awards") {
    const logoutBtn = $("#logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
}
