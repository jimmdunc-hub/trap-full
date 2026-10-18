/* TRAP FULL × Pepper Pipe — "Pepper Run" prototype (pitch A). Vanilla JS, no dependencies, no network.
   Movement constants and the jump model (coyote time, jump buffer, double jump, variable height, one-way
   platforms) are ported from Piquin's own Pepper Pipe (routes.pretty.js). Placeholder art; Art restyles later.
   API: PepperRun.start({parent, assetBase, boySrc, forceResult, onDone}); returns false if a run is already open
   result = {chilies, total, fell, cleared, fullClear, skipped, timeUp, band:"high"|"mid"|"low", secs}
   forceResult (QA): a number 0-total, "fall", "clear" or "skip" returns that result without playing. */
(function(){
"use strict";
// --- constants from Pepper Pipe ---
const MAXV=252,ACC_G=1900,ACC_A=1280,FRIC_G=2400,FRIC_A=260,JUMP1=-548,JUMP2=-492,GRAV_UP=1480,GRAV_DN=2860,APEX=86,MAXFALL=880,COYOTE=0.11,BUFFER=0.13;
// Same link as the game's ending cards.
const MERCH_LINK="https://jimmdunc-hub.github.io/links/?utm_source=trapfull";
const PW=28,PH=54,VIEW_W=960,VIEW_H=540,TIME_LIMIT=45;
const KEYS={left:["ArrowLeft","KeyA"],right:["ArrowRight","KeyD"],jump:["ArrowUp","KeyW","Space"],drop:["ArrowDown","KeyS"]};
// --- one short level (Ep2, Ms. Reyes’s job): her front step -> hedges, ladder racks, cooler lid -> the van's tool bin ---
function level(){
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
function rectAt(s,t){let x=s.x,y=s.y;if(s.motion){const v=Math.sin(t/s.motion.period*Math.PI*2+s.motion.phase);if(s.motion.axis==="x")x+=v*s.motion.amp;else y+=v*s.motion.amp;}return {id:s.id,x,y,w:s.w,h:s.h,oneWay:s.oneWay};}
function hit(x,y,w,h,r){return x<r.x+r.w&&x+w>r.x&&y<r.y+r.h&&y+h>r.y;}
function band(r){if(r.fell)return "low";if(r.chilies>=8)return "high";if(r.chilies>=4)return "mid";return "low";}
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
function start(opts){opts=opts||{};const L=level();const total=L.coins.length;const done=typeof opts.onDone==="function"?opts.onDone:function(){};
 if(document.getElementById("pepperRun"))return false;// one run at a time: false = refused
 if(opts.forceResult!==undefined&&opts.forceResult!==null&&opts.forceResult!==""){const r=forced(String(opts.forceResult),total);setTimeout(()=>done(r),0);return r;}
 css();const base=opts.assetBase===undefined?"assets/img/":opts.assetBase;
 const root=document.createElement("div");root.id="pepperRun";root.setAttribute("role","dialog");root.setAttribute("aria-label","Pepper Run minigame");
 root.innerHTML='<div class="pr-top"><span class="pr-title">Pepper Run</span><span class="pr-hud" aria-live="polite"></span><button type="button" class="pr-skip">Skip</button></div>'+
  '<canvas width="390" height="400" aria-label="The Boy runs from Ms. Reyes’s house to the van, collecting chilies"></canvas>'+
  '<div class="pr-hint">Ms. Reyes’s kitchen slab. Pete needs a bucket, chisel and dust mask from the van. Get the {boy} out to the van and grab chilies on the way. Arrows/A-D run, Up/W/Space jump (twice in the air), Down drops through the ladder racks, Esc skips.</div>'.replace("{boy}","Boy")+
  '<div class="pr-pad"><div><button type="button" data-k="left" aria-label="Run left">◀</button><button type="button" data-k="right" aria-label="Run right">▶</button></div><div><button type="button" data-k="drop" aria-label="Drop down">▼</button><button type="button" data-k="jump" aria-label="Jump">▲</button></div></div>';
 (opts.parent||document.body).appendChild(root);
 const cv=root.querySelector("canvas"),g=cv.getContext("2d"),hud=root.querySelector(".pr-hud");g.imageSmoothingEnabled=false;
 const boy=new Image();let boyOk=false;boy.onload=()=>{boyOk=true;};boy.onerror=()=>{boyOk=false;};boy.src=opts.boySrc||(base+"boy_idle.png");// boySrc: a data URL in self-contained builds
 const held=new Set(),touch={left:false,right:false,jump:false,drop:false};
 const down=k=>KEYS[k].some(c=>held.has(c))||touch[k];
 const onKey=e=>{if(e.code==="Escape"){e.preventDefault();end({skipped:true});return;}if(Object.values(KEYS).some(a=>a.indexOf(e.code)>=0)){e.preventDefault();e.type==="keydown"?held.add(e.code):held.delete(e.code);}};
 window.addEventListener("keydown",onKey);window.addEventListener("keyup",onKey);
 root.querySelectorAll(".pr-pad button").forEach(b=>{const k=b.dataset.k;const on=e=>{e.preventDefault();touch[k]=true;b.classList.add("on");},off=e=>{e.preventDefault();touch[k]=false;b.classList.remove("on");};
  b.addEventListener("touchstart",on,{passive:false});b.addEventListener("touchend",off,{passive:false});b.addEventListener("touchcancel",off,{passive:false});
  b.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch")on(e);});b.addEventListener("pointerup",e=>{if(e.pointerType!=="touch")off(e);});b.addEventListener("pointerleave",e=>{if(e.pointerType!=="touch")off(e);});});
 root.querySelector(".pr-skip").onclick=()=>end({skipped:true});
 const p={x:L.spawn.x,y:L.spawn.y,vx:0,vy:0,facing:1,grounded:false,groundId:null,jumpsLeft:2,coyote:0,buffer:0,jumpWas:false,cutArmed:false,dropTimer:0,airTime:0,anim:0};
 let t=0,camX=0,camY=0,look=0,lookT=0,anchorY=L.spawn.y+PH,Z=1,dpr=1,vw=VIEW_W,vh=VIEW_H,closeAt=0,closed=false,contGo=null,camLog=[],mode="play",got=new Set(),prev=new Map(L.solids.map(s=>[s.id,rectAt(s,0)])),raf=0,last=0,acc=0,result=null,endTimer=0,msg="";
 function step(dt){t+=dt;p.dropTimer=Math.max(0,p.dropTimer-dt);p.anim+=dt;
  const R=L.solids.map(s=>rectAt(s,t)),M=new Map(R.map(r=>[r.id,r]));
  if(p.groundId){const a=M.get(p.groundId),b=prev.get(p.groundId);if(a&&b){p.x+=a.x-b.x;p.y+=a.y-b.y;}}
  let dir=(down("left")?-1:0)+(down("right")?1:0);const ac=p.grounded?ACC_G:ACC_A;
  if(dir){p.vx+=dir*ac*dt;p.facing=dir;}else{const f=(p.grounded?FRIC_G:FRIC_A)*dt;p.vx=Math.abs(p.vx)<=f?0:p.vx-Math.sign(p.vx)*f;}
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
 function camClamp(x,y){x=Math.max(0,Math.min(L.width-vw,x));y=vh>=L.height?L.height-vh:Math.max(0,Math.min(L.height-vh,y));return [x,y];}
 function updCam(dt,snap){const LOOK=Math.min(250,vw*0.46),DZ=Math.min(24,vw*0.06);
  if(Math.abs(p.vx)>40)lookT=Math.sign(p.vx)*LOOK;// keep the last direction when he stops
  if(snap)look=lookT;else{const dl=(lookT-look)*(1-Math.exp(-1.6*dt)),cap=150*dt;look+=Math.max(-cap,Math.min(cap,dl));}// eased and rate-limited so turns pan gently
  const foot=p.y+PH;if(p.grounded)anchorY=foot;else if(foot>anchorY+24)anchorY=foot;// no bob on hops; follow drops and falls
  const fx=p.x+PW/2+look;let d=fx-(camX+vw/2);d=Math.abs(d)<=DZ?0:d-Math.sign(d)*DZ;
  let ty=anchorY-vh*0.74;ty=Math.min(ty,p.y-vh*0.1);// keep his head in view on big jumps
  let [tx,cy]=camClamp(snap?fx-vw/2:camX+d,ty);
  if(snap){camX=tx;camY=cy;}else{camX+=(tx-camX)*(1-Math.exp(-12*dt));camY+=(cy-camY)*(1-Math.exp(-4.5*dt));}
  [camX,camY]=camClamp(camX,camY);}
 function onResize(){fit();updCam(0,true);draw();}
 window.addEventListener("resize",onResize);
 function draw(){const W=cv.width,H=cv.height;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;
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
  // the Boy (sprite if loaded, else shapes)
  const fx=Math.round(p.x)-6,fy=Math.round(p.y)-6;
  if(boyOk){const fr=Math.floor(p.anim*6)%2;g.save();if(p.facing<0){g.translate(fx+40,0);g.scale(-1,1);g.drawImage(boy,fr*40,0,40,60,0,fy,40,60);}else g.drawImage(boy,fr*40,0,40,60,fx,fy,40,60);g.restore();}
  else{g.fillStyle="#e8c23a";g.fillRect(p.x,p.y+16,PW,24);g.fillStyle="#2e4a7a";g.fillRect(p.x+2,p.y+40,PW-4,14);g.fillStyle="#c98e5c";g.fillRect(p.x+5,p.y+2,18,16);g.fillStyle="#c0392b";g.fillRect(p.x+3,p.y,22,6);}
  // edge warning: the next gap, before it scrolls into view
  const nx=gaps.find(q=>q.x>camX+vw-4&&q.x<camX+vw+320&&lookT>0);if(nx&&mode==="play"){const ax=camX+vw-10,ay=nx.y-26;g.fillStyle="#ef4b3a";g.beginPath();g.moveTo(ax+8,ay);g.lineTo(ax-4,ay-8);g.lineTo(ax-4,ay+8);g.fill();g.fillStyle="#4f8a3a";g.fillRect(ax-6,ay+12,14,4);}
  g.restore();g.setTransform(1,0,0,1,0,0);
  if(mode!=="play"){g.fillStyle="rgba(22,16,31,.78)";g.fillRect(0,0,W,H);g.fillStyle="#fff3e4";const fs=Math.round(Math.min(W/12,34*dpr));g.font="bold "+fs+"px system-ui,sans-serif";g.textAlign="center";g.fillText(msg,W/2,H/2-fs*0.3);g.font=Math.round(fs*0.65)+"px system-ui,sans-serif";g.fillText("Chilies "+got.size+"/"+total,W/2,H/2+fs*0.9);if(mode==="over"&&!(result&&result.skipped)){g.fillStyle="#d7c07a";g.font=Math.round(fs*0.55)+"px system-ui,sans-serif";g.fillText("Tap to continue",W/2,H/2+fs*1.9);}g.textAlign="left";}
  hud.textContent="🌶 "+got.size+"/"+total+" · "+Math.max(0,Math.ceil(TIME_LIMIT-t))+"s";}
 function end(o){if(mode!=="play")return;mode="over";cancelAnimationFrame(raf);
  result=finish({chilies:o.skipped?0:got.size,total,fell:!!o.fell,cleared:!!o.cleared,skipped:!!o.skipped,timeUp:!!o.timeUp,secs:Math.round(t*10)/10});
  msg=o.skipped?"Skipped":o.fell?"Into the hedge!":o.cleared?(result.fullClear?"Full clear!":"Made it to the van"):"Time's up";draw();
  if(!o.skipped){const a=document.createElement("a");a.className="pr-merch";a.href=opts.merchLink||MERCH_LINK;a.target="_blank";a.rel="noopener";a.textContent="Get the Merch";const hint=root.querySelector(".pr-hint");root.insertBefore(a,hint);fit();[camX,camY]=camClamp(camX,camY);draw();}// no camera snap at the end
  if(o.skipped){close();return;}
  // result summary waits for a tap, click or key (not a timer). The input that ended the run is ignored for 300 ms.
  const armAt=performance.now()+300,sk=root.querySelector(".pr-skip");sk.textContent="Continue";sk.setAttribute("aria-label","Continue");
  contGo=e=>{if(closed||performance.now()<armAt)return;if(e.target&&e.target.closest&&e.target.closest(".pr-merch"))return;
   if(e.type==="keydown"&&(e.repeat||["Shift","Control","Alt","Meta","Tab"].indexOf(e.key)>=0))return;if(e.cancelable)e.preventDefault();close();};
  root.addEventListener("pointerup",contGo);root.addEventListener("touchend",contGo);window.addEventListener("keydown",contGo);}
 function close(){if(closed)return;closed=true;cancelAnimationFrame(raf);clearInterval(endTimer);if(contGo)window.removeEventListener("keydown",contGo);
  window.removeEventListener("keydown",onKey);window.removeEventListener("keyup",onKey);window.removeEventListener("resize",onResize);
  root.remove();if(window.__pepperRun===qa)delete window.__pepperRun;done(result);}
 function frame(ts){if(mode!=="play")return;if(!last)last=ts;let dt=Math.min(0.1,(ts-last)/1000);last=ts;acc+=dt;while(acc>=1/60&&mode==="play"){step(1/60);acc-=1/60;}if(mode==="play"){updCam(dt,false);if(camLog.length<4000)camLog.push([Math.round(t*1000),+camX.toFixed(2),+camY.toFixed(2),Z,+p.x.toFixed(1)]);}draw();if(mode==="play")raf=requestAnimationFrame(frame);}
 fit();updCam(0,true);draw();raf=requestAnimationFrame(frame);// snap to the Boy on start
 // QA hook: lets tests drive the run with simulated input
 const qa=window.__pepperRun={camLog,state:()=>({x:p.x,y:p.y,t,chilies:got.size,mode,sprite:boyOk,camX,camY,Z,dpr,cssK,vw,vh}),press:(k,on)=>{touch[k]=!!on;},end:o=>end(o||{skipped:true})};
 return null;}
window.PepperRun={start,band,TIME_LIMIT,level,MERCH_LINK};
})();
