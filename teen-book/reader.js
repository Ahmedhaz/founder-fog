// Page-by-page reader. ?print shows every page for the PDF. #p5 opens page 5.
(function () {
  "use strict";
  if (/[?&]print\b/.test(location.search)) {
    document.documentElement.classList.add("print");
    if (/[?&]bleed\b/.test(location.search)) document.documentElement.classList.add("bleed");
    return;
  }
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var rtl = document.documentElement.dir === "rtl";
  var cur = document.querySelector(".cur"), prev = document.querySelector(".prev"), next = document.querySelector(".next");
  var stage = document.querySelector(".stage"), bar = document.querySelector(".bar"), nav = document.querySelector(".nav");
  var i = Math.min(pages.length - 1, Math.max(0, (parseInt((location.hash.match(/p(\d+)/) || [])[1], 10) || 1) - 1));

  function fit() {
    var px = pages[0].getBoundingClientRect ? 148 * 96 / 25.4 : 559;
    var w = window.innerWidth - 20, h = window.innerHeight - bar.offsetHeight - nav.offsetHeight - 24;
    var k = Math.min(w / px, h / (px * 210 / 148), 1.6);
    stage.style.setProperty("--k", Math.max(0.3, k));
    document.querySelector(".book").style.setProperty("--k", Math.max(0.3, k));
  }
  function show(n, back) {
    if (n < 0 || n >= pages.length) return;
    pages[i].classList.remove("current", "back-turn");
    i = n;
    pages[i].classList.add("current");
    pages[i].classList.toggle("back-turn", !!back);
    cur.textContent = i + 1;
    prev.disabled = i === 0; next.disabled = i === pages.length - 1;
    try { history.replaceState(null, "", "#p" + (i + 1)); } catch (e) { /* file:// */ }
  }
  prev.addEventListener("click", function () { show(i - 1, true); });
  next.addEventListener("click", function () { show(i + 1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") show(rtl ? i - 1 : i + 1, rtl);
    else if (e.key === "ArrowLeft") show(rtl ? i + 1 : i - 1, !rtl);
    else if (e.key === "Home") show(0, true);
    else if (e.key === "End") show(pages.length - 1);
  });
  // Swipe: towards the start of the line turns to the next page.
  var x0 = null, y0 = null;
  document.querySelector(".reader").addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  document.querySelector(".reader").addEventListener("touchend", function (e) {
    if (x0 == null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { var fwd = rtl ? dx > 0 : dx < 0; show(fwd ? i + 1 : i - 1, !fwd); }
    x0 = null;
  });
  window.addEventListener("resize", fit);
  fit();
  show(i);
})();
