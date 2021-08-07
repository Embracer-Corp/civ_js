const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

var fps = 1000/100
var lps = 1000/100

// ----- Math -----
function lerp(v1, v2, w) {
  return v1 + w * (v2 - v1)
}
function exMod(num, delimer) {
  let res = num%delimer
  return res<0?res+=delimer:res
}
// ----- Vector -----
function normalize(vector, scale) {
  var norm = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
  if (norm != 0) {
    vector.x = scale * vector.x / norm
    vector.y = scale * vector.y / norm
  }
}
function multiplication(vector, scale) {
  vector.x *= scale
  vector.y *= scale
}



const general = {
  fps: 1000/100,
  lps: 1000/100,
  isOpera: null,//(!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
  isFirefox: null,//typeof InstallTrigger !== 'undefined',
  isSafari: null,///constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)),
  isIE: null,//!!document.documentMode,
  isEdge: null,//!this.isIE && !!window.StyleMedia,
  isChrome: null,///Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
  // isEdgeChromium: this.isChrome && /Edg/.test(navigator.userAgent),
  // isBlink: (this.isChrome || this.isOpera) && !!window.CSS,
  init: function() {
    this.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
    this.isFirefox = typeof InstallTrigger !== 'undefined'
    this.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification))
    this.isIE = !!document.documentMode
    this.isEdge = !this.isIE && !!window.StyleMedia
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

    this.fullScreen = function() {



      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // if (this.isChrome || this.isSafari) { canvas.webkitRequestFullscreen() }
        // else if (isIE) { canvas.requestFullscreen() }

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
          if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
          } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen(); // Firefox
          } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen(); // Chrome and Safari
          } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen(); // IE
          }
        }
        // canvas.webkitRequestFullscreen()
      }
    }
  }
}

addEventListener("load", function() {
  general.init()

  // Logic loop
  let lastTimeLogic = Date.now()
  setInterval(function() {
    let timePass = Date.now() - lastTimeLogic
    
    if (timePass < lps) {
        return
    } else if (timePass > 4 * lps) { // hard mistiming
      lastTimeLogic = Date.now()
        timePass = 4 * lps
    }
    if(game.state == GameState.MENU) {
      menu.logic(timePass)
    } else if(game.state == GameState.WORKS) {
      game.logic(timePass)
    }
  }, 10)
  
  // Graphic loop
  let lastTimeDraw = Date.now()
  setInterval(function() {
    let timePass = Date.now() - lastTimeDraw
    if (timePass < fps) {
        return
    }
    // diagnostic.test(timePass)
  
    if(game.state == GameState.MENU) {
      //menu.draw(canvasContext, canvas.width, canvas.height, timePass)
      room.draw(canvasContext, canvas.width, canvas.height, timePass)
    } else if(game.state == GameState.WORKS) {
      game.draw(canvasContext, canvas.width, canvas.height, timePass)
    }
  
    lastTimeDraw += timePass
  }, 10)
})
