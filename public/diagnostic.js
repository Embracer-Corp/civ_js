const diagnostic = {
  touches: {
    0: {color: "#3498DB", x: [], y: []},
    1: {color: "#FAD7A0", x: [], y: []},
    2: {color: "#9B59B6", x: [], y: []},
    3: {color: "#D0ECE7", x: [], y: []},
    4: {color: "#AF601A", x: [], y: []}
  },
  fpsLog: [],
  fpsAvarage: 0,
  fpsWorst: 0,
  logTouch: function(ev) {
    let ts = ev.changedTouches
    for (let i = 0; i < ts.length; i++) {
      if (ts[i].identifier > 4) continue
      if (ev.type == "touchstart") {
        // console.log("touchstart", ts[i].identifier)
        this.touches[ts[i].identifier].x = [ts[i].pageX]
        this.touches[ts[i].identifier].y = [ts[i].pageY]
      } else if (ev.type == "touchmove") {
        // console.log("touchmove", ts[i].identifier)
        this.touches[ts[i].identifier].x.push(ts[i].pageX)
        this.touches[ts[i].identifier].y.push(ts[i].pageY)
      }
    }
  },
  drawScreenInfo: function(ctx, ctxWidth, ctxHeight, timePass) {
    ctx.font = "12px Lucida Console"
    ctx.fillStyle = "#000"
    let ori = ''
    for (let so in ScreenOrientation) { if (ScreenOrientation[so] == settings.screen.orientation) { ori = so; break } }
    //ctx.fillText(`[${ori}]: ${settings.screen.width}x${settings.screen.height}`, settings.screen.offset.x + 5, settings.screen.offset.y + 15)
    ctx.fillText('['+ori+']: '+settings.screen.width+'x'+settings.screen.height, settings.screen.offset.x + 5, settings.screen.offset.y + 15)

    ctx.fillStyle = "#FF0000"
    ctx.fillRect(0, 0, 10, 10)
    ctx.fillRect(0, settings.screen.height-10, 10, 10)
    ctx.fillRect(settings.screen.width-10, 0, 10, 10)
    ctx.fillRect(settings.screen.width-10, settings.screen.height-10, 10, 10)
  },
  drawFingerInfo: function(ctx, ctxWidth, ctxHeight, timePass) {
    for(id in this.touches)
    {
      ctx.fillStyle = this.touches[id].color+"90"
      ctx.strokeStyle = this.touches[id].color+"E0"
      ctx.beginPath(); ctx.arc(this.touches[id].x[0], this.touches[id].y[0], 4, 0, 2 * Math.PI, false)
      ctx.fill()
      ctx.lineWidth = 4
      for (let i = 1; i < this.touches[id].x.length; i++)
      {
        ctx.fillRect(this.touches[id].x[i] - 3, this.touches[id].y[i] - 3, 6, 6)
        ctx.beginPath()
        ctx.moveTo(this.touches[id].x[i-1], this.touches[id].y[i-1])
        ctx.lineTo(this.touches[id].x[i], this.touches[id].y[i])
        ctx.stroke()
      }
    }
  },
  drawFpsInfo: function(ctx, ctxWidth, ctxHeight, timePass) {
    let curRatio = lps/timePass
    this.fpsLog.push({time: Date.now(), ratio: curRatio})
    let worstRatio = curRatio
    
    let infoRect = {dur: 2000, x: ctxWidth - 200, y: 40, w: 200, h:-40}

    ctx.fillStyle = "#80401070"
    ctx.fillRect(infoRect.x, infoRect.y, infoRect.w, infoRect.h)
    ctx.fillStyle = "#90301090"

    let t = Date.now() - infoRect.dur
    while(this.fpsLog.length > 0 && this.fpsLog[0].time < t) { this.fpsLog.shift() }
    
    ctx.beginPath(); ctx.moveTo(infoRect.x, infoRect.y)
    let shift = 0
    for (let i = 0; i < this.fpsLog.length; i++) {
      let dt = this.fpsLog[i].time - t
      ctx.lineTo(infoRect.x + Math.floor(shift), infoRect.y + Math.floor(infoRect.h * this.fpsLog[i].ratio))
      shift += infoRect.w * dt / infoRect.dur
      ctx.lineTo(infoRect.x + Math.floor(shift), infoRect.y + Math.floor(infoRect.h * this.fpsLog[i].ratio))
      t += dt
      if (worstRatio > this.fpsLog[i].ratio) { worstRatio = this.fpsLog[i].ratio }
    }
    ctx.lineTo(infoRect.x + infoRect.w, infoRect.y); ctx.closePath(); ctx.fill()

    ctx.strokeStyle = "#F0000060"
    ctx.beginPath(); ctx.moveTo(infoRect.x + infoRect.w * 0.9, infoRect.y - 0.5 + Math.ceil(infoRect.h*(this.fpsLog.length / infoRect.dur * lps)))
    ctx.lineTo(infoRect.x + infoRect.w, infoRect.y - 0.5 + Math.ceil(infoRect.h * (this.fpsLog.length / infoRect.dur * lps))); ctx.closePath(); ctx.stroke()

    ctx.strokeStyle = "#F000F060"
    ctx.beginPath(); ctx.moveTo(infoRect.x + infoRect.w * 0.9, infoRect.y - 0.5 + Math.floor(infoRect.h * worstRatio))
    ctx.lineTo(infoRect.x + infoRect.w, infoRect.y - 0.5 + Math.floor(infoRect.h * worstRatio)); ctx.closePath(); ctx.stroke()

    this.fpsWorst = Math.floor(1000 / lps * worstRatio)
    this.fpsAvarage = Math.floor(1000 / infoRect.dur * this.fpsLog.length)
    // console.log(lps, timePass, this.fpsAvarage, this.fpsWorst, curRatio)

    ctx.font = "12px Lucida Console"

    ctx.fillStyle = "#40108070"
    ctx.fillRect(ctxWidth - 200, 40, 200, 40)
    ctx.fillStyle = "#7000A090"
    ctx.fillRect(ctxWidth - 200, 50, 200, 20)
    ctx.fillStyle = "#000"
    ctx.fillText("FPS [2 sec] target: " + Math.floor(1000 / lps), ctxWidth - 195, 12, 200, 40)
    ctx.fillText("avr: " + this.fpsAvarage + ", worst: " + this.fpsWorst, ctxWidth - 195, 32, 200, 40)
    ctx.fillText("LPS [2 sec] cur: 100.00", ctxWidth - 195, 53, 200, 40)
    ctx.fillText("avr: 100.00, worst: 100.00", ctxWidth - 195, 73, 200, 40)
  }
}