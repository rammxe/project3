let randomNumber = 0;
let inputNum = document.getElementById("inputNumber");
let gameText = document.getElementById("game-text");
let chanceArea = document.getElementById("chance");
let chance = 5;
let gameEnd = false;
let inputNumList = [];

// 화면 전환 요소
let startScreen = document.getElementById("startScreen");
let playScreen = document.getElementById("playScreen");
let startGameBtn = document.getElementById("startGameBtn");

// 배경 이미지 요소
let startBackground = document.querySelector(".start-background");
let gameBackgroundPc = document.querySelector(".game-background-pc");
let gameBackgroundMobile = document.querySelector(".game-background-mobile");

// 게임오버 모달
let gameoverModal = document.getElementById("gameoverModal");
let yesBtn = document.querySelector(".yes-btn");
let noBtn = document.querySelector(".no-btn");

// START 버튼 클릭 시 게임 시작
startGameBtn.addEventListener("click", function () {
  this.style.transform = "translateY(6px) scale(0.95)";

  setTimeout(() => {
    startScreen.style.animation = "fadeOut 0.5s ease forwards";

    setTimeout(() => {
      // 시작 화면 숨기기
      startScreen.style.display = "none";
      startBackground.style.display = "none";

      // 화면 크기에 따라 적절한 배경 보이기
      if (window.innerWidth >= 1200) {
        // PC
        gameBackgroundPc.style.display = "block";
        gameBackgroundMobile.style.display = "none";
      } else {
        // 태블릿/모바일
        gameBackgroundPc.style.display = "none";
        gameBackgroundMobile.style.display = "block";
      }

      playScreen.style.display = "block";

      computerNum();
      gameText.textContent = "START";
      gameText.className = "start";
    }, 500);
  }, 150);
});

// 화면 크기 변경 시 배경 이미지 전환
window.addEventListener("resize", function () {
  if (playScreen.style.display === "block") {
    if (window.innerWidth >= 1200) {
      gameBackgroundPc.style.display = "block";
      gameBackgroundMobile.style.display = "none";
    } else {
      gameBackgroundPc.style.display = "none";
      gameBackgroundMobile.style.display = "block";
    }
  }
});

// 랜덤 번호 지정
function computerNum() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  console.log("정답:", randomNumber);
}

// 버튼 이벤트 - 모든 GO 버튼에 이벤트 등록
document.addEventListener("click", function (e) {
  // GO 버튼 클릭
  if (
    e.target.classList.contains("go-button") ||
    e.target.classList.contains("go-button-circle")
  ) {
    start();
  }
  // RESET 버튼 클릭
  if (
    e.target.classList.contains("reset-button") ||
    e.target.classList.contains("reset-button-circle")
  ) {
    reset();
  }
});

// 모달 YES 버튼
yesBtn.addEventListener("click", function () {
  gameoverModal.style.display = "none";
  reset();
});

// 모달 NO 버튼
noBtn.addEventListener("click", function () {
  gameoverModal.style.display = "none";
});

// 입력창 포커스 시 초기화
inputNum.addEventListener("focus", function () {
  inputNum.value = "";
});

// Enter 키로도 입력 가능
inputNum.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    start();
  }
});

// 하트 업데이트 함수
function updateHearts() {
  let hearts = "";
  for (let i = 0; i < chance; i++) {
    hearts += "❤️ ";
  }
  for (let i = chance; i < 5; i++) {
    hearts += "🖤 ";
  }
  chanceArea.textContent = hearts;
}

// 게임 시작
function start() {
  let inputNumValue = inputNum.value;

  if (inputNumValue === "" || inputNumValue === null) {
    gameText.textContent = "숫자입력!";
    gameText.className = "";
    return;
  }

  if (inputNumValue > 100 || inputNumValue < 1) {
    gameText.textContent = "1~100만!";
    gameText.className = "";
    return;
  }

  if (inputNumList.includes(inputNumValue)) {
    gameText.textContent = "중복!";
    gameText.className = "";
    return;
  }

  chance--;
  updateHearts();

  if (inputNumValue < randomNumber) {
    gameText.textContent = "UP UP UP";
    gameText.className = "up";
  } else if (inputNumValue > randomNumber) {
    gameText.textContent = "DOWN DOWN DOWN";
    gameText.className = "down";
  } else {
    gameText.textContent = "🎉BINGO!🎉";
    gameText.className = "bingo";
    gameEnd = true;

    // 빙고 효과 트리거
    triggerBingoEffect();
  }

  inputNumList.push(inputNumValue);

  if (chance == 0 && !gameEnd) {
    gameEnd = true;
    gameText.textContent = "GAME OVER";
    gameText.className = "gameover";

    // 게임오버 효과 트리거
    triggerGameOverEffect();
  }

  if (gameEnd == true) {
    // 모든 GO 버튼 비활성화
    document
      .querySelectorAll(".go-button, .go-button-circle")
      .forEach((btn) => {
        btn.disabled = true;
      });
  }

  inputNum.value = "";
}

