const words = ["Çok", "Teşekkür", "Ederim", "Ebrar"];
const board = document.getElementById('puzzle-board');
const piecesContainer = document.getElementById('lego-pieces');
const music = document.getElementById('bg-music');
let completed = 0;

// Müzik Başlatıcı
const startMusic = () => { music.play().catch(() => {}); };

// Puzzle Kurulumu
words.forEach((word, i) => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.id = `zone-${i}`;
    board.appendChild(zone);

    const piece = document.createElement('div');
    piece.className = 'lego-piece';
    piece.innerText = word;
    piece.id = `piece-${i}`;
    piece.dataset.index = i;

    // Pointer Events (Fare ve Dokunmatik için tek çözüm)
    piece.addEventListener('pointerdown', onPointerDown);
    piecesContainer.appendChild(piece);
});

let activeItem = null;
let offset = { x: 0, y: 0 };

function onPointerDown(e) {
    startMusic();
    activeItem = e.target;
    activeItem.setPointerCapture(e.pointerId);
    
    const rect = activeItem.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;

    activeItem.style.position = 'fixed';
    activeItem.style.left = (e.clientX - offset.x) + 'px';
    activeItem.style.top = (e.clientY - offset.y) + 'px';
    activeItem.style.zIndex = "1000";

    activeItem.addEventListener('pointermove', onPointerMove);
    activeItem.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(e) {
    if (!activeItem) return;
    activeItem.style.left = (e.clientX - offset.x) + 'px';
    activeItem.style.top = (e.clientY - offset.y) + 'px';
}

function onPointerUp(e) {
    if (!activeItem) return;
    
    const targetZone = document.getElementById(`zone-${activeItem.dataset.index}`);
    const zoneRect = targetZone.getBoundingClientRect();
    const pieceRect = activeItem.getBoundingClientRect();

    // Çakışma kontrolü (Mesafe bazlı)
    const isInside = (
        pieceRect.left < zoneRect.right &&
        pieceRect.right > zoneRect.left &&
        pieceRect.top < zoneRect.bottom &&
        pieceRect.bottom > zoneRect.top
    );

    if (isInside) {
        targetZone.appendChild(activeItem);
        activeItem.style.position = 'static';
        activeItem.style.zIndex = "10";
        activeItem.removeEventListener('pointerdown', onPointerDown);
        completed++;
        if (completed === words.length) win();
    } else {
        // Yerine oturmadıysa geri gönder
        activeItem.style.position = 'relative';
        activeItem.style.left = '0';
        activeItem.style.top = '0';
        piecesContainer.appendChild(activeItem);
    }

    activeItem.releasePointerCapture(e.pointerId);
    activeItem.removeEventListener('pointermove', onPointerMove);
    activeItem.removeEventListener('pointerup', onPointerUp);
    activeItem = null;
}

function win() {
    setTimeout(() => {
        document.getElementById('success-message').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('puzzle-section').classList.add('hidden');
            document.getElementById('animation-area').classList.remove('hidden');
        }, 1500);
    }, 300);
}

// ARABA SÜRÜKLEME
const car = document.getElementById('car');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');

car.addEventListener('pointerdown', (e) => {
    car.setPointerCapture(e.pointerId);
    const onMove = (me) => {
        const trackRect = document.getElementById('track').getBoundingClientRect();
        let x = me.clientX - trackRect.left - 40;
        if (x > 0 && x < trackRect.width - 80) {
            car.style.left = x + 'px';
            if (x > trackRect.width * 0.5) {
                flap.classList.add('torn-flap');
                setTimeout(() => letter.classList.add('reveal-letter'), 300);
            }
        }
    };
    car.addEventListener('pointermove', onMove);
    car.addEventListener('pointerup', () => {
        car.removeEventListener('pointermove', onMove);
    }, { once: true });
});