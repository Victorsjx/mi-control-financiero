const $ = id => document.getElementById(id);
const STORAGE_KEY = "mi-control-financiero-v1";
const expenseCategories = ["Alimentación","Transporte","Vivienda","Cuentas y servicios","Salud","Compras","Entretenimiento","Educación","Deudas","Otros"];
const incomeCategories = ["Sueldo","Bonos","Ventas","Devoluciones","Otros ingresos"];
const categoryIcons = {"Alimentación":"🍔","Transporte":"🚌","Vivienda":"🏠","Cuentas y servicios":"💡","Salud":"💊","Compras":"🛍️","Entretenimiento":"🎮","Educación":"📚","Deudas":"💳","Otros":"📦","Sueldo":"💼","Bonos":"✨","Ventas":"🪙","Devoluciones":"↩️","Otros ingresos":"💰"};
const palette = ["#5bd6a2","#a78bfa","#76a9fa","#ffb86b","#ff7887","#5bd6c5","#e6cf6b","#d58cf2","#8fa8bc","#d28f7c"];
let state = loadState();
let currentType = "expense";
let selectedMonth = monthKey(new Date());

function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {transactions:[],budgets:{}}}catch{return {transactions:[],budgets:{}}}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`}
function monthDate(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1)}
function money(n){return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(Math.round(n||0))}
function dateText(s){return new Date(s+"T12:00:00").toLocaleDateString("es-CL",{day:"2-digit",month:"short"})}
function transactionsFor(key,type="all"){return state.transactions.filter(t=>monthKey(new Date(t.date+"T12:00:00"))===key && (type==="all"||t.type===type))}
function totals(key){const a=transactionsFor(key);return {income:a.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0),expense:a.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0)}}
function monthName(key){return monthDate(key).toLocaleDateString("es-CL",{month:"long",year:"numeric"})}
function showToast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
function populateMonths(){const keys=new Set([monthKey(new Date()),...state.transactions.map(t=>monthKey(new Date(t.date+"T12:00:00")))]);let arr=[...keys].sort().reverse();const opts=arr.map(k=>`<option value="${k}">${monthName(k)}</option>`).join("");$("monthSelect").innerHTML=opts;$("historyMonth").innerHTML=`<option value="all">Todos los meses</option>`+opts;$("monthSelect").value=selectedMonth}
function render(){
  populateMonths();const key=selectedMonth;const t=totals(key);const budget=Number(state.budgets[key]||0);const net=t.income-t.expense;
  $("monthLabel").textContent=monthName(key);$("balance").textContent=money(net);$("incomeTotal").textContent=money(t.income);$("expenseTotal").textContent=money(t.expense);
  const ratio=t.income>0?t.expense/t.income*100:0;$("spendProgress").style.width=Math.min(ratio,100)+"%";$("spentPercent").textContent=Math.round(ratio)+"% de ingresos gastados";$("budgetCaption").textContent=budget?`Presupuesto: ${money(budget)}`:"Sin presupuesto definido";
  const now=new Date(),daysInMonth=new Date(monthDate(key).getFullYear(),monthDate(key).getMonth()+1,0).getDate();const elapsed=key===monthKey(now)?Math.max(1,now.getDate()):daysInMonth;const projection=t.expense/elapsed*daysInMonth;
  $("projection").textContent=money(projection);$("projectionHint").textContent=key===monthKey(now)?"Estimación al cierre del mes": "Gasto total del mes";$("saving").textContent=money(net);$("savingHint").textContent=net>=0?"Saldo positivo":"Has gastado más de lo ingresado";
  $("budgetCaption").style.color=budget&&t.expense>budget?"#ff8792":"";
  renderDonut(key,t.expense);renderRecent(key);renderComparison(key);
}
function renderDonut(key,total){
  const sums={};transactionsFor(key,"expense").forEach(x=>sums[x.category]=(sums[x.category]||0)+x.amount);
  const entries=Object.entries(sums).sort((a,b)=>b[1]-a[1]);let cursor=0;const segments=entries.map(([cat,val],i)=>{const start=cursor;cursor+=total?val/total*100:0;return `${palette[i%palette.length]} ${start}% ${cursor}%`});
  $("donut").style.background=segments.length?`conic-gradient(${segments.join(",")})`:"conic-gradient(#354254 0 100%)";$("donutTotal").textContent=money(total);
  $("categoryLegend").innerHTML=entries.length?entries.slice(0,6).map(([cat,val],i)=>`<div class="legend-row"><span class="legend-dot" style="background:${palette[i%palette.length]}"></span><span>${cat}</span><strong>${money(val)}</strong></div>`).join(""):`<div class="empty-state">Tus categorías aparecerán aquí.</div>`;
}
function txHTML(x){return `<div class="transaction"><div class="tx-icon">${categoryIcons[x.category]||"📌"}</div><div class="tx-main"><div class="tx-title">${escapeHTML(x.description||x.category)}</div><div class="tx-sub">${x.category} · ${dateText(x.date)}</div></div><div class="tx-amount ${x.type==="income"?"positive":"negative"}">${x.type==="income"?"+":"−"}${money(x.amount)}</div></div>`}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderRecent(key){const a=transactionsFor(key).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,5);$("recentList").innerHTML=a.length?a.map(txHTML).join(""):`<div class="empty-state">Todavía no tienes movimientos. Añade tu primer gasto.</div>`}
function renderComparison(key){
  const d=monthDate(key);const prev=monthKey(new Date(d.getFullYear(),d.getMonth()-1,1));const cur=totals(key),old=totals(prev);const max=Math.max(cur.expense,old.expense,1);const diff=cur.expense-old.expense;const msg=diff===0?"Mismo nivel de gastos":diff<0?`Gastaste ${money(Math.abs(diff))} menos que el mes anterior`:`Gastaste ${money(diff)} más que el mes anterior`;
  $("comparison").innerHTML=`<div class="compare-row"><span>${d.toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill" style="width:${cur.expense/max*100}%"></div></div><strong>${money(cur.expense)}</strong></div><div class="compare-row"><span>${monthDate(prev).toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill" style="width:${old.expense/max*100}%;opacity:.55"></div></div><strong>${money(old.expense)}</strong></div><div class="budget-status">${msg}</div>`;
}
function openTransaction(type){currentType=type;$("transactionType").value=type;$("formTitle").textContent=type==="expense"?"Añadir gasto":"Añadir ingreso";$("formEyebrow").textContent=type==="expense"?"REGISTRO DE GASTO":"REGISTRO DE INGRESO";$("category").innerHTML=(type==="expense"?expenseCategories:incomeCategories).map(c=>`<option>${c}</option>`).join("");$("amount").value="";$("description").value="";$("date").value=new Date().toISOString().slice(0,10);$("transactionDialog").showModal();setTimeout(()=>$("amount").focus(),100)}
$("addExpense").onclick=()=>openTransaction("expense");$("addIncome").onclick=()=>openTransaction("income");$("closeDialog").onclick=()=>$("transactionDialog").close();
$("transactionForm").onsubmit=e=>{e.preventDefault();const amount=Number($("amount").value);if(!Number.isFinite(amount)||amount<=0)return;state.transactions.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),type:currentType,amount,category:$("category").value,description:$("description").value.trim(),date:$("date").value});saveState();selectedMonth=monthKey(new Date($("date").value+"T12:00:00"));$("transactionDialog").close();render();showToast("Movimiento guardado")};
$("monthSelect").onchange=e=>{selectedMonth=e.target.value;render()};$("showAll").onclick=()=>openHistory();
function openHistory(){$("historyMonth").value=selectedMonth;$("historyType").value="all";renderHistory();$("historyDialog").showModal()}
function renderHistory(){const key=$("historyMonth").value;const type=$("historyType").value;let a=state.transactions.filter(x=>(key==="all"||monthKey(new Date(x.date+"T12:00:00"))===key)&&(type==="all"||x.type===type)).sort((x,y)=>y.date.localeCompare(x.date));$("fullHistory").innerHTML=a.length?a.map(x=>txHTML(x)+`<div style="text-align:right;margin-top:-5px;padding-bottom:8px"><button class="text-btn delete-tx" data-id="${x.id}" style="color:#ff8792">Eliminar</button></div>`).join(""):`<div class="empty-state">No hay movimientos para este filtro.</div>`;document.querySelectorAll(".delete-tx").forEach(b=>b.onclick=()=>{if(confirm("¿Eliminar este movimiento?")){state.transactions=state.transactions.filter(x=>x.id!==b.dataset.id);saveState();render();renderHistory()}})}
$("historyMonth").onchange=renderHistory;$("historyType").onchange=renderHistory;$("closeHistory").onclick=()=>$("historyDialog").close();
$("closeBudget").onclick=()=>$("budgetDialog").close();$("saveBudget").onclick=()=>{const n=Number($("budgetAmount").value);if(n<0)return;state.budgets[selectedMonth]=n;saveState();$("budgetDialog").close();render();showToast("Presupuesto actualizado")};
$("closeSettings").onclick=()=>$("settingsDialog").close();$("settingsBtn").onclick=()=>$("settingsDialog").showModal();
$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="mi-control-financiero-backup.json";a.click();URL.revokeObjectURL(a.href);showToast("Copia de seguridad exportada")};
$("importData").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(!Array.isArray(data.transactions)||typeof data.budgets!=="object")throw Error();state=data;saveState();render();showToast("Copia importada correctamente")}catch{alert("El archivo no es una copia válida de Mi Control Financiero")}e.target.value=""};
$("clearData").onclick=()=>{if(confirm("Esto eliminará todos tus movimientos y presupuestos guardados en este navegador. ¿Continuar?")){state={transactions:[],budgets:{}};saveState();render();$("settingsDialog").close();showToast("Datos eliminados")}};
$("closeBudget").onclick=()=>$("budgetDialog").close();
$("budgetDialog").addEventListener("close",()=>{});
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.tab==="history")openHistory();if(b.dataset.tab==="budget"){$("budgetAmount").value=state.budgets[selectedMonth]||"";$("budgetStatus").textContent=`Gasto registrado este mes: ${money(totals(selectedMonth).expense)}`;$("budgetDialog").showModal()}if(b.dataset.tab==="home")window.scrollTo({top:0,behavior:"smooth"})});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
