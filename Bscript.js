document.addEventListener('DOMContentLoaded', () => {
    // Community Form Handler
    const communityForm = document.getElementById('communityForm');

    if (communityForm) {
        communityForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('communityEmail');
            const thankYouEmail = document.getElementById('thankYouEmail');
            if (thankYouEmail) {
                thankYouEmail.textContent = (emailInput && emailInput.value) ? emailInput.value : 'your email';
            }

            communityForm.reset();
            openNamedModal('thankYouModal');
        });
    }

    // Dynamic Active Nav Highlight (fallback)
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.rw-navbar .nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // ===== Milestone Popup =====
    const milestoneData = {
        '2021': {
            icon: '🏁',
            title: 'The game that hooked me: Legends of Speed',
            desc: 'The very first game I ever played on Roblox was Legends of Speed — a simple run-and-upgrade racer where you sprint down a track collecting speed boosts. I liked it because it was so easy to just pick up and play, but it still gave me that rush of watching a number go up and unlocking a faster run. It is the reason I stuck with Roblox instead of closing it after five minutes, and honestly the reason I ever opened Studio in the first place.'
        },
        '2022': {
            icon: '🧱',
            title: 'Learning to build, one block at a time',
            desc: 'This was the year Roblox Studio stopped being intimidating. I followed along with a few tutorials, made a mess of parts and scripts, and eventually pieced together my first obby course. It was rough around the edges, but finishing something I could actually walk through and jump across felt like a huge win.'
        },
        '2023': {
            icon: '🚀',
            title: '"Sky City" goes live',
            desc: 'Publishing Sky City was the first time strangers actually played something I made. Watching the visit counter climb past 500 in the first week was surreal — it turned building from a hobby I did alone into something I was making for other people.'
        },
        '2024': {
            icon: '💻',
            title: 'Getting serious with Lua',
            desc: 'This was the year building stopped being just placing parts and became actual programming. Learning Lua let me add interactive NPCs and a real leaderboard system, and it changed how I thought about game design — from "how does it look" to "how does it behave."'
        },
        '2025': {
            icon: '📈',
            title: 'Crossing 5,000 visits',
            desc: 'By this point I had grown my catalog to six published games and crossed 5,000 total visits combined. It was a good reminder that consistency matters more than any single big hit — small, steady projects added up.'
        },
        '2026': {
            icon: '⚔️',
            title: 'Building the multiplayer RPG',
            desc: 'My current project and the biggest thing I have attempted so far: a full multiplayer RPG. The goal is 10,000 visits and a community of 100+ regulars. It is pushing me to learn more about server-side scripting, data stores, and actually designing systems that work with other players, not just around them.'
        }
    };

    const overlay = document.getElementById('milestoneOverlay');
    const closeBtn = document.getElementById('milestoneClose');
    const iconEl = document.getElementById('milestoneIcon');
    const yearEl = document.getElementById('milestoneYear');
    const titleEl = document.getElementById('milestoneTitle');
    const descEl = document.getElementById('milestoneDesc');
    const rows = document.querySelectorAll('.rw-table-row[data-milestone]');

    let lastFocused = null;

    function openMilestone(key) {
        const data = milestoneData[key];
        if (!overlay || !data) return;

        iconEl.textContent = data.icon;
        yearEl.textContent = key;
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;

        lastFocused = document.activeElement;
        overlay.hidden = false;
        // allow the browser to register 'hidden' removal before transitioning
        requestAnimationFrame(() => overlay.classList.add('is-open'));
        closeBtn.focus();
        document.addEventListener('keydown', onKeydown);
    }

    function closeMilestone() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        document.removeEventListener('keydown', onKeydown);
        setTimeout(() => { overlay.hidden = true; }, 200);
        if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
        if (e.key === 'Escape') closeMilestone();
    }

    rows.forEach(row => {
        row.addEventListener('click', () => openMilestone(row.dataset.milestone));
        row.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMilestone(row.dataset.milestone);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMilestone);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMilestone();
        });
    }

    // ===== Generic popup controller (Community page: Roblox community / game night / build contest) =====
    let activeOverlay = null;

    function openNamedModal(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.hidden = false;
        requestAnimationFrame(() => el.classList.add('is-open'));
        activeOverlay = el;
        document.addEventListener('keydown', onGenericKeydown);
    }

    function closeNamedModal(el) {
        if (!el) return;
        el.classList.remove('is-open');
        setTimeout(() => { el.hidden = true; }, 200);
        document.removeEventListener('keydown', onGenericKeydown);
        activeOverlay = null;

        // Stop any playing embed when its popup closes
        if (el.id === 'gameNightModal') {
            const facade = document.getElementById('gameNightYT');
            if (facade && facade.dataset.originalHtml) {
                facade.innerHTML = facade.dataset.originalHtml;
            }
        }
    }

    function onGenericKeydown(e) {
        if (e.key === 'Escape' && activeOverlay) closeNamedModal(activeOverlay);
    }

    document.querySelectorAll('[data-open-modal]').forEach(btn => {
        btn.addEventListener('click', () => openNamedModal(btn.dataset.openModal));
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => closeNamedModal(btn.closest('.rw-modal-overlay')));
    });

    document.querySelectorAll('.rw-modal-overlay[data-generic]').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el) closeNamedModal(el);
        });
    });

    // ===== Click-to-play YouTube embed (Game Night popup) =====
    document.querySelectorAll('.rw-yt-facade').forEach(facade => {
        facade.dataset.originalHtml = facade.innerHTML;

        function playVideo() {
            if (facade.querySelector('iframe')) return;
            const videoId = facade.dataset.ytId;
            facade.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" title="YouTube video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
        }

        facade.addEventListener('click', playVideo);
        facade.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playVideo();
            }
        });
    });

    // ===== Build Contest: favourite Roblox building/roleplay games search =====
    const buildGames = [
        { name: 'Build A Boat For Treasure', desc: 'Build wild boats (or planes) and sail through treasure-filled worlds solving puzzles along the way.' },
        { name: 'Bloxburg', desc: 'Design and furnish your dream house, take on jobs, and live out a roleplay life in a suburban town.' },
        { name: 'Brookhaven', desc: 'An open-world roleplay town where you pick a home and a car and just hang out with friends.' },
        { name: 'Theme Park Tycoon 2', desc: 'Design and manage your own theme park, building custom coasters and rides for virtual guests.' },
        { name: 'Plane Crazy', desc: 'A sandbox building game focused on constructing your own working planes, cars, and other vehicles.' },
        { name: 'Roville', desc: 'A stylish roleplay city hub with jobs, apartments, and a lively town atmosphere.' },
        { name: 'MeepCity', desc: 'A classic Roblox hangout with a town square, pets, minigames, and player-owned homes.' },
        { name: 'Adopt Me', desc: 'Hatch pets, build and decorate a home, and trade with friends in this massive roleplay world.' },
        { name: 'Ro City', desc: 'A slice-of-life roleplay city where you customise an apartment, get a job, and drive around town.' },
        { name: 'Islands', desc: 'A skyblock-style building and resource game where you grow your own floating island empire.' }
    ];

    const gameSearchInput = document.getElementById('gameSearchInput');
    const gameSearchResults = document.getElementById('gameSearchResults');
    const buildContestModal = document.getElementById('buildContestModal');
    const gameDetailTitle = document.getElementById('gameDetailTitle');
    const gameDetailDesc = document.getElementById('gameDetailDesc');

    function typeIntoInput(input, text, onDone) {
        input.value = '';
        input.focus();
        let i = 0;
        const timer = setInterval(() => {
            i++;
            input.value = text.slice(0, i);
            if (i >= text.length) {
                clearInterval(timer);
                if (onDone) setTimeout(onDone, 300);
            }
        }, 30);
    }

    function openGameDetail(game) {
        if (gameDetailTitle) gameDetailTitle.textContent = game.name;
        if (gameDetailDesc) gameDetailDesc.textContent = game.desc;
        openNamedModal('gameDetailModal');
    }

    function selectGame(game) {
        typeIntoInput(gameSearchInput, game.name, () => {
            closeNamedModal(buildContestModal);
            setTimeout(() => openGameDetail(game), 220);
        });
    }

    function renderGameResults(query) {
        if (!gameSearchResults) return;
        const q = query.trim().toLowerCase();
        const matches = q === '' ? buildGames : buildGames.filter(g => g.name.toLowerCase().includes(q));

        gameSearchResults.innerHTML = '';

        if (matches.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'rw-search-empty';
            empty.textContent = 'No games found. Try a different search.';
            gameSearchResults.appendChild(empty);
            return;
        }

        matches.forEach(game => {
            const item = document.createElement('li');
            item.className = 'rw-search-result-item';
            item.tabIndex = 0;
            item.setAttribute('role', 'button');

            const name = document.createElement('span');
            name.className = 'rw-search-result-name';
            name.textContent = game.name;

            const desc = document.createElement('span');
            desc.className = 'rw-search-result-desc';
            desc.textContent = game.desc;

            item.appendChild(name);
            item.appendChild(desc);

            item.addEventListener('click', () => selectGame(game));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectGame(game);
                }
            });

            gameSearchResults.appendChild(item);
        });
    }

    if (gameSearchInput) {
        renderGameResults('');
        gameSearchInput.addEventListener('input', (e) => renderGameResults(e.target.value));
    }
});
