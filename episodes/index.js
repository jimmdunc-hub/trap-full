// Episode catalog. Each entry with a file is loaded by a script tag (no fetch).
// Adding an episode: drop episodes/epNN.js (it calls registerEpisode) and add one line here.
// Ep 0 content is episodes/ep00.js (engine.js only holds shared GLOBAL_TIPS + runtime).
// stub:true on an index line: the script is not requested unless the URL has ?dev=1.
// The episode file also sets stub:true so it stays off the weekly slot.
window.EPISODES_INDEX=[
 {id:"ep00",file:"episodes/ep00.js",title:"Trap Full",week:0,release:"2026-10-16"},
 {id:"ep01",file:"episodes/ep01.js",title:"It's Just a Hose Bib",week:1,release:"2026-10-16"},
 {id:"ep02",file:"episodes/ep02.js",title:"Under the Slab",week:2,release:"2026-10-18"},
 {id:"ep03",file:"episodes/ep03.js",title:"Mystery Leak",week:3,release:"2026-10-23T08:00-05:00"},
 {id:"ep04",file:"episodes/ep04.js",title:"No Hot Water",week:4,release:"2026-11-06T08:00-06:00"}, // PLACEHOLDER GATE, NOT FINAL (release date TBD)
 {id:"ep05",file:"episodes/ep05.js",title:"Hold, Please",week:5,release:"2026-11-11T08:00-06:00"},
 {id:"ep99",file:"episodes/ep99.js",title:"Framework Stub",week:99,release:"2099-01-01",stub:true}
];
