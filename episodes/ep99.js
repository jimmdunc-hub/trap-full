// Framework stub. Not a weekly episode (stub:true). Safe to leave listed:
// it proves a new file plus an index line is playable with no engine edit.
// Remove the index line to hide it. Do not convert this into Ep 1.
registerEpisode({
 id:"ep99",title:"Framework Stub",week:99,schema:1,stub:true,release:"2099-01-01",
 start:{scene:"t01",P:10,R:50,T:60,flags:{}},
 meters:["P","R","T"],
 codeTip:"stubVent",
 tips:{
  stubVent:"A vent lets a drain breathe. Changing or adding vents is code work; call a licensed plumber.",
  stubMain:"Find and close the house main before you open a pressurized line."
 },
 failEnding:"t_flood",
 scoring:{parSeconds:120},
 verify:{endings:2,decisions:[3,3],excludeFromRange:["t_flood"]},
 vanRunLines:{
  fail:["He comes back with a donut. 'You said wrench… something.'","Empty-handed. 'The van was locked.' It was not."],
  success:["Pipe wrench. He looks surprised."],
  chance:0.75,failT:[5,10],failSeconds:45,successT:3,failTip:"stubMain"
 },
 events:[
  {id:"ev_drip",at:["t02"],chance:0.5,text:"A drip starts in the cabinet. Pete: check the shutoff first.",effects:{T:2},tip:"stubMain"}
 ],
 collectible:{id:"stubWasher",name:"Brass washer",sprite:"tip_badge",scene:"t02",choice:0},
 resolve:[
  {if:{P:">=100"},to:"t_flood"},
  {to:"t_ok"}
 ],
 scenes:{
  t01:{who:"Darlene (radio)",bg:"truck",text:"Stub dispatch. The {boy} is riding along, holding a donut like a clipboard.",
   choices:[
    {label:"Roll out",next:"t02",effects:{T:2},correct:true},
    {label:"\"{boy}, grab the pipe wrench.\"",next:"t02",vanRun:true}
   ]},
  t02:{who:"you",bg:"bath_cabinet",text:"A loose washer in the trap arm. {card} This scene is the event slot.",
   choices:[
    {label:"Pocket the washer",next:"t03",effects:{R:3,T:2},correct:true,tip:"stubMain"},
    {label:"Leave it, keep working",next:"t03",effects:{R:1}},
    {label:"Pry the line open and hope",next:"t_flood",effects:{P:100},correct:false}
   ]},
  t03:{who:"the invoice",bg:"invoice",resolve:true,text:"Stub job's done. Close it out.",
   choices:[
    {label:"Standard rate",next:"resolve",correct:true}
   ]}
 },
 endings:{
  t_ok:{end:true,good:true,tag:"Stub Clear",text:"The stub holds. The framework took the call.",endTip:"A real call still belongs to a licensed plumber when the work is in the wall."},
  t_flood:{end:true,fail:true,scoreMult:0.5,tag:"Stub Flood",text:"The line let go. The stub ends early.",endTip:"Close the main before you open a pressurized line."}
 }
});
