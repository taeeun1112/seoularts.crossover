/* ===================================
   결 (Gyeol) Guestbook — App Logic
   Supabase & Shared Logic
   =================================== */

// ==========================================
// ⚠️ Supabase Configuration
// 아래 값을 본인의 Supabase 프로젝트 정보로 교체하세요
// ==========================================
const SUPABASE_URL = 'https://enupwjrxzsfgormzcagu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LWdAtr0YwH_k5DjdrX6nLg_UjvlPsMn';

// Initialize Supabase client
let supabaseClient = null;

try {
  if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected');
  } else {
    console.warn('⚠️ Supabase credentials not configured. Using localStorage fallback.');
  }
} catch (error) {
  console.error('❌ Supabase init error:', error);
}

// Global session store for unlocked secret messages
if (!window.unlockedMessages) {
  window.unlockedMessages = new Set();
}

// ==========================================
// Shared Performance & Staff Data
// ==========================================
const programData = [
  {
    id: 1,
    title: '태평가',
    composer: '조은혜',
    performers: [
      { name: '조은혜', role: '작곡' },
      { name: '김하진', role: '건반' },
      { name: '강준규', role: '기타' },
      { name: '조민식', role: '베이스' },
      { name: '김이삭', role: '드럼' },
      { name: '양수인', role: '보컬' },
      { name: '신동준', role: '색소폰' },
      { name: '김범수', role: '피리·태평소' },
    ]
  },
  {
    id: 2,
    title: '심중전',
    composer: '임한은',
    performers: [
      { name: '임한은', role: '작곡' },
      { name: '김민준(건반)', role: '건반' },
      { name: '김동욱', role: '기타' },
      { name: '안재영', role: '베이스' },
      { name: '계백', role: '드럼' },
      { name: '김서연', role: '보컬' },
      { name: '천혜원', role: '가야금' },
      { name: '박다혜', role: '대금' },
    ]
  },
  {
    id: 3,
    title: '고성오광대',
    composer: '장예린',
    performers: [
      { name: '장예린', role: '작곡·건반' },
      { name: '이창현', role: '건반' },
      { name: '정하민', role: '기타' },
      { name: '이주영', role: '베이스' },
      { name: '신동준', role: '색소폰' },
      { name: '양지성', role: '드럼' },
      { name: '정윤탁', role: '판소리' },
      { name: '김범수', role: '피리' },
      { name: '윤태현', role: '태평소' },
      { name: '박다혜', role: '대금' },
      { name: '정서희', role: '해금' },
      { name: '김민준(타악)', role: '사물' },
      { name: '박율이', role: '사물' },
      { name: '김정환', role: '사물' },
      { name: '김규희', role: '사물' },
      { name: '고은채', role: '무용' },
      { name: '서로다', role: '무용' },
      { name: '김수아', role: '무용' },
      { name: '이수인', role: '무용' },
      { name: '고예은', role: '무용' },
    ]
  },
  {
    id: 4,
    title: '수양대군 · 현덕왕후 · 마침표의 또 다른 이름은',
    composer: '김현겸',
    performers: [
      { name: '김현겸', role: '작곡·피아노' },
      { name: '김솔', role: '보컬' },
      { name: '이대호', role: '보컬' },
      { name: '허강석', role: '보컬' },
      { name: '김나연', role: '보컬' },
      { name: '조나림', role: '보컬' },
      { name: '김민종', role: '기타' },
      { name: '김현택', role: '기타' },
      { name: '조준우', role: '베이스' },
      { name: '주현우', role: '드럼' },
      { name: '백준오', role: '피아노' },
      { name: '최기준', role: '트럼펫' },
      { name: '조용성', role: '하모니카' },
      { name: '김시언', role: '경기민요' },
      { name: '임근희', role: '판소리' },
      { name: '송예인', role: '대금' },
      { name: '홍유경', role: '가야금' },
      { name: '김하랑', role: '피리' },
      { name: '이윤서', role: '해금' },
      { name: '장순우', role: '공' },
      { name: '서연우', role: '베이스드럼' },
      { name: '유예진', role: '장구' },
    ]
  },
  {
    id: 5,
    title: '처용가',
    composer: '고우현',
    performers: [
      { name: '고우현', role: '작곡·보컬' },
      { name: '김민지', role: '건반' },
      { name: '홍세영', role: '기타' },
      { name: '안보은', role: '베이스' },
      { name: '이시영', role: '드럼' },
      { name: '박효은', role: '보컬' },
      { name: '고은채', role: '무용' },
      { name: '나현지', role: '가야금' },
      { name: '박소현', role: '아쟁' },
      { name: '이연화', role: '아쟁' },
      { name: '김하랑', role: '피리·태평소' },
      { name: '송예인', role: '대금' },
      { name: '백인이', role: '해금' },
      { name: '김규희', role: '북·꽹과리' },
      { name: '박율이', role: '베이스드럼' },
      { name: '김민준(타악)', role: '장구' },
    ]
  },
  {
    id: 6,
    title: 'Whimori',
    composer: '이주하',
    performers: [
      { name: '이주하', role: '작곡' },
      { name: '허지우', role: '건반' },
      { name: '서보성', role: '기타' },
      { name: '현재현', role: '기타' },
      { name: '정주원', role: '베이스' },
      { name: '설완', role: '드럼' },
      { name: '홍채영', role: '보컬' },
      { name: '서연우', role: '모듬북' },
      { name: '홍유경', role: '가야금' },
      { name: '김범수', role: '피리' },
      { name: '윤태현', role: '태평소' },
      { name: '송예인', role: '대금' },
      { name: '김보라', role: '해금' },
      { name: '박율이', role: '장구' },
      { name: '김민준(타악)', role: '꽹과리' },
      { name: '장순우', role: '공·베이스드럼' },
      { name: '김서연', role: '판소리' },
      { name: '임근희', role: '판소리' },
      { name: '고은채', role: '무용' },
      { name: '서로다', role: '무용' },
      { name: '김수아', role: '무용' },
      { name: '이수인', role: '무용' },
      { name: '고예은', role: '무용' },
    ]
  },
  {
    id: 7,
    title: '끝서리',
    composer: '이채원',
    performers: [
      { name: '이채원', role: '작곡' },
      { name: '김호정', role: '건반' },
      { name: '김민종', role: '기타' },
      { name: '최윤석', role: '베이스' },
      { name: '김민혁', role: '드럼' },
      { name: '강소이', role: '보컬' },
      { name: '김은혜', role: '코러스' },
      { name: '정윤탁', role: '코러스' },
      { name: '김하랑', role: '피리·태평소' },
      { name: '박다혜', role: '대금' },
      { name: '유예진', role: '장구·종·징' },
    ]
  },
  {
    id: 8,
    title: '나의 바람',
    composer: '김호정',
    performers: [
      { name: '김호정', role: '작곡·건반' },
      { name: '김민종', role: '기타' },
      { name: '최윤석', role: '베이스' },
      { name: '김민혁', role: '드럼' },
      { name: '김은혜', role: '보컬' },
      { name: '김하랑', role: '태평소' },
      { name: '홍유경', role: '가야금' },
      { name: '윤태경', role: '대금' },
      { name: '백인이', role: '해금' },
      { name: '유예진', role: '장구·꽹과리' },
    ]
  }
];

