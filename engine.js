"use strict";
const GAME_URL="https://jimmdunc-hub.github.io/trap-full/";
const TITLE_MERCH_LINK="https://petinplumbco.myshopify.com/?utm_source=trapfull&utm_medium=web&utm_campaign=pepperrun";// title button + in-game van run (Piquin, Nov 1)
const MERCH_LINK="https://petinplumbco.myshopify.com/?utm_source=trapfull&utm_medium=web&utm_campaign=game";
const FOLLOW_LINK="https://x.com/Pipe_petin";
// ---------- growth: analytics, per-ending merch, challenge links, endings tracker ----------
// Cookieless analytics. Set to your GoatCounter count URL, e.g. "https://<code>.goatcounter.com/count".
// Empty = nothing is ever sent. Never sent with ?dev=1, ?verify=1 or ?debug=1. No cookies, no personal data.
const ANALYTICS_ENDPOINT="";
// Ending -> sticker product (Shopify handles, mapped only where the product clearly matches). Others use MERCH_LINK.
const STORE_PRODUCT_BASE="https://petinplumbco.myshopify.com/products/";
const MERCH_PRODUCTS={
 endKevin:"pixel-drain-machine-sticker-retro-plumber-tool-art-1",      // "snake it": drain machine
 e1_pro:"pixel-two-handle-faucet-sticker-retro-plumber-tool-art-1",     // "faucet's new"
 e2_hotspring:"pixel-water-heater-sticker-retro-plumber-tool-art-1",    // hot-water line leak
 e2_righthole:"pixel-rotary-hammer-sticker-retro-plumber-tool-art-1",   // chipping the slab
 e2_wronghole:"pixel-rotary-hammer-sticker-retro-plumber-tool-art-1",   // chipping the (wrong) slab spot
 e4_hotagain:"pixel-water-heater-sticker-retro-plumber-tool-art-1"};   // Ep4 "Hot Again": Pixel Water Heater sticker (spec)
// Certified Apprentice badge reward: placeholder only (no discount code). Set later, e.g. {text:"...",url:"..."}.
const APPRENTICE_REWARD=null;
// Art: list files here once they exist in assets/img/ (empty = CSS stage, no network requests)
// Ep3 upgrade: EP.artDir {dir,files} routes listed art to an episode subfolder (e.g. assets/img/ep3_upgrade/); everything else stays assets/img/.
function artPath(n){const d=typeof EP!=="undefined"&&EP&&EP.artDir;return "assets/img/"+(d&&d.files.indexOf(n)>=0?d.dir+n:n);}
const ART_AVAILABLE=["bg_truck.png","bg_bath_cabinet.png","bg_tub.png","bg_party.png","card_endPro.png","card_endNote.png","card_endKevin.png","card_endBlowout.png","card_endPepper.png","card_endYogurt.png","card_endHandyman.png","prop_dale_card_large.png"];
// Audio: list names once files exist in assets/sfx|music/ (empty = synthesized fallback beeps)
const AUDIO_AVAILABLE=[];

const GLOBAL_TIPS={
trapSeal:"A P-trap holds a plug of water (the trap seal, 2–4 in. deep by code) that blocks sewer gas from coming into the house.",
vent:"Drain vents let air into the pipes so water flows and traps don't get siphoned dry. Gurgling or slow drains can mean a clog or a vent problem. Changing or adding vents is code work; call a licensed plumber.",
chemicals:"Skip caustic drain openers — snake or auger instead. They can damage old pipes and burn you, and never plunge or snake into a drain with chemical cleaner in it — it can splash back. Never mix drain chemicals.",
ppe:"Gloves and eye protection for any clog work. Drain water is sewage-adjacent.",
multiFixture:"If the tub backs up when the sink drains, the clog is downstream in a shared line or the main — not just the sink trap. Sewage backs up at the lowest fixture first. Main-line and sewer clogs are a job for a licensed plumber.",
lowestFixture:"A main-line backup shows up at the lowest drain in the house first (a downstairs tub, shower or floor drain). If that one's filling up, it's the sewer line; call a licensed plumber.",
overflow:"Use a cup plunger on a tub or sink, and block the overflow (wet rag) — or the other drain on a double sink — so it pushes on the clog instead of air.",
mainShutoff:"Know where your main shutoff is. Often a house-side valve where the line enters (pier-and-beam: under the house; slab: near the front hose bib or garage) and the utility valve in the curb meter box, which belongs to the water utility — call them or a licensed plumber before touching it.",
fireAnts:"Texas meter boxes are a favorite fire-ant spot. Open the lid with a tool and look before you reach.",
slipJoint:"Slip-joint trap nuts seal with the washer, not tape. Bevel faces the joint; hand-tight plus about a quarter turn — don't crank plastic. Thread tape is for threads.",
sTrap:"S-traps can siphon their own seal dry, so the IPC (1002.3) and UPC prohibit them in new work. A licensed plumber installs a properly vented P-trap.",
fog:"Fats, oils, grease (dairy too) and hair are top clog causes. Grease goes in the trash, not the drain.",
cleanout:"A main-line clog is cleared through the cleanout, usually outside near the house. Tree roots in old clay or cast-iron lines are a common Texas cause. Running a sewer machine is a job for a licensed plumber.",
auger:"Let the cable do the work: feed it slow and don't force it. Forcing kinks the cable or makes it whip. Gloves on, hands clear.",
noForce:"Don't force a snake; you can kink the cable or crack old pipe. Let the head do the work.",
mainFirst:"Find and close the house main before you open up a pressurized line.",
chemPlunge:"Never plunge after using chemical drain cleaner, because it can splash caustic on you. Tell the plumber what you poured.",
sealant:"Spray-on sealant isn't a repair for a pressurized water line: the line is under pressure all the time, and it spikes when a valve like the ice maker's opens. Shut off the water and replace the leaking line or fitting.",
sTrapVent:"An S-trap siphons its own water seal dry, so sewer gas gets in: that's the gurgle and the smell. The fix is a P-trap with a proper vent. Venting changes are code work; call a licensed plumber.",
tpDischarge:"A water heater's T&P relief line has to be an approved pipe, the full size of the valve outlet, with no kinks, valves or caps, ending where it can drain safely. A garden hose isn't one. Water heater work means calling a licensed plumber.",
curbUtility:"If the house valve won't hold, call the water department.",
flatTee:"A sanitary tee laid flat on its back is not allowed in a horizontal drain because it catches waste, and the backup shows up at the lowest fixture first. Fixing it is sewer work; call a licensed plumber.",
gasWalkout:"Push-fit water fittings aren't made for gas. If you see a bad gas fitting or smell gas, don't touch it and don't flip switches: leave, then call the gas company (or 911) from outside, and have a licensed pro do the repair.",
testRun:"After a repair, run water and check every joint for drips before you call it done."
};

