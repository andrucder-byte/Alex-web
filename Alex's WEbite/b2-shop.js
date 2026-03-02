const B2_STORE_KEY = "b2StoreState";

const defaultB2State = {
    coins: 0,
    unlockedAvatars: ["Iphone"],
    unlockedThemes: ["default"],
    selectedAvatar: "Iphone",
    selectedTheme: "default",
    rewards: {
        quakePerfect: false,
        drivePerfect: false
    }
};

const avatarItems = [
    {
        id: "Iphone",
        label: "Iphone",
        emoji: "📱",
        cost: 0
    },
    {
        id: "Bedtime",
        label: "Bed",
        emoji: "🛏",
        cost: 5
    },
    {
        id: "rocket",
        label: "Rocket",
        emoji: "🚀",
        cost: 8
    }
];

const themeItems = [
    {
        id: "default",
        label: "Default",
        cost: 0
    },
    {
        id: "sunset",
        label: "Sunset",
        cost: 6
    },
    {
        id: "ocean",
        label: "Ocean",
        cost: 7
    }
];

let b2State = loadB2State();

function cloneDefaultB2State() {
    return JSON.parse(JSON.stringify(defaultB2State));
}

function loadB2State() {
    try {
        const raw = localStorage.getItem(B2_STORE_KEY);
        if (!raw) {
            return cloneDefaultB2State();
        }

        const parsed = JSON.parse(raw);
        const merged = {
            ...cloneDefaultB2State(),
            ...parsed,
            unlockedAvatars: Array.isArray(parsed.unlockedAvatars) && parsed.unlockedAvatars.length
                ? parsed.unlockedAvatars
                : ["Iphone"],
            unlockedThemes: Array.isArray(parsed.unlockedThemes) && parsed.unlockedThemes.length
                ? parsed.unlockedThemes
                : ["default"],
            rewards: {
                ...defaultB2State.rewards,
                ...(parsed.rewards || {})
            }
        };

        if (!avatarItems.some((item) => item.id === merged.selectedAvatar)) {
            merged.selectedAvatar = "Iphone";
        }
        if (!themeItems.some((item) => item.id === merged.selectedTheme)) {
            merged.selectedTheme = "default";
        }
        if (!merged.unlockedAvatars.includes(merged.selectedAvatar)) {
            merged.unlockedAvatars.push(merged.selectedAvatar);
        }
        if (!merged.unlockedThemes.includes(merged.selectedTheme)) {
            merged.unlockedThemes.push(merged.selectedTheme);
        }

        return merged;
    } catch {
        return cloneDefaultB2State();
    }
}

function saveB2State() {
    localStorage.setItem(B2_STORE_KEY, JSON.stringify(b2State));
}

function getAvatarById(id) {
    return avatarItems.find((item) => item.id === id) || avatarItems[0];
}

function applyTheme(themeId) {
    document.body.classList.remove("theme-default", "theme-sunset", "theme-ocean");
    document.body.classList.add(`theme-${themeId}`);
}

function renderStoreView() {
    const coinsEl = document.getElementById("b2-coins");
    const avatarEl = document.getElementById("b2-avatar");
    const avatarsWrap = document.getElementById("b2-avatar-list");
    const themesWrap = document.getElementById("b2-theme-list");

    if (!coinsEl || !avatarEl || !avatarsWrap || !themesWrap) {
        return;
    }

    coinsEl.textContent = String(b2State.coins);
    avatarEl.textContent = getAvatarById(b2State.selectedAvatar).emoji;
    applyTheme(b2State.selectedTheme);

    avatarsWrap.innerHTML = "";
    avatarItems.forEach((item) => {
        const unlocked = b2State.unlockedAvatars.includes(item.id);
        const selected = b2State.selectedAvatar === item.id;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "shop-item-btn";

        if (selected) {
            btn.textContent = `${item.emoji} ${item.label} (Using)`;
            btn.disabled = true;
        } else if (unlocked) {
            btn.textContent = `${item.emoji} ${item.label} (Use)`;
            btn.addEventListener("click", () => {
                b2State.selectedAvatar = item.id;
                saveB2State();
                renderStoreView();
            });
        } else {
            btn.textContent = `${item.emoji} ${item.label} (${item.cost} B2)`;
            btn.disabled = b2State.coins < item.cost;
            btn.addEventListener("click", () => {
                if (b2State.coins < item.cost) {
                    return;
                }
                b2State.coins -= item.cost;
                b2State.unlockedAvatars.push(item.id);
                b2State.selectedAvatar = item.id;
                saveB2State();
                renderStoreView();
            });
        }

        avatarsWrap.appendChild(btn);
    });

    themesWrap.innerHTML = "";
    themeItems.forEach((item) => {
        const unlocked = b2State.unlockedThemes.includes(item.id);
        const selected = b2State.selectedTheme === item.id;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "shop-item-btn";

        if (selected) {
            btn.textContent = `${item.label} (Using)`;
            btn.disabled = true;
        } else if (unlocked) {
            btn.textContent = `${item.label} (Use)`;
            btn.addEventListener("click", () => {
                b2State.selectedTheme = item.id;
                saveB2State();
                renderStoreView();
            });
        } else {
            btn.textContent = `${item.label} (${item.cost} B2)`;
            btn.disabled = b2State.coins < item.cost;
            btn.addEventListener("click", () => {
                if (b2State.coins < item.cost) {
                    return;
                }
                b2State.coins -= item.cost;
                b2State.unlockedThemes.push(item.id);
                b2State.selectedTheme = item.id;
                saveB2State();
                renderStoreView();
            });
        }

        themesWrap.appendChild(btn);
    });
}

function createStoreUi() {
    const hud = document.createElement("div");
    hud.className = "b2-hud";
    hud.innerHTML = `
        <div class="b2-avatar" id="b2-avatar" aria-hidden="true"></div>
        <div class="b2-balance">Golden Coins 🪙: <strong id="b2-coins">0</strong></div>
        <button class="b2-shop-toggle" id="b2-shop-toggle" type="button">Shop</button>
    `;

    const panel = document.createElement("section");
    panel.className = "b2-shop-panel";
    panel.id = "b2-shop-panel";
    panel.hidden = true;
    panel.innerHTML = `
        <h3>B2 Shop</h3>
        <p>Earn +5 B2 by getting 3/3 on each quiz.</p>
        <h4>Profile Pictures</h4>
        <div class="shop-list" id="b2-avatar-list"></div>
        <h4>Background Themes</h4>
        <div class="shop-list" id="b2-theme-list"></div>
    `;

    document.body.appendChild(hud);
    document.body.appendChild(panel);

    const toggleBtn = document.getElementById("b2-shop-toggle");
    toggleBtn.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
    });

    renderStoreView();
}

function awardB2ForPerfectQuiz(quizKey, score, totalQuestions) {
    if (!quizKey || totalQuestions <= 0) {
        return;
    }

    const isPerfect = score === totalQuestions;

    if (!isPerfect) {
        return;
    }

    b2State.coins += 5;
    saveB2State();
    renderStoreView();
}

window.b2AwardForPerfectQuiz = awardB2ForPerfectQuiz;

createStoreUi();
