function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5mcRRWoLhCo":
        Script1();
        break;
      case "6Lr3X5KgrXN":
        Script2();
        break;
      case "5iJTfj6XYsb":
        Script3();
        break;
      case "6Vhl6KQJwVD":
        Script4();
        break;
      case "6WOzQKljwCu":
        Script5();
        break;
      case "6Iv07MlaS2m":
        Script6();
        break;
      case "5mBGKqcDoRG":
        Script7();
        break;
      case "6ScEc1k5XI9":
        Script8();
        break;
      case "6QdBoPouOhl":
        Script9();
        break;
      case "5kbZFVnxcAA":
        Script10();
        break;
      case "5g1uOos4kkq":
        Script11();
        break;
      case "6iBRZuJ7zPV":
        Script12();
        break;
      case "6DbSfxLeB5B":
        Script13();
        break;
  }
}

window.InitExecuteScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
var getKeyDown = player.getKeyDown;
var keydown = player.keydown;
var keyup = player.keyup;
window.Script1 = function()
{
  player.once(() => {
const target = object('6BtHN9Fl8uu');
const duration = 750;
const easing = 'ease-out';
const id = '6J88PxQHhWR';
const growAmount = 0.1;
const delay = 0;
addToTimeline(
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script2 = function()
{
  const target = object('6BtHN9Fl8uu');
const duration = 750;
const easing = 'ease-out';
const id = '62VGvmiNUFL';
const shrinkAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 - shrinkAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script3 = function()
{
  const target = object('6BtHN9Fl8uu');
const duration = 750;
const easing = 'ease-out';
const id = '6J88PxQHhWR';
const growAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script4 = function()
{
  player.once(() => {
const target = object('6ctbZ5jRlEL');
const duration = 750;
const easing = 'ease-out';
const id = '6EDVkhKwbuv';
const growAmount = 0.1;
const delay = 0;
addToTimeline(
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script5 = function()
{
  const target = object('6ctbZ5jRlEL');
const duration = 750;
const easing = 'ease-out';
const id = '6YXNCkE1sNI';
const shrinkAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 - shrinkAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script6 = function()
{
  const target = object('6ctbZ5jRlEL');
const duration = 750;
const easing = 'ease-out';
const id = '6EDVkhKwbuv';
const growAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script7 = function()
{
  const target = object('5cr6hv2bR5t');
const duration = 750;
const easing = 'ease-out';
const id = '5jeVt3tHH5a';
const shrinkAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 - shrinkAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script8 = function()
{
  const target = object('5cr6hv2bR5t');
const duration = 750;
const easing = 'ease-out';
const id = '5huBFNxeReZ';
const growAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script9 = function()
{
  player.once(() => {
const target = object('6LRCsNVCDug');
const duration = 750;
const easing = 'ease-out';
const id = '6J88PxQHhWR';
const growAmount = 0.2;
const delay = 0;
addToTimeline(
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script10 = function()
{
  const target = object('6LRCsNVCDug');
const duration = 750;
const easing = 'ease-out';
const id = '62VGvmiNUFL';
const shrinkAmount = 0.1;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 - shrinkAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script11 = function()
{
  const target = object('6LRCsNVCDug');
const duration = 750;
const easing = 'ease-out';
const id = '6J88PxQHhWR';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script12 = function()
{
  const target = object('5dHZ0pM2p6g');
const duration = 1000;
const easing = 'ease-out';
const id = '5g86L4mZqvJ';
const growAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script13 = function()
{
  const target = object('5dHZ0pM2p6g');
const duration = 1000;
const easing = 'ease-out';
const id = '6punXdU5efD';
const shrinkAmount = 0.2;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 - shrinkAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

};