// ---------- episode registry ----------
// Ep 0 content lives in episodes/ep00.js (listed in episodes/index.js). GLOBAL_TIPS stay here.
const EPISODES={};
function hasEp(id){return typeof id==="string"&&Object.hasOwn(EPISODES,id);}
function epOf(id){return hasEp(id)?EPISODES[id]:undefined;}
// ep.art: extra filenames in assets/img/ that this episode ships (added to ART_AVAILABLE).
window.registerEpisode=function(ep){if(ep&&typeof ep.id==="string"&&/^[a-z0-9_]{1,32}$/.test(ep.id)){EPISODES[ep.id]=ep;(Array.isArray(ep.art)?ep.art:[]).forEach(f=>{if(typeof f==="string"&&/^[\w.-]+\.png$/.test(f)&&ART_AVAILABLE.indexOf(f)<0)ART_AVAILABLE.push(f);});}};
let EP=null,sceneById={},TIPS={},ENDINGS=[];
function useEpisode(id){
 EP=epOf(id);
 sceneById=Object.assign({},EP.scenes||{},EP.endings||{});
 TIPS=Object.assign({},GLOBAL_TIPS,EP.tips||{});
 ENDINGS=Object.keys(EP.endings||{});
 const frame=$("resultFrameImg");
 if(frame&&EP.resultFrame&&EP.resultFrame.src)frame.src=EP.resultFrame.src;
}
function showStub(){return params.get("dev")==="1";}
// Release gating: an episode is listed, playable and featured once its release date (YYYY-MM-DD) is today or earlier
// in the player's local date. ?dev=1 shows unreleased ones; ?dev=1&today=YYYY-MM-DD (ignored without dev=1; or window.TRAP_TODAY, set only by the
// private test build) overrides the date for QA. A release may also carry a time and UTC offset (see isReleased).
function todayStr(){const ok=v=>{if(typeof v!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const [y,m,d]=v.split("-").map(Number);const t=new Date(Date.UTC(y,m-1,d));return t.getUTCFullYear()===y&&t.getUTCMonth()===m-1&&t.getUTCDate()===d;};const q=showStub()?params.get("today"):null;if(ok(q))return q;if(ok(window.TRAP_TODAY))return window.TRAP_TODAY;
 const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function isReleased(id){const ep=epOf(id);if(!ep)return false;const ix=(window.EPISODES_INDEX||[]).find(e=>e.id===id);const rel=(ix&&ix.release)||ep.release||"";
 if(/^\d{4}-\d{2}-\d{2}$/.test(rel))return rel<=todayStr();
 // Timed gate: "YYYY-MM-DDTHH:MM[:SS](Z|±HH:MM)", e.g. "2026-10-31T08:00-05:00". An exact instant, the same for every player.
 // ?dev=1&now=<same format> overrides the clock for QA (ignored without dev=1); a ?today= / TRAP_TODAY date override opens it for that whole day.
 const RX=/^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/;const m=RX.exec(rel);if(!m)return !rel;const at=Date.parse(rel);if(!isFinite(at))return false;
 const nq=showStub()?params.get("now"):null;if(nq&&RX.test(nq)&&isFinite(Date.parse(nq)))return Date.parse(nq)>=at;
 const tq=showStub()?params.get("today"):null;if((tq&&/^\d{4}-\d{2}-\d{2}$/.test(tq))||typeof window.TRAP_TODAY==="string")return m[1]<=todayStr();
 return Date.now()>=at;}
function canPlay(id){return !!epOf(id)&&(showStub()||(isReleased(id)&&!epOf(id).stub));}
function episodeList(){
 const index=window.EPISODES_INDEX||[],seen={},rows=[];
 index.forEach(e=>{
  if(!epOf(e.id))return;const ep=epOf(e.id);seen[e.id]=1;if(ep.stub&&!showStub())return;if(!isReleased(e.id)&&!showStub())return;
  rows.push({id:e.id,title:ep.title,week:ep.week,release:e.release||ep.release||""});
 });
 Object.keys(EPISODES).forEach(id=>{
  if(seen[id])return;const ep=epOf(id);if(ep.stub&&!showStub())return;if(!isReleased(id)&&!showStub())return;
  rows.push({id:id,title:ep.title,week:ep.week,release:ep.release||""});
 });
 rows.sort((a,b)=>b.week-a.week||(a.id<b.id?-1:1));
 return rows;
}
function newestReal(){
 const all=episodeList();
 for(let i=0;i<all.length;i++)if(!epOf(all[i].id).stub&&isReleased(all[i].id))return all[i];
 return all[0]||null;
}

// ---------- pure logic ----------
const clamp=v=>Math.max(0,Math.min(100,v));
function cmp(val,expr){const m=/^(>=|<=|>|<|==)?\s*(-?\d+)$/.exec(String(expr));if(!m)return false;const op=m[1]||"==",n=+m[2];
 return op===">="?val>=n:op==="<="?val<=n:op===">"?val>n:op==="<"?val<n:val===n;}
function meets(req,st){if(!req)return true;
 for(const k of ["P","R","T","dalehacks"])if(req[k]!==undefined&&!cmp(k==="dalehacks"?(st.dalehacks||0):st[k]-((st.bless&&st.bless[k])||0),req[k]))return false;// El Santo: gates never see the blessing
 if(req.flags&&!req.flags.every(f=>st.flags[f]))return false;
 if(req.notFlags&&req.notFlags.some(f=>st.flags[f]))return false;
 if(req.any&&!req.any.some(r=>meets(r,st)))return false;return true;}
function resolveEnding(st){const rules=EP.resolve||[];for(let i=0;i<rules.length;i++)if(meets(rules[i].if,st))return rules[i].to;return ENDINGS[0];}
function resolveNext(n,s){return typeof n==="string"?n:(meets(n.if,s)?n.then:n.else);}
function nextTargets(n){return typeof n==="string"?[n]:[n.then,n.else];}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function seedToState(seed){return hashStr(String(seed));}
function rng(st){let a=st.rngState|0;a=a+0x6D2B79F5|0;st.rngState=a>>>0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;}
const SEED_CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789";
function newSeed(){let s="";for(let i=0;i<6;i++)s+=SEED_CHARS[Math.floor(Math.random()*SEED_CHARS.length)];return s;}
function seedFromQuery(){const q=(params.get("seed")||"").toUpperCase();return /^[A-Z2-9]{6}$/.test(q)?q:null;}
function cloneSt(s){return {ep:s.ep,scene:s.scene,P:s.P,R:s.R,T:s.T,flags:Object.assign({},s.flags||{}),history:(s.history||[]).slice(),
 correct:s.correct||0,total:s.total||0,tipsWrong:(s.tipsWrong||[]).slice(),tipsRight:(s.tipsRight||[]).slice(),dalehacks:s.dalehacks||0,bless:s.bless&&typeof s.bless==="object"?Object.assign({},s.bless):undefined,
 hackTips:(s.hackTips||[]).slice(),seenTips:(s.seenTips||[]).slice(),panel:s.panel||null,seed:s.seed||"AAAAAA",
 rngState:typeof s.rngState==="number"?s.rngState:seedToState(s.seed||"AAAAAA"),elapsedMs:s.elapsedMs||0,penaltyMs:s.penaltyMs||0,collected:!!s.collected};}
function hackLimit(){if(typeof EP.hackThreshold==="number")return EP.hackThreshold;const h=EP.hackChain;if(h&&typeof h==="object"&&typeof h.threshold==="number")return h.threshold;return 3;}
function hackPanel(){const h=EP.hackChain;if(!h)return null;return typeof h==="string"?h:(h.panel||null);}
function freshState(seed){const S=EP.start||{};return cloneSt({ep:EP.id,scene:S.scene,P:S.P,R:S.R,T:S.T,flags:Object.assign({},S.flags||{}),seed:seed,rngState:seedToState(seed)});}
// El Santo de Petin random event (design/el-santo-random-event-scope.md, Piquin approved Nov 1 2026). Opt-in per episode: EP.santo={chance,meter:"R"|"T",amount,after?:[sceneIds],text}.
// Rolled once per run, on the first do-it-right choice (correct:true, not a hack) with zero Dale hacks so far. Own seeded stream (seed+"|santo"), so the run RNG and every other roll are untouched.
// The blessing is tracked in st.bless and subtracted in meets(), so it never unlocks or blocks an ending, gate or secret. He fixes nothing. Force with forceEv "santo" or ?dev=1&santo=1.
// Meter change that keeps the blessing exact through clamps: st[k]-st.bless[k] always equals the unblessed run's meter.
function addM(st,k,d){const b=st.bless&&st.bless[k];if(b){const u=clamp(st[k]-b+d);st[k]=clamp(st[k]+d);st.bless[k]=st[k]-u;}else st[k]=clamp(st[k]+d);}
function santoRoll(st,c,correct,isHack,ev){const S=EP.santo;if(!S||st.flags.santoRolled||correct!==true||isHack||(st.dalehacks||0)>0)return;if(S.after&&S.after.indexOf(st.scene)<0)return;
 st.flags.santoRolled=true;const forced=!!st.forceEv&&st.forceEv.indexOf("santo")>=0;const r={rngState:seedToState(String(st.seed)+"|santo")};
 if(!(forced||rng(r)<(S.chance===undefined?0.07:S.chance)))return;const m=S.meter==="T"?"T":"R",b=st[m];st[m]=clamp(st[m]+(S.amount||3));
 st.bless=st.bless||{};st.bless[m]=(st.bless[m]||0)+(st[m]-b);st.flags.blessed=true;
 ev.push({type:"santo",text:(S.text||"El Santo de Petin")+' <span class="santoChip">'+((EP.chipLabels&&EP.chipLabels[m])||(m==="T"?"Patience":"Rep"))+" ▲</span>"});}
function enterScene(st,id,ev){
 for(let guard=0;guard<8;guard++){
  st.scene=id;const sc=sceneById[id];if(!sc||sc.end)return;
  if(sc.panelOnly){st.panel=id;id=sc.next;continue;}
  if(sc.entryPanel&&!st.flags["panel_"+id]){const p=sc.entryPanel;st.flags["panel_"+id]=true;st.panel=id;
   for(const k of ["P","R","T"])if(p.effects&&p.effects[k])addM(st,k,p.effects[k]);
   st.total++;st.correct++;if(p.tip){st.tipsRight.push(p.tip);ev.push({type:"tip",tip:p.tip});}}
  if(sc.onEnter)sc.onEnter.forEach(f=>st.flags[f]=true);
  if(sc.shake)ev.push({type:"shake"}); // written jump-scare beat: one screen shake on entry, never timed
  if(sc.drift&&!st.flags.mainOff){st.P=clamp(st.P+(EP.driftAmount||5));ev.push({type:"drift"});
   if(st.P>=100&&EP.failEnding){id=EP.failEnding;continue;}}
  if(sc.enterTip){ev.push({type:"tip",tip:sc.enterTip});if(sc.enterTipRecap&&st.seenTips.indexOf(sc.enterTip)<0)st.seenTips.push(sc.enterTip);}
  const slot=(EP.events||[]).filter(e=>e.at&&e.at.indexOf(id)>=0&&!st.flags["ev_"+e.id]);
  if(slot.length&&!ev.some(x=>x.type==="event")){
   // verify playScripts: when a run forces an event at this scene, only forced events fire here (no roll for the others)
   const forcedHere=!!st.forceEv&&slot.some(e=>st.forceEv.indexOf(e.id)>=0);
   for(let i=0;i<slot.length;i++){const e=slot[i];st.flags["ev_"+e.id]=true;
    if(forcedHere?st.forceEv.indexOf(e.id)>=0:rng(st)<e.chance){for(const k of ["P","R","T"])if(e.effects&&e.effects[k])addM(st,k,e.effects[k]);(e.setFlags||[]).forEach(f=>st.flags[f]=true);if(e.shake)ev.push({type:"shake"});
     ev.push({type:"event",text:e.text});if(e.tip){st.tipsRight.push(e.tip);ev.push({type:"tip",tip:e.tip});}break;}}}
  if(st.P>=100&&EP.failEnding){id=EP.failEnding;continue;}
  const pl=EP.patienceLeave;if(pl&&st.T-((st.bless&&st.bless.T)||0)<=pl.at&&!st.flags[pl.flag]){st.flags[pl.flag]=true;ev.push({type:"note",text:pl.text});}
  if(sc.forceIf&&meets(sc.forceIf,st)){id=sc.forceIf.to;continue;}
  return;}
}
function applyChoice(st,c,ev,idx){
 if(c.secs)st.penaltyMs=(st.penaltyMs||0)+c.secs*1000;
 const before={P:st.P,R:st.R};const e=Object.assign({},c.effects||{});
 let tip=c.tip,correct=c.correct,note=c.noteAlt&&meets(c.noteAlt.if,st)?c.noteAlt.text:c.note;
 if(c.chemPenalty&&st.flags.chemicals)e.R=(e.R||0)-5;
 if(c.chemPlunge&&st.flags.chemicals){e.R=(e.R||0)-10;e.P=(e.P||0)+5;tip="chemPlunge";correct=false;note="The plunger burps the drain cleaner right back up. Caustic splash-back on your sleeve; the cabinet now smells like a pool fire.";}
 if(c.alt&&meets(c.alt.if,st)){const a=c.alt;for(const k in (a.addEffects||{}))e[k]=(e[k]||0)+a.addEffects[k];if(a.tip)tip=a.tip;if(a.correct!==undefined)correct=a.correct;if(a.note)note=a.note;}
 // Ep3 upgrade: c.roll = seeded branch on the run RNG {chance, setFlags, note, else:{setFlags, note}}; the hit side when rng < chance.
 if(c.roll){const hit=(c.roll.id&&st.forceEv&&st.forceEv.indexOf(c.roll.id)>=0)||rng(st)<c.roll.chance,r=hit?c.roll:(c.roll.else||{});(r.setFlags||[]).forEach(f=>st.flags[f]=true);if(r.note)note=r.note;}
 let vanFail=null;if(c.vanRun&&EP.vanRunLines){const V=EP.vanRunLines;const failAt=V.chance===undefined?0.75:V.chance;
  if(rng(st)<failAt){vanFail={d:0,fP:0,s:0};const lines=V.fail||[""];const line=lines[Math.floor(rng(st)*lines.length)]||"";
   const lo=(V.failT&&V.failT[0])||5,hi=(V.failT&&V.failT[1])||10;const d=lo+Math.floor(rng(st)*(hi-lo+1));
   const fP=Number.isFinite(+V.failP)?+V.failP:0;e.T=(e.T||0)-d;if(fP)e.P=(e.P||0)+fP;st.penaltyMs=(st.penaltyMs||0)+(V.failSeconds===undefined?45:V.failSeconds)*1000;vanFail={d:d,fP:fP,s:(V.failSeconds===undefined?45:V.failSeconds)*1000};
   note=line+" (−"+d+" Patience"+(fP?", +"+fP+" "+((EP.meterLabels&&EP.meterLabels.P)||"Pressure"):"")+", +"+(V.failSeconds===undefined?45:V.failSeconds)+" s)";if(V.failTip)tip=V.failTip;correct=false;}
  else{const lines=V.success||[""];e.T=(e.T||0)+(V.successT===undefined?3:V.successT);note=lines[Math.floor(rng(st)*lines.length)]||"";}}
 if(pepperAdj){const r=pepperAdj,H=pepperHook()||PEPPER_HOOKS.ep02;pepperAdj=null;// pepper run only: adjust relative to the normal van-run result above
  if(!H.rescue){// Ep3+: Patience capped at 5 either way; hooks with highR (Ep3, Ep4) also add vanRunLines.pepperHighR Rep on a high score
   if(!r.skipped&&r.band==="high"){e.T=(e.T||0)+3;note=(note?note+" ":"")+H.high.replace("{n}",r.chilies).replace("{t}",r.total);
    const VH=EP.vanRunLines||{};if(H.highR&&VH.pepperHighR){e.R=(e.R||0)+VH.pepperHighR;note+=" "+(VH.pepperHighNote||"")+"(+"+VH.pepperHighR+" Reputation)";}}// high-score Rep bonus outside the rescue branch (opt-in per hook: highR; Ep3 and Ep4 enabled per Director Oct 24)
   else if(!r.skipped&&r.band==="low"){e.T=(e.T||0)-5;note=(note?note+" ":"")+(r.fell?H.fellText:"")+H.drink+" (−5 Patience)";}}
  else if(!r.skipped&&r.band==="high"){const V=EP.vanRunLines||{};
   if(vanFail){e.T=(e.T||0)+vanFail.d+(V.successT===undefined?3:V.successT);if(vanFail.fP)e.P=(e.P||0)-vanFail.fP;st.penaltyMs=(st.penaltyMs||0)-vanFail.s;tip=c.tip;correct=c.correct;
    note="Pepper Run "+r.chilies+"/"+r.total+": the Boy beats the bad luck. "+((V.success&&V.success[0])||"Right tools.");}
   else{e.T=(e.T||0)+3;note=(note?note+" ":"")+"Pepper Run "+r.chilies+"/"+r.total+": back fast. (+3 Patience)";}
   if(V.pepperHighR){e.R=(e.R||0)+V.pepperHighR;note+=" "+(V.pepperHighNote||"")+"(+"+V.pepperHighR+" Reputation)";}}
  else if(!r.skipped&&r.band==="low"){e.T=(e.T||0)-5;note=(note?note+" ":"")+(r.fell?H.fellText:"")+H.drink+" (−5 Patience)";}
  if(r.fullClear)note=(note?note+" ":"")+"Full clear: +1 to the pepper jar.";}
 for(const k of ["P","R","T"])if(e[k])addM(st,k,e[k]);
 (c.setFlags||[]).forEach(f=>st.flags[f]=true);
 const col=EP.collectible;if(col&&st.scene===col.scene&&idx===col.choice){st.collected=true;ev.push({type:"note",text:"Collected: <b>"+col.name+"</b>"});
  if(!DEBUG&&!VERIFY){const sh=shelf();if(!sh[col.id]){sh[col.id]={ep:EP.id,date:today()};lsSet(K.shelf,JSON.stringify(sh));}}}
 if(correct!==undefined){st.total++;if(correct)st.correct++;}
 if(note)ev.push({type:"note",text:note});
 if(tip){(correct===false?st.tipsWrong:st.tipsRight).push(tip);ev.push({type:"tip",tip:tip});}
 const isHack=c.hack||(c.hackIf&&meets(c.hackIf,st));
 if(isHack){st.dalehacks=(st.dalehacks||0)+1;if(tip)st.hackTips.push(tip);if(c.hackNote)ev.push({type:"note",text:c.hackNote});}
 santoRoll(st,c,correct,isHack,ev);
 st.history.push(st.scene+":"+c.label);
 ev.push({type:"delta",dP:st.P-before.P,dR:st.R-before.R});
 let next;
 if(st.P>=100&&EP.failEnding)next=EP.failEnding;
 else if(isHack&&hackPanel()&&(st.dalehacks||0)>=hackLimit())next=hackPanel();
 else if(c.next==="resolve"){const cb=EP.resolveCallback;if(cb&&!st.flags[cb.unlessFlag]){addM(st,"R",cb.R);ev.push({type:"note",text:cb.text});}next=resolveEnding(st);}
 else{next=resolveNext(c.next,st);(EP.redirects||[]).forEach(r=>{if(st.scene===r.from&&next===r.to&&meets(r.if,st))next=r.go;});}
 enterScene(st,next,ev);
}
function endingMult(end,id){if(end&&typeof end.scoreMult==="number")return end.scoreMult;if(end&&(end.fail||id==="endBlowout"||id==="endHandyman"))return 0.5;return 1;}
function scoreOf(st){const end=sceneById[st.scene]||{};const secs=Math.round(((st.elapsedMs||0)+(st.penaltyMs||0))/1000);
 const par=(EP.scoring&&EP.scoring.parSeconds)||300;let s=st.correct*100+st.R+st.T-st.P+Math.max(0,par-secs)*2;
 s=Math.floor(s*endingMult(end,st.scene));if(s<0)s=0;return {score:s,secs:secs};}

// ---------- storage ----------
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k)}catch(e){}}
function jget(k,d){try{const v=JSON.parse(lsGet(k));return v===null||v===undefined?d:v}catch(e){return d}}
function today(){try{return new Date().toISOString().slice(0,10)}catch(e){return ""}}
const params=new URLSearchParams(location.search);const DEBUG=params.get("debug")==="1"&&params.get("dev")==="1";/* debug panel (Rep, flags) only with ?dev=1 */const VERIFY=params.get("verify")==="1";
function merchUrl(endId){const id=String(endId||""),h=Object.prototype.hasOwnProperty.call(MERCH_PRODUCTS,id)?MERCH_PRODUCTS[id]:"";
 const base=h?STORE_PRODUCT_BASE+h+"?utm_source=trapfull":MERCH_LINK;return base+(base.indexOf("?")<0?"?":"&")+"utm_content="+encodeURIComponent(id);}