// 리셋
function reset() {
  const container = document.getElementById("gameContainer");
  const particleContainer = document.getElementById("particleContainer");

  // 기존 효과 제거
  container.classList.remove(
    "shake-celebration",
    "ash-effect",
    "gameover-dark"
  );
  particleContainer.innerHTML = "";

  computerNum();
  gameEnd = false;
  chance = 5;

  // 모든 GO 버튼 활성화
  document.querySelectorAll(".go-button, .go-button-circle").forEach((btn) => {
    btn.disabled = false;
  });

  updateHearts();
  inputNumList = [];
  gameText.textContent = "START";
  gameText.className = "start";
  inputNum.value = "";
}

// 빙고 효과 - 게임기 흔들림 + 위에서 아래로 폭죽 + 무지개 하트
function triggerBingoEffect() {
  const container = document.getElementById("gameContainer");
  const particleContainer = document.getElementById("particleContainer");

  // 게임기 흔들흔들
  container.classList.add("shake-celebration");
  setTimeout(() => {
    container.classList.remove("shake-celebration");
  }, 800);

  // 무지개 하트 애니메이션 (순차적으로)
  animateRainbowHearts();

  // 위에서 아래로 떨어지는 폭죽 파티클
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      createFallingFireworks(particleContainer);
    }, i * 100);
  }
}

// 무지개 하트 애니메이션 - 순차적으로 변하면서 커졌다 작아졌다
function animateRainbowHearts() {
  const rainbowColors = ["❤️", "🧡", "💛", "💚", "💙"];

  // 하트를 하나씩 순차적으로 변경
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      let heartsHTML = "";
      for (let j = 0; j < 5; j++) {
        if (j <= i) {
          heartsHTML += `<span class="rainbow-heart">${rainbowColors[j]}</span> `;
        } else {
          heartsHTML += "❤️ ";
        }
      }
      chanceArea.innerHTML = heartsHTML;
    }, i * 200);
  }
}

// 위에서 아래로 떨어지는 폭죽 파티클
function createFallingFireworks(container) {
  const colors = [
    "#ff0000",
    "#ffd700",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#ff00ff",
    "#ff69b4",
    "#ffff00",
  ];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "firework-particle-fall";

    const startX = Math.random() * window.innerWidth;
    const fallDistance = Math.random() * 600 + 400;

    particle.style.left = startX + "px";
    particle.style.top = "-20px";
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.setProperty("--fall-distance", fallDistance + "px");

    // 크기 랜덤
    const size = Math.random() * 8 + 6;
    particle.style.width = size + "px";
    particle.style.height = size + "px";

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 2000);
  }
}

// 게임오버 효과 - 더 극적인 잿가루 흩어짐 + 모달
function triggerGameOverEffect() {
  const container = document.getElementById("gameContainer");
  const particleContainer = document.getElementById("particleContainer");

  // 어두워지는 효과
  container.classList.add("gameover-dark", "ash-effect");

  // 더 많은 잿가루 파티클 생성 (더 극적으로)
  for (let i = 0; i < 200; i++) {
    setTimeout(() => {
      createAshParticleDramatic(particleContainer);
    }, i * 10);
  }

  // 2.5초 후 모달 띄우기
  setTimeout(() => {
    gameoverModal.style.display = "block";
  }, 2500);
}

// 더 극적인 잿가루 파티클 생성
function createAshParticleDramatic(container) {
  const particle = document.createElement("div");
  particle.className = "ash-particle";

  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const tx = (Math.random() - 0.5) * 400;
  const ty = Math.random() * 600 + 300;
  const rotate = Math.random() * 720 - 360;

  // 크기와 색상 다양화
  const size = Math.random() * 8 + 4;
  const grayValue = Math.floor(Math.random() * 100 + 100);

  particle.style.left = startX + "px";
  particle.style.top = startY + "px";
  particle.style.width = size + "px";
  particle.style.height = size + "px";
  particle.style.background = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${
    Math.random() * 0.5 + 0.5
  })`;
  particle.style.setProperty("--tx", tx + "px");
  particle.style.setProperty("--ty", ty + "px");
  particle.style.setProperty("--rotate", rotate + "deg");

  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 3000);
}

// 초기 하트 표시
updateHearts();

// fadeOut 애니메이션
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }
`;
document.head.appendChild(style);
