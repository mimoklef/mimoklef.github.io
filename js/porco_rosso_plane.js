const btn = document.getElementById("launch-plane");
const plane = document.getElementById("plane");

if (!btn || !plane) {
  // The timeline card containing the button is not always rendered.
} else {
  let isAnimating = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const getFlightConfig = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight || 760;

    const startX = -96;
    const endX = viewportWidth + 96;
    const centerX = viewportWidth * 0.5;
    const centerY = clamp(viewportHeight * 0.38, 180, 340);
    const radius = clamp(viewportWidth * 0.12, 72, 160);

    const legIn = Math.max(40, centerX - startX);
    const loopDistance = 2 * Math.PI * radius;
    const legOut = Math.max(40, endX - centerX);
    const totalDistance = legIn + loopDistance + legOut;

    // Keep speed based on viewport so mobile does not feel slow.
    const speedPxPerSec = clamp(viewportWidth * 0.62, 340, 620);
    const totalDuration = totalDistance / speedPxPerSec;

    return {
      startX,
      endX,
      centerX,
      centerY,
      radius,
      legIn,
      loopDistance,
      legOut,
      totalDistance,
      totalDuration,
      smokeIntervalMs: clamp(140 - speedPxPerSec * 0.12, 55, 110)
    };
  };

  btn.addEventListener("click", () => {
    if (isAnimating) {
      return;
    }

    isAnimating = true;
    btn.style.display = "none";
    plane.style.display = "flex";

    const config = getFlightConfig();
    const segment1 = config.legIn / config.totalDistance;
    const segment2 = config.loopDistance / config.totalDistance;

    let startTime = null;
    let lastSmokeTime = null;
    let lastX = config.startX;
    let lastY = config.centerY;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
        lastSmokeTime = timestamp;
      }

      const elapsedSec = (timestamp - startTime) / 1000;
      const progress = elapsedSec / config.totalDuration;

      let x;
      let y;

      if (progress < segment1) {
        const localProgress = progress / segment1;
        x = config.startX + (config.centerX - config.startX) * localProgress;
        y = config.centerY;
      } else if (progress < segment1 + segment2) {
        const localProgress = (progress - segment1) / segment2;
        const angle = localProgress * 2 * Math.PI + 1.5 * Math.PI;
        x = config.centerX + config.radius * Math.cos(angle);
        y = (config.centerY - config.radius) - config.radius * Math.sin(angle);
      } else if (progress < 1) {
        const localProgress = (progress - segment1 - segment2) / (1 - segment1 - segment2);
        x = config.centerX + (config.endX - config.centerX) * localProgress;
        y = config.centerY;
      } else {
        plane.style.display = "none";
        btn.style.display = "flex";
        isAnimating = false;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;

      plane.style.transform = `translate(${x}px, ${y}px) rotate(${angleDeg}deg)`;

      if (timestamp - lastSmokeTime > config.smokeIntervalMs) {
        const smoke = document.createElement("div");
        smoke.className = "smoke";
        smoke.style.left = `${x + 22}px`;
        smoke.style.top = `${y + 20}px`;
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1000);
        lastSmokeTime = timestamp;
      }

      lastX = x;
      lastY = y;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
}
