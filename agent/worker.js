// Zeitarbeits-ABC: Cloudflare Worker, not deployed automatically.
// Configure GROQ_API_KEY as a secret. Set ALLOWED_ORIGIN to the exact GitHub Pages origin.
// This is a non-commercial technical prototype until legal/privacy review.
const MODEL = "openai/gpt-oss-20b";
const SYSTEM = `Du bist der Zeitarbeits-ABC-Erstcheck für Arbeitnehmer in Deutschland.
Antworte auf Deutsch, knapp, verständlich, konkret und ohne Floskeln.
Du darfst nur eine unverbindliche erste Orientierung geben, keine verbindliche Eingruppierung, Nachzahlungsforderung oder Rechtsberatung.
Stelle höchstens zwei gezielte Rückfragen pro Antwort, nur wenn für die nächste Prüfung nötig.
Unterscheide stets zwischen bekannten Angaben, offenen Punkten und nächsten Schritten.
Erfinde keine Tarifwerte, Tarifgeltung, Fristen, Quellen, Geldbeträge oder Ansprüche.
Verwende keine externen Webseiten als geprüft, wenn sie nicht bereitgestellt wurden.
Bitte niemals um Namen, Personalnummern, Adressen oder ungeschwärzte Verträge.
Wenn konkrete Tarifdaten fehlen, benenne das ausdrücklich. Bei Fristgefahr: zügig qualifizierte Beratung empfehlen.`;
export default {
 async fetch(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGIN || "https://juschni.github.io";
  const headers = {"Access-Control-Allow-Origin": allowed, "Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin","Cache-Control":"no-store"};
  if(origin !== allowed) return new Response("Origin not allowed",{status:403});
  if(request.method === "OPTIONS") return new Response(null,{status:204,headers});
  if(request.method !== "POST") return new Response("Method not allowed",{status:405,headers});
  if(!env.GROQ_API_KEY) return Response.json({error:"Agent nicht konfiguriert"},{status:503,headers});
  const size = Number(request.headers.get("content-length") || 0);
  if(size > 16000) return Response.json({error:"Nachricht zu groß"},{status:413,headers});
  let data; try {data = await request.json()} catch {return Response.json({error:"Ungültige Anfrage"},{status:400,headers})}
  const messages = Array.isArray(data.messages) ? data.messages.slice(-8) : [];
  if(!messages.length || messages.some(m=>!["user","assistant"].includes(m.role)||typeof m.content!=="string"||m.content.length>2500)) return Response.json({error:"Ungültige Nachrichten"},{status:400,headers});
  try {
   const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions",{
    method:"POST",headers:{"Authorization":"Bearer "+env.GROQ_API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({model:MODEL,temperature:0.1,max_tokens:500,messages:[{role:"system",content:SYSTEM},...messages]})
   });
   if(!upstream.ok) return Response.json({error:upstream.status===429?"Kostenloses Anfragekontingent erreicht":"KI-Dienst vorübergehend nicht verfügbar"},{status:upstream.status===429?429:502,headers});
   const result = await upstream.json();
   return Response.json({answer:result.choices?.[0]?.message?.content||"Keine Antwort erhalten."},{headers});
  } catch {return Response.json({error:"Verbindung zum KI-Dienst fehlgeschlagen"},{status:502,headers})}
 }
};