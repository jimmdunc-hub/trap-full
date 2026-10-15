// TRAP FULL — Episode 1: "It's Just a Hose Bib". Data only (schema 1, docs/episode-schema.md); engine is index.html.
registerEpisode({
id:"ep01",title:"It's Just a Hose Bib",week:1,schema:1,release:"2026-10-16",
start:{scene:"e1_01",P:15,R:50,T:60,flags:{}},
meters:["P","R","T"],
meterLabels:{P:"Water in the wall"},
codeTip:"frostFree",
thumb:"assets/img/thumb_ep01.png",
hackThreshold:2, // Ep 1 has no hack-chain panel; 2 shortcuts send the resolver to e1_sock (rule below)
resultFrame:{src:"assets/img/result_frame_1200x675.png",window:[42,42,701,413]},
// Art files this episode adds to the engine's art list (filenames in assets/img/).
art:["bg_hosebib_exterior.png","card_endIndoorPool.png","card_endSockSeason.png","card_endNotJustHoseBib.png","thumb_ep01.png","prop_retro_bottle.png"],
// Engine reads pete/kevin/rhonda/card only. boy, vanRun and missLady are listed for a later engine pass (not drawn yet).
sprites:{boy:{idle:"boy_idle.png",oops:"boy_oops.png",drink:"boy_drink.png",frames:2,w:40,h:60},vanRun:{src:"fx_van_run.png",frames:3,w:96,h:16},missLady:{src:"missLady.png",frames:2,w:96,h:64}},
tips:{
 frostFree:"A frost-free faucet keeps its valve inside the warm wall, but only if water can drain out. Leave a hose attached in a freeze and the water stays trapped, freezes and can split the pipe inside the wall, where you won't see the leak until you turn it on. Unhook your hoses before a freeze. Replacing one inside the wall is a job for a licensed plumber.",
 hoseOff:"Unhook garden hoses before a freeze. A connected hose keeps water in the faucet.",
 // TODO(code-audit): the vacuum-breaker requirement is cited in the design doc as IPC §608 (backflow protection for hose connections).
 // That section number is UNVERIFIED; do not show it to players until CODE_AUDIT confirms it. Player-facing text stays generic.
 frostFreeInstall:"A frost-free faucet has to be installed sloping slightly down toward the outside so it drains, and outdoor faucets need a vacuum breaker so dirty hose water can't flow back into the house. Replacing one inside the wall is a job for a licensed plumber.",
 freezeProtect:"For freeze protection: unhook hoses, use an insulated faucet cover, and if the faucet isn't frost-free, close its inside shutoff and drain it. If a pipe bursts, close the house shutoff and call a licensed plumber.",
 rightTool:"Youngster, always check you've got the right tool before you start a job."
},
failEnding:"e1_flood",
driftAmount:9, // DESIGN NOTE: spec says +5 on e1_04/e1_05 only (never floods). 9 with Dale hacks +20 P and failed van run +10 P puts e1_flood near 19% of random play.
driftText:"<em>water keeps running into the wall</em> (+9 Water)",
resolveCallback:{unlessFlag:"tested",R:-10,text:"<b>Callback:</b> no test run, so Miss lady finds a drip inside the wall on Sunday. −10 Reputation."},
resolve:[
 {if:{P:">=100"},to:"e1_flood"},
 {if:{dalehacks:">=2"},to:"e1_sock"},
 {to:"e1_pro"}],
vanRunLines:{
 fail:["He comes back with a plunger. \"You said pipe… something.\"","Empty-handed. \"The van was locked.\" It was not.","He brings you a sweet tea. It's a good sweet tea."],
 success:["Pipe wrench! Miss lady claps, incorrectly."],
 chance:0.75,failT:[5,10],failSeconds:45,failP:10,successT:3,failTip:"rightTool"},
events:[
 {id:"ev_neighbor",at:["e1_04"],chance:0.5,text:"Neighbor leans over the fence: \"My hose bib's doing that too.\" Pete: \"Unhook your hose, sir.\"",effects:{T:3,R:2},tip:"hoseOff"},
 {id:"ev_dog",at:["e1_06"],chance:0.4,text:"Miss lady's dog takes the sock and runs. Dale's card stays.",effects:{T:5}}],
collectible:{id:"retroBottle",name:"Retro soda bottle",sprite:"prop_retro_bottle",scene:"e1_06",choice:0},
stage:{kevin:false,workScenes:["e1_04","e1_05","e1_08"]},
scoring:{parSeconds:300},
verify:{endings:3,decisions:[9,11],excludeFromRange:["e1_flood"]},
scenes:{
e1_01:{who:"Darlene (radio)",bg:"truck",text:"Radio crackles. Darlene: \"Petin, got a lady says it's 'just a hose bib.' Last three 'just a hose bibs' were a swimming pool.\"",
 choices:[{label:"\"Rolling, Darlene.\"",next:"e1_02",effects:{T:5},sfx:"radio_static"},
          {label:"\"Did she say 'just'? Add an hour.\"",next:"e1_02",effects:{R:3,T:-3},sfx:"radio_static"}]},
e1_02:{who:"you",bg:"truck",text:"Morning after a hard Dallas freeze. The {boy} is riding along with a donut.",
 choices:[{label:"Grab gloves, flashlight, moisture meter",next:"e1_03",effects:{R:4},setFlags:["ppe"],correct:true,tip:"ppe"},
          {label:"\"{boy}, grab the pipe wrench.\"",next:"e1_03",vanRun:true}]},
e1_03:{who:"Miss lady",bg:"hosebib_exterior",text:"Ms. Bev Jenkins, robe and coffee: \"It's just a hose bib, baby. Drips a little.\" It's dripping from under the siding, not the spout.",
 choices:[{label:"\"Yes ma'am, let me take a look.\"",next:"e1_04",effects:{R:5}},
          {label:"\"It's never just a hose bib.\"",next:"e1_04",effects:{R:2,T:-5}},
          {label:"Agree it's just a hose bib",next:"e1_04",effects:{R:-6,T:6}}]},
e1_04:{who:"the faucet",bg:"hosebib_exterior",drift:true,text:"Dale's sock and coffee can are wrapped around the spout, garden hose still attached. {card}",
 choices:[{label:"Take off the hose and the \"insulation\"",next:"e1_05",effects:{R:5},correct:true,tip:"hoseOff"},
          {label:"Match Dale's fix: add another sock (shortcut)",next:"e1_05",effects:{P:20,R:-8,T:4},hack:true,correct:false,tip:"hoseOff"}]},
e1_05:{who:"the wall",bg:"hosebib_exterior",drift:true,text:"The spout is dry; water's coming out at the siding seam. The moisture meter pegs on the inside wall. It burst inside the wall.",
 choices:[{label:"Find and close the house shutoff first",next:"e1_06",effects:{P:-10,R:6},setFlags:["mainOff"],correct:true,tip:"mainFirst"},
          {label:"Turn the faucet handle hard to stop it",next:"e1_06",effects:{P:10,R:-6},correct:false,note:"Nothing changes. It's broken inside the wall."},
          {label:"\"{boy}, go shut the water off.\"",next:"e1_06",effects:{T:-5,P:5},note:"He shuts off the garden hose. The wall keeps filling."}]},
e1_06:{who:"the flowerbed",bg:"hosebib_exterior",drift:true,text:"Digging around the slab for the shutoff box turns up an old glass soda bottle.",
 variants:[{if:{flags:["mainOff"]},text:"Main's off. Digging around the slab by the shutoff box turns up an old glass soda bottle."}],
 choices:[{label:"Pick up the bottle",next:"e1_07",effects:{T:3}},
          {label:"Leave it, keep working",next:"e1_07",effects:{R:2}},
          {label:"Stop and find the shutoff now",next:"e1_07",effects:{P:-5,R:3},setFlags:["mainOff"],requires:{notFlags:["mainOff"]},lockHint:"Main's already off",correct:true,tip:"mainFirst"}]},
e1_07:{who:"Miss lady",bg:"hosebib_exterior",drift:true,text:"You explain: frost-free faucet, burst inside the wall. \"But it says frost-free!\"",
 choices:[{label:"Explain how a hose left on traps water in it",next:"e1_08",effects:{R:6,T:4},correct:true,tip:"frostFree"},
          {label:"Blame the sock (fair)",next:"e1_08",effects:{T:5,R:2}}]},
e1_08:{who:"you",bg:"wall_interior",drift:true,text:"The repair: open the wall from inside and replace the faucet. Not a DIY job; Pete does it to code.",
 choices:[{label:"Do it right: a new frost-free faucet with a vacuum breaker, sloped to drain",next:"e1_09",effects:{R:8,T:-6},correct:true,tip:"frostFreeInstall",sfx:"wrench_ratchet"},
          {label:"Do it right, and the {boy} holds the flashlight (on the wall, this time)",next:"e1_09",effects:{R:6,T:4},requires:{R:">=60"},lockHint:"Reputation 60+",correct:true},
          {label:"Match Dale's fix: duct tape the crack and caulk the siding (shortcut)",next:"e1_09",effects:{P:20,R:-10},hack:true,correct:false,tip:"frostFreeInstall"}]},
e1_09:{who:"the house",bg:"hosebib_exterior",drift:true,text:"Main back on?",
 choices:[{label:"Main on, test run, check inside the wall for drips",next:"e1_10",effects:{R:6},setFlags:["tested"],correct:true,tip:"testRun"},
          {label:"Skip the test",next:"e1_10"}]},
e1_10:{who:"the invoice",bg:"invoice",resolve:true,text:"Pen in hand. Miss lady has a fresh pot of coffee going.",
 choices:[{label:"Standard rate",next:"resolve",sfx:"cash_register"},
          {label:"Throw in a faucet cover",next:"resolve",effects:{R:3,T:6},requires:{R:">=60"},lockHint:"Reputation 60+",tip:"freezeProtect"},
          {label:"Hand Miss lady a jar of peppers",next:"resolve",effects:{T:8}}]}
},
endings:{
e1_flood:{end:true,card:"card_endIndoorPool.png",fail:true,scoreMult:0.5,tag:"Indoor Pool",text:"The drywall gives up. The living room has a shallow end. Miss lady: \"Still just a hose bib?\"",endTip:"Find and close your house shutoff before anything else.",whyLicensed:"Water in a wall can turn into mold and rot fast; repairs inside the wall are for a licensed plumber."},
e1_sock:{end:true,card:"card_endSockSeason.png",scoreMult:0.5,tag:"Sock Season",text:"Miss lady buys more socks. Dale prints new cards: \"Freeze Protection Specialist.\" Pete leaves his number on the fridge, for spring.",endTip:"Socks aren't insulation. Unhook the hose and use a real faucet cover.",whyLicensed:"Dale's $5 fix turned into a wall, a floor and a weekend.",hackRecap:true},
e1_pro:{end:true,card:"card_endNotJustHoseBib.png",good:true,tag:"Not Just a Hose Bib",text:"Wall's dry, faucet's new, and Miss lady tells the whole street it was \"never just a hose bib.\"",
 variants:[{if:{notFlags:["tested"]},text:"Wall's dry, faucet's new, and Miss lady tells the whole street it was \"never just a hose bib.\" Then she calls you back Sunday about a drip. Callback's on the house."},{if:{R:"<55"},text:"Wall's dry, faucet's new. Miss lady pays, but she's telling the street it was \"just a hose bib\" after all. Callback scheduled."}],
 endTip:"Unhook hoses before a freeze so a frost-free faucet can drain."}
}
});
