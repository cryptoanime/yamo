
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

context.scale(20, 20);

let score = 0;

const candyImages = {
    'T': 'https://img.freepik.com/free-vector/gummy-bears-cartoon-style_1308-114543.jpg',
    'O': 'https://img.freepik.com/free-vector/lollipops-cartoon-style_1308-114540.jpg',
    'L': 'https://img.freepik.com/free-vector/chocolate-bar-cartoon-style_1308-114541.jpg',
    'J': 'https://img.freepik.com/free-vector/jelly-beans-cartoon-style_1308-114542.jpg',
    'I': 'https://img.freepik.com/free-vector/cotton-candy-cartoon-style_1308-114539.jpg',
    'S': 'https://img.freepik.com/free-vector/hard-candies-cartoon-style_1308-114544.jpg',
    'Z': 'https://img.freepik.com/free-vector/hard-candies-cartoon-style_1308-114544.jpg',
};

const pieceImages = {};
for (const key in candyImages) {
    const img = new Image();
    img.src = candyImages[key];
    pieceImages[key] = img;
}


function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos, player.piece);
}

function drawMatrix(matrix, offset, pieceType) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const imageKey = (pieceType && value === pieceType) ? pieceType : value;
                if (pieceImages[imageKey]) {
                    context.drawImage(pieceImages[imageKey], x + offset.x, y + offset.y, 1, 1);
                }
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = player.piece;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    const pieceType = pieces[pieces.length * Math.random() | 0];
    player.matrix = createPiece(pieceType);
    player.piece = pieceType;
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        score = 0;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    scoreElement.innerText = 'Score: ' + score;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        score += rowCount * 10;
        rowCount *= 2;
    }
}

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    piece: null,
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyCode === 87) {
        playerRotate(1);
    }
});

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [type, type, type],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [type, type],
            [type, type],
        ];
    } else if (type === 'L') {
        return [
            [0, type, 0],
            [0, type, 0],
            [0, type, type],
        ];
    } else if (type === 'J') {
        return [
            [0, type, 0],
            [0, type, 0],
            [type, type, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, type, 0, 0],
            [0, type, 0, 0],
            [0, type, 0, 0],
            [0, type, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, type, type],
            [type, type, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [type, type, 0],
            [0, type, type],
            [0, 0, 0],
        ];
    }
}

document.getElementById('play-tetris-btn').addEventListener('click', () => {
    playerReset();
    updateScore();
    update();
    document.getElementById('play-tetris-btn').style.display = 'none';
});
