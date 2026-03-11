const words = ["Çok", "Teşekkür", "Ederim", "Ebrar"];
const board = document.getElementById('puzzle-board');
const piecesContainer = document.getElementById('lego-pieces');
const music = document.getElementById('bg-music');
let completed = 0;

// Puzzle Kurulumu
words.forEach((word, i) => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.dataset.index = i;
    board.appendChild(zone);

    const piece = document.createElement('div');
    piece.className = 'lego-piece';
    piece.innerText = word;
    piece.dataset.index = i;
    
    // Mobil Dokunmatik Kontrolleri
    piece.addEventListener('touchstart', handleStart);
    piece.addEventListener('touchmove', handleMove);
    piece.addEventListener('touchend', handleEnd);
    
    // Masaüstü Drag Kontrolleri
    piece.draggable = true;
    piece.id = `p-${i}`;
    piece.ondragstart = (e) => { startMusic(); e.dataTransfer.setData("text", e.target.id); };
    
    piecesContainer.appendChild(piece);
});

// Masaüstü Drop
board.addEventListener('dragover', e => e.preventDefault());
board.addEventListener('drop', e => {
    const id = e.dataTransfer.getData("text");
    const p = document.getElementById(id);
    if(e.target.dataset.index === p.dataset.index) {
        e.target.appendChild(p);
        checkWin();
    }
});

function startMusic() {
    music.play().catch(() => {});
}

// Mobil Sürükleme Mantığı
let activePiece = null;
function handleStart(e) {
    startMusic();
    activePiece = e.target;
    activePiece.style.zIndex = 1000;
}

function handleMove(e) {
    if (!activePiece) return;
    const touch = e.touches[0];
    activePiece.style.position = 'fixed';
    activePiece.style.left = (touch.clientX - 35) + 'px';
    activePiece.style.top = (touch.clientY - 25) + 'px';
}

function handleEnd(e) {
    if (!activePiece) return;
    const touch = e.changedTouches[0];
    activePiece.style.display = 'none';
    const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
    activePiece.style.display = 'flex';

    if (elementAtPoint && elementAtPoint.classList.contains('drop-zone') && 
        elementAtPoint.dataset.index === activePiece.dataset.index) {
        elementAtPoint.appendChild(activePiece);
        activePiece.style.position = 'static';
        activePiece.ontouchstart = null;
        checkWin();
    } else {
        activePiece.style.position = 'static';
    }
    activePiece = null;
}

function checkWin() {
    completed++;
    if (completed === words.length) {
        document.getElementById('success-message').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('puzzle-section').classList.add('hidden');
            document.getElementById('animation-area').classList.remove('hidden');
        }, 2000);
    }
}

// ARABA SÜRÜKLEME (MOBİL & MASAÜSTÜ)
const car = document.getElementById('car');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');

const moveCar = (clientX) => {
    const trackRect = document.getElementById('track').getBoundingClientRect();
    let x = clientX - trackRect.left - 25;
    if (x > 0 && x < trackRect.width - 50) {
        car.style.left = x + 'px';
        if (x > trackRect.width * 0.4) {
            flap.classList.add('torn-flap');
            setTimeout(() => letter.classList.add('reveal-letter'), 300);
        }
    }
};

car.addEventListener('touchmove', (e) => moveCar(e.touches[0].clientX));
car.addEventListener('drag', (e) => { if(e.clientX > 0) moveCar(e.clientX); });