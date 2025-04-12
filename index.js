const canvas = document.getElementById("canvas");
let context;
let canvasWidth = window.innerWidth / 2 + 150;
let canvasHeight = window.innerHeight - 30;
let doodleRightImg;
let gameOver = false;
let img1 = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/17885a1f-44d8-4650-b867-33f23c532660/d43t0nr-e957aaf6-0fb9-4063-8dc0-0a7a85338ed2.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE3ODg1YTFmLTQ0ZDgtNDY1MC1iODY3LTMzZjIzYzUzMjY2MFwvZDQzdDBuci1lOTU3YWFmNi0wZmI5LTQwNjMtOGRjMC0wYTdhODUzMzhlZDIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.j4kSRAxpVhZaElkdcvDsjKhOQJrd4f4YHetAxBF29wo';
let img2 = 'https://static.wikia.nocookie.net/dorkly/images/e/eb/Doodlejumpdorkly.png.png/revision/latest?cb=20220516194319'
let platformImg = 'https://www.pikpng.com/pngl/m/421-4214594_game-platform-png-platform-clipart-transparent-png.png'
let opponentImg = "https://www.pngall.com/wp-content/uploads/14/Mario-Kart-PNG-Free-Image.png"
let score = 0;
let minimumKil = 50;
let killer = 0;
let interval;
let timer = 100;
let victory = false;


