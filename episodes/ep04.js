// TRAP FULL — Episode 4: "No Hot Water". Data only (schema 1); engine is index.html.
// Spec: design/episodes/ep4-pick.md (approved by Piquin Oct 19 2026) + design/characters/hvac-rival.md (Hector).
// Doc flag `powerOff` is the engine's drift-stop flag `mainOff` here (breaker off and labeled).
// Doc flag `causeFound` is computed in resolve (Director tuning Oct 19): any of scorch marks read (e4_03), furnace ruled out with a test (e4_06) or tank flushed (e4_09).
// Hot Again needs cause found + run till clear (tested) + T&P check (tpChecked); every other choice only moves meters.
// Seeded cause per run (element 45% / thermostat 35% / sediment 20%): three chained events at e4_08 (one fires: 0.45, then 0.35/0.55, then 1).
// Gas beat (e4_04) is walk-out only: no repair choices, everyone leaves, the gas utility is called from outside.
// Art: Ep4 batch from Art (assets/README.md "Ep4 No Hot Water", docs/art/contact_sheet_ep4.png) plus reused Ep0–Ep3 art.
// Ep4 upgrade (ep4-upgrade, Oct 24 2026): Ep3-upgrade parity: tip-ending pass, ui3 skin (chips/stakes/meter feedback/timer), diagnose choices (heater data plate, T&P discharge line),
// e4_09 8s timed beat, new e4_11b scald/thermostat scene, Pepper Run Rep payoff, Scorch Marks middle variant, secret bonus ending "Spa Day" (all appended; no ids or indexes removed).
// Ep4 pacing (ep4-pacing, Oct 24 2026, Director-approved scope): three scenes appended: e4_05b breaker lockout/verify-dead (electric heater only; breaker-off path),
// e4_08b anode rod, e4_11c drain pan + thermal expansion (UPC 507.5 / IPC 504.7; UPC 608.3 / IPC 607.3). No ids or choice indexes removed.
// Hector uses the Ep4 bible frames (hector_point/shrug/clipboard/slowclap) here only; Ep3 keeps hector_hvac.
(function(){
function spr(file,n,w,h,s,f,alt){const kf={2:"p2",3:"k3",4:"p4"}[n];
 const pos=(typeof f==="number"&&n>1)?(f/(n-1)*100)+"% 0":"0 0";
 const anim=(typeof f!=="number"&&kf)?";animation:"+kf+" "+(n*0.3)+"s steps("+n+") infinite":"";
 return '<span role="img" aria-label="'+(alt||"")+'" style="display:inline-block;vertical-align:middle;width:'+(w*s)+'px;height:'+(h*s)+'px;background-image:url(assets/img/'+file+');background-size:'+(n*100)+'% 100%;background-position:'+pos+';image-rendering:pixelated'+anim+'"></span>';}
const BUZZ=spr("fx_phone_buzz.png",4,32,32,2,undefined,"Phone buzzing");
const HECTOR_PH=spr("portrait_hector.png",1,32,32,2,undefined,"Hector on the phone");
const DARLENE=spr("darlene_phone.png",2,48,48,2,undefined,"Darlene on the phone");
const TEA=spr("boy_sweettea.png",2,40,60,1.5,undefined,"The Boy with a gallon of sweet tea");
const NOTE=spr("prop_dale_relit_note.png",1,16,16,2,undefined,"Dale's sticky note: RELIT IT");
const LITTER=spr("prop_kitty_litter.png",1,24,32,1.5,undefined,"Bag of kitty litter");
const GEYSER=spr("fx_sediment_geyser.png",2,64,64,1.5,undefined,"Brown sediment geyser");
const br="<br>";
registerEpisode({
id:"ep04",title:"No Hot Water",week:4,schema:1,release:"2026-11-06T08:00-06:00", // PLACEHOLDER GATE, NOT FINAL: release date TBD (spec). Must match episodes/index.js.
start:{scene:"e4_01",P:20,R:50,T:60,flags:{}},
meters:["P","R","T"],
meterLabels:{P:"Tank pressure"},
uiSkin:"ep3", // Ep4 upgrade: reuse Art's Ep3 pixel UI skin (ui3.js/ui3.css: chips, stakes, meter feedback, timer). Skin id is shared, not Ep3-only art.
chipLabels:{P:"Pressure",R:"Rep",T:"Patience"},
bgCaptions:{van_stage:"The van",hosebib_exterior:"Gloria's porch",laundry_closet_heater:"The laundry closet",garage_oldheater:"The garage",breaker_panel:"The breaker panel",e1_kitchen_morning:"Gloria's kitchen"},
codeTip:"heaterScorchE4",
thumb:"assets/img/ep4_upgrade/thumb_ep04.png", // Art 32e13e6 (ep4-upgrade-art): new Ep4 thumbnail
artDir:{dir:"ep4_upgrade/",files:["card_endSpaDay.png","thumb_ep04.png"]}, // Art 32e13e6: Spa Day card + thumbnail live in assets/img/ep4_upgrade/
hackThreshold:3, // spec: hackThreshold 3 -> Dale's Relight
resultFrame:{src:"assets/img/result_frame_1200x675.png",window:[42,42,701,413]},
art:["card_endSpaDay.png","bg_van_stage.png","bg_hosebib_exterior.png","bg_laundry_closet_heater.png","bg_garage_oldheater.png","bg_breaker_panel.png","bg_e1_kitchen_morning.png","heater_e4.png","gloria.png","hector_point.png","hector_slowclap.png","hector_shrug.png","hector_clipboard.png","van_hector.png","boy_sweettea.png","prop_dale_relit_note.png","prop_kitty_litter.png","fx_sediment_geyser.png","fx_rust_water.png","fx_steam.png","fx_phone_buzz.png","darlene_phone.png","portrait_hector.png","prop_tp_gardenhose.png","card_endRustBath.png","card_endDalesRelight.png","card_endColdShower.png","card_endScorchMarks.png","card_endHotAgain.png","thumb_ep04.png"],
sprites:{boy:{idle:"boy_idle.png",drink:"boy_sweettea.png",frames:2,w:40,h:60},vanRun:{src:"fx_van_run.png",frames:3,w:96,h:16}},
collectible:{id:"daleRelitNote",name:"Dale's sticky note",sprite:"prop_dale_relit_note",scene:"e4_03",choice:1},
tips:{
 heaterTimelineE4:"No hot water? Note when it stopped, whether the heater is electric or gas, and whether anyone \"fixed\" it since. Call a licensed plumber.",
 heaterScorchE4:"Scorch marks or a burnt smell at an electric water heater's access panel mean an overheated wire, element or thermostat. Don't open the panel; switch it off at the breaker. Call a licensed plumber.",
 gasSmellE4:"Smell rotten eggs? That's gas. Don't flip switches or light anything, get everyone outside, and call the gas utility from outside. Then call a licensed plumber.",
 breakerOffE4:"Electric water heaters run on a high-voltage circuit. Before anyone works on one, the breaker is switched off and labeled. Call a licensed plumber.",
 hvacRuleOutE4:"A furnace and a water heater can share a closet without sharing a problem. Test, don't guess: furnace work is for a licensed HVAC tech, and the water heater is plumbing. Then call a licensed plumber.",
 rightToolE4:"Youngster, right tool first, every time. Call a licensed plumber.",
 sedimentE4:"Sediment settles at the bottom of a tank and makes it rumble and run out of hot water early. A stuck or leaking drain valve can flood a room. Call a licensed plumber.",
 tpValveE4:"The T&P relief valve keeps a water heater from building dangerous pressure. Never cap or plug it. Testing or replacing it is licensed work. Call a licensed plumber.",
 dataPlateE4:"The data plate on a water heater lists its fuel, voltage, element wattage, tank size and often the install year. Reading it first tells you what you're actually working on. Opening the panel or testing elements is licensed work. Call a licensed plumber.",
 tpDischargeE4:"A T&P relief valve's discharge pipe stays full size, the size of the valve outlet, with no valve, reducer or garden hose on it. It drains by gravity, isn't trapped, and ends unthreaded, pointing down and in plain view, close to the floor or at an approved indirect drain or outdoor spot, at the height the code sets (UPC 608.5 / IPC 504.6). Call a licensed plumber.",
 drainFlushE4:"Sludge in the tank? Your licensed plumber will shut off the power or gas, close the cold supply, and drain and flush the tank to a safe spot. Tank water can be scalding, so leave the valve alone. Call a licensed plumber.",
 scaldE4:"Hotter isn't better: water around 120°F is a common setting, and hotter water scalds fast, especially kids and older adults. A thermostatic mixing valve (ASSE 1017) at the heater can temper the house, but showers need a valve limited to 120°F (UPC 408.3 / IPC 412.3) and tubs need a temperature-limiting device such as ASSE 1070 at the tub (UPC 409.4 / IPC 412.5). Call a licensed plumber.",
 verifyDeadE4:"An electric water heater is switched off at its breaker, tagged, and tested dead at the heater before any cover comes off. A label in someone's handwriting isn't proof. Opening the heater is licensed work. Call a licensed plumber.",
 wiringFaultE4:"A burnt smell at the panel, scorch marks or discoloration on the panel cover, or a buzzing or crackling panel is an electrical fault, not a water heater fault. Don't touch it and don't open the panel. Leave the breaker off. Call a licensed electrician.",
 anodeE4:"Orange or rusty hot water can mean a worn-out anode rod inside the tank. The rod corrodes so the steel tank doesn't; leaving it out shortens the tank's life. Inspecting or replacing it is licensed work. Call a licensed plumber.",
 panExpansionE4:"Where a leaking water heater could damage the building, it sits in a watertight drain pan at least 1-1/2 inches deep with a drain of at least 3/4 inch to an approved spot (UPC 507.5 / IPC 504.7). If a check valve, backflow preventer or pressure-reducing valve closes the system, it needs thermal expansion control such as an expansion tank (UPC 608.3 / IPC 607.3). A weeping T&P valve is a warning: never cap or plug it. Call a licensed plumber.",
 testHotE4:"After water heater work, power goes back on only once the tank is full. Then check for leaks and run hot water until it runs clear. Call a licensed plumber."
},
failEnding:"e4_rustbath",
driftAmount:13, // DESIGN NOTE (needs Director OK): spec says +5, but then P tops out near 68 and Rust Bath (P>=100) is unreachable. +13 is the one lever changed: Rust Bath 14% in the 100k sim (target 14–18%).
driftText:"<em>The tank ticks and groans.</em> (+13 Pressure)",
resolveCallback:{unlessFlag:"tested",R:-10,text:"<b>Callback:</b> nobody ran it till it ran clear. −10 Reputation."},
resolve:[
 {if:{flags:["maxedIt","scorchRead","tested"]},to:"e4_scorch"}, // Dale MAX IT (e4_11b): Scorch only if the fault was found and tested; otherwise the tripped high-limit means Cold Shower. Never Spa Day / Hot Again / Dale
 {if:{flags:["maxedIt"]},to:"e4_coldshower"},
 {if:{P:">=100"},to:"e4_rustbath"},
 {if:{dalehacks:">=3"},to:"e4_dale"},
 {if:{notFlags:["scorchRead","flushed"]},to:"e4_coldshower"},
 {if:{flags:["panOnly"]},to:"e4_scorch"}, // Ep4 pacing: e4_11c violations (capped T&P; pan-only leaves no expansion tank behind the new check valve, UPC 608.3 / IPC 607.3). wrongPan (no-drain condensate pan next to a finished room, UPC 507.5 / IPC 504.7) blocks Spa Day below. A capped T&P never reaches this rule (the cap only shows after 2 Dale hacks, so it is a 3rd hack: Dale's Relight, or Scorch/Cold Shower via the MAX IT rules above, where the Scorch tpCapped variant shows). A capped T&P (Dale hack at e4_11c) is never Spa Day or Hot Again; Pete pulls the cap, the callback is guaranteed
 {if:{flags:["scorchRead","tested","tpChecked","tpLineFixed","plateRead","scaldSafe","verifiedDead","expansionQuoted"],notFlags:["froze","wrongBreaker","tpCapped","wrongPan","panOnly"],dalehacks:"0",R:">=60"},to:"e4_spaday"}, // secret bonus (Ep4 upgrade; pacing: e4_08b anode pick not required, Director 10/24): scorch read + plate read + T&P line fixed + tested + 120°F/anti-scald + no freeze at e4_09 + 0 Dale hacks + Rep 60+  // cause not found (scorch read or tank flush)
 {if:{any:[{notFlags:["tested"]},{notFlags:["tpChecked"]}]},to:"e4_scorch"},    // found, but not tested or T&P skipped
 {to:"e4_hotagain"}],
vanRunLines:{
 fail:["He comes back with a gallon of sweet tea."+" "+TEA,"He comes back with nothing. \"It's in the van.\" It is in the van.","He comes back with Hector's coffee. Hector: \"Junior.\" Pete: \"Boy.\""],
 success:["Element tester, first try. Hector slow-claps. Nobody knows if he means it."],
 chance:0.70,failT:[5,10],failSeconds:45,failP:5,successT:3,failTip:"rightToolE4",
 // Ep4 upgrade (Ep3 M3 parity): Rep payoff only on a high-band Pepper Run result; random play and the sims never see it.
 pepperHighR:2,pepperHighNote:"Gloria watches the {boy} come back with the right tester and nods. "}, // spec: van run fails 70%
events:[
 // Seeded cause: exactly one of these fires on entering e4_08 (engine fires the first event that rolls).
 {id:"ev_cause_element",at:["e4_08"],chance:0.45,text:"The tester reads: <b>lower element open</b>. Burned out, with a scorch ring around the terminal.",effects:{},setFlags:["causeElement"]},
 {id:"ev_cause_thermostat",at:["e4_08"],chance:0.6364,text:"The tester reads: <b>upper thermostat stuck open</b>. The reset tripped and the contacts are scorched.",effects:{},setFlags:["causeThermostat"]},
 {id:"ev_cause_sediment",at:["e4_08"],chance:1,text:"The tester reads: both elements good. The tank <b>rumbles</b>: the lower element is buried in sediment.",effects:{},setFlags:["causeSediment"]}],
stage:{kevin:false,water:"dirty",
 npc:{img:"gloria.png",scenes:["e4_02","e4_03","e4_08b","e4_11","e4_12"]},
 workScenes:["e4_05","e4_05b","e4_08","e4_08b","e4_09","e4_10","e4_11c"],
 props:{e4_03:["prop_dale_relit_note.png",1,16,16],e4_10:["prop_tp_gardenhose.png",1,32,48]},
 dale:{e4_07:"hector_slowclap"}, // the 2-frame slow clap uses the animated side slot; single-frame poses go in decor at the same spot (176,109)
 // heater_e4: 3 frames (0 normal, 1 scorched, 2 steaming), placed at (150,36) on bg_laundry_closet_heater (Art).
 overlays:{e4_03:["heater_e4.png",150,36,64,112,1,3],e4_06:["heater_e4.png",150,36,64,112,1,3],e4_08:["heater_e4.png",150,36,64,112,1,3],e4_08b:["heater_e4.png",150,36,64,112,0,3],e4_11c:["heater_e4.png",150,36,64,112,0,3],e4_09:["heater_e4.png",150,36,64,112,1,3],
  e4_10:["heater_e4.png",150,36,64,112,0,3],e4_11:{variants:[{if:{flags:["tested"]},ov:["heater_e4.png",150,36,64,112,2,3]}],ov:["heater_e4.png",150,36,64,112,0,3]}},
 decor:{
  e4_02:[["van_hector.png",184,112,128,64,0,1]],
  e4_05:[["hector_clipboard.png",176,109,48,64,0,1]],
  e4_06:[["hector_point.png",224,109,48,64,0,1]],
  // Art 7c17740 (ep4-upgrade-art) props, served from assets/img/ep4_upgrade/; fx_orange_water is a 3-frame strip (0 drip, 1 splash, 2 puddle)
  e4_05b:[["ep4_upgrade/prop_breaker_tag.png",144,72,32,32,0,1]],
  e4_08b:[["ep4_upgrade/prop_anode_rod.png",228,134,48,16,0,1],["ep4_upgrade/fx_orange_water.png",174,148,16,16,0,3]],
  e4_11c:[["ep4_upgrade/prop_heater_pan.png",150,138,64,24,0,1],["ep4_upgrade/prop_expansion_tank.png",222,40,24,40,0,1]],
  e4_09:[["fx_sediment_geyser.png",108,92,64,64,-1,2]],
  e4_11:[["fx_rust_water.png",32,156,256,16,0,1],["ep4_upgrade/fx_orange_water.png",174,140,16,16,1,3],["ep4_upgrade/fx_orange_water.png",190,156,16,16,2,3]],
  e4_12:[["hector_shrug.png",176,109,48,64,0,1],["fx_steam.png",220,22,96,32,0,1]/* was (232,8): moved inside the 320px stage and below the scene caption */]}},
scoring:{parSeconds:480},
verify:{endings:6,decisions:[15,16],excludeFromRange:["e4_rustbath"],
 // Scripted runs (choice index per decision: e4_01..e4_05, e4_05b (breaker-off path only), e4_06..e4_08, e4_08b, e4_09..e4_11, e4_11b, e4_11c, e4_12); forceEvents picks the seeded cause.
 playScripts:[
  {picks:[0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0],forceEvents:["ev_cause_element"]},     // Hot Again, element (scorch read, tested, T&P)
  {picks:[0,0,1,0,0,0,0,1,1,0,0,1,0,0,0,0],forceEvents:["ev_cause_thermostat"]},  // Hot Again, thermostat (T&P checked while Gloria hovers)
  {picks:[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],forceEvents:["ev_cause_sediment"]},    // Hot Again via the tank flush only (no scorch read, furnace blamed)
  {picks:[0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,0],forceEvents:["ev_cause_element"]},     // Cold Shower: no scorch read, furnace blamed, towels (cause never found)
  {picks:[0,0,1,0,0,0,0,1,1,0,0,0,1,0,0,0],forceEvents:["ev_cause_sediment"]},    // Hot Again: test run while Gloria fills the tub
  {picks:[0,0,1,0,0,0,0,1,1,0,0,0,2,0,0,0],forceEvents:["ev_cause_element"]},     // Scorch Marks: not run till clear ("it's fine")
  {picks:[0,0,1,0,0,0,0,1,1,0,0,2,0,0,0,0],forceEvents:["ev_cause_thermostat"]},  // Scorch Marks: T&P check skipped
  {picks:[0,0,0,0,0,0,2,1,1,0,2,0,0,0,0,0],forceEvents:["ev_cause_element"]},     // Dale's Relight: smack, flue tape, kitty litter
  {picks:[0,0,0,0,0,0,2,1,1,0,1,3,0,0,0,0],forceEvents:["ev_cause_sediment"]},    // Dale's Relight via the 4th hack at e4_10 (smack, flue tape, "spa" note)
  {picks:[0,0,1,0,1,0,0,0,0,1,0,0,0,0,0],forceEvents:["ev_cause_thermostat"]}, // Rust Bath: breaker left on, van run, call now, towels
  {picks:[0,2,2,0,0,0,0,1,1,0,0,4,0,0,0,0],forceEvents:["ev_cause_element"]},  // Spa Day (secret): plate read, scorch matched to plate, T&P discharge fixed, 120°F, 0 hacks, Rep 70+
  {picks:[0,0,1,0,0,0,0,1,1,0,3,0,0,0,0,0],forceEvents:["ev_cause_sediment"]},  // Hot Again via the by-the-book drain (breaker off)
  {picks:[0,2,2,0,0,0,0,1,1,0,0,2,0,1,0,0],forceEvents:["ev_cause_thermostat"]},  // Scorch Marks middle: tested, T&P skipped
  {picks:[0,2,2,0,0,0,0,1,1,0,0,0,0,3,0,0],forceEvents:["ev_cause_element"]},  // Hot Again hint variant: plate read, T&P checked but hose left on, anti-scald valve (Rep 60+)
  {picks:[0,0,1,0,0,0,2,1,1,0,0,0,0,4,0,0],forceEvents:["ev_cause_element"]},  // Scorch Marks via Dale MAX IT at e4_11b (scorch read + tested, after the flue-tape hack)
  {picks:[0,0,0,0,0,0,0,1,1,0,0,0,0,4,0,0],forceEvents:["ev_cause_sediment"]},  // Cold Shower via Dale MAX IT (smack is the only prior hack, no scorch read; high-limit tripped)
  // Ep4 pacing routes (e4_05b, e4_08b, e4_11c)
  {picks:[0,2,2,0,0,3,0,1,1,0,0,4,0,0,0,0],forceEvents:["ev_cause_thermostat"]}, // Spa Day via the wiring-fault branch (electrician called at e4_05b)
  {picks:[0,0,1,0,0,1,0,1,1,0,0,0,0,0,0,0],forceEvents:["ev_cause_element"]},   // Hot Again: Dale's label trusted at e4_05b (by-the-book drain locked)
  {picks:[0,2,2,0,0,2,0,1,1,0,0,4,0,0,0,0],forceEvents:["ev_cause_element"]},   // Hot Again (not Spa Day): Gloria flipped the wrong breaker
  {picks:[0,0,1,0,0,0,0,1,1,2,0,0,0,0,0,0],forceEvents:["ev_cause_sediment"]},  // Hot Again: anode skipped at e4_08b
  {picks:[0,0,0,0,0,0,2,1,1,1,0,0,0,0,0,0],forceEvents:["ev_cause_element"]},   // Dale's Relight: smack, flue tape, rod left out (rod hack shown only after 2 Dale hacks)
  {picks:[0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0],forceEvents:["ev_cause_element"]},   // Hot Again wrongPan variant: Hector's HVAC pan
  {picks:[0,0,1,0,0,0,0,1,1,0,0,0,0,0,2,0],forceEvents:["ev_cause_thermostat"]},// Scorch Marks (panOnly variant): pan quoted, expansion tank skipped
  {picks:[0,0,0,0,0,0,2,1,1,0,0,0,0,0,3,0],forceEvents:["ev_cause_element"]}]}, // Dale's Relight: smack, flue tape, then the T&P cap (shown only after 2 Dale hacks; the cap is always the 3rd hack, so it ends at Dale)
scenes:{
e4_01:{who:"the van",bg:"van_stage",text:"Morning. Pete: \"Load up, Youngster. Grab the meter.\" The {boy} comes back with the leaf blower.",
 choices:[{label:"Meter and flashlight, then go",next:"e4_02",effects:{R:3},correct:true},
          {label:"Donuts first",next:"e4_02",effects:{T:5,R:-3}}]},
e4_02:{who:"Gloria",bg:"hosebib_exterior",text:"Ms. Bev's cousin Gloria opens the door in a towel turban. \"Three days. I've been showering at the gym. With strangers. Like a Viking.\"",
 choices:[{label:"Listen to the timeline: when it stopped, what changed, who touched it",next:"e4_03",effects:{R:5},setFlags:["history"],correct:true,tip:"heaterTimelineE4"},
          {label:"\"Have you tried waiting?\"",next:"e4_03",effects:{T:-10}},
          // Ep4 upgrade diagnose (appended last): read the data plate before touching anything.
          {label:"Diagnose first: read the heater's data plate before anyone touches it: fuel, voltage, element wattage, install year",next:"e4_03",effects:{R:3,T:-3},secs:30,setFlags:["plateRead"],correct:true,tip:"dataPlateE4",note:"Electric, 240 volts, two 4500-watt elements, 50 gallons, installed 2013. Dale's \"relight\" makes even less sense now."}]},
e4_03:{who:"the heater",bg:"laundry_closet_heater",text:"The laundry closet. A 50-gallon <b>electric</b> heater, cold to the touch. Dale's sticky note on the side: \"RELIT IT. YOU'RE WELCOME. —D.\" "+NOTE+" It's electric. There is nothing to relight."+br+BUZZ+" "+HECTOR_PH+" Hector, on the phone from his van: \"Petey. It's the plumbing.\" Pete: \"Noted.\"",
 choices:[{label:"Do what Dale did: smack the side",next:"e4_04",effects:{R:-5,P:3},hack:true,correct:false,tip:"heaterScorchE4"},
          {label:"Read the note, then the scorch marks by the access panel",next:"e4_04",effects:{R:5},setFlags:["scorchRead"],correct:true,tip:"heaterScorchE4"},
          // Ep4 upgrade (appended last): unlocked by the e4_02 data-plate read.
          {label:"Match the scorch to the plate: 4500-watt elements, a burnt smell at the lower panel. Breaker off before anyone looks closer",next:"e4_04",effects:{R:7,P:-3},setFlags:["scorchRead"],requires:{flags:["plateRead"]},lockHint:"Read the data plate first",stakes:"Needs the data plate read. Pete doesn't guess at 240 volts.",correct:true,tip:"heaterScorchE4"}]},
e4_04:{who:"the garage",bg:"garage_oldheater",text:"The heater Dale actually \"relit\" is the old gas unit in the garage. Faint rotten eggs. You smell gas.",
 choices:[{label:"Walk out: everyone outside, call the gas utility and a licensed plumber from the curb",next:"e4_05",effects:{R:10},setFlags:["walkedOut"],correct:true,tip:"gasSmellE4",note:"From the sidewalk, Pete calls the gas utility. Their tech shuts off and tags the old unit. Nobody touches it."},
          {label:"\"Sniff closer\"",next:"e4_05",effects:{R:-10,T:-10},setFlags:["walkedOut"],correct:false,tip:"gasSmellE4",note:"Pete pulls the {boy} out by the collar. Everyone outside. Pete calls the gas utility from the curb anyway."}]},
e4_05:{who:"Hector (HVAC)",bg:"breaker_panel",drift:true,text:"Hector, called by Gloria about the furnace, fills the doorway. \"It's the plumbing.\" Pete: \"Breaker first.\"",
 choices:[{label:"Have the {boy} confirm the breaker off and labeled",next:"e4_05b",effects:{P:-10},setFlags:["mainOff"],correct:true,tip:"breakerOffE4"},
          {label:"\"Pretty sure it's off.\"",next:"e4_06",effects:{R:-5},note:"Pete makes a note to check it himself. The tank keeps ticking."}]},
// Ep4 pacing: e4_05b runs only on the breaker-off path, and only because this heater is electric (data plate: 240 V). Any gas question stays walk-out-only (e4_04).
e4_05b:{who:"the breaker panel",bg:"breaker_panel",text:"The panel is labeled in Dale's handwriting: \"HW?\", \"HW2\", \"DONT\", and one breaker wrapped in blue tape. Gloria, from the hallway: \"It's the one with the tape. Dale said.\" Hector leans on the doorframe: \"In HVAC we trust the label.\" Pete doesn't. This heater is electric, two 4500-watt elements on a 240-volt circuit, so the only way to know it's off is to test it at the heater. The old gas unit in the garage stays exactly as the gas utility left it: tagged out, and nobody here goes near it. The {boy} is holding the non-contact tester upside down.",
 choices:[{label:"Pete switches off the double-pole breaker, hangs his tag on it, and tests dead at the heater terminals before any cover comes off",next:"e4_06",effects:{R:4,T:-3},secs:40,setFlags:["verifiedDead"],correct:true,tip:"verifyDeadE4",note:"Off, tagged with Pete's name and the date, tester checked on a live outlet, then zero at both heater terminals, then checked on the live outlet again. The {boy} asks why three times. Pete: \"Because a tester can lie once.\""},
          {label:"Trust Dale's \"HW?\" label and get to work",next:"e4_06",effects:{T:2,R:-3},setFlags:["unverified"],correct:false,tip:"verifyDeadE4",note:"Pete lets the label stand for now and writes \"VERIFY\" on his hand. Nothing gets drained until that's done."},
          {label:"Let Gloria flip \"the one with the tape\"",next:"e4_06",effects:{T:3,P:3},setFlags:["unverified","wrongBreaker"],correct:false,tip:"verifyDeadE4",note:"The dryer stops mid-spin. The heater is still live. Pete finds the real breaker, switches it off and tags it, but the morning's gone sideways and Gloria now owns a damp load of towels."},
          // Diagnose branch (appended last; needs the e4_02 data plate): a wiring fault ends with the electrician, not Pete.
          {label:"Stop at the panel door without opening anything: a burnt smell, and the cover is discolored around the heater breaker. Leave it off, tag it, and get an electrician on the schedule",next:"e4_06",effects:{R:5,T:-4},secs:45,setFlags:["verifiedDead","electricianCalled"],requires:{flags:["plateRead"]},lockHint:"Read the data plate first",stakes:"Needs the data plate read. Pete knows what a 4500-watt circuit should look like.",correct:true,tip:"wiringFaultE4",note:"Pete tags the breaker OFF and DO NOT ENERGIZE, tests the heater dead anyway, and calls a licensed electrician to open the panel and find the fault before the heater gets power back. The plumbing work goes on with the heater dead. Hector, quietly: \"That's the first label I believe today.\""}]},
e4_06:{who:"Hector (HVAC)",bg:"laundry_closet_heater",drift:true,text:"Hector leans on the furnace like it owes him money. He has a clipboard, a coffee, and a theory. Gloria watches from the doorway with a towel already over her shoulder, just in case. The furnace hums. The heater ticks. Somewhere a cat knocks something off a shelf. Hector, pointing at the wrong thing: \"Your heater stole my furnace's flue mojo. I have seen this before, mira. Twice. Maybe once. Mira, it's the heater.\" Pete looks at the flue, then at the furnace, then at Hector.",
 choices:[{label:"Rule the furnace out with a test, not a hunch",next:"e4_07",effects:{R:5},setFlags:["hvacRuledOut"],correct:true,tip:"hvacRuleOutE4"},
          {label:"Blame the furnace",next:"e4_07",effects:{T:5},setFlags:["blamedHVAC"],correct:false},
          {label:"Dale's note on the back: \"Tape the flue. Keeps the mojo in.\"",next:"e4_07",effects:{R:-8},hack:true,correct:false,tip:"hvacRuleOutE4",note:"The {boy} reaches for the tape. Pete takes it away: nothing gets taped on a flue. Hector: \"...Good call.\""}]},
e4_07:{who:"the Boy",bg:"van_stage",drift:true,text:"\"Youngster, the element tester.\"",
 choices:[{label:"\"{boy}: element tester.\"",next:"e4_08",vanRun:true},
          {label:"Get it yourself",next:"e4_08",effects:{T:-5}}]},
e4_08:{who:"Darlene (phone)",bg:"laundry_closet_heater",drift:true,text:"Pete reads the results. Then the phone: Darlene. \"Quick one, Petin.\" It is not a quick one. \"#@%&!\""+br+BUZZ+" "+DARLENE,
 variants:[{if:{flags:["causeElement"]},text:"Pete reads the results: the lower element is open, scorch ring on the terminal. Then the phone: Darlene. \"Quick one, Petin.\" It is not a quick one. \"#@%&!\""+br+BUZZ+" "+DARLENE},
           {if:{flags:["causeThermostat"]},text:"Pete reads the results: the upper thermostat is stuck, the reset tripped, contacts scorched. Then the phone: Darlene. \"Quick one, Petin.\" It is not a quick one. \"#@%&!\""+br+BUZZ+" "+DARLENE},
           {if:{flags:["causeSediment"]},text:"Pete reads the results: elements good, but the tank rumbles like gravel in a dryer. Sediment. Then the phone: Darlene. \"Quick one, Petin.\" It is not a quick one. \"#@%&!\""+br+BUZZ+" "+DARLENE}],
 choices:[{label:"Take the call now",next:"e4_08b",effects:{T:-5,P:5}},
          {label:"\"After, Darlene.\"",next:"e4_08b"}]},
// Ep4 pacing: e4_08b anode rod (orange water). Pete is the licensed plumber who pulls and inspects it.
e4_08b:{who:"Gloria",bg:"laundry_closet_heater",text:"Pete opens a hot faucet to bleed the line and it runs orange. Gloria holds a strand of her hair up to the light. \"Is that why my hair's this color?\" Pete, kindly: \"Your hair's fine, Gloria. The tank isn't.\" On the heater, under the RELIT IT note, a second note from Dale: \"PULL THE ROD. IT'S WHAT MAKES IT RUSTY.\" The {boy} is already looking for a socket. Hector, from the doorway, finally unsure: \"Is the rod a plumbing thing?\" It is.",
 choices:[{label:"Pete pulls the anode rod, inspects it, and fits a new one",next:"e4_09",effects:{R:5,T:-4},secs:45,setFlags:["anodeChecked"],correct:true,tip:"anodeE4",note:"The rod comes out down to its steel core wire, the last of the magnesium flaking off in orange crumbs. Pete shows Gloria: \"This gets eaten so your tank doesn't. It's done.\" He fits a new one and wraps the threads. Gloria takes a photo for Ms. Bev."},
          {label:"Dale's note: \"Pull the rod. Leave it out.\"",next:"e4_09",effects:{T:3,R:-6,P:3},hack:true,setFlags:["anodeOut"],showIf:{dalehacks:">=2"},correct:false,tip:"anodeE4",note:"The {boy} already told Gloria the rod is the problem. Pete puts the old rod back in rather than leave the tank bare, but now there's a hole in the plan and a promise Pete has to walk back. The tank ticks louder."},
          {label:"\"Skip it, it's just sediment.\"",next:"e4_09",effects:{T:2},setFlags:["anodeSkipped"],correct:false,tip:"anodeE4",note:"The orange keeps coming. Pete writes \"anode?\" on the work order for next visit."}]},
e4_09:{who:"the drain valve",bg:"laundry_closet_heater",drift:true,shake:true,timed:{secs:8,effects:{P:5},flag:"froze",note:"You freeze up. The geyser keeps going. +5 Pressure."}, // Ep4 upgrade: 8s countdown (ui3.js), neutral timeout, no ending lock
text:"Drain valve. Brown sludge and gravel-ish grit come out in a geyser. The {boy}, told \"stand back,\" stands closer."+br+GEYSER,
 choices:[{label:"Bucket and hose ready before it opens",next:"e4_10",effects:{P:-10},setFlags:["flushed"],correct:true,tip:"sedimentE4"},
          {label:"Towels",next:"e4_10",effects:{P:10}},
          {label:"Dale's note: \"Kitty litter around it. Soaks up the bad.\" "+LITTER,next:"e4_10",effects:{P:5,R:-5},hack:true,correct:false,tip:"sedimentE4"},
          // Ep4 upgrade (appended last): the full drain procedure. Needs the breaker confirmed off (e4_05).
          {label:"Do it by the book: breaker confirmed off, cold supply closed, a hot faucet open, hose to the floor drain, then crack the valve",next:"e4_10",effects:{P:-12,R:3,T:-3},secs:45,setFlags:["flushed"],requires:{flags:["verifiedDead"]},lockHint:"Breaker tested dead first",stakes:"Needs the heater tested dead at e4_05b. A label isn't proof, and nobody drains a tank with the elements live.",correct:true,tip:"drainFlushE4",note:"The sludge runs to the floor drain, not the floor. The {boy} is disappointed there's no geyser."}]},
e4_10:{who:"you",bg:"laundry_closet_heater",text:"Pete replaces the failed part and the work is done to code. Then the T&P relief valve: Pete inspects it.",
 variants:[{if:{flags:["causeElement"]},text:"Pete replaces the burned-out lower element; the work is done to code. Then the T&P relief valve: Pete inspects it."},
           {if:{flags:["causeThermostat"]},text:"Pete replaces the stuck thermostat; the work is done to code. Then the T&P relief valve: Pete inspects it."},
           {if:{flags:["causeSediment"]},text:"Pete flushes the tank and replaces the sediment-choked element; the work is done to code. Then the T&P relief valve: Pete inspects it."}],
 choices:[{label:"Back Pete on the T&P check",next:"e4_11",effects:{R:5},setFlags:["tpChecked"],correct:true,tip:"tpValveE4"},
          {label:"Check it while Gloria hovers",next:"e4_11",effects:{T:-5,R:-5},setFlags:["tpChecked"],tip:"tpValveE4",note:"It passes. Gloria narrates every turn of the wrench."},
          {label:"\"Skip it, she's cold.\"",next:"e4_11",effects:{T:5,R:-10},correct:false,tip:"tpValveE4"},
          {label:"Dale's note on the valve: \"Orange = vitamins. Tell her it's a spa.\"",next:"e4_11",effects:{T:3,R:-5},hack:true,correct:false,tip:"tpValveE4",note:"The {boy} reads it out loud. Gloria does not find it relaxing. Nobody checks the T&P."},
          // Ep4 upgrade diagnose (appended last): the T&P discharge is a garden hose (prop_tp_gardenhose). UPC 608.5 / IPC 504.6.
          {label:"Check the T&P and its discharge line: that garden hose comes off, and a full-size pipe with no valve or reducer drains down by gravity",next:"e4_11",effects:{R:6,T:-4},secs:60,setFlags:["tpChecked","tpLineFixed"],correct:true,tip:"tpDischargeE4",note:"The valve passes. The garden hose zip-tied to it goes in the truck. A proper full-size discharge pipe goes on and runs downhill, its unthreaded end pointing down in plain view, just above the floor drain at the height the code sets."}]},
e4_11:{who:"Gloria",bg:"laundry_closet_heater",text:"Power back on, wait for heat, check for leaks. The first draw from the tub is orange. Gloria screams. Pete: \"That clears.\"",
 choices:[{label:"Run it till it runs clear, check every joint",next:"e4_11b",effects:{T:-5},setFlags:["tested"],correct:true,tip:"testHotE4"},
          {label:"Run it while Gloria fills the tub",next:"e4_11b",effects:{T:-3},setFlags:["tested"],tip:"testHotE4",note:"It runs clear by the time the tub is full. Gloria calls it a spa day."},
          {label:"Tell Gloria \"it's fine\"",next:"e4_11b",effects:{T:5}}]},
// Ep4 upgrade: new scene between e4_11 and e4_12 (no ids removed; e4_11 choices route here, saves at e4_12 still work). Thermostat/scald beat. No new ending on its own.
e4_11b:{who:"Gloria",bg:"laundry_closet_heater",text:"Gloria, towel turban back on, eyes the thermostat cover. \"Three days, Pete. I want it hot. Lobster hot. Turn it all the way up.\" Hector, from the doorway: \"In HVAC we say set it and forget it.\" Ms. Bev, on speakerphone from the kitchen: \"Gloria, your grandkids are here Sunday.\" The {boy} reaches for the screwdriver.",
 choices:[{label:"Leave it at 120°F and explain the scald risk to Gloria",next:"e4_11c",effects:{R:4,T:-2},setFlags:["scaldSafe"],correct:true,tip:"scaldE4",note:"Pete sets both thermostats to 120. Gloria: \"Fine. Hot, not lobster.\" She means it as a compliment."},
          {label:"Crank it all the way up. She asked.",next:"e4_11c",effects:{T:5,R:-5},correct:false,tip:"scaldE4",note:"Pete stops the {boy}\'s screwdriver at 120 anyway. Gloria is unimpressed. So is Ms. Bev."},
          {label:"Let Hector weigh in",next:"e4_11c",effects:{T:2,R:-1},note:"Hector: \"Set it and forget it.\" He does not say where. Pete sets it to 120."},
          {label:"Fit an ASSE 1070 temperature-limiting valve at the tub, set to 120°F, and explain it",next:"e4_11c",effects:{R:6,T:-3},setFlags:["scaldSafe"],requires:{R:">=60"},lockHint:"Reputation 60+",stakes:"Needs Rep 60. Gloria isn\'t listening to a lecture yet.",correct:true,tip:"scaldE4",note:"The tub valve holds the bath at 120 no matter what the tank does. Gloria, grudging: \"So the grandkids are safe and I still get hot.\""},
          // Ep4 upgrade (Dale balance lever, Ep3 e3_11 parity): appended last, offered only once a Dale note is in play, so it never eats a Spa Day run.
          {label:"Dale's note on the thermostat cover: \"MAX IT. Hot = clean.\"",next:"e4_11c",effects:{T:4,R:-6},hack:true,setFlags:["maxedIt"],correct:false,tip:"scaldE4",showIf:{dalehacks:"1"},note:"The {boy} cranks it to MAX before Pete can grab the screwdriver. The high-limit trips with a click and the tank goes cold. Pete resets it to 120, but the damage is done. Gloria just wanted a hot bath, and the tank is cold again."}]},
// Ep4 pacing: e4_11c drain pan + thermal expansion (verified: UPC 507.5, IPC 504.7/504.7.1; UPC 608.3, IPC 607.3). Refusing to cap the T&P is correct; capping is a Dale hack.
e4_11c:{who:"the T&P valve",bg:"laundry_closet_heater",text:"Pete steps back for one last look. The heater sits on Gloria's new floor, no pan under it, and the finished family room is on the other side of the wall. A leak here soaks that carpet, so this spot needs a drain pan. While the tank heats, the T&P valve weeps a slow drip. Pete checks the water meter on his way past: the city put in a new check valve last month, so the expanding hot water has nowhere to go. Hector appears holding a plastic HVAC condensate pan. \"It fits.\" On the T&P lever, Dale's third note: \"DRIPS? CAP IT.\" The {boy} has a brass cap in his hand.",
 choices:[{label:"Refuse the cap. The weep is thermal expansion: quote an expansion tank on the cold side, plus a drain pan piped to the floor drain",next:"e4_12",effects:{R:6,T:-4},secs:45,setFlags:["panQuoted","expansionQuoted"],correct:true,tip:"panExpansionE4",note:"Pete takes the cap and drops it in his pocket. \"That valve is the only thing standing between this tank and the ceiling.\" He shows Gloria the check valve at the meter, sizes an expansion tank for the cold line, and quotes a metal pan, an inch and a half deep, with a 3/4-inch drain to the floor drain where she can see it."},
          {label:"Use Hector's HVAC pan. It fits.",next:"e4_12",effects:{T:2,R:-4},setFlags:["wrongPan"],correct:false,tip:"panExpansionE4",note:"It fits, sort of. It's a plastic furnace condensate pan, barely an inch deep, with no drain fitting, under a 50-gallon tank next to a finished room. Code wants a pan at least an inch and a half deep with a 3/4-inch drain. This isn't one. Pete writes down the right pan anyway. Hector looks pleased with himself, which is worse."},
          {label:"Quote the pan, skip the expansion tank",next:"e4_12",effects:{R:2,T:-2},setFlags:["panQuoted","panOnly"],tip:"panExpansionE4",note:"Gloria likes the pan. The pan is right: an inch and a half deep, 3/4-inch drain to the floor drain. But the T&P keeps weeping, because nothing changed about the pressure. With a check valve at the meter, code requires an expansion tank. Pete leaves the cap in his pocket and a note on the meter."},
          {label:"Dale's note on the lever: \"Drips? Cap it.\"",next:"e4_12",effects:{R:-8},hack:true,setFlags:["tpCapped"],showIf:{dalehacks:">=2"},correct:false,tip:"tpValveE4",note:"The {boy} threads the cap on. Pete has it off before the tank gets warm. \"Never. Not once, not for a minute.\" He holds the cap up so the {boy} has to look at it. \"This valve opens so the tank doesn't. You cap it, you've built a bomb with a water bill.\" But Gloria saw it, Ms. Bev heard about it, and that cap is going to be a phone call at 6 a.m."}]},
e4_12:{who:"the invoice",bg:"e1_kitchen_morning",resolve:true,text:"Gloria's first hot shower. Steam rolls out the bathroom door. Somewhere behind it she is singing, badly and with total commitment. Pete writes up the invoice on the hood of the van: parts, labor, what was found, what was fixed, what still needs a quote. The {boy} reads every line twice and asks what half of it means, and Pete explains it, because that is the job too. Hector: \"So the furnace is innocent.\"",
 choices:[{label:"Itemized, with a tip sheet",next:"resolve",effects:{R:5},sfx:"cash_register"},
          {label:"Let the {boy} write it",next:"resolve",note:"Line item: \"1 sweet tea.\""}]}
},
endings:{
e4_rustbath:{end:true,card:"card_endRustBath.png",cardX:53,fail:true,scoreMult:0.5,tag:"Rust Bath",text:"The drain valve, the tank and the laundry floor become one orange lake. Gloria: \"I wanted hot water, not a spa.\"",endTip:"Breaker off and a bucket ready before a drain valve opens.",whyLicensed:"A tank under pressure is licensed work. Call a licensed plumber."},
e4_dale:{end:true,card:"card_endDalesRelight.png",cardX:53,scoreMult:0.5,tag:"Dale's Relight",hackRecap:true,text:"Smacked, taped at, kitty-littered. Still cold. Dale texts a thumbs-up.",variants:[{if:{flags:["tpCapped","anodeOut"]},text:"Smacked, taped at, rod pulled, capped. Still cold. Dale texts a thumbs-up. Pete puts the anode rod back in before he leaves: without it the tank rusts out from the inside. Pete finds the brass cap on the T&P lever on his way out. He takes it off before the tank gets warm and won't leave until the valve is open, tested and clear. \"Never. Not once, not for a minute. This valve opens so the tank doesn't.\" Gloria saw it, Ms. Bev heard about it. A capped T&P valve is a hazard: it is the only way a tank can let off dangerous pressure. Call a licensed plumber."},{if:{flags:["tpCapped"]},text:"Smacked, taped at, capped. Still cold. Dale texts a thumbs-up. Pete finds the brass cap on the T&P lever on his way out. He takes it off before the tank gets warm and won't leave until the valve is open, tested and clear. \"Never. Not once, not for a minute. This valve opens so the tank doesn't.\" Gloria saw it, Ms. Bev heard about it. A capped T&P valve is a hazard: it is the only way a tank can let off dangerous pressure. Call a licensed plumber."},{if:{flags:["anodeOut"]},text:"Smacked, taped at, rod pulled. Still cold. Dale texts a thumbs-up. Pete puts the anode rod back in before he leaves: without it the tank rusts out from the inside. Call a licensed plumber."}],endTip:"A hack hides a problem. It doesn't fix it.",whyLicensed:"Water heater work is licensed work. Call a licensed plumber."},
e4_coldshower:{end:true,card:"card_endColdShower.png",cardX:53,tag:"Cold Shower",text:"Hector's furnace gets \"fixed.\" New filter, new igniter, a sticker with today's date on it. Hector is very proud of the sticker. Pete stands at the heater a long minute, saying nothing. The water's still cold. Gloria showers at the gym again. Hector: \"Plumbers stay suspect.\"",endTip:"Test, don't guess. Rule each suspect out.",whyLicensed:"Diagnosing a water heater is a licensed plumber's job."},
e4_scorch:{end:true,card:"card_endScorchMarks.png",cardX:53,good:true,tag:"Scorch Marks",text:"Works for a day. 6 a.m. callback: the scorch mark is back. Pete: \"Tomorrow we do it right, Youngster.\"",
 variants:[{if:{flags:["tested"],notFlags:["tpChecked"]},text:"Hot water, tested and clear. But nobody checked the T&P valve. Two days later Pete comes back on his own and tests it anyway. It passes. Pete: \"Right fix, missed a step. We don't skip the valve, Youngster.\""}, // Ep4 upgrade (Ep3 #5 parity): middle variant, text only
  {if:{flags:["tpCapped"]},text:"Pete pulls the cap off the T&P before it ever gets warm, but the call still comes at 6 a.m.: Gloria found the cap in the trash and wants to know why the {boy} put it on. Pete: \"Tomorrow we fit the expansion tank, Youngster. And nobody caps that valve again.\""}, // Ep4 pacing
  {if:{flags:["panOnly"]},text:"Hot water, and a new pan on the quote. Two days later the callback: the T&P is weeping into the pan every afternoon, because the check valve at the meter still leaves the expanding water nowhere to go. Pete: \"Expansion tank, Youngster. The pan catches the symptom.\""}, // Ep4 pacing
  {if:{flags:["causeSediment"]},text:"Works for a day. 6 a.m. callback: the tank rumbles again, and there's a fresh scorch mark by the panel. Pete: \"Tomorrow we do it right, Youngster.\""}],
 endTip:"Test it and check the T&P valve before you call it done.",whyLicensed:"T&P valves and water heater repairs are licensed work. Call a licensed plumber."},
e4_hotagain:{end:true,card:"card_endHotAgain.png",cardX:53,good:true,tag:"Hot Again",text:"Steam, a happy Gloria. Hector and Pete nod at each other. Barely.",
 variants:[{if:{notFlags:["tpLineFixed"],flags:["plateRead"]},text:"Steam, a happy Gloria. On the way out, Pete glances back at the garden hose still zip-tied to the T&P valve. \"Next visit, Youngster. There's a better finish to this job.\""}, // Ep4 upgrade: secret-ending hint, text only
  {if:{flags:["wrongPan"]},text:"Steam, a happy Gloria, and Hector's HVAC pan under her heater. \"It fits,\" Hector says on the way out. Pete makes a note: real pan, 3/4-inch drain, next visit."}, // Ep4 pacing
  {if:{flags:["anodeChecked","expansionQuoted"]},text:"Steam, a happy Gloria. New anode rod in, expansion tank quoted, the T&P dry. Pete: \"That tank just bought itself a few years, Youngster.\""}, // Ep4 pacing
  {if:{flags:["hvacRuledOut"],notFlags:["blamedHVAC"],R:">=60"},text:"Steam, a happy Gloria. Hector leaves a business card: \"For when it's actually mine.\" Pete pockets it. Barely a nod."}],
 endTip:"Water heater work is licensed work. Call a licensed plumber.",whyLicensed:"Water heaters, T&P valves and gas are a licensed plumber's job."},
// Ep4 upgrade: secret bonus ending (Ep3 Ghost Pipe parity). Placeholder card card_endHotAgain.png until Art delivers card_endSpaDay.png (320x180).
e4_spaday:{end:true,bonus:true,card:"card_endSpaDay.png",cardX:53,good:true,tag:"Spa Day",text:"Everything by the book: plate read, breaker off, tagged and tested dead, tank flushed, T&P and its discharge pipe to code, expansion tank and pan quoted, tested clear, set at 120. Gloria takes a bath so long Ms. Bev calls to check on her. Hector, at the curb, holds out his hand: \"Petey. When it's actually mine, I'm calling you first.\" The {boy} drinks Gloria's sweet tea.",variants:[{if:{flags:["anodeChecked"]},text:"Everything by the book: plate read, breaker off, tagged and tested dead, anode rod replaced, tank flushed, T&P and its discharge pipe to code, expansion tank and pan quoted, tested clear, set at 120. Gloria takes a bath so long Ms. Bev calls to check on her. Hector, at the curb, holds out his hand: \"Petey. When it's actually mine, I'm calling you first.\" The {boy} drinks Gloria's sweet tea."}],endTip:"Read the plate, test each suspect, and leave the T&P discharge and the temperature to code. Call a licensed plumber.",whyLicensed:"T&P discharge piping and scald protection are set by plumbing code. Call a licensed plumber."}
}
});
})();
