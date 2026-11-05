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
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function monthKey(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`}
function monthDate(key){const [y,m]=key.split("-").map(Number);return new Date(y,m-1,1)}
function money(n){return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(Math.round(n||0))}
function dateText(s){return new Date(s+"T12:00:00").toLocaleDateString("es-CL",{day:"2-digit",month:"short"})}
function monthName(key){return monthDate(key).toLocaleDateString("es-CL",{month:"long",year:"numeric"})}
function transactionsFor(key,type="all"){return state.transactions.filter(t=>t.date.slice(0,7)===key&&(type==="all"||t.type===type))}
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
  renderDonut(key,t.expense);renderRecent(key);renderComparison(key);renderSmartPanel(key,t,budget,net);renderAnalytics();renderGoals();
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
function renderRecent(key){const a=transactionsFor(key).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,5);$("recentList").innerHTML=a.length?a.map(x=>txHTML(x)).join(""):'<div class="empty-state">Todavía no tienes movimientos. Añade tu primer gasto.</div>'}
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
  saveState();selectedMonth=date.slice(0,7);$("transactionDialog").close();render();showToast(id?"Movimiento actualizado":"Movimiento guardado");
};
$("monthSelect").onchange=e=>{selectedMonth=e.target.value;render()};
$("showAll").onclick=()=>openHistory();
function openHistory(){$("historyMonth").value=selectedMonth;$("historyType").value="all";$("historyCategory").value="all";$("historyFrom").value="";$("historyTo").value="";$("historySearch").value="";populateHistoryCategories();renderHistory()}
function filteredHistory(){
  const key=$("historyMonth").value,type=$("historyType").value,category=$("historyCategory").value;
  const from=$("historyFrom").value,to=$("historyTo").value,q=$("historySearch").value.trim().toLocaleLowerCase("es-CL");
  return state.transactions.filter(x=>(key==="all"||x.date.slice(0,7)===key)&&(type==="all"||x.type===type)&&(category==="all"||x.category===category)&&(!from||x.date>=from)&&(!to||x.date<=to)&&(!q||`${x.description} ${x.category}`.toLocaleLowerCase("es-CL").includes(q))).sort((x,y)=>y.date.localeCompare(x.date));
}
function renderHistory(){
  populateHistoryCategories();
  const a=filteredHistory();
  const inc=a.filter(x=>x.type==="income").reduce((s,x)=>s+x.amount,0),exp=a.filter(x=>x.type==="expense").reduce((s,x)=>s+x.amount,0);
  $("historySummary").textContent=`${a.length} movimientos · Ingresos ${money(inc)} · Gastos ${money(exp)} · Balance ${money(inc-exp)}`;
  $("fullHistory").innerHTML=a.length?a.map(x=>`${txHTML(x,true)}<div class="history-actions"><button class="mini-action edit-tx" data-id="${escapeHTML(x.id)}">Editar</button><button class="mini-action delete-tx" data-id="${escapeHTML(x.id)}">Eliminar</button></div>`).join(""):'<div class="empty-state">No hay movimientos para este filtro.</div>';
  document.querySelectorAll(".edit-tx").forEach(b=>b.onclick=()=>{const tx=state.transactions.find(x=>x.id===b.dataset.id);if(tx){switchTab("home");openTransaction(tx.type,tx)}});
  document.querySelectorAll(".delete-tx").forEach(b=>b.onclick=()=>{if(confirm("¿Eliminar este movimiento?")){state.transactions=state.transactions.filter(x=>x.id!==b.dataset.id);saveState();render();renderHistory();showToast("Movimiento eliminado")}});
}
function populateHistoryCategories(){
  const current=$("historyCategory").value||"all";
  const categories=[...new Set(state.transactions.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,"es-CL"));
  $("historyCategory").innerHTML='<option value="all">Todas las categorías</option>'+categories.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  $("historyCategory").value=categories.includes(current)?current:"all";
}
$("historyMonth").onchange=renderHistory;$("historyType").onchange=renderHistory;$("historyCategory").onchange=renderHistory;$("historyFrom").onchange=renderHistory;$("historyTo").onchange=renderHistory;$("historySearch").oninput=renderHistory;$("closeHistory").onclick=()=>switchTab("home");
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
  saveState();render();showToast("Sueldo y límites actualizados");switchTab("budget");
};
$("closeSettings").onclick=()=>$("settingsDialog").close();$("settingsBtn").onclick=()=>$("settingsDialog").showModal();
$("exportData").onclick=()=>{const blob=new Blob([JSON.stringify({version:3,exportedAt:new Date().toISOString(),...state},null,2)],{type:"application/json"});downloadBlob(blob,"mi-control-financiero-backup.json");showToast("Copia de seguridad creada")};
$("importData").onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{const data=JSON.parse(await f.text());if(!Array.isArray(data.transactions)||!data.budgets||typeof data.budgets!=="object"||!data.transactions.every(validTransaction))throw Error("Formato no válido");if(!confirm(`Se importarán ${data.transactions.length} movimientos y se reemplazarán los datos actuales de este teléfono. ¿Continuar?`))return;state={transactions:data.transactions.map(normalizeTransaction),budgets:data.budgets,categoryBudgets:data.categoryBudgets&&typeof data.categoryBudgets==="object"?data.categoryBudgets:{},goals:Array.isArray(data.goals)?data.goals:[]};saveState();render();showToast("Copia restaurada correctamente")}catch(err){alert("No se pudo importar: "+(err.message||"archivo no válido"))}finally{e.target.value=""}
};
$("clearData").onclick=()=>{if(confirm("Esto eliminará todos tus movimientos y presupuestos de este teléfono. ¿Ya exportaste una copia?")){state=emptyState();saveState();render();$("settingsDialog").close();showToast("Datos eliminados")}};
function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$("exportCsv").onclick=()=>{
  const rows=filteredHistory().sort((a,b)=>a.date.localeCompare(b.date));
  const quote=v=>'"'+String(v??"").replace(/"/g,'""')+'"';
  const csv=["Fecha;Tipo;Categoría;Descripción;Monto CLP",...rows.map(x=>[x.date,x.type==="income"?"Ingreso":"Gasto",x.category,x.description,x.amount].map(quote).join(";"))].join("\n");
  downloadBlob(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}),"historial-financiero.csv");
};
function switchTab(tab){
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab));
 document.querySelectorAll("[data-view]").forEach(el=>{
  const active=el.dataset.view===tab;
  if(active){el.hidden=false;el.classList.remove("screen-enter");void el.offsetWidth;el.classList.add("screen-enter")}
  else{el.hidden=true;el.classList.remove("screen-enter")}
 });
 window.scrollTo({top:0,behavior:"smooth"});
 if(tab==="add"){openTransaction("expense");return}
 if(tab==="home")render();
 if(tab==="analytics")renderAnalytics();
 if(tab==="history")openHistory();
 if(tab==="budget")openBudget();
}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
$("showAll").onclick=()=>switchTab("history");
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();


document.querySelectorAll(".action-btn,.nav-add,.submit-btn,.outline-btn").forEach(button=>{
 button.addEventListener("pointerdown",()=>button.classList.add("is-pressed"));
 ["pointerup","pointercancel","pointerleave"].forEach(event=>button.addEventListener(event,()=>button.classList.remove("is-pressed")));
});
