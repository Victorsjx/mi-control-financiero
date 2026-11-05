const ALLOWED_ORIGIN="https://victorsjx.github.io";
const EXPECTED_HOSTNAME="victorsjx.github.io";
const EXPECTED_ACTION="receipt_scan";
const API_URL="https://api.tabscanner.com";
const MAX_FILE_SIZE=8*1024*1024;
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin","Cache-Control":"no-store"}})}
async function verifyTurnstile(token,request,env){
 if(!token||token.length>2048||!env.TURNSTILE_SECRET_KEY)return false;
 const response=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token,remoteip:request.headers.get("CF-Connecting-IP")||""})});
 if(!response.ok)return false;const result=await response.json();
 return result.success===true&&result.action===EXPECTED_ACTION&&result.hostname===EXPECTED_HOSTNAME;
}
export default {async fetch(request,env){
 const origin=request.headers.get("Origin")||"";
 if(origin!==ALLOWED_ORIGIN)return json({error:"Origen no autorizado"},403);
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":ALLOWED_ORIGIN,"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Access-Control-Max-Age":"86400","Vary":"Origin"}});
 if(request.method!=="POST")return json({error:"Método no permitido"},405);
 if(!env.TABSCANNER_API_KEY||!env.TURNSTILE_SECRET_KEY)return json({error:"Falta configurar una clave del servicio"},500);
 const length=Number(request.headers.get("Content-Length")||0);if(length>MAX_FILE_SIZE+100000)return json({error:"La imagen supera el límite de 8 MB"},413);
 try{
  const incoming=await request.formData(),file=incoming.get("file"),token=incoming.get("cf-turnstile-response");
  if(!(file instanceof File)||file.size===0)return json({error:"Selecciona una fotografía válida"},400);
  if(file.size>MAX_FILE_SIZE)return json({error:"La imagen supera el límite de 8 MB"},413);
  if(!["image/jpeg","image/png"].includes(file.type))return json({error:"Formato no compatible. Usa JPG o PNG."},415);
  if(!await verifyTurnstile(String(token||""),request,env))return json({error:"La verificación de seguridad expiró o no fue válida. Inténtalo nuevamente."},403);
  const uploadForm=new FormData();uploadForm.append("file",file,file.name||"boleta.jpg");uploadForm.append("region","cl");uploadForm.append("documentType","auto");uploadForm.append("defaultDateParsing","d/m");
  const uploadResponse=await fetch(`${API_URL}/api/2/process`,{method:"POST",headers:{"apikey":env.TABSCANNER_API_KEY},body:uploadForm}),upload=await uploadResponse.json();
  if(![200,300].includes(upload.code)||!upload.token)return json({error:upload.message||"Tabscanner no pudo recibir la boleta",code:upload.code||null},422);
  const deadline=Date.now()+55000;let result=null;
  while(Date.now()<deadline){await new Promise(resolve=>setTimeout(resolve,1000));const response=await fetch(`${API_URL}/api/result/${encodeURIComponent(upload.token)}`,{headers:{"apikey":env.TABSCANNER_API_KEY}}),body=await response.json();if(body.code===202&&body.result){result=body.result;break}if(body.code!==301)return json({error:body.message||"No se pudo leer la boleta",code:body.code||null},422)}
  if(!result)return json({error:"La lectura está tardando demasiado. Inténtalo nuevamente."},504);
  return json({merchant:result.establishment||"",total:typeof result.total==="number"&&Number.isFinite(result.total)?result.total:null,date:result.dateISO?result.dateISO.slice(0,10):result.date?result.date.slice(0,10):"",currency:result.currency||"",confidence:typeof result.totalConfidence==="number"?result.totalConfidence:null,validatedTotal:result.validatedTotal===true,duplicate:upload.duplicate===true});
 }catch{return json({error:"No se pudo procesar la imagen. Comprueba tu conexión e inténtalo nuevamente."},500)}
}};
