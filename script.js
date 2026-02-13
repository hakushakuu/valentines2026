(function(){ emailjs.init("GZSTzDLRYZC7Zz8l4"); })();

// -------------------- CONFIGURATION --------------------
let devMode = false; // Set to true to bypass the date lock for testing
const unlockDate = new Date("February 14, 2026 20:00:00");
const lockedPages = ["game", "timeline", "message", "proposal"];

// -------------------- FLOATING HEARTS EFFECT --------------------
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.bottom = '-20px';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
    heart.style.opacity = Math.random() * 0.5 + 0.2;
    heart.style.zIndex = '-1'; // Keep behind content
    heart.style.pointerEvents = 'none';
    heart.style.transition = `transform ${Math.random() * 5 + 5}s linear, opacity 5s`;
    
    document.body.appendChild(heart);

    // Animate upward
    setTimeout(() => {
        heart.style.transform = `translateY(-110vh) translateX(${(Math.random() - 0.5) * 100}px) rotate(${Math.random() * 360}deg)`;
        heart.style.opacity = '0';
    }, 100);

    // Remove from DOM
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Start generating background hearts
setInterval(createFloatingHeart, 500);

// -------------------- LOCK SYSTEM --------------------
function goLocked(pageId) {
    const now = new Date();
    if (!devMode && lockedPages.includes(pageId) && now < unlockDate) {
        alert("Patience, Camille! 💖 This surprise unlocks on Feb 14, 8:00 PM.");
        return; 
    }
    next(pageId);
}

