const words = ["Çok", "Teşekkür", "Ederim", "Ebrar"];
const board = document.getElementById('puzzle-board');
const piecesContainer = document.getElementById('lego-pieces');
const music = document.getElementById('bg-music');
let completed = 0;

const startMusic = () => { music.play().catch(() => {}); };

words.forEach((word, i) => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.id = `zone-${i}`;
    board.appendChild(zone);

    const piece = document.createElement('div');
    piece.className = 'lego-piece';
    piece.innerText = word;
    piece.dataset.index = i;
    piece.addEventListener('pointerdown', startDrag);
    piecesContainer.appendChild(piece);
});

let activeItem = null;
let offset = { x: 0, y: 0 };

function startDrag(e) {
    startMusic();
    activeItem = e.target;
    activeItem.setPointerCapture(e.pointerId);
    
    const rect = activeItem.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;

    activeItem.style.position = 'fixed';
    activeItem.style.zIndex = "1000";
    moveAt(e);

    activeItem.addEventListener('pointermove', onMove);
    activeItem.addEventListener('pointerup', stopDrag);
}

function onMove(e) {
    if (!activeItem) return;
    moveAt(e);
}

function moveAt(e) {
    activeItem.style.left = (e.clientX - offset.x) + 'px';
    activeItem.style.top = (e.clientY - offset.y) + 'px';
}

function stopDrag(e) {
    if (!activeItem) return;
    
    const targetZone = document.getElementById(`zone-${activeItem.dataset.index}`);
    const zRect = targetZone.getBoundingClientRect();
    const pRect = activeItem.getBoundingClientRect();

    const isCorrect = (
        pRect.left < zRect.right && pRect.right > zRect.left &&
        pRect.top < zRect.bottom && pRect.bottom > zRect.top
    );

    if (isCorrect) {
        targetZone.appendChild(activeItem);
        activeItem.style.position = 'static';
        activeItem.removeEventListener('pointerdown', startDrag);
        completed++;
        if (completed === words.length) {
            setTimeout(() => {
                document.getElementById('puzzle-section').classList.add('hidden');
                document.getElementById('animation-area').classList.remove('hidden');
            }, 1000);
        }
    } else {
        activeItem.style.position = 'relative';
        activeItem.style.left = '0'; activeItem.style.top = '0';
    }
    
    activeItem.releasePointerCapture(e.pointerId);
    activeItem.removeEventListener('pointermove', onMove);
    activeItem.removeEventListener('pointerup', stopDrag);
    activeItem = null;
}

// ARABA KAYDIRMA
const car = document.getElementById('car');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');

car.addEventListener('pointerdown', (e) => {
    car.setPointerCapture(e.pointerId);
    const moveCar = (me) => {
        const trackRect = document.getElementById('track').getBoundingClientRect();
        let x = me.clientX - trackRect.left - 30;
        if (x > 0 && x < trackRect.width - 80) {
            car.style.left = x + 'px';
            if (x > trackRect.width * 0.5) {
                flap.classList.add('torn-flap');
                setTimeout(() => letter.classList.add('reveal-letter'), 300);
            }
        }
    };
    car.addEventListener('pointermove', moveCar);
    car.addEventListener('pointerup', () => {
        car.removeEventListener('pointermove', moveCar);
    }, { once: true });
});