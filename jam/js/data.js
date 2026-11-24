/* =====================================================
   Дані сайту. Щоб додати аніме — скопіюй будь-який
   блок у ANIME і зміни поля. Обкладинку поклади в
   img/series/. Усе інше (картки, каталог, сторінка
   аніме, плеєр, фільтри) підхопиться саме.

   ВАЖЛИВО: рейтинги, кількість серій і новини нижче —
   демо-значення для верстки, їх треба замінити своїми.
   Поле video — шлях до відеофайлу (наприклад
   "video/dandadan-1.mp4"). Якщо порожнє — плеєр
   показує заглушку.
   ===================================================== */

const ANIME = [
    {
        id: "dandadan",
        title: "Dandadan",
        cover: "img/series/dandadan.jpg",
        hero: "img/dandadan.jpg",
        year: 2024, type: "TV",
        genres: ["Action", "Comedy", "Fantasy"],
        rating: 4.6, popularity: 98,
        seasons: [{ n: 1, episodes: 12 }, { n: 2, episodes: 12 }],
        video: "",
        desc: "Школярка Момо вірить у привидів, а її однокласник Окарун — у інопланетян. Вони сперечаються, хто з них правий, і виявляється, що обидва мають рацію: нечисть та прибульці справжні, і з ними доведеться боротися пліч-о-пліч."
    },
    {
        id: "solo-leveling",
        title: "Solo Leveling",
        cover: "img/series/solo-leveling.jpg",
        year: 2024, type: "TV",
        genres: ["Action", "Fantasy", "Adventure"],
        rating: 4.5, popularity: 95,
        seasons: [{ n: 1, episodes: 12 }, { n: 2, episodes: 13 }],
        video: "",
        desc: "У світі, де в людей відкрилися портали в підземелля, наймолодший і найслабший мисливець Сон Джинву дивом виживає в смертельній пастці та отримує унікальну здатність — підвищувати свій рівень без меж."
    },
    {
        id: "jujutsu-kaisen",
        title: "Jujutsu Kaisen",
        cover: "img/series/jujutsu-kaisen.jpg",
        year: 2020, type: "TV",
        genres: ["Action", "Fantasy", "Horror"],
        rating: 4.7, popularity: 93,
        seasons: [{ n: 1, episodes: 12 }, { n: 2, episodes: 12 }],
        video: "",
        desc: "Школяр Юдзі Ітадорі ковтає проклятий палець могутнього демона Сукуни, щоб урятувати друзів, і потрапляє в світ чаклунів, що полюють на прокляття."
    },
    {
        id: "blue-lock",
        title: "Blue Lock",
        cover: "img/series/blue-lock.jpg",
        year: 2022, type: "TV",
        genres: ["Drama", "Sports"],
        rating: 4.3, popularity: 88,
        seasons: [{ n: 1, episodes: 12 }, { n: 2, episodes: 12 }],
        video: "",
        desc: "Після поразки збірної Японії федерація запускає жорстку програму «Синя в'язниця»: з-поміж сотень нападників має вирости один — найкращий егоїст-форвард світу."
    },
    {
        id: "my-hero-academia",
        title: "My Hero Academia",
        cover: "img/series/my-hero-academia.jpg",
        year: 2016, type: "TV",
        genres: ["Action", "Adventure", "Fantasy"],
        rating: 4.4, popularity: 90,
        seasons: [{ n: 1, episodes: 13 }, { n: 2, episodes: 12 }],
        video: "",
        desc: "У світі, де майже кожен має надздібність, хлопець Ідзуку Мідорія народився без неї. Та зустріч із найбільшим героєм Всемогутнім змінює його долю."
    },
    {
        id: "one-piece",
        title: "One Piece",
        cover: "img/series/one-piece.jpg",
        year: 1999, type: "TV",
        genres: ["Action", "Adventure", "Comedy"],
        rating: 4.8, popularity: 97,
        seasons: [{ n: 1, episodes: 12 }],
        video: "",
        desc: "Монкі Д. Луффі збирає команду піратів і вирушає на пошуки легендарного скарбу One Piece, щоб стати Королем піратів."
    },
    {
        id: "gintama",
        title: "Gintama",
        cover: "img/series/kimono.jpg",
        year: 2006, type: "TV",
        genres: ["Comedy", "Action", "Sci-Fi"],
        rating: 4.7, popularity: 80,
        seasons: [{ n: 1, episodes: 12 }],
        video: "",
        desc: "Альтернативна Японія доби Едо, захоплена прибульцями. Самурай Гінтокі та його незвичайна команда беруться за будь-яку роботу — від безглуздої до небезпечної."
    },
    {
        id: "demon-slayer",
        title: "Demon Slayer",
        cover: "img/series/demon-slayer.jpg",
        year: 2019, type: "TV",
        genres: ["Action", "Fantasy", "Drama"],
        rating: 4.6, popularity: 94,
        seasons: [{ n: 1, episodes: 12 }, { n: 2, episodes: 12 }],
        video: "",
        desc: "Після того, як демон знищив його родину, а сестра Недзуко сама стала демоном, Танджиро Камадо вступає до загону мисливців, щоб помститися й повернути їй людську подобу."
    },
    {
        id: "frieren",
        title: "Frieren",
        cover: "img/series/frieren.jpg",
        year: 2023, type: "TV",
        genres: ["Fantasy", "Adventure", "Drama"],
        rating: 4.9, popularity: 92,
        seasons: [{ n: 1, episodes: 12 }, { n: 2, episodes: 10, soon: true }],
        video: "",
        desc: "Ельфійка-чарівниця Фрірен разом із друзями перемогла Короля демонів, але для неї десятиліття — мить. Коли друзі старіють, вона вирушає в нову подорож, щоб краще зрозуміти людей."
    }
];

