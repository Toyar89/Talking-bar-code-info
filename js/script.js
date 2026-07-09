// Talking Statue Template Behaviour

(function(){
  const screens={rotate:document.getElementById('rotate'),start:document.getElementById('start'),incoming:document.getElementById('incoming'),incall:document.getElementById('incall'),credits:document.getElementById('credits')};
  const ringtone=document.getElementById('ringtone');
  const speech=document.getElementById('speech');
  const timerEl=document.getElementById('callTimer');
  let current='start', timer=null, callStart=0;
  function isPhone(){return window.innerWidth<768;}
  function isPortrait(){return window.innerHeight>=window.innerWidth;}
  function show(name){Object.values(screens).forEach(s=>s.classList.remove('active')); screens[name].classList.add('active'); current=name;}
  function decide(){ if(!isPhone()) return; if(!isPortrait()) show('rotate'); else if(current==='rotate') show('start'); else show(current||'start'); }
  function stopAudio(){ ringtone.pause(); ringtone.currentTime=0; speech.pause(); speech.currentTime=0; }
  function startTimer(){ callStart=Date.now(); clearInterval(timer); timer=setInterval(()=>{let t=Math.floor((Date.now()-callStart)/1000); timerEl.textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');},250);}
  function stopTimer(){clearInterval(timer); timer=null;}
  function credits(){stopAudio(); stopTimer(); show('credits');}
  function playSafe(audio){ const p=audio.play(); if(p&&p.catch) p.catch(()=>{}); }
  function bind(id,fn){ const el=document.getElementById(id); el.addEventListener('click',fn); el.addEventListener('touchend',e=>{e.preventDefault();fn();},{passive:false}); }
  bind('startBtn',()=>{ show('incoming'); ringtone.currentTime=0; playSafe(ringtone); if(navigator.vibrate) navigator.vibrate([250,120,250]); });
  bind('acceptBtn',()=>{ ringtone.pause(); ringtone.currentTime=0; show('incall'); timerEl.textContent='00:00'; startTimer(); speech.currentTime=0; playSafe(speech); });
  bind('declineBtn',credits);
  bind('hangBtn',credits);
  bind('replayBtn',()=>{ show('incall'); timerEl.textContent='00:00'; startTimer(); speech.currentTime=0; playSafe(speech); });
  speech.addEventListener('ended',credits);
  function setTime(){ const t=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); document.querySelectorAll('.phone-time').forEach(e=>e.textContent=t); }
  window.addEventListener('resize',decide); window.addEventListener('orientationchange',()=>setTimeout(decide,300));
  setTime(); setInterval(setTime,1000); decide(); if(isPhone()&&isPortrait()) show('start');
})();