// -------------------- NAVIGATION --------------------
function next(pageId) {
    // Start music on any interaction
    startMusic();

    const now = new Date();
    if (!devMode && lockedPages.includes(pageId) && now < unlockDate) {
        alert("This part unlocks on Feb 14, 2026 8:00 PM 💖");
        return;
    }

    document.querySelectorAll(".page, section").forEach(sec => {
        sec.classList.remove("active");
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    if (pageId === "timeline") typeLetter();
    if (pageId === "proposal") startProposal();
}

// -------------------- TYPEWRITER NAME --------------------
const nameText = "Camille Querol Manlapaz";
let nameIdx = 0;
function typeName() {
    if (nameIdx < nameText.length) {
        document.getElementById('animatedName').innerHTML += nameText.charAt(nameIdx);
        nameIdx++;
        setTimeout(typeName, 90);
    }
}
typeName();

// -------------------- MUSIC & AUDIO --------------------
const music = document.getElementById('bgmusic');
const heartbeat = document.getElementById("heartbeat");
music.volume = 0.3;

function startMusic() {
    music.play().catch(() => {
        console.log("Waiting for user interaction to play music...");
    });
}

// -------------------- VALENTINE BUTTONS --------------------
const noBtn = document.getElementById('noBtn');
let noTexts = ["No way!", "Are you sure?", "Think again!", "You're mine!", "Click YES 💖"];
let textIdx = 0;

noBtn.addEventListener('mouseover', () => {
    noBtn.innerText = noTexts[textIdx];
    textIdx = (textIdx + 1) % noTexts.length;
    noBtn.style.position = 'absolute';
    noBtn.style.top = Math.random() * 70 + '%';
    noBtn.style.left = Math.random() * 70 + '%';
});

function yesClicked() {
    startMusic();
    
    if (heartbeat) {
        heartbeat.volume = 0.4;
        heartbeat.play();
    }

    // Burst of hearts on click
    for (let k = 0; k < 30; k++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'heart-burst';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '60vh';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    setTimeout(() => next('plans'), 900);
}

// -------------------- COUNTDOWN --------------------
function updateCountdown() {
    const diff = unlockDate - new Date();
    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;

    if (diff <= 0) {
        countdownEl.innerText = "It's time ❤️";
        return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    countdownEl.innerText = `${d}d ${h}h ${m}m ${s}s`;
}
setInterval(updateCountdown, 1000);

// -------------------- PUZZLE --------------------
const imgPath = 'images/puzzle.jpg';
const piecesContainer = document.getElementById('pieces');
const board = document.getElementById('board');
let placed = 0;
let selectedPiece = null;

if (piecesContainer && board) {
    let order = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5);
    order.forEach(idx => {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.style.backgroundImage = `url(${imgPath})`;
        piece.style.backgroundPosition = `${(idx % 3) * -100}px ${Math.floor(idx / 3) * -100}px`;
        piece.dataset.index = idx;
        piece.addEventListener('click', () => {
            document.querySelectorAll('.piece').forEach(p => p.style.outline = 'none');
            piece.style.outline = '3px solid #ff3b7a';
            selectedPiece = piece;
        });
        piecesContainer.appendChild(piece);
    });

    for (let j = 0; j < 9; j++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.index = j;
        slot.addEventListener('click', () => {
            if (!selectedPiece) return;
            if (slot.dataset.index === selectedPiece.dataset.index) {
                slot.appendChild(selectedPiece);
                selectedPiece.style.outline = 'none';
                selectedPiece = null;
                placed++;
                if (placed === 9) {
                    showConfetti();
                    addContinueButton();
                }
            } else {
                selectedPiece.style.transition = 'transform 0.1s';
                selectedPiece.style.transform = 'translateX(-10px)';
                setTimeout(() => selectedPiece.style.transform = 'translateX(10px)', 100);
                setTimeout(() => selectedPiece.style.transform = 'translateX(0px)', 200);
            }
        });
        board.appendChild(slot);
    }
}

function showConfetti() {
    for (let k = 0; k < 50; k++) {
        const c = document.createElement('div');
        c.innerHTML = '❤️';
        c.style.position = 'fixed';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-20px';
        c.style.fontSize = (15 + Math.random() * 20) + 'px';
        c.style.transition = 'transform 2s linear, top 2s linear';
        document.body.appendChild(c);
        setTimeout(() => {
            c.style.top = '100vh';
            c.style.transform = `rotate(${Math.random() * 360}deg)`;
            setTimeout(() => c.remove(), 2000);
        }, 50);
    }
}

function addContinueButton() {
    if (document.getElementById('puzzleContinueBtn')) return;
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.id = 'puzzleContinueBtn';
    btn.innerText = 'Continue 💌';
    btn.style.marginTop = "20px";
    btn.onclick = () => goLocked('timeline');
    board.parentElement.appendChild(btn);
}

// -------------------- LETTER TYPEWRITER --------------------
const letterTitle = "To My Love, My Heart, My Soul,";
const letterMsg = "Happy Valentine's Day! Every moment with you feels like home. You are my happiness, my peace, my forever. Thank you for being my partner, my person, and my constant. Here’s to our 14th month, our 2nd Valentine’s season, and the countless chapters we haven't even written yet. I love you more than words can keep up with.";
const letterClosing = "From the depths of my Soul,<br>Borj";

let lt = 0, lm = 0, lc = 0;

function typeLetter() {
    const titleEl = document.getElementById("letterTitle");
    const textEl = document.getElementById("letterText");
    const closingEl = document.getElementById("letterClosing");

    if (lt < letterTitle.length) {
        titleEl.innerHTML += letterTitle.charAt(lt);
        lt++;
        setTimeout(typeLetter, 50);
    } else if (lm < letterMsg.length) {
        textEl.innerHTML += letterMsg.charAt(lm);
        lm++;
        // Scroll the whole window down as text appears
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        setTimeout(typeLetter, 30);
    } else if (lc < letterClosing.length) {
        if (letterClosing.substring(lc, lc + 4) === "<br>") {
            closingEl.innerHTML += "<br>";
            lc += 4;
        } else {
            closingEl.innerHTML += letterClosing.charAt(lc);
            lc++;
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        setTimeout(typeLetter, 50);
    }
}

// -------------------- REPLY FORM --------------------
function sendEmail() {
    const fromName = document.getElementById('fromName').value.trim();
    const date = document.getElementById('datePicker').value;
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('userMessage').value.trim();

    if (!fromName || !date || !subject || !message) {
        alert("Please fill all fields 💖");
        return;
    }

    emailjs.send("service_7fks3gi", "template_tx9gumj", {
        from_name: fromName,
        subject: subject,
        date: date,
        message: message,
        to_email: "borjrosales@gmail.com"
    }).then(() => {
        goLocked('proposal');
    });
}

// -------------------- PROPOSAL --------------------
const proposalLines = ["My Love, My Heart, My Soul, Will you keep loving me for the rest of our lives?"];

function startProposal() {
    const proposal = document.getElementById('proposal');
    proposal.classList.add('active');
    const starsContainer = document.querySelector('#proposal .stars');
    starsContainer.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 50 + 'vh';
        star.style.fontSize = (10 + Math.random() * 20) + 'px';
        star.style.animationDuration = (2 + Math.random() * 3) + 's';
        star.innerHTML = '✨';
        starsContainer.appendChild(star);
    }

    let textEl = document.getElementById('proposalText');
    textEl.innerHTML = proposalLines[0];
}

// -------------------- CAROUSEL --------------------
const months = [
    {img:"images/jan.jpg", caption:"January"}, {img:"images/feb.jpg", caption:"February"},
    {img:"images/march.jpg", caption:"March"}, {img:"images/april.jpg", caption:"April"},
    {img:"images/may.jpg", caption:"May"}, {img:"images/june.jpg", caption:"June"},
    {img:"images/july.jpg", caption:"July"}, {img:"images/aug.jpg", caption:"August"},
    {img:"images/sept.jpg", caption:"September"}, {img:"images/oct.jpg", caption:"October"},
    {img:"images/nov.jpg", caption:"November"}, {img:"images/dec.jpg", caption:"December"}
];
let slideIndex = 0;

function showSlide() {
    document.getElementById("slideImage").src = months[slideIndex].img;
    document.getElementById("slideCaption").innerText = months[slideIndex].caption;
}
function nextSlide() { slideIndex = (slideIndex + 1) % months.length; showSlide(); }
function prevSlide() { slideIndex = (slideIndex - 1 + months.length) % months.length; showSlide(); }

// -------------------- INITIALIZATION --------------------
window.addEventListener('load', startMusic);
document.body.addEventListener('click', startMusic, { once: true });

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'floating-heart'; // Use the CSS class we just made
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
    heart.style.opacity = Math.random() * 0.5 + 0.2;
    
    // Smooth transition for the float
    heart.style.transition = `transform ${Math.random() * 5 + 5}s linear, opacity 3s`;
    
    document.body.appendChild(heart);

    // Forces a reflow so the transition works
    void heart.offsetWidth;

    // Animate upward
    heart.style.transform = `translateY(-110vh) translateX(${(Math.random() - 0.5) * 100}px) rotate(${Math.random() * 360}deg)`;
    
    // Start fading out halfway up
    setTimeout(() => {
        heart.style.opacity = '0';
    }, 4000);

    // Remove from DOM after animation finishes
    setTimeout(() => {
        heart.remove();
    }, 10000);
}