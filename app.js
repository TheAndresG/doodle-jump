document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;

  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;

  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platSpace = 600 / platformCount;
      let newPlatBottom = 100 + i * platSpace;
      let newPlat = new Platform(newPlatBottom);
      platforms.push(newPlat);
    }
  }
  function movePlats() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((plat) => {
        plat.bottom -= 4;
        let visual = plat.visual;
        visual.style.bottom = plat.bottom + "px";

        if (plat.bottom < 10) {
          let firstPlat = platforms[0].visual;
          firstPlat.classList.remove("platform");
          platforms.shift();
          score++;
          let newPlatorm = new Platform(600);
          platforms.push(newPlatorm);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;

    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace > 350) {
        fall();
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;

    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        GameOver();
      }
      platforms.forEach((e) => {
        if (
          doodlerBottomSpace >= e.bottom &&
          doodlerBottomSpace <= e.bottom + 15 &&
          doodlerLeftSpace + 60 >= e.left &&
          doodlerLeftSpace <= e.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }
  function GameOver() {
    console.log("game over");
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  }

  function moveLeft() {
    clearInterval(leftTimerId);

    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + "px";
      } else moveRight();
    }, 30);
  }

  function moveRight() {
    clearInterval(rightTimerId);

    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + "px";
      } else moveLeft();
    }, 30);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }
  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlats, 30);
    }
    jump();
    document.addEventListener("keyup", control);
  }
  start();
});
