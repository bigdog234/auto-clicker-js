// ===============================
// INSPECT TOOLBOX v2  +  SCROLLABLE BODY
// ===============================
if (!document.getElementById("inspectToolbox")) {

  const box = document.createElement("div");
  box.id = "inspectToolbox";
  Object.assign(box.style, {
    position: "fixed", top: "80px", right: "20px", width: "260px",
    maxHeight: "calc(100vh - 100px)",        /* stay inside viewport */
    background: "#111", color: "white", zIndex: "999999",
    borderRadius: "12px", fontFamily: "Arial", boxShadow: "0 0 20px rgba(0,0,0,.6)",
    display: "flex", flexDirection: "column" /* header + scroll body */
  });

  // Header (fixed)
  const header = document.createElement("div");
  header.textContent = "🧰 Inspect Toolbox";
  Object.assign(header.style, {
    padding: "10px", fontWeight: "bold", cursor: "move",
    background: "#1f1f1f", borderRadius: "12px 12px 0 0", flexShrink: "0"
  });
  const close = document.createElement("span");
  close.textContent = "❌"; close.style.cssText = "float:right;cursor:pointer";
  close.onclick = () => box.remove(); header.appendChild(close);

  // Scrollable body
  const bodyWrap = document.createElement("div");
  Object.assign(bodyWrap.style, {
    flex: "1 1 auto", overflowY: "auto", padding: "10px",
    display: "grid", gap: "8px"
  });

  function btn(text, action) {
    const b = document.createElement("button");
    b.textContent = text;
    Object.assign(b.style, {
      padding: "8px", border: "none", borderRadius: "8px",
      background: "#2a2a2a", color: "white", cursor: "pointer"
    });
    b.onmouseenter = () => b.style.background = "#3a3a3a";
    b.onmouseleave = () => b.style.background = "#2a2a2a";
    b.onclick = action;
    return b;
  }

  // ===== ORIGINAL TOOLS =====
  let canvas, ctx, drawing = false;
  bodyWrap.appendChild(btn("✏️ Drawing Mode", () => {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.width = innerWidth; canvas.height = innerHeight;
    canvas.style.cssText = "position:fixed;top:0;left:0;z-index:999998;cursor:crosshair";
    ctx = canvas.getContext("2d"); ctx.lineWidth = 3; ctx.strokeStyle = "red";
    canvas.onmousedown = () => drawing = true; canvas.onmouseup = () => drawing = false;
    canvas.onmousemove = e => { if (!drawing) return; ctx.lineTo(e.clientX, e.clientY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(e.clientX, e.clientY); };
    document.body.appendChild(canvas);
  }));
  bodyWrap.appendChild(btn("🧹 Clear Drawing", () => ctx?.clearRect(0, 0, canvas.width, canvas.height)));
  bodyWrap.appendChild(btn("❌ Remove Drawing", () => { canvas?.remove(); canvas = ctx = null; }));
  bodyWrap.appendChild(btn("🔎 Google Search", () => { const q = prompt("Search Google for:"); if (q) open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank", "width=900,height=700"); }));
  bodyWrap.appendChild(btn("🌙 Dark Mode", () => { document.documentElement.style.filter = "invert(1) hue-rotate(180deg)"; document.querySelectorAll("img,video").forEach(el => el.style.filter = "invert(1) hue-rotate(180deg)"); }));
  bodyWrap.appendChild(btn("✏️ Edit Page", () => { document.body.contentEditable = true; document.designMode = "on"; alert("Page is now editable"); }));
  bodyWrap.appendChild(btn("🧹 Clear Console", () => console.clear()));

  // ===== AUTO-CLICKER =====
  let clickSpeed = 15, zones = [], autoTimer = null;
  const getCenter = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const clickAt = (x, y, target) => ["mousedown", "mouseup", "click"].forEach(type => target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y })));
  const createZone = () => {
    const z = document.createElement("div");
    Object.assign(z.style, { position: "fixed", left: "200px", top: "200px", width: "70px", height: "70px", background: "rgba(0,150,255,.35)", border: "3px solid rgb(0,150,255)", borderRadius: "50%", zIndex: 999999, cursor: "move" });
    document.body.appendChild(z); zones.push(z);
    let drag = false, ox = 0, oy = 0;
    z.onmousedown = e => { drag = true; ox = e.clientX - z.offsetLeft; oy = e.clientY - z.offsetTop; };
    document.onmousemove = e => { if (drag) { z.style.left = e.clientX - ox + "px"; z.style.top = e.clientY - oy + "px"; } };
    document.onmouseup = () => drag = false;
  };
  const deleteZone = () => { const last = zones.pop(); if (last) last.remove(); };
  const toggleClicker = () => {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; return; }
    if (!zones.length) { alert("Add at least one click zone"); return; }
    autoTimer = setInterval(() => { zones.forEach(z => z.style.pointerEvents = "none"); zones.forEach(z => { const { x, y } = getCenter(z); const t = document.elementFromPoint(x, y); if (t && t !== z) clickAt(x, y, t); }); zones.forEach(z => z.style.pointerEvents = ""); }, clickSpeed);
  };
  bodyWrap.appendChild(btn("➕ Add Zone", createZone));
  bodyWrap.appendChild(btn("➖ Delete Zone", deleteZone));
  bodyWrap.appendChild(btn("⏯ Toggle Clicker", toggleClicker));

  // ===== COOL TOOLS =====
  bodyWrap.appendChild(btn("🌈 RGB Aura Mouse", () => {
    const aura = document.createElement("div");
    Object.assign(aura.style, { position: "fixed", width: "40px", height: "40px", borderRadius: "50%", pointerEvents: "none", zIndex: 999999, mixBlendMode: "screen", filter: "blur(8px)" });
    document.body.appendChild(aura);
    const colors = ["#ff0080", "#0080ff", "#80ff00"]; let i = 0;
    document.onmousemove = e => { aura.style.left = e.clientX - 20 + "px"; aura.style.top = e.clientY - 20 + "px"; aura.style.background = colors[i++ % colors.length]; };
  }));
  bodyWrap.appendChild(btn("🔴 Page Laser", () => {
    const laser = document.createElement("div");
    Object.assign(laser.style, { position: "fixed", width: "3px", background: "red", zIndex: 999999, pointerEvents: "none", mixBlendMode: "difference" });
    document.body.appendChild(laser);
    document.onmousemove = e => { const X = e.clientX, Y = e.clientY, ang = Math.atan2(Y - e.clientY, X - e.clientX), len = Math.hypot(innerWidth, innerHeight); laser.style.left = X + "px"; laser.style.top = Y + "px"; laser.style.width = len + "px"; laser.style.height = "3px"; laser.style.transformOrigin = "0 0"; laser.style.transform = `rotate(${ang}rad)`; };
  }));
  bodyWrap.appendChild(btn("📝 Sticky Note", () => {
    const note = document.createElement("div");
    Object.assign(note.style, { position: "fixed", left: "100px", top: "100px", width: "200px", minHeight: "100px", background: "#feff9c", color: "#000", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", zIndex: 999999, fontSize: "14px", overflow: "auto", cursor: "move" });
    note.contentEditable = true; note.textContent = "type here…"; document.body.appendChild(note);
    let drag = false, ox = 0, oy = 0;
    note.onmousedown = e => { drag = true; ox = e.clientX - note.offsetLeft; oy = e.clientY - note.offsetTop; };
    document.onmousemove = e => { if (drag) { note.style.left = e.clientX - ox + "px"; note.style.top = e.clientY - oy + "px"; } };
    document.onmouseup = () => drag = false;
  }));
  bodyWrap.appendChild(btn("🎨 Color Picker", async () => {
    if (!window.EyeDropper) { alert("EyeDropper API not supported"); return; }
    const eye = new EyeDropper(); const { sRGBHex } = await eye.open(); navigator.clipboard.writeText(sRGBHex); alert("Copied " + sRGBHex);
  }));
  bodyWrap.appendChild(btn("📸 Full-Page PNG", async () => {
    const canvas = await import("https://html2canvas.hertzen.com/dist/html2canvas.esm.js").then(m => m.default(document.body, { useCORS: true }));
    const link = document.createElement("a"); link.download = "page.png"; link.href = canvas.toDataURL(); link.click();
  }));
  bodyWrap.appendChild(btn("⚡ Run JS", () => {
    const code = prompt("One-line JS:"); if (!code) return; try { Function(code)(); } catch (e) { alert(e); }
  }));

  // Assemble
  box.appendChild(header);
  box.appendChild(bodyWrap);
  document.body.appendChild(box);

  // Drag whole box by header or empty body area
  [header, bodyWrap].forEach(area =>
    area.onmousedown = e => {
      if (e.target.tagName === "BUTTON") return;
      const drag = true, ox = e.clientX - box.offsetLeft, oy = e.clientY - box.offsetTop;
      document.onmousemove = ev => { if (drag) { box.style.left = ev.clientX - ox + "px"; box.style.top = ev.clientY - oy + "px"; } };
      document.onmouseup = () => document.onmousemove = null;
    }
  );

} else {
  alert("Toolbox already open");
}
