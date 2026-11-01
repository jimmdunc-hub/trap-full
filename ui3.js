/* Ep3 upgrade UI layer (M4 skin + M5 feedback/chips/stakes/timer/debug timer).
   Active in-game only when EP.uiSkin==="ep3" (Ep0-2 render exactly as before). Title skin always (body.ui3t). */
(function(){"use strict";
const RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const P_=new URLSearchParams(location.search),VER=P_.get("verify")==="1",DBG=P_.get("debug")==="1"&&P_.get("dev")==="1";
const TKEY="trapfull.ui3.timer";
function timerOn(){try{return localStorage.getItem(TKEY)!=="off";}catch(e){return true;}}
function digits(str){let h="";const txt=String(str).replace("−","-");for(const ch of String(str)){const i="0123456789".indexOf(ch),j=ch==="+"?10:ch==="-"||ch==="−"?11:i;
 if(j<0){h+='<span class="u3t">'+ch+"</span>";continue;}h+='<span class="u3d" style="-webkit-mask-position:'+(-(1+6*j)*2)+'px -2px;mask-position:'+(-(1+6*j)*2)+'px -2px"></span>';}
 return '<span class="u3vh">'+txt+'</span><span aria-hidden="true">'+h+"</span>";}
window.ui3Digits=digits;
function on(){return typeof EP!=="undefined"&&!!EP&&EP.uiSkin==="ep3";}
// ---- shared timeout rule (also used by tests/e3up_mc.js via the same data) ----
window.ui3Timeout=function(s,sc){const t=sc&&sc.timed;if(!t)return;const e=t.effects||{};
 for(const k of ["P","R","T"])if(e[k])s[k]=Math.max(0,Math.min(100,s[k]+e[k]));s.flags[t.flag||"froze"]=true;};
// ---- gates for meter pulse ----
function gatesFor(sc){const g={P:[],R:[],T:[]};const add=(o)=>{if(!o||typeof o!=="object")return;for(const k of ["P","R","T"]){const v=o[k];if(typeof v==="string"){const n=parseInt(v.replace(/[^0-9]/g,""),10);if(isFinite(n))g[k].push({n:n,ge:v.indexOf(">")>=0});}}
 if(o.any)o.any.forEach(add);};
 (sc&&sc.choices||[]).forEach(c=>{if(c.showIf&&!meets(c.showIf,st))return;add(c.requires);});return g;}
function nearGate(k,v,g){return g[k].some(x=>x.ge?(v<x.n&&x.n-v<=10):(v>=x.n-10&&v<x.n));}
// ---- meters: tween, float, flash, blip, pulse ----
let prev=null,prevRun=null;
function blip(up){if(typeof actx==="undefined"||!actx||META.muted)return;try{const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime;o.type="square";
 o.frequency.setValueAtTime(up?520:440,t);o.frequency.linearRampToValueAtTime(up?880:220,t+.12);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);
 o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+.15);}catch(e){}}
function tweenNum(el,a,b){if(RM||a===b){el.innerHTML=digits(b);return;}const t0=performance.now();
 const f=(t)=>{const p=Math.min(1,(t-t0)/400);el.innerHTML=digits(Math.round(a+(b-a)*p));if(p<1)requestAnimationFrame(f);};requestAnimationFrame(f);}
const goodUp={P:false,R:true,T:true};
function decorateMeters(){const sc=sceneById[st.scene];const g=gatesFor(sc);
 const fresh=prevRun!==st||!prev;
 for(const k of ["P","R","T"]){const bar=document.getElementById("m"+k),row=bar.parentElement;let num=row.querySelector(".u3num");
  if(!num){num=document.createElement("span");num.className="u3num";row.querySelector("span").after(num);}
  const v=st[k],old=fresh?v:prev[k];const CL=EP.chipLabels||{};if(CL[k])row.querySelector("span").textContent=CL[k];tweenNum(num,old,v);
  // Rep gate ticks (Ep3 Case/Ghost thresholds; Ghost shows only ???)
  if(k==="R"&&!bar.querySelector(".gt")){[[55,""]].forEach(([n,l])=>{const t=document.createElement("span");t.className="gt";t.style.left=n+"%";t.innerHTML="<b>"+l+"</b>";bar.appendChild(t);});}
  row.classList.toggle("nearGate",nearGate(k,v,g));
  if(!fresh&&v!==old){const d=v-old,good=(d>0)===goodUp[k];row.classList.remove("flashUp","flashDown");void row.offsetWidth;row.classList.add(good?"flashUp":"flashDown");
   setTimeout(()=>row.classList.remove("flashUp","flashDown"),RM?900:500);
   if(!RM){const fl=document.createElement("span");fl.className="u3float";fl.style.color=good?"var(--u3green)":"var(--u3red)";fl.innerHTML=digits((d>0?"+":"-")+Math.abs(d));row.appendChild(fl);setTimeout(()=>fl.remove(),950);}
   blip(d>0);}}
 prev={P:st.P,R:st.R,T:st.T};prevRun=st;}
