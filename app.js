const $ = id => document.getElementById(id);
const STORAGE_KEY = "mi-control-financiero-v1";
const expenseCategories = ["Alimentación","Transporte","Vivienda","Cuentas y servicios","Salud","Compras","Entretenimiento","Educación","Deudas","Mascotas","Regalos","Otros"];
const incomeCategories = ["Sueldo","Bonos","Ventas","Devoluciones","Otros ingresos"];
const categoryIcons = {"Alimentación":"🍔","Transporte":"🚌","Vivienda":"🏠","Cuentas y servicios":"💡","Salud":"💊","Compras":"🛍️","Entretenimiento":"🎮","Educación":"📚","Deudas":"💳","Mascotas":"🐾","Regalos":"🎁","Otros":"📦","Sueldo":"💼","Bonos":"✨","Ventas":"🪙","Devoluciones":"↩️","Otros ingresos":"💰"};
const palette = ["#5bd6a2","#a78bfa","#76a9fa","#ffb86b","#ff7887","#5bd6c5","#e6cf6b","#d58cf2","#8fa8bc","#d28f7c","#75c8e8","#b6d66c"];
let state = loadState();
let selectedMonth = monthKey(new Date());
let toastTimer;

function emptyState(){return {transactions:[],budgets:{}}}
function loadState(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!data||!Array.isArray(data.transactions))return emptyState();
    return {transactions:data.transactions.filter(validTransaction).map(normalizeTransaction),budgets:data.budgets&&typeof data.budgets==="object"?data.budgets:{}};
  }catch{return emptyState()}
}
function validTransaction(t){return t&&typeof t==="object"&&(t.type==="income"||t.type==="expense")&&Number.isFinite(Number(t.amount))&&Number(t.amount)>0&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&typeof t.category==="string"}
function normalizeTransaction(t){return {id:String(t.id||makeId()),type:t.type,amount:Math.round(Number(t.amount)),category:t.category,description:String(t.description||"").slice(0,70),date:t.date}}
function makeId(){return crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`}
function monthDate(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1)}
function money(n){return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(Math.round(n||0))}
function dateText(s){return new Date(s+"T12:00:00").toLocaleDateString("es-CL",{day:"2-digit",month:"short"})}
function monthName(key){return monthDate(key).toLocaleDateString("es-CL",{month:"long",year:"numeric"})}
function transactionsFor(key,type="all"){return state.transactions.filter(t=>t.date.slice(0,7)===key&&(type==="all"||t.type===type))}
function totals(key){const a=transactionsFor(key);return {income:a.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0),expense:a.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0)}}
function showToast(msg){$("toast").textContent=msg;$("toast").classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2400)}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function populateMonths(){
  const keys=new Set([monthKey(new Date()),...state.transactions.map(t=>t.date.slice(0,7))]);
  [...keys].sort().reverse();
  const arr=[...keys].sort().reverse();
  const opts=arr.map(k=>`<option value="${k}">${escapeHTML(monthName(k))}</option>`).join("");
  $("monthSelect").innerHTML=opts;
  $("historyMonth").innerHTML='<option value="all">Todos los meses</option>'+opts;
  if(!keys.has(selectedMonth))selectedMonth=monthKey(new Date());
  $("monthSelect").value=selectedMonth;
}
function render(){
  populateMonths();
  const key=selectedMonth,t=totals(key),budget=Number(state.budgets[key]||0),net=t.income-t.expense;
  const isCurrent=key===monthKey(new Date()),now=new Date(),daysInMonth=new Date(monthDate(key).getFullYear(),monthDate(key).getMonth()+1,0).getDate();
  const elapsed=isCurrent?Math.max(1,now.getDate()):daysInMonth;
  $("monthLabel").textContent=monthName(key);
  $("balance").textContent=money(net);$("balance").classList.toggle("negative-balance",net<0);
  $("incomeTotal").textContent=money(t.income);$("expenseTotal").textContent=money(t.expense);
  const ratio=budget>0?t.expense/budget*100:0;
  $("spendProgress").style.width=Math.min(ratio,100)+"%";
  $("spendProgress").classList.toggle("over-budget",budget>0&&t.expense>budget);
  $("spentPercent").textContent=budget?Math.round(ratio)+"% del presupuesto usado":(t.income?Math.round(t.expense/t.income*100)+"% de ingresos gastados":"Sin presupuesto definido");
  $("budgetCaption").textContent=budget?money(budget)+" presupuesto":"Configura tu límite";
  $("budgetCaption").classList.toggle("warning-text",budget>0&&t.expense>budget);
  const projection=isCurrent?t.expense/elapsed*daysInMonth:t.expense;
  $("projection").textContent=money(projection);
  $("projectionHint").textContent=isCurrent?"Estimación al cierre del mes":"Total registrado del mes";
  $("saving").textContent=money(net);$("savingHint").textContent=net>=0?"Ingresos menos gastos":"Has gastado más de lo ingresado";
  $("movementCount").textContent=transactionsFor(key).length;
  $("dailyAverage").textContent=money(t.expense/elapsed);
  renderDonut(key,t.expense);renderRecent(key);renderComparison(key);
}
function renderDonut(key,total){
  const sums={};transactionsFor(key,"expense").forEach(x=>sums[x.category]=(sums[x.category]||0)+x.amount);
  const entries=Object.entries(sums).sort((a,b)=>b[1]-a[1]);let cursor=0;
  const segments=entries.map(([cat,val],i)=>{const start=cursor;cursor+=total?val/total*100:0;return `${palette[i%palette.length]} ${start}% ${cursor}%`});
  $("donut").style.background=segments.length?`conic-gradient(${segments.join(",")})`:"conic-gradient(#354254 0 100%)";
  $("donutTotal").textContent=money(total);
  $("categoryLegend").innerHTML=entries.length?entries.slice(0,7).map(([cat,val],i)=>`<div class="legend-row"><span class="legend-dot" style="background:${palette[i%palette.length]}"></span><span>${escapeHTML(cat)}</span><strong>${money(val)}</strong></div>`).join(""):'<div class="empty-state">Tus categorías aparecerán aquí.</div>';
}
function txHTML(x,editable=false){
  const sign=x.type==="income"?"+":"−";
  return `<div class="transaction"><div class="tx-icon">${categoryIcons[x.category]||"📌"}</div><div class="tx-main"><div class="tx-title">${escapeHTML(x.description||x.category)}</div><div class="tx-sub">${escapeHTML(x.category)} · ${dateText(x.date)} · ${x.type==="income"?"Ingreso":"Gasto"}</div></div><div class="tx-side"><div class="tx-amount ${x.type==="income"?"positive":"negative"}">${sign}${money(x.amount)}</div></div></div>`;
}
function renderRecent(key){const a=transactionsFor(key).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,5);$("recentList").innerHTML=a.length?a.map(x=>txHTML(x)).join(""):'<div class="empty-state">Todavía no tienes movimientos. Añade tu primer gasto.</div>'}
function renderComparison(key){
  const d=monthDate(key),prev=monthKey(new Date(d.getFullYear(),d.getMonth()-1,1)),cur=totals(key),old=totals(prev);
  const max=Math.max(cur.expense,old.expense,1),diff=cur.expense-old.expense;
  const msg=diff===0?"Mismo nivel de gastos":diff<0?`Gastaste ${money(Math.abs(diff))} menos que el mes anterior`:`Gastaste ${money(diff)} más que el mes anterior`;
  $("comparison").innerHTML=`<div class="compare-row"><span>${d.toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill" style="width:${cur.expense/max*100}%"></div></div><strong>${money(cur.expense)}</strong></div><div class="compare-row"><span>${monthDate(prev).toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill old-fill" style="width:${old.expense/max*100}%"></div></div><strong>${money(old.expense)}</strong></div><div class="budget-status">${msg}</div>`;
}
function openTransaction(type,tx=null){
  $("transactionType").value=type;$("transactionId").value=tx?.id||"";
  $("formTitle").textContent=tx?"Editar movimiento":type==="expense"?"Añadir gasto":"Añadir ingreso";
  $("formEyebrow").textContent=tx?"EDITAR REGISTRO":type==="expense"?"REGISTRO DE GASTO":"REGISTRO DE INGRESO";
  const cats=type==="expense"?expenseCategories:incomeCategories;
  $("category").innerHTML=cats.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  $("category").value=tx?.category||cats[0];$("amount").value=tx?.amount||"";$("description").value=tx?.description||"";
  $("date").value=tx?.date||new Date().toISOString().slice(0,10);
  $("saveTransaction").textContent=tx?"Guardar cambios":"Guardar movimiento";
  $("transactionDialog").showModal();setTimeout(()=>$("amount").focus(),100);
}
$("addExpense").onclick=()=>openTransaction("expense");$("addIncome").onclick=()=>openTransaction("income");$("closeDialog").onclick=()=>$("transactionDialog").close();
$("transactionForm").onsubmit=e=>{
  e.preventDefault();const amount=Number($("amount").value),date=$("date").value,id=$("transactionId").value;
  if(!Number.isSafeInteger(amount)||amount<=0||!date){showToast("Revisa el monto y la fecha");return}
  const item={id:id||makeId(),type:$("transactionType").value,amount,category:$("category").value,description:$("description").value.trim(),date};
  if(id){const i=state.transactions.findIndex(x=>x.id===id);if(i>=0)state.transactions[i]=item;else state.transactions.push(item)}else state.transactions.push(item);
  saveState();selectedMonth=date.slice(0,7);$("transactionDialog").close();render();showToast(id?"Movimiento actualizado":"Movimiento guardado");
};
$("monthSelect").onchange=e=>{selectedMonth=e.target.value;render()};
$("showAll").onclick=()=>openHistory();
function openHistory(){$("historyMonth").value=selectedMonth;$("historyType").value="all";$("historySearch").value="";renderHistory();$("historyDialog").showModal()}
function renderHistory(){
  const key=$("historyMonth").value,type=$("historyType").value,q=$("historySearch").value.trim().toLocaleLowerCase("es-CL");
  const a=state.transactions.filter(x=>(key==="all"||x.date.slice(0,7)===key)&&(type==="all"||x.type===type)&&(!q||`${x.description} ${x.category}`.toLocaleLowerCase("es-CL").includes(q))).sort((x,y)=>y.date.localeCompare(x.date));
  const inc=a.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0),exp=a.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);
  $("historySummary").textContent=`${a.length} movimientos · Ingresos ${money(inc)} · Gastos ${money(exp)} · Balance ${money(inc-exp)}`;
  $("fullHistory").innerHTML=a.length?a.map(x=>`${txHTML(x,true)}<div class="history-actions"><button class="mini-action edit-tx" data-id="${escapeHTML(x.id)}">Editar</button><button class="mini-action delete-tx" data-id="${escapeHTML(x.id)}">Eliminar</button></div>`).join(""):'<div class="empty-state">No hay movimientos para este filtro.</div>';
  document.querySelectorAll(".edit-tx").forEach(b=>b.onclick=()=>{const tx=state.transactions.find(x=>x.id===b.dataset.id);if(tx){$("historyDialog").close();openTransaction(tx.type,tx)}});
  document.querySelectorAll(".delete-tx").forEach(b=>b.onclick=()=>{if(confirm("¿Eliminar este movimiento?")){state.transactions=state.transactions.filter(x=>x.id!==b.dataset.id);saveState();render();renderHistory();showToast("Movimiento eliminado")}});
}
$("historyMonth").onchange=renderHistory;$("historyType").onchange=renderHistory;$("historySearch").oninput=renderHistory;$("closeHistory").onclick=()=>$("historyDialog").close();
$("closeBudget").onclick=()=>$("budgetDialog").close();
function openBudget(){$("budgetAmount").value=state.budgets[selectedMonth]??"";const spent=totals(selectedMonth).expense;const limit=Number(state.budgets[selectedMonth]||0);$("budgetStatus").textContent=`Gasto registrado: ${money(spent)}${limit? ` · Disponible: ${money(limit-spent)}`:""}`;$("budgetDialog").showModal()}
$("saveBudget").onclick=()=>{const raw=$("budgetAmount").value,n=Number(raw);if(raw!==""&&(!Number.isSafeInteger(n)||n<0)){showToast("Ingresa un presupuesto válido");return}if(raw==="")delete state.budgets[selectedMonth];else state.budgets[selectedMonth]=n;saveState();$("budgetDialog").close();render();showToast("Presupuesto actualizado")};
$("closeSettings").onclick=()=>$("settingsDialog").close();$("settingsBtn").onclick=()=>$("settingsDialog").showModal();
$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"});downloadBlob(blob,"mi-control-financiero-backup.json");showToast("Copia de seguridad creada")};
$("importData").onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{const data=JSON.parse(await f.text());if(!Array.isArray(data.transactions)||!data.budgets||typeof data.budgets!=="object"||!data.transactions.every(validTransaction))throw Error("Formato no válido");if(!confirm(`Se importarán ${data.transactions.length} movimientos y se reemplazarán los datos actuales de este teléfono. ¿Continuar?`))return;state={transactions:data.transactions.map(normalizeTransaction),budgets:data.budgets};saveState();render();showToast("Copia restaurada correctamente")}catch(err){alert("No se pudo importar: "+(err.message||"archivo no válido"))}finally{e.target.value=""}
};
$("clearData").onclick=()=>{if(confirm("Esto eliminará todos tus movimientos y presupuestos de este teléfono. ¿Ya exportaste una copia?")){state=emptyState();saveState();render();$("settingsDialog").close();showToast("Datos eliminados")}};
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$("exportCsv").onclick=()=>{
  const key=$("historyMonth").value,type=$("historyType").value;
  const rows=state.transactions.filter(x=>(key==="all"||x.date.slice(0,7)===key)&&(type==="all"||x.type===type)).sort((a,b)=>a.date.localeCompare(b.date));
  const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const csv=["Fecha;Tipo;Categoría;Descripción;Monto CLP",...rows.map(x=>[x.date,x.type==="income"?"Ingreso":"Gasto",x.category,x.description,x.amount].map(quote).join(";"))].join("\n");
  downloadBlob(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}),"historial-financiero.csv");
};
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x===b));
  if(b.dataset.tab==="history")openHistory();
  if(b.dataset.tab==="budget")openBudget();
  if(b.dataset.tab==="home")window.scrollTo({top:0,behavior:"smooth"});
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
