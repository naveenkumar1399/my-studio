function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6ee5YwTxpTj":
        Script1();
        break;
      case "5YI4OH0shPe":
        Script2();
        break;
      case "6O1XLkMegsV":
        Script3();
        break;
      case "6kthzSV3I2T":
        Script4();
        break;
      case "6Pct1ouV9Td":
        Script5();
        break;
      case "6iE07CiGAAP":
        Script6();
        break;
      case "6STbQvyqqOe":
        Script7();
        break;
      case "6QEKMbV6FLo":
        Script8();
        break;
      case "6XVf1rhOyc5":
        Script9();
        break;
      case "64WnFFB7ShY":
        Script10();
        break;
      case "6BYklA9Y3I1":
        Script11();
        break;
      case "69qaVFHsKLA":
        Script12();
        break;
      case "5gqNrNdqIwT":
        Script13();
        break;
      case "6KR6iVNOnwH":
        Script14();
        break;
      case "5VXzqG2rl8l":
        Script15();
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
  const target = object('6WSWrZI1PWq');
const duration = 250;
const easing = 'linear';
const id = '5iFsJK8Pz6r';
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

window.Script2 = function()
{
  const target = object('6WSWrZI1PWq');
const duration = 750;
const easing = 'linear';
const id = '5Y47nWpORZP';
const shrinkAmount = 0;
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
  const target = object('6WSWrZI1PWq');
const duration = 250;
const easing = 'linear';
const id = '5iFsJK8Pz6r';
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

window.Script4 = function()
{
  player.once(() => {
const target = object('6VGUOIIxhms');
const duration = 1500;
const easing = 'ease-out';
const id = '5sLn0yk226O';
const shakeAmount = 5;
const delay = 250;
addToTimeline(
target.animate(
[ {translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script5 = function()
{
  const target = object('6VGUOIIxhms');
const duration = 750;
const easing = 'ease-out';
const id = '6pc4u0N9FRE';
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

window.Script6 = function()
{
  const target = object('6VGUOIIxhms');
const duration = 750;
const easing = 'ease-out';
const id = '6pc4u0N9FRE_reverse';
const growAmount = 0;
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
  player.once(() => {
const target = object('60wUHdusy7S');
const duration = 1500;
const easing = 'ease-out';
const id = '6TMDhnA1MFL';
const shakeAmount = 5;
const delay = 3000;
addToTimeline(
target.animate(
[ {translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script8 = function()
{
  const target = object('60wUHdusy7S');
const duration = 750;
const easing = 'ease-out';
const id = '6dpfLvoWbin';
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

window.Script9 = function()
{
  const target = object('60wUHdusy7S');
const duration = 750;
const easing = 'ease-out';
const id = '6dpfLvoWbin_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

window.Script10 = function()
{
  player.once(() => {
const target = object('5cMfc7JMBUs');
const duration = 1500;
const easing = 'ease-out';
const id = '5m1oeSmY12P';
const shakeAmount = 5;
const delay = 250;
addToTimeline(
target.animate(
[ {translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script11 = function()
{
  const target = object('5cMfc7JMBUs');
const duration = 750;
const easing = 'ease-out';
const id = '6kS6kyiwEPK';
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
  const target = object('5cMfc7JMBUs');
const duration = 750;
const easing = 'ease-out';
const id = '6kS6kyiwEPK_reverse';
const growAmount = 0;
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
  player.once(() => {
const target = object('6IrvgMpVeE2');
const duration = 1500;
const easing = 'ease-out';
const id = '6KAIGSbmgvH';
const shakeAmount = 5;
const delay = 3500;
addToTimeline(
target.animate(
[ {translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `${shakeAmount}px 0` }, 
{translate: '0 0' }, 
{translate: `-${shakeAmount}px 0` }, 
{translate: '0 0' } ]
,
  { fill: 'forwards', delay, duration, easing }
), id
);
});
}

window.Script14 = function()
{
  const target = object('6IrvgMpVeE2');
const duration = 750;
const easing = 'ease-out';
const id = '5pATxhzxIFP';
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

window.Script15 = function()
{
  const target = object('6IrvgMpVeE2');
const duration = 750;
const easing = 'ease-out';
const id = '5pATxhzxIFP_reverse';
const growAmount = 0;
player.addForTriggers(
id,
target.animate(
[ {scale: `${1 + growAmount}` } ]
,
  { fill: 'forwards', duration, easing }
)
);
}

};