window.__trapEvents=[];// local event log (QA); only sent when ANALYTICS_ENDPOINT is set
function analyticsOn(){return !!ANALYTICS_ENDPOINT&&/^https:\/\//.test(ANALYTICS_ENDPOINT)&&params.get("dev")!=="1"&&!VERIFY&&!DEBUG;}
function track(name,id){const ev={name:String(name),id:id?String(id):""};window.__trapEvents.push(ev);gcEvent(ev);if(!analyticsOn())return;
 try{const path="/event/"+ev.name+(ev.id?"/"+ev.id:"");
  const u=ANALYTICS_ENDPOINT+"?p="+encodeURIComponent(path)+"&t="+encodeURIComponent(ev.name)+"&e=true&rnd="+Math.random().toString(36).slice(2);
  if(navigator.sendBeacon)navigator.sendBeacon(u);else{const i=new Image();i.referrerPolicy="no-referrer";i.src=u;}}catch(e){}}
// GoatCounter events (plays, endings, merch clicks). Skipped in dev/verify/debug; a blocked or missing script is a no-op.
const GC_EVENTS=["play","ending","merch"];
function gcEvent(ev){if(GC_EVENTS.indexOf(ev.name)<0||params.get("dev")==="1"||VERIFY||DEBUG)return;
 try{const gc=window.goatcounter;if(gc&&typeof gc.count==="function")gc.count({path:ev.name+(ev.id?"/"+ev.id:""),title:ev.name+(ev.id?": "+ev.id:""),event:true});}catch(e){}}
// Challenge link: ?ep=<id>&beat=<score>[&seed=<seed>]. Junk or unplayable values are ignored.
let CHALLENGE=null;
function challengeFromQuery(){const ep=params.get("ep"),b=params.get("beat");if(!ep||b===null||!/^[0-9]{1,6}$/.test(b))return null;
 const n=parseInt(b,10);if(!(n>0))return null;if(!hasEp(ep)||!canPlay(ep)||epOf(ep).stub)return null;return {ep:ep,beat:n,seed:seedFromQuery()};}
function challengeUrl(R){return GAME_URL+"?ep="+encodeURIComponent(R.ep)+"&seed="+encodeURIComponent(R.seed)+"&beat="+Math.max(0,Math.round(R.score));}
// Pepper Run van runs: Ep2 e2_06, Ep3 e3_07 and Ep4 e4_07 (see PEPPER_HOOKS) open the minigame; ?pepper=0 turns it off.
// Without the flag none of this runs and experiments/pepper-pipe/pepper-run.js is never requested. Off in verify.
const PEPPER=params.get("pepper")!=="0"&&!VERIFY;const PEPPER_TEST=PEPPER&&params.get("pepper")==="ep5"?"ep05":null;/* launch: on by default, ?pepper=0 turns it off */// Van-run hooks, one per episode (design/experiments/pepper-run-van-levels.md). Ep2 keeps its shipped rules (rescue = undo the van-run fail).
// Ep3 (Halloween, e3_07), Ep4 (steamy alley, e4_07) and Ep5 (Hold, Please, e5_07): flavor text plus at most 5 Patience either way, plus +2 Rep on a high score (clear/8) via highR (Director Oct 24); never touches Pressure/time or the van-run roll. Random play and the sims never see the bonus.
const PEPPER_HOOKS={
 ep02:{scene:"e2_06",choice:0,level:"ep02",rescue:true,drink:"...and he hands Pete a second strawberry smoothie. \"For the road.\" Nobody is going anywhere.",fellText:"(He took the hedge shortcut.) "},
 ep03:{scene:"e3_07",choice:0,level:"ep03",rescue:false,highR:true,label:" (Pepper Run 🎃)",
  high:"Pepper Run {n}/{t}: the Boy sprints back down the cul-de-sac with a pumpkin spice tea for Walt. Walt is weirdly moved. (+3 Patience)",
  drink:"...and the Boy comes back holding the skeleton grabber from the neighbor's yard. \"For hard-to-reach places.\" Walt is not amused.",fellText:"(Straight into the leaf pile.) "},
 ep04:{scene:"e4_07",choice:0,level:"ep04",rescue:false,highR:true,label:" (Pepper Run 🌶)",
  high:"Pepper Run {n}/{t}: the Boy dodges the alley water jet and is back with the element tester before Hector finishes his sentence. (+3 Patience)",
  drink:"...and the Boy comes back soaked from the alley water jet, holding a garage-sale lamp. \"It was a dollar.\" Gloria is not amused.",fellText:"(He found the drain gap.) "},
 ep05:{scene:"e5_07",choice:0,level:"ep05",rescue:false,highR:true,label:" (Pepper Run 🌶)",
  high:"Pepper Run {n}/{t}: the Boy makes it back with the crimp tool and the gauge before the hold music loops. (+3 Time to dinner)",
  drink:"...and the Boy comes back with a cardboard cabinet box \"for the drip.\" Rick is not amused.",fellText:"(Straight into the trench.) "}};
let pepperAdj=null,pepperActive=false,pepperTok=0;
function pepperHook(){return PEPPER&&EP&&Object.hasOwn(PEPPER_HOOKS,EP.id)?PEPPER_HOOKS[EP.id]:null;}
function isPepperChoice(i){const h=pepperHook();return !!h&&st&&st.scene===h.scene&&i===h.choice;}
const K={meta:"trapfull.v3.meta",shelf:"trapfull.v3.shelf",run:id=>"trapfull.v3."+id+".run",best:id=>"trapfull.v3."+id+".best",endings:id=>"trapfull.v3."+id+".endings"};
let META={schema:1,lastEpisode:null,muted:false,played:{}};
function loadMeta(){const m=jget(K.meta,null);if(m&&typeof m==="object"&&m.schema===1)META=m;if(!META.played||typeof META.played!=="object")META.played={};}
function saveMeta(){lsSet(K.meta,JSON.stringify(META));}
// Endings tracker (all episodes) beside the per-episode saves. Migrates from trapfull.v3.<ep>.endings on first load.
K.tracker="trapfull.v3.tracker";
function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
const isDay=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v);
function loadTracker(){let t=jget(K.tracker,null);if(t&&t.found&&typeof t.found==="object")t.found=Object.assign({},...Object.keys(t.found).filter(hasEp).map(k=>({[k]:t.found[k]})));if(!t||typeof t!=="object"||t.schema!==1||!t.found||typeof t.found!=="object"||Array.isArray(t.found))t={schema:1,found:{},badges:{}};
 if(!t.badges||typeof t.badges!=="object"||Array.isArray(t.badges))t.badges={};
 Object.keys(EPISODES).forEach(id=>{const ep=epOf(id);const f=Object.hasOwn(t.found,id)&&t.found[id]&&typeof t.found[id]==="object"&&!Array.isArray(t.found[id])?t.found[id]:{};
  Object.keys(f).forEach(k=>{if(!ep.endings||!Object.hasOwn(ep.endings,k))delete f[k];else if(!isDay(f[k]))f[k]=null;});
  endingsFound(id).forEach(k=>{if(ep.endings&&Object.hasOwn(ep.endings,k)&&!Object.hasOwn(f,k))f[k]=null;});t.found[id]=f;});return t;}
function saveTracker(t){if(DEBUG||VERIFY)return;lsSet(K.tracker,JSON.stringify(t));}
function releasedEndingIds(){const out=[];Object.keys(EPISODES).forEach(id=>{const ep=epOf(id);if(ep.stub||!isReleased(id))return;Object.keys(ep.endings||{}).forEach(k=>out.push(id+"/"+k));});return out;}
function trackerStats(t){t=t||loadTracker();const all=releasedEndingIds();const got=all.filter(x=>{const [e,k]=x.split("/");return Object.hasOwn(t.found,e)&&Object.hasOwn(t.found[e],k);});return {found:got.length,total:all.length,badge:t.badges.certifiedApprentice||null};}
function recordEnding(epId,endId){const t=loadTracker();if(!Object.hasOwn(t.found,epId))t.found[epId]={};if(!isDay(t.found[epId][endId]))t.found[epId][endId]=localDate();
 const s=trackerStats(t);let earned=false;if(s.total>0&&s.found>=s.total&&!t.badges.certifiedApprentice){t.badges.certifiedApprentice={date:localDate(),of:s.total};earned=true;}
 saveTracker(t);return earned;}
function endingsFound(id){const ep=epOf(id||(EP&&EP.id));const a=jget(K.endings(id||(EP&&EP.id)),[]);
 return Array.isArray(a)?a.filter((x,i,b)=>ep&&ep.endings&&ep.endings[x]&&b.indexOf(x)===i):[];}
function bestOf(id){const b=jget(K.best(id),null);return b&&typeof b.score==="number"&&isFinite(b.score)?b:null;}
function shelf(){const s=jget(K.shelf,{});return s&&typeof s==="object"&&!Array.isArray(s)?s:{};}
function normalizeRun(o){if(!o||typeof o!=="object")return null;const r=Object.assign({},o);
 if(typeof r.dalehacks!=="number")r.dalehacks=0;if(typeof r.elapsedMs!=="number")r.elapsedMs=0;if(typeof r.penaltyMs!=="number")r.penaltyMs=0;
 if(typeof r.seed!=="string")r.seed="AAAAAA";if(typeof r.rngState!=="number")r.rngState=seedToState(r.seed);
 ["P","R","T"].forEach(k=>{if(typeof r[k]==="number"&&isFinite(r[k]))r[k]=clamp(r[k]);});
 if(!Array.isArray(r.history))r.history=[];if(!Array.isArray(r.tipsWrong))r.tipsWrong=[];if(!Array.isArray(r.tipsRight))r.tipsRight=[];if(!Array.isArray(r.hackTips))r.hackTips=[];if(!Array.isArray(r.seenTips))r.seenTips=[];
 if(!r.flags||typeof r.flags!=="object"||Array.isArray(r.flags))r.flags={};if(r.panel===undefined)r.panel=null;r.schema=1;return r;}
function validRun(o,ep){if(!o||!ep)return false;const all=Object.assign({},ep.scenes||{},ep.endings||{});
 if(!all[o.scene]||all[o.scene].end)return false;if(o.panel&&!all[o.panel])return false;
 for(const k of ["P","R","T","correct","total","dalehacks","elapsedMs","penaltyMs","rngState"])if(typeof o[k]!=="number"||!isFinite(o[k]))return false;
 if(typeof o.seed!=="string")return false;
 const tips=Object.assign({},GLOBAL_TIPS,ep.tips||{});
 if(o.tipsWrong.concat(o.tipsRight,o.hackTips,o.seenTips).some(t=>!tips[t]))return false;return true;}
function loadRun(id){const o=normalizeRun(jget(K.run(id),null));if(!o)return null;if(!validRun(o,epOf(id))){lsDel(K.run(id));return null;}return o;}
function saveRun(){if(DEBUG||VERIFY||!st||!EP)return;const sc=sceneById[st.scene];if(!sc||sc.end){lsDel(K.run(EP.id));return;}
 lsSet(K.run(EP.id),JSON.stringify(Object.assign({schema:1,ep:EP.id},st)));}
function migrateV2(){
 if(jget(K.meta,null)&&jget(K.meta,null).schema===1)return;
 const ep=EPISODES.ep00;if(!ep)return;
 const old=jget("trapfull.v2",null);
 if(old&&typeof old==="object"&&!Array.isArray(old)&&!lsGet(K.run("ep00"))){
  const mig=normalizeRun(Object.assign({},old,{ep:"ep00",seed:newSeed(),dalehacks:old.dalehacks||0,elapsedMs:old.elapsedMs||0}));
  delete mig.v;if(validRun(mig,ep))lsSet(K.run("ep00"),JSON.stringify(mig));
 }
 const oe=jget("trapfull.v2.endings",null);
 if(Array.isArray(oe)&&!lsGet(K.endings("ep00")))lsSet(K.endings("ep00"),JSON.stringify(oe.filter(x=>ep.endings[x])));
 if(old||Array.isArray(oe))META.played.ep00=true;
 if(lsGet("trapfull.v2.mute")!==null)META.muted=lsGet("trapfull.v2.mute")==="1";
 if(old||Array.isArray(oe)||lsGet("trapfull.v2.mute")!==null)META.migratedFromV2=true;
 saveMeta();
}

// ---------- audio ----------
let actx=null,started=false,curMusic=null;
function unlockAudio(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
 try{if(!actx)actx=new AC();if(actx.state==="suspended")actx.resume();
  const b=actx.createBuffer(1,1,22050),s=actx.createBufferSource();s.buffer=b;s.connect(actx.destination);s.start(0);}catch(e){}}
const SYNTH={click:[660,.05],choice_locked:[110,.12],tip_ding:[1320,.15],gurgle_small:[90,.2],gurgle_big:[60,.4],blowout_burst:[50,.6],cash_register:[990,.2],sting_good_end:[784,.5],sting_bad_end:[98,.6]};
function beep(f,d){if(!actx||META.muted)return;try{const o=actx.createOscillator(),g=actx.createGain();o.type="square";o.frequency.value=f;
 g.gain.setValueAtTime(.06,actx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+d);}catch(e){}}
const audioEls={};
function playFile(dir,name,loop){if(AUDIO_AVAILABLE.indexOf(name)<0)return false;try{
 let a=audioEls[name];if(!a){a=new Audio();const ogg=a.canPlayType("audio/ogg")?"ogg":"mp3";a.src="assets/"+dir+"/"+name+"."+ogg;a.loop=!!loop;a.onerror=()=>{};audioEls[name]=a;}
 a.currentTime=0;const p=a.play();if(p&&p.catch)p.catch(()=>{});return true;}catch(e){return false}}
function playSfx(name){if(!name||META.muted||!started)return;if(!playFile("sfx",name)){const s=SYNTH[name]||SYNTH.click;beep(s[0],s[1]);}}
function playMusic(name){if(curMusic===name)return;Object.keys(audioEls).forEach(k=>{if(k.startsWith("music_"))audioEls[k].pause();});curMusic=name;if(META.muted||!started||!name)return;playFile("music",name,true);}

