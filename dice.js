/* Lucky Flip — moneda independiente, probabilidad configurable y sin tocar datos financieros. */
(()=>{
 "use strict";
 const $=id=>document.getElementById(id);
 let initialized=false,rolling=false,sequence=0;
 const els=()=>({screen:$("diceScreen"),input:$("diceChance"),value:$("diceChanceValue"),no:$("diceNoChance"),yes:$("diceYesChance"),track:$("diceTrack"),button:$("diceRollButton"),coin:$("diceCube"),face:$("diceFace"),result:$("diceResult"),detail:$("diceDetail"),caption:$("diceRollCaption")});
 function updateChance(){
  const e=els();if(!e.input)return;
  const chance=Math.min(99,Math.max(1,Number(e.input.value)||50)),no=100-chance;
  e.input.value=String(chance);e.input.style.setProperty("--dice-chance",chance+"%");
  if(e.value)e.value.textContent=chance+"%";
  if(e.no)e.no.textContent=no+"%";if(e.yes)e.yes.textContent=chance+"%";
  if(e.track)e.track.style.gridTemplateColumns=no+"fr "+chance+"fr";
 }
 function randomBelow(max){
  if(!globalThis.crypto||typeof globalThis.crypto.getRandomValues!=="function")throw new Error("No está disponible el generador aleatorio seguro. Abre Mi Finanzas desde HTTPS.");
  const range=0x100000000,limit=Math.floor(range/max)*max,buffer=new Uint32Array(1);let value;
  do{globalThis.crypto.getRandomValues(buffer);value=buffer[0];}while(value>=limit);
  return value%max;
 }
 function showScreen(){
  const e=els();if(!e.screen)return;
  document.querySelectorAll("[data-view]").forEach(v=>{v.hidden=v.dataset.view!=="dice";v.classList.remove("screen-enter","screen-exit");});
  document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.tab==="dice"));
  if(window.scrollTo)window.scrollTo({top:0,behavior:"instant"});updateChance();
 }
 function roll(){
  const e=els();if(rolling||!e.button||!e.input||!e.coin)return;
  rolling=true;const id=++sequence;e.button.disabled=true;e.button.setAttribute("aria-busy","true");
  e.result.classList.remove("is-buy","is-no");e.result.textContent="Lanzando…";
  e.detail.textContent="La moneda está girando.";e.caption.textContent="MONEDA EN MOVIMIENTO";
  e.coin.classList.remove("is-rolling","is-buy","is-no");e.coin.style.transform="";
  let chance,draw;
  try{updateChance();chance=Number(e.input.value);draw=randomBelow(1000000);}
  catch(err){e.caption.textContent="NO SE PUDO LANZAR";e.result.textContent="No disponible";e.detail.textContent=err.message;e.button.disabled=false;e.button.removeAttribute("aria-busy");rolling=false;return;}
  const buy=draw<chance*10000,finish=()=>{
   if(id!==sequence)return;
   e.coin.classList.remove("is-rolling");e.coin.classList.add(buy?"is-buy":"is-no");
   e.coin.setAttribute("aria-label",buy?"Resultado: comprar":"Resultado: no comprar");
   e.result.textContent=buy?"¡COMPRAR!":"NO COMPRAR";e.result.classList.toggle("is-buy",buy);e.result.classList.toggle("is-no",!buy);
   e.detail.textContent=buy?"Salió cara. Si cabe en tu presupuesto, puedes darte el gusto.":"Salió sello. Mejor guarda esas lucas.";
   e.caption.textContent=buy?"CARA · RESULTADO":"SELLO · RESULTADO";
   e.button.disabled=false;e.button.removeAttribute("aria-busy");rolling=false;
  };
  e.coin.classList.add("is-rolling");
  let done=false;const complete=()=>{if(done)return;done=true;finish();};
  e.coin.addEventListener("animationend",complete,{once:true});
  window.setTimeout(complete,1250);
 }
 function init(){
  if(initialized)return;const e=els();if(!e.screen||!e.input||!e.button||!e.track||!e.coin)return;initialized=true;
  e.input.addEventListener("input",updateChance);e.input.addEventListener("change",updateChance);
  e.button.addEventListener("click",event=>{event.preventDefault();roll();});
  document.addEventListener("click",event=>{
   const nav=event.target.closest&&event.target.closest('.nav-item[data-tab="dice"]');if(!nav)return;
   event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();showScreen();
  },true);
  updateChance();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();