  const btn = document.getElementById("launch-plane");
  const plane = document.getElementById("plane");
  const planeImg = document.getElementById("plane-img");

  let lastSmokeTime = null;

  btn.addEventListener("click", () => {
    btn.style.display = "none";
    plane.style.display = "flex";

    const centerX = window.innerWidth / 2;
    const centerY = 300;
    const radius = 120;

    let startTime = null;
    let lastX = -100;
    let lastY = centerY;

    function animate(timestamp) {
      if (!startTime) {
        startTime = timestamp;
        lastSmokeTime = timestamp;
      }
      const t = (timestamp - startTime) / 1000;

      let x, y;

      if (t < 2) {
        x = t * centerX / 2;
        y = centerY;
      } else if (t < 4) {
        const angle = (t - 2) / 2 * 2 * Math.PI + 1.5 * Math.PI;
        x = centerX + radius * Math.cos(angle);
        y = (centerY - radius) - radius * Math.sin(angle);
      } else if (t < 6) {
        x = centerX + (t - 4) * centerX / 2;
        y = centerY;
      } else {
        plane.style.display = "none";
        btn.style.display = "flex";
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;

      plane.style.transform = `translate(${x}px, ${y}px) rotate(${angleDeg}deg)`;

      if (timestamp - lastSmokeTime > 100) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.left = `${x + 22}px`;
        smoke.style.top = `${y + 20}px`;
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1000);
        lastSmokeTime = timestamp;
      }

      lastX = x;
      lastY = y;

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  });