// ---------- UI ----------
const $=id=>document.getElementById(id);
let st=null,toastTimer=null,toastQ=[],activeSince=null,lastResult=null,booted=false,weekLock=false;
function showNextToast(){const t=$("toast");clearTimeout(toastTimer);const n=toastQ.shift();if(!n){t.style.display="none";document.body.classList.remove("toastPad");return;}t.innerHTML=n[0];t.style.display="block";setTimeout(toastClear,0);toastTimer=setTimeout(showNextToast,n[1]);}
function toastClear(){const t=$("toast"),c=$("choices");if(t.style.display!=="block"){document.body.classList.remove("toastPad");return;}
 document.body.style.setProperty("--toastH",(t.offsetHeight+28)+"px");document.body.classList.add("toastPad");
 if(c&&c.children.length&&!$("app").classList.contains("is-hidden")){const tr=t.getBoundingClientRect(),cr=c.getBoundingClientRect();const over=cr.bottom-tr.top+8;if(over>0&&cr.top-over>0)window.scrollBy(0,over);}}
function toast(html,ms){toastQ.push([html,ms||2500]);if($("toast").style.display!=="block")showNextToast();}
function clearToasts(){toastQ=[];clearTimeout(toastTimer);const t=$("toast");if(t)t.style.display="none";document.body.classList.remove("toastPad");}
$("toast").addEventListener("click",showNextToast);
function shake(){const a=$("app");a.classList.remove("shake");void a.offsetWidth;a.classList.add("shake");}
function tokenName(key){const t=EP&&EP.tokens&&EP.tokens[key];if(t){for(let i=0;i<t.length;i++)if(st.P>=t[i][0])return t[i][1];return t[t.length-1][1];}
 if(key==="kevin")return st.P>=70?"Kevin Ray Jr.":st.P>=40?"Kevin Ray":"Kevin";return key;}
function boyName(){return (hashStr(st&&st.seed||"")&1)?"Youngster":"Boy";}
const CARD_TXT="A business card floats by: <em>Dale-It-Yourself Home Solutions — No Job Too Wrong.</em>";
function sub(t){const card=ART_AVAILABLE.indexOf("prop_dale_card_large.png")>=0?'<span class="dcard"><img src="assets/img/prop_dale_card_large.png" alt="">'+CARD_TXT+"</span>":'<span class="dcard">'+CARD_TXT+"</span>";
 return String(t).replace(/\{kevin\}/g,()=>tokenName("kevin")).replace(/\{boy\}/g,()=>boyName()).replace(/\{card\}/g,card);}
function plain(t){return sub(t).replace(/<[^>]+>/g,"");}
function screen(name){$("overlay").classList.toggle("is-hidden",name!=="title");$("select").classList.toggle("is-hidden",name!=="select");$("app").classList.toggle("is-hidden",name!=="game");window.scrollTo(0,0);}
function clockTick(){if(activeSince!==null&&st){const now=Date.now();st.elapsedMs+=now-activeSince;activeSince=now;}}
function clockStart(){if(activeSince===null)activeSince=Date.now();}
function clockStop(){clockTick();activeSince=null;}
document.addEventListener("visibilitychange",()=>{
 if(!st||!EP||$("app").classList.contains("is-hidden"))return;
 const sc=sceneById[st.scene];if(!sc||sc.end)return;
 if(document.hidden){clockStop();saveRun();}else clockStart();
});
function fmtTime(secs){const s=Math.max(0,secs|0);return Math.floor(s/60)+":"+(s%60<10?"0":"")+ (s%60);}
setInterval(()=>{if(!st||!EP||$("app").classList.contains("is-hidden"))return;const sc=sceneById[st.scene];if(!sc||sc.end)return;clockTick();drawFoot();},1000);
function sceneText(sc){let t=sc.text;if(sc.variants)for(let i=0;i<sc.variants.length;i++)if(meets(sc.variants[i].if,st)){t=sc.variants[i].text;break;}
 const pl=EP.patienceLeave;if(pl&&st.flags[pl.flag]&&!sc.end&&pl.sceneLine)t+='<br><em style="color:var(--muted)">'+pl.sceneLine+"</em>";return sub(t);}
function choiceLabel(c){const ph=pepperHook();if(ph&&st&&st.scene===ph.scene&&sceneById[st.scene]&&sceneById[st.scene].choices[ph.choice]===c)return sub(c.label)+(ph.label||" (Pepper Run 🌶)");const alts=c.labelAlt?[].concat(c.labelAlt):[];for(let i=0;i<alts.length;i++)if(alts[i]&&meets(alts[i].if,st))return alts[i].text;return c.label;}
function panelText(ps,p){if(!ps.hackLines)return p.text||"";
 const ls=(st.hackTips||[]).filter((v,i,a)=>a.indexOf(v)===i).map(k=>ps.hackLines[k]).filter(Boolean);
 if(!ls.length)return p.text||"";
 const j=ls.length>1?ls.slice(0,-1).join(", ")+", and "+ls[ls.length-1]:ls[0];
 return j.charAt(0).toUpperCase()+j.slice(1)+", and the whole house plays Dale's greatest hits at once. "+ls.map(function(){return "{card}";}).join(" ");}
function endingArtName(id){const sc=sceneById[id]||{};if(sc.card){const c=String(sc.card);return /\.png$/i.test(c)?c:c+".png";}return "card_"+id+".png";}
const KEVIN_SPR=[["kevin_t1.png",32],["kevin_t2.png",48],["kevin_t3.png",64]];
function kevinVisible(){const S=EP.stage||{};if(S.kevin===false)return false;if(S.kevinShowFlag&&st.flags[S.kevinShowFlag])return true;
 if(typeof S.kevinFrom==="number"){const sceneNum=id=>{const m=/^s(\d+)/i.exec(String(id));return !!(m&&+m[1]>=S.kevinFrom);};
  if(sceneNum(st.scene))return true;
  if(/^h/i.test(st.panel||st.scene)){for(let i=st.history.length-1;i>=0;i--){const id=st.history[i].split(":")[0];if(!/^h/i.test(id))return sceneNum(id);}}
  return false;}
 const hide=S.kevinHide||[];return hide.indexOf(st.scene)<0;}
function drawStage(sc){
 if(st.panel&&sceneById[st.panel]&&sc.end)sc=sceneById[st.panel];
 const S=EP.stage||{};const spr=EP.sprites||{};const stage=$("stage");const art=ART_AVAILABLE.length>0;
 const file=sc.end?endingArtName(st.scene):("bg_"+(sc.bg||"")+".png");
 const hasBg=ART_AVAILABLE.indexOf(file)>=0;stage.classList.toggle("art",art);stage.classList.toggle("nobg",!hasBg);
 $("water").style.transition=sc.end?"none":"";$("water").style.height=sc.end?"0%":Math.round(st.P*0.6)+"%";
 const k=$("kevin"),tier=st.P>=70?2:st.P>=40?1:0;
 const kspr=(spr.kevin||KEVIN_SPR)[tier];
 if(art){k.className="spr";k.style.backgroundImage="url(assets/img/"+kspr[0]+")";k.style.width=(kspr[1]/320*100)+"%";k.style.height="auto";k.style.aspectRatio="1";}
 else{k.className="";const sz=[30,46,64][tier];k.style.width=sz+"px";k.style.height=sz+"px";k.style.backgroundImage="";}
 k.style.display=!sc.end&&kevinVisible()?"block":"none";
 const pete=spr.pete||{idle:"pete_idle.png",work:"pete_work.png"};
 $("pete").style.display=art&&!sc.end?"block":"none";
 const working=(S.workScenes||[]).indexOf(st.scene)>=0;$("pete").classList.toggle("work",working);
 const pph=S.peteScene&&Object.hasOwn(S.peteScene,st.scene)?S.peteScene[st.scene]:null; // Ep5: single-frame phone poses per scene
 if(art)$("pete").style.backgroundImage="url(assets/img/"+(pph||(working?pete.work:pete.idle))+")";$("pete").style.backgroundSize=pph?"100% 100%":"";$("pete").style.animation=pph?"none":"";
 const npc=S.npc,ne=$("rhonda");
 if(art&&npc&&!sc.end&&npc.scenes.indexOf(st.scene)>=0&&!(npc.hideFlag&&st.flags[npc.hideFlag])){ne.style.display="block";ne.style.backgroundImage="url(assets/img/"+(spr.rhonda||npc.img)+")";}
 else ne.style.display="none";
 const panelArt=S.panelArt||[];const pid=st.panel||(panelArt.indexOf(st.scene)>=0?null:st.scene);
 const pr=S.props?S.props[pid]:null;const pe=$("prop");
 stage.classList.toggle("hasprop",!!pr);
 if(pe){if(pr&&!sc.end){pe.style.display="block";pe.style.backgroundImage="url(assets/img/"+pr[0]+")";pe.className="spr"+(pr[1]>1?" f2":"");pe.style.width=(pr[2]/320*100*1.6)+"%";pe.style.aspectRatio=pr[2]+"/"+pr[3];}else pe.style.display="none";}
 const dl=S.dale?S.dale[pid]:null;const de=$("dale");
 if(de){if(art&&dl&&!sc.end){de.style.display="block";de.style.backgroundImage="url(assets/img/"+dl+".png)";}else de.style.display="none";}
 const spritesOn=art&&!sc.end&&(!!pr||!!dl||ne.style.display==="block"||k.style.display==="block");stage.classList.toggle("tallart",!hasBg&&spritesOn);stage.classList.toggle("endcard",!!sc.end&&hasBg);
 stage.classList.toggle("cleanwater",S.water==="clean");let ovd=art&&!sc.end&&S.overlays&&Object.hasOwn(S.overlays,st.scene)?S.overlays[st.scene]:null;const ove=$("ov");if(!ovd&&art&&sc.end&&hasBg&&sc.cardOverlay)ovd=[sc.cardOverlay,0,0,320,180]; // end-card lettering layer
 // overlay: [file,x,y,w,h] or [file,x,y,w,h,frame,frames] (one frame of a horizontal strip), or {variants:[{if,ov}],ov} picked by flags/meters
 if(ovd&&!Array.isArray(ovd)){let pick=ovd.ov||null;(ovd.variants||[]).some(v=>{if(meets(v.if,st)){pick=v.ov;return true;}return false;});ovd=pick;}
 if(ovd){ove.style.display="block";ove.style.backgroundImage="url(assets/img/"+ovd[0]+")";const ofn=ovd[6]>1?ovd[6]:1,ofr=Math.max(0,Math.min(ofn-1,ovd[5]|0));ove.style.backgroundSize=(ofn*100)+"% 100%";ove.style.backgroundPosition=(ofn>1?ofr/(ofn-1)*100:0)+"% 0";ove.style.left=(ovd[1]/320*100)+"%";ove.style.top=(ovd[2]/180*100)+"%";ove.style.width=(ovd[3]/320*100)+"%";ove.style.height=(ovd[4]/180*100)+"%";}else ove.style.display="none";
 // decor: stage.decor[scene] = list of [file,x,y,w,h,frame,frames] (frame -1 on a 2-frame strip animates) or {if,ov}; extra set dressing behind the cast
 const dce=$("decor");if(dce){dce.innerHTML="";const dl2=art&&!sc.end&&S.decor&&Object.hasOwn(S.decor,st.scene)?S.decor[st.scene]:[];
  (Array.isArray(dl2)?dl2:[]).forEach(d=>{if(d&&!Array.isArray(d)){if(!meets(d.if,st))return;d=d.ov;}if(!Array.isArray(d))return;
   const el=document.createElement("div");el.className="dc";const fn=d[6]>1?d[6]:1,fr=d[5]|0;el.style.backgroundImage="url(assets/img/"+d[0]+")";el.style.backgroundSize=(fn*100)+"% 100%";
   if(fn===2&&fr<0)el.classList.add("anim");else if(fn===4&&fr<0)el.classList.add("anim4");else el.style.backgroundPosition=(fn>1?Math.max(0,Math.min(fn-1,fr))/(fn-1)*100:0)+"% 0";
   el.style.left=(d[1]/320*100)+"%";el.style.top=(d[2]/180*100)+"%";el.style.width=(d[3]/320*100)+"%";el.style.height=(d[4]/180*100)+"%";dce.appendChild(el);});}
 $("who").classList.toggle("low",!sc.end&&(!!ovd||(S.whoLow||[]).indexOf(sc.bg)>=0));
 const ps=st.panel?sceneById[st.panel]:sc;const ptxt=ps&&(ps.entryPanel&&st.panel?ps.entryPanel.text:panelText(ps,ps))||"";
 const dc=$("dcardSpr");
 if(dc){const show=art&&!sc.end&&String(ptxt).indexOf("{card}")>=0;dc.style.display=show?"block":"none";if(show&&spr.card)dc.style.backgroundImage="url(assets/img/"+spr.card+")";}
 $("stageLabel").textContent=sc.end?"":(typeof sc.caption==="string"?sc.caption:(EP.bgCaptions&&typeof EP.bgCaptions[sc.bg]==="string"?EP.bgCaptions[sc.bg]:(sc.bg||"").replace(/_/g," ")));$("who").textContent=sc.who?plain(sc.who):"";
 const et=$("endtip");et.style.display=sc.end?"flex":"none";et.textContent=sc.end?"Pro Tip: "+(sc.endTip||""):"";
 let img=stage.querySelector("img.bg");
 if(hasBg){if(!img){img=document.createElement("img");img.className="bg";img.alt="";img.onerror=function(){const f=(img.getAttribute("src")||"").split("/").pop();const ix=ART_AVAILABLE.indexOf(f);if(ix>=0)ART_AVAILABLE.splice(ix,1);img.remove();};stage.insertBefore(img,stage.firstChild);}if(img.getAttribute("src")!==artPath(file))img.src=artPath(file);}
 else if(img)img.remove();
 // bg strips: stage.bgFrames[bg]=n (n frames side by side); stage.bgFrame[scene]=frame or {if,frame}
 if(img){const bn=!sc.end&&S.bgFrames?S.bgFrames[sc.bg]|0:0;if(bn>1){let f=0;const bf=S.bgFrame?S.bgFrame[st.scene]:null;if(typeof bf==="number")f=bf;else if(bf&&meets(bf.if,st))f=bf.frame|0;f=Math.max(0,Math.min(bn-1,f));
  img.style.width=(bn*100)+"%";img.style.objectFit="fill";img.style.left=(-f*100)+"%";img.style.right="auto";}else{img.style.width="";img.style.objectFit="";img.style.left="";img.style.right="";}}
}
function drawFoot(){if(!st||!EP)return;const secs=Math.round(((st.elapsedMs||0)+(st.penaltyMs||0))/1000);
 $("foot").textContent="Ep "+EP.week+" · "+fmtTime(secs)+" · P "+st.P+" · R "+st.R+" · T "+st.T+" · Endings "+endingsFound().length+"/"+ENDINGS.length;
 if(DEBUG){const d=$("debug");d.style.display="block";d.textContent=EP.id+" "+st.scene+" seed:"+st.seed+" P"+st.P+" R"+st.R+" T"+st.T+" hacks:"+(st.dalehacks||0)+" flags:"+Object.keys(st.flags).filter(f=>st.flags[f]).join(",");}}
