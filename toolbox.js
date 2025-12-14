// ===============================
// INSPECT TOOLBOX v2 (SAFE)  +  FULL AUTO-CLICKER PANEL
// ===============================
if (!document.getElementById("inspectToolbox")) {

  const box = document.createElement("div");
  box.id = "inspectToolbox";
  box.style.cssText = `
    position:fixed;
    top:80px;
    right:20px;
    width:260px;
    background:#111;
    color:white;
    z-index:999999;
    border-radius:12px;
    font-family:Arial;
    box-shadow:0 0 20px rgba(0,0,0,.6)
  `;

  // Header
  const header = document.createElement("div");
  header.textContent = "🧰 Inspect Toolbox";
  header.style.cssText = `
    padding:10px;
    font-weight:bold;
    cursor:move;
    background:#1f1f1f;
    border-radius:12px 12px 0 0
  `;
  const close = document.createElement("span");
  close.textContent = "❌";
  close.style.cssText = "float:right;cursor:pointer";
  close.onclick = () => box.remove();
  header.appendChild(close);

  // Body
  const body = document.createElement("div");
  body.style.cssText = "padding:10px;display:grid;gap:8px";

  function btn(text, action) {
    const b = document.createElement("button");
    b.textContent = text;
    b.style.cssText = `
      padding:8px;
      border:none;
      border-radius:8px;
      background:#2a2a2a;
      color:white;
      cursor:pointer
    `;
    b.onmouseenter = () => b.style.background = "#3a3a3a";
    b.onmouseleave = () => b.style.background = "#2a2a2a";
    b.onclick = action;
    return b;
  }

  // ===== DRAW TOOL =====
  let canvas, ctx, drawing = false;

  body.appendChild(btn("✏️ Drawing Mode", () => {
    if (canvas) return;

    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position:fixed;
      top:0;
      left:0;
      z-index:999998;
      cursor:crosshair
    `;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";

    canvas.onmousedown = () => drawing = true;
    canvas.onmouseup = () => drawing = false;
    canvas.onmousemove = e => {
      if (!drawing) return;
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };

    document.body.appendChild(canvas);
  }));

  body.appendChild(btn("🧹 Clear Drawing", () => {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }));

  body.appendChild(btn("❌ Remove Drawing", () => {
    if (canvas) {
      canvas.remove();
      canvas = null;
      ctx = null;
    }
  }));

  // ===== GOOGLE SEARCH =====
  body.appendChild(btn("🔎 Google Search", () => {
    const q = prompt("Search Google for:");
    if (!q) return;

    window.open(
      "https://www.google.com/search?q= " + encodeURIComponent(q),
      "_blank",
      "width=900,height=700"
    );
  }));

  // Extra tools
  body.appendChild(btn("🌙 Dark Mode", () => {
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    document.querySelectorAll("img,video").forEach(e =>
      e.style.filter = "invert(1) hue-rotate(180deg)"
    );
  }));

  body.appendChild(btn("✏️ Edit Page", () => {
    document.body.contentEditable = "true";
    document.designMode = "on";
    alert("Page is now editable");
  }));

  body.appendChild(btn("🧹 Clear Console", () => console.clear()));

  // ==========================
  // AUTO-CLICKER PANEL
  // ==========================
  (function addClickerPanel() {

    // settings
    let clickSpeed = 15;
    const MIN = 5, MAX = 500;

    // zones array
    let zones = [];

    // create / delete helpers
    window.createCircle = function(x = 200, y = 200) {
      const c = document.createElement("div");
      Object.assign(c.style, {
        position: "fixed",
        left: x + "px",
        top: y + "px",
        width: "70px",
        height: "70px",
        background: "rgba(0,150,255,.35)",
        border: "3px solid rgb(0,150,255)",
        borderRadius: "50%",
        zIndex: 999999,
        cursor: "move"
      });
      document.body.appendChild(c);
      zones.push(c);

      let drag = false, ox = 0, oy = 0;
      c.addEventListener("mousedown", e => {
        drag = true;
        ox = e.clientX - c.offsetLeft;
        oy = e.clientY - c.offsetTop;
      });
      document.addEventListener("mouseup", () => drag = false);
      document.addEventListener("mousemove", e => {
        if (drag) {
          c.style.left = e.clientX - ox + "px";
          c.style.top = e.clientY - oy + "px";
        }
      });
      return c;
    };

    window.deleteLastCircle = function() {
      const last = zones.pop();
      if (last) last.remove();
    };

    // engine
    let auto = false, timer = null;

    function getCenter(el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    function clickAt(x, y, target) {
      ["mousedown", "mouseup", "click"].forEach(type =>
        target.dispatchEvent(new MouseEvent(type, {
          bubbles: true, cancelable: true, clientX: x, clientY: y
        }))
      );
    }

    window.startClicker = function() {
      if (timer) return;
      if (!zones.length) { alert("Add at least one click zone first"); return; }
      timer = setInterval(() => {
        zones.forEach(z => z.style.pointerEvents = "none");   // hide
        zones.forEach(zone => {
          const { x, y } = getCenter(zone);
          const target = document.elementFromPoint(x, y);
          if (target && target !== zone) clickAt(x, y, target);
        });
        zones.forEach(z => z.style.pointerEvents = "");       // restore
      }, clickSpeed);
    };

    window.stopClicker = function() {
      clearInterval(timer);
      timer = null;
    };

    // panel buttons
    body.appendChild(btn("➕ Add Zone", () => createCircle()));
    body.appendChild(btn("➖ Delete Zone", () => deleteLastCircle()));
    body.appendChild(btn("▶️ START", () => { auto = true; startClicker(); }));
    body.appendChild(btn("⏸ STOP", () => { auto = false; stopClicker(); }));

    // speed bar
    const speedBar = document.createElement("div");
    speedBar.style.cssText = "color:#aaa;font-size:12px;text-align:center;margin-top:4px";
    speedBar.innerText = "Speed: 15 ms  (keys + / – )";
    body.appendChild(speedBar);

    // hot-keys still work
    document.addEventListener("keydown", e => {
      const k = e.key.toLowerCase();
      if (k === "q") { auto = !auto; auto ? startClicker() : stopClicker(); }
      if (k === "a") createCircle();
      if (e.key === "+" || e.key === "=") {
        clickSpeed = Math.max(MIN, clickSpeed - 2);
        if (timer) { stopClicker(); startClicker(); }
        speedBar.innerText = `Speed: ${clickSpeed} ms`;
      }
      if (e.key === "-" || e.key === "_") {
        clickSpeed = Math.min(MAX, clickSpeed + 2);
        if (timer) { stopClicker(); startClicker(); }
        speedBar.innerText = `Speed: ${clickSpeed} ms`;
      }
    });

    // start with one circle
    createCircle();
  })();

  // Assemble
  box.appendChild(header);
  box.appendChild(body);
  document.body.appendChild(box);

  // Drag toolbox
  let drag = false, ox = 0, oy = 0;
  header.onmousedown = e => {
    drag = true;
    ox = e.clientX - box.offsetLeft;
    oy = e.clientY - box.offsetTop;
  };
  document.onmousemove = e => {
    if (drag) {
      box.style.left = e.clientX - ox + "px";
      box.style.top = e.clientY - oy + "px";
    }
  };
  document.onmouseup = () => drag = false;

} else {
  alert("Toolbox already open");
}
