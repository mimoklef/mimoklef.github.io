
  const frog = document.getElementById('frog');
  const frogImg = document.getElementById('frog-img');
  const launch = document.getElementById('launch-circle');
  const ground = document.getElementById('ground');
  const body = document.body;
  const cloudContainer = document.getElementById('cloud-container');

  const jumpHeight = 80;
  const jumpDuration = 400;
  const delay = 300;
  const jumpsPerSide = 7;

  let direction = 1;
  let positionProgress = 0;
  let jumpCount = 0;
  const maxJumps = jumpsPerSide * 2;

  function updateFrogPosition() {
    const availableWidth = Math.max(0, document.documentElement.clientWidth - frog.offsetWidth);
    // Leave room for the frog's 15-degree tilt at both edges.
    const edgeMargin = Math.min(30, availableWidth / 2);
    frog.style.left = `${edgeMargin + (availableWidth - edgeMargin * 2) * positionProgress}px`;
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeIn(t) {
    return t * t * t;
  }

  async function jump() {
    if (jumpCount === jumpsPerSide) {
      direction *= -1;
      const flip = direction === -1 ? 'rotateY(180deg)' : '';
      frog.style.transition = 'transform 0.3s ease';
      frog.style.transform = `${flip} translateY(0px) rotate(0deg)`;
      await new Promise(r => setTimeout(r, 300));
      frog.style.transition = '';
    }

    if (jumpCount >= maxJumps) {
      frog.style.transition = 'transform 0.3s ease';
      frog.style.transform = 'rotateY(0deg)';
      await new Promise(r => setTimeout(r, 300));
      frog.style.transition = '';
      await new Promise(r => setTimeout(r, 300));

      frog.style.display = 'none';
      ground.style.width = '0';
      launch.style.opacity = '1';
      launch.style.transform = 'scale(1)';
      launch.classList.remove('animate-out');
      launch.style.display = 'flex';
      body.classList.remove('animation-mode');
      cloudContainer.innerHTML = '';
      return;
    }

    const startProgress = positionProgress;
    const nextProgress = (direction === 1 ? jumpCount + 1 : maxJumps - jumpCount - 1) / jumpsPerSide;
    const startTime = performance.now();
    await new Promise(resolve => {
      function frame(now) {
        let t = (now - startTime) / jumpDuration;
        if (t > 1) t = 1;

        const y = t < 0.5 ? easeOut(t * 2) : 1 - easeIn((t - 0.5) * 2);
        const dy = -y * jumpHeight;
        positionProgress = startProgress + (nextProgress - startProgress) * t;

        const baseAngle = -15;
        const angle = (t < 0.5 ? y : (1 - y)) * baseAngle;
        const flip = direction === -1 ? 'rotateY(180deg)' : '';

        updateFrogPosition();
        frog.style.transform = `${flip} translateY(${dy}px) rotate(${angle}deg)`;

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          frog.style.transform = `${flip} translateY(0px) rotate(0deg)`;
          jumpCount++;
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });

    await new Promise(r => setTimeout(r, delay));
    jump();
  }

  launch.addEventListener('click', () => {
    launch.classList.add('animate-out');
    ground.style.width = '100%';
    body.classList.add('animation-mode');
    direction = 1;
    positionProgress = 0;
    jumpCount = 0;
    frog.style.display = 'flex';
    updateFrogPosition();

    cloudContainer.innerHTML = '';
    const clouds = [
      { top: 50, left: '40%' },
      { top: 150, left: '10%' },
      { top: 200, left: '60%' }
    ];

    clouds.forEach((config, i) => {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      cloud.style.top = `${config.top}px`;
      cloud.style.left = config.left;
      cloud.style.display = 'block';
      cloud.style.animation = `cloudMove ${80 + (i * 10)}s linear infinite`;
      cloudContainer.appendChild(cloud);
    });

    setTimeout(() => {
      launch.style.display = 'none';
      jump();
    }, 1000);
  });

  window.addEventListener('resize', updateFrogPosition);