function drawMeters(){if(!st)return;$("mP").firstElementChild.style.width=st.P+"%";$("mR").firstElementChild.style.width=st.R+"%";$("mT").firstElementChild.style.width=st.T+"%";
 const L=Object.assign({P:"Pressure",R:"Reputation",T:"Patience"},EP.meterLabels||{});$("lP").textContent=L.P;$("lR").textContent=L.R;$("lT").textContent=L.T;drawFoot();}
function render(){
 const sc=sceneById[st.scene];if(!sc)return;drawMeters();drawStage(sc);$("epTitle").textContent="Ep "+EP.week+": "+EP.title;
 playMusic(sc.end?null:(st.P>=70?"music_tension":"music_main"));
 const box=$("choices");box.innerHTML="";
 document.body.classList.toggle("panelOpen",!!(st.panel&&sceneById[st.panel]));
 $("app").classList.toggle("compact",$("stage").classList.contains("nobg")&&!$("stage").classList.contains("tallart"));
 if(st.panel&&sceneById[st.panel]){const ps=sceneById[st.panel],p=ps.entryPanel||ps;
  $("text").innerHTML='<div class="panel"><h3>'+sub(p.who||ps.who||"")+"</h3>"+sub(panelText(ps,p))+"</div>";
  $("who").textContent=plain(p.who||ps.who||"");
  const b=document.createElement("button");b.type="button";b.className="big";b.id="panelContinue";b.textContent="Continue";
  b.onclick=()=>{const ended=sceneById[st.scene]&&sceneById[st.scene].end;st.panel=null;if(ended)endSting();saveRun();render();window.scrollTo(0,0);};box.appendChild(b);return;}
 if(sc.cutscene&&sc.next&&!(sc.choices&&sc.choices.length)){ $("text").innerHTML=sceneText(sc);
  const b=document.createElement("button");b.type="button";b.className="big";b.id="panelContinue";b.textContent="Continue";
  b.onclick=()=>{const ev=[];enterScene(st,sc.next,ev);present(ev);const s2=sceneById[st.scene];
   if(s2&&s2.end){clockStop();finishRun(s2);playSfx(s2.fail?"blowout_burst":s2.good?"sting_good_end":"sting_bad_end");}saveRun();render();};box.appendChild(b);return;}
 if(sc.end)return renderEnd(sc);
 $("text").innerHTML=sceneText(sc);
 sc.choices.forEach((c,i)=>{if(c.showIf&&!meets(c.showIf,st))return;const b=document.createElement("button");b.type="button";b.className="choice";const ok=meets(c.requires,st);
  b.dataset.i=i;b.innerHTML='<span class="k">'+(box.children.length+1)+".</span>"+(ok?"":"🔒 ")+sub(choiceLabel(c))+(ok?"":'<span class="hint">'+(c.lockHintAlt&&meets(c.lockHintAlt.if,st)?c.lockHintAlt.text:c.lockHint||"")+"</span>");
  if(!ok){b.classList.add("locked");b.setAttribute("aria-disabled","true");b.onclick=()=>playSfx("choice_locked");}
  else b.onclick=()=>choose(i);box.appendChild(b);});}
function present(ev){const msgs=[];ev.forEach(e=>{
 if((e.type==="delta"&&(Math.abs(e.dP)>=10||e.dR<=-8))||e.type==="shake")shake();
 if(e.type==="tip"){msgs.push('<img class="toasticon" src="assets/img/tip_badge.png" alt=""><b>Pete says:</b> '+(TIPS[e.tip]||""));setTimeout(()=>playSfx("tip_ding"),150);}
 if(e.type==="note"||e.type==="event")msgs.push(sub(e.text));
 if(e.type==="santo")msgs.push(sub(e.text));// own type: never suppresses the scene's random event roll
 if(e.type==="drift"){msgs.push(sub(EP.driftText||"(+Pressure)"));playSfx("gurgle_small");}});
 clearToasts();msgs.forEach(m=>toast(m,m.indexOf("Pete says")>=0?4500:2200));}
function choose(i,pr){const sc=sceneById[st.scene];let c=sc&&sc.choices&&sc.choices[i];if(!c||!meets(c.requires,st)||(c.showIf&&!meets(c.showIf,st)))return;
 if(pepperActive&&pr===undefined)return;// no choice taps/keys while the minigame is open
 if(pr===undefined&&isPepperChoice(i)&&window.PepperRun){const tok=++pepperTok,sc0=st.scene;pepperActive=true;clockTick();
  const ok=window.PepperRun.start({merchLink:TITLE_MERCH_LINK,level:pepperHook().level,muted:!!(META&&META.muted),forceResult:params.get("pepperResult"),onDone:r=>{if(tok!==pepperTok||!pepperActive)return;pepperActive=false;if(!st||st.scene!==sc0)return;choose(i,r||{skipped:true});}});
  if(ok===false)pepperActive=false;return;}
 if(pr){pepperAdj=pr;if(pr.fullClear){st.pepperJar=(st.pepperJar||0)+1;if(!DEBUG){META.pepperJar=(META.pepperJar||0)+1;saveMeta();}}window.__pepperLast=pr;}
 clockTick();const ev=[];applyChoice(st,c,ev,i);playSfx(c.sfx||"click");present(ev);
 const s2=sceneById[st.scene];
 if(s2&&s2.end){clockStop();finishRun(s2);if(!st.panel)endSting();}
 saveRun();render();window.scrollTo(0,0);}
function endSting(){const s2=sceneById[st.scene];if(s2&&s2.end)playSfx(s2.fail||st.scene==="endBlowout"?"blowout_burst":s2.good?"sting_good_end":"sting_bad_end");}
function finishRun(end){const scored=scoreOf(st);let newBest=false;
 let badgeNew=false;if(!DEBUG&&!VERIFY){const f=endingsFound();if(f.indexOf(st.scene)<0){f.push(st.scene);lsSet(K.endings(EP.id),JSON.stringify(f));}badgeNew=recordEnding(EP.id,st.scene);track("ending",EP.id+"/"+st.scene);
  const b=bestOf(EP.id);if(!b||scored.score>b.score){newBest=true;lsSet(K.best(EP.id),JSON.stringify({score:scored.score,timeMs:(st.elapsedMs||0)+(st.penaltyMs||0),ending:st.scene,date:today()}));}
  if(st.collected&&EP.collectible){const sh=shelf();if(!sh[EP.collectible.id]){sh[EP.collectible.id]={ep:EP.id,date:today()};lsSet(K.shelf,JSON.stringify(sh));}}}
 if(st.flags.blessed&&!DEBUG&&!VERIFY){META.santo=(META.santo||0)+1;saveMeta();}
 lastResult={ep:EP.id,week:EP.week,title:EP.title,ending:st.scene,tag:end.tag,correct:st.correct,total:st.total,score:scored.score,secs:scored.secs,seed:st.seed,collected:!!st.collected,newBest:newBest,badgeNew:badgeNew};}
function renderEnd(sc){
 if(!lastResult||lastResult.ending!==st.scene||lastResult.seed!==st.seed){const r=scoreOf(st);lastResult={ep:EP.id,week:EP.week,title:EP.title,ending:st.scene,tag:sc.tag,correct:st.correct,total:st.total,score:r.score,secs:r.secs,seed:st.seed,collected:!!st.collected,newBest:false};}
 const R=lastResult;
 const uniq=a=>a.filter((v,i,b)=>TIPS[v]&&b.indexOf(v)===i),seen=uniq(st.seenTips||[]);
 // Cap 3. Tips keep insertion order, so a seen tip (h5 flatTee) that does not fit
 // replaces the most recently added non-seen tip. It is never a 4th tip. Tips in `keep` (hack tips on a
 // hackRecap ending) are never replaced: if every slot is kept, the seen tip is left out.
 const cap=(a,keep)=>{keep=keep||[];let out=uniq(a).slice(0,3);seen.forEach(k=>{if(out.indexOf(k)>=0)return;if(out.length<3){out.push(k);return;}
  for(let i=out.length-1;i>=0;i--)if(seen.indexOf(out[i])<0&&keep.indexOf(out[i])<0){out[i]=k;break;}});return out;};
 let rec;
 if(sc.hackRecap&&st.hackTips&&st.hackTips.length)rec=cap(st.hackTips,st.hackTips).map(k=>"<li>"+TIPS[k]+"</li>");
 else{const w=uniq(st.tipsWrong||[]);rec=w.length?cap(w).map(k=>"<li>"+TIPS[k]+"</li>"):[];}
 if(!rec.length&&!sc.hackRecap)rec=cap(st.tipsRight||[]).map(k=>"<li>"+(st.tipsRight.indexOf(k)>=0?"✅ ":"")+TIPS[k]+"</li>");
 rec.push("<li><b>"+(sc.endTip||"")+"</b></li>");
 let text=sc.text||"";if(sc.variants)for(let i=0;i<sc.variants.length;i++)if(meets(sc.variants[i].if,st)){text=sc.variants[i].text;break;}
 const col=EP.collectible?'<span>'+EP.collectible.name+" <b>"+(R.collected?"✔ found":"—")+"</b></span>":"";
 $("text").innerHTML='<div class="end">'+(st.flags.blessed?'<div class="santoStamp" id="santoStamp">Blessed</div>':"")+'<h2>'+sc.tag+"</h2>"+(sc.cardTitle?'<p style="color:var(--warn);font-weight:700">'+sc.cardTitle+"</p>":"")+"<p>"+sub(text)+"</p>"+(sc.whyLicensed?'<p class="why"><b>Why hire licensed:</b> '+sc.whyLicensed+"</p>":"")+'<div class="stats"><span>Correct calls <b>'+R.correct+"/"+R.total+'</b></span><span>Score <b>'+R.score+"</b>"+(R.newBest?" <i>New best!</i>":"")+'</span>'+(CHALLENGE&&CHALLENGE.ep===R.ep?'<span>Challenge <b>'+(R.score>CHALLENGE.beat?'Beat '+CHALLENGE.beat+'!':'Short of '+CHALLENGE.beat+' by '+(CHALLENGE.beat-R.score))+'</b></span>':'')+'<span>Time <b>'+fmtTime(R.secs)+'</b></span><span>Seed <b>'+R.seed+"</b></span>"+col+(st.flags.blessed||META.santo?'<span>Petin Log: El Santo sightings <b>'+(META.santo||0)+"</b></span>":"")+'</div><h3>Pro Tips from tonight</h3><ul>'+rec.join("")+"</ul></div>";
 const box=$("choices");
 const mk=(t,cls,fn,id)=>{const b=document.createElement("button");b.type="button";b.className="big"+(cls?" "+cls:"");b.textContent=t;if(id)b.id=id;b.onclick=fn;box.appendChild(b);return b;};
 mk("Share score card","",shareCard,"shareCard");
 mk("Download result card","alt",downloadCard,"dlCard");
 // merch links: page buttons only, never drawn into the downloaded card image
 const ml=(t,cls,id,href)=>{const a=document.createElement("a");a.href=href;a.target="_blank";a.rel="noopener";a.className=cls;a.id=id;a.textContent=t;box.appendChild(a);return a;};
 ml("Get the Merch","big merch","merchBtn",merchUrl(st.scene)).addEventListener("click",e=>{track("merch",st.scene);gcStoreClick(e.currentTarget);});ml("Follow Pipe Petin","followLink","followLink",FOLLOW_LINK);
 mk("Challenge a friend","alt",shareChallenge,"challengeBtn");
 mk("Copy text","alt",copyResult,"copyText");
 mk("Share on X","alt",()=>shareEnding(EP.id==="ep00"?'I got the "'+sc.tag+'" ending in TRAP FULL. Kevin says hi. 🌶️🔧':'I got the "'+sc.tag+'" ending in TRAP FULL Ep '+EP.week+": "+EP.title+". Score "+R.score+"."),"shareX");
 mk("Replay","alt",()=>startEpisode(EP.id,true),"replay");
 mk("Episode select","alt",()=>openSelect(),"toSelect");
 const cnt=document.createElement("div");cnt.className="cnt";cnt.textContent="Endings found: "+endingsFound().length+"/"+ENDINGS.length;box.appendChild(cnt);
 if(!DEBUG&&!VERIFY){const ts=trackerStats();const tr=document.createElement("div");tr.className="cnt tracker";tr.id="trackerLine";
  tr.textContent="All released episodes: "+ts.found+"/"+ts.total+" endings"+(ts.badge?" · 🏅 Certified Apprentice":" · find them all to earn Certified Apprentice");box.appendChild(tr);
  if(ts.badge){const bd=document.createElement("div");bd.className="badgeCard";bd.id="apprenticeBadge";bd.innerHTML="<b>🏅 Certified Apprentice</b><br>"+(R.badgeNew?"New! ":"")+"Every released ending found"+(isDay(ts.badge.date)?" ("+ts.badge.date+").":".")+(APPRENTICE_REWARD&&APPRENTICE_REWARD.text?" "+APPRENTICE_REWARD.text:" Reward: coming soon.");box.appendChild(bd);}}
 primeCard();}
