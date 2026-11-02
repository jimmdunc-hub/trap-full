/* TRAP FULL × Pepper Pipe — "Pepper Run" prototype (pitch A). Vanilla JS, no dependencies, no network.
   Movement constants and the jump model (coyote time, jump buffer, double jump, variable height, one-way
   platforms) are ported from Piquin's own Pepper Pipe (routes.pretty.js). Placeholder art; Art restyles later.
   API: PepperRun.start({parent, assetBase, boySrc, forceResult, onDone, level});
   level: "ep02" (default, Ms. Reyes's slab job) or "ep03" (Halloween: haunted cul-de-sac, jack-o'-lantern bumps, cobweb gap, chile petin candy). returns false if a run is already open
   result = {chilies, total, fell, cleared, fullClear, skipped, timeUp, band:"high"|"mid"|"low", secs}
   forceResult (QA): a number 0-total, "fall", "clear" or "skip" returns that result without playing. */
(function(){
"use strict";
// --- constants from Pepper Pipe ---
const MAXV=252,ACC_G=1900,ACC_A=1280,FRIC_G=2400,FRIC_A=260,JUMP1=-548,JUMP2=-492,GRAV_UP=1480,GRAV_DN=2860,APEX=86,MAXFALL=880,COYOTE=0.11,BUFFER=0.13;
// Same link as the game's ending cards.
const MERCH_LINK="https://petinplumbco.myshopify.com/?utm_source=pepperrun&utm_medium=web&utm_campaign=pepperrun";// standalone Pepper Run; TRAP FULL passes merchLink (utm_source=trapfull)
const PW=28,PH=54,VIEW_W=960,VIEW_H=540,TIME_LIMIT=45;
const KEYS={left:["ArrowLeft","KeyA"],right:["ArrowRight","KeyD"],jump:["ArrowUp","KeyW","Space"],drop:["ArrowDown","KeyS"]};
// --- one short level (Ep2, Ms. Reyes’s job): her front step -> hedges, ladder racks, cooler lid -> the van's tool bin ---
function level(name){if(name==="ep03")return levelEp03();if(name==="ep04")return levelEp04();if(name==="ep05")return levelEp05();
 const S=[],C=[];let id=0;const s=(x,y,w,h,o)=>S.push({id:"s"+(id++),x,y,w,h,oneWay:!!o});
 s(0,430,520,110);            // driveway start
 s(600,430,360,110);          // gap 1 (hedge)
 s(700,330,160,14,true);      // ladder rack (one-way)
 s(1040,400,300,140);
 s(1420,430,240,110);
 s(1500,300,140,14,true);
 s(1740,360,220,180);         // fence top
 s(2040,430,720,110);         // was 520 wide: the cooler-lid gap is now 160 (was 360) so gap + landing fit on one screen
 S.push({id:"m1",x:2790,y:380,w:100,h:16,oneWay:true,motion:{axis:"x",amp:40,period:3.2,phase:0}}); // rolling cooler lid
 s(2920,430,420,110);
 s(3020,320,150,14,true);
 s(3420,380,200,160);
 s(3700,430,260,110);
 s(3780,300,140,14,true);
 s(4040,410,560,130);         // final driveway, the van at the end
 [[260,380],[650,280],[790,280],[1180,340],[1560,250],[1850,300],[2300,380],[2840,320],[3090,270],[3850,250]].forEach(p=>C.push({id:"c"+C.length,x:p[0],y:p[1]}));
 return {width:4600,height:VIEW_H,killY:600,spawn:{x:60,y:370},solids:S,coins:C,goal:{x:4460,y:300,w:110,h:110}};}
// --- Ep3 Halloween level (Walt's cul-de-sac at night): same jump model and gap sizes as Ep2. Jack-o'-lanterns bump the Boy back
// (time only, no meter effect); the gap after the fence is the cobweb gap; chilies are wrapped chile petin candy.
function levelEp03(){
 const S=[],C=[];let id=0;const s=(x,y,w,h,o)=>S.push({id:"s"+(id++),x,y,w,h,oneWay:!!o});
 s(0,430,520,110);            // Walt's walk
 s(600,430,360,110);          // gap 1 (leaf pile)
 s(700,330,160,14,true);      // porch rail (one-way)
 s(1040,400,300,140);
 s(1420,430,240,110);
 s(1500,300,140,14,true);
 s(1740,360,220,180);         // garden wall top; the 120px cobweb gap follows
 s(2080,430,680,110);
 S.push({id:"m1",x:2790,y:380,w:100,h:16,oneWay:true,wagon:true,motion:{axis:"x",amp:40,period:3.2,phase:0}}); // moving wagon (100x16)
 s(2920,430,420,110);
 s(3020,320,160,14,true);     // 160 so it sits on the 20px grid
 s(3420,380,200,160);
 s(3700,430,260,110);
 s(3780,300,140,14,true);
 s(4040,410,560,130);         // the van at the curb
 [[260,380],[650,280],[790,280],[1180,340],[1560,250],[1850,300],[2300,380],[2840,320],[3090,270],[3850,250]].forEach(p=>C.push({id:"c"+C.length,x:p[0],y:p[1]}));
 const H=[[400,430],[1220,400],[2200,430],[2560,430],[3200,430],[4200,410]].map((q,i)=>({id:"h"+i,x:q[0],y:q[1]-20,w:20,h:20}));
 return {width:4600,height:VIEW_H,killY:600,spawn:{x:60,y:370},solids:S,coins:C,hazards:H,web:{x:1960,w:120,y:360},goal:{x:4460,y:300,w:110,h:110},theme:"halloween"};}
// --- Ep4 level (Gloria's alley, steamy): same jump model. Dumpster (solid lid), one-way sale table / box stack / heater shell tops,
// a moving cart, puddles (slick: no braking), a water jet on a fence section (spray frames bump the Boy; drip frames are safe),
// and a steam vent (puffs bump). Hazards cost time only, never a meter.
function levelEp04(){
 const S=[],C=[];let id=0;const s=(x,y,w,h,o,k)=>S.push({id:"s"+(id++),x,y,w,h,oneWay:!!o,kind:k||""});
 s(0,430,520,110);            // alley start (Gloria's gate)
 s(600,430,740,110);
 s(880,370,80,60,false,"dumpster"); // 80x60, solid lid
 s(1180,396,60,34,true,"table");    // sale_table top (one-way)
 s(1420,430,540,110);
 s(1560,390,40,40,true,"boxes");    // box_stack top
 s(1700,350,40,80,true,"heater");   // heater_shell top
 s(2040,430,720,110);
 S.push({id:"m1",x:2790,y:380,w:100,h:16,oneWay:true,kind:"cart",motion:{axis:"x",amp:40,period:3.2,phase:0}}); // moving cart (100x16)
 s(2920,430,420,110);
 s(3020,340,60,34,true,"table");
 s(3420,430,540,110);
 s(3600,390,40,40,true,"boxes");
 s(4040,410,560,130);         // Hector's van at the end of the alley
 [[260,380],[650,300],[920,320],[1210,350],[1720,300],[2300,380],[2840,320],[3050,290],[3620,340],[3850,360]].forEach(p=>C.push({id:"c"+C.length,x:p[0],y:p[1]}));
 const J={x:2500,y:390,w:60,h:40,fence:{x:2484,y:316}};// water jet, mounted on a world fence panel
 const V={x:3780,y:422,w:20,h:8};// steam vent
 const jetOn=t=>Math.floor((t%2.4)/0.6)>=2,ventOn=t=>(t%2.2)<0.9;
 const H=[{id:"jet",x:J.x+22,y:J.y+8,w:36,h:32,on:jetOn},{id:"vent",x:V.x-4,y:V.y-30,w:28,h:30,on:ventOn}];
 const P=[[700,424],[2300,424],[3460,424]].map((q,i)=>({id:"p"+i,x:q[0],y:q[1],w:40,h:6}));
 return {width:4600,height:VIEW_H,killY:600,spawn:{x:60,y:370},solids:S,coins:C,hazards:H,puddles:P,jet:J,vent:V,jetOn,ventOn,goal:{x:4460,y:300,w:110,h:110},theme:"alley"};}
/* --- Ep5 level "Hold, Please" (test level until Ep5 has scenes; open with ?pepper=ep5). Art: assets/pepperrun/ep5 (README = beat table).
   96 BPM, 1 beat = 0.625 s, 8-bar loop (20 s). Hazards hit on beats 1 and 3 for 0.3125 s (frame f2); bars 4 and 8 are hazard-free stingers.
   Ground top y430, pits 520-600 and 980-1060. Hazards cost time only, never a meter. */
const BEAT=0.625,BAR=2.5,LOOP=20;
function beatAt(bt){const bi=Math.floor(bt/BEAT),bar=Math.floor(bi/4)%8,beat=bi%4,fr=bt/BEAT-bi;return {bi,bar,beat,fr,sting:bar===3||bar===7,nextSting:bar===2||bar===6};}
function hazFrameE5(bt){const b=beatAt(bt);if(b.sting)return 0;
 if(b.beat===0||b.beat===2)return b.fr<0.5?2:3;
 if(b.beat===1)return b.fr<0.25?3:b.fr<0.5?0:1;           // warn f1 on the "and" of beat 2
 return b.fr<0.25?3:(b.nextSting?0:1);}                    // beat 4: warn f1 before beat 1 of a hazard bar
function radioFrameE5(bt){const b=beatAt(bt);if(b.sting)return b.beat===3?1:0;return hazFrameE5(bt);}
function levelEp05(){
 const S=[],C=[];let id=0;const s=(x,y,w,h,o,k)=>S.push({id:"s"+(id++),x,y,w,h,oneWay:!!o,kind:k||""});
 s(0,430,520,110);s(600,430,380,110);s(1060,430,540,110);   // driveway; the gaps are pits
 s(300,390,80,40,false,"drywall");                           // drywall_stack, solid
 s(720,400,60,5,true,"rack");                                // pipe_rack (60x30 art), one-way on its top 5 px
 s(820,380,40,50,false,"cabinet");                           // cabinet_boxes, solid
 s(480,350,240,14,true,"plank");s(1100,340,180,14,true,"plank"); // planks: 4 and 3 tiles
 S.push({id:"m1",x:560,y:380,w:100,h:16,oneWay:true,kind:"dolly",motion:{axis:"x",amp:40,period:3.2,phase:Math.PI/2}}); // dolly starts at x600, rolls 520-700 over the first pit
 [[260,380],[340,370],[530,320],[870,350],[1130,300],[1300,400]].forEach(q=>C.push({id:"c"+C.length,x:q[0],y:q[1]}));
 const on=t=>hazFrameE5(t)===2;
 // fair hitboxes, a little inside Art's drawn reach (snap reaches 22 px up; splash zone 40x20)
 const H=[{id:"snap",x:426,y:412,w:28,h:18,on,beat:true},{id:"splash",x:905,y:415,w:30,h:15,on,beat:true}];
 const P=[{id:"mud",x:900,y:424,w:40,h:6}];                  // mud_spill is slick at all times (no braking)
 return {width:1600,height:VIEW_H,killY:600,spawn:{x:60,y:370},solids:S,coins:C,hazards:H,puddles:P,goal:{x:1420,y:330,w:110,h:104},theme:"hold",
  snap:{x:420,y:400},splash:{x:900,y:410},radios:[{x:500,y:406},{x:970,y:406}],notes:{x:496,y:374},lamp:{x:1040,y:410},cords:[{x:550,y:240},{x:1000,y:250}],van:{x:1380,y:330}};}
/* Hold-music loop: original chiptune bossa-style pattern written for this game (no licensed or copyrighted melody). WebAudio only, no files.
   8th-note grid (0.3125 s), 64 steps per loop; bars 4 and 8 play the "your call is important" stinger (chime phrase, no beat beeps). */
function holdMusic(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;let ac;try{ac=new AC();}catch(e){return null;}
 const out=ac.createGain();out.gain.value=0.22;out.connect(ac.destination);
 const hz=m=>440*Math.pow(2,(m-69)/12);
 function tone(type,m,at,dur,vol){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=hz(m);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(vol,at+0.01);g.gain.exponentialRampToValueAtTime(0.0008,at+dur);o.connect(g);g.connect(out);o.start(at);o.stop(at+dur+0.02);}
 function click(at,vol){const n=ac.createBufferSource(),b=ac.createBuffer(1,Math.floor(ac.sampleRate*0.03),ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);n.buffer=b;const g=ac.createGain(),f=ac.createBiquadFilter();f.type="highpass";f.frequency.value=2500;g.gain.value=vol;n.connect(f);f.connect(g);g.connect(out);n.start(at);}
 // chords per bar (root, chord tones as MIDI): Dm9, G13, Cmaj9, [sting], Fmaj7, Em7/A7, Dm7/G7, [sting]
 const CH=[[38,[53,57,60,64]],[43,[53,59,64,67]],[36,[52,55,59,62]],[36,[52,55,59,64]],[41,[52,57,60,64]],[40,[50,55,59,62]],[38,[53,57,60,65]],[43,[53,59,62,65]]];
 const MEL=[[0,69,2],[3,67,1],[4,65,2],[6,64,2],null,[0,71,1],[2,72,2],[5,74,3],null,[0,76,3],[4,74,1],[5,72,3],null,null,null,null,
            [0,72,2],[3,69,1],[4,67,3],null,[0,67,1],[1,69,1],[2,71,2],[5,72,3],[0,74,2],[3,72,1],[4,71,2],[6,69,2],null,null,null,null];
 const BELL=[[0,84],[1,81],[2,79],[3,81],[4,84],[5,86],[6,84]];  // stinger chime: one note per syllable, 7 eighths
 let t0=null,next=0,timer=0,muted=false;
 function sched(step,at){const bar=Math.floor(step/8)%8,e=step%8,sting=bar===3||bar===7,[root,ch]=CH[bar];
  if(sting){if(e===0)ch.forEach(m=>tone("triangle",m,at,2.3,0.05));const b=BELL.find(q=>q[0]===e);if(b)tone("sine",b[1],at,0.5,0.18);if(e===0||e===4)tone("triangle",root,at,0.5,0.16);return;}
  // bossa bass: root on 1, fifth on the "and" of 2 and on 3, root on the "and" of 4
  if(e===0||e===7)tone("triangle",root,at,0.28,0.26);if(e===3||e===4)tone("triangle",root+7,at,0.26,0.22);
  // rim clave over two bars
  const cl=(bar%2===0)?[0,3,6]:[2,4];if(cl.indexOf(e)>=0)click(at,0.35);
  // comp: short square chord stabs
  if(e===1||e===3||e===6)ch.forEach(m=>tone("square",m,at,0.12,0.018));
  // beat beeps in sync with the hazards (beats 1 and 3)
  if(e===0||e===4)tone("square",88,at,0.07,0.05);
  const slot=MEL.filter((n,i)=>n&&Math.floor(i/4)===bar%8);slot.forEach(n=>{if(n[0]===e)tone("triangle",n[1],at,0.3125*n[2]*0.9,0.11);});}
 function pump(songT){if(t0===null||ac.state!=="running")return;const ahead=songT+0.2;while(next*0.3125<ahead){const at=t0+next*0.3125;if(at>=ac.currentTime-0.01&&!muted)sched(next%64,at);next++;}}
 return {ac,
  sync(songT){if(ac.state!=="running")return;if(t0===null){t0=ac.currentTime-songT;next=Math.ceil(songT/0.3125);}pump(songT);},
  time(){return t0===null||ac.state!=="running"?null:ac.currentTime-t0;},
  resume(){if(ac.state==="suspended")ac.resume().catch(()=>{});},
  mute(m){muted=!!m;out.gain.value=m?0:0.22;},
  stop(){try{out.disconnect();ac.close();}catch(e){}}};}
function rectAt(s,t){let x=s.x,y=s.y;if(s.motion){const v=Math.sin(t/s.motion.period*Math.PI*2+s.motion.phase);if(s.motion.axis==="x")x+=v*s.motion.amp;else y+=v*s.motion.amp;}return {id:s.id,x,y,w:s.w,h:s.h,oneWay:s.oneWay};}
function hit(x,y,w,h,r){return x<r.x+r.w&&x+w>r.x&&y<r.y+r.h&&y+h>r.y;}
function band(r){if(r.fell)return "low";const n=r.total||10,hi=Math.ceil(n*0.8),mid=Math.ceil(n*0.4);if(r.chilies>=hi)return "high";if(r.chilies>=mid)return "mid";return "low";}/* 10 chilies: 8/4 as before; Ep5 (6): 5/3 */
function finish(r){r.band=band(r);r.fullClear=!!(r.cleared&&r.chilies===r.total);return r;}
function forced(v,total){const r={chilies:0,total,fell:false,cleared:false,skipped:false,timeUp:false,secs:0,forced:true};
 if(v==="fall"){r.fell=true;r.chilies=2;}else if(v==="clear"){r.cleared=true;r.chilies=total;}else if(v==="skip"){r.skipped=true;}
 else if(/^\d+(\.\d+)?$/.test(v.trim())){r.chilies=Math.min(total,Math.floor(+v));r.cleared=true;}else{r.skipped=true;}// junk or negative = skip
 return finish(r);}
function css(){if(document.getElementById("pepperRunCss"))return;const st=document.createElement("style");st.id="pepperRunCss";st.textContent=
 "#pepperRun{position:fixed;inset:0;z-index:50;background:#16101f;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:6px;padding:calc(6px + env(safe-area-inset-top)) calc(6px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(6px + env(safe-area-inset-left));box-sizing:border-box;color:#fff3e4;font:15px/1.3 system-ui,sans-serif;touch-action:none;-webkit-user-select:none;user-select:none}"+
 "#pepperRun canvas{display:block;width:100%;flex:1 1 auto;min-height:0;max-height:100%;image-rendering:pixelated;image-rendering:crisp-edges;border-radius:8px;background:#2a1c34;touch-action:none}"+
 "#pepperRun .pr-top{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px}"+
 "#pepperRun .pr-title{font-weight:700;color:#ef4b3a}#pepperRun .pr-hint{font-size:.72rem;line-height:1.25;color:#cbb8a4;text-align:center;flex:none}"+
 "#pepperRun button{font:inherit;color:#fff3e4;background:#3a2a44;border:2px solid #6b5277;border-radius:10px;min-height:44px;min-width:44px;padding:6px 12px;touch-action:none}"+
 "#pepperRun .pr-pad{margin-top:auto;width:100%;max-width:760px;display:flex;justify-content:space-between;gap:16px;flex:none;padding:0 4px;box-sizing:border-box}"+
 "#pepperRun .pr-pad div{display:flex;gap:14px}#pepperRun .pr-pad button{width:78px;height:76px;font-size:1.7rem;border-radius:16px}"+
 "#pepperRun button.on{background:#ef4b3a;border-color:#fff3e4}#pepperRun .pr-skip{background:#2a2318;border-color:#d7c07a;color:#d7c07a}"+
 "#pepperRun .pr-merch{display:flex;align-items:center;justify-content:center;min-height:52px;width:100%;max-width:420px;box-sizing:border-box;border-radius:10px;background:#e0a33a;color:#12100c;font-weight:700;text-decoration:none;flex:none}"+
 "#pepperRun .pr-end{font-size:1.05rem;text-align:center;max-width:520px}";document.head.appendChild(st);}
function start(opts){opts=opts||{};const L=level(opts.level);const HW=L.theme==="halloween",AL=L.theme==="alley",HO=L.theme==="hold";const total=L.coins.length;const done=typeof opts.onDone==="function"?opts.onDone:function(){};
 if(document.getElementById("pepperRun"))return false;// one run at a time: false = refused
 if(opts.forceResult!==undefined&&opts.forceResult!==null&&opts.forceResult!==""){const r=forced(String(opts.forceResult),total);setTimeout(()=>done(r),0);return r;}
 css();const base=opts.assetBase===undefined?"assets/img/":opts.assetBase;
 const root=document.createElement("div");root.id="pepperRun";root.setAttribute("role","dialog");root.setAttribute("aria-label","Pepper Run minigame");
 root.innerHTML='<div class="pr-top"><span class="pr-title">Pepper Run</span><span class="pr-hud" aria-live="polite"></span><button type="button" class="pr-skip">Skip</button></div>'+
  (HO?'<canvas width="390" height="400" aria-label="The Boy runs a driveway job site to the van at dusk, on the beat of the hold music, collecting chilies"></canvas>'+
  '<div class="pr-hint">Hold, Please. The hold music keeps the beat: tangled cords snap and the mud splashes on beats 1 and 3 (watch the radio light), and the stinger bar is safe. Ride the dolly over the trench, grab the chilies, get to the van. Arrows/A-D run, Up/W/Space jump (twice in the air), Down drops through planks and the pipe rack, Esc skips.</div>':
  AL?'<canvas width="390" height="400" aria-label="The Boy runs down a steamy alley to the van, collecting chilies"></canvas>'+
  '<div class="pr-hint">Gloria’s water heater. Pete needs the element tester from the van. Get the Boy down the alley: hop the dumpster, mind the puddles, time the water jet and the steam vent, and grab the chilies. Arrows/A-D run, Up/W/Space jump (twice in the air), Down drops through the table and box tops, Esc skips.</div>':
  HW?'<canvas width="390" height="400" aria-label="The Boy runs across a haunted cul-de-sac to the van, collecting chile petín candy"></canvas>'+
  '<div class="pr-hint">Walt’s mystery leak. Pete needs a drywall saw, inspection light and shop vac from the van. Get the Boy down the cul-de-sac, hop the jack-o’-lanterns, clear the cobweb gap and grab the chile petín candy. Arrows/A-D run, Up/W/Space jump (twice in the air), Down drops through the porch rails, Esc skips.</div>':
  '<canvas width="390" height="400" aria-label="The Boy runs from Ms. Reyes’s house to the van, collecting chilies"></canvas>'+
  '<div class="pr-hint">Ms. Reyes’s kitchen slab. Pete needs a bucket, chisel and dust mask from the van. Get the {boy} out to the van and grab chilies on the way. Arrows/A-D run, Up/W/Space jump (twice in the air), Down drops through the ladder racks, Esc skips.</div>'.replace("{boy}","Boy"))+
  '<div class="pr-pad"><div><button type="button" data-k="left" aria-label="Run left">◀</button><button type="button" data-k="right" aria-label="Run right">▶</button></div><div><button type="button" data-k="drop" aria-label="Drop down">▼</button><button type="button" data-k="jump" aria-label="Jump">▲</button></div></div>';
 (opts.parent||document.body).appendChild(root);
 const cv=root.querySelector("canvas"),g=cv.getContext("2d"),hud=root.querySelector(".pr-hud");g.imageSmoothingEnabled=false;
 const boy=new Image();let boyOk=false;boy.onload=()=>{boyOk=true;};boy.onerror=()=>{boyOk=false;};boy.src=opts.boySrc||(base+"boy_idle.png");const BF=[40,60];// the Boy stays 40x60 in every level
 // Ep3 art (TRAP FULL Art, assets/img/ep3_upgrade/pepperrun (ep3-upgrade: far/mid/ground/platform/porch/van) + assets/pepperrun/ep3 (sky, props) + assets/brand "Petin, Texas" decals); shapes only if a file fails to load
 const IM={};if(AL){const pr=base.replace(/img\/?$/,"");[["sky","pepperrun/ep4/parallax_sky"],["far","pepperrun/ep4/parallax_far"],["mid","pepperrun/ep4/parallax_mid"],["ground","pepperrun/ep4/tiles_asphalt"],["plat","pepperrun/ep4/tiles_platform_e4"],["cart","pepperrun/ep4/plat_moving_cart"],["dumpster","pepperrun/ep4/dumpster"],["table","pepperrun/ep4/sale_table"],["boxes","pepperrun/ep4/box_stack"],["heater","pepperrun/ep4/heater_shell"],["puddle","pepperrun/ep4/hazard_puddle"],["jet","pepperrun/ep4/water_jet"],["vent","pepperrun/ep4/steam_vent"],["steam","img/fx_steam"],["chile","pepperrun/ep4/pickup_chile"],["gate","pepperrun/ep4/start_gate"],["van","pepperrun/ep4/goal_hector_van"],["sign","brand/petin_texas_sign_lettered"],["tower","brand/petin_texas_tower_decal_lettered"],["door","brand/ep4_van_hector_door_lettered"]].forEach(([k,f])=>{const im=new Image();im.onload=()=>{IM[k]=im;};im.src=pr+f+".png";});}
 if(HO){const pr=base.replace(/img\/?$/,"");[["sky","pepperrun/ep5/parallax_sky"],["far","pepperrun/ep5/parallax_far"],["mid","pepperrun/ep5/parallax_mid"],["ground","pepperrun/ep5/tiles_driveway"],["plank","pepperrun/ep5/tiles_platform_e5"],["dolly","pepperrun/ep5/plat_moving_dolly"],["drywall","pepperrun/ep5/drywall_stack"],["rack","pepperrun/ep5/pipe_rack"],["cabinet","pepperrun/ep5/cabinet_boxes"],["snap","pepperrun/ep5/hazard_tangle_snap"],["splash","pepperrun/ep5/hazard_mud_splash"],["mud","pepperrun/ep5/hazard_mud_spill"],["radio","pepperrun/ep5/radio_beep"],["notes","pepperrun/ep5/fx_hold_notes"],["lamp","pepperrun/ep5/stinger_lamp"],["cord","pepperrun/ep5/cord_swing"],["chile","pepperrun/ep5/pickup_chile"],["house","pepperrun/ep5/start_house"],["post","pepperrun/ep5/yard_sign_post"],["sign","brand/ep5_yard_sign_lettered"],["van","pepperrun/ep5/goal_van_dusk"],["door","brand/petin_texas_vandoor_lettered"]].forEach(([k,f])=>{const im=new Image();im.onload=()=>{IM[k]=im;};im.src=pr+f+".png";});}
 if(HW){const pr=base.replace(/img\/?$/,"");[["sky","pepperrun/ep3/parallax_sky"],["far","img/ep3_upgrade/pepperrun/parallax_far"],["mid","img/ep3_upgrade/pepperrun/parallax_mid"],["ground","img/ep3_upgrade/pepperrun/tiles_ground"],["plat","img/ep3_upgrade/pepperrun/tiles_platform"],["wagon","pepperrun/ep3/plat_moving_wagon"],["leaf","pepperrun/ep3/soft_leafpile"],["web","pepperrun/ep3/cobweb_gap"],["jack","pepperrun/ep3/hazard_jackolantern"],["candy","pepperrun/ep3/pickup_chile_candy"],["porch","img/ep3_upgrade/pepperrun/start_porch"],["van","img/ep3_upgrade/pepperrun/goal_van_night"],["sign","brand/petin_texas_sign_lettered"],["tower","brand/petin_texas_tower_decal_lettered"],["door","brand/petin_texas_vandoor_lettered"],["tea","img/boy_pumpkintea"],["grab","img/prop_skeleton_grabber"]].forEach(([k,f])=>{const im=new Image();im.onload=()=>{IM[k]=im;};im.src=pr+f+".png";});}// boySrc: a data URL in self-contained builds
 const MU=HO&&opts.music!==false?holdMusic():null;if(MU&&opts.muted)MU.mute(true);let BT=0;// beat clock: audio time when the music runs, else run time
 const held=new Set(),touch={left:false,right:false,jump:false,drop:false};
 const down=k=>KEYS[k].some(c=>held.has(c))||touch[k];
 const onKey=e=>{if(MU)MU.resume();if(e.code==="Escape"){e.preventDefault();end({skipped:true});return;}if(Object.values(KEYS).some(a=>a.indexOf(e.code)>=0)){e.preventDefault();e.type==="keydown"?held.add(e.code):held.delete(e.code);}};
 window.addEventListener("keydown",onKey);window.addEventListener("keyup",onKey);
 root.querySelectorAll(".pr-pad button").forEach(b=>{const k=b.dataset.k;const on=e=>{e.preventDefault();touch[k]=true;b.classList.add("on");},off=e=>{e.preventDefault();touch[k]=false;b.classList.remove("on");};
  b.addEventListener("touchstart",on,{passive:false});b.addEventListener("touchend",off,{passive:false});b.addEventListener("touchcancel",off,{passive:false});
  b.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch")on(e);});b.addEventListener("pointerup",e=>{if(e.pointerType!=="touch")off(e);});b.addEventListener("pointerleave",e=>{if(e.pointerType!=="touch")off(e);});});
 root.querySelector(".pr-skip").onclick=()=>end({skipped:true});
 const p={x:L.spawn.x,y:L.spawn.y,vx:0,vy:0,facing:1,grounded:false,groundId:null,jumpsLeft:2,coyote:0,buffer:0,jumpWas:false,cutArmed:false,dropTimer:0,airTime:0,anim:0,hurt:0};let bumps=0;
 let t=0,camX=0,camY=0,look=0,lookT=0,anchorY=L.spawn.y+PH,Z=1,dpr=1,vw=VIEW_W,vh=VIEW_H,closeAt=0,closed=false,contGo=null,camLog=[],mode="play",got=new Set(),prev=new Map(L.solids.map(s=>[s.id,rectAt(s,0)])),raf=0,last=0,acc=0,result=null,endTimer=0,msg="";
 function step(dt){t+=dt;if(HO){const a=MU&&MU.time();BT=a!==null&&a!==undefined&&Math.abs(a-t)<0.25?a:t;}p.dropTimer=Math.max(0,p.dropTimer-dt);p.hurt=Math.max(0,p.hurt-dt);p.anim+=dt;
  const R=L.solids.map(s=>rectAt(s,t)),M=new Map(R.map(r=>[r.id,r]));
  if(p.groundId){const a=M.get(p.groundId),b=prev.get(p.groundId);if(a&&b){p.x+=a.x-b.x;p.y+=a.y-b.y;}}
  let dir=(down("left")?-1:0)+(down("right")?1:0);const slick=!!(L.puddles&&p.grounded&&L.puddles.some(q=>p.x+PW>q.x+6&&p.x<q.x+q.w-6&&Math.abs(p.y+PH-q.y-6)<10));const ac=p.grounded&&!slick?ACC_G:ACC_A;
  if(dir){p.vx+=dir*ac*dt;p.facing=dir;}else{const f=(p.grounded&&!slick?FRIC_G:FRIC_A)*dt;p.vx=Math.abs(p.vx)<=f?0:p.vx-Math.sign(p.vx)*f;}
  p.vx=Math.max(-MAXV,Math.min(MAXV,p.vx));
  let gr=p.vy<0?GRAV_UP:GRAV_DN;if(Math.abs(p.vy)<APEX)gr*=0.5;p.vy=Math.min(MAXFALL,p.vy+gr*dt);
  const j=down("jump");if(j&&!p.jumpWas)p.buffer=BUFFER;p.jumpWas=j;p.buffer=Math.max(0,p.buffer-dt);
  if(p.grounded){p.jumpsLeft=2;p.coyote=COYOTE;p.airTime=0;}else{p.coyote=Math.max(0,p.coyote-dt);p.airTime+=dt;}
  const first=p.jumpsLeft===2&&(p.grounded||p.coyote>0),second=p.jumpsLeft===1;
  if(p.buffer>0&&(first||second)){const dbl=!first;p.vy=dbl?JUMP2:JUMP1;p.jumpsLeft=dbl?0:1;p.buffer=0;p.coyote=0;p.grounded=false;p.groundId=null;p.cutArmed=true;}
  else if(!j&&p.cutArmed&&p.vy<0){p.vy*=0.5;p.cutArmed=false;}
  if(down("drop")&&p.grounded&&p.groundId&&M.get(p.groundId)&&M.get(p.groundId).oneWay){p.dropTimer=0.18;p.grounded=false;p.groundId=null;p.y+=3;p.jumpsLeft=2;}
  p.x+=p.vx*dt;
  R.filter(r=>!r.oneWay).forEach(r=>{if(hit(p.x,p.y,PW,PH,r)){p.x=p.vx>0?r.x-PW:p.vx<0?r.x+r.w:(p.x+PW-r.x<r.x+r.w-p.x?r.x-PW:r.x+r.w);p.vx=0;}});
  const foot=p.y+PH;p.y+=p.vy*dt;let gnd=null;
  [...R].sort((a,b)=>p.vy>=0?a.y-b.y:b.y-a.y).forEach(r=>{if(!hit(p.x,p.y,PW,PH,r))return;
   if(r.oneWay){if(p.vy<0||p.dropTimer>0||foot>r.y+8)return;p.y=r.y-PH;p.vy=0;gnd=r;}
   else if(p.vy>0||foot<=r.y+8){p.y=r.y-PH;p.vy=0;gnd=r;}else{p.y=r.y+r.h;p.vy=0;p.cutArmed=false;}});
  p.grounded=gnd!==null;p.groundId=gnd?gnd.id:null;p.x=Math.max(0,Math.min(L.width-PW,p.x));
  L.coins.forEach(c=>{if(got.has(c.id))return;const dx=p.x+14-c.x,dy=p.y+27-c.y;if(dx*dx+dy*dy<676)got.add(c.id);});
  if(L.hazards&&p.hurt<=0)L.hazards.forEach(h=>{if(p.hurt<=0&&(!h.on||h.on(HO?BT:t))&&hit(p.x+4,p.y,PW-8,PH,h)){const back=p.x+PW/2<h.x+h.w/2?-1:1;p.vx=back*MAXV;p.vy=-420;p.grounded=false;p.groundId=null;p.jumpsLeft=1;p.hurt=0.9;bumps++;}});// jack-o'-lantern bump: costs time only
  if(p.y>L.killY)return end({fell:true});
  if(hit(p.x,p.y,PW,PH,L.goal))return end({cleared:true});
  if(t>=TIME_LIMIT)return end({timeUp:true});
  prev=new Map(R.map(r=>[r.id,r]));}
 // --- view: integer world->device scale picked from the viewport (Boy ~1/5-1/6 of a portrait screen), crisp pixels ---
 const MIN_VIEW_W=299,MIN_VIEW_H=300;let cssK=1;// MIN_VIEW_W 299: ~1.26 CSS px per world px at 390 wide, so the Boy is ~72 CSS px
 function fit(){dpr=Math.max(1,Math.min(3,window.devicePixelRatio||1));cv.style.height="";cv.style.flex="";let b=cv.getBoundingClientRect();
  {const k=Math.max(0.25,Math.min(b.width/MIN_VIEW_W,b.height/MIN_VIEW_H,2)),maxH=(L.height+60)*k;if(b.height>maxH+1){cv.style.height=Math.floor(maxH)+"px";cv.style.flex="none";b=cv.getBoundingClientRect();}}// no tall empty sky
  cv.width=Math.max(1,Math.round(b.width*dpr));cv.height=Math.max(1,Math.round(b.height*dpr));
  // scale picked in CSS px (same look at 2x and 3x): at least MIN_VIEW_W world px across, so every gap and its landing
  // (the 360 px cooler-lid gap included) fits on one screen; capped for big screens.
  cssK=Math.max(0.25,Math.min(b.width/MIN_VIEW_W,b.height/MIN_VIEW_H,2));Z=cssK*dpr;vw=cv.width/Z;vh=cv.height/Z;g.imageSmoothingEnabled=false;}
 // ground gaps (for the edge warning that shows the next gap before it scrolls into view)
 const ground=L.solids.filter(s=>!s.oneWay&&!s.motion).sort((a,b)=>a.x-b.x),gaps=[];
 for(let i=1;i<ground.length;i++){const a=ground[i-1],b=ground[i];if(b.x>a.x+a.w+8)gaps.push({x:a.x+a.w,y:a.y,w:b.x-(a.x+a.w)});}
 // --- smooth follow camera: frame-rate independent easing (1-exp(-k dt)), dead zone, eased look-ahead, ground-anchored vertical ---
 const CAM_MAX_STEP=5.8;
 function camClamp(x,y){x=Math.max(0,Math.min(L.width-vw,x));y=vh>=L.height?L.height-vh:Math.max(0,Math.min(L.height-vh,y));return [x,y];}
 function updCam(dt,snap){const LOOK=Math.min(250,vw*0.46),DZ=Math.min(24,vw*0.06);
  if(Math.abs(p.vx)>40)lookT=Math.sign(p.vx)*LOOK;// keep the last direction when he stops
  if(snap)look=lookT;else{const dl=(lookT-look)*(1-Math.exp(-1.6*dt)),cap=150*dt;look+=Math.max(-cap,Math.min(cap,dl));}// eased and rate-limited so turns pan gently
  const foot=p.y+PH;if(p.grounded)anchorY=foot;else if(foot>anchorY+24)anchorY=foot;// no bob on hops; follow drops and falls
  const fx=p.x+PW/2+look;let d=fx-(camX+vw/2);d=Math.abs(d)<=DZ?0:d-Math.sign(d)*DZ;
  let ty=anchorY-vh*0.74;ty=Math.min(ty,p.y-vh*0.1);// keep his head in view on big jumps
  let [tx,cy]=camClamp(snap?fx-vw/2:camX+d,ty);
  const ox=camX,oy=camY;
  if(snap){camX=tx;camY=cy;}else{camX+=(tx-camX)*(1-Math.exp(-12*dt));camY+=(cy-camY)*(1-Math.exp(-4.5*dt));}
  [camX,camY]=camClamp(camX,camY);
  // hard per-frame speed limit: at most CAM_MAX_STEP world px per rendered frame (= 5.8*cssK CSS px: <=7.33 on a 390-wide phone, <=11.6 on desktop; QA caps 7.4 / 13.2)
  if(!snap){const mx=camX-ox,my=camY-oy,m=Math.hypot(mx,my);if(m>CAM_MAX_STEP){const k=CAM_MAX_STEP/m;camX=ox+mx*k;camY=oy+my*k;}}}
 function onResize(){fit();updCam(0,true);draw();}
 window.addEventListener("resize",onResize);
 function tile(im,x0,x1,y,w,h,sx){for(let x=x0;x<x1;x+=w){const ww=Math.min(w,x1-x);g.drawImage(im,sx||0,0,ww,h,x,y,ww,h);}}
 function drawHW(){const W=cv.width,H=cv.height,ox=Math.round(camX*Z),oy=Math.round(camY*Z);
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.1*Z),-oy);if(IM.sky)for(let x=Math.floor(camX*0.1/380)*380;x<camX*0.1+vw+380;x+=380)g.drawImage(IM.sky,x,0);else{g.fillStyle="#1d2333";g.fillRect(camX*0.1,0,vw,VIEW_H);}
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.3*Z),-oy);if(IM.far)for(let x=Math.floor(camX*0.3/380)*380;x<camX*0.3+vw+380;x+=380){g.drawImage(IM.far,x,230);if(IM.tower)g.drawImage(IM.tower,x+200,242);}
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.6*Z),-oy);if(IM.mid)for(let x=Math.floor(camX*0.6/380)*380;x<camX*0.6+vw+380;x+=380)g.drawImage(IM.mid,x,310);
  g.setTransform(Z,0,0,Z,-ox,-oy);
  if(IM.leaf)tile(IM.leaf,0,L.width,500,24,40);else{g.fillStyle="#a0521e";g.fillRect(0,500,L.width,40);}// leaf pile under the gaps
  if(IM.porch)g.drawImage(IM.porch,-40,270);if(IM.sign)g.drawImage(IM.sign,200,390);
  if(IM.web){const w=L.web;g.drawImage(IM.web,w.x+w.w/2-80,w.y);}// cobweb_gap, decorative (not sticky)
  L.solids.forEach(s=>{const r=rectAt(s,t);if(s.wagon&&IM.wagon)g.drawImage(IM.wagon,r.x,r.y);else if(r.oneWay&&IM.plat)tile(IM.plat,r.x,r.x+r.w,r.y,60,14);
   else if(IM.ground){tile(IM.ground,r.x,r.x+r.w,r.y,60,40);g.fillStyle="#4a3524";g.fillRect(r.x,r.y+40,r.w,Math.max(0,r.h-40));}
   else{g.fillStyle=r.oneWay?"#b9b2a4":"#4a4250";g.fillRect(r.x,r.y,r.w,r.oneWay?6:r.h);}});
  const G=L.goal;if(IM.van){const vx=G.x-60,vy=410-104;g.drawImage(IM.van,vx,vy);if(IM.door)g.drawImage(IM.door,vx+84,vy+62);}
  (L.hazards||[]).forEach((h,i)=>{if(IM.jack)g.drawImage(IM.jack,((Math.floor(t*3)+i)%2)*20,0,20,20,h.x,h.y,20,20);else{g.fillStyle="#e07a1a";g.fillRect(h.x,h.y,20,20);}});
  L.coins.forEach((c,i)=>{if(got.has(c.id))return;const bob=Math.sin(t*4+i)*4;if(IM.candy)g.drawImage(IM.candy,((Math.floor(t*8)+i)%4)*12,0,12,16,c.x-6,c.y-8+bob,12,16);else{g.fillStyle="#c0392b";g.fillRect(c.x-5,c.y-8+bob,10,16);}});}
 function drawAL(){const oy=Math.round(camY*Z),ox=Math.round(camX*Z);
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.1*Z),-oy);if(IM.sky)for(let x=Math.floor(camX*0.1/380)*380;x<camX*0.1+vw+380;x+=380)g.drawImage(IM.sky,x,0);else{g.fillStyle="#c9c3b4";g.fillRect(camX*0.1,0,vw,VIEW_H);}
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.3*Z),-oy);if(IM.far)for(let x=Math.floor(camX*0.3/380)*380;x<camX*0.3+vw+380;x+=380){g.drawImage(IM.far,x,230);if(IM.tower)g.drawImage(IM.tower,x+200,242);}
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.6*Z),-oy);if(IM.mid)for(let x=Math.floor(camX*0.6/380)*380;x<camX*0.6+vw+380;x+=380)g.drawImage(IM.mid,x,290);
  g.setTransform(Z,0,0,Z,-ox,-oy);const J=L.jet,V=L.vent;
  if(IM.mid)g.drawImage(IM.mid,149,26,92,114,J.fence.x,J.fence.y,92,114);// fence section (from parallax_mid) the water jet is mounted on
  if(IM.gate)g.drawImage(IM.gate,-40,270);if(IM.sign)g.drawImage(IM.sign,180,390);
  L.solids.forEach(s=>{const r=rectAt(s,t),im=IM[s.kind];if(s.kind==="cart"&&im)g.drawImage(im,r.x,r.y);
   else if(im&&(s.kind==="dumpster"||s.kind==="table"||s.kind==="boxes"||s.kind==="heater"))g.drawImage(im,r.x,r.y);
   else if(r.oneWay&&IM.plat)tile(IM.plat,r.x,r.x+r.w,r.y,60,14);
   else if(IM.ground){tile(IM.ground,r.x,r.x+r.w,r.y,60,40);g.fillStyle="#2a292e";g.fillRect(r.x,r.y+40,r.w,Math.max(0,r.h-40));}
   else{g.fillStyle=r.oneWay?"#b9b2a4":"#3a3940";g.fillRect(r.x,r.y,r.w,r.oneWay?6:r.h);}});
  (L.puddles||[]).forEach((q,i)=>{if(IM.puddle)g.drawImage(IM.puddle,((Math.floor(t*2)+i)%2)*40,0,40,6,q.x,q.y,40,6);else{g.fillStyle="#6a8fc0";g.fillRect(q.x,q.y,40,6);}});
  if(IM.jet)g.drawImage(IM.jet,Math.floor((t%2.4)/0.6)*60,0,60,40,J.x,J.y,60,40);
  if(IM.vent)g.drawImage(IM.vent,V.x,V.y);if(IM.steam&&L.ventOn(t))g.drawImage(IM.steam,(Math.floor(t*6)%3)*32,0,32,32,V.x-6,V.y-30,32,32);
  const G=L.goal;if(IM.van){const vx=G.x-60,vy=410-104;g.drawImage(IM.van,vx,vy);if(IM.door)g.drawImage(IM.door,vx+40,vy+46);}
  L.coins.forEach((c,i)=>{if(got.has(c.id))return;const bob=Math.sin(t*4+i)*4;if(IM.chile)g.drawImage(IM.chile,((Math.floor(t*8)+i)%4)*12,0,12,16,c.x-6,c.y-8+bob,12,16);else{g.fillStyle="#ef4b3a";g.fillRect(c.x-5,c.y-8+bob,10,16);}});}
 function drawHO(){const oy=Math.round(camY*Z),ox=Math.round(camX*Z),bt=BT,b=beatAt(bt),hf=hazFrameE5(bt),rf=radioFrameE5(bt);
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.1*Z),-oy);if(IM.sky)for(let x=Math.floor(camX*0.1/380)*380;x<camX*0.1+vw+380;x+=380)g.drawImage(IM.sky,x,0);else{g.fillStyle="#3a3350";g.fillRect(camX*0.1,0,vw,VIEW_H);}
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.3*Z),-oy);if(IM.far)for(let x=Math.floor(camX*0.3/380)*380;x<camX*0.3+vw+380;x+=380)g.drawImage(IM.far,x,230);
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.6*Z),-oy);if(IM.mid)for(let x=Math.floor(camX*0.6/380)*380;x<camX*0.6+vw+380;x+=380)g.drawImage(IM.mid,x,290);
  g.setTransform(Z,0,0,Z,-ox,-oy);
  g.fillStyle="#241a14";g.fillRect(0,470,L.width,70);// trench floor (decor; the pits still end the run)
  if(IM.house)g.drawImage(IM.house,-40,270);if(IM.post)g.drawImage(IM.post,160,390);if(IM.sign)g.drawImage(IM.sign,161,391);
  L.cords.forEach(c=>{if(IM.cord)g.drawImage(IM.cord,(b.bi%4)*40,0,40,120,c.x,c.y,40,120);});// decor only: one frame per beat
  L.solids.forEach(s=>{const r=rectAt(s,t),im=IM[s.kind];
   if(s.kind==="plank"&&im)tile(im,r.x,r.x+r.w,r.y,60,14);
   else if(s.kind==="rack"&&im)g.drawImage(im,r.x,r.y);
   else if(im&&s.kind)g.drawImage(im,r.x,r.y);
   else if(IM.ground){tile(IM.ground,r.x,r.x+r.w,r.y,60,40);g.fillStyle="#3b2e26";g.fillRect(r.x,r.y+40,r.w,Math.max(0,r.h-40));}
   else{g.fillStyle=r.oneWay?"#b9b2a4":"#5a4a3a";g.fillRect(r.x,r.y,r.w,r.oneWay?6:r.h);}});
  if(IM.mud)g.drawImage(IM.mud,900,424);
  const Sn=L.snap,Sp=L.splash;if(IM.snap)g.drawImage(IM.snap,hf*40,0,40,30,Sn.x,Sn.y,40,30);else if(hf===2){g.fillStyle="#d7c07a";g.fillRect(Sn.x+6,Sn.y+8,28,22);}
  if(IM.splash)g.drawImage(IM.splash,hf*40,0,40,20,Sp.x,Sp.y,40,20);else if(hf===2){g.fillStyle="#7a5a3a";g.fillRect(Sp.x,Sp.y,40,20);}
  L.radios.forEach(r=>{if(IM.radio)g.drawImage(IM.radio,rf*24,0,24,24,r.x,r.y,24,24);});
  if(IM.notes)g.drawImage(IM.notes,(b.sting?4:b.beat)*32,0,32,32,L.notes.x,L.notes.y,32,32);
  if(IM.lamp)g.drawImage(IM.lamp,(b.sting?1:0)*20,0,20,20,L.lamp.x,L.lamp.y,20,20);
  const V=L.van;if(IM.van){g.drawImage(IM.van,V.x,V.y);if(IM.door)g.drawImage(IM.door,V.x+84,V.y+62);}else{g.fillStyle="#e8c23a";g.fillRect(V.x,V.y+20,196,70);}
  L.coins.forEach((c,i)=>{if(got.has(c.id))return;const bob=Math.sin(t*4+i)*4;if(IM.chile)g.drawImage(IM.chile,((Math.floor(t*8)+i)%4)*12,0,12,16,c.x-6,c.y-8+bob,12,16);else{g.fillStyle="#ef4b3a";g.fillRect(c.x-5,c.y-8+bob,10,16);}});}
 function draw(){const W=cv.width,H=cv.height;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;
  if(HO){drawHO();const ox=Math.round(camX*Z),oy=Math.round(camY*Z);g.setTransform(Z,0,0,Z,-ox,-oy);g.save();drawBoyEtc();return;}
  if(AL){drawAL();const ox=Math.round(camX*Z),oy=Math.round(camY*Z);g.setTransform(Z,0,0,Z,-ox,-oy);g.save();drawBoyEtc();return;}
  if(HW){drawHW();const ox=Math.round(camX*Z),oy=Math.round(camY*Z);g.setTransform(Z,0,0,Z,-ox,-oy);g.save();drawBoyEtc();return;}
  const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#2a1c34");sky.addColorStop(1,"#5a3a4a");g.fillStyle=sky;g.fillRect(0,0,W,H);
  const ox=Math.round(camX*Z),oy=Math.round(camY*Z);// rounded device-pixel offset keeps pixels crisp
  g.setTransform(Z,0,0,Z,-Math.round(camX*0.35*Z),-oy);g.fillStyle="#3b2a40";const span=Math.ceil((vw+camX*0.35)/380)+2;
  for(let i=Math.floor(camX*0.35/380)-1;i<span;i++){const xx=i*380;g.fillRect(xx,250,180,180);g.beginPath();g.moveTo(xx-14,250);g.lineTo(xx+90,190);g.lineTo(xx+194,250);g.fill();}
  g.setTransform(Z,0,0,Z,-ox,-oy);g.save();
  g.fillStyle="#3f6b2e";g.fillRect(0,500,L.width,40);// hedge below gaps: soft landing
  g.fillStyle="#4f8a3a";for(let x=0;x<L.width;x+=24){g.beginPath();g.arc(x+12,502,14,Math.PI,0);g.fill();}
  L.solids.forEach(s=>{const r=rectAt(s,t);if(r.oneWay){g.fillStyle="#b9b2a4";g.fillRect(r.x,r.y,r.w,6);g.fillStyle="#8a8a7a";for(let x=r.x;x<r.x+r.w;x+=20)g.fillRect(x,r.y+6,4,8);}
   else{g.fillStyle="#7d7468";g.fillRect(r.x,r.y,r.w,r.h);g.fillStyle="#9c9283";g.fillRect(r.x,r.y,r.w,8);}});
  // Ms. Reyes’s front step at the start; the van (yellow, stripes) with its tool bin, bucket and chisel at the goal. Placeholder, no logos or text.
  g.fillStyle="#c9b28a";g.fillRect(-40,250,190,160);g.fillStyle="#8a5a3a";g.beginPath();g.moveTo(-60,250);g.lineTo(55,190);g.lineTo(170,250);g.fill();g.fillStyle="#5a3a2a";g.fillRect(70,330,44,80);g.fillStyle="#f3e2a0";g.fillRect(0,300,44,34);
  const G=L.goal;g.fillStyle="#e8c23a";g.fillRect(G.x-60,G.y+20,190,90);g.fillStyle="#7bd34a";g.fillRect(G.x-60,G.y+60,190,8);g.fillStyle="#ef6aa0";g.fillRect(G.x-60,G.y+72,190,6);
  g.fillStyle="#222";g.beginPath();g.arc(G.x-20,G.y+112,16,0,7);g.arc(G.x+95,G.y+112,16,0,7);g.fill();g.fillStyle="#c0392b";g.fillRect(G.x+10,G.y-4,60,26);g.fillStyle="#8e2a20";g.fillRect(G.x+10,G.y+6,60,4);g.fillStyle="#c8c8c0";g.fillRect(G.x+80,G.y-18,26,24);g.fillStyle="#9a9a92";g.fillRect(G.x+78,G.y-20,30,4);g.fillStyle="#d9d9d9";g.fillRect(G.x+30,G.y-14,4,14);
  L.coins.forEach((c,i)=>{if(got.has(c.id))return;const bob=Math.sin(t*4+i)*4;g.save();g.translate(c.x,c.y+bob);g.rotate(-0.5);g.fillStyle="#ef4b3a";g.beginPath();g.ellipse(0,0,7,15,0,0,7);g.fill();g.fillStyle="#3c8d2f";g.fillRect(-3,-19,6,6);g.restore();});
  drawBoyEtc();}
 function drawBoyEtc(){const W=cv.width,H=cv.height;
  // the Boy (sprite if loaded, else shapes)
  const fx=Math.round(p.x)-6,fy=Math.round(p.y)-6;
  if(boyOk){const fr=Math.floor(p.anim*6)%2,bw=BF[0],bh=BF[1],by=fy+60-bh;g.save();if(p.hurt>0&&Math.floor(p.hurt*12)%2)g.globalAlpha=0.45;if(p.facing<0){g.translate(fx+bw,0);g.scale(-1,1);g.drawImage(boy,fr*bw,0,bw,bh,0,by,bw,bh);}else g.drawImage(boy,fr*bw,0,bw,bh,fx,by,bw,bh);g.restore();}
  else{g.fillStyle="#e8c23a";g.fillRect(p.x,p.y+16,PW,24);g.fillStyle="#2e4a7a";g.fillRect(p.x+2,p.y+40,PW-4,14);g.fillStyle="#c98e5c";g.fillRect(p.x+5,p.y+2,18,16);g.fillStyle="#c0392b";g.fillRect(p.x+3,p.y,22,6);}
  // edge warning: the next gap, before it scrolls into view
  const nx=gaps.find(q=>q.x>camX+vw-4&&q.x<camX+vw+320&&lookT>0);if(nx&&mode==="play"){const ax=camX+vw-10,ay=nx.y-26;g.fillStyle="#ef4b3a";g.beginPath();g.moveTo(ax+8,ay);g.lineTo(ax-4,ay-8);g.lineTo(ax-4,ay+8);g.fill();g.fillStyle=HW?"#a0521e":"#4f8a3a";g.fillRect(ax-6,ay+12,14,4);}
  g.restore();g.setTransform(1,0,0,1,0,0);
  if(mode!=="play"){g.fillStyle="rgba(22,16,31,.78)";g.fillRect(0,0,W,H);g.fillStyle="#fff3e4";const fs=Math.round(Math.min(W/12,34*dpr));g.font="bold "+fs+"px system-ui,sans-serif";g.textAlign="center";g.fillText(msg,W/2,H/2-fs*0.3);g.font=Math.round(fs*0.65)+"px system-ui,sans-serif";g.fillText((HW?"Candy ":"Chilies ")+got.size+"/"+total,W/2,H/2+fs*0.9);if(HW&&mode==="over"&&result&&!result.skipped){const lo=result.band==="low",im=lo?IM.grab:IM.tea,k=Math.max(1,Math.round(fs/14));if(im){const sw=lo?32:40,sh=lo?32:60;g.drawImage(im,0,0,sw,sh,Math.round(W/2-sw*k/2),Math.round(H/2-fs*1.4-sh*k),sw*k,sh*k);}}/* Ep3 ending: pumpkin spice tea, or the skeleton grabber */if(mode==="over"&&!(result&&result.skipped)){g.fillStyle="#d7c07a";g.font=Math.round(fs*0.55)+"px system-ui,sans-serif";g.fillText("Tap to continue",W/2,H/2+fs*1.9);}g.textAlign="left";}
  hud.textContent=(HW?"🍬 ":"🌶 ")+got.size+"/"+total+" · "+Math.max(0,Math.ceil(TIME_LIMIT-t))+"s";}
 function end(o){if(mode!=="play")return;mode="over";if(MU)MU.mute(true);cancelAnimationFrame(raf);
  result=finish({level:HO?"ep05":HW?"ep03":AL?"ep04":"ep02",bumps,chilies:o.skipped?0:got.size,total,fell:!!o.fell,cleared:!!o.cleared,skipped:!!o.skipped,timeUp:!!o.timeUp,secs:Math.round(t*10)/10});
  msg=o.skipped?"Skipped":o.fell?(HO?"Into the trench!":HW?"Into the leaf pile!":AL?"Down the drain gap!":"Into the hedge!"):o.cleared?(result.fullClear?"Full clear!":"Made it to the van"):"Time's up";draw();
  if(!o.skipped){const a=document.createElement("a");a.className="pr-merch";a.href=opts.merchLink||MERCH_LINK;a.target="_blank";a.rel="noopener";a.textContent="Get the Merch";const pad=root.querySelector(".pr-pad");if(pad){pad.style.height=pad.offsetHeight+"px";pad.style.justifyContent="center";pad.style.alignItems="center";for(const c of pad.children)c.style.display="none";pad.appendChild(a);}else{const hint=root.querySelector(".pr-hint");root.insertBefore(a,hint);}/* merch takes the d-pad slot (the pad is not needed on the summary), so the canvas keeps its size */fit();[camX,camY]=camClamp(camX,camY);draw();}// no camera snap at the end
  if(o.skipped){close();return;}
  // result summary waits for a tap, click or key (not a timer). The input that ended the run is ignored for 300 ms.
  const armAt=performance.now()+300,sk=root.querySelector(".pr-skip");sk.textContent="Continue";sk.setAttribute("aria-label","Continue");
  contGo=e=>{if(closed||performance.now()<armAt)return;if(e.target&&e.target.closest&&e.target.closest(".pr-merch"))return;
   if(e.type==="keydown"&&(e.repeat||["Shift","Control","Alt","Meta","Tab"].indexOf(e.key)>=0))return;if(e.cancelable)e.preventDefault();close();};
  root.addEventListener("pointerup",contGo);root.addEventListener("touchend",contGo);window.addEventListener("keydown",contGo);}
 function close(){if(closed)return;closed=true;if(MU)MU.stop();cancelAnimationFrame(raf);clearInterval(endTimer);if(contGo)window.removeEventListener("keydown",contGo);
  window.removeEventListener("keydown",onKey);window.removeEventListener("keyup",onKey);window.removeEventListener("resize",onResize);
  root.remove();if(window.__pepperRun===qa)delete window.__pepperRun;done(result);}
 function frame(ts){if(mode!=="play")return;if(MU)MU.sync(t);if(!last)last=ts;let dt=Math.min(0.1,(ts-last)/1000);last=ts;acc+=dt;while(acc>=1/60&&mode==="play"){step(1/60);acc-=1/60;}if(mode==="play"){updCam(dt,false);if(camLog.length<4000)camLog.push([Math.round(t*1000),+camX.toFixed(2),+camY.toFixed(2),Z,+p.x.toFixed(1)]);}draw();if(mode==="play")raf=requestAnimationFrame(frame);}
 fit();updCam(0,true);draw();raf=requestAnimationFrame(frame);// snap to the Boy on start
 // QA hook: lets tests drive the run with simulated input
 const qa=window.__pepperRun={camLog,state:()=>({x:p.x,y:p.y,t,bt:BT,beat:HO?beatAt(BT):null,haz:HO?hazFrameE5(BT):null,music:MU?MU.ac.state:null,chilies:got.size,mode,sprite:boyOk,camX,camY,Z,dpr,cssK,vw,vh}),press:(k,on)=>{touch[k]=!!on;},end:o=>end(o||{skipped:true})};
 return null;}
window.PepperRun={start,band,TIME_LIMIT,level,MERCH_LINK,beatAt,hazFrameE5,radioFrameE5};
})();