const staffData = [
  {
    role: '기획',
    members: [
      { name: '이시헌', role: '기획' },
      { name: '이유진', role: '기획' },
      { name: '이종은', role: '기획' },
    ]
  },
  {
    role: '디자인',
    members: [
      { name: '오준', role: '디자인' },
      { name: '우태은', role: '디자인' },
    ]
  },
  {
    role: '사진',
    members: [
      { name: '서재은', role: '사진' },
      { name: '손예지', role: '사진' },
    ]
  },
  {
    role: '무대',
    members: [
      { name: '이소은', role: '무대감독' },
      { name: '유서윤', role: '무대조감독' },
    ]
  },
  {
    role: '음향',
    members: [
      { name: '박윤재', role: '음향' },
    ]
  },
  {
    role: '홍보영상',
    members: [
      { name: '김건희', role: '홍보영상' },
      { name: '김민정', role: '홍보영상' },
      { name: '김상훈', role: '홍보영상' },
      { name: '김유민', role: '홍보영상' },
      { name: '박주하', role: '홍보영상' },
      { name: '정기백', role: '홍보영상' },
    ]
  }
];

const GyeolData = {
  program: programData,
  staff: staffData,
  getAllPeople() {
    const people = new Map();

    // Performers & Composers
    this.program.forEach(song => {
      song.performers.forEach(p => {
        if (!people.has(p.name)) {
          people.set(p.name, {
            name: p.name,
            type: 'performer',
            roles: [p.role],
            songs: [song.title]
          });
        } else {
          const person = people.get(p.name);
          if (!person.roles.includes(p.role)) person.roles.push(p.role);
          if (!person.songs.includes(song.title)) person.songs.push(song.title);
        }
      });
    });

    // Staff
    this.staff.forEach(group => {
      group.members.forEach(m => {
        if (!people.has(m.name)) {
          people.set(m.name, {
            name: m.name,
            type: 'staff',
            roles: [m.role],
            songs: ['STAFF']
          });
        } else {
          const person = people.get(m.name);
          if (!person.roles.includes(m.role)) person.roles.push(m.role);
        }
      });
    });

    return Array.from(people.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }
};

function getInitialBg(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 6%, 16%)`;
}

// ==========================================
// Secret Message Security Helpers
// ==========================================
function isSecretMessage(msg) {
  return msg && msg.startsWith('[SECRET]');
}

// Password database for each profile recipient
const PROFILE_PASSWORDS = {
  "이유진": "2562030", "이시헌": "2562053", "이종은": "2562006", "이소은": "2562009", "유서윤": "2562025",
  "김상훈": "2121033", "김유민": "2121006", "정기백": "2221023", "박주하": "2221024", "김건희": "2221031",
  "김민정": "2321025", "서재은": "2552006", "손예지": "2552048", "오준": "2222027", "우태은": "2351016",
  "박윤재": "2422010", "박다혜": "2531009", "송예인": "2531010", "윤태경": "2631012", "김정환": "2231019",
  "박율이": "2431018", "김민준": ["2531005", "1932025"], "김민준(건반)": "1932025", "김민준(타악)": "2531005", "장순우": "2531006", "유예진": "2631004", "서연우": "2631007",
  "김규희": "2631008", "윤태현": "2431012", "김범수": "2431015", "김하랑": "2531014", "이윤서": "2331009",
  "김보라": "2431011", "정서희": "2431016", "백인이": "2531015", "박소현": "2331002", "이연화": "2631013",
  "홍유경": "2631003", "나현지": "2631005", "천혜원": "2631017", "정윤탁": "2331020", "김시언": "2431023",
  "홍채영": "2431028", "양수인": "2531020", "임근희": "2531025", "김서연": "2531027", "고우현": "2232002",
  "김현겸": "2232073", "이주하": "2232078", "임한은": "2332060", "장예린": "2432082", "조은혜": "2531001",
  "이채원": "2531002", "홍세영": "2232099", "강준규": "2332025", "정하민": "2432053", "김현택": "2432092",
  "현재현": "2532023", "서보성": "2532024", "김동욱": "2532032", "김민종": "2532085",
  "계백": "2332033", "김이삭": "2431008", "주현우": "2432037", "양지성": "2432094", "이시영": "2532031",
  "김민혁": "2532033", "설완": "2532039", "이주영": "2132019", "조민식": "2232044", "정주원": "2332048",
  "안보은": "2332049", "최윤석": "2432045", "조준우": "2532052", "안재영": "2532078", "김은혜": "2332013",
  "김나연": "2432007", "조나림": "2432065", "김솔": "2432066", "강소이": "2432070", "박효은": "2432071",
  "이대호": "2532001", "허강석": "2532064", "신동준": "2332041", "최기준": "2332043", "조용성": "2332073",
  "김민지": "2232092", "백준오": "2332046", "김호정": "2432017", "허지우": "2432075", "김하진": "2432084",
  "이창현": "2532098", "고은채": "2312018", "이수인": "2412005", "고예은": "2412006", "서로다": "2412008",
  "김수아": "2412009"
};

function getDecryptedContent(msg, password, recipientName) {
  if (!isSecretMessage(msg)) return msg;

  const cleanName = recipientName ? recipientName.trim() : '';
  const expectedPassword = PROFILE_PASSWORDS[cleanName];

  if (expectedPassword) {
    if (Array.isArray(expectedPassword)) {
      if (expectedPassword.includes(password)) {
        return msg.substring('[SECRET]'.length);
      }
    } else if (password === expectedPassword) {
      return msg.substring('[SECRET]'.length);
    }
  }

  // Fallback if recipient not specified or not in list
  if (password === '1111') {
    return msg.substring('[SECRET]'.length);
  }
  return null;
}

function handleSecretCardUnlock(cardElement, rawMsg, textEl, recipientName) {
  // If already unlocked in session
  if (window.unlockedMessages.has(rawMsg)) {
    textEl.textContent = rawMsg.substring('[SECRET]'.length);
    cardElement.classList.remove('is-secret-locked');
    return;
  }

  const password = prompt('비밀글 암호를 입력하세요:');
  if (password === null) return;

  const decrypted = getDecryptedContent(rawMsg, password, recipientName);
  if (decrypted !== null) {
    window.unlockedMessages.add(rawMsg);
    textEl.textContent = decrypted;
    cardElement.classList.remove('is-secret-locked');
    const lockIndicator = cardElement.querySelector('.secret-lock-indicator');
    if (lockIndicator) {
      lockIndicator.innerHTML = '비밀글';
    }
  } else {
    alert('비밀번호가 일치하지 않습니다.');
  }
}

// ==========================================
// Guestbook App API
// ==========================================
const GuestbookApp = {

  /**
   * Get guestbook entries
   */
  async getEntries(limit = null) {
    if (supabaseClient) {
      let query = supabaseClient
        .from('guestbook_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    return this._getLocalEntries(limit);
  },

  /**
   * Add a new guestbook entry
   */
  async addEntry(entry) {
    const newEntry = {
      nickname: entry.nickname,
      message: entry.message,
      recipient: entry.recipient || null,
      created_at: new Date().toISOString()
    };

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('guestbook_entries')
        .insert([newEntry])
        .select();

      if (error) throw error;
      return data[0];
    }

    return this._addLocalEntry(newEntry);
  },

  /**
   * Get total entry count
   */
  async getCount() {
    if (supabaseClient) {
      const { count, error } = await supabaseClient
        .from('guestbook_entries')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    }

    const entries = JSON.parse(localStorage.getItem('gyeol_guestbook') || '[]');
    return entries.length;
  },

  // --- localStorage fallback methods ---

  _getLocalEntries(limit) {
    const entries = JSON.parse(localStorage.getItem('gyeol_guestbook') || '[]');
    entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return limit ? entries.slice(0, limit) : entries;
  },

  _addLocalEntry(entry) {
    const entries = JSON.parse(localStorage.getItem('gyeol_guestbook') || '[]');
    entry.id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    entries.push(entry);
    localStorage.setItem('gyeol_guestbook', JSON.stringify(entries));
    return entry;
  }
};

// ==========================================
// Common UI Logic
// ==========================================

// Header Actions (Theme Toggle & Search Toggle)
(function initHeaderActions() {
  document.addEventListener('DOMContentLoaded', () => {
    const navInner = document.querySelector('.nav-inner');
    if (!navInner) return;

    // Create action container
    const actions = document.createElement('div');
    actions.className = 'nav-actions';

    // Search Toggle Button
    const searchBtn = document.createElement('button');
    searchBtn.className = 'search-toggle-btn';
    searchBtn.id = 'searchToggle';
    searchBtn.setAttribute('aria-label', '검색');
    searchBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `;

    actions.appendChild(searchBtn);

    // Insert actions before navLinks or menu toggle
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
      navInner.insertBefore(actions, navLinks);
    } else {
      navInner.appendChild(actions);
    }

    // Force light mode theme always
    document.body.classList.add('light-mode');

    // Search open action
    searchBtn.addEventListener('click', openSearchModal);
  });
})();

