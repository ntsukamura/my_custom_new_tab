console.log("New Tab Extension Loaded");

// --- Constants & Config ---
const STORAGE_KEY = 'user_links';
const SETTINGS_KEY = 'user_settings';

const DEFAULT_LINKS = [
    {
        id: 'default-1',
        title: 'YouTube',
        url: 'https://www.youtube.com',
        imageUrl: ''
    },
    {
        id: 'default-2',
        title: 'Google',
        url: 'https://www.google.com',
        imageUrl: ''
    }
];

const DEFAULT_SETTINGS = {
    patterns: [
        { c1: '#0061ff', c2: '#60efff' }, // Pattern 1 (Vivid Blue)
        { c1: '#fcd34d', c2: '#fdba74' }, // Pattern 2 (Pale Yellow)
        { c1: '#10b981', c2: '#06b6d4' }  // Pattern 3
    ],
    language: 'ja',
    bgColor: 'darkslategray',
    iconImage: '',
    titleGradientStart: '#ffffff',
    titleGradientEnd: '#94a3b8'
};

// Language translations
const translations = {
    ja: {
        'settings-title': 'テーマ設定',
        'language-label': '言語',
        'lang-ja': '日本語',
        'lang-en': 'English',
        'bg-color-label': '背景色',
        'icon-image-label': 'アイコン画像',
        'icon-image-placeholder': '画像を選択してください',
        'icon-image-hint': '参照ボタンから画像を選択してください（最大5MB）',
        'title-color-label': 'タイトル文字色',
        'title-color-start': '開始色',
        'title-color-end': '終了色',

        'custom-bookmarks': 'カスタマイズ ブックマークカード',
        'recent-history': 'あなたの閲覧履歴：ランダム5件',
        'random-bookmarks': 'あなたのブックマーク：ランダム5件',

        'pattern-colors-label': 'カードパターンカラー',
        'pattern-1': 'パターン 1',
        'pattern-2': 'パターン 2',
        'pattern-3': 'パターン 3',
        'close': '閉じる',
        'save': '保存',
        'search-placeholder': 'ブックマークを検索...',
        'add-shortcut': 'ショートカットを追加',
        'edit-shortcut': 'ショートカットを編集',
        'title-label': 'タイトル',
        'url-label': 'URL',
        'image-label': '画像 (Optional)',
        'pattern-label': '背景パターン',
        'cancel': 'キャンセル',
        'open': '開く',
        'add-to-carousel': 'カルーセルに追加',
        'select-image': '画像を選択',
        'reset': 'デフォルトに戻す',
        'reset-confirm': '設定を初期状態に戻しますか？',
        'image-selected': '画像が選択されました (保存後に反映)',
        'image-set': '画像が設定されています',
        'compressing': '圧縮中...',
        'browse': '参照',
        'image-file-error': '画像ファイルを選択してください',
        'image-size-error': '画像ファイルが大きすぎます（最大5MB）',
        'image-process-error': '画像の処理に失敗しました'
    },
    en: {
        'settings-title': 'Theme Settings',
        'language-label': 'Language',
        'lang-ja': '日本語',
        'lang-en': 'English',
        'bg-color-label': 'Background Color (Gradient)',
        'bg-color-start': 'Start Color',
        'bg-color-end': 'End Color',
        'icon-image-label': 'Icon Image',
        'icon-image-placeholder': 'Select an image',
        'icon-image-hint': 'Please select an image using the Browse button (max 5MB)',
        'title-color-label': 'Title Text Color',
        'title-color-start': 'Start Color',
        'title-color-end': 'End Color',

        'custom-bookmarks': 'Custom Bookmark Cards',
        'recent-history': 'Your Recent History (Random 5)',
        'random-bookmarks': 'Your Bookmarks (Random 5)',

        'pattern-colors-label': 'Card Pattern Colors',
        'pattern-1': 'Pattern 1',
        'pattern-2': 'Pattern 2',
        'pattern-3': 'Pattern 3',
        'close': 'Close',
        'save': 'Save',
        'search-placeholder': 'Search bookmarks...',
        'add-shortcut': 'Add Shortcut',
        'edit-shortcut': 'Edit Shortcut',
        'title-label': 'Title',
        'url-label': 'URL',
        'image-label': 'Image (Optional)',
        'pattern-label': 'Background Pattern',
        'cancel': 'Cancel',
        'open': 'Open',
        'add-to-carousel': 'Add to Carousel',
        'select-image': 'Select Image',
        'browse': 'Browse',
        'reset': 'Restore Default',
        'reset-confirm': 'Reset settings to default?',
        'image-selected': 'Image selected (will apply after saving)',
        'image-set': 'Image is set',
        'compressing': 'Compressing...',
        'image-file-error': 'Please select an image file',
        'image-size-error': 'Image file is too large (max 5MB)',
        'image-process-error': 'Failed to process image'
    }
};

// --- DOM Elements ---
let dateDisplay, modal, modalTitle, cancelBtn, linkForm, carouselContainer, carousel, addCardTrigger;
let settingsModal, settingsTrigger, settingsCloseBtn, settingsSaveBtn;
let inputTitle, inputUrl, urlSuggestionsList, titleSuggestionsList, patternOptions;
let imageFileInput, imageUploadBtn, imagePreviewContainer, imagePreview, imageRemoveBtn;
let bookmarkSearchInput, searchSuggestions;

function initDOMElements() {
    dateDisplay = document.getElementById('date-display');
    modal = document.getElementById('modal');
    modalTitle = modal ? modal.querySelector('h2') : null;
    cancelBtn = document.getElementById('cancel-btn');
    linkForm = document.getElementById('link-form');
    carouselContainer = document.querySelector('.carousel-container');
    carousel = document.getElementById('link-carousel');
    addCardTrigger = document.querySelector('.add-card-trigger');
    settingsModal = document.getElementById('settings-modal');
    settingsTrigger = document.getElementById('settings-trigger');
    settingsCloseBtn = document.getElementById('settings-close-btn');
    settingsSaveBtn = document.getElementById('settings-save-btn');
    settingsResetBtn = document.getElementById('settings-reset-btn');
    inputTitle = document.getElementById('link-title');
    inputUrl = document.getElementById('link-url');
    urlSuggestionsList = document.getElementById('url-suggestions');
    titleSuggestionsList = document.getElementById('title-suggestions');
    patternOptions = document.querySelectorAll('.pattern-option');
    imageFileInput = document.getElementById('link-image-file');
    imageUploadBtn = document.getElementById('image-upload-btn');
    imagePreviewContainer = document.getElementById('image-preview-container');
    imagePreview = document.getElementById('image-preview');
    imageRemoveBtn = document.getElementById('image-remove-btn');
    bookmarkSearchInput = document.getElementById('bookmark-search');
    searchSuggestions = document.getElementById('search-suggestions');
    langButtons = document.querySelectorAll('.lang-btn');
    bgColorInput = document.getElementById('bg-color-input');
    iconImageInput = document.getElementById('icon-image-input');
    iconImageFileInput = document.getElementById('icon-image-file-input');
    iconImageBrowseBtn = document.getElementById('icon-image-browse-btn');
    titleColorStartInput = document.getElementById('title-color-start');
    titleColorEndInput = document.getElementById('title-color-end');


    headerIcon = document.getElementById('header-icon');
}

