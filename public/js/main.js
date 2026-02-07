document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Views ---
    const views = {
        landing: document.getElementById('landing-page'),
        creator: document.getElementById('creator-studio'),
        success: document.getElementById('success-view'),
        lock: document.getElementById('reveal-lock-screen'),
        message: document.getElementById('message-content'),
        gallery: document.getElementById('memory-gallery')
    };

    const buttons = {
        createNav: document.getElementById('nav-create-btn'),
        startCreate: document.getElementById('start-create-btn'),
        viewGallery: document.getElementById('view-gallery-btn'),
        createAnother: document.getElementById('create-another-btn'),
        createOwn: document.getElementById('create-own-btn'),
        backHome: document.getElementById('back-home-btn')
    };

    function switchView(viewName) {
        Object.values(views).forEach(el => {
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('active');
            }
        });
        if (views[viewName]) {
            views[viewName].classList.remove('hidden');
            setTimeout(() => {
                views[viewName].classList.add('active');
            }, 10);
        }
    }

    // --- ID parsing from URL ---
    const path = window.location.pathname;
    const isMessageLink = path.startsWith('/m/');

    if (isMessageLink) {
        const messageId = path.split('/m/')[1];
        loadMessage(messageId);
    } else {
        switchView('landing');
    }

    // --- Message Retrieval Logic (Recipient View) ---
    async function loadMessage(id) {
        try {
            const response = await fetch(`/api/message/${id}`);
            const data = await response.json();

            if (data.error) {
                alert("Message not found or expired 😢");
                switchView('landing');
                return;
            }

            // Save to Local History
            saveToGallery(id, data.sender, data.recipient, 'received');

            // Populate Lock Screen
            document.getElementById('lock-recipient-name').textContent = data.recipient;

            // Handle Unlock
            const unlockBtn = document.getElementById('unlock-btn');
            const countdownDisplay = document.getElementById('countdown-display');

            switchView('lock');

            if (data.unlockMethod === 'timer' && data.unlockDate) {
                const now = new Date().getTime();
                const unlockTime = new Date(data.unlockDate).getTime();

                if (now < unlockTime) {
                    unlockBtn.classList.add('hidden');
                    countdownDisplay.classList.remove('hidden');
                    startCountdown(unlockTime);
                } else {
                    unlockBtn.classList.remove('hidden');
                }
            } else {
                unlockBtn.classList.remove('hidden');
            }

            unlockBtn.onclick = () => revealMessage(data);

        } catch (error) {
            console.error(error);
            alert("Error loading message.");
        }
    }

    function startCountdown(targetTime) {
        const timerDigits = document.querySelector('.timer-digits');
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetTime - now;

            if (distance < 0) {
                clearInterval(interval);
                document.getElementById('countdown-display').classList.add('hidden');
                document.getElementById('unlock-btn').classList.remove('hidden');
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            timerDigits.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }, 1000);
    }
    function pad(n) { return n < 10 ? '0' + n : n; }

    function revealMessage(data) {
        document.getElementById('msg-header').textContent = `Happy Valentine's, ${data.recipient}!`;
        document.getElementById('msg-text').textContent = data.content;
        document.getElementById('msg-sender').textContent = data.sender;

        const photoContainer = document.getElementById('msg-photo-container');
        const photoImg = document.getElementById('msg-photo');

        if (data.mediaUrl && data.type === 'image') {
            photoImg.src = data.mediaUrl;
            photoContainer.classList.remove('hidden');
        } else {
            photoContainer.classList.add('hidden');
        }

        // Apply Theme Class to Body
        document.body.className = '';
        if (data.theme) document.body.classList.add(`theme-${data.theme}`);

        switchView('message');

        // Effects
        triggerConfetti();
        // Auto-play music if toggle is on (browser might block auto-play without interaction)
        // We'll let user toggle it manually or try to play
        tryPlayMusic();
    }

    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff69b4', '#ffffff']
            });
        }
    }

    // --- Music Logic ---
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle-btn');
    let isPlaying = false;

    function tryPlayMusic() {
        audio.volume = 0.5;
        audio.play().then(() => {
            isPlaying = true;
            updateMusicBtn();
        }).catch(err => {
            console.log("Auto-play blocked, user must interact.");
            isPlaying = false;
            updateMusicBtn();
        });
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            isPlaying = !isPlaying;
            updateMusicBtn();
        });
    }

    function updateMusicBtn() {
        musicBtn.textContent = isPlaying ? "⏸ Pause Music" : "🎵 Play Music";
    }

    // --- Wizard & Creation Logic ---
    if (buttons.createNav) buttons.createNav.addEventListener('click', () => switchView('creator'));
    if (buttons.startCreate) buttons.startCreate.addEventListener('click', () => switchView('creator'));
    if (buttons.createAnother) buttons.createAnother.addEventListener('click', () => { resetWizard(); switchView('creator'); });
    if (buttons.createOwn) buttons.createOwn.addEventListener('click', () => {
        window.history.pushState({}, "", "/");
        resetWizard();
        switchView('creator');
    });
    if (buttons.viewGallery) buttons.viewGallery.addEventListener('click', () => { loadGallery(); switchView('gallery'); });
    if (buttons.backHome) buttons.backHome.addEventListener('click', () => switchView('landing'));

    // Step Navigation
    const steps = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');

    function showStep(stepIndex) {
        steps.forEach(step => {
            step.classList.add('hidden');
            step.classList.remove('active');
        });
        const target = document.querySelector(`.step[data-step="${stepIndex}"]`);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => showStep(e.target.dataset.next));
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => showStep(e.target.dataset.prev));
    });

    // Theme Selection (Cards)
    const themeCards = document.querySelectorAll('.theme-card');
    let selectedTheme = 'cute';

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedTheme = card.dataset.theme;
        });
    });

    // Generate
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const recipient = document.getElementById('recipient-name').value;
            const sender = document.getElementById('sender-name').value;
            const content = document.getElementById('message-text').value;
            const unlockMethod = document.getElementById('unlock-method').value;
            const unlockDate = document.getElementById('unlock-time').value;
            const mediaFile = document.getElementById('media-file').files[0];

            if (!recipient || !content || !sender) {
                alert("Please fill in recipient, name, and message!");
                return;
            }

            const originalText = generateBtn.textContent;
            generateBtn.textContent = "Creating Magic... ✨";
            generateBtn.disabled = true;

            try {
                const formData = new FormData();
                formData.append('sender', sender);
                formData.append('recipient', recipient);
                formData.append('content', content);
                formData.append('theme', selectedTheme);
                formData.append('unlockMethod', unlockMethod);
                if (unlockDate) formData.append('unlockDate', unlockDate);
                if (mediaFile) formData.append('media', mediaFile);

                const response = await fetch('/api/create', { method: 'POST', body: formData });
                const result = await response.json();

                if (result.success) {
                    const shareLink = `${window.location.origin}/m/${result.id}`;
                    document.getElementById('share-link-input').value = shareLink;
                    saveToGallery(result.id, sender, recipient, 'sent');
                    switchView('success');
                } else {
                    alert("Error: " + result.error);
                }
            } catch (error) {
                console.error(error);
                alert("Server Error.");
            } finally {
                generateBtn.textContent = originalText;
                generateBtn.disabled = false;
            }
        });
    }

    // Copy Link
    const copyBtn = document.getElementById('copy-link-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const linkInput = document.getElementById('share-link-input');
            linkInput.select();
            document.execCommand('copy');
            copyBtn.textContent = "Copied! 👍";
            setTimeout(() => copyBtn.textContent = "Copy Link", 2000);
        });
    }

    function resetWizard() {
        showStep(1);
        document.getElementById('recipient-name').value = '';
        document.getElementById('sender-name').value = '';
        document.getElementById('message-text').value = '';
        document.getElementById('media-file').value = '';
        selectedTheme = 'cute';
        themeCards.forEach(c => c.classList.remove('active'));
        if (themeCards[0]) themeCards[0].classList.add('active');
    }

    // --- Gallery Logic (LocalStorage) ---
    function saveToGallery(id, sender, recipient, type) {
        const memories = JSON.parse(localStorage.getItem('heartlink_memories') || '[]');
        // Avoid duplicates
        if (!memories.find(m => m.id === id)) {
            memories.unshift({
                id, sender, recipient, type, date: new Date().toLocaleDateString()
            });
            localStorage.setItem('heartlink_memories', JSON.stringify(memories));
        }
    }

    function loadGallery() {
        const galleryList = document.getElementById('gallery-list');
        const memories = JSON.parse(localStorage.getItem('heartlink_memories') || '[]');

        galleryList.innerHTML = '';

        if (memories.length === 0) {
            galleryList.innerHTML = '<p class="empty-msg">No memories found yet.</p>';
            return;
        }

        memories.forEach(m => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <div class="gallery-icon">${m.type === 'sent' ? '📤' : '💌'}</div>
                <h4>${m.recipient}</h4>
                <p class="gallery-date">${m.date}</p>
            `;
            div.onclick = () => {
                window.location.href = `/m/${m.id}`;
            };
            galleryList.appendChild(div);
        });
    }
});
