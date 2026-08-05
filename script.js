/* -------------------------------------------------------------------
   ROMANTIC 1ST YEAR ANNIVERSARY JAVASCRIPT ENGINE (MOBILE OPTIMIZED) 💕
   ------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile-Optimized Lightweight Canvas Particle Engine
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const isMobile = window.innerWidth < 768;

    let isTabActive = true;
    document.addEventListener('visibilitychange', () => {
        isTabActive = !document.hidden;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const heartSymbols = ['❤️', '💖', '💕', '🌸', '✨'];

    class Particle {
        constructor(x, y) {
            this.reset(x, y);
        }

        reset(x, y) {
            this.x = x || Math.random() * width;
            this.y = y || height + 20;
            this.size = Math.floor(Math.random() * 10 + (isMobile ? 12 : 16));
            this.symbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            this.speedY = Math.random() * 1.0 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    // 8 particles on mobile, 15 on desktop for battery & 60fps performance
    const particleCount = isMobile ? 8 : 15;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(Math.random() * width, Math.random() * height));
    }

    let lastTime = 0;
    function animateParticles(currentTime) {
        if (!isTabActive) {
            requestAnimationFrame(animateParticles);
            return;
        }

        if (currentTime - lastTime > 20) { // ~50fps cap for battery saving
            lastTime = currentTime;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
        }
        requestAnimationFrame(animateParticles);
    }
    requestAnimationFrame(animateParticles);

    // Tap to spawn romantic hearts
    const handleTap = (e) => {
        if (e.target.closest('button, a, .flip-card, .envelope, #wheelCanvas')) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        for (let i = 0; i < (isMobile ? 2 : 4); i++) {
            if (particles.length > 20) particles.shift();
            const p = new Particle(clientX + (Math.random() - 0.5) * 20, clientY + (Math.random() - 0.5) * 20);
            p.speedY = Math.random() * 2 + 1;
            particles.push(p);
        }
    };
    window.addEventListener('click', handleTap);

    // 2. Real-Time Love Timer Counter
    const startDate = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000));
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;

        daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24)).toLocaleString();
        hoursEl.textContent = Math.floor((diff / (1000 * 60 * 60))).toLocaleString();
        minutesEl.textContent = Math.floor((diff / (1000 * 60))).toLocaleString();
        secondsEl.textContent = Math.floor((diff / 1000)).toLocaleString();
    }
    setInterval(updateCounter, 1000);
    updateCounter();

    // 3. Audio & Music Player
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = false;

    let audioCtx;
    function playAmbientChime() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [261.63, 329.63, 392.00, 523.25];
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 1.5);
                }, idx * 200);
            });
        } catch (e) {}
    }

    function toggleMusic() {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.classList.add('playing');
            }).catch(() => {
                playAmbientChime();
                isPlaying = true;
                musicToggle.classList.add('playing');
            });
        } else {
            bgMusic.pause();
            isPlaying = false;
            musicToggle.classList.remove('playing');
        }
    }

    musicToggle.addEventListener('click', toggleMusic);

    // Security Gate Modal Handler
    const entranceModal = document.getElementById('entranceModal');
    const securityKeyInput = document.getElementById('securityKeyInput');
    const verifyKeyBtn = document.getElementById('verifyKeyBtn');
    const accessDeniedMsg = document.getElementById('accessDeniedMsg');

    // Official valid security key from NEXUS CODEX
    const VALID_KEYS = ['NEXUS_CODEX'];

    // Check if previously unlocked on this device
    if (localStorage.getItem('nexus_key_unlocked') === 'true') {
        entranceModal.classList.remove('active');
    }

    function verifySecurityKey() {
        const enteredKey = securityKeyInput.value.trim().toUpperCase();
        if (VALID_KEYS.includes(enteredKey)) {
            accessDeniedMsg.classList.add('hidden');
            entranceModal.classList.remove('active');
            localStorage.setItem('nexus_key_unlocked', 'true');
            toggleMusic();
            playAmbientChime();
        } else {
            accessDeniedMsg.classList.remove('hidden');
            securityKeyInput.style.borderColor = '#e74c3c';
            accessDeniedMsg.style.animation = 'none';
            accessDeniedMsg.offsetHeight; // force reflow
            accessDeniedMsg.style.animation = 'shake 0.4s ease-in-out';
        }
    }

    verifyKeyBtn.addEventListener('click', verifySecurityKey);
    securityKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifySecurityKey();
    });

    // 4. 3D Envelope & Mobile Love Letter Popup
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    let isLetterOpen = false;

    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation();
        envelope.classList.add('open');
        isLetterOpen = true;
        playAmbientChime();
    });

    document.addEventListener('click', (e) => {
        if (isLetterOpen && !e.target.closest('.letter') && !e.target.closest('.wax-seal')) {
            envelope.classList.remove('open');
            isLetterOpen = false;
        }
    });

    // 5. 10 Reasons Flip Cards
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            playAmbientChime();
        });
    });

    // 6. Rain Love Hearts Button
    const burstHeartsBtn = document.getElementById('burstHeartsBtn');
    burstHeartsBtn.addEventListener('click', () => {
        for (let i = 0; i < 10; i++) {
            const p = new Particle(Math.random() * width, height + 10);
            p.speedY = Math.random() * 2 + 1.5;
            particles.push(p);
            if (particles.length > 20) particles.shift();
        }
    });

    // 7. Responsive Fortune Wheel
    const wheelCanvas = document.getElementById('wheelCanvas');
    const wCtx = wheelCanvas.getContext('2d');
    const spinBtn = document.getElementById('spinBtn');
    const wheelResult = document.getElementById('wheelResult');
    const rewardText = document.getElementById('rewardText');

    const rewards = [
        "Candlelight Dinner 🕯️",
        "Unlimited Kisses 💋",
        "Late Night Drive 🚗",
        "Shopping Spree 🛍️",
        "Breakfast in Bed ☕",
        "Weekend Trip ✈️"
    ];

    const colors = ['#ff3366', '#8a2be2', '#ff6b8b', '#9b59b6', '#ff4757', '#e84393'];
    const numSegments = rewards.length;
    const arcSize = (2 * Math.PI) / numSegments;
    let currentAngle = 0;
    let isSpinning = false;

    function drawWheel() {
        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(320, window.innerWidth - 40);
        wheelCanvas.width = size * dpr;
        wheelCanvas.height = size * dpr;

        wCtx.scale(dpr, dpr);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 8;

        wCtx.clearRect(0, 0, size, size);

        for (let i = 0; i < numSegments; i++) {
            const angle = currentAngle + i * arcSize;
            wCtx.beginPath();
            wCtx.fillStyle = colors[i];
            wCtx.moveTo(centerX, centerY);
            wCtx.arc(centerX, centerY, radius, angle, angle + arcSize);
            wCtx.lineTo(centerX, centerY);
            wCtx.fill();
            wCtx.strokeStyle = 'rgba(255,255,255,0.4)';
            wCtx.lineWidth = 1.5;
            wCtx.stroke();

            wCtx.save();
            wCtx.translate(centerX, centerY);
            wCtx.rotate(angle + arcSize / 2);
            wCtx.textAlign = "right";
            wCtx.fillStyle = "#fff";
            wCtx.font = `bold ${size < 300 ? 11 : 12}px Plus Jakarta Sans`;
            wCtx.fillText(rewards[i], radius - 12, 4);
            wCtx.restore();
        }

        wCtx.beginPath();
        wCtx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
        wCtx.fillStyle = "#ffd700";
        wCtx.fill();
    }
    drawWheel();
    window.addEventListener('resize', drawWheel);

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        wheelResult.classList.add('hidden');

        const totalRotations = Math.floor(Math.random() * 4) + 4;
        const targetExtraAngle = Math.random() * 2 * Math.PI;
        const finalAngle = currentAngle + (totalRotations * 2 * Math.PI) + targetExtraAngle;

        let start = null;
        const duration = 2800;

        function animateWheel(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;

            if (progress < 1) {
                const easeOut = 1 - Math.pow(1 - progress, 3);
                currentAngle = easeOut * (finalAngle - currentAngle);
                drawWheel();
                requestAnimationFrame(animateWheel);
            } else {
                currentAngle = finalAngle % (2 * Math.PI);
                drawWheel();
                isSpinning = false;

                const normalizedAngle = (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
                const winIndex = Math.floor(normalizedAngle / arcSize);
                rewardText.textContent = `You Won: ${rewards[winIndex]}!`;
                wheelResult.classList.remove('hidden');
                playAmbientChime();
            }
        }
        requestAnimationFrame(animateWheel);
    });

    // 8. Quiz Engine
    const quizData = [
        {
            question: "Who loves the other one more?",
            options: ["Arun Loves Sorna More", "Sorna Loves Arun More", "Both Love Each Other Infinitely!", "It's an Endless Love Tie!"],
        },
        {
            question: "What is Arun's favorite thing about Sorna?",
            options: ["Her Cute Laugh", "Her Kind Heart", "Her Beautiful Eyes", "EVERYTHING about her!"],
        },
        {
            question: "How long will Arun & Sorna be together?",
            options: ["1 Year", "10 Years", "50 Years", "Forever & Always ❤️"],
        }
    ];

    let currentQ = 0;
    const questionNum = document.getElementById('questionNum');
    const questionText = document.getElementById('questionText');
    const optionsGrid = document.getElementById('optionsGrid');
    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    function loadQuizQuestion() {
        const q = quizData[currentQ];
        questionNum.textContent = `Question ${currentQ + 1} of ${quizData.length}`;
        questionText.textContent = q.question;
        optionsGrid.innerHTML = '';

        q.options.forEach((opt) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                playAmbientChime();
                currentQ++;
                if (currentQ < quizData.length) {
                    loadQuizQuestion();
                } else {
                    quizContainer.classList.add('hidden');
                    quizResult.classList.remove('hidden');
                }
            });
            optionsGrid.appendChild(btn);
        });
    }

    restartQuizBtn.addEventListener('click', () => {
        currentQ = 0;
        quizResult.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        loadQuizQuestion();
    });

    loadQuizQuestion();

    // 9. Coupon Claim Handler
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.textContent = "Voucher Redeemed! 💖";
            btn.style.background = "var(--accent-gold)";
            btn.style.color = "#000";
            playAmbientChime();
        });
    });

});