// State
let editingId = null; // ID of the link currently being edited
let selectedPattern = 'card-bg-1'; // Default pattern selection
let currentImageData = null; // Current image data (Base64 or URL)
// Temporary state for settings images (before save)
let settingsIconImageData = null;

// --- Helper: Get Settings with Priority ---
async function getSettings() {
    // Try to get from local storage first (prioritize local as it holds richer data like images)
    let settings = await Storage.get(SETTINGS_KEY, true);
    if (!settings) {
        // Fallback to sync storage
        settings = await Storage.get(SETTINGS_KEY, false);
    }
    return settings || DEFAULT_SETTINGS;
}

// --- Storage Wrapper (Chrome + LocalStorage Fallback) ---
const Storage = {
    get: async (key, useLocal = false) => {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const storage = useLocal ? chrome.storage.local : chrome.storage.sync;
                storage.get([key], (result) => {
                    if (chrome.runtime.lastError) {
                        console.error('Storage get error:', chrome.runtime.lastError);
                        resolve(null);
                    } else {
                        resolve(result[key]);
                    }
                });
            } else {
                const data = localStorage.getItem(key);
                resolve(data ? JSON.parse(data) : null);
            }
        });
    },
    set: async (key, value, useLocal = false) => {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                // Determine which storage to use
                const targetStorage = useLocal ? chrome.storage.local : chrome.storage.sync;
                const unusedStorage = useLocal ? chrome.storage.sync : chrome.storage.local;

                // Save to target storage
                targetStorage.set({ [key]: value }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Storage set error:', chrome.runtime.lastError);
                    }

                    // Remove from unused storage to prevent conflicts (Split Brain)
                    unusedStorage.remove(key, () => {
                        resolve();
                    });
                });
            } else {
                localStorage.setItem(key, JSON.stringify(value));
                resolve();
            }
        });
    }
};

// --- Initialization ---
let isInitialized = false;

async function init() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.warn('Init already called, skipping...');
        return;
    }

    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    initDOMElements();

    if (!dateDisplay || !modal || !carousel || !carouselContainer) {
        console.error('Required DOM elements not found:', {
            dateDisplay: !!dateDisplay,
            modal: !!modal,
            carousel: !!carousel,
            carouselContainer: !!carouselContainer
        });
        return;
    }

    isInitialized = true;

    await loadSettings();
    // Apply background settings immediately after loading

    await applyIconImage();
    updateDate();
    await applyThemeSettings(); // Load and apply patterns
    setupEventListeners();
    setupCarouselDrag();
    setupBookmarkSearch();
    await renderLinks();
    await renderHistoryCarousel();
    await renderBookmarkCarousel();
}

// --- Date Logic ---
function updateDate() {
    // Re-check dateDisplay in case it wasn't initialized
    if (!dateDisplay) {
        dateDisplay = document.getElementById('date-display');
    }

    if (!dateDisplay) {
        console.warn('dateDisplay element not found');
        return;
    }

    try {
        const now = new Date();
        // Format based on current language
        const locale = currentLanguage === 'ja' ? 'ja-JP' : 'en-US';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };
        let dateStr = now.toLocaleDateString(locale, options);

        // For Japanese, replace / with .
        if (currentLanguage === 'ja') {
            dateStr = dateStr.replace(/\//g, '.');
        }

        dateDisplay.textContent = dateStr;
    } catch (error) {
        console.error('Error updating date:', error);
    }
}

