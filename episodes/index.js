// Episode catalog. Each entry with a file is loaded by a script tag (no fetch).
// Adding an episode: drop episodes/epNN.js (it calls registerEpisode) and add one line here.
// Ep 0 is registered by the engine until episodes/ep00.js is listed with a file.
// stub:true on an index line: the script is not requested unless the URL has ?dev=1.
// The episode file also sets stub:true so it stays off the weekly slot.
window.EPISODES_INDEX=[
 {id:"ep00",file:"episodes/ep00.js",title:"Trap Full",week:0,release:"2026-10-16"},
 {id:"ep01",file:"episodes/ep01.js",title:"It's Just a Hose Bib",week:1,release:"2026-10-16"},
 {id:"ep99",file:"episodes/ep99.js",title:"Framework Stub",week:99,release:"2099-01-01",stub:true}
];
