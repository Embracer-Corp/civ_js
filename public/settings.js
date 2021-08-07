const ScreenOrientation = { // iOS Safari doesn't support original enum
  PORTRAIT: 1,
  LANDSCAPE: 2,
  UNKNOWN: 0
}

// Settings is changing before game start, control is depended on it. Settings may change in game by menu
const settings = {
  screen: {width: 0, height: 0, orientation: ScreenOrientation.UNKNOWN/*, offset: {x: 0, y: 0}*/},
  keys: {left: 'a', right: 'd', up: 'w', down: 's'},
  debug: false,
  logic: function(timePass) {
    let dy = document.fullscreenElement == null ? 4 : 0 // without this bottom 4px page will get a lot of glitch 
    this.screen.width = document.documentElement.clientWidth
    this.screen.height = document.documentElement.clientHeight - dy

    let ls = this.screen.width > this.screen.height
    this.screen.orientation = ls ? ScreenOrientation.LANDSCAPE : ScreenOrientation.PORTRAIT
  }
}