// --- Theme Settings Logic ---
async function loadSettings() {
    const settings = await getSettings();

    // Set current language
    currentLanguage = settings.language || 'ja';
    applyLanguage(currentLanguage);

    // Load background color settings
    if (bgColorInput) {
        // Convert color name to hex if needed
        const bgColor = settings.bgColor || DEFAULT_SETTINGS.bgColor;
        if (bgColor === 'darkslategray') {
            bgColorInput.value = '#2f4f4f';
        } else {
            bgColorInput.value = bgColor;
        }
    }

    // Load title gradient colors
    if (titleColorStartInput && titleColorEndInput) {
        titleColorStartInput.value = settings.titleGradientStart || DEFAULT_SETTINGS.titleGradientStart;
        titleColorEndInput.value = settings.titleGradientEnd || DEFAULT_SETTINGS.titleGradientEnd;
    }
    // Note: We'll update the input values when language changes, not here
    // The actual image data is stored separately, we just show a placeholder
    const t = translations[currentLanguage] || translations.ja;

    if (iconImageInput) {
        iconImageInput.value = settings.iconImage ? t['image-set'] : '';
    }


    // Apply icon image (will be called after settings are loaded)
    // Note: applyIconImage is async, but we don't await here to avoid blocking
    applyIconImage().catch(err => console.error('Error applying icon image:', err));

    // Load language button states
    if (langButtons) {
        langButtons.forEach(btn => {
            if (btn.dataset.lang === currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

async function applyThemeSettings() {
    const settings = await getSettings();

    const root = document.documentElement;
    settings.patterns.forEach((p, index) => {
        const i = index + 1;
        // Set CSS variable: --bg-pattern-1, etc.
        root.style.setProperty(`--bg-pattern-${i}`, `linear-gradient(135deg, ${p.c1}, ${p.c2})`);

        // Sets title gradient vars
        root.style.setProperty('--title-gradient-start', settings.titleGradientStart || DEFAULT_SETTINGS.titleGradientStart);
        root.style.setProperty('--title-gradient-end', settings.titleGradientEnd || DEFAULT_SETTINGS.titleGradientEnd);

        // Update input values in Settings Modal
        const inputC1 = document.getElementById(`p${i}-c1`);
        const inputC2 = document.getElementById(`p${i}-c2`);
        if (inputC1 && inputC2) {
            inputC1.value = p.c1;
            inputC2.value = p.c2;
        }
    });

    // Setup live preview in Settings Modal
    setupSettingsPreviews();
}

async function applyBackgroundSettings() {
    const settings = await getSettings();

    // Apply background color
    const bgColor = settings.bgColor || DEFAULT_SETTINGS.bgColor;
    document.documentElement.style.setProperty('--bg-color', bgColor);

    // Note: styles.css needs to be updated to use var(--bg-image) and var(--bg-color) on body.
}

async function applyIconImage() {
    const settings = await getSettings();

    // Separate logic: Icon Image is for header, Bg Image is for background.
    // No migration here.

    console.log('applyIconImage - settings:', {
        hasIconImage: !!settings.iconImage,
        iconImageLength: settings.iconImage ? settings.iconImage.length : 0,
        iconImageStart: settings.iconImage ? settings.iconImage.substring(0, 50) : 'none'
    });

    if (!headerIcon) {
        headerIcon = document.getElementById('header-icon');
    }

    console.log('applyIconImage - headerIcon:', !!headerIcon);

    if (headerIcon && settings.iconImage && settings.iconImage.trim() !== '') {
        const iconImageUrl = settings.iconImage.trim();

        // Check if it's a data URL (starts with data:)
        if (iconImageUrl.startsWith('data:')) {
            headerIcon.src = iconImageUrl;
            headerIcon.style.display = 'block';
            console.log('Icon image applied (data URL), length:', iconImageUrl.length);

            // Verify image loaded
            headerIcon.onload = () => {
                console.log('Icon image loaded successfully');
            };
            headerIcon.onerror = (e) => {
                console.error('Icon image failed to load:', e);
            };
        } else {
            // Invalid image format
            console.warn('Invalid icon image format. Please use the Browse button to select an image.');
            if (iconImageInput) {
                iconImageInput.value = '';
            }
            headerIcon.style.display = 'none';
        }
    } else {
        console.log('applyIconImage - No icon to display:', {
            hasHeaderIcon: !!headerIcon,
            hasIconImage: !!(settings.iconImage && settings.iconImage.trim() !== '')
        });
        if (headerIcon) {
            headerIcon.style.display = 'none';
        }
    }
}

function applyLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang] || translations.ja;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    // Update specific elements
    if (bookmarkSearchInput && t['search-placeholder']) {
        bookmarkSearchInput.placeholder = t['search-placeholder'];
    }

    // Update search result buttons (if they exist)
    document.querySelectorAll('.search-action-btn[data-action="open"]').forEach(btn => {
        if (t['open']) btn.textContent = t['open'];
    });

    // Update image input placeholders (if images are set)
    // We need to check if images are set, so we'll update these when settings are loaded
    // For now, we'll update them if they have a value
    if (iconImageInput && iconImageInput.value && iconImageInput.value.trim() !== '') {
        // Only update if it's the placeholder text (not actual image data)
        if (iconImageInput.value === '画像が設定されています' || iconImageInput.value === 'Image is set') {
            iconImageInput.value = t['image-set'];
        }
    }


    // Update date display
    updateDate();
}

function setupSettingsPreviews() {
    [1, 2, 3].forEach(i => {
        const c1 = document.getElementById(`p${i}-c1`);
        const c2 = document.getElementById(`p${i}-c2`);
        const preview = document.getElementById(`preview-${i}`);

        if (!c1 || !c2 || !preview) return;

        const update = () => {
            preview.style.background = `linear-gradient(135deg, ${c1.value}, ${c2.value})`;
        };

        c1.addEventListener('input', update);
        c2.addEventListener('input', update);
    });
}

async function saveSettings() {
    const patterns = [];
    for (let i = 1; i <= 3; i++) {
        const c1 = document.getElementById(`p${i}-c1`);
        const c2 = document.getElementById(`p${i}-c2`);
        if (c1 && c2) {
            patterns.push({
                c1: c1.value,
                c2: c2.value
            });
        }
    }

    if (patterns.length !== 3) {
        console.error('Failed to get all pattern colors');
        return;
    }

    // Get language
    const activeLangBtn = document.querySelector('.lang-btn.active');
    const language = activeLangBtn ? activeLangBtn.dataset.lang : 'ja';

    // Get background color
    const bgColor = bgColorInput ? bgColorInput.value : DEFAULT_SETTINGS.bgColor;

    // Get icon image (preserve existing if not changed, need careful handling)
    // Actually, simple way: we load settings first, then update fields. 
    // Since input is now read-only for display, we should rely on a state variable or read from storage + memory.
    // Better strategy: currentImageData variable handles card images. We need specific variables for settings images.

    // We'll use the current settings state as base
    let currentSettings = await getSettings();

    const iconImage = settingsIconImageData !== null ? settingsIconImageData : (currentSettings.iconImage || '');

    console.log('saveSettings - images:', {
        iconImageLen: iconImage.length
    });

    const settings = {
        patterns,
        language,
        bgColor,
        bgColor,
        iconImage,
        titleGradientStart: titleColorStartInput ? titleColorStartInput.value : DEFAULT_SETTINGS.titleGradientStart,
        titleGradientEnd: titleColorEndInput ? titleColorEndInput.value : DEFAULT_SETTINGS.titleGradientEnd
    };

    // Check if we need to use local storage due to image size
    // chrome.storage.sync has 8KB limit per key, so use local for large images
    const totalSize = JSON.stringify(settings).length;
    // Use local if total size > 7KB or if any image exists
    const useLocal = totalSize > 7000 || (iconImage && iconImage.length > 0);

    console.log('saveSettings - settings to save:', {
        hasIconImage: !!settings.iconImage,
        iconImageLength: settings.iconImage ? settings.iconImage.length : 0
    });

    await Storage.set(SETTINGS_KEY, settings, useLocal);
    console.log('Settings saved, total size:', totalSize, 'bytes, using local:', useLocal);

    currentLanguage = language;
    applyLanguage(language);
    await applyThemeSettings();
    await applyBackgroundSettings();
    await applyIconImage();

    // Reset temp data
    settingsIconImageData = null;

    if (settingsModal) {
        settingsModal.classList.add('hidden');
    }
}

async function resetSettings() {
    const t = translations[currentLanguage] || translations.ja;
    const confirmMessage = t['reset-confirm'] || 'Reset settings to default?';

    if (!confirm(confirmMessage)) {
        return;
    }

    // Factory Defaults
    const factoryDefaults = {
        patterns: [
            { c1: '#0061ff', c2: '#60efff' }, // Pattern 1
            { c1: '#fcd34d', c2: '#fdba74' }, // Pattern 2
            { c1: '#10b981', c2: '#06b6d4' }  // Pattern 3
        ],
        language: 'ja', // Default to Japanese as per initial setting
        bgColor: 'darkslategray',
        iconImage: '',
        titleGradientStart: '#ffffff',
        titleGradientEnd: '#94a3b8'
    };

    // Save to storage (Force use of sync storage unless image prevents it, but defaults are small)
    await Storage.set(SETTINGS_KEY, factoryDefaults, false);
    console.log('Settings reset to factory defaults');

    // Reload page to apply clean settings
    window.location.reload();
}

// --- Core Logic: CRUD & Rendering ---

async function renderLinks() {
    if (!carousel || !addCardTrigger) {
        console.error('Carousel or add card trigger not found');
        return;
    }

    // Try to get from both sync and local storage
    // Prefer the one with more data (usually local if images are present)
    let linksSync = await Storage.get(STORAGE_KEY);
    let linksLocal = await Storage.get(STORAGE_KEY, true);

    // Use local if it exists and has data, otherwise use sync
    let links = null;
    if (linksLocal && Array.isArray(linksLocal) && linksLocal.length > 0) {
        links = linksLocal;
        console.log('Using local storage data');
    } else if (linksSync && Array.isArray(linksSync) && linksSync.length > 0) {
        links = linksSync;
        console.log('Using sync storage data');
    }

    if (!links) links = DEFAULT_LINKS;

    // Shuffle links for random order
    links = shuffleArray([...links]); // Create a copy to shuffle

    console.log('Rendering links (shuffled):', links.length);
    links.forEach((link, index) => {
        console.log(`Link ${index}:`, {
            title: link.title,
            hasImage: !!link.imageUrl,
            imageLength: link.imageUrl ? link.imageUrl.length : 0
        });
    });

    // Clear existing cards EXCEPT the "Add" button
    const existingCards = carousel.querySelectorAll('.link-card');
    existingCards.forEach(card => card.remove());

    // Insert cards before the "Add" button
    links.forEach(link => {
        try {
            const card = createCardElement(link);
            carousel.insertBefore(card, addCardTrigger);
        } catch (error) {
            console.error('Error creating card for link:', link, error);
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- History Carousel Functions ---
async function getRecentHistory() {
    return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.history || !chrome.history.search) {
            resolve([]);
            return;
        }

        // Get history from the last 24 hours
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

        chrome.history.search({
            text: '',
            maxResults: 100, // Get more results to filter
            startTime: oneDayAgo
        }, (results) => {
            if (chrome.runtime.lastError) {
                console.warn('History search error:', chrome.runtime.lastError.message);
                resolve([]);
                return;
            }

            // Filter to get unique URLs and limit to 5
            const uniqueUrls = new Map();
            const filteredResults = [];

            for (const item of results || []) {
                if (item.url && !uniqueUrls.has(item.url)) {
                    uniqueUrls.set(item.url, true);
                    filteredResults.push({
                        title: item.title || new URL(item.url).hostname,
                        url: item.url
                    });

                    if (filteredResults.length >= 5) {
                        break;
                    }
                }
            }

            resolve(filteredResults);
        });
    });
}

async function renderHistoryCarousel() {
    const historyCarousel = document.getElementById('history-carousel');
    if (!historyCarousel) {
        console.warn('History carousel element not found');
        return;
    }

    const historyItems = await getRecentHistory();

    // Clear existing cards
    historyCarousel.innerHTML = '';

    if (historyItems.length === 0) {
        historyCarousel.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.5);">閲覧履歴がありません</div>';
        return;
    }

    // Create cards for each history item
    historyItems.forEach(item => {
        const card = createSimpleCardElement(item, 'fixed-history');
        historyCarousel.appendChild(card);
    });
}

// --- Bookmark Carousel Functions ---
async function getRandomBookmarks() {
    const bookmarks = await loadAllBookmarks();

    if (bookmarks.length === 0) {
        return [];
    }

    // Shuffle and get 5 random bookmarks
    const shuffled = shuffleArray([...bookmarks]);
    return shuffled.slice(0, 5).map(bookmark => ({
        title: bookmark.title,
        url: bookmark.url
    }));
}

async function renderBookmarkCarousel() {
    const bookmarkCarousel = document.getElementById('bookmark-carousel');
    if (!bookmarkCarousel) {
        console.warn('Bookmark carousel element not found');
        return;
    }

    const bookmarkItems = await getRandomBookmarks();

    // Clear existing cards
    bookmarkCarousel.innerHTML = '';

    if (bookmarkItems.length === 0) {
        bookmarkCarousel.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.5);">ブックマークがありません</div>';
        return;
    }

    // Create cards for each bookmark
    bookmarkItems.forEach(item => {
        const card = createSimpleCardElement(item, 'fixed-bookmarks');
        bookmarkCarousel.appendChild(card);
    });
}

// --- Simple Card Element (without edit/delete buttons) ---
function createSimpleCardElement(link, fixedBgClass = null) {
    const div = document.createElement('div');
    div.className = 'card link-card';

    // Assign random background class or fixed one
    const bgClass = fixedBgClass || getRandomBgClass();
    div.classList.add(bgClass);

    // Safely get hostname from URL
    let hostname = '';
    try {
        hostname = new URL(link.url).hostname;
    } catch (e) {
        try {
            const urlMatch = link.url.match(/https?:\/\/([^\/]+)/);
            hostname = urlMatch ? urlMatch[1] : link.url;
        } catch (e2) {
            hostname = link.url;
        }
    }

    // Create thumbnail image - use default SVG
    const imageSrc = 'icons/free.svg';

    const thumbnailHtml = `
        <div class="card-thumbnail">
            <img src="${imageSrc}" class="card-thumbnail-image" alt="${escapeHtml(link.title)}" onerror="this.src='icons/free.svg';">
        </div>
    `;

    div.innerHTML = `
        <div class="card-title">
            <span>${escapeHtml(link.title)}</span>
        </div>
        <div class="card-url">${escapeHtml(hostname)}</div>
        ${thumbnailHtml}
    `;

    // Add click handler to open URL
    div.addEventListener('click', () => {
        window.location.href = link.url;
    });

    return div;
}


function createCardElement(link) {
    const div = document.createElement('div');
    div.className = 'card link-card';
    div.dataset.id = link.id;

    // Assign bgClass if missing (migration)
    if (!link.bgClass) {
        // Defaults to pattern 1 if undefined, or random could be used
        // Since we now have selection, migration to a default is safer for consistent behavior
        link.bgClass = 'card-bg-1';
    }

    // Apply background class regardless of image so it shows if image fails or is loading, 
    // and also allows simple switching if image is removed.
    div.classList.add(link.bgClass);

    // Safely get hostname from URL
    let hostname = '';
    try {
        hostname = new URL(link.url).hostname;
    } catch (e) {
        // If URL is invalid, try to extract hostname manually or use the URL as-is
        try {
            const urlMatch = link.url.match(/https?:\/\/([^\/]+)/);
            hostname = urlMatch ? urlMatch[1] : link.url;
        } catch (e2) {
            hostname = link.url;
        }
    }

    // Create thumbnail image - use default SVG if no image
    let thumbnailHtml = '';
    console.log('Creating card for:', link.title, 'imageUrl:', link.imageUrl ? `Present (${link.imageUrl.substring(0, 50)}...)` : 'Missing');

    const imageSrc = (link.imageUrl && link.imageUrl.trim() !== '')
        ? link.imageUrl
        : 'icons/free.svg';

    thumbnailHtml = `
        <div class="card-thumbnail">
            <img src="${imageSrc}" class="card-thumbnail-image" alt="${escapeHtml(link.title)}" onerror="this.src='icons/free.svg';">
        </div>
    `;

    div.innerHTML = `
        <div class="card-actions">
            <button class="action-btn edit-btn" title="Edit">✎</button>
            <button class="action-btn delete-btn" title="Delete">×</button>
        </div>
        <div class="card-title">
            <span>${escapeHtml(link.title)}</span>
        </div>
        <div class="card-url">${escapeHtml(hostname)}</div>
        ${thumbnailHtml}
    `;

    // Edit button
    const editBtn = div.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(link);
        });
    }

    // Delete button
    const deleteBtn = div.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${link.title}"?`)) {
                deleteLink(link.id);
            }
        });
    }

    return div;
}