class Doddle {
    constructor() {
        this.changePosition = { right: true, left: false }
        this.width = 36;
        this.height = 36;
        this.x = canvasWidth / 2 - this.width / 2;
        this.doodleRightImg;
        this.doodleLeftImg;
        this.jumpStrength = -10;
        this.img = null;
        this.y = canvasHeight - this.height - 10;
        this.gravity = 0.3;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.bullet = [];
    }
    jump() {
        this.velocity.y = this.jumpStrength;
    }
    HandleKeyDown(event) {
        switch (event.code) {
            case 'ArrowRight':
                this.img = this.doodleRightImg
                this.velocity.x = 4
                this.changePosition.right = true;
                this.changePosition.left = false;
                break;
            case 'ArrowLeft':
                this.img = this.doodleLeftImg
                this.velocity.x = -4;
                this.changePosition.left = true;
                this.changePosition.right = false;
                break;
            case 'ArrowUp':
                this.velocity.y = -4;
                break;
            case 'Space':
                if (!gameOver && !victory) return;
                this.changePosition = { right: true, left: false }
                doddle.y = platform.platform[0].y - platform.platform[0].height;
                doddle.x = platform.platform[0].x / platform.platform[0].height;
                gameOver = false;
                victory = false;
                score = 0;
                killer = 0;
                setInterval(() => {
                    timerKill()
                }, 10000)
                timer = 100;
                platform.opponent = [];
                requestAnimationFrame(update);
                break;
            case 'KeyW':
                this.bullet.push(new Bullet({
                    radius: 3,
                    color: "red",
                    x: this.x + this.width - 5,
                    y: this.y + 10,
                }))
                break;
        }
    }
    draw() {
        this.doodleRightImg = new Image();
        this.doodleRightImg.src = img1;
        this.doodleLeftImg = new Image();
        this.doodleLeftImg.src = img2;
    }
    movePaddle() {
        if (this.changePosition.right) {
            this.changePosition.left = false;
            this.img = this.doodleRightImg;
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
        else if (this.changePosition.left) {
            this.changePosition.right = false
            this.img = this.doodleLeftImg;
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }
    update() {
        this.x += this.velocity.x;
        if (this.x + this.width > canvas.width) {
            this.x = 0;
        }
        else if (this.x + this.width < 0) {
            this.x = canvas.width - this.width;
        }
        this.velocity.y += this.gravity;
        this.y += this.velocity.y;

        if (this.y > canvas.height) {
            gameOver = true;
        }
        else if (this.y <= 0) {
            this.velocity.y += 4;
        }
    }
    bulletDraw() {
        this.bullet.forEach((element, index) => {
            if (this.changePosition.left) {
                element.x -= 12
                if (element.x <= 0) {
                    this.bullet.splice(index, 1)
                }
            }
            else {
                element.x += 12
                if (element.x >= canvasWidth) {
                    this.bullet.splice(index, 1)
                }
            }
            context.beginPath();
            context.arc(element.x, element.y, element.radius, 0, Math.PI * 2, true)
            context.fillStyle = element.color
            context.closePath();
            context.fill();
        })
    }
}

var doddle = new Doddle()

class Bullet {
    constructor(options) {
        this.radius = options.radius,
            this.color = options.color,
            this.x = options.x,
            this.y = options.y
    }
}

class Opponent {
    constructor(options) {
        this.img = options.img
        this.width = options.width,
            this.height = options.height,
            this.x = options.x,
            this.y = options.y
        this.heart = options.heart
    }
}

class Platform {
    constructor(options) {
        this.width = options.width;
        this.img;
        this.height = options.height;
        this.color = options.color
        this.platform = [];
        this.opponentImg;
        this.opponent = [];
    }
    draw() {
        for (let i = 0; i < 9; i++) {
            this.addPlatform(i)
        }
    }
    addPlatform(i) {
        this.img = new Image();
        this.img.src = platformImg;
        let platformX = Math.floor(Math.random() * (canvasWidth - 70))
        let platformY = canvasHeight - (i * 100) - 10
        this.platform.push({
            img: this.img,
            x: platformX,
            y: platformY,
            width: this.width,
            height: this.height,
            color: this.color,
        })
    }
    animation() {
        for (let i = 0; i < this.platform.length; i++) {
            if (doddle.velocity.y < 0 && doddle.y < canvasHeight - 150) {
                this.platform[i].y += 1;
            }
            if (this.platform[i].y > canvasHeight) {
                let platformX = Math.floor(Math.random() * (canvasWidth - 70))
                this.img = new Image();
                this.img.src = platformImg
                this.platform.shift();
                score++;
                if (score >= 3) {
                    this.updateOpponent()
                }
                this.platform.push({
                    img: this.img,
                    x: platformX,
                    y: 0,
                    width: this.width,
                    height: this.height,
                    color: this.color,
                })
            }
        }
    }

    updateOpponent() {
        this.opponentImg = new Image();
        this.opponentImg.src = opponentImg;
        this.opponent.push(new Opponent({
            img: this.opponentImg,
            x: Math.floor(Math.random() * (canvasWidth - 150)),
            y: 0,
            width: 36,
            height: 36,
            heart: 10
        }))
    }
    platforms() {
        for (let i = 0; i < this.platform.length; i++) {
            if (this.check(doddle, this.platform[i])) {
                doddle.y = this.platform[i].y - this.platform[i].height - 36
                doddle.velocity.y = 0
                doddle.velocity.x = 0
            }
        }
    }
    check(a, b) {
        return a.x <= b.x + b.width &&
            a.x + a.width >= b.x &&
            a.y <= b.y + b.height &&
            a.y + a.height >= b.y;
    }
    updatePlatforms() {
        this.platform.forEach((element) => {
            context.drawImage(element.img, element.x, element.y, element.width, element.height)
        })
    }
    drawOpponent() {
        this.opponent.forEach((element) => {
            this.platform.forEach((item) => {
                if (this.check(element, item)) {
                    element.y = item.y - item.height
                    element.x -= 1
                    if (element.x <= 0) {
                        element.x *= 1
                    }
                }
            })
            const horozintal = element.x + element.width - 10;
            const vertical = element.y
            context.fillStyle = `${element.heart <= 5 ? "red" : "green"}`;
            context.font = "18px Arial";
            context.fillText(element.heart, horozintal, vertical)
            context.drawImage(element.img, element.x, element.y, element.width, element.height)
        })
    }
    animationOpponent() {
        this.opponent.forEach((el, index) => {
            el.y += 2
            if (el.y > canvasHeight) {
                this.opponent.splice(index, 1)
            }
            if (doddle.x <= el.x + el.width
                && doddle.x + doddle.width >= el.x
                && doddle.y <= el.y + el.height
                && doddle.y + el.height >= el.y) {
                gameOver = true;
            }
            doddle.bullet.forEach((bull, ind) => {
                if (bull.x <= el.x + el.width
                    && bull.x + bull.radius >= el.x
                    && bull.y <= el.y + el.height
                    && bull.y + el.height >= el.y
                ) {
                    el.heart--;
                    if (el.heart === 0) {
                        this.opponent.splice(index, 1)
                        killer++
                        if (killer >= 50) {
                            victory = true;
                        }
                    }
                    doddle.bullet.splice(ind, 1)
                }
            })
        })
    }
}

var platform = new Platform({
    width: 150,
    height: 20,
    color: "green",
})

platform.draw();

window.addEventListener("load", () => {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context = canvas.getContext("2d");
    requestAnimationFrame(update)
    setInterval(() => {
        timerKill()
    }, 10000)
    document.addEventListener("keydown", (event) => {
        doddle.HandleKeyDown(event)
    })
})

function timerKill() {
    timer--;
    if (timer <= 0 && killer < 50) {
        gameOver = true;
    }
}

function updateTimer() {
    context.font = "20px Arial";
    context.fillStyle = "yellow";
    context.fillText(timer, canvasWidth / 2, 50)
}

function update() {
    if (gameOver) {
        context.font = "20px Arial";
        context.fillStyle = "red";
        context.fillText(`Game Over You have destroyed more than one ${killer} / ${minimumKil}  enemy Yry Again is Space`, 150, canvasHeight / 2 - 75)
        return;
    }
    if (victory) {
        context.font = "20px Arial";
        context.fillStyle = "green";
        context.fillText(`You beat the game ${killer} / ${minimumKil}`, 10, canvasHeight / 2 - 75)
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, canvas.width, canvas.height)
    updateTimer()
    context.font = "20px Arial";
    context.fillStyle = "black";
    context.fillText(`Shoot: w`, 50, 20)
    context.fillText(`Score: ${score}`, 50, 50)
    context.font = "20px Arial";
    context.fillStyle = "red";
    context.fillText(`Kill: ${killer} / ${minimumKil}`, canvasWidth - 100, 50)
    doddle.draw()
    doddle.bulletDraw()
    doddle.movePaddle()
    doddle.update()
    platform.updatePlatforms()
    platform.drawOpponent()
    platform.animation()
    platform.platforms()
    platform.animationOpponent()
}