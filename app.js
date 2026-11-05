const $ = id => document.getElementById(id);

const ICON_PATHS={
 "house":'<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/>',
 "chart-no-axes-combined":'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
 "plus":'<path d="M12 5v14"/><path d="M5 12h14"/>',
 "wallet":'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M16 14h.01"/>',
 "receipt-text":'<path d="M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2-4-2Z"/><path d="M8 9h8M8 13h6"/>',
 "settings":'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/>',
 "circle-minus":'<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
 "circle-plus":'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
 "chart-line":'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
 "arrow-left-right":'<path d="M17 3 21 7l-4 4"/><path d="M3 7h18"/><path d="m7 21-4-4 4-4"/><path d="M21 17H3"/>',
 "calendar-days":'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
 "piggy-bank":'<path d="M19 5c-2-2-5-2-8-1-3 1-5 3-6 6l-2 1v4l3 1 2 3h8l2-3 2-1V9l-2-1Z"/><path d="M14 8h.01M3 12H1M17 4l1-2"/>',
 "clock":'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 "arrow-left":'<path d="m12 19-7-7 7-7M5 12h14"/>',
 "x":'<path d="m18 6-12 12M6 6l12 12"/>',
 "bus-front":'<path d="M5 17h14V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12ZM5 10h14M8 21v-4M16 21v-4"/><path d="M8 13h.01M16 13h.01"/>',
 "utensils":'<path d="m3 2 7 7M4 3l-2 2 7 7M14 2l-3 10 3 3 3-3-3-10ZM14 15l7 7"/>',
 "ticket":'<path d="M2 9a3 3 0 0 0 0 6v5h20v-5a3 3 0 0 1 0-6V4H2v5Z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
 "shapes":'<path d="M8 3H3v5h5V3ZM21 3h-8v8h8V3ZM3 13h8v8H3v-8ZM17 15v6M14 18h6"/>',
 "gift":'<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M2 8h20V5H2v3ZM12 5c-4 0-5-4-2-4 2 0 2 2 2 4ZM12 5c4 0 5-4 2-4-2 0-2 2-2 4Z"/>',
 "store":'<path d="M3 10v10h18V10M2 10l2-7h16l2 7"/><path d="M2 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/>',
 "undo-2":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-2"/>',
 "circle-dollar-sign":'<circle cx="12" cy="12" r="9"/><path d="M16 8H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H8M12 5v14"/>'
};
function iconSVG(name){const paths=ICON_PATHS[name]||ICON_PATHS.shapes;return '<svg class="ui-icon" data-icon="'+name+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+paths+'</svg>'}


function animateNumber(el,value,duration=560){
 if(!el)return;
 const raw=String(value),target=Number(raw.replace(/[^0-9.-]/g,""));
 if(!Number.isFinite(target)||window.matchMedia("(prefers-reduced-motion: reduce)").matches){el.textContent=raw;return}
 const startValue=Number(el.dataset.numericValue||0),start=performance.now();
 el.dataset.numericValue=String(target);
 const format=n=>{if(raw.includes("%"))return Math.round(n)+"%";if(raw.startsWith("$")||raw.includes("$"))return money(Math.round(n));return Math.round(n).toLocaleString("es-CL")};
 function frame(now){const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3);el.textContent=format(startValue+(target-startValue)*e);if(p<1)requestAnimationFrame(frame);else el.textContent=raw}
 requestAnimationFrame(frame);
}
function setAnimatedNumber(id,value){animateNumber($(id),value)}

const STORAGE_KEY = "mi-control-financiero-v1";
const expenseCategories = ["Transporte","Comida","Salidas","Otros"];
const expenseCategoryOptions = [{name:"Transporte",icon:"bus-front"},{name:"Comida",icon:"utensils"},{name:"Salidas",icon:"ticket"},{name:"Otros",icon:"shapes"}];
const incomeCategories = ["Bonos","Ventas","Devoluciones","Otros ingresos"];
const incomeCategoryOptions = [{name:"Bonos",icon:"gift"},{name:"Ventas",icon:"store"},{name:"Devoluciones",icon:"undo-2"},{name:"Otros ingresos",icon:"circle-dollar-sign"}];
const categoryIcons = {"Comida":"utensils","Alimentación":"utensils","Transporte":"bus-front","Salidas":"ticket","Entretenimiento":"ticket","Otros":"shapes","Sueldo":"wallet","Bonos":"gift","Ventas":"store","Devoluciones":"undo-2","Otros ingresos":"circle-dollar-sign"};
const palette = ["#7667e8","#45b9c2","#6f9ce8","#f1ad48","#e97891","#65c99a","#a48be8","#f18c62","#72b9d9","#d28fc4","#8fc77d","#e0c46a"];
let state = loadState();
let selectedMonth = monthKey(new Date());
let toastTimer;
let monthTransactionIndex=null;
let historyPage=0;
const HISTORY_PAGE_SIZE=100;