function resultText(){const R=lastResult;return "TRAP FULL Ep "+R.week+": "+R.title+" — "+R.tag+". Correct calls "+R.correct+"/"+R.total+", score "+R.score+", time "+fmtTime(R.secs)+", seed "+R.seed+". "+GAME_URL;}
function copyResult(){const t=resultText();const done=()=>toast("Copied.");
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,()=>toast("Copy this: "+t,6000));else toast("Copy this: "+t,6000);}
function fitFont(g,text,maxW,base,weight){let size=base;g.font=(weight||"bold")+" "+size+"px sans-serif";
 while(size>16&&g.measureText(text).width>maxW){size-=2;g.font=(weight||"bold")+" "+size+"px sans-serif";}return size;}
function paintCardLines(g,x,y,maxW){const R=lastResult;const title="Ep "+R.week+": "+R.title;
 g.fillStyle="#d7c07a";fitFont(g,title,maxW-280,34,"bold");g.fillText(title,x,y);
 g.font="bold 22px sans-serif";g.fillText("Pipe Petin · TRAP FULL",x+maxW-g.measureText("Pipe Petin · TRAP FULL").width,y);
 g.fillStyle="#e2a53a";fitFont(g,R.tag,maxW,48,"bold");g.fillText(R.tag,x,y+58);
 g.fillStyle="#f3e6c8";g.font="28px sans-serif";
 const line2="Correct calls "+R.correct+"/"+R.total+"    Score "+R.score+(R.newBest?"    New best!":"");
 g.fillText(line2,x,y+108);
 const col=R.collected&&EP.collectible?"    ✔ "+EP.collectible.name:"";
 g.fillText("Time "+fmtTime(R.secs)+"    Seed "+R.seed+col,x,y+148);
 g.fillStyle="#a89878";g.font="20px sans-serif";
 const tip="Code tip: "+(TIPS[EP.codeTip]||"");wrapText(g,tip,x,y+188,maxW,26,2);
 g.fillStyle="#d7c07a";g.font="22px sans-serif";g.fillText("Endings found "+endingsFound().length+"/"+ENDINGS.length+"   ·   Play free: jimmdunc-hub.github.io/trap-full",x,y+290);}
function wrapText(g,text,x,y,maxW,lineH,maxLines){const words=String(text).split(" ");let line="",n=0;
 for(let i=0;i<words.length;i++){const t=line?line+" "+words[i]:words[i];
  if(g.measureText(t).width>maxW&&line){g.fillText(n===maxLines-1?line+"…":line,x,y);y+=lineH;n++;line=words[i];if(n>=maxLines)return;}
  else line=t;}
 if(line&&n<maxLines)g.fillText(line,x,y);}
function cardWindow(){const w=(EP.resultFrame&&EP.resultFrame.window)||[42,42,701,413];
 // window is the transparent art box as corners [x1,y1,x2,y2] (inclusive), not x,y,width,height
 return {x:w[0],y:w[1],w:w[2]-w[0]+1,h:w[3]-w[1]+1};}
function paintFramedCard(g,icon){const R=lastResult;
 // right panel (744,39)-(1164,420), bars (30,447)-(1164,534) and (30,561)-(1164,636) on result_frame_1200x675.png
 const x=764,maxW=380;g.textBaseline="alphabetic";
 g.fillStyle="#d7c07a";g.font="bold 22px sans-serif";g.fillText("Pipe Petin · TRAP FULL",x,82);
 g.fillStyle="#f3e6c8";fitFont(g,"Ep "+R.week+": "+R.title,maxW,30,"bold");g.fillText("Ep "+R.week+": "+R.title,x,128);
 g.fillStyle="#e2a53a";fitFont(g,R.tag,maxW,46,"bold");g.fillText(R.tag,x,192);
 g.fillStyle="#f3e6c8";g.font="26px sans-serif";
 g.fillText("Correct calls "+R.correct+"/"+R.total,x,252);
 g.fillText("Score "+R.score+(R.newBest?"  · New best!":""),x,292);
 g.fillText("Time "+fmtTime(R.secs),x,332);g.fillText("Seed "+R.seed,x,372);
 if(R.collected&&EP.collectible){g.fillStyle="#d7c07a";g.font="20px sans-serif";g.fillText("✔ "+EP.collectible.name,x,404);if(icon)g.drawImage(icon,1100,372,44,44);}
 g.fillStyle="#d7c07a";g.font="19px sans-serif";wrapText(g,"Code tip: "+(TIPS[EP.codeTip]||""),52,474,1092,25,3);
 g.fillStyle="#a89878";g.font="20px sans-serif";g.fillText("Endings found "+endingsFound().length+"/"+ENDINGS.length+"   ·   Play free: jimmdunc-hub.github.io/trap-full",52,606);}
function renderCard(frame,endingArt,icon){const c=document.createElement("canvas");c.width=1200;c.height=675;const g=c.getContext("2d");g.imageSmoothingEnabled=false;
 if(frame){const W=cardWindow();g.fillStyle="#12100c";g.fillRect(W.x,W.y,W.w,W.h);
  if(endingArt){const iw=endingArt.naturalWidth||endingArt.width,ih=endingArt.naturalHeight||endingArt.height;
   // Ending cards carry a dark caption band in their bottom third (for the stage's Pro Tip); it is always cropped off.
   // Default artFit "cover": the rest is center-cropped to fill the window. The ending's cardX (left edge in art pixels)
   // or resultFrame.artPos (0 = left .. 1 = right) picks the crop so the main character stays in frame.
   // artFit:"contain" letterboxes instead.
   const RF=EP.resultFrame||{};const band=typeof RF.artBand==="number"?Math.max(0,Math.min(.5,RF.artBand)):1/3;
   const sh=Math.round(ih*(1-band));const endSc=sceneById[lastResult.ending]||{};
   const fit=typeof endSc.artFit==="string"?endSc.artFit:RF.artFit;if(fit!=="contain"){let sw=Math.round(sh*W.w/W.h),h2=sh,sx=0;if(sw>iw){sw=iw;h2=Math.round(iw*W.h/W.w);}
    const room=iw-sw;const pos=typeof RF.artPos==="number"?RF.artPos:.5;
    sx=typeof endSc.cardX==="number"?endSc.cardX:Math.round(room*pos);sx=Math.max(0,Math.min(room,sx));
    g.drawImage(endingArt,sx,0,sw,h2,W.x,W.y,W.w,W.h);}
   else{const dh=Math.round(W.w*sh/iw);g.drawImage(endingArt,0,0,iw,sh,W.x,W.y+Math.round((W.h-dh)/2),W.w,dh);}}
  g.drawImage(frame,0,0,1200,675);paintFramedCard(g,icon);}
 else{g.fillStyle="#12100c";g.fillRect(0,0,1200,675);g.strokeStyle="#d7c07a";g.lineWidth=8;g.strokeRect(24,24,1152,627);paintCardLines(g,64,160,1072);
  if(icon)g.drawImage(icon,1080,96,64,64);}
 return c;}
function canvasTainted(c){try{c.toDataURL();return false;}catch(e){return true;}}
function loadOptionalImage(src,done){if(!src)return done(null);const im=new Image();im.onload=()=>done(im);im.onerror=()=>done(null);im.src=src;}
// Lettering overlays (Ep5): base art + same-size transparent text layer, flattened for the share card.
function loadComposite(src,ovSrc,done){if(!ovSrc)return loadOptionalImage(src,done);loadOptionalImage(src,b=>{if(!b)return done(null);loadOptionalImage(ovSrc,o=>{if(!o)return done(b);
 const c=document.createElement("canvas");c.width=b.naturalWidth;c.height=b.naturalHeight;const g=c.getContext("2d");g.imageSmoothingEnabled=false;g.drawImage(b,0,0);g.drawImage(o,0,0,c.width,c.height);done(c);});});}
let preparedCard=null;
function primeCard(){if(!lastResult)return;const pc=preparedCard={endImg:null,icon:null,pending:2,waiters:[]};const fin=()=>{if(--pc.pending<=0){const w=pc.waiters.splice(0);w.forEach(f=>f());}};
 const endName=endingArtName(lastResult.ending);
 const endSrc=ART_AVAILABLE.indexOf(endName)>=0?artPath(endName):null;
 const iconName=lastResult.collected&&EP.collectible&&EP.collectible.sprite?EP.collectible.sprite+".png":null;
 const endOv=(sceneById[lastResult.ending]||{}).cardOverlay,icOv=EP.collectible&&EP.collectible.overlay;
 loadComposite(endSrc,endSrc&&endOv?artPath(endOv):null,im=>{pc.endImg=im;fin();});
 loadComposite(iconName?"assets/img/"+iconName:null,iconName&&icOv?"assets/img/"+icOv:null,im=>{pc.icon=im;fin();});}
// Wait (max 3 s) for the frame and the ending art so an early tap still gets a card with art.
function cardWhenReady(fn){let done=false;const go=()=>{if(!done){done=true;fn();}};setTimeout(go,3000);
 const fr=$("resultFrameImg");const frameP=new Promise(r=>{if(!fr||!fr.getAttribute("src")||fr.complete)return r();fr.addEventListener("load",r,{once:true});fr.addEventListener("error",r,{once:true});});
 const artP=new Promise(r=>{const pc=preparedCard;if(!pc||pc.pending<=0)return r();pc.waiters.push(r);});
 Promise.all([frameP,artP]).then(go);}
function buildCardSync(){const frameEl=$("resultFrameImg");
 const frameOk=frameEl&&frameEl.complete&&frameEl.naturalWidth>0&&!frameEl.dataset.failed?frameEl:null;
 const endName=endingArtName(lastResult.ending);
 const staged=document.querySelector("#stage img.bg");
 const stagedOk=staged&&staged.complete&&staged.naturalWidth>0&&(staged.getAttribute("src")||"").indexOf(endName)>=0?staged:null;
 const endImg=(preparedCard&&preparedCard.endImg)||stagedOk;
 const icon=preparedCard&&preparedCard.icon;
 let c=renderCard(frameOk,endImg,icon||null);
 if(canvasTainted(c))c=renderCard(null,null,null);
 return c;}
let cardBlobUrl="";
function revokeCardBlob(){if(cardBlobUrl){try{URL.revokeObjectURL(cardBlobUrl);}catch(e){}cardBlobUrl="";}}
function pngBlob(canvas){let data="";try{data=canvas.toDataURL("image/png");}catch(e){return null;}
 const comma=data.indexOf(",");if(comma<0)return null;
 try{const bin=atob(data.slice(comma+1));const bytes=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new Blob([bytes],{type:"image/png"});}catch(e){return null;}}
function showCardSheet(blob){let sheet=$("cardSave");
 if(!sheet){sheet=document.createElement("div");sheet.id="cardSave";
  sheet.innerHTML='<p id="cardSaveMsg"></p><img id="cardSaveImg" alt="Your TRAP FULL result card"><button type="button" class="big" id="cardSaveClose">Close</button>';
  document.body.appendChild(sheet);sheet.querySelector("#cardSaveClose").onclick=function(){sheet.classList.add("is-hidden");};}
 sheet.classList.remove("is-hidden");
 revokeCardBlob();
 let url="";if(blob){try{cardBlobUrl=URL.createObjectURL(blob);url=cardBlobUrl;}catch(e){url="";}}
 sheet.querySelector("#cardSaveImg").src=url;
 sheet.querySelector("#cardSaveMsg").textContent=url?"If the file doesn't download, long-press the card to save it.":"Couldn't build the result card.";
 return url;}
function downloadCard(){if(!lastResult)return;cardWhenReady(downloadCardNow);}
function downloadCardNow(){if(!lastResult)return;
 // Blob URL, not a data: link: a data: download can navigate an in-app browser off the game.
 // The click targets a hidden iframe, so a webview that ignores `download` stays on this page.
 const c=buildCardSync();const name="trapfull-"+lastResult.ep+"-"+lastResult.seed+".png";
 const url=showCardSheet(pngBlob(c));window.__lastCard={w:c.width,h:c.height,name:name};
 if(!url)return;
 try{let frame=$("cardDownloadFrame");
  if(!frame){frame=document.createElement("iframe");frame.id="cardDownloadFrame";frame.name="cardDownloadFrame";frame.title="";frame.setAttribute("aria-hidden","true");frame.tabIndex=-1;frame.style.cssText="position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none";document.body.appendChild(frame);}
  const a=document.createElement("a");a.href=url;a.download=name;a.target="cardDownloadFrame";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();}catch(e){}}
function shareCard(){if(!lastResult)return;track("share","card/"+lastResult.ending);cardWhenReady(()=>{const c=buildCardSync();const blob=pngBlob(c);
 const name="trapfull-"+lastResult.ep+"-"+lastResult.seed+".png";let file=null;try{file=blob?new File([blob],name,{type:"image/png"}):null;}catch(e){file=null;}
 const text='I got "'+lastResult.tag+'" in TRAP FULL. Score '+lastResult.score+". Beat it:";
 if(file&&navigator.canShare&&navigator.share){let ok=false;try{ok=navigator.canShare({files:[file]});}catch(e){ok=false;}
  if(ok){navigator.share({files:[file],title:"TRAP FULL",text:text,url:challengeUrl(lastResult)}).then(()=>{window.__lastShare="files";}).catch(e=>{if(!e||e.name!=="AbortError")downloadCardNow();});return;}}
 window.__lastShare="download";downloadCardNow();});}
function shareChallenge(){if(!lastResult)return;const url=challengeUrl(lastResult);const text="Beat my "+lastResult.score+" on this call in TRAP FULL:";track("share","challenge/"+lastResult.ending);window.__lastChallengeUrl=url;
 if(navigator.share){navigator.share({title:"TRAP FULL challenge",text:text,url:url}).catch(e=>{if(!e||e.name!=="AbortError")copyLink();});return;}copyLink();
 function copyLink(){const done=()=>toast("Challenge link copied.");if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(done,()=>toast("Send this link: "+url,8000));else toast("Send this link: "+url,8000);}}
function shareEnding(endingText,kind){track("share",(kind||"x")+"/"+(lastResult?lastResult.ending:""));const text=String(endingText||"")+" "+GAME_URL;
 const url="https://x.com/intent/post?text="+encodeURIComponent(text);
 if(navigator.share){navigator.share({text:String(endingText||""),url:GAME_URL}).catch(e=>{if(e&&e.name!=="AbortError")openOnce(url,text);});return url;}
 openOnce(url,text);return url;}