// Random select for new cards? Or default?
// Let's pick random for new, but allow change.
function getRandomBgClass() {
    const patterns = ['card-bg-1', 'card-bg-2', 'card-bg-3'];
    return patterns[Math.floor(Math.random() * patterns.length)];
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function saveLink(linkData) {
    // Try to get from both sync and local storage
    let linksSync = await Storage.get(STORAGE_KEY);
    let linksLocal = await Storage.get(STORAGE_KEY, true);

    // Use local if it exists and has data, otherwise use sync
    let links = null;
    if (linksLocal && Array.isArray(linksLocal) && linksLocal.length > 0) {
        links = linksLocal;
    } else if (linksSync && Array.isArray(linksSync) && linksSync.length > 0) {
        links = linksSync;
    }

    if (!links) links = [];

    console.log('Saving link data:', {
        title: linkData.title,
        url: linkData.url,
        hasImage: !!linkData.imageUrl,
        imageLength: linkData.imageUrl ? linkData.imageUrl.length : 0
    });

    if (editingId) {
        // Update existing
        const index = links.findIndex(l => l.id === editingId);
        if (index !== -1) {
            links[index] = {
                ...links[index],
                ...linkData,
                id: editingId,
                bgClass: selectedPattern // Use the selected pattern from modal state
            };
        }
    } else {
        // Add new
        links.push({
            id: Date.now().toString(),
            bgClass: selectedPattern,
            ...linkData
        });
    }

    // Check if we need to use local storage due to image size
    // chrome.storage.sync has 8KB limit per key, so use local for large images
    const totalSize = JSON.stringify(links).length;
    const useLocal = totalSize > 7000; // Use local if total size > 7KB (safety margin)

    await Storage.set(STORAGE_KEY, links, useLocal);
    console.log('Link saved, total links:', links.length, 'total size:', totalSize, 'bytes, using local:', useLocal);
    await renderLinks();
}

async function deleteLink(id) {
    // Try to get from both sync and local storage
    let linksSync = await Storage.get(STORAGE_KEY);
    let linksLocal = await Storage.get(STORAGE_KEY, true);

    // Use local if it exists and has data, otherwise use sync
    let links = null;
    if (linksLocal && Array.isArray(linksLocal) && linksLocal.length > 0) {
        links = linksLocal;
    } else if (linksSync && Array.isArray(linksSync) && linksSync.length > 0) {
        links = linksSync;
    }

    if (!links) return;
    links = links.filter(l => l.id !== id);
    // Check if we need to use local storage due to image size
    // chrome.storage.sync has 8KB limit per key, so use local for large images
    const totalSize = JSON.stringify(links).length;
    const useLocal = totalSize > 7000; // Use local if total size > 7KB (safety margin)

    await Storage.set(STORAGE_KEY, links, useLocal);
    console.log('Link saved, total links:', links.length, 'total size:', totalSize, 'bytes, using local:', useLocal);
    await renderLinks();
}

// --- Autocomplete Logic (Generic) ---
function setupAutocomplete(inputElement, suggestionsElement) {
    if (!inputElement || !suggestionsElement) {
        console.warn('Autocomplete setup: input or suggestions element not found');
        return;
    }

    let debounceTimer;

    inputElement.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            hideSuggestions(suggestionsElement);
            return;
        }

        debounceTimer = setTimeout(() => {
            searchHistory(query, suggestionsElement);
        }, 300);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.suggestions-list') && e.target !== inputElement) {
            hideSuggestions(suggestionsElement);
        }
    });
}

