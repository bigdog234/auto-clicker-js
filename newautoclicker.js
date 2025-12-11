// ==========================
// SETTINGS
// ==========================
let clickSpeed = 15;               // ms between clicks
const MIN_SPEED = 5;
const MAX_SPEED = 500;

// ==========================
// CREATE MULTIPLE CIRCLES
// ==========================
let zones = [];

function createCircle(x = 200, y = 200) {
    const circle = document.createElement("div");
    Object.assign(circle.style, {
        position        : "fixed",
        left            : x + "px",
        top             : y + "px",
        width           : "70px",
        height          : "70px",
        background      : "rgba(0,150,255,.35)",
        border          : "3px solid rgb(0,150,255)",
        borderRadius    : "50%",
        zIndex          : 999999,
        cursor          : "move"
    });
    document.body.appendChild(circle);
    zones.push(circle);

    let drag = false, ox = 0, oy = 0;
    circle.addEventListener("mousedown", e => {
        drag = true;
        ox = e.clientX - circle.offsetLeft;
        oy = e.clientY - circle.offsetTop;
    });
    document.addEventListener("mouseup", () => drag = false);
    document.addEventListener("mousemove", e => {
        if (drag) {
            circle.style.left = e.clientX - ox + "px";
            circle.style.top  = e.clientY - oy + "px";
        }
    });
}

createCircle();   // first circle

// ==========================
// AUTOCLICKER ENGINE
// ==========================
let auto = false, clicker = null;

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

function startClicker() {
    clicker = setInterval(() => {
        // 1. hide all circles
        zones.forEach(z => z.style.pointerEvents = "none");

        zones.forEach(zone => {
            const { x, y } = getCenter(zone);
            const target = document.elementFromPoint(x, y);
            if (target && target !== zone) clickAt(x, y, target);
        });

        // 2. restore circles
        zones.forEach(z => z.style.pointerEvents = "");
    }, clickSpeed);
}

function stopClicker() {
    clearInterval(clicker);
}

// ==========================
// HOTKEYS
// ==========================
document.addEventListener("keydown", e => {
    const k = e.key.toLowerCase();

    if (k === "q") {                 // toggle
        auto = !auto;
        auto ? (console.log("Autoclick ON"),  startClicker())
             : (console.log("Autoclick OFF"), stopClicker());
    }
    if (k === "a") {                 // add circle
        createCircle();
        console.log("Added click zone");
    }
    if (e.key === "+" || e.key === "=") {   // faster
        clickSpeed = Math.max(MIN_SPEED, clickSpeed - 2);
        if (auto) { stopClicker(); startClicker(); }
        console.log("Speed:", clickSpeed, "ms");
    }
    if (e.key === "-" || e.key === "_") {   // slower
        clickSpeed = Math.min(MAX_SPEED, clickSpeed + 2);
        if (auto) { stopClicker(); startClicker(); }
        console.log("Speed:", clickSpeed, "ms");
    }
});
