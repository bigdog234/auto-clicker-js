let auto = false;
let mouseX = 0;
let mouseY = 0;
let clicker = null;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "q") {
    auto = !auto;

    if (auto) {
      console.log("Autoclicker ON");

      clicker = setInterval(() => {
        const el = document.elementFromPoint(mouseX, mouseY);
        if (!el) return;

        const down = new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          clientX: mouseX,
          clientY: mouseY
        });

        const up = new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
          clientX: mouseX,
          clientY: mouseY
        });

        const click = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: mouseX,
          clientY: mouseY
        });

        el.dispatchEvent(down);
        el.dispatchEvent(up);
        el.dispatchEvent(click);
      }, 10); // speed: 10 ms
    } else {
      console.log("Autoclicker OFF");
      clearInterval(clicker);
    }
  }
});