function searchHistory(query, suggestionsElement) {
    if (typeof chrome === 'undefined' || !chrome.history || !chrome.history.search) {
        return;
    }

    try {
        chrome.history.search({
            text: query,
            maxResults: 5,
            startTime: 0
        }, (results) => {
            if (chrome.runtime.lastError) {
                console.warn('History search error:', chrome.runtime.lastError.message);
                return;
            }
            showSuggestions(results || [], suggestionsElement);
        });
    } catch (error) {
        console.warn('Error searching history:', error);
    }
}

function showSuggestions(results, suggestionsElement) {
    if (!suggestionsElement) return;
    suggestionsElement.innerHTML = '';

    if (results.length === 0) {
        hideSuggestions(suggestionsElement);
        return;
    }

    results.forEach(result => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        li.innerHTML = `
            <div class="suggestion-title">${result.title || result.url}</div>
            <div class="suggestion-url">${result.url}</div>
        `;

        li.addEventListener('click', () => {
            if (inputUrl) inputUrl.value = result.url;
            if (result.title && inputTitle) inputTitle.value = result.title;
            hideSuggestions(suggestionsElement);
            if (urlSuggestionsList) hideSuggestions(urlSuggestionsList);
            if (titleSuggestionsList) hideSuggestions(titleSuggestionsList);
        });

        suggestionsElement.appendChild(li);
    });

    suggestionsElement.classList.remove('hidden');
}

