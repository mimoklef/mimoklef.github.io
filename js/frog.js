
  const frog = document.getElementById('frog');
  const frogImg = document.getElementById('frog-img');
  const launch = document.getElementById('launch-circle');
  const ground = document.getElementById('ground');
  const body = document.body;
  const cloudContainer = document.getElementById('cloud-container');

  const jumpHeight = 80;
  const jumpDuration = 400;
  const delay = 300;
  const frogWidth = 100;
  const jumpsPerSide = 7;

  let direction = 1;
  let screenWidth = window.innerWidth;
  let step = Math.floor((screenWidth - frogWidth) / jumpsPerSide);
  let positionX = 20;
  let jumpCount = 0;
  const maxJumps = jumpsPerSide * 2;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeIn(t) {
    return t * t * t;
  }

  async function jump() {
    let nextX = positionX + direction * step;

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

    const startTime = performance.now();
    await new Promise(resolve => {
      function frame(now) {
        let t = (now - startTime) / jumpDuration;
        if (t > 1) t = 1;

        const y = t < 0.5 ? easeOut(t * 2) : 1 - easeIn((t - 0.5) * 2);
        const dy = -y * jumpHeight;
        const dx = positionX + direction * step * t;

        const baseAngle = -15;
        const angle = (t < 0.5 ? y : (1 - y)) * baseAngle;
        const flip = direction === -1 ? 'rotateY(180deg)' : '';

        frog.style.left = dx + "px";
        frog.style.transform = `${flip} translateY(${dy}px) rotate(${angle}deg)`;

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          positionX += direction * step;
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
    positionX = 20;
    jumpCount = 0;
    frog.style.left = '20px';
    frog.style.display = 'flex';

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

  window.addEventListener("resize", () => {
    screenWidth = window.innerWidth;
    step = Math.floor((screenWidth - frogWidth) / jumpsPerSide);
  });

