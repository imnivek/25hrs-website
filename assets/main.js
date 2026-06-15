/* 25HRS 官網｜互動腳本
   功能：頁首滾動變色、手機選單、進場動畫、聯絡表單送出 */
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

  // 聯絡表單：透過 FormSubmit 以 AJAX 寄到指定信箱（免後端、免註冊）
  document.querySelectorAll("form[data-contact-form]").forEach(function (form) {
    var endpoint = "https://formsubmit.co/ajax/ainstein.service@gmail.com";
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var box = form.querySelector(".form-msg");
      var btn = form.querySelector("button[type=submit]");
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      data._subject = "25HRS 官網表單：" + (data.intent || data.name || "新訊息");
      data._template = "table";
      if (btn) { btn.disabled = true; }
      if (box) { box.textContent = "送出中…"; box.style.color = "#9aa0ab"; }
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          if (res && (res.success === true || res.success === "true")) {
            if (box) {
              box.textContent = "已收到您的資料，專人將於 1 個工作日內與您聯繫。";
              box.style.color = "var(--gold)";
            }
            form.reset();
          } else {
            throw new Error("submit failed");
          }
        })
        .catch(function () {
          if (box) {
            box.textContent = "送出失敗，請改用 LINE@ 與我們聯繫，或稍後再試一次。";
            box.style.color = "#e06a6a";
          }
        })
        .then(function () { if (btn) { btn.disabled = false; } });
    });
  });
})();
