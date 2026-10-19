// TRAP FULL — Episode 3: "Mystery Leak: The Haunting of Walt's Laundry" (Halloween cut). Data only (schema 1); engine is index.html.
// Spec: design/episodes/ep3-halloween-mystery-leak.md over ep3-mystery-leak.md. Balance carries over; text reskinned,
// ev_flicker/ev_knock added, bonus ending Ghost Pipe. Halloween art batch wired in (stage.decor, bgFrames).
// Art: Ep3 batch from Art (assets/README.md, contact_sheet_ep3.png). Overlay spots for the drywall cut and cold line are Builder picks (see stage.overlays).
// Doc flag `supplyOff` is the engine's drift-stop flag `mainOff` here (house main or branch isolation).
(function(){
function spr(file,n,w,h,s,f,alt){const kf={2:"p2",3:"k3",4:"p4"}[n];
 const pos=(typeof f==="number"&&n>1)?(f/(n-1)*100)+"% 0":"0 0";
 const anim=(typeof f!=="number"&&kf)?";animation:"+kf+" "+(n*0.3)+"s steps("+n+") infinite":"";
 return '<span role="img" aria-label="'+(alt||"")+'" style="display:inline-block;vertical-align:middle;width:'+(w*s)+'px;height:'+(h*s)+'px;background-image:url(assets/img/'+file+');background-size:'+(n*100)+'% 100%;background-position:'+pos+';image-rendering:pixelated'+anim+'"></span>';}
const DIAL=spr("prop_meter_dial.png",4,32,32,2,undefined,"Water meter dial creeping");
const BUZZ=spr("fx_phone_buzz.png",4,32,32,2,undefined,"Phone buzzing");
const DARLENE=spr("darlene_phone.png",2,48,48,2,undefined,"Darlene on the phone");
const TEA=spr("boy_pumpkintea.png",2,40,60,1.5,undefined,"The Boy with a paint-bucket pumpkin spice sweet tea");
const NOTE=spr("prop_sticky_note.png",1,16,16,2,undefined,"Dale's sticky note");
const LITTER=spr("prop_kitty_litter.png",1,24,32,1.5,undefined,"Bag of kitty litter");
const DYE=spr("fx_dye_red.png",2,32,16,2,undefined,"Blood-red food dye in the standpipe");
const TOWELS=spr("prop_paper_towels.png",1,16,16,2,undefined,"Paper towels");
const DRIP=spr("fx_drip.png",4,8,16,2,undefined,"Drip");
const br="<br>";
registerEpisode({
id:"ep03",title:"Mystery Leak",week:3,schema:1,release:"2026-10-23T08:00-05:00", // Halloween gate, Fri Oct 23 8:00 AM CT (regular Friday slot). Must match episodes/index.js.
start:{scene:"e3_01",P:30,R:50,T:60,flags:{}},
meters:["P","R","T"],
meterLabels:{P:"Water in the wall"},
bgCaptions:{e1_kitchen_halloween:"Walt's kitchen",e1_laundry_night:"The laundry room",van_stage_night:"The van"},
codeTip:"ruleOut",
thumb:"assets/img/thumb_ep03_halloween.png",
hackThreshold:3, // Director Oct 18: raised from 2 (doc). Kitty Litter now needs 3 of the 4 Dale hacks
resultFrame:{src:"assets/img/result_frame_1200x675.png",window:[42,42,701,413]},
art:["bg_van_stage.png","bg_e1_kitchen_morning.png","bg_e1_laundry.png","card_endFloodOut.png","card_endKittyLitter.png","card_endHectorsFault.png","card_endCaseCracked.png","thumb_ep03.png","walt.png","hector_hvac.png","boy_sweettea.png","ov_washer_pulled.png","ov_drywall_cut.png","ov_cold_line.png","fx_puddle.png","fx_dye_red.png","card_endGhostPipe.png","fx_drip.png","prop_condensate_line.png","prop_drywall_saw.png","prop_paper_towels.png","prop_sticky_note.png","prop_kitty_litter.png","darlene_phone.png","fx_phone_buzz.png","prop_meter_dial.png","bg_van_stage_night.png","bg_e1_kitchen_halloween.png","bg_e1_laundry_night.png","card_endFloodOut_hw.png","card_endKittyLitter_hw.png","card_endHectorsFault_hw.png","card_endCaseCracked_hw.png","thumb_ep03_halloween.png","hector_hvac_cape.png","walt_robe.png","boy_sheetghost.png","boy_pumpkintea.png","prop_skeleton_grabber.png","ov_washer_walk.png","ov_pipe_strap.png","ov_hose_skull.png","fx_cobweb.png","fx_flashlight_cone.png","prop_pumpkin.png","prop_chile_wreath.png","prop_candy_bowl.png"],
sprites:{boy:{idle:"boy_idle.png",drink:"boy_sweettea.png",frames:2,w:40,h:60},vanRun:{src:"fx_van_run.png",frames:3,w:96,h:16}},
tips:{
 ruleOut:"Intermittent leaks have a pattern. Note when it shows up (wash days, AC running, overnight) and rule out the easy suspects first. Can't pin it down? Call a licensed plumber.",
 condensate:"AC/furnace condensate lines drip only when the AC runs. Check that the line and trap are clear and draining where they should. HVAC drain work is for the HVAC pro or a licensed plumber.",
 washerHoses:"Check both washer supply hoses and the drain hose/standpipe for drips, bulges or cracks. Braided hoses and replacing them every few years helps. Wet wall behind it? Call a licensed plumber.",
 dyeTest:"Dry test: dry everything, lay paper towels, wait. Add food dye to the drain or condensate pan; if colored water shows up, that's your source. Clear water elsewhere points to the supply: that's when you call a licensed plumber.",
 meterTest:"Turn off every fixture and watch the water meter. If it still moves, the leak is on the pressurized supply. Close the main and call a licensed plumber.",
 branchVsBox:"The washer valves only stop water at the washer. A leak upstream needs the house main or the branch shutoff. Close it and call a licensed plumber.",
 inspectionCut:"Pros open a small inspection cut at the wet spot after checking for wires and pipes, not a big hole. Call a licensed plumber.",
 licensedRepair:"Cutting out and repairing a cracked supply line inside a wall is licensed-plumber work, usually followed by a pressure test. Don't DIY it.",
 rightTool:"Youngster, right tool first, every time.",
 waterHammer:"Bangs or knocks when a faucet or washer valve shuts off are usually water hammer or a loose pipe strap. Have a licensed plumber check your water pressure and secure the lines.",
 hauntedLights:"Lights that flicker when a big appliance kicks on aren't a plumbing problem, and they aren't a ghost. Have a licensed electrician check it.",
 // mainFirstLicensed / testRunLicensed: Ep3 copies of the global mainFirst / testRun with the licensed-plumber line (separate keys: the engine forbids overriding global tips; Ep0–Ep2 keep the global text).
 mainFirstLicensed:"Find and close the house main before you open up a pressurized line. Call a licensed plumber.",
 testRunLicensed:"After a repair, run water and check every joint for drips before you call it done. Call a licensed plumber."
},
failEnding:"e3_floodout",
driftAmount:8, // DESIGN NOTE: spec says start P 15 / drift +6 (Flood Out 1.3% of random play). Drift is +8 (Director); start P is 30 and Dale hacks cost +2 water (Director-approved Ep3 rebalance), giving Flood Out 16.0%.
driftText:"<em>Drip. ...drip.</em> (+8 Water)",
resolveCallback:{unlessFlag:"tested",R:-10,text:"<b>Callback:</b> the wall got closed untested. −10 Reputation."},
resolve:[
 {if:{P:">=100"},to:"e3_floodout"},
 {if:{dalehacks:">=3"},to:"e3_kittylitter"},
 {if:{any:[{flags:["blamedHector"]},{notFlags:["condensateCleared","found","bigHole"]}]},to:"e3_hectorsfault"},
 {if:{flags:["found","hammerHeard"],dalehacks:"0",R:">=60"},to:"e3_ghostpipe"}, // bonus: small cut + knock heard + zero hacks + R>=60; callback (untested) runs count
 {to:"e3_casecracked"}],
vanRunLines:{
 fail:["He comes back with a pumpkin spice sweet tea the size of a paint bucket."+" "+TEA,"A plastic skeleton hand. \"It's a grabber.\""+" "+TEA,"The leaf blower. Again."+" "+TEA],
 success:["Saw, light, vac! Hector slow-claps in his cape."+" "+TEA],
 chance:0.75,failT:[5,10],failSeconds:45,failP:5,successT:3,failTip:"rightTool"},
events:[
 {id:"ev_flicker",at:["e3_03"],chance:0.5,setFlags:["flickered"],text:"The bulb flickers. Walt: \"It knows you're here.\" Pete changes nothing and keeps working.",effects:{}},
 {id:"ev_cat",at:["e3_05"],chance:0.4,text:"Walt's black cat walks through the puddle and leaves paw prints toward the wrong wall. Pete doesn't follow the cat.",effects:{T:2}},
 // e3_08: one event per scene at most; ev_knock rolls first, ev_hectorcall only if it did not fire. ev_knock 0.30 -> 0.40 (doc lever) -> 0.80 (Director).
 {id:"ev_knock",at:["e3_08"],chance:0.80,text:"<b>BANG-bang-bang</b> behind the wall the instant the {boy} slams a faucet off. Walt drops his mug. Pete puts a hand on the wall: \"Water hammer.\"",effects:{T:-1},setFlags:["hammerHeard"],shake:true,tip:"waterHammer"},
 {id:"ev_hectorcall",at:["e3_08"],chance:0.4,text:"Hector's boss calls. Hector, loudly: \"It's the plumbing. Or the occult.\" Pete stays calm.",effects:{R:2}}],
stage:{kevin:false,water:"clean",
 npc:{img:"walt_robe.png",scenes:["e3_02","e3_06","e3_10","e3_12"]},
 workScenes:["e3_05","e3_08","e3_10"],
 props:{e3_03:["prop_condensate_line.png",1,32,32],e3_07:["boy_pumpkintea.png",2,40,60],e3_08:["prop_drywall_saw.png",1,32,32],e3_12:["fx_puddle.png",3,48,12]},
 overlays:{
  e3_05:["ov_washer_pulled.png",104,80,96,64],e3_06:["ov_washer_pulled.png",104,80,96,64],
  // Builder picks: small inspection cut one stud bay right of the washer box, at the wet streak (176,44); big hole centred over the box (100,30);
  // cold line sits inside the small cut (184,44): weep, spray while the supply is on, repaired after e3_10.
  e3_09:{variants:[{if:{flags:["found"]},ov:["ov_drywall_cut.png",176,44,64,48,0,2]},{if:{flags:["bigHole"]},ov:["ov_drywall_cut.png",100,30,64,48,1,2]}]},
  e3_10:{variants:[{if:{any:[{flags:["found"]},{flags:["bigHole"]}],notFlags:["mainOff"]},ov:["ov_cold_line.png",184,44,48,48,1,3]},{if:{any:[{flags:["found"]},{flags:["bigHole"]}]},ov:["ov_cold_line.png",184,44,48,48,0,3]}]},
  e3_11:{variants:[{if:{flags:["repaired"]},ov:["ov_cold_line.png",184,44,48,48,2,3]}],ov:["ov_cold_line.png",184,44,48,48,0,3]}},
 dale:{e3_03:"hector_hvac_cape",e3_04:"hector_hvac_cape",e3_08:"hector_hvac_cape",e3_11:"hector_hvac"}, // e3_11 text: "Hector, cape off"
 // Halloween night laundry is a 2-frame strip (bulb on / off); the off frame shows when ev_flicker fires at e3_03.
 bgFrames:{e1_laundry_night:2},bgFrame:{e3_03:{if:{flags:["flickered"]},frame:1}},
 // Set dressing (320x180 stage coords). Kitchen and van backgrounds already carry the pumpkins, wreath, candy, cobwebs and dash pumpkin.
 decor:{
  e3_02:[["boy_sheetghost.png",196,96,48,64,-1,2]],
  e3_03:[["prop_pumpkin.png",272,130,24,24,0,3]],
  e3_04:[["ov_washer_walk.png",104,84,96,64,-1,2]],
  e3_05:[["fx_cobweb.png",264,0,56,56,0,1]],
  e3_06:[["prop_chile_wreath.png",28,22,32,32,0,1],["prop_pumpkin.png",272,130,24,24,1,3]],
  e3_07:[["prop_skeleton_grabber.png",236,130,32,32,0,1]],
  e3_08:[{if:{flags:["hammerHeard"]},ov:["ov_pipe_strap.png",176,44,48,48,-1,2]}],
  // flashlight finds the "skull" (a coiled hose bib) in the fresh cut, then the beam rests on the cold line at the reveal
  e3_09:[{if:{flags:["found"]},ov:["ov_hose_skull.png",184,44,48,48,0,1]},{if:{flags:["bigHole"]},ov:["ov_hose_skull.png",108,30,48,48,0,1]}],
  e3_10:[{if:{flags:["found"]},ov:["fx_flashlight_cone.png",116,52,64,32,0,1]},{if:{flags:["bigHole"]},ov:["fx_flashlight_cone.png",116,52,64,32,0,1]}],
  e3_11:[["prop_pumpkin.png",272,130,24,24,2,3]],
  e3_12:[["prop_candy_bowl.png",150,124,24,24,0,1],["boy_sheetghost.png",204,96,48,64,-1,2]]}},
scoring:{parSeconds:480},
verify:{endings:5,decisions:[11,12],excludeFromRange:["e3_floodout"],
 // Scripted runs for the built-in verify (choice index per decision, e3_01..e3_12). The beam alone misses the 3+ hack route.
 playScripts:[
  [0,2,0,2,0,0,1,2,1,2,0,0],  // Kitty Litter: 4 Dale hacks, main closed so it doesn't flood
  [0,2,0,0,0,0,1,0,1,0,0,0],  // Case Cracked, full (found + tested + Rep 55+); one Dale hack at e3_02 keeps it out of Ghost Pipe (knock fires on VERIFY1)
  [0,2,0,0,0,0,1,0,1,0,1,0],  // Case Cracked callback: wall closed untested; one Dale hack keeps it out of Ghost Pipe
  [0,0,1,0,0,0,1,1,1,0,0,0],  // big hole + condensate never ruled out: counts as found, so no Hector's Fault (callback)
  [0,0,1,0,0,0,1,0,1,0,2,0],  // Hector's Fault: blame Hector, then blame the AC at e3_11
  {picks:[0,0,0,0,0,0,1,0,1,1,0,0],forceEvents:["ev_knock"]}]}, // Ghost Pipe: small cut, knock heard, 0 hacks, Rep 60+
scenes:{
e3_01:{who:"Darlene (radio)",bg:"van_stage_night",text:"Radio crackles. A pumpkin grins on the dash. Darlene: \"Petin, man says his house is haunted. Groans at night, knocks in the walls, and the washer's <em>possessed</em>. Three guys already looked.\"",
 choices:[{label:"\"Rolling.\"",next:"e3_02",effects:{T:5},sfx:"radio_static"},
          {label:"\"Haunted's extra. Bill the trauma fee.\"",next:"e3_02",effects:{R:-2,T:3},sfx:"radio_static"}]},
e3_02:{who:"Walt",bg:"e1_kitchen_halloween",shake:true,text:"Jack-o'-lanterns, a chile petín wreath, fake cobwebs on the towel rack. Mr. Walt Okafor, in a bathrobe: \"Monday soaked, today dry. It's a ghost. Or it's Hector's new AC. Probably both.\" <b>CLUNK.</b> The fridge drops a load of ice. Pete doesn't blink: \"Ice maker.\" Dale's sticky note hangs under a pumpkin magnet. "+NOTE,
 choices:[{label:"Ask when it happens, how much, and after what: wash days? AC running? Overnight?",next:"e3_03",effects:{R:5,T:-2},setFlags:["history"],correct:true,tip:"ruleOut"},
          {label:"\"Let's just go look.\"",next:"e3_03",effects:{T:2}},
          {label:"Read Dale's sticky note: \"Leak? Kitty litter. Ghosts hate it too.\"",next:"e3_03",effects:{P:2,R:-6},setFlags:["litter"],hack:true,correct:false,tip:"ruleOut"}]},
e3_03:{who:"Hector (HVAC)",bg:"e1_laundry_night",text:"The laundry bulb flickers. Hector, by the air handler, in a cheap vampire cape (\"company costume day\"): \"It's the washer. Always the washer.\" Walt: \"Or a poltergeist.\" Hector: \"...Or a poltergeist.\" The condensate line runs down the wall into the washer standpipe. A puddle sits under the washer. "+DRIP+"",
 variants:[{if:{flags:["litter"]},text:"Hector, by the air handler: \"It's the washer. Always the washer.\" He nudges the bag of kitty litter Walt poured under it, cape swishing. \"...Or that.\" "+LITTER+" The condensate line runs down the wall into the washer standpipe."},
           {if:{flags:["history"]},text:"Walt's answer: worst on mornings after wash day, nothing on weekends away. Hector, by the air handler: \"It's the washer. Always the washer. My drain's brand new.\" The condensate line runs down the wall into the washer standpipe."}],
 choices:[{label:"Rule out the condensate first: check the trap and line, dry it, run the AC and watch it",next:"e3_04",effects:{R:6,T:-3},setFlags:["condensateCleared"],correct:true,tip:"condensate"},
          {label:"Blame Hector to Walt's face",next:"e3_04",effects:{R:-4,T:4},setFlags:["hectorMad"]},
          {label:"\"{boy}, check the AC drain.\"",next:"e3_04",effects:{T:-5},tip:"condensate",note:"He turns the thermostat to HEAT \"so it'd dry.\" The vents moan. Pete: \"Opposite, {boy}.\""}]},
e3_04:{who:"Hector (HVAC)",bg:"e1_laundry_night",shake:true,text:"Pete pulls the washer out. The unbalanced drum <b>THUMPS</b> and walks across the floor at him. Pete pulls the plug: \"Unbalanced load. Not a demon.\" Nobody's proved the condensate line either way.",
 variants:[{if:{flags:["condensateCleared"]},text:"The drum <b>THUMPS</b> and walks at Pete; he pulls the plug: \"Unbalanced load. Not a demon.\" The condensate line is clear and dumps into the standpipe right where it should. Pete: \"Your drain's fine.\" Hector, half an apology: \"Told you.\""},
           {if:{flags:["hectorMad"]},text:"The drum <b>THUMPS</b> and walks at Pete; he pulls the plug: \"Unbalanced load. Not a demon.\" Hector is not talking to Pete now. He is talking very loudly to his phone. Nobody's proved the condensate line either way."}],
 choices:[{label:"Unplug the washer, pull it out, and check both hoses and the drain box",next:"e3_05",effects:{R:5,T:-3},setFlags:["washerCleared"],correct:true,tip:"washerHoses"},
          {label:"Replace both hoses \"to be safe\" without looking",next:"e3_05",effects:{T:3,R:-2}},
          {label:"Dale's note: \"Duct tape. Ghosts can't get through Dale tape.\"",next:"e3_05",effects:{P:2,R:-8},hack:true,correct:false,tip:"washerHoses"}]},
e3_05:{who:"you",bg:"e1_laundry_night",drift:true,text:"A crawlspace hatch by the dryer is cracked open, breathing a cold draft. A cobweb hits Pete's flashlight. Washer out. Damp drywall <em>above</em> the washer box and a bubbled baseboard. Something in that wall is wet.",
 variants:[{if:{flags:["washerCleared"]},text:"A cold draft from the crawlspace hatch; a cobweb across the flashlight. Washer out. Hoses dry, drain box dry. But the drywall <em>above</em> the washer box is damp, and the baseboard's bubbled. It's not the washer."}],
 choices:[{label:"Meter test: every fixture off, watch the dial",next:"e3_06",effects:{R:6,T:-3},setFlags:["meterTest"],correct:true,tip:"meterTest"},
          {label:"Dye/dry test: dry everything, red food dye in the standpipe and condensate pan, paper towels down, wait",next:"e3_06",effects:{R:5,T:-5},setFlags:["dryTest"],correct:true,tip:"dyeTest"},
          {label:"\"{boy}, watch the meter.\"",next:"e3_06",effects:{T:-6,P:3},note:"He watches the <em>electric</em> meter. It is very busy."}]},
e3_06:{who:"Walt",bg:"e1_laundry_night",drift:true,enterTip:"branchVsBox",enterTipRecap:true,text:"Still a mystery. Walt is looking at Hector again, and Hector is looking at the ceiling.",
 variants:[{if:{flags:["meterTest"]},text:"Every fixture's off and the dial is creeping. Walt whispers: \"The ghost is using water.\" Pete: \"The ghost is a cracked supply line.\""+br+DIAL},
           {if:{flags:["dryTest"]},text:"The towels under the standpipe and condensate pan are clean, and the blood-red dye stays in the drain. (\"It's food coloring, Walt.\") "+TOWELS+" "+DYE+" A clear wet streak runs down from inside the wall. It's the supply."}],
 choices:[{label:"Close the house main (or the branch valve) before opening anything",next:"e3_07",effects:{P:-10,R:5},setFlags:["mainOff"],correct:true,tip:"mainFirstLicensed"},
          {label:"Leave it on \"so you can watch it drip\"",next:"e3_07",effects:{P:5,T:2}},
          {label:"\"{boy}, shut the water off.\"",next:"e3_07",effects:{T:-4,P:3},note:"He shuts the washer box valves. The house knocks anyway. The crack is upstream."}]},
e3_07:{who:"the Boy",bg:"van_stage_night",drift:true,text:"Before anyone opens the wall: drywall saw, inspection light, shop vac.",
 choices:[{label:"\"{boy}: saw, light, vac.\"",next:"e3_08",vanRun:true},
          {label:"Get it yourself",next:"e3_08",effects:{T:-3,R:2}}]},
e3_08:{who:"Hector (HVAC)",bg:"e1_laundry_night",drift:true,text:"Where to open it? Hector, cape over one shoulder: \"Cut over the box. It's that.\"",
 choices:[{label:"Small inspection cut at the wet streak, after checking for wires and pipes",next:"e3_09",effects:{R:8,T:-4},setFlags:["found"],requires:{any:[{flags:["meterTest"]},{flags:["dryTest"]}]},lockHint:"Test it first (meter or dye)",correct:true,tip:"inspectionCut"},
          {label:"Pull the washer box and cut big",next:"e3_09",effects:{R:-7,T:-4},setFlags:["bigHole"],note:"Dry stud bay. Pete has to re-cut one bay over."},
          {label:"Dale's note: \"Drill drain holes in the baseboard. Let it breathe.\"",next:"e3_09",effects:{P:2,R:-10},hack:true,correct:false,tip:"inspectionCut"}]},
e3_09:{who:"Darlene (phone)",bg:"e1_laundry_night",drift:true,shake:true,text:"Mid-cut, the phone goes off: an organ sting. Walt screams. The phone buzzes. Darlene: \"Petin, next call's across town.\""+br+BUZZ+" "+DARLENE,
 choices:[{label:"Answer",next:"e3_10",effects:{T:4},alt:{if:{notFlags:["mainOff"]},addEffects:{P:5},note:"While Darlene talks, the wall keeps weeping. +5 Water."}},
          {label:"Hold it",next:"e3_10",effects:{T:-2}},
          {label:"\"{boy}, answer that.\"",next:"e3_10",effects:{R:-3,T:-4},setFlags:["boyPhone"],note:"\"Ma'am, the house is haunted.\" Darlene logs it: trauma fee approved."}]},
e3_10:{who:"you",bg:"e1_laundry_night",drift:true,text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. Still no leak in sight. Water is somewhere behind this wall.",
 variants:[{if:{flags:["found","hammerHeard"],notFlags:["mainOff"]},text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. There it is: a hairline crack on the cold line in the cavity, and with the water still on it's spraying. It only weeps when the street pressure's high and the house is quiet, which is why it came and went. Then the knocking: a loose pipe strap rattling in the cavity. \"That's your knocking. A licensed plumber secures the line and checks your pressure.\""},
           {if:{flags:["found","hammerHeard"]},text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. There it is: a hairline crack on the cold line in the cavity, weeping. Old pipe, same age as the house. It only leaked when the pressure was high and the house was quiet, which is why it came and went. Then the knocking: a loose pipe strap rattling in the cavity. \"That's your knocking. A licensed plumber secures the line and checks your pressure.\""},
           {if:{flags:["bigHole","hammerHeard"]},text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. The big hole at the washer box opens on a dry cavity. The wet one is a stud bay over. Pete re-cuts and finds a hairline crack on the cold line. Then the knocking: a loose pipe strap rattling in the cavity. \"That's your knocking. A licensed plumber secures the line and checks your pressure.\""},
           {if:{flags:["found"],notFlags:["mainOff"]},text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. There it is: a hairline crack on the cold line in the cavity, and with the water still on it's spraying. It only weeps when the street pressure's high and the house is quiet, which is why it came and went."},
           {if:{flags:["found"]},text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. There it is: a hairline crack on the cold line in the cavity, weeping. Old pipe, same age as the house. It only leaked when the pressure was high and the house was quiet, which is why it came and went."},
           {if:{flags:["bigHole"]},text:"The flashlight sweeps the cavity. A skull shape: no, a coiled hose bib. The big hole at the washer box opens on a dry cavity. The wet one is a stud bay over. Pete re-cuts and finds a hairline crack on the cold line."}],
 choices:[{label:"Licensed repair: cut out the bad section and repair it to code",next:"e3_11",effects:{R:6},setFlags:["repaired"],correct:true,tip:"licensedRepair",note:"Pete saw-cuts out the bad section and repairs it to code.",alt:{if:{notFlags:["mainOff"]},addEffects:{P:10},note:"Spray. +10 Water."}},
          {label:"Recommend checking the rest of the run too: old pipe, same age",next:"e3_11",effects:{R:8,T:-4},setFlags:["repaired"],requires:{R:">=55"},lockHint:"Reputation 55+",correct:true,tip:"licensedRepair",note:"Pete repairs it to code and flags the rest of the run.",alt:{if:{notFlags:["mainOff"]},addEffects:{P:10},note:"Spray. +10 Water."}},
          {label:"Dale's note: \"Epoxy putty and a hose clamp. And a garlic clove.\"",next:"e3_11",effects:{P:2,R:-10},hack:true,correct:false,tip:"licensedRepair"}]},
e3_11:{who:"Hector / Walt",bg:"e1_laundry_night",enterTip:"hauntedLights",text:"Test before the wall closes? Hector, cape off: \"So... not my drain? Not a ghost?\" The lights flicker one last time: just the dryer on the same circuit. Pete: \"Have an electrician look at that.\"",
 choices:[{label:"Pressure-test, then wait a full cycle (AC, washer, overnight) on dry towels before closing the wall",next:"e3_12",effects:{R:6,T:-6},setFlags:["tested"],correct:true,tip:"testRunLicensed"},
          {label:"Close the wall tonight",next:"e3_12",effects:{T:6}},
          {label:"Tell Walt it was probably also the AC",next:"e3_12",effects:{R:-4,T:3},setFlags:["blamedHector"],showIf:{notFlags:["condensateCleared"]}}]},
e3_12:{who:"the invoice",bg:"e1_kitchen_halloween",resolve:true,text:"Breakfast. Pen in hand. Walt has already handed out half the candy. Line item: \"industrial yogurt (Kevin's).\"",
 variants:[{if:{flags:["boyPhone"]},text:"Breakfast. Pen in hand. Walt has handed out half the candy. Darlene calls back: \"Is the house haunted or not, Petin? The {boy} was very sure.\""}],
 choices:[{label:"Standard rate",next:"resolve",sfx:"cash_register"},
          {label:"Show him the meter and the main: \"the ghost detector\"",next:"resolve",effects:{R:3,T:5},requires:{R:">=60"},lockHint:"Reputation 60+",tip:"meterTest"},
          {label:"Give him the {boy}'s drink",next:"resolve",effects:{T:6},note:"{boy}: \"That was for Hector.\""}]}
},
endings:{
e3_floodout:{end:true,card:"card_endFloodOut_hw.png",cardX:53,fail:true,scoreMult:0.5,tag:"The Flood Out",text:"The puddle finds the hall, the hall finds the living room, and the jack-o'-lanterns float by like little boats. Hector: \"Not my drain.\"",endTip:"Close the main before you open a wall with a live leak.",whyLicensed:"A pressurized supply crack doesn't stop. A licensed plumber isolates and repairs it."},
e3_kittylitter:{end:true,card:"card_endKittyLitter_hw.png",cardX:53,scoreMult:0.5,tag:"Kitty Litter",hackRecap:true,text:"Litter, duct tape, putty and a garlic clove. Dry for a week. Dale's new sticky note: \"Ghostbuster.\"",endTip:"Covering a leak hides it. It doesn't fix it.",whyLicensed:"One weeping crack in a wall can mean mold and a rebuild."},
e3_hectorsfault:{end:true,card:"card_endHectorsFault_hw.png",cardX:53,tag:"Hector's Fault",text:"Pete leaves blaming the AC. Next Monday the puddle's back, and Hector's van is in the driveway, cape on, taking pictures. \"Plumbers stay suspect.\"",endTip:"Rule out each suspect with a test, not a hunch.",whyLicensed:"A wrong diagnosis costs two service calls."},
// Bonus, rare: clean full run (found + tested + main off + 0 hacks + Rep 70+) on a run where ev_knock fired. Carved out of full Case Cracked only.
e3_ghostpipe:{end:true,bonus:true,card:"card_endGhostPipe.png",cardX:53,good:true,tag:"Ghost Pipe",variants:[{if:{notFlags:["tested"]},text:"Crack repaired, strap secured. The wall went back up untested, but that night the house goes silent anyway. Walt, almost disappointed: \"So there's no ghost?\" Pete, at the door: \"There was. It was a pipe. I'll be back to test that wall.\" The {boy}, in a sheet with eye holes, drinks Hector's sweet tea."}],text:"Crack repaired, strap secured, pressure checked, wall tested dry. That night the house goes silent. Walt, almost disappointed: \"So there's no ghost?\" Pete, at the door: \"There was. It was a pipe.\" The {boy}, in a sheet with eye holes, drinks Hector's sweet tea.",endTip:"Groans and knocks are often water hammer or a loose pipe. Have a licensed plumber check the pressure and secure the lines.",whyLicensed:"Pressure regulation and hammer arrestors fall under plumbing code. Call a licensed plumber."},
e3_casecracked:{end:true,card:"card_endCaseCracked_hw.png",cardX:53,good:true,tag:"Case Cracked",text:"One small cut, one cracked cold line, repaired and tested. Hector and Pete shake hands, barely. The pumpkin grins.",
 variants:[{if:{any:[{notFlags:["found"]},{notFlags:["tested"]},{R:"<55"}]},text:"Case closed, almost. At 2 a.m. something knocks, and Darlene texts: \"haunted?\" Pete: \"Tomorrow we do it right, Youngster.\""}],
 endTip:"Condensate, washer, supply: rule them out in that order.",whyLicensed:"Opening walls and cutting in a new section is licensed work."}
}
});
})();
