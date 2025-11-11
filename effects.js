// 通用特效方法：撒花与烟花
(function () {
  const DEFAULT_COLORS = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
  ];

  function createConfetti(options = {}) {
    const {
      containerId = 'confettiContainer',
      colors = DEFAULT_COLORS,
      pieceCount = 100,
      intervalMs = 10
    } = options;

    let confettiContainer = document.getElementById(containerId);
    if (!confettiContainer) {
      confettiContainer = document.createElement('div');
      confettiContainer.id = containerId;
      confettiContainer.className = 'confetti-container';
      document.body.appendChild(confettiContainer);
    }

    confettiContainer.innerHTML = '';

    for (let i = 0; i < pieceCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const leftPosition = Math.random() * 100;
        confetti.style.left = `${leftPosition}%`;

        const colorIndex = Math.floor(Math.random() * colors.length);
        confetti.style.backgroundColor = colors[colorIndex];

        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        const duration = Math.random() * 2 + 2;
        confetti.style.animationDuration = `${duration}s`;

        const delay = Math.random() * 0.5;
        confetti.style.animationDelay = `${delay}s`;

        confettiContainer.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, (duration + delay) * 1000);
      }, i * intervalMs);
    }
  }

  function createFireworks(options = {}) {
    const {
      containerSelector = '.container',
      colors = DEFAULT_COLORS,
      fireworkCount = 10
    } = options;

    const gameContainer = document.querySelector(containerSelector);
    if (!gameContainer) return;
    const containerRect = gameContainer.getBoundingClientRect();
    gameContainer.style.position = 'relative';

    for (let i = 0; i < fireworkCount; i++) {
      setTimeout(() => {
        const startX = Math.random() * (containerRect.width - 40) + 20;
        const startY = containerRect.height - 20;
        const explosionX = Math.random() * (containerRect.width - 80) + 40;
        const explosionY = Math.random() * (containerRect.height * 0.6) + 40;

        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${startX}px`;
        firework.style.top = `${startY}px`;
        gameContainer.appendChild(firework);

        let startTime = null;
        const duration = Math.random() * 0.5 + 0.5;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
          const easeOutProgress = 1 - Math.pow(1 - progress, 3);
          const currentX = startX + (explosionX - startX) * easeOutProgress;
          const currentY = startY + (explosionY - startY) * easeOutProgress;
          firework.style.left = `${currentX}px`;
          firework.style.top = `${currentY}px`;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            explodeFirework(currentX, currentY, gameContainer, colors);
            firework.remove();
          }
        }

        requestAnimationFrame(animate);
      }, i * 300);
    }
  }

  function explodeFirework(x, y, gameContainer, colors) {
    const mainColor = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = Math.floor(Math.random() * 31) + 50;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const color = Math.random() < 0.6 ? mainColor : colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance + (Math.random() * 30 - 15);

        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;

        const duration = Math.random() * 0.8 + 0.7;
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        particle.style.setProperty('--final-scale', Math.random() * 0.5 + 0.5);
        particle.style.animation = `explode ${duration}s forwards ease-out`;

        gameContainer.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode) particle.remove();
        }, duration * 1000);

        if (Math.random() < 0.1) {
          setTimeout(() => {
            createSecondaryBurst(x + endX * 0.6, y + endY * 0.6, color, gameContainer);
          }, duration * 1000 * 0.6);
        }
      }, i * 5);
    }
  }

  function createSecondaryBurst(x, y, color, gameContainer) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
      const distance = Math.random() * 30 + 20;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;

      const duration = Math.random() * 0.4 + 0.3;
      particle.style.setProperty('--end-x', `${endX}px`);
      particle.style.setProperty('--end-y', `${endY}px`);
      particle.style.setProperty('--final-scale', Math.random() * 0.5);
      particle.style.animation = `explode ${duration}s forwards ease-out`;

      gameContainer.appendChild(particle);
      setTimeout(() => { if (particle.parentNode) particle.remove(); }, duration * 1000);
    }
  }

  // 导出到全局
  window.createConfetti = createConfetti;
  window.createFireworks = createFireworks;
})();