function openOnce(url,text){let ok=false;try{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";document.body.appendChild(a);a.click();a.remove();ok=true;}catch(e){}
 if(!ok){const done=()=>toast("Copied! Paste it into a post on X.");if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,()=>toast("Copy this: "+text,6000));else toast("Copy this: "+text,6000);}}
window.shareEnding=shareEnding;

// ---------- screens ----------
function startEpisode(id,fresh){if(!epOf(id))return;
 if(st&&EP&&EP.id!==id){clockTick();saveRun();}
 clockStop();clearToasts();lastResult=null;useEpisode(id);
 if(fresh&&!DEBUG)lsDel(K.run(id));
 const saved=(fresh||DEBUG)?null:loadRun(id);
 if(saved){st=cloneSt(saved);
  if(st.P>=100&&EP.failEnding&&sceneById[st.scene]&&!sceneById[st.scene].end){st.panel=null;const ev=[];enterScene(st,EP.failEnding,ev);const s2=sceneById[st.scene];if(s2&&s2.end){finishRun(s2);endSting();}}}
 else{st=freshState(seedFromQuery()||newSeed());
  if(params.get("dev")==="1"&&params.get("santo")==="1")st.forceEv=["santo"];// El Santo test entry (dev only)
  if(DEBUG){["P","R","T"].forEach(k=>{if(params.get(k)!==null&&params.get(k)!=="")st[k]=clamp(+params.get(k));});
   if(params.get("dalehacks")!==null)st.dalehacks=Math.max(0,parseInt(params.get("dalehacks"),10)||0);}
  const want=params.get("scene");const ev=[];const sc0=DEBUG&&sceneById[want]&&!sceneById[want].end?want:st.scene;
  enterScene(st,sc0,ev);present(ev);}
 META.played[id]=true;META.lastEpisode=id;saveMeta();saveRun();screen("game");clockStart();render();if(!DEBUG&&!VERIFY)track("play",id);}
function showTitle(){weekLock=false;screen("title");const n=newestReal();const box=$("codeTip");box.textContent="";
 if(n){const ep=epOf(n.id);const tips=Object.assign({},GLOBAL_TIPS,ep.tips||{});
  const b=document.createElement("b");b.textContent="Weekly code tip (Ep "+ep.week+")";box.appendChild(b);box.appendChild(document.createElement("br"));
  box.appendChild(document.createTextNode(tips[ep.codeTip]||""));
  const want=params.get("ep");const playId=want&&canPlay(want)?want:n.id;const run=!DEBUG&&loadRun(playId);
  $("btnWeek").textContent=want&&canPlay(want)?(run?"Continue: ":"Play: ")+"Ep "+epOf(want).week+": "+epOf(want).title:(run?"Continue this week's call":"This week's call");}}
function showSelect(){screen("select");const g=$("epGrid");g.innerHTML="";const newest=newestReal();
 episodeList().forEach(e=>{const ep=epOf(e.id);const run=!DEBUG&&loadRun(e.id);const best=bestOf(e.id);const found=endingsFound(e.id).length;const N=Object.keys(ep.endings||{}).length;
  const hasCol=!!ep.collectible;const col=hasCol?(shelf()[ep.collectible.id]?"✔":"—"):"—";
  const d=document.createElement("div");d.className="epcard";d.dataset.ep=e.id;
  const base=ep.thumb?String(ep.thumb).split("/").pop():"";
  if(base&&ART_AVAILABLE.indexOf(base)>=0){const im=document.createElement("img");im.src=ep.thumb;im.alt="";d.appendChild(im);}
  else{const ph=document.createElement("div");ph.className="ph";ph.textContent="Ep "+ep.week;d.appendChild(ph);}
  const meta=document.createElement("div");meta.className="meta";
  const title=document.createElement("div");const strong=document.createElement("b");strong.textContent="Ep "+ep.week+": "+ep.title;title.appendChild(strong);
  if(ep.stub){const badge=document.createElement("span");badge.className="test";badge.textContent="TEST";title.appendChild(badge);}
  else if(newest&&e.id===newest.id&&!META.played[e.id]){const badge=document.createElement("span");badge.className="new";badge.textContent="NEW";title.appendChild(badge);}
  meta.appendChild(title);
  const line=document.createElement("div");line.textContent="Best score: "+(best?best.score:"—")+" · Best time: "+(best?fmtTime(Math.round(best.timeMs/1000)):"—");meta.appendChild(line);
  const line2=document.createElement("div");line2.appendChild(document.createTextNode("Endings: "));
  const foundEl=document.createElement("span");foundEl.className="found";foundEl.textContent=found+"/"+N;line2.appendChild(foundEl);
  line2.appendChild(document.createTextNode(" · Collectible: "));
  const colEl=document.createElement("span");colEl.className="col";colEl.textContent=col;line2.appendChild(colEl);meta.appendChild(line2);d.appendChild(meta);
  const bt=document.createElement("div");bt.className="btns";
  const p=document.createElement("button");p.type="button";p.className="big";p.textContent=run?"Continue":"Play";
  p.onclick=()=>{started=true;unlockAudio();startEpisode(e.id,false);};bt.appendChild(p);
  if(run){const nn=document.createElement("button");nn.type="button";nn.className="big alt";nn.textContent="New call";
   nn.onclick=()=>{started=true;unlockAudio();startEpisode(e.id,true);};bt.appendChild(nn);}
  d.appendChild(bt);g.appendChild(d);});}
function startWeek(){if(!booted||weekLock)return;if(started&&$("overlay").classList.contains("is-hidden"))return;weekLock=true;started=true;unlockAudio();
 const want=params.get("ep");const id=want&&canPlay(want)?want:(newestReal()&&newestReal().id);if(id)startEpisode(id,!!DEBUG||!!(CHALLENGE&&CHALLENGE.seed&&CHALLENGE.ep===id));}
function openSelect(){if(!booted)return;started=true;unlockAudio();
 if(st&&EP&&!$("app").classList.contains("is-hidden")){clockTick();saveRun();clockStop();}showSelect();}
function setMuteIcon(){document.querySelectorAll(".muteBtn").forEach(b=>{b.textContent=META.muted?"🔇":"🔊";});}
function toggleMute(ev){if(ev)ev.stopPropagation();META.muted=!META.muted;saveMeta();setMuteIcon();if(META.muted)Object.values(audioEls).forEach(a=>a.pause());else{const m=curMusic;curMusic=null;playMusic(m);}}
document.querySelectorAll(".muteBtn").forEach(b=>b.addEventListener("click",toggleMute));
// Store-click event, same pattern as the links page: path click/<host+path>. Skipped in dev/verify/debug.
function gcStoreClick(a){if(params.get("dev")==="1"||VERIFY||DEBUG)return;try{const gc=window.goatcounter;if(!gc||typeof gc.count!=="function")return;
 const h=new URL(a.href,location.href),slug=(h.hostname.replace(/^www\./,"")+h.pathname).replace(/\/+$/,"").replace(/[^a-z0-9@._-]+/gi,"-");
 gc.count({path:"click/"+slug,title:a.textContent.trim(),event:true});}catch(e){}}
$("btnMerchTitle").onclick=e=>{e.stopPropagation();track("merch","title");gcStoreClick(e.currentTarget);};
$("btnWeek").onclick=e=>{e.stopPropagation();startWeek();};
$("btnSelect").onclick=e=>{e.stopPropagation();openSelect();};
$("selBack").onclick=showTitle;
$("homeBtn").onclick=openSelect;
$("restartBtn").onclick=()=>{let ok=true;try{ok=window.confirm("Start a new call?")}catch(e){ok=true}if(ok&&EP)startEpisode(EP.id,true);};
function titleControl(node){return !!(node&&node.closest&&node.closest("a[href],button,input,select,textarea"));}
const ov=$("overlay");
ov.addEventListener("click",e=>{if(titleControl(e.target))return;startWeek();});
let tx=0,ty=0,tt=0,touchControl=false;
ov.addEventListener("touchstart",e=>{const t=e.changedTouches[0];tx=t.clientX;ty=t.clientY;tt=Date.now();touchControl=titleControl(e.target);},{passive:true});
ov.addEventListener("touchend",e=>{if(touchControl)return;const t=e.changedTouches[0];if(t&&Math.hypot(t.clientX-tx,t.clientY-ty)<12&&Date.now()-tt<600){e.preventDefault();startWeek();}},{passive:false});
document.addEventListener("keydown",e=>{
 if(!$("overlay").classList.contains("is-hidden")){if(e.key==="Enter"||e.key===" "){if(titleControl(document.activeElement))return;e.preventDefault();startWeek();}return;}
 if(!$("select").classList.contains("is-hidden")){if(e.key==="Escape")showTitle();return;}
 if(!st||!sceneById[st.scene])return;
 if(pepperActive)return;// pepper experiment: the minigame owns the keyboard while its overlay is open
 const n=parseInt(e.key,10);if(n>=1&&n<=5&&!sceneById[st.scene].end){const b=$("choices").children[n-1];if(b)b.click();}
 if(e.key==="Enter"){if($("toast").style.display==="block")showNextToast();else if($("panelContinue"))$("panelContinue").click();}});
const frameImg=$("resultFrameImg");if(frameImg)frameImg.addEventListener("error",()=>{frameImg.dataset.failed="1";});
const logo=$("logo");if(logo)logo.addEventListener("error",()=>{logo.style.display="none";const t=$("logoText");if(t)t.style.display="block";});