// Navigation scroll effect
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });
})();

// Mobile nav toggle
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');

    const spans = toggle.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close on link click
  links.querySelectorAll('.nav-link, .nav-pill').forEach(link => {
    link.addEventListener('click', () => {
      if (links.classList.contains('open')) {
        links.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  });
})();

// Scroll reveal animations
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollReveal);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==========================================
// Search overlay & logic
// ==========================================
function openSearchModal() {
  let overlay = document.getElementById('searchOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'searchOverlay';
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-modal-container" onclick="event.stopPropagation()">
        <div class="search-modal-header">
          <svg class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="searchInput" class="search-input" placeholder="이름을 검색해 주세요" autocomplete="off">
          <button class="search-modal-close" id="searchCloseBtn">✕</button>
        </div>
        <div class="search-results-wrapper">
          <div class="search-results-info" id="searchResultsInfo">아티스트 또는 스태프의 이름을 입력해 주세요.</div>
          <div class="search-results-grid" id="searchResultsGrid"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', closeSearchModal);
    document.getElementById('searchCloseBtn').addEventListener('click', closeSearchModal);

    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => {
      performSearch(e.target.value.trim());
    });
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.getElementById('searchInput').focus();
  }, 100);
}

function closeSearchModal() {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    const grid = document.getElementById('searchResultsGrid');
    if (grid) grid.innerHTML = '';
    const info = document.getElementById('searchResultsInfo');
    if (info) info.textContent = '아티스트 또는 스태프의 이름을 입력해 주세요.';
  }
}

