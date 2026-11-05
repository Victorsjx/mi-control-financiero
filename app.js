const $ = id => document.getElementById(id);
const STORAGE_KEY = "mi-control-financiero-v1";
const expenseCategories = ["Transporte","Comida","Salidas","Otros"];
const expenseCategoryOptions = [{name:"Transporte",icon:"↗"},{name:"Comida",icon:"◉"},{name:"Salidas",icon:"✦"},{name:"Otros",icon:"···"}];
const incomeCategories = ["Bonos","Ventas","Devoluciones","Otros ingresos"];
const incomeCategoryOptions = [{name:"Bonos",icon:"✧"},{name:"Ventas",icon:"↗"},{name:"Devoluciones",icon:"↩"},{name:"Otros ingresos",icon:"···"}];
const categoryIcons = {"Comida":"◉","Alimentación":"◉","Transporte":"↗","Salidas":"✦","Entretenimiento":"✦","Otros":"···","Sueldo":"＋","Bonos":"✧","Ventas":"↗","Devoluciones":"↩","Otros ingresos":"＋"};
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
  $("balance").textContent=money(net);$("balance").classList.toggle("negative-balance",net<0);
  $("incomeTotal").textContent=money(t.income);$("expenseTotal").textContent=money(t.expense);
  const ratio=budget>0?t.expense/budget*100:0;
  $("spendProgress").style.width=Math.min(ratio,100)+"%";
  $("spendProgress").classList.toggle("over-budget",budget>0&&t.expense>budget);
  $("spentPercent").textContent=budget?Math.round(ratio)+"% del presupuesto usado":(t.income?Math.round(t.expense/t.income*100)+"% de ingresos gastados":"Sin presupuesto definido");
  $("budgetCaption").textContent=budget?money(budget)+" sueldo inicial":"Ingresa tu sueldo inicial";
  $("budgetCaption").classList.toggle("warning-text",budget>0&&t.expense>budget);
  const projectedExpense=isCurrent?t.expense/elapsed*daysInMonth:t.expense;
  $("projection").textContent=money(projectedExpense);
  $("projectionHint").textContent=isCurrent?("Estimación según "+elapsed+" día"+(elapsed===1?"":"s")+" registrado"+(elapsed===1?"":"s")):"Gasto total registrado del mes";
  $("saving").textContent=money(net);$("savingHint").textContent=net>=0?"Ingresos menos gastos registrados":"Tus gastos superan tus ingresos";
  $("movementCount").textContent=transactionsFor(key).length;
  $("dailyAverage").textContent=money(t.expense/elapsed);
  $("savingRate").textContent=t.income?Math.round(net/t.income*100)+"%":"—";
  $("savingRateHint").textContent=t.income?"Ahorro sobre ingresos":"Registra ingresos para calcularlo";
  const daysLeft=isCurrent?Math.max(1,daysInMonth-now.getDate()+1):1;
  $("dailyAvailable").textContent=budget?money(Math.max(0,budget-t.expense)/daysLeft):"—";
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
 const inc=rows.reduce((s,x)=>s+x.income,0),exp=rows.reduce((s,x)=>s+x.expense,0);$("sixIncome").textContent=money(inc);$("sixExpense").textContent=money(exp);$("sixBalance").textContent=money(inc-exp);$("sixSavingRate").textContent=inc?Math.round((inc-exp)/inc*100)+"%":"—";
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
  return `<div class="transaction"><div class="tx-icon">${categoryIcons[x.category]||"•"}</div><div class="tx-main"><div class="tx-title">${escapeHTML(x.description||x.category)}</div><div class="tx-sub">${escapeHTML(x.category)} · ${dateText(x.date)} · ${x.type==="income"?"Ingreso":"Gasto"}</div></div><div class="tx-side"><div class="tx-amount ${x.type==="income"?"positive":"negative"}">${sign}${money(x.amount)}</div></div></div>`;
}
function renderRecent(key){const a=transactionsFor(key).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,5);$("recentList").innerHTML=a.length?a.map(x=>txHTML(x)).join(""):'<div class="empty-state">Todavía no tienes movimientos. Añade tu primer gasto.</div>'}
function renderComparison(key){
  const d=monthDate(key),prev=monthKey(new Date(d.getFullYear(),d.getMonth()-1,1)),cur=totals(key),old=totals(prev);
  const max=Math.max(cur.expense,old.expense,1),diff=cur.expense-old.expense;
  const msg=diff===0?"Mismo nivel de gastos":diff<0?`Gastaste ${money(Math.abs(diff))} menos que el mes anterior`:`Gastaste ${money(diff)} más que el mes anterior`;
  $("comparison").innerHTML=`<div class="compare-row"><span>${d.toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill" style="width:${cur.expense/max*100}%"></div></div><strong>${money(cur.expense)}</strong></div><div class="compare-row"><span>${monthDate(prev).toLocaleDateString("es-CL",{month:"short"})}</span><div class="compare-track"><div class="compare-fill old-fill" style="width:${old.expense/max*100}%"></div></div><strong>${money(old.expense)}</strong></div><div class="budget-status">${msg}</div>`;
}
function renderCategoryPicker(type,selected){const picker=$(type==="expense"?"expenseCategoryPicker":"incomeCategoryPicker");const options=type==="expense"?expenseCategoryOptions:[...incomeCategoryOptions];if(type==="income"&&selected==="Sueldo")options.unshift({name:"Sueldo",icon:"＋"});picker.innerHTML=options.map(option=>`<button type="button" class="category-option${option.name===selected?" selected":""}" data-category="${option.name}" aria-pressed="${option.name===selected}"><span class="category-option-icon">${option.icon}</span><span>${option.name}</span></button>`).join("");picker.querySelectorAll(".category-option").forEach(button=>button.onclick=()=>{$("category").value=button.dataset.category;picker.querySelectorAll(".category-option").forEach(item=>{const active=item===button;item.classList.toggle("selected",active);item.setAttribute("aria-pressed",String(active))})})}
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
 document.querySelectorAll("[data-view]").forEach(el=>{el.hidden=el.dataset.view!==tab});
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