function hideSuggestions(suggestionsElement) {
    if (!suggestionsElement) return;
    suggestionsElement.classList.add('hidden');
    suggestionsElement.innerHTML = '';
}

// --- Carousel Drag Scrolling ---
function setupCarouselDrag() {
    // Setup drag for all carousel containers
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        const carouselElement = container.querySelector('.carousel');
        if (!carouselElement) return;

        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging = false;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = false;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
            setTimeout(() => isDragging = false, 50);
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;

            if (Math.abs(walk) > 5) {
                isDragging = true;
            }
        });

        // Only add click handler for the main carousel (with add-card-trigger)
        if (carouselElement === carousel) {
            carouselElement.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                if (!card) return;

                if (isDragging) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                if (card.classList.contains('add-card-trigger')) {
                    openModal();
                    return;
                }

                if (e.target.closest('.action-btn')) {
                    return;
                }

                const id = card.dataset.id;
                console.log('Card clicked, id:', id);
                if (!id) {
                    console.warn('Card has no id');
                    return;
                }

                // Try to get from both sync and local storage
                Promise.all([
                    Storage.get(STORAGE_KEY),
                    Storage.get(STORAGE_KEY, true)
                ]).then(([linksSync, linksLocal]) => {
                    // Use local if it exists and has data, otherwise use sync
                    let links = null;
                    if (linksLocal && Array.isArray(linksLocal) && linksLocal.length > 0) {
                        links = linksLocal;
                    } else if (linksSync && Array.isArray(linksSync) && linksSync.length > 0) {
                        links = linksSync;
                    }

                    if (!links) {
                        console.error('No links found in storage');
                        return;
                    }

                    const link = links.find(l => l.id === id);
                    if (link && link.url) {
                        console.log('Opening link:', link.url);
                        window.location.href = link.url;
                    } else {
                        console.error('Link not found or URL missing:', id);
                    }
                });
            });
        }
    });
}

// --- Bookmark Search Functions ---
let searchDebounceTimer = null;
let allBookmarks = [];

async function loadAllBookmarks() {
    return new Promise((resolve) => {
        if (typeof chrome === 'undefined' || !chrome.bookmarks) {
            resolve([]);
            return;
        }

        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            const bookmarks = [];

            function traverse(nodes, parentPath = []) {
                nodes.forEach(node => {
                    // Skip root bookmark bar and other bookmarks folders
                    const isRootFolder = node.id === '0' || node.id === '1' || node.id === '2';

                    if (node.url) {
                        // This is a bookmark
                        const folderPath = parentPath.filter(f => f && f !== 'ブックマーク バー' && f !== 'その他のブックマーク');
                        bookmarks.push({
                            id: node.id,
                            title: node.title,
                            url: node.url,
                            folderPath: folderPath,
                            folderName: folderPath.length > 0 ? folderPath[folderPath.length - 1] : ''
                        });
                    } else if (node.children && !isRootFolder) {
                        // This is a folder, add to path and traverse children
                        const newPath = [...parentPath, node.title];
                        traverse(node.children, newPath);
                    } else if (node.children) {
                        // Root folder, traverse without adding to path
                        traverse(node.children, parentPath);
                    }
                });
            }

            traverse(bookmarkTreeNodes);
            allBookmarks = bookmarks;
            resolve(bookmarks);
        });
    });
}

function searchBookmarks(query) {
    if (!query || query.trim().length < 1) {
        return [];
    }

    const lowerQuery = query.toLowerCase();
    return allBookmarks.filter(bookmark => {
        const titleMatch = bookmark.title.toLowerCase().includes(lowerQuery);
        const urlMatch = bookmark.url.toLowerCase().includes(lowerQuery);
        return titleMatch || urlMatch;
    }).slice(0, 10); // Limit to 10 results
}

function displaySearchResults(results) {
    if (!searchSuggestions) return;

    searchSuggestions.innerHTML = '';

    if (results.length === 0) {
        searchSuggestions.classList.add('hidden');
        return;
    }

    results.forEach(bookmark => {
        const item = document.createElement('div');
        item.className = 'search-result-item';

        // Build folder path display
        let folderDisplay = '';
        if (bookmark.folderPath && bookmark.folderPath.length > 0) {
            const folderPath = bookmark.folderPath.filter(f => f && f !== 'ブックマーク バー' && f !== 'その他のブックマーク');
            if (folderPath.length > 0) {
                folderDisplay = `<div class="search-result-folder">📁 ${escapeHtml(folderPath.join(' / '))}</div>`;
            }
        }

        item.innerHTML = `
            <div class="search-result-content">
                ${folderDisplay}
                <div class="search-result-title">${escapeHtml(bookmark.title)}</div>
                <div class="search-result-url">${escapeHtml(bookmark.url)}</div>
            </div>
            <div class="search-result-actions">
                <button class="search-action-btn" data-action="open" data-url="${escapeHtml(bookmark.url)}" data-i18n-title="open">${translations[currentLanguage]?.open || '開く'}</button>
                <button class="search-action-btn" data-action="add" data-title="${escapeHtml(bookmark.title)}" data-url="${escapeHtml(bookmark.url)}" data-i18n-title="add-to-carousel">+</button>
            </div>
        `;

        // Open button
        item.querySelector('[data-action="open"]').addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = bookmark.url;
        });

        // Add to carousel button
        item.querySelector('[data-action="add"]').addEventListener('click', async (e) => {
            e.stopPropagation();
            await addBookmarkToCarousel(bookmark);
            searchSuggestions.classList.add('hidden');
            bookmarkSearchInput.value = '';
        });

        // Click on item to open
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.search-result-actions')) {
                window.location.href = bookmark.url;
            }
        });

        searchSuggestions.appendChild(item);
    });

    searchSuggestions.classList.remove('hidden');
}

async function addBookmarkToCarousel(bookmark) {
    const linkData = {
        title: bookmark.title,
        url: bookmark.url,
        imageUrl: '' // Use default SVG
    };

    // Get existing links
    let linksSync = await Storage.get(STORAGE_KEY);
    let linksLocal = await Storage.get(STORAGE_KEY, true);

    let links = null;
    if (linksLocal && Array.isArray(linksLocal) && linksLocal.length > 0) {
        links = linksLocal;
    } else if (linksSync && Array.isArray(linksSync) && linksSync.length > 0) {
        links = linksSync;
    }

    if (!links) links = [];

    // Check if already exists
    const exists = links.some(l => l.url === bookmark.url);
    if (exists) {
        alert('このブックマークは既にカルーセルに追加されています');
        return;
    }

    // Add new link
    links.push({
        id: Date.now().toString(),
        bgClass: getRandomBgClass(),
        ...linkData
    });

    // Save
    const totalSize = JSON.stringify(links).length;
    const useLocal = totalSize > 7000;

    await Storage.set(STORAGE_KEY, links, useLocal);
    await renderLinks();
}

