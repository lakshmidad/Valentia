document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Views ---
    const views = {
        landing: document.getElementById('landing-page'),
        creator: document.getElementById('creator-studio'),
        success: document.getElementById('success-view'),
        lock: document.getElementById('reveal-lock-screen'),
        message: document.getElementById('message-content')
    };

    const buttons = {
        createNav: document.getElementById('nav-create-btn'),
        startCreate: document.getElementById('start-create-btn'),
        createAnother: document.getElementById('create-another-btn'),
        createOwn: document.getElementById('create-own-btn') // New button in message view
    };

    function switchView(viewName) {
        Object.values(views).forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('active');
        });
        views[viewName].classList.remove('hidden');
        setTimeout(() => {
            views[viewName].classList.add('active');
        }, 10);
    }

    // --- ID parsing from URL ---
    const path = window.location.pathname;
    const isMessageLink = path.startsWith('/m/');

    if (isMessageLink) {
        const messageId = path.split('/m/')[1];
        loadMessage(messageId);
    } else {
        // Default Landing Page Logic
        switchView('landing');
    }

    // --- Message Retrieval Logic (Recipient View) ---
    async function loadMessage(id) {
        try {
            // Fetch message metadata (locked state)
            const response = await fetch(`/api/message/${id}`);
            const data = await response.json();

            if (data.error) {
                alert("Message not found or expired 😢");
                switchView('landing');
                return;
            }

            // Populate Lock Screen
            document.getElementById('lock-recipient-name').textContent = data.recipient;

            // Handle Unlock Method
            const unlockBtn = document.getElementById('unlock-btn');
            const countdownDisplay = document.getElementById('countdown-display');

            switchView('lock');

            if (data.unlockMethod === 'timer' && data.unlockDate) {
                const now = new Date().getTime();
                const unlockTime = new Date(data.unlockDate).getTime();

                if (now < unlockTime) {
                    // Timer Active
                    unlockBtn.classList.add('hidden');
                    countdownDisplay.classList.remove('hidden');
                    startCountdown(unlockTime);
                } else {
                    // Ready to open
                    unlockBtn.classList.remove('hidden');
                    countdownDisplay.classList.add('hidden');
                }
            } else {
                // Default tap to open
                unlockBtn.classList.remove('hidden');
            }

            // Bind Unlock Action
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
                // Optional: Play notification sound
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timerDigits.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }, 1000);
    }

    function pad(n) { return n < 10 ? '0' + n : n; }

    function revealMessage(data) {
        // Populate specific message fields
        document.getElementById('msg-header').textContent = `Happy Valentine's, ${data.recipient}!`;
        document.getElementById('msg-text').textContent = data.content;
        document.getElementById('msg-sender').textContent = data.sender;

        // Populate Media (if any)
        const photoContainer = document.getElementById('msg-photo-container');
        const photoImg = document.getElementById('msg-photo');

        if (data.mediaUrl && data.type === 'image') {
            photoImg.src = data.mediaUrl;
            photoContainer.classList.remove('hidden');
        } else {
            photoContainer.classList.add('hidden');
        }

        // Apply Theme
        document.body.className = ''; // Reset
        document.body.classList.add(`theme-${data.theme}`);

        switchView('message');

        // Trigger Consfetti/Animations here
        triggerConfetti();
    }

    function triggerConfetti() {
        console.log("🎉 Confetti Pop!");
        // (Implementation of canvas confetti would go here)
    }

    // --- Creation Wizard Logic ---

    // Navigation Listeners
    if (buttons.createNav) buttons.createNav.addEventListener('click', () => switchView('creator'));
    if (buttons.startCreate) buttons.startCreate.addEventListener('click', () => switchView('creator'));
    if (buttons.createAnother) buttons.createAnother.addEventListener('click', () => { resetWizard(); switchView('creator'); });
    if (buttons.createOwn) buttons.createOwn.addEventListener('click', () => {
        window.history.pushState({}, "", "/"); // Reset URL
        resetWizard();
        switchView('creator');
    });

    const steps = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');

    function showStep(stepIndex) {
        steps.forEach(step => step.classList.add('hidden'));
        document.querySelector(`.step[data-step="${stepIndex}"]`).classList.remove('hidden');
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => showStep(e.target.dataset.next));
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', (e) => showStep(e.target.dataset.prev));
    });

    function resetWizard() {
        showStep(1);
        document.getElementById('recipient-name').value = '';
        document.getElementById('sender-name').value = '';
        document.getElementById('message-text').value = '';
        document.getElementById('media-file').value = '';
        document.getElementById('share-link-input').value = '';
        // Reset theme to default
    }

    // Theme Selector
    const themeBtns = document.querySelectorAll('.theme-btn');
    let selectedTheme = 'cute';

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTheme = btn.dataset.theme;
        });
    });

    // Generate Button (REAL API Call with FormData)
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.addEventListener('click', async () => {
        const recipient = document.getElementById('recipient-name').value;
        const sender = document.getElementById('sender-name').value;
        const content = document.getElementById('message-text').value;
        const unlockMethod = document.getElementById('unlock-method').value;
        const unlockDate = document.getElementById('unlock-time').value;
        const mediaFile = document.getElementById('media-file').files[0];

        if (!recipient || !content || !sender) {
            alert("Please fill in all fields!");
            return;
        }

        const originalText = generateBtn.textContent;
        generateBtn.textContent = "Creating Link... 💘";
        generateBtn.disabled = true;

        try {
            // Use FormData to handle file uploads
            const formData = new FormData();
            formData.append('sender', sender);
            formData.append('recipient', recipient);
            formData.append('content', content);
            formData.append('theme', selectedTheme);
            formData.append('unlockMethod', unlockMethod);
            if (unlockDate) formData.append('unlockDate', unlockDate);
            if (mediaFile) formData.append('media', mediaFile);

            const response = await fetch('/api/create', {
                method: 'POST',
                body: formData // No Content-Type header needed (browser handles boundary)
            });

            const result = await response.json();

            if (result.success) {
                // Success State
                const shareLink = `${window.location.origin}/m/${result.id}`;
                document.getElementById('share-link-input').value = shareLink;
                switchView('success');
            } else {
                alert("Error creating link: " + result.error);
            }

        } catch (error) {
            console.error(error);
            alert("Server Error. Please try again.");
        } finally {
            generateBtn.textContent = originalText;
            generateBtn.disabled = false;
        }
    });

    // Copy Link
    const copyBtn = document.getElementById('copy-link-btn');
    copyBtn.addEventListener('click', () => {
        const linkInput = document.getElementById('share-link-input');
        linkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = "Copied! 👍";
        setTimeout(() => copyBtn.textContent = "Copy", 2000);
    });
});
