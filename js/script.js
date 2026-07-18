(() => {
  const screens = Object.fromEntries(
    ["rotate", "start", "incoming", "incall", "credits"].map(id => [id, document.getElementById(id)])
  );
  const ringtone = document.getElementById("ringtone");
  const video = document.getElementById("answeredVideo");
  const timerEl = document.getElementById("callTimer");
  let current = "start";
  let timerId = null;
  let callStartedAt = 0;

  const isPhoneWidth = () => window.innerWidth < 768;
  const isPortrait = () => window.innerHeight >= window.innerWidth;

  function show(name) {
    Object.values(screens).forEach(screen => screen.classList.remove("active"));
    screens[name].classList.add("active");
    current = name;
  }

  function updateLayout() {
    if (!isPhoneWidth()) return;
    if (!isPortrait()) show("rotate");
    else if (current === "rotate") show("start");
    else show(current || "start");
  }

  function safePlay(media) {
    const promise = media.play();
    if (promise) promise.catch(error => console.warn("Playback was blocked:", error));
  }

  function stopRingtone() {
    ringtone.pause();
    ringtone.currentTime = 0;
  }

  function stopVideo() {
    video.pause();
    video.currentTime = 0;
  }

  function startTimer() {
    callStartedAt = Date.now();
    clearInterval(timerId);
    timerId = setInterval(() => {
      const seconds = Math.floor((Date.now() - callStartedAt) / 1000);
      const minutesPart = String(Math.floor(seconds / 60)).padStart(2, "0");
      const secondsPart = String(seconds % 60).padStart(2, "0");
      timerEl.textContent = `${minutesPart}:${secondsPart}`;
    }, 250);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function showCredits() {
    stopRingtone();
    stopVideo();
    stopTimer();
    show("credits");
  }

  function beginIncomingCall() {
    show("incoming");
    ringtone.currentTime = 0;
    safePlay(ringtone);
    if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 250]);
  }

  function answerCall() {
    stopRingtone();
    show("incall");
    timerEl.textContent = "00:00";
    video.currentTime = 0;
    startTimer();
    safePlay(video);
  }

  document.getElementById("startBtn").addEventListener("click", beginIncomingCall);
  document.getElementById("acceptBtn").addEventListener("click", answerCall);
  document.getElementById("declineBtn").addEventListener("click", showCredits);
  document.getElementById("hangBtn").addEventListener("click", showCredits);
  document.getElementById("replayBtn").addEventListener("click", answerCall);
  video.addEventListener("ended", showCredits);

  function updatePhoneTime() {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.querySelectorAll(".phone-time").forEach(element => { element.textContent = time; });
  }

  window.addEventListener("resize", updateLayout);
  window.addEventListener("orientationchange", () => setTimeout(updateLayout, 250));
  updatePhoneTime();
  setInterval(updatePhoneTime, 1000);
  updateLayout();
  if (isPhoneWidth() && isPortrait()) show("start");
})();
