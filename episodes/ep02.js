// TRAP FULL — Episode 2: "Under the Slab". Data only (schema 1, docs/episode-schema.md); engine is index.html.
// Spec: design/episodes/ep2-under-the-slab.md. TEST build on a private branch; spec is still marked "draft for Piquin review".
(function(){
// Inline sprite-sheet helper for scene text. The stage has one prop slot and animates at most 2 frames,
// so 3- and 4-frame sheets (phone buzz, warm spot, dust, meter dial) and single-frame picks (slab hole wet/dry) go in the text.
// n = frames, w/h = frame size, s = display scale, f = static frame index (omit to animate).
function spr(file,n,w,h,s,f,alt){const kf={2:"p2",3:"k3",4:"p4"}[n];
 const pos=(typeof f==="number"&&n>1)?(f/(n-1)*100)+"% 0":"0 0";
 const anim=(typeof f!=="number"&&kf)?";animation:"+kf+" "+(n*0.3)+"s steps("+n+") infinite":"";
 return '<span role="img" aria-label="'+(alt||"")+'" style="display:inline-block;vertical-align:middle;width:'+(w*s)+'px;height:'+(h*s)+'px;background-image:url(assets/img/'+file+');background-size:'+(n*100)+'% 100%;background-position:'+pos+';image-rendering:pixelated'+anim+'"></span>';}
const WARM=spr("fx_warm_spot.png",3,64,24,3,undefined,"Heat shimmer on the tile");
const DIAL=spr("prop_meter_dial.png",4,32,32,2,undefined,"Water meter dial spinning");
const DUST=spr("fx_concrete_dust.png",4,32,32,2,undefined,"Concrete dust");
const HOLE_WET=spr("ov_slab_hole.png",2,96,48,2,0,"Slab hole with a weeping copper line");
const HOLE_DRY=spr("ov_slab_hole.png",2,96,48,2,1,"Dry slab hole");
const GEYSER=spr("fx_mud_geyser.png",4,32,64,1.5,undefined,"Mud geyser");
const BUZZ=spr("fx_phone_buzz.png",4,32,32,2,undefined,"Phone buzzing");
const DARLENE=spr("darlene_phone.png",2,48,48,2,undefined,"Darlene on the phone");
const TOOLS=spr("prop_acoustic_headset.png",1,16,16,2,undefined,"Acoustic headset")+" "+spr("prop_thermal_cam.png",1,16,16,2,undefined,"Thermal camera");
const br="<br>";
const SMOOTHIE=spr("boy_smoothie.png",2,40,60,1.5,undefined,"The Boy with a strawberry smoothie"); // van-run return beat (e2_07's stage prop slot is taken by fx_roaches)
registerEpisode({
id:"ep02",title:"Under the Slab",week:2,schema:1,release:"2026-10-23", // TODO(release): spec says the Friday 8:00 AM CT after Piquin approves; date is a placeholder
start:{scene:"e2_01",P:18,R:50,T:60,flags:{}},
meters:["P","R","T"],
meterLabels:{P:"Water under the slab"},
bgCaptions:{e1_kitchen_morning:"Ms. Reyes's kitchen",van_stage:"The van"},
codeTip:"slabSigns",
thumb:"assets/img/thumb_ep02.png",
hackThreshold:2,
resultFrame:{src:"assets/img/result_frame_1200x675.png",window:[42,42,701,413]},
art:["bg_van_stage.png","bg_e1_kitchen_morning.png","card_endHotSpring.png","card_endConcreteShoes.png","card_endWrongHole.png","card_endRightHole.png","thumb_ep02.png",
 "yolanda.png","rick_gc.png","boy_smoothie.png","darlene_phone.png","fx_phone_buzz.png","fx_warm_spot.png","ov_slab_hole.png","fx_concrete_dust.png","fx_mud_geyser.png","fx_roaches.png","prop_meter_dial.png","prop_thermal_cam.png","prop_acoustic_headset.png","prop_sledgehammer.png"],
sprites:{boy:{idle:"boy_idle.png",smoothie:"boy_smoothie.png",frames:2,w:40,h:60},vanRun:{src:"fx_van_run.png",frames:3,w:96,h:16}},
tips:{
 slabSigns:"Signs of a slab leak: a warm or damp spot on the floor, a water bill that jumps, the sound of running water when nothing's on, and a water meter that keeps moving with every fixture off. If you see those, close your house main and call a licensed plumber.",
 hotCold:"A warm spot usually means the hot line. Plumbers isolate hot vs. cold (for example by closing the water heater's cold supply and watching the meter) to know which line is leaking. Diagnosis and repair are for a licensed plumber.",
 detectFirst:"Water travels along pipes and under a slab, so the wet spot isn't always the leak. Pros pinpoint it with acoustic listening, thermal imaging or line tracing before breaking concrete. One right hole beats three guesses. Call a licensed plumber.",
 rerouteVsSpot:"A slab leak can be spot-repaired or the line rerouted overhead and the old one abandoned. Which one depends on pipe age, condition and how many leaks there are, and it's a licensed plumber's call, usually with a permit and a pressure test.",
 ppeDust:"Breaking concrete makes silica dust. Pros keep it down with water and a vacuum and wear a respirator.",
 rightTool:"Youngster, right tool first, every time."
 // mainFirst and testRun: global tips, reused verbatim.
},
failEnding:"e2_hotspring",
driftAmount:7, // DESIGN NOTE: spec says start P 15 / drift +8 (Hot Spring 30.5% of random play). Drift stays +7 (Director); after the e2_09 detection choice was added, start P 18 puts Hot Spring at 17.8%, inside the 12-20% target.
driftText:"<em>The tile ticks. Something's running.</em> (+7 Water)",
resolveCallback:{unlessFlag:"tested",R:-10,text:"<b>Callback:</b> Rick closed it up untested. −10 Reputation."},
resolve:[
 {if:{P:">=100"},to:"e2_hotspring"},
 {if:{dalehacks:">=2"},to:"e2_concrete"},
 {if:{flags:["wrongHole"],notFlags:["located"]},to:"e2_wronghole"},
 {to:"e2_righthole"}],
vanRunLines:{
 fail:["He comes back with a strawberry smoothie. \"They had a deal.\""+" "+SMOOTHIE,"Empty-handed. \"Which van?\" There is one van. It is yellow with stripes."+" "+SMOOTHIE,"He brings a leaf blower. \"You said blow the dust out.\""+" "+SMOOTHIE],
 success:["Bucket, chisel, mask! Rick slow-claps, incorrectly."+" "+SMOOTHIE],
 chance:0.75,failT:[5,10],failSeconds:45,failP:5,successT:3,failTip:"rightTool"},
events:[
 {id:"ev_roaches",at:["e2_07"],chance:0.5,text:"The slab cracks open and a roach exodus marches across the morning tile. Ms. Reyes stands on a chair. Rick stands on a smaller chair. Pete doesn't flinch.",effects:{T:-4,R:2}},
 {id:"ev_neighbor",at:["e2_04"],chance:0.4,text:"Neighbor: \"My bill doubled too!\"",effects:{T:3},tip:"slabSigns"}],
stage:{kevin:false,water:"clean",
 npc:{img:"yolanda.png",scenes:["e2_02","e2_03","e2_09","e2_11"]},
 workScenes:["e2_07","e2_09"],
 props:{e2_05:["prop_sledgehammer.png",1,32,32],e2_06:["boy_smoothie.png",2,40,60],e2_07:["fx_roaches.png",2,64,16]},
 dale:{e2_05:"rick_gc",e2_07:"rick_gc",e2_10:"rick_gc"}},
scoring:{parSeconds:420},
verify:{endings:4,decisions:[11,12],excludeFromRange:["e2_hotspring"]},
scenes:{
e2_01:{who:"Darlene (radio)",bg:"van_stage",text:"Radio crackles. Darlene: \"Petin, lady says her floor's warm. Says it like it's a compliment.\"",
 choices:[{label:"\"Rolling, Darlene.\"",next:"e2_02",effects:{T:5},sfx:"radio_static"},
          {label:"\"Warm floor? Tell her don't put a pizza on it.\"",next:"e2_02",effects:{R:-2,T:3},sfx:"radio_static"}]},
e2_02:{who:"Ms. Reyes",bg:"e1_kitchen_morning",text:"Ms. Yolanda Reyes, barefoot on the tile by the island, coffee in hand: \"It's warm right here. My water bill doubled. And listen.\" A faint hiss, like the house is breathing. Dale's old card is on the fridge. {card}"+br+WARM,
 choices:[{label:"Close every faucet and watch the water meter",next:"e2_03",effects:{R:6,T:-3},setFlags:["meterTest"],correct:true,tip:"slabSigns"},
          {label:"\"{boy}, go check the meter.\"",next:"e2_03",effects:{T:-6,P:3},note:"He turns on the outside hose \"so it'd move.\" Pete: \"Opposite, {boy}.\""},
          {label:"Read Dale's fridge card: \"Warm floor? Free radiant heat! Put a rug down.\"",next:"e2_03",effects:{P:10,T:5,R:-6},hack:true,correct:false,tip:"slabSigns"}]},
e2_03:{who:"you",bg:"e1_kitchen_morning",drift:true,text:"Everything's off, and the meter dial is still spinning. Hot line or cold?"+br+DIAL,
 variants:[{if:{flags:["meterTest"]},text:"Every fixture's off and the meter dial keeps spinning. That's a leak. Hot line or cold?"+br+DIAL}],
 choices:[{label:"Close the cold supply valve on top of the water heater and see if the spinning stops",next:"e2_04",effects:{R:6,T:-3},setFlags:["hotIso"],correct:true,tip:"hotCold"},
          {label:"Feel the floor with your hand and guess",next:"e2_04",effects:{R:1}},
          {label:"Run the meter test now",next:"e2_04",effects:{T:-4,R:4},setFlags:["meterTest"],requires:{notFlags:["meterTest"]},lockHint:"Meter test already done",tip:"slabSigns"}]},
e2_04:{who:"you",bg:"e1_kitchen_morning",caption:"Meter box",drift:true,text:"Pete checks the meter box readings from the kitchen. Water's still running somewhere under the house.",
 variants:[{if:{flags:["hotIso"]},text:"Pete checks the meter box readings from the kitchen. With the heater's cold supply closed, the dial stops: it's the hot line, and it's isolated for now. Closing the house main is still the safest move before anyone opens the slab."}],
 choices:[{label:"Close the house main before anything gets opened",next:"e2_05",effects:{P:-10,R:5},setFlags:["mainOff"],correct:true,tip:"mainFirst"},
          {label:"Leave it on so you can \"hear it\"",next:"e2_05",effects:{T:3,P:5}},
          {label:"\"{boy}, shut the water off.\"",next:"e2_05",effects:{T:-5,P:5},note:"He shuts off the sprinkler timer."}]},
e2_05:{who:"Rick (GC)",bg:"e1_kitchen_morning",drift:true,text:"Rick, the GC on the kitchen remodel, walks in with a sledge: \"Seen it a million times. It's under the dishwasher. I'll have it open by lunch.\" The dishwasher is on the far wall. The warm spot is by the island.",
 choices:[{label:"Get leak detection first: acoustic listening and a thermal camera to pinpoint it",next:"e2_06",effects:{R:8,T:-6},setFlags:["located"],correct:true,tip:"detectFirst",note:"Headset on, camera up. The hiss and the heat line up by the island. "+TOOLS},
          {label:"Fine, break where Rick says",next:"e2_06",effects:{T:6,R:-5},setFlags:["wrongHole"]},
          {label:"Dale's card: \"Drill a test hole every foot till it squirts.\"",next:"e2_06",effects:{P:10,R:-8},setFlags:["wrongHole"],hack:true,correct:false,tip:"detectFirst"}]},
e2_06:{who:"the Boy",bg:"van_stage",drift:true,text:"Before anybody breaks concrete: bucket, chisel and a dust mask.",
 choices:[{label:"\"{boy}, bucket, chisel, mask.\"",next:"e2_07",vanRun:true},
          {label:"Go get it yourself",next:"e2_07",effects:{T:-3,R:2}}]},
e2_07:{who:"you",bg:"e1_kitchen_morning",drift:true,text:"Chipping. "+DUST,
 variants:[
  {if:{flags:["located"],notFlags:["mainOff"]},text:"Chipping by the island. The hole opens right on wet sand and a copper line weeping hot water, and with the main still on, mud shoots up out of the hole. "+br+HOLE_WET+" "+GEYSER},
  {if:{flags:["located"]},text:"Chipping by the island. The hole opens right on wet sand and a copper line weeping hot water. "+br+HOLE_WET+" "+DUST},
  {if:{flags:["wrongHole"]},text:"Chipping under the dishwasher. Dry dirt. Rick: \"...huh. Million and one.\""+br+HOLE_DRY+" "+DUST}],
 choices:[{label:"Keep the dust down: mask, vacuum, wet chipping",next:"e2_08",effects:{R:4},tip:"ppeDust",showIf:{flags:["located"]},alt:{if:{notFlags:["mainOff"]},addEffects:{P:10},note:"Mud geyser. +10 Water."}},
          {label:"Chip faster, skip the mask",next:"e2_08",effects:{T:4,R:-3},showIf:{flags:["located"]},alt:{if:{notFlags:["mainOff"]},addEffects:{P:10},note:"Mud geyser. +10 Water."}},
          {label:"Stop, admit it's dry, bring in leak detection now",next:"e2_08",effects:{R:-2,T:-8},setFlags:["located"],correct:true,tip:"detectFirst",showIf:{flags:["wrongHole"],notFlags:["located"]}},
          {label:"\"Keep digging, it's gotta be close.\"",next:"e2_08",effects:{P:8,T:-10,R:-6},showIf:{flags:["wrongHole"],notFlags:["located"]}}]},
e2_08:{who:"Darlene (phone)",bg:"e1_kitchen_morning",drift:true,text:"Mid-chip, Pete's phone buzzes. Darlene: \"Petin, quick one.\" It is never a quick one. \"#@%&!\""+br+BUZZ+" "+DARLENE,
 choices:[{label:"Answer now",next:"e2_09",effects:{T:4},alt:{if:{notFlags:["mainOff"]},addEffects:{P:5},note:"Darlene's quick one runs long. The water doesn't wait. +5 Water."}},
          {label:"Hold it till a stopping point",next:"e2_09",effects:{T:-2}},
          {label:"\"{boy}, answer that.\"",next:"e2_09",effects:{R:-3,T:-4},setFlags:["boyPhone"],note:"He hangs up on her, then orders a smoothie."}]},
e2_09:{who:"you",bg:"e1_kitchen_morning",drift:true,text:"The copper's thin and pitted. Pete lays out the options for Ms. Reyes."+br+HOLE_WET,
 variants:[{if:{notFlags:["located"]},text:"Pete can't see the leak from here. Ms. Reyes is looking at a dry hole and a warm floor."+br+HOLE_DRY}],
 choices:[{label:"Recommend a reroute: a new line overhead through the attic and walls; abandon the old one under the slab",next:"e2_10",effects:{R:8,T:-4},requires:{flags:["located"]},lockHint:"Find it first",correct:true,tip:"rerouteVsSpot",note:"Old pipe means more leaks coming. Pete does it to code."},
          {label:"Spot-repair this one section to code, and warn her more may follow",next:"e2_10",effects:{R:5,T:2},requires:{flags:["located"]},lockHint:"Find it first",correct:true,tip:"rerouteVsSpot",note:"Pete does it to code."},
          {label:"Call in leak detection now, then a licensed spot repair where it actually is",next:"e2_10",effects:{R:3,T:-8},showIf:{notFlags:["located"]},correct:true,tip:"detectFirst",note:"Detection finds it by the island. Pete spot-repairs it to code. The dry hole under the dishwasher is still there, and Rick is still talking."},
          {label:"Dale's card: \"Pour quick-set over it. Concrete heals.\"",next:"e2_10",effects:{P:10,R:-10},hack:true,correct:false,tip:"rerouteVsSpot"}]},
e2_10:{who:"Rick (GC)",bg:"e1_kitchen_morning",text:"Rick wants to patch the slab tonight. Pete wants a pressure test first.",
 choices:[{label:"Pressure-test the line before the hole is closed",next:"e2_11",effects:{R:6,T:-6},setFlags:["tested"],correct:true,tip:"testRun"},
          {label:"Side with Rick: close it tonight",next:"e2_11",effects:{T:6}}]},
e2_11:{who:"the invoice",bg:"e1_kitchen_morning",resolve:true,text:"Pen in hand. Ms. Reyes stands on the spot by the island, still barefoot.",
 variants:[{if:{flags:["boyPhone"]},text:"Pen in hand. Darlene calls back, angrier: \"Did the {boy} just hang up on me and order a smoothie?\" Ms. Reyes is still barefoot by the island."}],
 choices:[{label:"Standard rate",next:"resolve",sfx:"cash_register"},
          {label:"Show her how to read her meter for next time",next:"resolve",effects:{R:3,T:5},requires:{R:">=60"},lockHint:"Reputation 60+",tip:"slabSigns"},
          {label:"Give her the {boy}'s smoothie",next:"resolve",effects:{T:6},note:"{boy}: \"That was mine.\""}]}
},
endings:{
e2_hotspring:{end:true,card:"card_endHotSpring.png",cardX:53,fail:true,scoreMult:0.5,tag:"Hot Spring",text:"The kitchen tile lifts like a lid. Ms. Reyes now has a hot spring by the island. Rick: \"Seen it a million times.\"",endTip:"Close the house main before anyone opens up a slab.",whyLicensed:"Water under a slab can undermine the foundation; a licensed plumber finds and fixes it."},
e2_concrete:{end:true,card:"card_endConcreteShoes.png",cardX:53,scoreMult:0.5,tag:"Concrete Shoes",hackRecap:true,text:"Quick-set over a live leak. The floor's warm again by Tuesday and Dale's new card reads \"Foundation Specialist.\" Pete's number goes on the fridge, under Dale's.",endTip:"Concrete isn't a pipe repair. Pressure-test before anything gets covered.",whyLicensed:"Dale's $20 bag turns into a jackhammer and a second hole."},
e2_wronghole:{end:true,card:"card_endWrongHole.png",cardX:53,tag:"Wrong Hole",text:"A dry hole under the dishwasher, a wet floor by the island, and Rick telling Ms. Reyes \"your plumber picked the spot.\" Pete: \"{boy}. Write down 'never again.' No, the other way.\"",endTip:"Water travels under a slab. Pinpoint it before you break concrete.",whyLicensed:"Leak detection costs less than one wrong hole."},
e2_righthole:{end:true,card:"card_endRightHole.png",cardX:53,good:true,tag:"Right Hole",text:"One hole, right spot, line tested, warm spot gone. Rick asks Pete for his card. \"...Seen it a million and one.\"",
 variants:[{if:{any:[{notFlags:["tested"]},{R:"<55"}]},text:"One hole, right spot. But at 9 p.m. the tile's warm again. \"Tomorrow we do it right, Youngster.\""}],
 endTip:"Signs of a slab leak: warm floor, a meter that moves with everything off, the sound of running water."}
}
});
})();