function emptyState(){return {transactions:[],budgets:{},categoryBudgets:{},goals:[]}}
function loadState(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(!data||!Array.isArray(data.transactions))return emptyState();
    return {transactions:data.transactions.filter(validTransaction).map(normalizeTransaction),budgets:data.budgets&&typeof data.budgets==="object"?data.budgets:{},categoryBudgets:data.categoryBudgets&&typeof data.categoryBudgets==="object"?data.categoryBudgets:{},goals:Array.isArray(data.goals)?data.goals.filter(g=>g&&typeof g.name==="string"&&Number(g.target)>0).map(g=>({id:String(g.id||makeId()),name:g.name.slice(0,50),target:Number(g.target),saved:Math.max(0,Number(g.saved)||0)})):[]};
  }catch{return emptyState()}
}
function validTransaction(t){return t&&typeof t==="object"&&(t.type==="income"||t.type==="expense")&&Number.isFinite(Number(t.amount))&&Number(t.amount)>0&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)&&typeof t.category==="string"}
function normalizeExpenseCategory(category){if(category==="Transporte")return "Transporte";if(["Alimentación","Comida"].includes(category))return "Comida";if(["Entretenimiento","Salidas","Regalos"].includes(category))return "Salidas";return "Otros"}
function normalizeTransaction(t){return {id:String(t.id||makeId()),type:t.type,amount:Math.round(Number(t.amount)),category:t.type==="expense"?normalizeExpenseCategory(t.category):t.category,description:String(t.description||"").slice(0,70),date:t.date}}
function makeId(){return crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));monthTransactionIndex=null}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`}
function monthDate(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1)}
function money(n){return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(Math.round(n||0))}
function dateText(s){return new Date(s+"T12:00:00").toLocaleDateString("es-CL",{day:"2-digit",month:"short"})}
function monthName(key){return monthDate(key).toLocaleDateString("es-CL",{month:"long",year:"numeric"})}
function transactionsFor(key,type="all"){if(!monthTransactionIndex){monthTransactionIndex=new Map();for(const tx of state.transactions){const k=tx.date.slice(0,7);if(!monthTransactionIndex.has(k))monthTransactionIndex.set(k,[]);monthTransactionIndex.get(k).push(tx)}}const rows=monthTransactionIndex.get(key)||[];return type==="all"?rows:rows.filter(t=>t.type===type)}
function totals(key){const a=transactionsFor(key);const extra=a.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0);const starting=Number(state.budgets[key]||0);return {income:starting+extra,extraIncome:extra,starting,expense:a.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0)}}
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
  setAnimatedNumber("balance",money(net));$("balance").classList.toggle("negative-balance",net<0);
  setAnimatedNumber("incomeTotal",money(t.income));setAnimatedNumber("expenseTotal",money(t.expense));
  const ratio=budget>0?t.expense/budget*100:0;
  $("spendProgress").style.width=Math.min(ratio,100)+"%";
  $("spendProgress").classList.toggle("over-budget",budget>0&&t.expense>budget);
  $("spentPercent").textContent=budget?Math.round(ratio)+"% del presupuesto usado":(t.income?Math.round(t.expense/t.income*100)+"% de ingresos gastados":"Sin presupuesto definido");
  $("budgetCaption").textContent=budget?money(budget)+" sueldo inicial":"Ingresa tu sueldo inicial";
  $("budgetCaption").classList.toggle("warning-text",budget>0&&t.expense>budget);
  const projectedExpense=isCurrent?t.expense/elapsed*daysInMonth:t.expense;
  setAnimatedNumber("projection",money(projectedExpense));
  $("projectionHint").textContent=isCurrent?("Estimación según "+elapsed+" día"+(elapsed===1?"":"s")+" registrado"+(elapsed===1?"":"s")):"Gasto total registrado del mes";
  setAnimatedNumber("saving",money(net));$("savingHint").textContent=net>=0?"Ingresos menos gastos registrados":"Tus gastos superan tus ingresos";
  setAnimatedNumber("movementCount",String(transactionsFor(key).length));
  setAnimatedNumber("dailyAverage",money(t.expense/elapsed));
  setAnimatedNumber("savingRate",t.income?Math.round(net/t.income*100)+"%":"—");
  $("savingRateHint").textContent=t.income?"Ahorro sobre ingresos":"Registra ingresos para calcularlo";
  const daysLeft=isCurrent?Math.max(1,daysInMonth-now.getDate()+1):1;
  setAnimatedNumber("dailyAvailable",budget?money(Math.max(0,budget-t.expense)/daysLeft):"—");
  $("dailyAvailableHint").textContent=budget?money(Math.max(0,budget-t.expense))+" del dinero inicial restante":"Ingresa tu sueldo inicial";
  renderDonut(key,t.expense);renderRecent(key);renderComparison(key);renderSmartPanel(key,t,budget,net);renderGoals();
}
function localDateInput(d=new Date()){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function renderSmartPanel(key,t,budget,net){
 const prev=monthDate(key);const oldKey=monthKey(new Date(prev.getFullYear(),prev.getMonth()-1,1));const old=totals(oldKey);let msg;
 if(budget&&t.expense>budget)msg="Superaste tu presupuesto por "+money(t.expense-budget)+". Revisa tus próximos gastos.";
 else if(budget&&t.expense>=budget*.9)msg="Atención: utilizaste "+Math.round(t.expense/budget*100)+"% de tu presupuesto mensual.";
 else if(net<0)msg="Tus gastos superan tus ingresos este mes. Revisa tus categorías de mayor consumo.";
 else if(t.income)msg="Tu balance es positivo: "+money(net)+". Mantén el control de tus gastos.";
 else msg="Registra ingresos y gastos para recibir recomendaciones basadas en tus movimientos.";
 if(old.expense>0){const delta=Math.round((t.expense-old.expense)/old.expense*100);msg+=" Tus gastos están "+Math.abs(delta)+"% "+(delta>0?"sobre":"bajo")+" el mes anterior.";}
 $("smartInsights").textContent=msg;
 const saved=state.categoryBudgets[key]||{};
 $("dashboardCategoryBudgets").innerHTML=expenseCategories.map(cat=>{const used=transactionsFor(key,"expense").filter(x=>normalizeExpenseCategory(x.category)===cat).reduce((s,x)=>s+x.amount,0);const cap=Number(saved[cat]||0);if(!cap)return "";const p=used/cap*100;return '<div class="dashboard-budget-row"><div class="dashboard-budget-top"><strong>'+cat+'</strong><span>'+money(used)+' / '+money(cap)+'</span></div><div class="category-budget-track"><span class="'+(p>=100?"over":"")+'" style="width:'+Math.min(100,p)+'%"></span></div><small>'+(p>=100?"Límite superado":Math.round(p)+"% utilizado")+'</small></div>';}).join("")||'<div class="empty-state">Configura límites por categoría en Sueldo para ver su avance aquí.</div>';
}
function renderAnalytics(){
 const d=monthDate(selectedMonth);const keys=Array.from({length:6},(_,i)=>monthKey(new Date(d.getFullYear(),d.getMonth()-5+i,1)));
 const rows=keys.map(k=>({key:k,label:monthDate(k).toLocaleDateString("es-CL",{month:"short"}),...totals(k)}));
 const inc=rows.reduce((s,x)=>s+x.income,0),exp=rows.reduce((s,x)=>s+x.expense,0);setAnimatedNumber("sixIncome",money(inc));setAnimatedNumber("sixExpense",money(exp));setAnimatedNumber("sixBalance",money(inc-exp));$("sixSavingRate").textContent=inc?Math.round((inc-exp)/inc*100)+"%":"—";
 const max=Math.max(1,...rows.flatMap(x=>[x.income,x.expense]));
 $("trendChart").innerHTML=rows.some(x=>x.income||x.expense)?'<div class="bar-chart">'+rows.map(x=>'<div class="bar-month"><span>'+x.label+'</span><div class="bar-pair"><i class="bar-income" style="height:'+Math.max(2,x.income/max*100)+'%"></i><i class="bar-expense" style="height:'+Math.max(2,x.expense/max*100)+'%"></i></div><small>'+money(x.income)+' / '+money(x.expense)+'</small></div>').join("")+'</div><div class="chart-key"><span>Ingresos</span><span>Gastos</span></div>':'<div class="empty-state">Registra movimientos para ver tus últimos seis meses.</div>';
 const maxNet=Math.max(1,...rows.map(x=>Math.abs(x.income-x.expense)));$("balanceChart").innerHTML=rows.map(x=>'<div class="ranking-row"><div class="ranking-label"><span>'+monthName(x.key)+'</span><strong>'+money(x.income-x.expense)+'</strong></div><div class="category-budget-track"><span style="width:'+Math.abs(x.income-x.expense)/maxNet*100+'%"></span></div></div>').join("");
 function ranking(type){const map={};state.transactions.filter(x=>x.type===type&&keys.includes(x.date.slice(0,7))).forEach(x=>map[x.category]=(map[x.category]||0)+x.amount);if(type==="income")keys.forEach(k=>{const base=Number(state.budgets[k]||0);if(base)map["Sueldo inicial"]=(map["Sueldo inicial"]||0)+base});return Object.entries(map).sort((x,y)=>y[1]-x[1]);}
 function rankingHTML(list){const total=list.reduce((s,x)=>s+x[1],0);return total?list.map((x,i)=>'<div class="ranking-row"><div class="ranking-label"><span>'+escapeHTML(x[0])+'</span><strong>'+money(x[1])+'</strong></div><div class="category-budget-track"><span style="width:'+x[1]/total*100+'%"></span></div><small>'+Math.round(x[1]/total*100)+'% del total</small></div>').join(""):'<div class="empty-state">Aún no hay movimientos suficientes.</div>'}
 const ex=ranking("expense"),ins=ranking("income");$("expenseRanking").innerHTML=rankingHTML(ex);$("incomeRanking").innerHTML=rankingHTML(ins);
 const cur=totals(selectedMonth),pd=monthDate(selectedMonth),pk=monthKey(new Date(pd.getFullYear(),pd.getMonth()-1,1)),old=totals(pk),notes=[];
 if(old.expense&&cur.expense){const v=Math.round((cur.expense-old.expense)/old.expense*100);notes.push("Tus gastos "+(v>0?"aumentaron":v<0?"disminuyeron":"se mantuvieron")+" "+Math.abs(v)+"% respecto al mes anterior.");}
 if(ex.length&&cur.expense)notes.push(ex[0][0]+" es tu categoría con mayor gasto: "+money(ex[0][1])+" ("+Math.round(ex[0][1]/cur.expense*100)+"%).");
 if(cur.income||cur.expense)notes.push("Tu balance del mes es "+money(cur.income-cur.expense)+".");
 const high=rows.filter(x=>x.expense>0).sort((x,y)=>y.expense-x.expense)[0];if(high)notes.push("El mayor gasto de los seis meses fue en "+monthName(high.key)+": "+money(high.expense)+".");
 $("analyticsInsights").innerHTML=notes.length?notes.map(x=>'<div class="insight-line">'+escapeHTML(x)+'</div>').join(""):'<div class="empty-state">Necesitamos más movimientos para generar conclusiones fiables.</div>';
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
  return `<div class="transaction"><div class="tx-icon">${iconSVG(categoryIcons[x.category]||"shapes")}</div><div class="tx-main"><div class="tx-title">${escapeHTML(x.description||x.category)}</div><div class="tx-sub">${escapeHTML(x.category)} · ${dateText(x.date)} · ${x.type==="income"?"Ingreso":"Gasto"}</div></div><div class="tx-side"><div class="tx-amount ${x.type==="income"?"positive":"negative"}">${sign}${money(x.amount)}</div></div></div>`;
}
function renderRecent(key){const a=[...transactionsFor(key)].sort((x,y)=>y.date.localeCompare(x.date)).slice(0,5);$("recentList").innerHTML=a.length?a.map(x=>txHTML(x)).join(""):'<div class="empty-state">Todavía no tienes movimientos. Añade tu primer gasto.</div>'}
function renderComparison(key){
  const d=monthDate(key),prev=monthKey(new Date(d.getFullYear(),d.getMonth()-1,1)),cur=totals(key),old=totals(prev);
  const max=Math.max(cur.expense,old.expense,1),diff=cur.expense-old.expense;
  const msg=diff===0?"Mismo nivel de gastos":diff<0?`Gastaste ${money(Math.abs(diff))} menos que el mes anterior`:`Gastaste ${money(diff)} más que el mes anterior`;
  $("comparison").innerHTML=`<div class="compare-row"><span>${d.toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill" style="width:${cur.expense/max*100}%"></div></div><strong>${money(cur.expense)}</strong></div><div class="compare-row"><span>${monthDate(prev).toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill old-fill" style="width:${old.expense/max*100}%"></div></div><strong>${money(old.expense)}</strong></div><div class="budget-status">${msg}</div>`;
}
function renderCategoryPicker(type,selected){const picker=$(type==="expense"?"expenseCategoryPicker":"incomeCategoryPicker");const options=type==="expense"?expenseCategoryOptions:[...incomeCategoryOptions];if(type==="income"&&selected==="Sueldo")options.unshift({name:"Sueldo",icon:"＋"});picker.innerHTML=options.map(option=>`<button type="button" class="category-option${option.name===selected?" selected":""}" data-category="${option.name}" aria-pressed="${option.name===selected}"><span class="category-option-icon">${iconSVG(option.icon)}</span><span>${option.name}</span></button>`).join("");picker.querySelectorAll(".category-option").forEach(button=>button.onclick=()=>{$("category").value=button.dataset.category;picker.querySelectorAll(".category-option").forEach(item=>{const active=item===button;item.classList.toggle("selected",active);item.setAttribute("aria-pressed",String(active))})})}
function openTransaction(type,tx=null){
  $("transactionType").value=type;$("transactionId").value=tx?.id||"";
  $("formTitle").textContent=tx?"Editar movimiento":type==="expense"?"Añadir gasto":"Añadir ingreso";
  $("formEyebrow").textContent=tx?"EDITAR REGISTRO":type==="expense"?"REGISTRO DE GASTO":"REGISTRO DE INGRESO";
  const cats=type==="expense"?expenseCategories:[...incomeCategories];
  if(type==="income"&&tx?.category==="Sueldo")cats.unshift("Sueldo");
  $("category").innerHTML=cats.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  const initialCategory=tx?(type==="expense"?normalizeExpenseCategory(tx.category):tx.category):cats[0];
  $("category").value=initialCategory;
  $("expenseCategoryPicker").style.display=type==="expense"?"grid":"none";
  $("incomeCategoryPicker").style.display=type==="income"?"grid":"none";
  $("category").style.display="none";
  $("categoryLabel").textContent=type==="expense"?"¿En qué gastaste?":"Categoría";
  renderCategoryPicker(type,initialCategory);
  $("amount").value=tx?.amount||"";$("description").value=tx?.description||"";
  $("date").value=tx?.date||localDateInput();
  $("saveTransaction").textContent=tx?"Guardar cambios":"Guardar movimiento";
  $("transactionDialog").showModal();setTimeout(()=>$("amount").focus(),100);
}
$("addExpense").onclick=()=>openTransaction("expense");$("addIncome").onclick=()=>openTransaction("income");$("closeDialog").onclick=()=>$("transactionDialog").close();
$("transactionForm").onsubmit=e=>{
  e.preventDefault();const amount=Number($("amount").value),date=$("date").value,id=$("transactionId").value;
  if(!Number.isSafeInteger(amount)||amount<=0||!date){showToast("Revisa el monto y la fecha");return}
  const item={id:id||makeId(),type:$("transactionType").value,amount,category:$("category").value,description:$("description").value.trim(),date};
  if(id){const i=state.transactions.findIndex(x=>x.id===id);if(i>=0)state.transactions[i]=item;else state.transactions.push(item)}else state.transactions.push(item);
  saveState();selectedMonth=date.slice(0,7);$("transactionDialog").close();render();if(id)showToast("Movimiento actualizado");else{const current=totals(selectedMonth),limit=Number(state.budgets[selectedMonth]||0);if(item.type==="expense"&&limit>0&&current.expense>limit)announce("alerta");else if(item.type==="income")announce("ingreso");else if(current.income>current.expense&&current.income>0)announce("ahorro");else announce("gasto");}
};

const RECEIPT_WORKER_URL="https://mi-finanzas-receipts.vic-meneses.workers.dev/";
const TURNSTILE_SITE_KEY="0x4AAAAAAF1DRzfcipL_wV4R";
let receiptWidgetId=null,receiptTurnstileToken="",receiptImageUrl="";
function updateReceiptReady(){const file=$("receiptFile").files?.[0];$("scanReceipt").disabled=!(file&&receiptTurnstileToken&&!$("receiptUploadStage").hidden)}
function renderReceiptWidget(){
 if(!window.turnstile){$("receiptStatus").textContent="No se pudo cargar la verificación. Comprueba tu conexión.";return}
 if(receiptWidgetId!==null){try{window.turnstile.remove(receiptWidgetId)}catch{}receiptWidgetId=null}
 receiptTurnstileToken="";$("scanReceipt").disabled=true;
 receiptWidgetId=window.turnstile.render("#receiptTurnstile",{sitekey:TURNSTILE_SITE_KEY,action:"receipt_scan",theme:"dark",callback:token=>{receiptTurnstileToken=token;updateReceiptReady()},"expired-callback":()=>{receiptTurnstileToken="";updateReceiptReady()},"error-callback":()=>{receiptTurnstileToken="";$("receiptStatus").textContent="No se pudo verificar. Inténtalo nuevamente.";updateReceiptReady()}});
}
function openReceiptDialog(){
 $("receiptUploadStage").hidden=false;$("receiptReviewForm").hidden=true;$("receiptFile").value="";
 $("receiptStatus").textContent="Selecciona una foto y completa la verificación de seguridad.";
 $("receiptPreview").hidden=true;$("receiptPreview").innerHTML="";
 if(receiptImageUrl){URL.revokeObjectURL(receiptImageUrl);receiptImageUrl=""}
 $("receiptDialog").showModal();
 if(window.turnstile)renderReceiptWidget();else window.addEventListener("load",renderReceiptWidget,{once:true});
}
function closeReceiptDialog(){
 $("receiptDialog").close();if(receiptImageUrl){URL.revokeObjectURL(receiptImageUrl);receiptImageUrl=""}
 if(receiptWidgetId!==null&&window.turnstile){try{window.turnstile.remove(receiptWidgetId)}catch{}receiptWidgetId=null}
 receiptTurnstileToken="";
}
$("openReceipt").onclick=openReceiptDialog;$("closeReceipt").onclick=closeReceiptDialog;
$("receiptDialog").addEventListener("click",e=>{if(e.target===$("receiptDialog"))closeReceiptDialog()});
$("receiptFile").addEventListener("change",()=>{
 const file=$("receiptFile").files?.[0];$("receiptPreview").hidden=true;
 if(receiptImageUrl){URL.revokeObjectURL(receiptImageUrl);receiptImageUrl=""}
 if(!file){updateReceiptReady();return}
 if(!["image/jpeg","image/png"].includes(file.type)||file.size>8*1024*1024){$("receiptFile").value="";$("receiptStatus").textContent="Usa una imagen JPG o PNG de máximo 8 MB.";updateReceiptReady();return}
 receiptImageUrl=URL.createObjectURL(file);
 $("receiptPreview").innerHTML='<img alt="Vista previa de la boleta" src="'+receiptImageUrl+'"><span>'+escapeHTML(file.name)+'</span>';
 $("receiptPreview").hidden=false;$("receiptStatus").textContent="Foto lista. Completa la verificación para analizarla.";updateReceiptReady();
});
$("scanReceipt").onclick=async()=>{
 const file=$("receiptFile").files?.[0];if(!file||!receiptTurnstileToken){$("receiptStatus").textContent="Selecciona la boleta y completa la verificación.";return}
 const button=$("scanReceipt");button.disabled=true;button.textContent="Analizando boleta…";$("receiptStatus").textContent="Enviando la imagen para lectura segura.";
 try{
  const form=new FormData();form.append("file",file,file.name);form.append("cf-turnstile-response",receiptTurnstileToken);
  const response=await fetch(RECEIPT_WORKER_URL,{method:"POST",body:form});const data=await response.json();
  if(!response.ok)throw new Error(data.error||"No se pudo analizar la boleta.");
  const validTotal=typeof data.total==="number"&&Number.isFinite(data.total)&&data.total>0;
  $("receiptMerchant").value=data.merchant||"Compra / ticket";$("receiptTotal").value=validTotal?Math.round(data.total):"";
  const detectedDate=/^\d{4}-\d{2}-\d{2}$/.test(data.date||"")?data.date:"";$("receiptDate").value=detectedDate;$("receiptCategory").value="Otros";
  const confidence=typeof data.confidence==="number"?Math.round(data.confidence*100):null;
  $("receiptConfidence").textContent=(!validTotal?"No pudimos reconocer el monto automáticamente. Escríbelo manualmente mirando tu comprobante.":data.validatedTotal?"Total validado por Tabscanner.":confidence!==null?"Confianza de lectura del total: "+confidence+"%. Revisa el monto.":"Revisa cuidadosamente el monto detectado.")+(!detectedDate?" Tampoco se detectó una fecha válida: ingrésala manualmente.":"")+(data.duplicate?" La imagen ya se había procesado anteriormente.":"");
  $("receiptUploadStage").hidden=true;$("receiptReviewForm").hidden=false;
  if(!validTotal){$("receiptTotal").focus();$("receiptStatus").textContent="Lectura parcial: completa el monto y la fecha antes de guardar."}}catch(error){
  $("receiptStatus").textContent=error.message||"Ocurrió un error al leer la boleta.";receiptTurnstileToken="";
  if(window.turnstile&&receiptWidgetId!==null){try{window.turnstile.reset(receiptWidgetId)}catch{}}
 }finally{button.textContent="Analizar boleta";button.disabled=!(file&&receiptTurnstileToken)}
};
$("receiptReviewForm").onsubmit=e=>{
 e.preventDefault();const amount=Number($("receiptTotal").value),date=$("receiptDate").value,description=$("receiptMerchant").value.trim();
 if(!Number.isSafeInteger(amount)||amount<=0||!date||!description){showToast("Revisa el comercio, monto y fecha");return}
 state.transactions.push({id:makeId(),type:"expense",amount,category:$("receiptCategory").value,description:description.slice(0,70),date});
 saveState();selectedMonth=date.slice(0,7);closeReceiptDialog();render();const current=totals(selectedMonth),limit=Number(state.budgets[selectedMonth]||0);if(limit>0&&current.expense>limit)announce("alerta");else announce("gasto");
};
$("rescanReceipt").onclick=()=>{
 $("receiptReviewForm").hidden=true;$("receiptUploadStage").hidden=false;$("receiptFile").value="";
 $("receiptPreview").hidden=true;$("receiptStatus").textContent="Selecciona otra foto y completa la verificación.";
 if(receiptImageUrl){URL.revokeObjectURL(receiptImageUrl);receiptImageUrl=""}renderReceiptWidget();
};

$("monthSelect").onchange=e=>{selectedMonth=e.target.value;render()};
$("showAll").onclick=()=>openHistory();
function openHistory(){$("historyMonth").value=selectedMonth;$("historyType").value="all";$("historyCategory").value="all";$("historyFrom").value="";$("historyTo").value="";$("historySearch").value="";populateHistoryCategories();renderHistory()}
function filteredHistory(){
  const key=$("historyMonth").value,type=$("historyType").value,category=$("historyCategory").value;
  const from=$("historyFrom").value,to=$("historyTo").value,q=$("historySearch").value.trim().toLocaleLowerCase("es-CL");
  const rows=state.transactions.filter(x=>(key==="all"||x.date.slice(0,7)===key)&&(type==="all"||x.type===type)&&(category==="all"||x.category===category)&&(!from||x.date>=from)&&(!to||x.date<=to)&&(!q||`${x.description} ${x.category}`.toLocaleLowerCase("es-CL").includes(q)));rows.sort((x,y)=>y.date.localeCompare(x.date)||String(y.id).localeCompare(String(x.id)));return rows;
}
function renderHistory(){
  populateHistoryCategories();
  const a=filteredHistory();
  const inc=a.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0),exp=a.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);
  $("historySummary").textContent=`${a.length} movimientos · Ingresos ${money(inc)} · Gastos ${money(exp)} · Balance ${money(inc-exp)}`;
  const pageCount=Math.max(1,Math.ceil(a.length/HISTORY_PAGE_SIZE));historyPage=Math.min(historyPage,pageCount-1);const visible=a.slice(historyPage*HISTORY_PAGE_SIZE,(historyPage+1)*HISTORY_PAGE_SIZE);$("fullHistory").innerHTML=visible.length?visible.map(x=>`${txHTML(x,true)}<div class="history-actions"><button class="mini-action edit-tx" data-id="${escapeHTML(x.id)}">Editar</button><button class="mini-action delete-tx" data-id="${escapeHTML(x.id)}">Eliminar</button></div>`).join(""):'<div class="empty-state">No hay movimientos para este filtro.</div>';if(a.length>HISTORY_PAGE_SIZE){$("fullHistory").insertAdjacentHTML("beforeend",`<div class="history-pagination"><button class="mini-action" id="historyPrev" ${historyPage===0?"disabled":""}>Anterior</button><span>Página ${historyPage+1} de ${pageCount} · ${a.length} registros</span><button class="mini-action" id="historyNext" ${historyPage>=pageCount-1?"disabled":""}>Siguiente</button></div>`);$("historyPrev").onclick=()=>{historyPage--;renderHistory()};$("historyNext").onclick=()=>{historyPage++;renderHistory()}}
  document.querySelectorAll(".edit-tx").forEach(b=>b.onclick=()=>{const tx=state.transactions.find(x=>x.id===b.dataset.id);if(tx){switchTab("home");openTransaction(tx.type,tx)}});
  document.querySelectorAll(".delete-tx").forEach(b=>b.onclick=()=>{if(confirm("¿Eliminar este movimiento?")){state.transactions=state.transactions.filter(x=>x.id!==b.dataset.id);saveState();render();renderHistory();showToast("Movimiento eliminado")}});
}
function populateHistoryCategories(){
  const current=$("historyCategory").value||"all";
  const categories=[...new Set(state.transactions.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,"es-CL"));
  $("historyCategory").innerHTML='<option value="all">Todas las categorías</option>'+categories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  $("historyCategory").value=categories.includes(current)?current:"all";
}
const resetHistoryPage=()=>{historyPage=0;renderHistory()};$("historyMonth").onchange=resetHistoryPage;$("historyType").onchange=resetHistoryPage;$("historyCategory").onchange=resetHistoryPage;$("historyFrom").onchange=resetHistoryPage;$("historyTo").onchange=resetHistoryPage;$("historySearch").oninput=resetHistoryPage;$("closeHistory").onclick=()=>switchTab("home");
$("closeBudget").onclick=()=>switchTab("home");
function openBudget(){
  $("budgetAmount").value=state.budgets[selectedMonth]??"";
  const spent=totals(selectedMonth).expense,limit=Number(state.budgets[selectedMonth]||0);
  $("budgetStatus").textContent=`Gastos registrados: ${money(spent)}${limit? ` · Dinero inicial restante: ${money(limit-spent)}`:""}`;
  const saved=state.categoryBudgets[selectedMonth]||{};
  $("categoryBudgetFields").innerHTML=expenseCategories.map(category=>{
    const used=transactionsFor(selectedMonth,"expense").filter(x=>normalizeExpenseCategory(x.category)===category).reduce((sum,x)=>sum+x.amount,0);
    const cap=Number(saved[category]||0),percent=cap?Math.min(used/cap*100,100):0;
    return `<div class="category-budget-card"><label class="category-budget-row"><span><strong>${category}</strong><small>Gastado: ${money(used)}${cap?` · ${used>cap?"Excedido por "+money(used-cap):"Disponible "+money(cap-used)}`:""}</small></span><input type="number" min="0" step="1000" inputmode="numeric" data-budget-category="${category}" value="${saved[category]??""}" placeholder="Sin límite" aria-label="Presupuesto para ${category}"></label><div class="category-budget-track"><span class="${cap&&used>cap?"over":""}" style="width:${percent}%"></span></div></div>`;
  }).join("");

}
$("saveBudget").onclick=()=>{
  const raw=$("budgetAmount").value,n=Number(raw);
  if(raw!==""&&(!Number.isSafeInteger(n)||n<0)){showToast("Ingresa un presupuesto válido");return}
  const categoryLimits={};
  for(const input of $("categoryBudgetFields").querySelectorAll("[data-budget-category]")){
    const value=input.value.trim(),category=input.dataset.budgetCategory;
    if(value!==""&&(!Number.isSafeInteger(Number(value))||Number(value)<0)){showToast("Revisa los límites por categoría");input.focus();return}
    if(value!=="")categoryLimits[category]=Number(value);
  }
  if(raw==="")delete state.budgets[selectedMonth];else state.budgets[selectedMonth]=n;
  if(Object.keys(categoryLimits).length)state.categoryBudgets[selectedMonth]=categoryLimits;else delete state.categoryBudgets[selectedMonth];
  saveState();render();announce("logro");switchTab("budget");
};
$("closeSettings").onclick=()=>$("settingsDialog").close();$("settingsBtn").onclick=()=>$("settingsDialog").showModal();
$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify({version:3,exportedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"});downloadBlob(blob,"mi-control-financiero-backup.json");showToast("Copia de seguridad creada")};
$("importData").onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{if(f.size>10*1024*1024)throw Error("La copia supera el máximo de 10 MB");const data=JSON.parse(await f.text());if(!data||typeof data!=="object"||Array.isArray(data)||!Array.isArray(data.transactions))throw Error("Estructura de copia no válida");if(data.transactions.length>50000)throw Error("La copia contiene demasiados movimientos");if(!data.transactions.every(validTransaction))throw Error("Hay movimientos con datos inválidos");const validAmounts=o=>o&&typeof o==="object"&&!Array.isArray(o)&&Object.values(o).every(v=>Number.isFinite(Number(v))&&Number(v)>=0);if(data.budgets!==undefined&&!validAmounts(data.budgets))throw Error("Presupuestos inválidos");if(data.categoryBudgets!==undefined&&(!data.categoryBudgets||typeof data.categoryBudgets!=="object"||Array.isArray(data.categoryBudgets)))throw Error("Límites por categoría inválidos");if(data.goals!==undefined&&(!Array.isArray(data.goals)||data.goals.some(g=>!g||typeof g.name!=="string"||!Number.isFinite(Number(g.target))||Number(g.target)<=0||!Number.isFinite(Number(g.saved??0))||Number(g.saved??0)<0)))throw Error("Metas inválidas");const ids=new Set();for(const tx of data.transactions){if(tx.id&&ids.has(String(tx.id)))throw Error("Identificadores de movimientos duplicados");if(tx.id)ids.add(String(tx.id))}if(!confirm(`Se importarán ${data.transactions.length} movimientos y se reemplazarán los datos actuales de este teléfono. ¿Continuar?`))return;state={transactions:data.transactions.map(normalizeTransaction),budgets:data.budgets||{},categoryBudgets:data.categoryBudgets||{},goals:Array.isArray(data.goals)?data.goals.map(g=>({id:String(g.id||makeId()),name:g.name.slice(0,50),target:Number(g.target),saved:Math.max(0,Number(g.saved)||0)})):[]};saveState();render();showToast("Copia restaurada correctamente")}catch(err){alert("No se pudo importar: "+(err.message||"archivo no válido"))}finally{e.target.value=""}
};
$("clearData").onclick=()=>{if(confirm("Esto eliminará todos tus movimientos y presupuestos de este teléfono. ¿Ya exportaste una copia?")){state=emptyState();saveState();render();$("settingsDialog").close();showToast("Datos eliminados")}};
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$("exportCsv").onclick=()=>{
  const rows=filteredHistory().sort((a,b)=>a.date.localeCompare(b.date));
  const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const csv=["Fecha;Tipo;Categoría;Descripción;Monto CLP",...rows.map(x=>[x.date,x.type==="income"?"Ingreso":"Gasto",x.category,x.description,x.amount].map(quote).join(";"))].join("\n");
  downloadBlob(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}),"historial-financiero.csv");
};
let screenTransitionToken=0;
function switchTab(tab){
 const target=tab==="add"?"home":tab;
 const views=[...document.querySelectorAll("[data-view]")];
 const currentViews=views.filter(el=>!el.hidden);
 const nextViews=views.filter(el=>el.dataset.view===target);
 const currentTab=currentViews[0]?.dataset.view;
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab));
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const token=++screenTransitionToken;
 if(!nextViews.length){
  views.forEach(el=>{el.hidden=true;el.classList.remove("screen-enter","screen-exit")});
 }else if(currentTab===target){
  views.forEach(el=>{
   const active=el.dataset.view===target;
   el.hidden=!active;
   el.classList.remove("screen-enter","screen-exit");
  });
 }else if(reduced||!currentViews.length){
  views.forEach(el=>{
   const active=el.dataset.view===target;
   el.hidden=!active;
   el.classList.remove("screen-enter","screen-exit");
  });
 }else{
  const currentGroup=views.filter(el=>!el.hidden);
  views.forEach(el=>{
   const isCurrent=currentGroup.includes(el);
   const isNext=el.dataset.view===target;
   if(!isCurrent&&!isNext){el.hidden=true;el.classList.remove("screen-enter","screen-exit")}
  });
  const nextGroup=nextViews;
  nextGroup.forEach(el=>{
   el.hidden=false;
   el.classList.remove("screen-enter","screen-exit");
   el.classList.add("screen-enter");
  });
  currentGroup.forEach(el=>{
   el.classList.remove("screen-enter","screen-exit");
   el.classList.add("screen-exit");
  });
  window.setTimeout(()=>{
   if(token!==screenTransitionToken)return;
   currentGroup.forEach(el=>{el.hidden=true;el.classList.remove("screen-exit")});
   nextGroup.forEach(el=>el.classList.remove("screen-enter"));
  },520);
 }
 window.scrollTo({top:0,behavior:reduced?"auto":"smooth"});
 if(tab==="add"){openTransaction("expense");return}
 if(tab==="home")render();
 if(tab==="analytics")renderAnalytics();
 if(tab==="history")openHistory();
 if(tab==="budget")openBudget();
}

document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
$("showAll").onclick=()=>switchTab("history");
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
const ASSISTANT_PREF_KEY="mi-control-financiero-assistant-v1";
function assistantPrefs(){try{return {...{personality:"mezcla",humor:"medio"},...JSON.parse(localStorage.getItem(ASSISTANT_PREF_KEY)||"{}")}}catch{return {personality:"mezcla",humor:"medio"}}}
function assistantMessage(kind){
 const p=assistantPrefs(),sets={
 bienvenida:{
 mayordomo:["👑 ¡El lord ha regresado! Su fortuna lo espera.","¡Bienvenido, mi estimado jefe! Sus finanzas están listas.","¡Su majestad, el reino financiero está a sus órdenes!","Las puertas del tesoro están abiertas para usted, majestad.","Su presencia mejora hasta el balance, mi lord.","¡A sus órdenes! El reino de las lucas está listo.","Majestad, hoy podemos escribir otra página de prosperidad.","El mayordomo financiero informa: todo dispuesto, jefe."],
 sarcastico:["💀 Volvió el responsable de esos gastos misteriosos.","¡Mira quién volvió! La billetera pidió refuerzos.","Jefe, espero que hoy vengamos a portarnos bien.","La calculadora preguntó si hoy habrá paz.","¡Bienvenido! Tu saldo y yo tenemos algunas preguntas.","Volvió la persona que cree que el delivery no cuenta como gasto.","La billetera estaba tranquila… hasta que llegaste.","Jefe, prometo no juzgar. Bueno, intentaré."],
 militar:["🎖️ Comandante en posición. Revisemos esas cuentas.","¡Atención, jefe! Operación control financiero iniciada.","¡A formar filas, lucas! El comandante ha llegado.","Reporte de situación listo. Esperamos sus órdenes.","¡Equipo financiero, firmes! Hoy se cumple el presupuesto.","Comandante, comienza una nueva misión de ahorro.","Objetivo del día: disciplina, estrategia y cero gastos sorpresa.","¡Despliegue financiero autorizado!"],
 amigo:["😎 ¡Qué pasa, jefe! ¿Cómo vamos con esas lucas?","¡Wena, patrón! Vamos a ordenar la billetera.","¡Grande, crack! Qué bueno tenerte de vuelta.","¡Hola, máquina! Que hoy rindan esas lucas.","¿Cómo anda ese bolsillo, jefe? Vamos paso a paso.","¡Qué bueno verte, socio! Revisemos cómo va todo.","¡Llegó el patrón! Que no falte el control ni el cafecito.","Wena wena, jefe. Tus finanzas te estaban esperando."],
 mezcla:["👑 ¡El lord ha regresado! Su fortuna lo espera.","💀 ¡Volvió el jefe! Que la billetera no tiemble.","🎖️ ¡Comandante! Las finanzas esperan órdenes.","😎 ¡Wena, patrón! Vamos con todo.","¡Atención! Ha llegado el dueño de estas lucas.","La leyenda vuelve al reino financiero.","¡Jefe en línea! Activando modo ahorro.","¡Bienvenido de vuelta! Que hablen los números."]},
 ingreso:{
 mayordomo:["💰 ¡Ha llegado dinero al reino, majestad!","¡Las arcas reciben refuerzos, mi lord!","El tesoro aumenta. Excelente noticia, majestad.","Un nuevo ingreso fortalece el reino.","¡Prosperidad para sus arcas, mi estimado jefe!","El reino agradece esta nueva entrada de monedas."],
 sarcastico:["¡Milagro! Entró dinero. No lo gastemos en 4 minutos.","Jefe, llegó plata. Intente que se quede un rato.","¡Un ingreso! La billetera vuelve a tener esperanzas.","No se emocione gastándolo todo, patrón.","Entró dinero. Fingiremos que no vimos la lista de deseos.","¡Buenas noticias! Hoy la cuenta recibió cariño."],
 militar:["🎖️ ¡Refuerzos recibidos! Ingreso registrado, comandante.","¡Recursos incorporados! Mantenga la disciplina.","Nuevo suministro financiero confirmado.","¡Excelente! Más recursos para cumplir la misión.","Ingreso recibido. Administre con estrategia, comandante.","¡Las tropas financieras celebran este refuerzo!"],
 amigo:["💸 ¡Buena, jefe! Entraron unas lucas.","¡Esooo! Que ese ingreso rinda harto.","¡Se agrandó la billetera, patrón!","Buena noticia, socio. A cuidar esa platita.","¡Vamos! Un ingreso más para tus planes.","¡Filete, jefe! Que esas lucas trabajen para ti."],
 mezcla:["💰 ¡Las arcas del reino crecen!","🎉 ¡Ingreso desbloqueado, patrón!","¡Bien ahí, jefe! La billetera sonríe.","¡Refuerzos para el imperio!","La cuenta recibió buenas noticias.","¡Más lucas, más posibilidades! Administremos bien."]},
 gasto:{
 mayordomo:["🧐 Gasto registrado, mi lord. Que haya valido la pena.","El tesoro disminuye, majestad. Administremos con sabiduría.","Una salida de monedas ha sido anotada, majestad.","El reino toma nota de este gasto.","Mi lord, cada moneda merece una misión.","Gasto registrado. Que sea una inversión en bienestar."],
 sarcastico:["💀 Otra salida de lucas. ¿Era estrictamente necesario, jefe?","La billetera sintió ese golpe, patrón.","Anotado. Mi calculadora está empezando a preocuparse.","Jefe, esa compra dejó huella en el presupuesto.","No juzgo el gasto. La planilla sí.","La plata salió más rápido que nosotros de la cama.","Un gustito más y la billetera pide vacaciones.","Gasto anotado. El autocontrol sigue en entrenamiento."],
 militar:["🎖️ Gasto registrado. ¡Mantenga el control, comandante!","Recurso utilizado. Vigile el presupuesto, jefe.","Movimiento registrado. No pierda el objetivo de vista.","Comandante, controle el consumo de recursos.","Gasto autorizado en el registro. Seguimos en misión.","¡Atención! Cada recurso cuenta para la operación."],
 amigo:["Ya, jefe, gasto anotado. ¡Con moderación!","Listoco, patrón. Ojo con las lucas que quedan.","Anotado, socio. Que no se nos arranque el presupuesto.","Todo bien, jefe. Pero no nos embalemos.","Un gasto menos por registrar, ¡bien ahí!","Dale, patrón. Revisemos cuánto queda después."],
 mezcla:["💸 Gasto registrado. ¡Que haya valido la pena!","💀 La billetera acaba de suspirar.","🫡 Anotado, comandante. Seguimos.","Las lucas se fueron, pero al menos quedaron registradas.","Jefe, el presupuesto tiene memoria.","Gasto anotado. ¡Que el próximo sea más estratégico!"]},
 ahorro:{
 mayordomo:["👑 ¡Así crece la fortuna del reino, majestad!","La prudencia de hoy construye el patrimonio de mañana.","Cada moneda guardada fortalece el reino.","Majestad, su disciplina merece reconocimiento.","El tesoro crece gracias a su buen criterio.","¡Una decisión sabia para las arcas del reino!"],
 sarcastico:["Mira tú, ¡alguien está cuidando la plata! Estoy orgulloso.","No todo se va en gustitos. Qué emocionante, jefe.","¡Un ahorro! Voy a guardar este momento histórico.","La billetera sonríe. Yo también, un poquito.","Jefe, hoy sí le ganamos al carrito de compras.","¡Mira esas lucas quedándose donde deben!"],
 militar:["🎖️ ¡Disciplina financiera sobresaliente, comandante!","Objetivo de ahorro en marcha. ¡No afloje!","¡Reserva financiera asegurada! Mantenga la formación.","Cada peso ahorrado acerca la misión al éxito.","Comandante, su estrategia está dando resultados.","¡Excelente control de recursos!"],
 amigo:["¡Eso, jefe! Cada peso cuenta.","¡Buena esa! Tu yo del futuro te lo agradecerá.","¡Así se hace, patrón! A guardar de a poquito.","Vamos sumando, socio. ¡Buen trabajo!","¡Qué orgullo, jefe! Esas lucas se están cuidando.","De a poco se llega lejos. ¡Vamos todavía!"],
 mezcla:["📈 ¡Así se construye un imperio, jefe!","🐷 ¡La alcancía está feliz!","👑 ¡El patrimonio del patrón está creciendo!","¡Punto para el equipo ahorro!","¡La disciplina está pagando, comandante!","Hoy ganó el futuro yo del jefe."]},
 alerta:{
 mayordomo:["⚠️ Majestad, ha superado el presupuesto. Conviene revisar el gasto.","Mi lord, las arcas están bajo presión.","El tesoro requiere prudencia inmediata, majestad.","Sugiero pausar gastos no esenciales, mi lord.","Majestad, el presupuesto necesita atención.","Las arcas del reino están en zona delicada."],
 sarcastico:["🚨 Jefe, esa billetera está pidiendo auxilio.","Estamos gastando como millonarios y cobrando como becarios.","Patrón, ¿podemos frenar un poquito?","La calculadora está sudando, jefe.","¿Presupuesto? Parece que lo dejamos en visto.","Jefe, las lucas están arrancando sin despedirse.","La billetera solicitó una reunión urgente.","Momento de cerrar la llave de los gustitos."],
 militar:["🚨 ¡Alerta roja! Presupuesto superado, comandante.","¡Atención! Recursos por encima del límite autorizado.","Comandante, se requiere plan de contención.","¡Alerta de recursos! Reorganice la estrategia.","Prioridad máxima: recuperar el control del presupuesto.","¡Detengan gastos no esenciales!"],
 amigo:["Ojo, jefe, ya te pasaste del presupuesto.","Patrón, cuidemos esas lucas antes de que se acaben.","Socio, toca apretar un poquito el cinturón.","Jefe, revisemos esos gastos antes de seguir.","No es reto, pero hay que ordenar la cosa.","Ojo ahí, crack. El presupuesto está pidiendo ayuda."],
 mezcla:["🚨 ¡Alerta roja! Las lucas están escapando.","💀 Su billetera y yo necesitamos hablar seriamente.","Jefe, estamos en zona de peligro financiero.","¡Pausa táctica! Hay que cuidar el saldo.","Las arcas están temblando, mi lord.","¡Modo ahorro de emergencia activado!"]},
 logro:{
 mayordomo:["🏆 ¡Una meta cumplida, majestad! El reino celebra.","¡Excelente gestión, mi lord! Objetivo alcanzado.","Su constancia honra al reino, majestad.","Una nueva victoria para sus finanzas.","¡El tesoro celebra este logro, mi lord!","La buena administración vuelve a dar frutos."],
 sarcastico:["¡Lo logró! Quién diría que sí podía, jefe. 😂","Una meta cumplida. Hoy no lo voy a retar.","¡Mira qué responsable! Hasta me emocioné.","Jefe, hoy se ganó el derecho a presumir.","¡Logro desbloqueado! No se acostumbre a que lo felicite.","La disciplina apareció. ¡Y vino para quedarse!"],
 militar:["🎖️ ¡Objetivo cumplido, comandante!","¡Misión completada! Disciplina recompensada.","¡Victoria financiera! Informe de éxito confirmado.","Comandante, objetivo alcanzado con honores.","¡Medalla al mérito presupuestario!","La estrategia funcionó. ¡A la siguiente misión!"],
 amigo:["¡Grande, jefe! Meta cumplida.","¡Vamos todavía! Tremendo logro, patrón.","¡Seco, socio! Así se hace.","¡Qué buena, crack! Un paso más adelante.","¡Orgulloso de ti, jefe! Sigue así.","¡Eso merece celebración! Bien jugado, patrón."],
 mezcla:["🏆 ¡Misión cumplida, comandante!","🎮 ¡Nivel financiero aumentado!","👑 ¡Insignia desbloqueada: Guardián de las Lucas!","¡Victoria para el imperio del jefe!","¡Logro desbloqueado! Las lucas bajo control.","¡Hoy se celebra la disciplina financiera!"]}};
 const group=sets[kind]||sets.bienvenida,arr=group[p.personality]||group.mezcla;
 const count=p.humor==="suave"?Math.max(1,Math.ceil(arr.length/2)):arr.length;
 return arr[Math.floor(Math.random()*count)];
}
function announce(kind){showToast(assistantMessage(kind))}
function updateWelcome(){
 const style=$("assistantPersonality")?.value||assistantPrefs().personality;
 const humor=$("assistantHumor")?.value||assistantPrefs().humor;
 const previews={
  mayordomo:"👑 ¡Su majestad, el reino financiero está a sus órdenes!",
  sarcastico:"💀 ¡Mira quién volvió! La billetera pidió refuerzos.",
  militar:"🎖️ ¡Comandante en posición! Revisemos esas cuentas.",
  amigo:"😎 ¡Wena, patrón! Vamos a ordenar la billetera.",
  mezcla:"👑 ¡El lord ha regresado! Su fortuna lo espera."
 };
 const alternate={
  suave:{mayordomo:"Bienvenido, mi estimado jefe. Sus finanzas están listas.",sarcastico:"¡Hola, jefe! Hoy cuidaremos esas lucas.",militar:"¡Atención, jefe! Operación control financiero iniciada.",amigo:"¡Qué bueno verte, jefe! ¿Cómo van esas lucas?",mezcla:"¡Bienvenido, jefe! Vamos con calma y con todo."},
  medio:{mayordomo:"👑 ¡Su majestad, el reino financiero está a sus órdenes!",sarcastico:"💀 ¡Mira quién volvió! La billetera pidió refuerzos.",militar:"🎖️ ¡Comandante en posición! Revisemos esas cuentas.",amigo:"😎 ¡Wena, patrón! Vamos a ordenar la billetera.",mezcla:"👑 ¡El lord ha regresado! Su fortuna lo espera."},
  salvaje:{mayordomo:"¡Mi lord ha vuelto! Que tiemblen los gastos innecesarios.",sarcastico:"💀 ¡Volvió el responsable de esos gastos misteriosos!",militar:"🚨 ¡Comandante! Hoy se obedece al presupuesto.",amigo:"¡Wena, crack! A cuidar esas lucas, que no crecen en los árboles.",mezcla:"💀 ¡El jefe volvió! Que la billetera no tiemble."}
 };
 const message=(alternate[humor]||alternate.medio)[style]||previews[style]||previews.mezcla;
 $("welcomeGreeting").textContent=message;
}
render();
$("assistantPersonality").value=assistantPrefs().personality;
$("assistantHumor").value=assistantPrefs().humor;
updateWelcome();



document.querySelectorAll(".action-btn,.nav-add,.submit-btn,.outline-btn").forEach(button=>{
 button.addEventListener("pointerdown",()=>button.classList.add("is-pressed"));
 ["pointerup","pointercancel","pointerleave"].forEach(event=>button.addEventListener(event,()=>button.classList.remove("is-pressed")));
});
