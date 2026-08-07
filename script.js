// interactive for roblox world
document.addEventListener('DOMContentLoaded', () => {

  // cards for open modal when a card is clicked for the "WHY roblox"
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

  let quizUnlockTime = null; // in-memory only — resets on page reload
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
    if (isQuizLocked()) { showLockedState(); return; }

    document.getElementById('quiz-locked').classList.add('hidden');
    const questionBox = document.getElementById('quiz-question-box');
    const completeBox = document.getElementById('quiz-complete');
    if (!questionBox) return;
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

  //modals(shared), close modal by close button or clicking outside the box
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.hasAttribute('data-close')) {
        overlay.classList.remove('active');
      }
    });
  });

});