function performSearch(query) {
  const grid = document.getElementById('searchResultsGrid');
  const info = document.getElementById('searchResultsInfo');
  grid.innerHTML = '';

  if (!query) {
    info.textContent = '아티스트 또는 스태프의 이름을 입력해 주세요.';
    return;
  }

  const people = GyeolData.getAllPeople();
  const results = people.filter(p => p.name.includes(query) || p.roles.some(r => r.includes(query)));

  if (results.length === 0) {
    info.innerHTML = `"${escapeHtml(query)}"에 대한 검색 결과가 없습니다.`;
    return;
  }

  info.textContent = `검색 결과 ${results.length}명`;

  results.forEach(person => {
    const card = document.createElement('div');
    card.className = 'search-result-card';

    const initial = person.name.charAt(0);
    const imgPath = `assets/profiles/${person.name}.jpg`;
    const bgColor = getInitialBg(person.name);

    card.innerHTML = `
      <div class="search-result-photo" style="background:${bgColor}">
        <img src="${imgPath}" alt="${person.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="profile-initials" style="display:none;">${initial}</div>
      </div>
      <div class="search-result-info">
        <div class="search-result-name">${person.name.replace(/\(.*?\)/g, '')}</div>
        <div class="search-result-role">${person.roles.join(', ')}</div>
        <div class="search-result-song">${person.songs.join(' • ')}</div>
      </div>
    `;

    card.addEventListener('click', () => {
      closeSearchModal();
      openProfileModal(person);
    });

    grid.appendChild(card);
  });
}