function setupBookmarkSearch() {
    if (!bookmarkSearchInput || !searchSuggestions) {
        return;
    }

    // Load all bookmarks on init
    loadAllBookmarks().then(() => {
        console.log('Loaded bookmarks:', allBookmarks.length);
    });

    // Search input handler
    bookmarkSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        clearTimeout(searchDebounceTimer);

        if (query.length < 1) {
            searchSuggestions.classList.add('hidden');
            return;
        }

        searchDebounceTimer = setTimeout(() => {
            const results = searchBookmarks(query);
            displaySearchResults(results);
        }, 300);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input-wrapper') && e.target !== bookmarkSearchInput) {
            searchSuggestions.classList.add('hidden');
        }
    });

    // Handle Enter key
    bookmarkSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query.length > 0) {
                const results = searchBookmarks(query);
                if (results.length > 0) {
                    window.location.href = results[0].url;
                }
            }
        }
    });
}

// --- Image Upload Functions ---
function compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function setupImageUpload() {
    if (!imageFileInput || !imageUploadBtn || !imagePreviewContainer || !imagePreview || !imageRemoveBtn) {
        return;
    }

    // Open file dialog when button is clicked
    imageUploadBtn.addEventListener('click', () => {
        imageFileInput.click();
    });

    // Handle file selection
    imageFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const t = translations[currentLanguage] || translations.ja;

        if (!file.type.startsWith('image/')) {
            alert(t['image-file-error']);
            return;
        }

        // Check file size (max 5MB before compression)
        if (file.size > 5 * 1024 * 1024) {
            alert(t['image-size-error']);
            return;
        }

        try {
            imageUploadBtn.textContent = t['compressing'];
            imageUploadBtn.disabled = true;

            // Compress and convert to Base64
            const base64Data = await compressImage(file);
            currentImageData = base64Data;

            // Show preview
            imagePreview.src = base64Data;
            imagePreviewContainer.classList.remove('hidden');
            imageUploadBtn.style.display = 'none';
        } catch (error) {
            console.error('Image processing error:', error);
            const t = translations[currentLanguage] || translations.ja;
            alert(t['image-process-error']);
        } finally {
            const t = translations[currentLanguage] || translations.ja;
            imageUploadBtn.textContent = t['select-image'];
            imageUploadBtn.disabled = false;
        }
    });

    // Remove image - show default SVG instead
    imageRemoveBtn.addEventListener('click', () => {
        currentImageData = null;
        imageFileInput.value = '';
        // Show default SVG instead of hiding
        if (imagePreview) {
            imagePreview.src = 'icons/free.svg';
        }
        if (imagePreviewContainer) {
            imagePreviewContainer.classList.remove('hidden');
        }
        if (imageUploadBtn) {
            imageUploadBtn.style.display = 'block';
        }
    });
}

// --- Pattern Selection Logic ---
function selectPattern(patternClass) {
    selectedPattern = patternClass;
    if (patternOptions && patternOptions.length > 0) {
        patternOptions.forEach(opt => {
            if (opt.dataset.pattern === patternClass) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }
}

// --- Event Listeners ---
function setupEventListeners() {
    // Main Modal controls
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Settings Modal
    if (settingsTrigger) {
        settingsTrigger.addEventListener('click', async () => {
            if (settingsModal) {
                // Load current settings when opening modal
                let settings = await Storage.get(SETTINGS_KEY);
                if (!settings) {
                    settings = await Storage.get(SETTINGS_KEY, true); // Try local storage
                }
                if (!settings) settings = DEFAULT_SETTINGS;

                // Update language buttons
                if (langButtons) {
                    langButtons.forEach(btn => {
                        if (btn.dataset.lang === (settings.language || 'ja')) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }

                // Update background color input
                if (bgColorInput) {
                    const bgColor = settings.bgColor || DEFAULT_SETTINGS.bgColor;
                    if (bgColor === 'darkslategray') {
                        bgColorInput.value = '#2f4f4f';
                    } else {
                        bgColorInput.value = bgColor;
                    }
                }

                // Update icon image input
                if (iconImageInput) {
                    iconImageInput.value = settings.iconImage || '';
                }
                await applyIconImage();

                settingsModal.classList.remove('hidden');
            }
        });
    }
    if (settingsCloseBtn) {
        settingsCloseBtn.addEventListener('click', () => {
            if (settingsModal) settingsModal.classList.add('hidden');
        });
    }
    if (settingsSaveBtn) {
        settingsSaveBtn.addEventListener('click', saveSettings);
    }
    if (settingsResetBtn) {
        settingsResetBtn.addEventListener('click', resetSettings);
    }
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.classList.add('hidden');
        });
    }

    // Language toggle buttons
    if (langButtons && langButtons.length > 0) {
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // Background color input - live preview
    if (bgColorInput) {
        bgColorInput.addEventListener('input', (e) => {
            const bgColor = e.target.value;
            document.documentElement.style.setProperty('--bg-color', bgColor);
            document.body.style.backgroundColor = bgColor;
        });
    }

    // Title Gradient Live Preview
    if (titleColorStartInput) {
        titleColorStartInput.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--title-gradient-start', e.target.value);
        });
    }
    if (titleColorEndInput) {
        titleColorEndInput.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--title-gradient-end', e.target.value);
        });
    }

    // Icon image browse button
    if (iconImageBrowseBtn && iconImageFileInput) {
        iconImageBrowseBtn.addEventListener('click', () => {
            iconImageFileInput.click();
        });

        iconImageFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const t = translations[currentLanguage] || translations.ja;

            if (file.size > 5 * 1024 * 1024) {
                alert(t['image-size-error']);
                return;
            }

            try {
                iconImageBrowseBtn.textContent = t['compressing'];
                iconImageBrowseBtn.disabled = true;

                const base64Data = await compressImage(file);
                settingsIconImageData = base64Data;

                if (iconImageInput) {
                    iconImageInput.value = t['image-selected'];
                }
            } catch (error) {
                console.error('Icon Image processing error:', error);
                alert(t['image-process-error']);
            } finally {
                iconImageBrowseBtn.textContent = t['browse'];
                iconImageBrowseBtn.disabled = false;
            }
        });
    }



    // Pattern Selector click
    if (patternOptions && patternOptions.length > 0) {
        patternOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                selectPattern(opt.dataset.pattern);
            });
        });
    }

    // Form submission
    if (linkForm) {
        linkForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!inputTitle || !inputUrl) {
                console.error('Form inputs not found');
                return;
            }

            const formData = {
                title: inputTitle.value.trim(),
                url: inputUrl.value.trim(),
                imageUrl: currentImageData || ''
            };

            console.log('Saving link with imageUrl:', formData.imageUrl ? `Image present (${formData.imageUrl.length} chars)` : 'No image');

            if (!formData.title || !formData.url) return;

            if (!formData.url.startsWith('http')) {
                formData.url = 'https://' + formData.url;
            }

            await saveLink(formData);
            closeModal();
        });
    }

    if (inputUrl && urlSuggestionsList) {
        setupAutocomplete(inputUrl, urlSuggestionsList);
    }
    if (inputTitle && titleSuggestionsList) {
        setupAutocomplete(inputTitle, titleSuggestionsList);
    }

    // URL Input Listener for Video Thumbnail (YouTube & NicoNico)
    if (inputUrl) {
        inputUrl.addEventListener('input', (e) => {
            const url = e.target.value.trim();

            // Clear previous debounce timer
            if (thumbnailDebounceTimer) {
                clearTimeout(thumbnailDebounceTimer);
            }

            // Debounce: Wait 500ms after last input
            thumbnailDebounceTimer = setTimeout(async () => {
                // If manual image exists, don't overwrite
                if (currentImageData) return;

                // Check for YouTube
                const youtubeId = extractYoutubeVideoId(url);
                if (youtubeId) {
                    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
                    setPreviewImage(thumbnailUrl);
                    return;
                }

                // Check for NicoNico
                const niconicoId = extractNiconicoVideoId(url);
                if (niconicoId) {
                    try {
                        const thumbnailUrl = await fetchNiconicoThumbnail(niconicoId);
                        if (thumbnailUrl) {
                            setPreviewImage(thumbnailUrl);
                        }
                    } catch (err) {
                        console.warn('Failed to fetch NicoNico thumbnail:', err);
                    }
                    return;
                }

            }, 500);
        });
    }

    // Setup image upload
    setupImageUpload();
}

