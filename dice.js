/* Finance Dice — módulo independiente para controles, probabilidad y animación. */
(()=>{
 "use strict";
 const $=id=>document.getElementById(id);
 let initialized=false,rolling=false,rollSequence=0;

 function elements(){
  return {
   screen:$("diceScreen"),input:$("diceChance"),value:$("diceChanceValue"),
   no:$("diceNoChance"),yes:$("diceYesChance"),track:$("diceTrack"),
   button:$("diceRollButton"),cube:$("diceCube"),face:$("diceFace"),
   result:$("diceResult"),detail:$("diceDetail"),caption:$("diceRollCaption")
  };
 }

 function updateChance(){
  const e=elements();
  if(!e.input)return;
  const chance=Math.min(99,Math.max(1,Number(e.input.value)||50));
  const no=100-chance;
  e.input.value=String(chance);
  e.input.style.setProperty("--dice-chance",chance+"%");
  if(e.value)e.value.textContent=chance+"%";
  if(e.no)e.no.textContent=no+"%";
  if(e.yes)e.yes.textContent=chance+"%";
  if(e.track)e.track.style.gridTemplateColumns=no+"fr "+chance+"fr";
 }

 // Uniform secure integer: no modulo bias.
 function randomBelow(max){
  if(!globalThis.crypto||typeof globalThis.crypto.getRandomValues!=="function"){
   throw new Error("No se pudo acceder al generador aleatorio seguro. Abre Mi Finanzas desde su dirección HTTPS.");
  }
  const range=0x100000000;
  const limit=Math.floor(range/max)*max;
  const buffer=new Uint32Array(1);
  let value;
  do{
   globalThis.crypto.getRandomValues(buffer);
   value=buffer[0];
  }while(value>=limit);
  return value%max;
 }

 function showDiceScreen(){
  const e=elements();
  if(!e.screen)return;
  document.querySelectorAll("[data-view]").forEach(view=>{
   view.hidden=view.dataset.view!=="dice";
   view.classList.remove("screen-enter","screen-exit");
  });
  document.querySelectorAll(".nav-item").forEach(item=>{
   item.classList.toggle("active",item.dataset.tab==="dice");
  });
  window.scrollTo({top:0,behavior:"instant"});
  updateChance();
 }

 function animateRoll(cube){
  if(!cube)return null;
  cube.classList.remove("is-rolling");
  cube.style.transform="";
  if(typeof cube.animate==="function"){
   return cube.animate([
    {transform:"perspective(500px) rotateX(-8deg) rotateY(-8deg) rotateZ(-8deg) scale(1)"},
    {transform:"perspective(500px) rotateX(105deg) rotateY(130deg) rotateZ(115deg) scale(.88)"},
    {transform:"perspective(500px) rotateX(220deg) rotateY(245deg) rotateZ(245deg) scale(1.08)"},
    {transform:"perspective(500px) rotateX(365deg) rotateY(355deg) rotateZ(370deg) scale(.94)"},
    {transform:"perspective(500px) rotateX(545deg) rotateY(535deg) rotateZ(550deg) scale(1.05)"},
    {transform:"perspective(500px) rotateX(720deg) rotateY(720deg) rotateZ(712deg) scale(1)"}
   ],{duration:1450,easing:"cubic-bezier(.16,.72,.18,1)",fill:"forwards"});
  }
  cube.classList.add("is-rolling");
  return null;
 }

 function rollDice(){
  const e=elements();
  if(rolling||!e.button||!e.input)return;
  rolling=true;
  const sequence=++rollSequence;
  e.button.disabled=true;
  e.button.setAttribute("aria-busy","true");
  if(e.result){
   e.result.classList.remove("is-buy","is-no");
   e.result.textContent="Lanzando…";
  }
  if(e.detail)e.detail.textContent="El dado está generando un resultado independiente.";
  if(e.caption)e.caption.textContent="DADO EN MOVIMIENTO";
  if(e.face)e.face.textContent="🎲";

  const animation=animateRoll(e.cube);
  let draw,chance;
  try{
   updateChance();
   chance=Number(e.input.value);
   draw=randomBelow(1000000);
  }catch(error){
   if(e.caption)e.caption.textContent="NO SE PUDO LANZAR";
   if(e.result){e.result.textContent="No disponible";e.result.classList.add("is-no");}
   if(e.detail)e.detail.textContent=error.message;
   e.button.disabled=false;e.button.removeAttribute("aria-busy");rolling=false;
   return;
  }

  // The displayed roll is 0.0000–99.9999; outcome uses the full precision.
  const value=draw/10000;
  const buy=draw<chance*10000;
  const finish=()=>{
   if(sequence!==rollSequence)return;
   if(e.face)e.face.textContent=value.toFixed(2).replace(".",",");
   if(e.caption)e.caption.textContent="RESULTADO "+value.toFixed(2).replace(".",",");
   if(e.result){
    e.result.textContent=buy?"¡COMPRAR!":"NO COMPRAR";
    e.result.classList.toggle("is-buy",buy);
    e.result.classList.toggle("is-no",!buy);
   }
   if(e.detail)e.detail.textContent=buy
    ?"El resultado cayó en la zona verde. Revisa tu presupuesto antes de decidir."
    :"El resultado cayó en la zona roja. Mejor guarda esas lucas.";
   if(e.cube)e.cube.style.transform=buy?"rotate(5deg)":"rotate(-5deg)";
   e.button.disabled=false;e.button.removeAttribute("aria-busy");rolling=false;
  };

  if(animation&&animation.finished){
   animation.finished.then(finish).catch(finish);
   // A fallback protects against browsers that never resolve the animation promise.
   window.setTimeout(()=>{if(rolling&&sequence===rollSequence)finish();},1800);
  }else{
   window.setTimeout(finish,1500);
  }
 }

 function init(){
  if(initialized)return;
  const e=elements();
  if(!e.screen||!e.input||!e.button||!e.track||!e.cube)return;
  initialized=true;

  e.input.addEventListener("input",updateChance,{passive:true});
  e.input.addEventListener("change",updateChance,{passive:true});
  e.input.addEventListener("pointerup",updateChance,{passive:true});
  e.button.addEventListener("click",event=>{
   event.preventDefault();
   rollDice();
  });
  e.button.addEventListener("keydown",event=>{
   if(event.key==="Enter"||event.key===" "){event.preventDefault();rollDice();}
  });

  // Capture the Dice tab before the main navigation handler and open its screen directly.
  document.addEventListener("click",event=>{
   const nav=event.target.closest&&event.target.closest('.nav-item[data-tab="dice"]');
   if(!nav)return;
   event.preventDefault();
   event.stopPropagation();
   if(typeof event.stopImmediatePropagation==="function")event.stopImmediatePropagation();
   showDiceScreen();
  },true);

  updateChance();
 }

 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
 else init();
})();