// ---------- validator (?verify=1&ep=<id>) ----------
const LICENSED_KEYWORDS=["gas","water heater","backflow","sewer","vent","permit","in the wall"];
const BRAND_BANNED=/Petin Plumbing Co(mpany|\.|\b)/i;
function verify(id){if(!epOf(id))return {ep:id,ok:false,error:"not loaded"};useEpisode(id);const V=EP.verify||{};const missing=[];
 const schemaOk=EP.schema===1&&typeof EP.title==="string"&&typeof EP.week==="number"&&EP.start&&EP.start.scene&&EP.scenes&&EP.endings&&Array.isArray(EP.resolve);
 if(!sceneById[EP.start.scene])missing.push("start->"+(EP.start&&EP.start.scene));
 Object.keys(sceneById).forEach(k=>{const sc=sceneById[k];
  (sc.choices||[]).forEach((c,i)=>{if(c.next!=="resolve")nextTargets(c.next).forEach(n=>{if(!sceneById[n])missing.push(k+"#"+i+"->"+n);});});
  if(sc.panelOnly&&!sceneById[sc.next])missing.push(k+"->"+sc.next);
  if(sc.cutscene&&sc.next&&!sceneById[sc.next])missing.push(k+"->"+sc.next);
  if(sc.forceIf&&!sceneById[sc.forceIf.to])missing.push(k+"->"+sc.forceIf.to);});
 (EP.resolve||[]).forEach(r=>{if(!sceneById[r.to])missing.push("resolve->"+r.to);});
 (EP.redirects||[]).forEach(r=>{if(!sceneById[r.go])missing.push("redirect->"+r.go);});
 if(hackPanel()&&!sceneById[hackPanel()])missing.push("hackChain->"+hackPanel());
 const resolveTo=(EP.resolve||[]).map(r=>r.to);
 const edgeSet={};const link=(from,n)=>{if(!n||n==="resolve")return;if(!sceneById[n])return;(edgeSet[from]=edgeSet[from]||[]).push(n);};
 Object.keys(sceneById).forEach(k=>{const sc=sceneById[k];
  (sc.choices||[]).forEach(c=>{if(c.next==="resolve")resolveTo.forEach(n=>link(k,n));else nextTargets(c.next).forEach(n=>link(k,n));
   if((c.hack||c.hackIf)&&hackPanel())link(k,hackPanel());
   if(c.effects&&c.effects.P>0&&EP.failEnding)link(k,EP.failEnding);});
  if(sc.drift&&EP.failEnding)link(k,EP.failEnding);
  if(sc.panelOnly)link(k,sc.next);if(sc.cutscene&&sc.next)link(k,sc.next);if(sc.forceIf)link(k,sc.forceIf.to);
  (EP.redirects||[]).forEach(r=>{if(r.from===k)link(k,r.go);});});
 const seen={},stack=[EP.start.scene];seen[EP.start.scene]=1;
 while(stack.length){const k=stack.pop();(edgeSet[k]||[]).forEach(n=>{if(sceneById[n]&&!seen[n]){seen[n]=1;stack.push(n);}});}
 const unreachable=Object.keys(sceneById).filter(k=>!seen[k]);
 const routeLengths={};
 function routeName(flags){const pairs=V.routeFlags||[];for(let i=0;i<pairs.length;i++)if(flags[pairs[i][0]])return pairs[i][1];return V.defaultRoute||"main";}
 function noteLen(flags,ending,d){const k=routeName(flags)+"→"+ending;(routeLengths[k]=routeLengths[k]||[]);if(routeLengths[k].indexOf(d)<0)routeLengths[k].push(d);}
 // Same scene, same routing flags, same depth → the rest of the route is identical.
 // Memoizing that stops choice-combination blowups without dropping a real length.
 const routeMemo={};let routeSteps=0;
 (function walk(k,flags,d,hops){if(routeSteps>200000)return;routeSteps++;
  const sc=sceneById[k];if(!sc||d>40||hops>12)return;
  if(sc.panelOnly||(sc.cutscene&&sc.next&&!(sc.choices&&sc.choices.length)))return walk(sc.next,flags,d,hops+1);
  const f0=Object.assign({},flags);if(sc.onEnter)sc.onEnter.forEach(f=>f0[f]=true);if(sc.entryPanel)f0["panel_"+k]=true;
  if(sc.end)return noteLen(f0,k,d);
  let bits=0;if(f0.cleanoutFirst)bits|=1;if(f0.yogurtRoute)bits|=2;if(f0.kevinFight)bits|=4;if(f0.kevinNamed)bits|=8;if(f0.panel_s13)bits|=16;
  const mk=k+"#"+bits+"#"+d;if(routeMemo[mk])return;routeMemo[mk]=1;
  (sc.choices||[]).forEach(c=>{const f2=Object.assign({},f0);(c.setFlags||[]).forEach(f=>f2[f]=true);
   if(c.next==="resolve")return noteLen(f2,"resolver",d+1);
   let n=resolveNext(c.next,{P:0,R:0,T:0,dalehacks:0,flags:f2});
   (EP.redirects||[]).forEach(r=>{if(k===r.from&&n===r.to&&meets(r.if,{P:0,R:0,T:0,dalehacks:0,flags:f2}))n=r.go;});
   walk(n,f2,d+1,0);});})(EP.start.scene,Object.assign({},(EP.start&&EP.start.flags)||{}),0,0);
 let minD=1e9,maxD=0,counted=0;
 Object.keys(routeLengths).forEach(k=>{routeLengths[k].forEach(d=>{if(d>maxD)maxD=d;
  const skip=(V.excludeFromRange||[]).some(name=>k.slice(-("→"+name).length)==="→"+name);if(skip)return;counted++;if(d<minD)minD=d;});});
 const rangeOk=!V.decisions||(counted>0&&minD>=V.decisions[0]&&maxD<=V.decisions[1]);
 let routesOk=true;const routeMiss=[];
 if(V.routes)Object.keys(V.routes).forEach(name=>{const got=(routeLengths[name+"→resolver"]||[]).slice().sort((a,b)=>a-b);const want=[].concat(V.routes[name]).slice().sort((a,b)=>a-b);
  if(JSON.stringify(got)!==JSON.stringify(want)){routesOk=false;routeMiss.push(name+":"+JSON.stringify(got));}});
 const tipKeysMissing=[],used=[];
 function noteTip(from,t){if(!t)return;used.push(t);if(!TIPS[t])tipKeysMissing.push(from+":"+t);}
 Object.keys(sceneById).forEach(k=>{const sc=sceneById[k];noteTip(k,sc.enterTip);if(sc.entryPanel)noteTip(k,sc.entryPanel.tip);
  (sc.choices||[]).forEach(c=>{noteTip(k,c.tip);if(c.alt)noteTip(k,c.alt.tip);});});
 (EP.events||[]).forEach(e=>noteTip(e.id,e.tip));if(EP.codeTip)noteTip("codeTip",EP.codeTip);
 if(EP.vanRunLines&&EP.vanRunLines.failTip)noteTip("vanRun",EP.vanRunLines.failTip);
 const tipClashes=[];Object.keys(EP.tips||{}).forEach(k=>{if(GLOBAL_TIPS[k]&&GLOBAL_TIPS[k]!==EP.tips[k])tipClashes.push(k);});
 const licensedWarnings=[];const uniq=[];used.forEach(t=>{if(uniq.indexOf(t)<0)uniq.push(t);});
 uniq.forEach(t=>{const text=TIPS[t]||"";const low=text.toLowerCase().replace(/sewer gas/g,"");if(LICENSED_KEYWORDS.some(w=>low.indexOf(w)>=0)&&!/licensed/i.test(text))licensedWarnings.push(t);});
 const licensedFails=licensedWarnings.filter(t=>EP.tips&&Object.prototype.hasOwnProperty.call(EP.tips,t));
 const gasRepair=[];
 Object.keys(sceneById).forEach(k=>{const sc=sceneById[k];if(sc.end)return;
  const talk=[sc.text||""].concat((sc.variants||[]).map(v=>v.text||"")).concat((sc.entryPanel?[sc.entryPanel.text]:[])).join(" ");
  if(/smell gas|gas line|gas leak/i.test(talk))(sc.choices||[]).forEach(c=>{const labels=[c.label||""].concat(c.labelAlt?[].concat(c.labelAlt).map(a=>a&&a.text||""):[]);
   if(labels.some(l=>/fix|repair|tape|tighten/i.test(l)))gasRepair.push(k+":"+c.label);});});
 const brandHits=BRAND_BANNED.test(JSON.stringify(EP));
 const playable=Object.keys(EP.scenes||{}).filter(k=>!sceneById[k].end&&!sceneById[k].panelOnly).length;
 const endsOk=!V.endings||ENDINGS.length===V.endings;
 const scenesOk=V.minScenes===undefined||playable>=V.minScenes;
 const ids=Object.keys(sceneById);const realEnd={},realScene={};let states=0;
 // Hard stop so a wide or cyclic episode cannot hang the page. Search ends earlier once every scene and ending is entered.
 const CAP=40000;const IGN={};(V.ignoreFlags||[]).forEach(f=>IGN[f]=1);const memo={};
 function sig(s){
  const pb=s.P>=100?5:s.P>=85?4:s.P>=70?3:s.P>=40?2:0;
  const rb=s.R>=80?5:s.R>=75?4:s.R>=60?3:s.R>=55?2:s.R>=35?1:0;
  const leaveAt=EP.patienceLeave?EP.patienceLeave.at:25;
  const tb=s.T<=leaveAt?0:s.T>=70?3:s.T>=35?2:1;
  const flags=Object.keys(s.flags).filter(f=>s.flags[f]&&!IGN[f]).sort().join(",");
  return s.scene+"|"+pb+"|"+rb+"|"+tb+"|"+Math.min(s.dalehacks||0,4)+"|"+flags;
 }
 function mark(s){if(!s)return;realScene[s.scene]=1;if(s.panel&&sceneById[s.panel])realScene[s.panel]=1;
  if(sceneById[s.scene]&&sceneById[s.scene].end)realEnd[s.scene]=1;}
 // "new" only the first time this bucket is seen, and only when play can continue from it.
 function noteState(s){mark(s);if(!s||states>=CAP)return false;const sc=sceneById[s.scene];if(!sc||sc.end)return false;
  const k=sig(s);if(memo[k])return false;memo[k]=1;states++;return true;}
 function avail(s,sc){const opts=[];(sc.choices||[]).forEach((c,i)=>{if(meets(c.requires,s)&&(!c.showIf||meets(c.showIf,s)))opts.push(i);});return opts;}
 function stepChoice(s,i){const sc=sceneById[s.scene];if(!sc||!sc.choices||!sc.choices[i])return false;s.panel=null;applyChoice(s,sc.choices[i],[],i);return noteState(s);}
 // Full plays with different preferences record endings without blocking the beam.
 // The beam then keeps a spread of states per scene so one early branch cannot use up the cap.
 function playPolicy(pick,forceEv){const s=freshState("VERIFY1");if(forceEv)s.forceEv=forceEv;enterScene(s,s.scene,[]);mark(s);
  for(let n=0;n<40;n++){const sc=sceneById[s.scene];if(!sc||sc.end)break;const opts=avail(s,sc);if(!opts.length)break;
   const i=pick(opts,sc,s,n);s.panel=null;applyChoice(s,sc.choices[i],[],i);mark(s);}}
 playPolicy(opts=>opts[0]);
 // Optional per-episode scripted runs (verify.playScripts: arrays of choice indices, one per decision; unavailable picks fall back to the first option).
 // An entry may also be {picks:[...],forceEvents:["ev_id"]} to fire those random events on that run.
 (Array.isArray(V.playScripts)?V.playScripts:[]).forEach(scr=>{const pk=Array.isArray(scr)?scr:(scr&&Array.isArray(scr.picks)?scr.picks:null);if(!pk)return;
  const fe=!Array.isArray(scr)&&Array.isArray(scr.forceEvents)?scr.forceEvents.filter(x=>typeof x==="string"):null;playPolicy((opts,sc,s,n)=>{const w=pk[n];return opts.indexOf(w)>=0?w:opts[0];},fe);});
 playPolicy(opts=>opts[opts.length-1]);
 playPolicy(opts=>opts[Math.min(1,opts.length-1)]);
 playPolicy((opts,sc)=>opts.slice().sort((a,b)=>((sc.choices[b].hack||sc.choices[b].hackIf)?1:0)-((sc.choices[a].hack||sc.choices[a].hackIf)?1:0)||b-a)[0]);
 playPolicy((opts,sc)=>opts.slice().sort((a,b)=>((sc.choices[b].setFlags||[]).length-(sc.choices[a].setFlags||[]).length)||((sc.choices[b].effects&&sc.choices[b].effects.P)||0)-((sc.choices[a].effects&&sc.choices[a].effects.P)||0)||a-b)[0]);
 const seedSt=freshState("VERIFY1");enterScene(seedSt,seedSt.scene,[]);
 let frontier=[];if(noteState(seedSt))frontier.push(seedSt);
 for(let depth=0;frontier.length&&states<CAP&&depth<32;depth++){
  if(Object.keys(realEnd).length===ENDINGS.length&&Object.keys(realScene).length>=ids.length)break;
  const next=[];
  for(let i=0;i<frontier.length&&states<CAP;i++){const s=frontier[i];const sc=sceneById[s.scene];if(!sc||sc.end)continue;
   avail(s,sc).forEach(ci=>{const s2=cloneSt(s);if(stepChoice(s2,ci))next.push(s2);});}
  const by={};next.forEach(s=>{(by[s.scene]=by[s.scene]||[]).push(s);});
  frontier=[];Object.keys(by).forEach(name=>{const list=by[name];list.sort((a,b)=>sig(a)<sig(b)?-1:sig(a)>sig(b)?1:0);
   const keep=Math.min(list.length,10);
   if(list.length<=keep){frontier=frontier.concat(list);return;}
   for(let i=0;i<keep;i++)frontier.push(list[Math.round(i*(list.length-1)/(keep-1))]);});}
 const unplayed=ids.filter(k=>!realScene[k]);
 const realOk=Object.keys(realEnd).length===ENDINGS.length&&!unplayed.length;
 const res={ep:id,ok:!!schemaOk&&!missing.length&&!unreachable.length&&endsOk&&scenesOk&&rangeOk&&routesOk&&realOk&&!tipKeysMissing.length&&!tipClashes.length&&!gasRepair.length&&!brandHits&&!licensedFails.length,
  scenes:playable,endings:ENDINGS.length,missing:missing,unreachable:unreachable,minDecisions:counted?minD:0,maxDecisions:counted?maxD:0,
  decisionsInRange:rangeOk,routesOk:routesOk,routeMiss:routeMiss,routeLengths:routeLengths,tipKeysMissing:tipKeysMissing,tipClashes:tipClashes,licensedWarnings:licensedWarnings,licensedFails:licensedFails,
  gasRepairChoices:gasRepair,brandHits:brandHits,
  realPlay:{states:states,cap:CAP,capped:states>=CAP,endingsReached:Object.keys(realEnd).sort(),scenesReached:Object.keys(realScene).length,unplayedScenes:unplayed}};
 return res;}

// ---------- boot ----------
function loadEpisodes(done){const dev=params.get("dev")==="1";
 const list=(window.EPISODES_INDEX||[]).filter(e=>e.file&&(dev||!e.stub));let left=list.length;if(!left)return done();
 list.forEach(e=>{const s=document.createElement("script");s.src=e.file;s.onload=s.onerror=()=>{if(--left===0)done();};document.head.appendChild(s);});}
loadMeta();
if(PEPPER){const s=document.createElement("script");s.src="experiments/pepper-pipe/pepper-run.js";if(PEPPER_TEST)s.onload=()=>{window.PepperRun.start({merchLink:TITLE_MERCH_LINK,level:PEPPER_TEST,muted:!!(META&&META.muted),forceResult:params.get("pepperResult"),onDone:r=>{window.__pepperLast=r;}});};document.head.appendChild(s);}
loadEpisodes(()=>{migrateV2();loadMeta();setMuteIcon();booted=true;
 if(VERIFY){const which=params.get("ep")||"ep00";const r=verify(which);window.__TRAP_FULL_VERIFY__=r;
  const pre=document.createElement("pre");pre.id="verifyOut";pre.textContent=JSON.stringify(r,null,1);
  pre.style.cssText="position:fixed;inset:0;z-index:80;margin:0;overflow:auto;background:#12100c;color:#d7c07a;padding:12px;font:12px/1.45 ui-monospace,monospace";
  document.body.appendChild(pre);return;}
 CHALLENGE=challengeFromQuery();if(CHALLENGE){const bn=$("challengeBanner");const ep=epOf(CHALLENGE.ep);bn.innerHTML="";const bb=document.createElement("b");bb.textContent="Beat "+CHALLENGE.beat+" on this call";bn.appendChild(bb);bn.appendChild(document.createElement("br"));
  bn.appendChild(document.createTextNode("A friend challenged you: Ep "+ep.week+": "+ep.title+(CHALLENGE.seed?" · same call (seed "+CHALLENGE.seed+")":"")));bn.classList.remove("is-hidden");track("challenge_opened",CHALLENGE.ep);}
 showTitle();});
// Ending suite only (?test=1). Forces event rolls, mutes, and answers "is this art listed?".
// Without that query the object is null and play is unchanged.
window.__TRAP_TEST=params.get("test")==="1"?{
 setForceEvents:function(ids){if(!st)return;st.forceEv=(Array.isArray(ids)?ids:[]).filter(function(x){return typeof x==="string";}).slice();},
 mute:function(){META.muted=true;try{Object.values(audioEls).forEach(function(a){a.pause();});}catch(e){}},
 artHas:function(name){return ART_AVAILABLE.indexOf(name)>=0;},
 // freshState accepts the verifier seed VERIFY1. A ?seed= in the URL must be 6 characters, so the suite does not use that.
 startRun:function(epId,seed,ids){if(!epOf(epId))return null;useEpisode(epId);pepperAdj=null;pepperActive=false;lastResult=null;
  st=freshState(seed||"VERIFY1");if(ids&&ids.length)st.forceEv=ids.filter(function(x){return typeof x==="string";}).slice();
  var ev=[];enterScene(st,st.scene,ev);META.muted=true;try{Object.values(audioEls).forEach(function(a){a.pause();});}catch(e){}
  started=true;screen("game");clockStart();render();return st.seed;}
}:null;
window.__TRAP={get episodes(){return EPISODES;},get state(){return st;},get result(){return lastResult;},scoreOf:scoreOf,seedToState:seedToState};