function setPreviewImage(url) {
    if (!url) return;

    // Set preview
    if (imagePreview) {
        imagePreview.src = url;
    }
    if (imagePreviewContainer) {
        imagePreviewContainer.classList.remove('hidden');
    }
    if (imageUploadBtn) {
        imageUploadBtn.style.display = 'none';
    }

    // Set data to save
    currentImageData = url;
}

// Global debounce timer
let thumbnailDebounceTimer = null;

function openModal(link = null) {
    if (!modal) {
        console.error('Modal not found');
        return;
    }

    modal.classList.remove('hidden');

    if (link) {
        editingId = link.id;
        if (modalTitle) {
            const t = translations[currentLanguage] || translations.ja;
            modalTitle.textContent = t['edit-shortcut'] || 'Edit Shortcut';
        }
        if (inputTitle) inputTitle.value = link.title;
        if (inputUrl) inputUrl.value = link.url;

        // Load existing image or show default SVG
        if (link.imageUrl && link.imageUrl.trim() !== '') {
            currentImageData = link.imageUrl;
            if (imagePreview) {
                imagePreview.src = link.imageUrl;
            }
            if (imagePreviewContainer) {
                imagePreviewContainer.classList.remove('hidden');
            }
            if (imageUploadBtn) {
                imageUploadBtn.style.display = 'none';
            }
        } else {
            currentImageData = null;
            // Show default SVG when no image
            if (imagePreview) {
                imagePreview.src = 'icons/free.svg';
            }
            if (imagePreviewContainer) {
                imagePreviewContainer.classList.remove('hidden');
            }
            if (imageUploadBtn) {
                imageUploadBtn.style.display = 'block';
            }
        }

        // Load existing pattern or default
        selectPattern(link.bgClass || 'card-bg-1');
    } else {
        editingId = null;
        if (modalTitle) {
            const t = translations[currentLanguage] || translations.ja;
            modalTitle.textContent = t['add-shortcut'] || 'Add Shortcut';
        }
        if (linkForm) linkForm.reset();

        // Reset image - show default SVG
        currentImageData = null;
        if (imageFileInput) imageFileInput.value = '';
        if (imagePreview) {
            imagePreview.src = 'icons/free.svg';
        }
        if (imagePreviewContainer) {
            imagePreviewContainer.classList.remove('hidden');
        }
        if (imageUploadBtn) {
            imageUploadBtn.style.display = 'block';
        }

        // Randomly select one for new card for variety, or default 1
        selectPattern(getRandomBgClass());
    }

    if (inputTitle) inputTitle.focus();
}

function closeModal() {
    if (modal) modal.classList.add('hidden');
    if (linkForm) linkForm.reset();
    if (urlSuggestionsList) hideSuggestions(urlSuggestionsList);
    if (titleSuggestionsList) hideSuggestions(titleSuggestionsList);

    // Reset image - show default SVG
    currentImageData = null;
    if (imageFileInput) imageFileInput.value = '';
    if (imagePreview) {
        imagePreview.src = 'icons/free.svg';
    }
    if (imagePreviewContainer) {
        imagePreviewContainer.classList.remove('hidden');
    }
    if (imageUploadBtn) {
        imageUploadBtn.style.display = 'block';
    }

    editingId = null;
}

// --- Video Thumbnail Helpers ---

function extractYoutubeVideoId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function extractNiconicoVideoId(url) {
    if (!url) return null;
    // Matches sm12345, so12345, nm12345, etc.
    const regExp = /((sm|so|nm)\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

async function fetchNiconicoThumbnail(videoId) {
    try {
        const videoUrl = `https://www.nicovideo.jp/watch/${videoId}`;
        const response = await fetch(videoUrl);
        if (!response.ok) return null;

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const ogImage = doc.querySelector('meta[property="og:image"]');
        return ogImage ? ogImage.content : null;
    } catch (e) {
        console.error('Niconico thumbnail fetch error:', e);
        return null;
    }
}

// Start - Ensure DOM is fully loaded
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 0); // Use setTimeout to ensure all scripts are loaded
        });
    } else {
        // DOM already loaded, but wait a bit to ensure all elements are available
        setTimeout(init, 0);
    }
})();

