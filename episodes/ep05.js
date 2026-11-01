// TRAP FULL — Episode 5: "Hold, Please". Data only (schema 1); engine is index.html.
// Spec: design/ep5-hold-please-spec.md (Piquin: "Yes, build Ep5 as planned", Nov 1 2026). Names: Lena, Kayla, Rick, Mr. Hollis, Ms. Reyes. Secret: "Bring Us a Sticker".
// Code cites re-read before build (2021 UPC/IPC): UPC 408.3 ok (120°F limit in 408.3.2); IPC 424.3 is the 2018 number, 2021 IPC is 412.3 (tip uses IPC 412.3);
// IPC 312.1 / 312.5 ok (312.5.1: water supply tested at not less than working pressure); UPC 609.4 ok (working pressure, or 50 psi air, 15 min).
// Build notes vs spec: (1) e5_06 C is offered from the start: the spec gated it on 1 prior hack, but no hack exists before e5_06, so it could never show.
// (2) one extra Dale hack at e5_10 (shown only after a hack) so Dale's Way can reach its random target. (3) Pepper Run level id is "ep05" (pepper-run.js names levels epNN).
// (4) Global tips mainFirst / curbUtility have no licensed line, so Ep5 uses copies mainFirstE5 / curbUtilityE5 (Ep3 precedent).
// Art: Ep5 kit part 1 + priority set wired (Nov 1). Ep5 art complete (set 2: cards + crayon). Reused on purpose: van/tub/panel/night bgs, Hector, Pete idle/work, fx_phone_buzz, Ep0 Dale card prop.
(function(){
function spr(file,n,w,h,s,f,alt){const kf={2:"p2",3:"k3",4:"p4"}[n];
 const pos=(typeof f==="number"&&n>1)?(f/(n-1)*100)+"% 0":"0 0";
 const anim=(typeof f!=="number"&&kf)?";animation:"+kf+" "+(n*0.3)+"s steps("+n+") infinite":"";
 return '<span role="img" aria-label="'+(alt||"")+'" style="display:inline-block;vertical-align:middle;width:'+(w*s)+'px;height:'+(h*s)+'px;background-image:url(assets/img/'+file+');background-size:'+(n*100)+'% 100%;background-position:'+pos+';image-rendering:pixelated'+anim+'"></span>';}
const BUZZ=spr("fx_phone_buzz.png",4,32,32,2,undefined,"Phone buzzing");
const DARLENE=spr("portrait_darlene.png",1,32,32,2,undefined,"Darlene, dispatch");
const HOLLIS=spr("portrait_hollis_silhouette.png",1,32,32,2,undefined,"Mr. Hollis on the phone");
const KAYLA=spr("portrait_kayla.png",1,32,32,2,undefined,"Kayla");
const LENA=spr("portrait_lena.png",1,32,32,2,undefined,"Lena");
const SANTO=spr("santo_doorway.png",2,48,80,1,undefined,"El Santo de Petin in the doorway")+" "+spr("portrait_santo.png",1,32,32,2,undefined,"El Santo de Petin");
const CARD=spr("prop_dale_card.png",1,48,16,2,undefined,"Dale's business card");
const br="<br>";
registerEpisode({
id:"ep05",title:"Hold, Please",week:5,schema:1,release:"2026-11-11T08:00-06:00", // Must match episodes/index.js.
start:{scene:"e5_01",P:20,R:50,T:64,flags:{}},
meters:["P","R","T"],
meterLabels:{P:"Water in the ceiling",T:"Time to dinner"},
uiSkin:"ep3",
chipLabels:{P:"Pressure",R:"Rep",T:"Dinner"},
bgCaptions:{kitchen_ceiling_stain:"Ms. Reyes's kitchen",upstairs_bath_open:"The upstairs bath",van_stage:"The van",e1_kitchen_morning:"Ms. Reyes's kitchen",breaker_panel:"The breaker panel",bath_cabinet:"The upstairs bath",tub:"The tub wall",van_stage_night:"The driveway"},
codeTip:"antiScaldE5",
thumb:"assets/img/thumb_ep05.png",
hackThreshold:3,
hackChain:{panel:"e5_endDale",threshold:3}, // Dale's 3rd hack ends it on the spot (Ep0 h_chain pattern)
resultFrame:{src:"assets/img/result_frame_1200x675.png",window:[42,42,701,413]},
art:["bg_van_stage.png","bg_van_stage_night.png","bg_breaker_panel.png","bg_bath_cabinet.png","bg_tub.png","hector_shrug.png","fx_phone_buzz.png","prop_dale_card.png","fx_drip.png","fx_puddle.png","water_overlay.png","bg_kitchen_ceiling_stain.png","bg_upstairs_bath_open.png","rick_gc_e5.png","reyes_e5.png","pete_phone_sigh.png","pete_phone_yessir.png","pete_phone_sweet.png","portrait_lena.png","portrait_kayla.png","portrait_hollis.png","portrait_hollis_silhouette.png","portrait_darlene.png","prop_shower_valve_pb.png","prop_push_coupling.png","prop_test_gauge.png","prop_test_gauge_psi.png","fx_ceiling_drip.png","fx_drywall_sag.png","card_endBedtime.png","card_endSticker.png","card_endWaterfall.png","santo_doorway.png","portrait_santo.png","prop_crayon_drawing.png","thumb_ep05.png","card_endDinner.png","card_endCallback.png","card_endDaleE5.png","card_endDaleE5_text.png","prop_crayon_drawing_text.png"],
sprites:{boy:{idle:"boy_idle.png",drink:"boy_sweettea.png",frames:2,w:40,h:60},vanRun:{src:"fx_van_run.png",frames:3,w:96,h:16}},
collectible:{id:"crayonDrawing",name:"Crayon drawing: DADDY FIXES WATER",sprite:"prop_crayon_drawing",overlay:"prop_crayon_drawing_text.png",scene:"e5_11",choice:0},
tips:{
 traceLeakE5:"A ceiling stain often isn't right under the leak; water runs along joists and pipes before it drips. Trace it to the source before anything gets opened up. Call a licensed plumber.",
 waterLightE5:"If water is dripping through a light fixture, stay out of the water, don't touch the fixture or switch, and don't open the panel. Call a licensed electrician.",
 antiScaldE5:"Shower and tub-shower valves must be pressure-balance, thermostatic or combination anti-scald valves limited to 120°F (UPC 408.3, IPC 412.3). Replacing a shower valve is licensed work. Call a licensed plumber.",
 testBeforeCloseE5:"Repaired water lines must be tested and proved tight before a wall or ceiling gets closed over them (IPC 312.1/312.5, UPC 609.4). Call a licensed plumber.",
 mainFirstE5:"Find and close the house shutoff before a pressurized line gets opened, then open a faucet to prove it's off. Call a licensed plumber.",
 curbUtilityE5:"If the house shutoff won't hold, the curb valve belongs to the water utility. Call them, not a wrench. Then call a licensed plumber.",
 rightToolE5:"Youngster, right tool first, every time. Call a licensed plumber."
},
failEnding:"e5_endWaterfall",
driftAmount:13,
driftText:"<em>Drip. Drip. The stain gets a little wider.</em> (+13 Pressure)",
santo:{chance:0.07,meter:"R",amount:3,after:["e5_02","e5_03","e5_05","e5_06","e5_12"],text:SANTO+" "+"El Santo de Petin, patron of Mission San Petin, appears in the upstairs bath doorway with a sprig of chile petín and a plain halo ring. He watches Pete work and nods once. The {boy} runs to the van and brings him a cold sweet tea. He sips, smiles, and is gone. Pete never stopped working."},
resolve:[
 {if:{dalehacks:">=3"},to:"e5_endDale"},
 {if:{P:">=100"},to:"e5_endWaterfall"},
 {if:{flags:["traced","lightOff","mainOff","rightValve","tested","lena","kaylaText","hollisHeld"],notFlags:["wrongBreaker","mainGuess"],dalehacks:"0",R:">=70",T:">=30"},to:"e5_endSticker"},
 {if:{any:[{notFlags:["tested"]},{R:"<55"}]},to:"e5_endCallback"},
 {if:{T:"<25"},to:"e5_endBedtime"},
 {to:"e5_endDinner"}],
vanRunLines:{
 fail:["He comes back with the crimp tool and a tape measure. No gauge. \"It's in the van.\" It is in the van.","He comes back with Rick's coffee. Rick: \"Thanks, kid.\" Pete: \"Boy.\"","He comes back with the gauge and the wrong crimp jaws. Pete, still on hold, just points."],
 success:["Crimp tool and test gauge, first try. Rick looks almost impressed."],
 chance:0.65,failT:[4,8],failSeconds:45,failP:0,successT:3,failTip:"rightToolE5",
 pepperHighR:2,pepperHighNote:"Pete hears the van door slam on the beat and gives the {boy} a thumbs-up without looking. "},
stage:{kevin:false,water:"clean",
 npc:{img:"reyes_e5.png",scenes:["e5_02","e5_13"]},
 peteScene:{e5_04:"pete_phone_sigh.png",e5_07:"pete_phone_sigh.png",e5_08:"pete_phone_yessir.png",e5_11:"pete_phone_sweet.png"},
 workScenes:["e5_05","e5_06","e5_10","e5_12"],
 decor:{
  e5_02:[["rick_gc_e5.png",176,109,48,64,-1,2],["hector_shrug.png",226,109,48,64,0,1],["fx_ceiling_drip.png",150,28,16,32,-1,4]],
  e5_03:[["fx_ceiling_drip.png",150,28,16,32,-1,4],{if:{P:"<70"},ov:["fx_drywall_sag.png",136,4,32,32,0,2]},{if:{P:">=70"},ov:["fx_drywall_sag.png",136,4,32,32,1,2]},["fx_puddle.png",88,160,144,12,0,1]],
  e5_04:[["fx_ceiling_drip.png",150,28,16,32,-1,4]],
  e5_06:[["prop_shower_valve_pb.png",200,96,32,32,0,1]],
  e5_10:[["water_overlay.png",0,116,320,64,0,1],["prop_test_gauge.png",204,88,24,24,0,1],["prop_test_gauge_psi.png",204,88,24,24,0,1]],
  e5_12:[["rick_gc_e5.png",176,109,48,64,-1,2],["prop_push_coupling.png",240,141,32,32,0,1]]}},
scoring:{parSeconds:600},
verify:{endings:6,decisions:[12,13],excludeFromRange:["e5_endWaterfall","e5_endDale"],
 // picks per decision: e5_01..e5_13 (13 decisions)
 playScripts:[
  {picks:[0,0,0,1,0,0,1,0,1,0,0,0,1]},  // Bring Us a Sticker (secret)
  {picks:[0,0,0,0,0,0,1,0,1,0,0,0,0]},  // After Bedtime: took Darlene now
  {picks:[0,0,0,1,0,0,1,0,2,0,1,0,1]},  // Home for Dinner: Kayla ignored, Lena calls back later
  {picks:[0,0,0,1,0,1,1,0,1,0,0,1,0]},  // Callback: one early Dale hack unlocks Dale's way at e5_12 (merged with Hector's 30-second test)
  {picks:[0,0,0,1,0,1,2,0,1,3]},        // Dale's Way: cartridges, wrong part, tape (3 hacks)
  {picks:[0,1,2,0,1,0,1,0,0,1]},        // Kitchen Waterfall: dishwasher, Rick's breaker, Darlene now, towels
  {picks:[0,0,2,1,0,0,1,0,2,0,1,0,1]},  // Home for Dinner via Rick's breaker (secret lost)
  {picks:[0,0,0,1,2,0,0,0,1,0,0,0,1]}]},// After Bedtime via the water department (curb valve costs the secret its time)
scenes:{
e5_01:{who:"the van",bg:"van_stage",text:"Six-forty a.m. The van smells like coffee and PVC primer. Pete, keys in his teeth: \"Load up, Youngster. Ms. Reyes. Kitchen remodel. Rick's got a stain in the new ceiling and he wants it closed tonight.\" The {boy} remembers Ms. Reyes from the slab leak: she sent them home with tamales. Pete's phone is already buzzing in the cupholder. He lets it buzz. \"Today's going to be a phone day,\" he says, like a weatherman. He tosses the {boy} the van keys. \"Grab what we need for a ceiling stain. Think before you grab.\"",
 choices:[{label:"Moisture meter and flashlight",next:"e5_02",effects:{R:4},correct:true,note:"Pete nods. \"Good. We find it before we fix it.\""},
          {label:"Donuts for the crew first",next:"e5_02",effects:{T:3,R:-3},setFlags:["donuts"],note:"A dozen glazed. Rick will remember this. Pete looks at the clock and says nothing, loudly."}]},
e5_02:{who:"Rick (GC)",bg:"kitchen_ceiling_stain",drift:true,text:"Ms. Reyes's kitchen is down to the studs. New cabinets in boxes, new drywall stacked by the sink, and in the new ceiling a brown stain the size of a pizza, right under the upstairs bath. Rick the GC, hard hat, clipboard, pencil behind each ear: \"Seen it a million times. It's the dishwasher.\" Hector from Vela Cool &amp; Heat, there for the new air handler, doesn't look up from his phone: \"It's condensate, bro. Obviously.\" Ms. Reyes, in the doorway with a coffee: \"Pete, mijo, I trust you. I just want my kitchen by Thanksgiving.\" Pete touches the stain. It's warm.",
 choices:[{label:"Back Pete: \"Upstairs first.\" Trace it to the source",next:"e5_03",effects:{R:5},setFlags:["traced"],correct:true,tip:"traceLeakE5",note:"The moisture meter pegs two feet from the stain, along a joist, toward the tub. Warm water. Not condensate, not the dishwasher."},
          {label:"Agree with Rick: pull the dishwasher",next:"e5_03",effects:{R:-5,T:-7},alt:{if:{flags:["donuts"]},addEffects:{T:7},note:"Rick, mouth full of glazed, helps pull it himself. The floor under it is bone dry. \"Huh. Never seen that.\" Pete traces it upstairs anyway."},correct:false,tip:"traceLeakE5",note:"The floor under the dishwasher is bone dry. A dishwasher leak shows at the floor, not the ceiling. Pete traces it upstairs anyway."},
          {label:"Agree with Hector: check the attic air handler",next:"e5_03",effects:{T:-6,R:-2},correct:false,tip:"traceLeakE5",note:"The attic drain pan is dry. Hector shrugs: \"Not my drain.\" He's right. This ceiling sits under the bath, not the air handler, and the water's warm. Pete traces it upstairs anyway."}]},
e5_03:{who:"the light",bg:"kitchen_ceiling_stain",drift:true,text:"Then the recessed light can in the stain starts to drip. Tick. Tick. Water runs down the trim ring and onto Ms. Reyes's brand-new countertop. The light is on. The {boy} reaches for a towel. Rick reaches for the breaker panel, which is labeled in three handwritings and one piece of tape. Pete puts out an arm and stops them both. \"Nobody touches that light. Nobody touches that switch.\" Ms. Reyes, very calmly: \"Is my kitchen on fire?\" Pete: \"No ma'am. And it's going to stay that way.\"",
 choices:[{label:"Pete kills that circuit at the breaker, tags it, and leaves the fixture for an electrician",next:"e5_04",effects:{R:4,T:-3},setFlags:["lightOff"],correct:true,tip:"waterLightE5",note:"Pete finds the breaker by testing, not by the tape, switches it off, and hangs his tag. He doesn't open the panel and doesn't touch the fixture. He calls Ms. Reyes's electrician and gets her on the schedule."},
          {label:"Towel over the light, keep going",next:"e5_04",effects:{T:2,R:-4,P:6},setFlags:["towelLight"],correct:false,tip:"waterLightE5",note:"Pete takes the towel off the light before it's even settled. Nobody covers a wet live fixture. He kills the circuit himself."},
          {label:"Let Rick flip \"the one with the tape\"",next:"e5_04",effects:{P:8,T:2},setFlags:["wrongBreaker","lightOff"],correct:false,tip:"waterLightE5",note:"The fridge goes quiet. The light stays on. Pete finds the right breaker by testing, switches it off, tags it, and plugs the fridge back in. Rick: \"Who labels these?\""}]},
e5_04:{who:"Darlene (phone)",bg:"kitchen_ceiling_stain",drift:true,text:DARLENE+" "+"Pete's phone. Darlene, from dispatch. \"Quick one, Petin.\" Pete looks at the ceiling, at the {boy}, at the ceiling. Darlene has never once had a quick one. The {boy} is holding the phone at arm's length like it's hot. The stain is not getting smaller. Upstairs, the tub valve is still feeding the leak, and the shutoff is still open."+br+BUZZ+" "+DARLENE,
 choices:[{label:"Hand it to Pete now",next:"e5_05",effects:{T:-14,P:6},note:"It is not a quick one. \"#@%&!\" Twelve minutes on a warranty question about a toilet in Mesquite. The drip keeps time."},
          {label:"\"He'll call you back at a stopping point, Darlene\"",next:"e5_05",effects:{T:-2},note:"Darlene: \"Tell him it's a quick one.\" The {boy}: \"Yes ma'am.\" He writes QUICK ONE on his hand."}]},
e5_05:{who:"the upstairs bath",bg:"upstairs_bath_open",drift:true,text:"Upstairs. Ms. Reyes's guest bath: pink tile, a two-handle tub valve older than the {boy}, and a little puddle at the base of the tub where water has found its way out of the wall. The house shutoff is in the garage, a gate valve with a wheel handle and forty years of mineral crust. Pete sends the {boy} for it and stays with the leak. From the stairs: \"Boy, is it off?\" Downstairs, Rick is on the phone telling someone the ceiling will be closed tonight.",
 choices:[{label:"\"Closed it, and I opened the tub to check. Nothing.\"",next:"e5_06",effects:{P:-10},setFlags:["mainOff"],correct:true,tip:"mainFirstE5",note:"The tub spout coughs and goes quiet. Pete nods at the open faucet. \"That's how you know.\""},
          {label:"\"Pretty sure it's off\"",next:"e5_06",effects:{R:-5,T:-5},setFlags:["mainOff","mainGuess"],correct:false,tip:"mainFirstE5",note:"Pete goes down and checks it himself. Half a turn left. He finishes closing it and opens the tub to prove it."},
          {label:"The house valve won't hold: call the water department for the curb valve",next:"e5_06",effects:{R:3,T:-8},setFlags:["mainOff"],correct:true,tip:"curbUtilityE5",note:"The wheel spins and the water keeps coming. The {boy} calls the water department; their tech closes the curb valve. Pete adds a new house shutoff to the quote."}]},
e5_06:{who:"the tub wall",bg:"tub",text:"Pete opens the access panel behind the tub. The {boy} holds the flashlight, mostly on the wall. In there: pitted 1980s copper, green at every joint, sweated into a two-handle valve with no anti-scald protection at all. On the hot line, a push-fit coupling that has walked half off the pipe. Tucked into the insulation, like a signature: Dale's business card. \""+"DALE. HANDY. NO JOB TOO SMALL.\" "+CARD+" On the back, in pencil: \"just do new cartridges, it's fine.\" Pete sighs the sigh of a man who has met Dale's work before. Rick, from downstairs: \"Can you just swap the cartridge?\"",
 choices:[{label:"Pete quotes a pressure-balance valve and cuts out Dale's coupling",next:"e5_07",effects:{R:6,T:-4},setFlags:["rightValve"],correct:true,tip:"antiScaldE5",note:"\"A shower valve has to be pressure-balance or thermostatic, and limited to 120. This one is neither. New valve, new copper, and Dale's coupling goes in the bucket.\" Ms. Reyes approves it on the spot. Now he needs the part."},
          {label:"Dale's card says just new cartridges",next:"e5_07",effects:{T:4,R:-6},hack:true,setFlags:["daleCoupling"],correct:false,tip:"antiScaldE5",note:"The {boy} reads the card out loud like it's scripture. Pete puts the card in his pocket. \"New cartridges in a valve that can scald somebody is still a valve that can scald somebody.\""},
          {label:"Dale's way: tape and a hose clamp on the pinhole",next:"e5_07",effects:{T:5,R:-8,P:10},hack:true,setFlags:["daleCoupling"],correct:false,tip:"antiScaldE5",note:"The {boy} has the tape out before Pete turns around. Pete unwraps it. \"Tape is how we got here.\""}]},
e5_07:{who:"the supply house (on hold)",bg:"van_stage",text:"Pete calls the supply house for the valve. \"Thank you for calling. Your call is important to us. Please hold.\" The hold music starts: a tinny, cheerful loop with a beat you could run to. Pete puts it on speaker, sets the phone on the toilet tank, and points down the stairs without looking. \"Boy. Van. Crimp tool and the test gauge. Before this song loops.\" The song is forty seconds long. The {boy} has already been gone for two of them.",
 variants:[{if:{flags:["blessed"]},text:"Pete calls the supply house for the valve. \"Thank you for calling. Your call is important to us. Please hold.\" The hold music starts: a tinny, cheerful loop with a beat you could run to. Even the hold music sounded nicer. Pete puts it on speaker, sets the phone on the toilet tank, and points down the stairs without looking. \"Boy. Van. Crimp tool and the test gauge. Before this song loops.\" The song is forty seconds long."}],
 choices:[{label:"Run to the van for the crimp tool and test gauge",next:"e5_08",vanRun:true,effects:{T:-4}},
          {label:"Wait on hold with Pete",next:"e5_08",effects:{T:-6,R:2},note:"The loop plays eleven times. Pete hums the bass line. The {boy} learns all the words, and there are no words."},
          {label:"Hang up, use what's on the van (Dale's way)",next:"e5_08",effects:{T:3,R:-6},hack:true,setFlags:["wrongPart"],showIf:{dalehacks:">=1"},correct:false,tip:"antiScaldE5",note:"The {boy} hangs up Pete's phone. There's no pressure-balance valve on the van. Pete calls back and goes to the end of the line."}]},
e5_08:{who:"Mr. Hollis (phone)",bg:"upstairs_bath_open",text:HOLLIS+" "+"Still on hold. Then Pete's other phone rings: Mr. Hollis, the master plumber, the man whose license is on the van. Pete has a phone in each hand and the hold music in one ear. Mr. Hollis: \"Pete. Need you across town after this one. Commercial job, they're waiting.\" The {boy} watches Pete decide something. Downstairs, Rick is measuring drywall.",
 choices:[{label:"Pete: \"Yes sir. I'll finish this one right first, sir.\"",next:"e5_09",effects:{R:4,T:-3},setFlags:["hollisHeld"],correct:true,note:"A pause. Mr. Hollis: \"Good. Do it right.\" Pete puts that phone down very gently."},
          {label:"\"Hand me the other phone\": drop the supply house hold",next:"e5_09",effects:{T:-5},setFlags:["requeued"],note:"The supply house hangs up. Pete calls back. \"Your call is important to us.\" Back of the line. The part shows up an hour late."}]},
e5_09:{who:"Kayla (phone)",bg:"upstairs_bath_open",text:KAYLA+" "+"The {boy}'s phone buzzes in his back pocket. Kayla. A heart emoji, then a calendar emoji, then just: \"???\" Today is their anniversary. Six months. He forgot. Pete, without looking up from the copper: \"That your girlfriend?\" The {boy}: \"No.\" Pete: \"Uh huh.\""+br+BUZZ,
 choices:[{label:"Answer it",next:"e5_10",effects:{R:-4,T:-3},note:"\"Hi, babe, I'm at work, I'm, yes, I know what today is.\" Pete hands him the flashlight back without a word."},
          {label:"Text: \"On a job, call you at lunch ♥ happy 6 months\"",next:"e5_10",effects:{R:3},setFlags:["kaylaText"],correct:true,note:"Three dots. Then: \"ok ♥\". Pete, who saw nothing: \"Good man.\""},
          {label:"Ignore it",next:"e5_10",setFlags:["kaylaMad"],note:"The phone stops. Then it buzzes once more, shorter. That's worse."}]},
e5_10:{who:"the test fill",bg:"tub",shake:true,text:"The part is in. Pete sweats the new copper, sets the pressure-balance valve and crimps the last joint. Water back on, slow, for the test. Then a hiss: a fitting downstream lets go and sprays across the bath like a sprinkler. The {boy} is soaked. Downstairs, Ms. Reyes says \"Ay, no\" to the ceiling.",
 variants:[{if:{flags:["daleCoupling"]},text:"The part is in. Pete sets the new valve. Water back on, slow, for the test. Then a pop: Dale's other push-fit coupling, the one on the cold side nobody cut out, shoots off the pipe and sprays across the bath. The {boy} is soaked. Downstairs, Ms. Reyes says \"Ay, no\" to the ceiling."}],
 choices:[{label:"Hit the house shutoff fast",next:"e5_11",effects:{P:-15},correct:true,note:"The {boy} takes the stairs in three jumps. The spray dies. Pete fixes the joint and refills slower."},
          {label:"Grab towels first",next:"e5_11",effects:{P:15},note:"Six towels later, the water is through the subfloor. Pete shuts it off himself."},
          {label:"Yell for Rick",next:"e5_11",effects:{P:13,T:-5},note:"Rick comes up the stairs, looks, and says \"Seen it a million times.\" Then he goes and shuts it off."},
          {label:"Dale's way: wrap it with tape and keep filling",next:"e5_11",effects:{P:10,R:-6},hack:true,showIf:{dalehacks:">=1"},correct:false,tip:"testBeforeCloseE5",note:"The tape holds for nine seconds. Pete shuts it off himself."}]},
e5_11:{who:"Lena (phone)",bg:"upstairs_bath_open",text:LENA+" "+"Pete's personal phone. The screen says LENA with a picture of two little girls in matching rain boots. The {boy} holds it up. Pete's hands are full of copper. On speaker, Lena: \"Hey you. When are you coming home?\" In the background, the girls: \"Hi Daddy!\" \"Are you fixing water?\" \"Bring us a sticker!\" Pete's face does something the {boy} has never seen it do.",
 choices:[{label:"Hand Pete the phone now",next:"e5_12",effects:{T:-5},setFlags:["lena"],note:"Pete puts down the copper and takes it. \"Hi, baby. Yes, I'm fixing water. Yes, I'll ask about stickers.\" Ninety seconds. He comes back to the wall lighter."},
          {label:"Hold it; he'll call back from the van",next:"e5_12",effects:{T:-8},alt:{if:{flags:["kaylaMad"]},addEffects:{T:-3},note:"Then the {boy}'s phone again: Kayla, on the other line. It is not a short call."},note:"\"He's in the wall, Ms. Lena. He'll call you from the van.\" Lena: \"Tell him the girls drew him something.\""}]},
e5_12:{who:"Rick (GC)",bg:"kitchen_ceiling_stain",text:"Everything is dry. The new valve is in, Dale's coupling is in the bucket, and the copper is new from the valve to the wall. Rick has the drywall lift ready. \"Just cap it and close it tonight. My guys are here till six.\" Hector, on his way out: \"Run the shower thirty seconds. If it looks dry, it's dry.\" Ms. Reyes looks at Pete. Pete looks at the {boy}.",
 choices:[{label:"Back Pete: pressure test at working pressure, inspect, then close",next:"e5_13",effects:{R:8,T:-10},setFlags:["tested"],correct:true,tip:"testBeforeCloseE5",note:"Gauge on, line up to working pressure, fifteen minutes on the clock. The needle doesn't move. Pete walks every joint with the flashlight. Then, and only then: \"Close it, Rick.\""},
          {label:"Dale's way: run the shower thirty seconds like Hector says, close it now, test \"tomorrow\"",next:"e5_13",effects:{T:6,R:-10},hack:true,setFlags:["ceilingClosed","shortTest"],showIf:{dalehacks:">=1"},correct:false,tip:"testBeforeCloseE5",note:"It looks dry. Looking dry isn't a test. Rick's crew has the first sheet up before Pete's back from the van. Pete makes them take it down."}]},
e5_13:{who:"the invoice",bg:"van_stage_night",resolve:true,text:"Dusk in Ms. Reyes's driveway. Pete writes up the invoice on the hood of the van: new pressure-balance valve, new copper, Dale's coupling removed, the light circuit tagged for the electrician, what was tested and how. The {boy} reads it twice. Ms. Reyes brings out a plate of tamales wrapped in foil. Rick's crew is loading out. Pete's phone buzzes one more time. He turns it face down.",
 choices:[{label:"Standard rate, itemized",next:"resolve",sfx:"cash_register"},
          {label:"Show Ms. Reyes her shutoff for next time",next:"resolve",effects:{R:3,T:3},requires:{R:">=60"},lockHint:"Reputation 60+",stakes:"Needs Rep 60. Ms. Reyes is still looking at her ceiling.",note:"Pete walks her to the garage and shows her the valve. She writes PETE on it in Sharpie."},
          {label:"Write off the donuts",next:"resolve",effects:{T:2},note:"Line item: \"1 doz glazed. No charge.\""}]}
},
endings:{
e5_endDale:{end:true,card:"card_endDaleE5.png",cardOverlay:"card_endDaleE5_text.png",cardX:53,scoreMult:0.5,tag:"Dale's Way",hackRecap:true,text:"The ceiling gets closed over Dale's card. Rick loves it. At 2 a.m., Ms. Reyes calls: there's a new stain, and it's dripping into her new sink. Pete answers on the first ring. \"Hold, please.\" Then he gets dressed. In the morning he cuts the ceiling open, pulls every one of Dale's fixes, and does it right, on his own time.",endTip:"A hack hides a leak. It doesn't fix it.",whyLicensed:"The licensed plumber answers for the job being safe and to code, and for the apprentice learning it right."},
e5_endWaterfall:{end:true,card:"card_endWaterfall.png",cardX:53,fail:true,scoreMult:0.5,tag:"Kitchen Waterfall",text:"The new drywall bows, sags and lets go, all at once, into Ms. Reyes's new sink. A sheet of warm water follows it. Everyone stands very still. Rick, softly: \"Seen it a million times.\"",endTip:"Shutoff first, and prove it's off. Call a licensed plumber.",whyLicensed:"The licensed plumber answers for the job being safe and to code, and for the apprentice learning it right."},
e5_endCallback:{end:true,card:"card_endCallback.png",cardX:53,good:true,tag:"Callback",text:"Nine p.m. Ms. Reyes texts a photo: a brand-new brown stain in a brand-new ceiling. Pete looks at it for a long time. \"Well, Youngster. Tomorrow we do it right.\"",
 variants:[{if:{flags:["towelLight"]},text:"Nine p.m. Ms. Reyes calls: the kitchen light is buzzing, and there's a fresh brown ring around it. The electrician is already on the way. Pete: \"Well, Youngster. Tomorrow we do it right.\""},
  {if:{flags:["ceilingClosed"]},text:"Nine p.m. The ceiling Rick closed at six has a stain in it by nine. Pete: \"Tomorrow we test before anybody closes anything, Youngster. Then we do it right.\""}],
 endTip:"Test it and prove it tight before the ceiling closes.",whyLicensed:"The licensed plumber answers for the job being safe and to code, and for the apprentice learning it right."},
e5_endBedtime:{end:true,card:"card_endBedtime.png",cardX:53,good:true,tag:"After Bedtime",text:"Pete gets home after bedtime. The house is dark except the microwave light. There's a plate inside with a sticky note: \"2 min. Love you.\" On the fridge, a new crayon drawing: a yellow van, a man with a wrench, and in big letters, DADDY FIXES WATER. He stands there a long time. The job was done right. It just took all day.",
 variants:[{if:{flags:["kaylaMad"]},text:"Pete gets home after bedtime: a plate in the microwave and a crayon drawing on the fridge, DADDY FIXES WATER. Across town the {boy} is on Kayla's porch at ten p.m. with gas-station flowers, apologizing through a screen door. The job was done right. It just took all day."}],
 endTip:"Doing it right takes time. Call a licensed plumber.",whyLicensed:"The licensed plumber answers for the job being safe and to code, and for the apprentice learning it right."},
e5_endDinner:{end:true,card:"card_endDinner.png",cardX:53,good:true,tag:"Home for Dinner",text:"Tested, tight, closed, and out the door by six. Pete makes it home for dinner. The {boy} makes it to Kayla's with grocery-store flowers and a story about a man who held for forty minutes. She laughs at the right parts.",
 variants:[{if:{flags:["kaylaMad"]},text:"Tested, tight, closed, and out the door by six. Pete makes it home for dinner. The {boy} makes it to Kayla's with grocery-store flowers. He sleeps on her parents' couch side of the conversation for a week. Worth it."}],
 endTip:"Test before you close. Call a licensed plumber.",whyLicensed:"The licensed plumber answers for the job being safe and to code, and for the apprentice learning it right."},
e5_endSticker:{end:true,bonus:true,card:"card_endSticker.png",cardX:53,good:true,tag:"Bring Us a Sticker",text:"Everything by the book: traced, light circuit off for the electrician, shutoff proved, the right valve, Dale's coupling out, tested at working pressure before the ceiling closed, and every phone call handled right. Pete walks in before dinner with a PlumbPetin sticker for each girl. They put them on their rain boots. Mr. Hollis texts: \"Good work. Both of you.\" Pete shows the {boy} the text and doesn't say anything. He doesn't have to.",endTip:"Do the job right and answer the right calls. Call a licensed plumber.",whyLicensed:"The licensed plumber answers for the job being safe and to code, and for the apprentice learning it right."}
}
});
})();