/* Жанри: ключ (як у data-атрибутах і фільтрах) → українська назва */
const GENRES = {
    "Action": "Екшн", "Adventure": "Пригоди", "Fantasy": "Фентезі",
    "Romance": "Романтика", "Comedy": "Комедія", "Drama": "Драма",
    "Horror": "Жахи", "Sci-Fi": "Наукова фантастика", "Isekai": "Ісекай",
    "Mystery": "Детектив", "Sports": "Спорт"
};

/* Плитки «Найкращі категорії» на головній */
const CATEGORY_TILES = [
    { genre: "Action",    emoji: "⚔️", grad: "linear-gradient(135deg,#c2410c,#3b1405)" },
    { genre: "Fantasy",   emoji: "🔮", grad: "linear-gradient(135deg,#6d28d9,#1e1145)" },
    { genre: "Romance",   emoji: "💞", grad: "linear-gradient(135deg,#be185d,#3b0a22)" },
    { genre: "Comedy",    emoji: "😂", grad: "linear-gradient(135deg,#ca8a04,#3b2a05)" },
    { genre: "Horror",    emoji: "👁️", grad: "linear-gradient(135deg,#7f1d1d,#1a0707)" },
    { genre: "Sci-Fi",    emoji: "🚀", grad: "linear-gradient(135deg,#0e7490,#06222b)" },
    { genre: "Drama",     emoji: "🎭", grad: "linear-gradient(135deg,#475569,#0f172a)" }
];

/* Новини (демо-текст) */
const NEWS_CATEGORIES = ["Новини", "Анонси", "Українське", "Студії", "Переклади", "Нові сезони", "Фільми", "Серіали", "Манґа", "Ігри"];

const NEWS = [
    { id: 1, cat: "Нові сезони", img: "img/series/frieren.jpg", date: "2026-11-18", title: "Frieren: що відомо про новий сезон", text: "Короткий огляд того, чого чекати від продовження історії ельфійки-чарівниці." },
    { id: 2, cat: "Анонси", img: "img/series/solo-leveling.jpg", date: "2026-11-15", title: "Solo Leveling: нові подробиці про продовження", text: "Розбираємо, які арки історії можуть потрапити в наступні епізоди." },
    { id: 3, cat: "Українське", img: "img/series/one-piece.jpg", date: "2026-11-12", title: "One Piece українською: де дивитися", text: "Підбірка спільнот і студій, які працюють над україномовним озвученням." },
    { id: 4, cat: "Студії", img: "img/series/demon-slayer.jpg", date: "2026-11-10", title: "Як студії працюють над великими екранізаціями", text: "Невеликий огляд процесу — від розкадровки до фінального монтажу." },
    { id: 5, cat: "Фільми", img: "img/series/jujutsu-kaisen.jpg", date: "2026-11-07", title: "Аніме-фільми, які варто побачити на великому екрані", text: "Добірка фільмів за франшизами, які ви вже любите." },
    { id: 6, cat: "Манґа", img: "img/series/my-hero-academia.jpg", date: "2026-11-03", title: "Манґа чи аніме: з чого почати", text: "Плюси й мінуси обох форматів для тих, хто знайомиться з історією." },
    { id: 7, cat: "Серіали", img: "img/series/blue-lock.jpg", date: "2026-10-29", title: "Спортивне аніме: найвідоміші тайтли", text: "Футбол, баскетбол та волейбол у світі аніме." },
    { id: 8, cat: "Ігри", img: "img/series/kimono.jpg", date: "2026-10-25", title: "Ігри за мотивами улюблених аніме", text: "Які франшизи отримали ігрові версії і чи варто в них грати." }
];

/* Досягнення: рахуються з localStorage (див. script.js) */
const ACHIEVEMENTS = [
    { id: "first-ep",   ico: "▶️", title: "Перший епізод", text: "Подивися будь-який епізод", stat: "episodes", goal: 1 },
    { id: "ten-ep",     ico: "🔟", title: "Марафонець",     text: "Подивися 10 епізодів",      stat: "episodes", goal: 10 },
    { id: "rate-3",     ico: "⭐", title: "Критик",         text: "Постав оцінку 3 тайтлам",    stat: "rated",    goal: 3 },
    { id: "fav-3",      ico: "💜", title: "Колекціонер",    text: "Додай 3 тайтли до улюблених", stat: "favs",    goal: 3 },
    { id: "done-1",     ico: "✅", title: "Фініш",          text: "Познач тайтл як переглянутий", stat: "done",   goal: 1 },
    { id: "later-3",    ico: "🕒", title: "Планувальник",   text: "Відклади 3 тайтли «на потім»", stat: "later",  goal: 3 }
];
