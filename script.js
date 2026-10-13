// находим нужные элементы на странице
const stickerInput = document.getElementById('stickerInput');
const addBtn = document.getElementById('addBtn');
const stickerPool = document.getElementById('stickerPool');
const board = document.getElementById('board');
const poolEmpty = document.getElementById('poolEmpty');
const boardEmpty = document.getElementById('boardEmpty');
const clearPool = document.getElementById('clearPool');
const clearBoard = document.getElementById('clearBoard');

// список цветов
const COLORS = ['color-yellow', 'color-pink', 'color-green',
                'color-blue', 'color-purple', 'color-orange'];

// функция создания стикера
function createSticker(text) {
    const sticker = document.createElement('div');
    sticker.classList.add('sticker');

    // случайный цвет
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    sticker.classList.add(color);

    // текст
    sticker.textContent = text;

    // кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-btn');
    sticker.append(deleteBtn);

    deleteBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        sticker.remove();
        updateEmpty();
    });

    // перетаскивание
    sticker.draggable = true;

    sticker.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', 'sticker');

        window.draggedSticker = sticker;

        // запоминаем смещение курсора внутри стикера
        const rect = sticker.getBoundingClientRect();
        window.offsetX = event.clientX - rect.left;
        window.offsetY = event.clientY - rect.top;

        sticker.style.opacity = '0.6';
        sticker.style.zIndex = Date.now();
    });

    sticker.addEventListener('dragend', function () {
        sticker.style.opacity = '1';
    });

    return sticker;
}

// добавление стикера в пул
function addSticker() {
    const text = stickerInput.value.trim();

    if (text === '') {
        alert('Введите текст стикера!');
        return;
    }

    const sticker = createSticker(text);
    stickerPool.append(sticker);

    stickerInput.value = '';
    stickerInput.focus();
    updateEmpty();
}

addBtn.addEventListener('click', addSticker);

stickerInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addSticker();
    }
});

// разрешаем drop
board.addEventListener('dragover', function (event) {
    event.preventDefault();
});

board.addEventListener('drop', function (event) {
    event.preventDefault();

    const sticker = window.draggedSticker;
    if (!sticker) return;

    // если стикер пришёл из пула — переносим его в борд
    if (!sticker.classList.contains('on-board')) {
        board.append(sticker);
        sticker.classList.add('on-board');
    }

    // позиция с учётом смещения курсора
    const boardRect = board.getBoundingClientRect();
    let x = event.clientX - boardRect.left - window.offsetX;
    let y = event.clientY - boardRect.top - window.offsetY;

    x = Math.max(0, Math.min(x, board.clientWidth - sticker.offsetWidth));
    y = Math.max(0, Math.min(y, board.clientHeight - sticker.offsetHeight));

    sticker.style.left = x + 'px';
    sticker.style.top = y + 'px';
    sticker.style.zIndex = Date.now();
    sticker.style.opacity = '1';

    window.draggedSticker = null;
    updateEmpty();
});

// очистка
clearPool.addEventListener('click', function () {
    stickerPool.querySelectorAll('.sticker').forEach(function (s) { s.remove(); });
    updateEmpty();
});

clearBoard.addEventListener('click', function () {
    board.querySelectorAll('.sticker').forEach(function (s) { s.remove(); });
    updateEmpty();
});

// пусто/не пусто
function updateEmpty() {
    poolEmpty.style.display = stickerPool.querySelectorAll('.sticker').length ? 'none' : 'block';
    boardEmpty.style.display = board.querySelectorAll('.sticker').length ? 'none' : 'block';
}

updateEmpty();