// ---- chips + stakes ----
function chipsFor(c){const L=Object.assign({P:"Prs",R:"Rep",T:"Pat"},EP.chipLabels||{});const e=c.effects||{},out=[];
 if(EP.vanRun&&c.vanRun)out.push('<span class="u3chip slot">?</span>');
 for(const k of ["P","R","T"]){const d=e[k];if(!d)continue;const good=(d>0)===goodUp[k];
  out.push('<span class="u3chip '+(good?"":"dn")+'">'+L[k]+" "+(d>0?"▲":"▼")+"</span>");}
 if(c.secs)out.push('<span class="u3chip slot">'+digits("+"+c.secs)+"s</span>");
 return out.length?'<span class="u3chips">'+out.join("")+"</span>":"";}
function decorateChoices(){const sc=sceneById[st.scene];if(!sc||!sc.choices)return;
 document.querySelectorAll("#choices button.choice").forEach(b=>{const c=sc.choices[+b.dataset.i];if(!c)return;
  if(b.classList.contains("locked")){const h=b.querySelector(".hint");if(h&&c.stakes)h.textContent=c.stakes;}
  b.insertAdjacentHTML("beforeend",chipsFor(c));});}
// ---- e3_10 countdown ----
let tm=null;const TM=new WeakMap();
function stopTimer(){if(tm){clearInterval(tm.iv);document.removeEventListener("visibilitychange",tm.vis);tm=null;}const el=document.getElementById("u3timer");if(el)el.classList.remove("on");}
function startTimer(sc){stopTimer();if(!sc.timed||VER||!timerOn()||st.flags[sc.timed.flag||"froze"])return;
 let el=document.getElementById("u3timer");if(!el){el=document.createElement("div");el.id="u3timer";el.setAttribute("role","timer");document.getElementById("choices").before(el);}
 const id=st.scene,run=st;let T=TM.get(run);if(!T||T.id!==id){T={id:id,left:sc.timed.secs*1000};TM.set(run,T);}// deadline kept per run+scene: re-render resumes, never restarts
 let left=T.left;el.setAttribute("aria-live","off");
 const draw=()=>{T.left=left;el.setAttribute("aria-label","Decide: "+Math.ceil(left/1000)+" seconds left");el.innerHTML="Decide "+digits(Math.ceil(left/1000))+'s <div class="tb" style="width:'+(left/(sc.timed.secs*10))+'%"></div>';};
 el.classList.add("on");draw();
 tm={iv:setInterval(()=>{if(document.hidden)return;left-=250;if(st!==run||st.scene!==id){stopTimer();return;}
  if(left<=0){stopTimer();const b={P:st.P,R:st.R,T:st.T};window.ui3Timeout(st,sc);saveRun();render();
   present([{type:"note",text:sc.timed.note||"You freeze up."}]);return;}draw();},250),vis:()=>{}};}
function timerToggle(){let b=document.getElementById("u3tbtn");if(b)return;const h=document.querySelector("#app header");if(!h)return;
 b=document.createElement("button");b.type="button";b.id="u3tbtn";b.className="iconbtn";const lab=()=>{b.textContent="⏱"+(timerOn()?"":"✕");b.setAttribute("aria-label","Timed choices "+(timerOn()?"on":"off"));};lab();
 b.onclick=()=>{try{localStorage.setItem(TKEY,timerOn()?"off":"on");}catch(e){}lab();if(!timerOn())stopTimer();else if(st&&sceneById[st.scene])startTimer(sceneById[st.scene]);};h.appendChild(b);}
// ---- debug play timer ----
let dbgT0=null;
function dbgTick(){if(!DBG||!st)return;const d=document.getElementById("debug");if(!d)return;let s=document.getElementById("u3dbg");
 if(!s){s=document.createElement("div");s.id="u3dbg";d.after(s);s.style.cssText="position:fixed;right:4px;bottom:4px;background:#000c;color:#d7c07a;font:14px monospace;padding:2px 6px;z-index:99";}
 const secs=Math.round(((st.elapsedMs||0))/1000);s.textContent="play "+Math.floor(secs/60)+":"+String(secs%60).padStart(2,"0")+" (+pen "+Math.round((st.penaltyMs||0)/1000)+"s) "+st.scene;}
setInterval(dbgTick,1000);
// ---- hooks ----
const _render=window.render,_draw=window.drawMeters;
window.drawMeters=function(){_draw.apply(this,arguments);if(on()&&st)decorateMeters();};
window.render=function(){const r=_render.apply(this,arguments);document.body.classList.toggle("ui3",on());
 if(on()&&st){timerToggle();const sc=sceneById[st.scene];if(sc&&!sc.end&&!st.panel&&sc.choices){decorateChoices();if(sc.timed)startTimer(sc);else stopTimer();}else stopTimer();}else stopTimer();
 return r;};
document.body.classList.add("ui3t");
const ov=document.getElementById("overlay");if(ov&&!document.getElementById("u3foot")){const f=document.createElement("div");f.id="u3foot";f.className="u3tag";f.textContent="PlumbPetin · Petin, Texas";ov.appendChild(f);}
})();
