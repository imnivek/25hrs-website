/* 25HRS 官網 POC｜互動腳本
   功能：頁首滾動變色、手機選單、進場動畫、表單示意送出 */
(function () {
  "use strict";

  // 頁首滾動變色
  var topbar = document.querySelector(".topbar");
  function onScroll() {
    if (!topbar) return;
    if (window.scrollY > 40) topbar.classList.add("scrolled");
    else topbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 手機選單開合
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  // 進場動畫（IntersectionObserver）
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // 表單示意送出（POC：不串接後端，僅前端提示）
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var box = form.querySelector(".form-msg");
      if (box) {
        box.textContent = "已收到您的資料（POC 示意，尚未串接後端）。專人將於 1 個工作日內與您聯繫。";
        box.style.color = "var(--gold)";
      }
      form.reset();
    });
  });
})();
