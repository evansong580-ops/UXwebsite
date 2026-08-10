// interactive for roblox world
document.addEventListener('DOMContentLoaded', () => {

  // when card is click on  "WHY roblox"
  const modalCards = document.querySelectorAll('.card[data-modal]');
  modalCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      document.getElementById(modalId).classList.add('active');
    });
  });

  // video , thumbnail click to play
  const heroPlayBtn = document.getElementById('hero-play-video-btn');
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      const box = document.getElementById('hero-video-box');
      box.innerHTML = `
        <iframe src="https://www.youtube.com/embed/sme76WoJ_-U?autoplay=1"
          title="Roblox Official Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`;
    });
  }

  // table for sort, search, scroll fade
  const gamesTbody = document.getElementById('games-tbody');
  const gamesTableWrap = document.getElementById('games-table-wrap');
  const gamesScrollWrap = document.querySelector('.table-scroll-wrap');
  const gameSearchInput = document.getElementById('game-search');
  const sortHeaders = document.querySelectorAll('#games-table thead th[data-sort]');

  function renumberRows() {
    if (!gamesTbody) return;
    const medals = ['🥇', '🥈', '🥉'];
    Array.from(gamesTbody.querySelectorAll('tr')).forEach((row, i) => {
      row.children[0].innerHTML = medals[i] ? `${medals[i]} ${i + 1}` : i + 1;
    });
  }

  function sortRows(key, type, asc) {
    const rows = Array.from(gamesTbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      let valA = a.dataset[key];
      let valB = b.dataset[key];
      if (type === 'number') { valA = parseFloat(valA); valB = parseFloat(valB); }
      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
    rows.forEach(row => gamesTbody.appendChild(row));
    renumberRows();
  }

  sortHeaders.forEach(th => {
    const arrow = document.createElement('span');
    arrow.className = 'sort-arrow';
    arrow.textContent = '↕';
    th.appendChild(arrow);

    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      const type = th.dataset.type;
      const isAsc = !th.classList.contains('sorted-asc');
      sortHeaders.forEach(h => {
        h.classList.remove('sorted-asc', 'sorted-desc');
        h.querySelector('.sort-arrow').textContent = '↕';
      });
      th.classList.add(isAsc ? 'sorted-asc' : 'sorted-desc');
      th.querySelector('.sort-arrow').textContent = isAsc ? '↑' : '↓';
      sortRows(key, type, isAsc);
    });
  });

  if (gameSearchInput) {
    gameSearchInput.addEventListener('input', () => {
      const val = gameSearchInput.value.trim().toLowerCase();
      Array.from(gamesTbody.querySelectorAll('tr')).forEach(row => {
        const match = row.dataset.title.toLowerCase().includes(val) ||
                       row.dataset.genre.toLowerCase().includes(val);
        row.classList.toggle('hidden', val !== '' && !match);
      });
    });
  }

  if (gamesTableWrap && gamesScrollWrap) {
    function checkScrollBottom() {
      const atBottom = gamesTableWrap.scrollHeight - gamesTableWrap.scrollTop - gamesTableWrap.clientHeight < 4;
      gamesScrollWrap.classList.toggle('at-bottom', atBottom);
    }
    gamesTableWrap.addEventListener('scroll', checkScrollBottom);
    checkScrollBottom();
  }

  renumberRows();



  // login and friends
  const mockUsernames = [
    'Builderman', 'xX_Shadow_Xx', 'RobloxRex', 'PixelNoah', 'GalaxyGamerz',
    'LunaCraft22', 'TycoonTom', 'BloxyBella', 'NoobMaster69', 'SkyeRunner',
    'CrimsonKit', 'ZanyZane', 'PixelPeach', 'BlockBuilder', 'MysticMira',
    'JettStream', 'EchoRealm', 'CoralCove', 'ForgeKnight', 'VelvetVibe'
  ];

  let friendsData = [];
  let receivedRequests = [];
  let sentRequests = [];

  function renderFriendsList() {
    const list = document.getElementById('friends-list');
    list.innerHTML = friendsData.length
      ? friendsData.map(name => `<li>&#128100; ${name}</li>`).join('')
      : '<li style="opacity:0.6;">No friends yet — add some above!</li>';
  }

  function renderReceivedList() {
    const list = document.getElementById('received-list');
    const badge = document.getElementById('received-badge');
    list.innerHTML = receivedRequests.length
      ? receivedRequests.map((name, i) => `
        <li>
          <span>&#128100; ${name}</span>
          <span>
            <button class="friend-mini-btn accept" data-accept="${i}" type="button">Accept</button>
            <button class="friend-mini-btn decline" data-decline="${i}" type="button">Decline</button>
          </span>
        </li>`).join('')
      : '<li style="opacity:0.6;">No pending requests.</li>';
    badge.textContent = receivedRequests.length;
    badge.classList.toggle('hidden', receivedRequests.length === 0);

    list.querySelectorAll('[data-accept]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.accept);
        friendsData.push(receivedRequests[idx]);
        receivedRequests.splice(idx, 1);
        renderFriendsList(); renderReceivedList();
      });
    });
    list.querySelectorAll('[data-decline]').forEach(btn => {
      btn.addEventListener('click', () => {
        receivedRequests.splice(Number(btn.dataset.decline), 1);
        renderReceivedList();
      });
    });
  }

  function renderSentList() {
    const list = document.getElementById('sent-list');
    list.innerHTML = sentRequests.length
      ? sentRequests.map(name => `<li>&#128100; ${name} <span style="opacity:0.6;">Pending</span></li>`).join('')
      : '<li style="opacity:0.6;">No requests sent yet.</li>';
  }

  const playLoginBtn = document.getElementById('play-login-btn');
  if (playLoginBtn) {
    playLoginBtn.addEventListener('click', () => {
      const username = document.getElementById('play-username').value.trim();
      const password = document.getElementById('play-password').value.trim();
      if (!username || !password) { alert('Please enter a username and password.'); return; }
      document.getElementById('play-welcome-name').textContent = username;
      document.getElementById('play-login-step').classList.add('hidden');
      document.getElementById('play-friends-step').classList.remove('hidden');

      // login with friends already added in the account
      friendsData = ['Builderman', 'LunaCraft22', 'TycoonTom'];
      receivedRequests = ['xX_Shadow_Xx', 'PixelNoah'];
      sentRequests = [];
      renderFriendsList(); renderReceivedList(); renderSentList();
    });
  }

  // friend search, add friend
  const friendSearchInput = document.getElementById('friend-search');
  const friendAddBtn = document.getElementById('friend-add-btn');

  function sendFriendRequest(name) {
    if (!name) return;
    if (friendsData.includes(name)) { alert(`${name} is already your friend.`); return; }
    if (sentRequests.includes(name)) { alert(`You already sent ${name} a request.`); return; }
    sentRequests.push(name);
    renderSentList();
    friendSearchInput.value = '';
    const suggestBox = document.getElementById('friend-suggestions');
    suggestBox.classList.add('hidden');
    suggestBox.innerHTML = '';
  }

  function showSuggestions() {
    const val = friendSearchInput.value.trim().toLowerCase();
    const suggestBox = document.getElementById('friend-suggestions');
    if (!val) { suggestBox.classList.add('hidden'); suggestBox.innerHTML = ''; return; }

    const available = mockUsernames.filter(name => !friendsData.includes(name) && !sentRequests.includes(name));
    let matches = available.filter(name => name.toLowerCase().startsWith(val));

    // if no direct matches, pad with other suggested names so there's always something to browse
    if (matches.length < 4) {
      const extras = available.filter(name => !matches.includes(name));
      matches = matches.concat(extras.slice(0, 4 - matches.length));
    }
    matches = matches.slice(0, 5);

    suggestBox.innerHTML = matches.map(name => `<li data-pick="${name}">&#128269; ${name}</li>`).join('');
    suggestBox.classList.remove('hidden');
    suggestBox.querySelectorAll('[data-pick]').forEach(li => {
      li.addEventListener('click', () => sendFriendRequest(li.dataset.pick));
    });
  }

  if (friendSearchInput) {
    friendSearchInput.addEventListener('input', showSuggestions);
    friendSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendFriendRequest(friendSearchInput.value.trim());
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.friend-search-wrap')) {
        document.getElementById('friend-suggestions').classList.add('hidden');
      }
    });
  }
  if (friendAddBtn) {
    friendAddBtn.addEventListener('click', () => sendFriendRequest(friendSearchInput.value.trim()));
  }

  // friends tabs
  document.querySelectorAll('.friends-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.friends-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.friends-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('ftab-' + tab.dataset.ftab).classList.add('active');
    });
  });

  // "earn robux", login, tabs, quiz 
  let robuxBalance = 0;
  let quizRobux = 0;
  let quizIndex = 0;

  const earnLoginBtn = document.getElementById('earn-login-btn');
  if (earnLoginBtn) {
    earnLoginBtn.addEventListener('click', () => {
      const username = document.getElementById('earn-username').value.trim();
      const password = document.getElementById('earn-password').value.trim();
      if (!username || !password) { alert('Please enter a username and password.'); return; }
      document.getElementById('earn-welcome-name').textContent = username;
      document.getElementById('earn-login-step').classList.add('hidden');
      document.getElementById('earn-main').classList.remove('hidden');
      document.getElementById('robux-balance').textContent = robuxBalance;
    });
  }

  const earnTabs = document.querySelectorAll('.earn-tab');
  earnTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      earnTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.earn-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  const quizQuestions = [
    { q: 'What year was Roblox founded?', options: ['2004', '2010', '2016'], answer: '2004' },
    { q: "What is Roblox's scripting language called?", options: ['Python', 'Lua', 'JavaScript'], answer: 'Lua' },
    { q: 'What tool is used to build Roblox games?', options: ['Roblox Studio', 'Unity', 'Blender'], answer: 'Roblox Studio' },
    { q: 'What is the in-game currency called?', options: ['Coins', 'Gems', 'Robux'], answer: 'Robux' },
    { q: 'What program lets developers cash out Robux?', options: ['DevEx', 'RoCash', 'ExChange'], answer: 'DevEx' }
  ];

  let quizUnlockTime = null;
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  let countdownInterval = null;

  function isQuizLocked() {
    return quizUnlockTime !== null && Date.now() < quizUnlockTime;
  }

  function formatCountdown(msLeft) {
    const days = Math.floor(msLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const mins = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
    const secs = Math.floor((msLeft % (60 * 1000)) / 1000);
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  }

  function startCountdown(timerElId) {
    if (countdownInterval) clearInterval(countdownInterval);
    const timerEl = document.getElementById(timerElId);
    function tick() {
      const msLeft = quizUnlockTime - Date.now();
      if (msLeft <= 0) {
        clearInterval(countdownInterval);
        quizUnlockTime = null;
        quizIndex = 0;
        quizRobux = 0;
        document.getElementById('quiz-robux').textContent = 0;
        document.getElementById('quiz-locked').classList.add('hidden');
        loadQuizQuestion();
        return;
      }
      if (timerEl) timerEl.textContent = formatCountdown(msLeft);
    }
    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  function showLockedState() {
    document.getElementById('quiz-question-box').classList.add('hidden');
    document.getElementById('quiz-complete').classList.add('hidden');
    document.getElementById('quiz-locked').classList.remove('hidden');
    startCountdown('quiz-countdown-timer-locked');
  }

  function loadQuizQuestion() {
    const questionBox = document.getElementById('quiz-question-box');
    if (!questionBox) return; 

    if (isQuizLocked()) { showLockedState(); return; }

    document.getElementById('quiz-locked').classList.add('hidden');
    const completeBox = document.getElementById('quiz-complete');
    if (quizIndex >= quizQuestions.length) {
      questionBox.classList.add('hidden');
      completeBox.classList.remove('hidden');
      document.getElementById('quiz-final-robux').textContent = quizRobux;
      quizUnlockTime = Date.now() + WEEK_MS;
      startCountdown('quiz-countdown-timer');
      return;
    }
    questionBox.classList.remove('hidden');
    completeBox.classList.add('hidden');
    const current = quizQuestions[quizIndex];
    document.getElementById('quiz-count').textContent = quizIndex + 1;
    document.getElementById('quiz-question').textContent = current.q;
    const optionsBox = document.getElementById('quiz-options');
    optionsBox.innerHTML = '';
    current.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-btn';
      btn.type = 'button';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleQuizAnswer(opt, current.answer, btn));
      optionsBox.appendChild(btn);
    });
  }

  function handleQuizAnswer(selected, correct, btnEl) {
    const optionsBox = document.getElementById('quiz-options');
    optionsBox.querySelectorAll('button').forEach(b => b.disabled = true);
    if (selected === correct) {
      const reward = Math.floor(Math.random() * 6) + 5;
      quizRobux += reward;
      document.getElementById('quiz-robux').textContent = quizRobux;
      btnEl.classList.add('correct');
      btnEl.textContent = `✓ ${selected} (+${reward} R$)`;
    } else {
      btnEl.classList.add('wrong');
      optionsBox.querySelectorAll('button').forEach(b => {
        if (b.textContent === correct) {
          b.classList.add('correct');
          b.textContent = `✓ ${correct}`;
        }
      });
    }
    setTimeout(() => {
      quizIndex++;
      loadQuizQuestion();
    }, 1200);
  }

  loadQuizQuestion();

  const cashoutBtn = document.getElementById('cashout-btn');
  if (cashoutBtn) {
    cashoutBtn.addEventListener('click', () => {
      robuxBalance += quizRobux;
      document.getElementById('robux-balance').textContent = robuxBalance;
      alert(`Cashed out ${quizRobux} Robux! New balance: ${robuxBalance} R$`);
      showLockedState();
    });
  }

  //close modal by close button or clicking outside the box
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.hasAttribute('data-close')) {
        overlay.classList.remove('active');
      }
    });
  });

  // for builds.html

  const bBuildsData = {
    1: {
      icon: '&#127968;', bg: 'b-bg1', title: 'Sky City', genre: 'Roleplay',
      visits: '2.1K', rating: '4.9', active: '24', likePercent: 96, favorites: '512',
      created: 'Mar 14, 2023', updated: 'Jun 2, 2026', serverSize: '24',
      desc: 'A floating city above the clouds with glass bridges and sky trains connecting five districts.',
      details: 'Sky City is a fully scripted roleplay world featuring a custom day/night cycle, a working tram system players can ride between districts, and over 40 player-owned apartments. It was my first large-scale terrain + streaming build.'
    },
    2: {
      icon: '&#129399;', bg: 'b-bg2', title: 'Ninja Obby', genre: 'Obby',
      visits: '1.8K', rating: '4.7', active: '31', likePercent: 92, favorites: '388',
      created: 'Jan 9, 2023', updated: 'Jul 18, 2026', serverSize: '20',
      desc: '100-stage parkour challenge inspired by ninja warrior courses.',
      details: 'A checkpoint-based obstacle course with difficulty scaling from easy to insane. Includes moving platforms, disappearing blocks, and a leaderboard tracking fastest clear times.'
    },
    3: {
      icon: '&#127796;', bg: 'b-bg3', title: 'Jungle Tycoon', genre: 'Tycoon',
      visits: '1.5K', rating: '4.6', active: '15', likePercent: 89, favorites: '301',
      created: 'Aug 22, 2023', updated: 'May 30, 2026', serverSize: '16',
      desc: 'Build your own jungle empire and defend it from raiders.',
      details: 'Classic drop-and-collect tycoon loop with base building, a defense-wave system, and upgrade trees. Scripted entirely in Lua with a custom save/load data store.'
    },
    4: {
      icon: '&#9749;', bg: 'b-bg4', title: 'Café Simulator', genre: 'Simulation',
      visits: '940', rating: '4.8', active: '9', likePercent: 97, favorites: '220',
      created: 'Nov 3, 2023', updated: 'Apr 11, 2026', serverSize: '12',
      desc: "Run your own café, hire staff, and serve customers in this chill sim.",
      details: 'Players take orders, brew drinks, and manage a growing staff of NPC baristas. Features a cosmetics shop for customizing the café interior.'
    },
    5: {
      icon: '&#9876;&#65039;', bg: 'b-bg5', title: 'Battle Arena X', genre: 'PvP',
      visits: '1.2K', rating: '4.5', active: '27', likePercent: 84, favorites: '260',
      created: 'Feb 17, 2024', updated: 'Jul 2, 2026', serverSize: '20',
      desc: 'Fast-paced PvP arena with 5 unique maps and weapon loadouts.',
      details: 'Round-based PvP with a loadout picker, respawn shields, and a ranked matchmaking queue. Built with custom hit registration and weapon balancing.'
    },
    6: {
      icon: '&#127754;', bg: 'b-bg6', title: 'Deep Ocean World', genre: 'Adventure',
      visits: '870', rating: '4.7', active: '6', likePercent: 93, favorites: '190',
      created: 'Jun 30, 2024', updated: 'Mar 8, 2026', serverSize: '12',
      desc: 'Underwater exploration game with hidden caves and treasure hunts.',
      details: 'An exploration-focused world with a swim/dive system, oxygen management, and procedurally scattered treasure chests hidden across 6 underwater biomes.'
    },
    7: {
      icon: '&#129497;', bg: 'b-bg7', title: 'Zombie Outbreak', genre: 'Survival',
      visits: '3.2K', rating: '4.8', active: '52', likePercent: 95, favorites: '780',
      created: 'Sep 12, 2024', updated: 'Aug 1, 2026', serverSize: '8',
      desc: 'Survive endless waves of zombies and fortify your base with friends.',
      details: 'Co-op survival with a wave-based zombie AI director, buildable barricades, and a resource-scavenging loop across a mid-sized town map.'
    },
    8: {
      icon: '&#127950;', bg: 'b-bg8', title: 'Speed Run Kingdom', genre: 'Racing',
      visits: '2.6K', rating: '4.6', active: '40', likePercent: 90, favorites: '610',
      created: 'Dec 1, 2024', updated: 'Jul 25, 2026', serverSize: '16',
      desc: 'Race through checkpoints across 20 tracks with drift-based cars.',
      details: 'A drift-physics racing game with 20 handcrafted tracks, a garage for unlocking cars, and ghost replays of your best lap.'
    },
    9: {
      icon: '&#128062;', bg: 'b-bg9', title: 'Pet Adoption Paradise', genre: 'Simulation',
      visits: '4.1K', rating: '4.9', active: '68', likePercent: 98, favorites: '1.1K',
      created: 'Jan 20, 2025', updated: 'Aug 5, 2026', serverSize: '30',
      desc: 'Hatch, raise, and trade collectible pets in a cozy open world.',
      details: 'My most popular build — egg hatching mechanics, a pet trading system with anti-scam confirmation, and rotating limited-time pet events.'
    },
    10: {
      icon: '&#128084;', bg: 'b-bg10', title: 'Mystic Fashion Runway', genre: 'Roleplay',
      visits: '610', rating: '4.4', active: '4', likePercent: 88, favorites: '140',
      created: 'Apr 5, 2025', updated: 'Jun 14, 2026', serverSize: '12',
      desc: 'Design outfits, walk the runway, and compete in style showdowns.',
      details: 'Players mix and match a large wardrobe of accessories, then walk a runway judged by other players in themed weekly showdowns.'
    },
    11: {
      icon: '&#128737;&#65039;', bg: 'b-bg11', title: 'Block Wars Royale', genre: 'Battle Royale',
      visits: '1.9K', rating: '4.7', active: '35', likePercent: 91, favorites: '420',
      created: 'May 19, 2025', updated: 'Jul 30, 2026', serverSize: '24',
      desc: 'Last block standing — loot, build, and battle across a shrinking map.',
      details: 'Battle royale with a shrinking safe-zone, lootable chests, and lightweight building. Supports up to 24 players per match.'
    },
    12: {
      icon: '&#127890;', bg: 'b-bg12', title: 'Haunted Mansion Escape', genre: 'Horror',
      visits: '1.1K', rating: '4.5', active: '11', likePercent: 94, favorites: '260',
      created: 'Jul 8, 2025', updated: 'Aug 6, 2026', serverSize: '6',
      desc: "Solve puzzles and escape a haunted mansion before it's too late.",
      details: 'A co-op puzzle-horror experience with a scripted AI "haunting" system that reacts to how long players linger in each room.'
    }
  };

  const bBuildsGrid = document.getElementById('b-builds-grid');
  const bModalOverlay = document.getElementById('b-modal-overlay');
  const bModalContent = document.getElementById('b-modal-content');

  function bOpenModal(id) {
    const build = bBuildsData[id];
    if (!build || !bModalContent || !bModalOverlay) return;

    bModalContent.innerHTML = `
      <div class="b-modal-banner ${build.bg}">
        <button class="b-back-btn" type="button" data-b-close title="Back to builds">&#8592;</button>
        <span class="b-modal-genre-chip">${build.genre}</span>
        <span class="b-modal-banner-icon">${build.icon}</span>
      </div>

      <h2>${build.title}</h2>
      <div class="b-modal-creator">by <span>YourUsername</span> &middot; ${build.visits} visits</div>

      <a class="b-play-btn" href="https://www.roblox.com/discover/" target="_blank" rel="noopener noreferrer">&#9654; Play on Roblox</a>
      <div class="b-play-note">Opens roblox.com in a new tab</div>

      <div class="b-modal-statbar">
        <div class="b-modal-stat">
          <div class="b-modal-stat-num">&#128101; ${build.active}</div>
          <div class="b-modal-stat-label">Playing</div>
        </div>
        <div class="b-stat-divider"></div>
        <div class="b-modal-stat">
          <div class="b-modal-stat-num">&#128077; ${build.likePercent}%</div>
          <div class="b-like-bar"><div class="b-like-bar-fill" style="width:${build.likePercent}%"></div></div>
          <div class="b-modal-stat-label">Liked</div>
        </div>
        <div class="b-stat-divider"></div>
        <div class="b-modal-stat">
          <div class="b-modal-stat-num">&#11088; ${build.favorites}</div>
          <div class="b-modal-stat-label">Favorites</div>
        </div>
      </div>

      <p class="b-modal-text">${build.desc}</p>
      <p class="b-modal-text">${build.details}</p>

      <div class="b-modal-meta">
        <div class="b-modal-meta-item">Created<span>${build.created}</span></div>
        <div class="b-modal-meta-item">Last Updated<span>${build.updated}</span></div>
        <div class="b-modal-meta-item">Server Size<span>${build.serverSize} players</span></div>
        <div class="b-modal-meta-item">Genre<span>${build.genre}</span></div>
      </div>
    `;
    bModalOverlay.classList.add('b-active');
  }

  function bCloseModal() {
    if (bModalOverlay) bModalOverlay.classList.remove('b-active');
  }

  if (bBuildsGrid) {
    bBuildsGrid.querySelectorAll('.b-build-card').forEach(card => {
      card.addEventListener('click', () => {
        bOpenModal(card.dataset.bBuild);
      });
    });
  }

  if (bModalOverlay) {
    bModalOverlay.addEventListener('click', (e) => {
      if (e.target === bModalOverlay || e.target.hasAttribute('data-b-close')) {
        bCloseModal();
      }
    });
  }


  // form pop up 
  // when click submit it shows a small confirmation popup with the entered details
 

  const bRequestForm = document.getElementById('b-request-form');
  const bFormModalOverlay = document.getElementById('b-form-modal-overlay');
  const bFormModalContent = document.getElementById('b-form-modal-content');

  function bEscapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (bRequestForm && bFormModalOverlay && bFormModalContent) {
    bRequestForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = bRequestForm.querySelector('#b-req-name').value.trim();
      const email = bRequestForm.querySelector('#b-req-email').value.trim();
      const genre = bRequestForm.querySelector('#b-req-genre').value;
      const budget = bRequestForm.querySelector('#b-req-budget').value.trim();
      const description = bRequestForm.querySelector('#b-req-desc').value.trim();

      const rows = [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Build Type', value: genre },
        { label: 'Budget', value: budget ? `${budget} R$` : '' },
        { label: 'Idea', value: description }
      ].filter(r => r.value);

      bFormModalContent.innerHTML = `
        <div class="b-form-check">&#10003;</div>
        <h3>Thanks${name ? ', ' + bEscapeHtml(name) : ''}!</h3>
        <p class="b-form-sub">Your request has been submitted.</p>
        <div class="b-form-summary">
          ${rows.map(r => `
            <div class="b-form-summary-row">
              <span class="b-fs-label">${r.label}</span>
              <span class="b-fs-value">${bEscapeHtml(r.value)}</span>
            </div>
          `).join('')}
        </div>
      `;

      bFormModalOverlay.classList.add('b-active');
      bRequestForm.reset();
    });

    bFormModalOverlay.addEventListener('click', (e) => {
      if (e.target === bFormModalOverlay || e.target.hasAttribute('data-b-form-close')) {
        bFormModalOverlay.classList.remove('b-active');
      }
    });
  }

});