// ==========================================
// Profile Details Modal
// ==========================================
async function openProfileModalByName(name) {
  const people = GyeolData.getAllPeople();
  const person = people.find(p => p.name === name);
  if (person) {
    openProfileModal(person);
  } else {
    // If not in standard database (fallback for custom names)
    openProfileModal({
      name: name,
      roles: ['공연 참가자'],
      songs: ['결 GYEOL']
    });
  }
}

async function openProfileModal(person) {
  let overlay = document.getElementById('profileOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'profileOverlay';
    overlay.className = 'profile-overlay';
    document.body.appendChild(overlay);
  }

  const initial = person.name.charAt(0);
  const imgPath = `assets/profiles/${person.name}.jpg`;
  const bgColor = getInitialBg(person.name);

  overlay.innerHTML = `
    <div class="profile-modal" onclick="event.stopPropagation()">
      <div class="profile-modal-header-section">
        <button class="profile-modal-close" id="profileCloseBtn">✕</button>
        <div class="profile-modal-meta">
          <div class="profile-modal-avatar" style="background:${bgColor}">
            <img src="${imgPath}" alt="${person.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="profile-initials" style="display:none; font-size:36px;">${initial}</div>
          </div>
          <div class="profile-modal-details">
            <h2 class="profile-modal-name">${person.name.replace(/\(.*?\)/g, '')}</h2>
            <p class="profile-modal-role">${person.roles.join(', ')}</p>
            <p class="profile-modal-song">${person.songs.join(' • ')}</p>
          </div>
        </div>
      </div>
      
      <div class="profile-modal-body">
        <div class="profile-guestbook-header">
          <h3>방명록 Messages</h3>
          <span class="profile-msg-count" id="profileMsgCount">—</span>
        </div>
        
        <div class="profile-guestbook-list" id="profileGuestbookList">
          <div class="skeleton-list">
            <div class="skeleton skeleton-card" style="height:80px; margin-bottom:12px;"></div>
            <div class="skeleton skeleton-card" style="height:80px;"></div>
          </div>
        </div>
        
        <button class="profile-write-btn" id="profileWriteBtn">
          ${person.name.replace(/\(.*?\)/g, '')}님에게 방명록 작성하기
        </button>
      </div>
    </div>
  `;

  overlay.addEventListener('click', closeProfileModal);
  document.getElementById('profileCloseBtn').addEventListener('click', closeProfileModal);

  document.getElementById('profileWriteBtn').addEventListener('click', () => {
    closeProfileModal();
    openWriteModal(person.name);
  });

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Load guestbook entries for this recipient
  try {
    const listEl = document.getElementById('profileGuestbookList');
    const countEl = document.getElementById('profileMsgCount');

    const allEntries = await GuestbookApp.getEntries();
    const filtered = allEntries.filter(entry => {
      if (!entry.recipient) return false;
      const rec = entry.recipient.trim();
      if (rec === person.name) return true;
      // Fallback for legacy messages sent to "김민준" (shows on both profiles)
      if (rec === '김민준' && person.name.startsWith('김민준')) return true;
      return false;
    });

    countEl.textContent = `${filtered.length}개의 메시지`;
    listEl.innerHTML = '';

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="profile-empty-state">
          <div>아직 메시지가 없습니다.</div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">첫 번째 따뜻한 한마디를 남겨보세요!</div>
        </div>
      `;
      return;
    }

    filtered.forEach((entry, index) => {
      const card = document.createElement('div');
      const date = new Date(entry.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      });

      const secret = isSecretMessage(entry.message);
      const isUnlocked = window.unlockedMessages.has(entry.message);

      card.className = `profile-entry-card${secret && !isUnlocked ? ' is-secret-locked' : ''}`;

      const contentHtml = secret && !isUnlocked
        ? `<p class="profile-entry-msg secret-text">비밀 메시지입니다. (클릭하여 열기)</p>`
        : `<p class="profile-entry-msg">${escapeHtml(secret ? entry.message.substring(8) : entry.message)}</p>`;

      card.innerHTML = `
        ${contentHtml}
        <div class="profile-entry-footer">
          <span class="profile-entry-author">From. ${escapeHtml(entry.nickname)}</span>
          <span class="profile-entry-date">${date}</span>
        </div>
      `;

      if (secret && !isUnlocked) {
        card.addEventListener('click', () => {
          const textEl = card.querySelector('.profile-entry-msg');
          handleSecretCardUnlock(card, entry.message, textEl, person.name);
        });
      }

      listEl.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load profile guestbook:', error);
    document.getElementById('profileGuestbookList').innerHTML = `
      <div class="profile-empty-state">
        <div>에러가 발생했습니다.</div>
      </div>
    `;
  }
}

function closeProfileModal() {
  const overlay = document.getElementById('profileOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// Dynamic Write Guestbook Modal
// ==========================================
function openWriteModal(recipientName = '') {
  let overlay = document.getElementById('appWriteOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'appWriteOverlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h2 class="modal-title">방명록 남기기</h2>
        <button class="modal-close" id="appWriteCloseBtn">✕</button>
      </div>
      <div class="modal-body">
        <form id="appWriteForm">
          <div class="form-group">
            <label class="form-label" for="appNickname">닉네임</label>
            <input 
              class="form-input" 
              type="text" 
              id="appNickname" 
              name="nickname"
              placeholder="이름 또는 닉네임을 입력하세요"
              maxlength="30"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="appRecipient">받는 사람</label>
            <input 
              class="form-input" 
              type="text" 
              id="appRecipient" 
              name="recipient"
              value="${recipientName}"
              readonly
              style="background:rgba(255,255,255,0.02); color:var(--text-secondary); cursor:not-allowed;"
            >
          </div>
          <div class="form-group">
            <label class="form-label" for="appMessage">메시지</label>
            <textarea 
              class="form-textarea" 
              id="appMessage" 
              name="message"
              placeholder="${recipientName}님에게 축하, 응원, 감사의 메시지를 남겨주세요"
              maxlength="500"
              required
            ></textarea>
            <div class="form-char-count" id="appCharCount">0 / 500</div>
            <div class="form-warning-text" style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px; line-height: 1.45; letter-spacing: -0.01em; word-break: keep-all;">
              욕설 • 비방 등 부적절한 게시물은 삭제될 수 있으며, 작성자는 이에 대한 법적 책임을 질 수 있습니다.
            </div>
          </div>
          
          <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-top: 16px; margin-bottom: 24px;">
            <input type="checkbox" id="appIsSecret" name="isSecret" style="width: 18px; height: 18px; cursor: pointer;">
            <label for="appIsSecret" style="font-size: 13.5px; font-weight: 500; cursor: pointer; color: var(--text-secondary); user-select: none;">
              비밀 메시지로 남기기
            </label>
          </div>

          <button type="submit" class="form-submit" id="appSubmitBtn">
            등록하기
          </button>
        </form>
      </div>
    </div>
  `;

  overlay.addEventListener('click', closeWriteModal);
  document.getElementById('appWriteCloseBtn').addEventListener('click', closeWriteModal);

  const textarea = document.getElementById('appMessage');
  textarea.addEventListener('input', function () {
    const count = this.value.length;
    const countEl = document.getElementById('appCharCount');
    countEl.textContent = `${count} / 500`;
    countEl.className = count > 450 ? 'form-char-count warning' : 'form-char-count';
  });

  document.getElementById('appWriteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('appSubmitBtn');
    const nickname = document.getElementById('appNickname').value.trim();
    const recipient = document.getElementById('appRecipient').value.trim();
    const message = textarea.value.trim();
    const isSecret = document.getElementById('appIsSecret').checked;

    if (!nickname || !message) return;

    btn.classList.add('loading');
    btn.disabled = true;

    const finalMessage = isSecret ? `[SECRET]${message}` : message;

    try {
      await GuestbookApp.addEntry({
        nickname,
        recipient: recipient || null,
        message: finalMessage
      });

      showAppToast('success', '✅', '메시지가 등록되었습니다!');
      closeWriteModal();

      // Refresh guestbook lists
      if (typeof loadEntries === 'function') {
        loadEntries();
      }
      if (typeof reloadHomeEntries === 'function') {
        reloadHomeEntries();
      }

      // Reopen profile modal to show new message
      const people = GyeolData.getAllPeople();
      const person = people.find(p => p.name === recipient);
      if (person) {
        setTimeout(() => {
          openProfileModal(person);
        }, 500);
      }

    } catch (error) {
      console.error('Submit error:', error);
      showAppToast('error', '❌', '등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    document.getElementById('appNickname').focus();
  }, 100);
}

function closeWriteModal() {
  const overlay = document.getElementById('appWriteOverlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showAppToast(type, icon, message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon" id="appToastIcon"></span>
      <span id="appToastMessage"></span>
    `;
    document.body.appendChild(toast);
  }

  const toastIcon = document.getElementById('appToastIcon');
  const toastMessage = document.getElementById('appToastMessage');

  toast.className = `toast ${type}`;
  toastIcon.textContent = icon;
  toastMessage.textContent = message;

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Global openModal overwrite (guides users to click a profile)
window.openModal = function () {
  openSearchModal();
  setTimeout(() => {
    const info = document.getElementById('searchResultsInfo');
    if (info) {
      info.innerHTML = `<span style="color:var(--text-primary); font-weight:600;">메시지를 전할 분을 먼저 선택해 주세요.</span><br>이름을 검색하고 프로필을 클릭하면 방명록 작성이 가능합니다.`;
    }
  }, 150);
};

// Keyboard listener for Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearchModal();
    closeProfileModal();
    closeWriteModal();
  }
});

// Initialize Quick Scroll (Top / Bottom) Buttons
(function initQuickScroll() {
  document.addEventListener('DOMContentLoaded', () => {
    // Create container
    const container = document.createElement('div');
    container.className = 'quick-scroll-container';

    // Top Button
    const topBtn = document.createElement('button');
    topBtn.className = 'quick-scroll-btn';
    topBtn.id = 'quickScrollTop';
    topBtn.setAttribute('aria-label', '맨 위로 이동');
    topBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Bottom Button
    const bottomBtn = document.createElement('button');
    bottomBtn.className = 'quick-scroll-btn';
    bottomBtn.id = 'quickScrollBottom';
    bottomBtn.setAttribute('aria-label', '맨 아래로 이동');
    bottomBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;
    bottomBtn.addEventListener('click', () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });

    container.appendChild(topBtn);
    container.appendChild(bottomBtn);
    document.body.appendChild(container);
  });
})();
