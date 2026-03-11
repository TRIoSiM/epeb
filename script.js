const words = ["Çok", "Teşekkür", "Ederim", "Ebrar"];
const board = document.getElementById('puzzle-board');
const piecesContainer = document.getElementById('lego-pieces');
const music = document.getElementById('bg-music');
let completed = 0;

// Müzik kontrolü
const startMusic = () => { music.play().catch(() => {}); };

// Puzzle Oluşturma
words.forEach((word, i) => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.dataset.index = i;
    board.appendChild(zone);

    const piece = document.createElement('div');
    piece.className = 'lego-piece';
    piece.innerText = word;
    piece.dataset.index = i;
    piece.id = "piece-" + i;

    // Olay Dinleyicileri (Mobil ve Masaüstü birleşik)
    piece.addEventListener('mousedown', startDrag);
    piece.addEventListener('touchstart', startDrag, {passive: false});

    piecesContainer.appendChild(piece);
});

let dragItem = null;

function startDrag(e) {
    startMusic();
    dragItem = e.target;
    dragItem.style.position = 'fixed';
    moveAt(e);

    document.addEventListener('mousemove', onDragging);
    document.addEventListener('touchmove', onDragging, {passive: false});
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function onDragging(e) {
    if (!dragItem) return;
    e.preventDefault();
    moveAt(e);
}

function moveAt(e) {
    const pageX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const pageY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragItem.style.left = pageX - dragItem.offsetWidth / 2 + 'px';
    dragItem.style.top = pageY - dragItem.offsetHeight / 2 + 'px';
}

function stopDrag(e) {
    if (!dragItem) return;
    
    const pageX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
    const pageY = e.type.includes('touch') ? e.changedTouches[0].clientY : e.clientY;
    
    dragItem.style.display = 'none';
    const dropTarget = document.elementFromPoint(pageX, pageY);
    dragItem.style.display = 'flex';

    if (dropTarget && dropTarget.classList.contains('drop-zone') && 
        dropTarget.dataset.index === dragItem.dataset.index) {
        dropTarget.appendChild(dragItem);
        dragItem.style.position = 'static';
        dragItem.removeEventListener('mousedown', startDrag);
        dragItem.removeEventListener('touchstart', startDrag);
        completed++;
        if (completed === words.length) win();
    } else {
        dragItem.style.position = 'static';
    }
    
    dragItem = null;
    document.removeEventListener('mousemove', onDragging);
    document.removeEventListener('touchmove', onDragging);
}

function win() {
    document.getElementById('success-message').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('puzzle-section').classList.add('hidden');
        document.getElementById('animation-area').classList.remove('hidden');
    }, 2000);
}

// ARABA KONTROLÜ
const car = document.getElementById('car');
const flap = document.getElementById('flap');
const letter = document.getElementById('letter');

const carMove = (e) => {
    e.preventDefault();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const trackRect = document.getElementById('track').getBoundingClientRect();
    let x = clientX - trackRect.left - 30;

    if (x > 0 && x < trackRect.width - 60) {
        car.style.left = x + 'px';
        if (x > trackRect.width * 0.5) {
            flap.classList.add('torn-flap');
            setTimeout(() => letter.classList.add('reveal-letter'), 400);
        }
    }
};

car.addEventListener('touchmove', carMove, {passive: false});
car.addEventListener('mousemove', (e) => { if(e.buttons === 1) carMove(e); });