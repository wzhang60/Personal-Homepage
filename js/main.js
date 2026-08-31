// ==========================================================================
// 张文龙 · 个人主页 V1 - 交互脚本
// ==========================================================================

(function () {
  "use strict";

  // --- 移动端导航开关 ---
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // 点击某个链接后自动关闭移动端菜单
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- 当前年份（页脚自动更新） ---
  var yearEl = document.querySelector(".site-footer .container p");
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(/© \d{4}/, "© " + new Date().getFullYear());
  }

  // ============================================================
  // 数字分身 · 静态聊天原型
  // 说明：V1 阶段仅含预置问答，不会发送任何数据；后续课程接入真实对话。
  // ============================================================
  var twinBody = document.getElementById("twinBody");
  var twinForm = document.getElementById("twinForm");
  var twinInput = document.getElementById("twinInput");
  var twinSuggest = document.getElementById("twinSuggest");

  // 预置知识：如何介绍“文龙”（根据页面 data-lang 切换中英文）
  var TWIN_FAQ = {
    zh: {
      "你是谁": "我是张文龙，天津大学深圳学院的助理教授，主要专研 Vibe Coding，和同学们一起学习 AI。同时，我是三个娃的爹，是个欢乐的中年老登。",
      "你在研究什么": "我主要专研 Vibe Coding，同时通过 AI 实现都市农业水培与污水资源回收，让技术用在真实场景里。",
      "平衡": "怎么平衡生活和工作？我讲究“超年轻的心态、不卷”——该认真的时候认真，该放下的时候放下。有娃就好好带娃，热爱就尽情热爱，不把自己逼太紧。",
      "兴趣": "我喜欢足球五大联赛、台球、音乐，也在大 A 股苦苦挣扎。有爱好的生活，才更有奔头。",
      "你好": "你好！我是文龙的数字分身原型。虽然暂时只能讲预置的内容，但欢迎你随便点点看看。"
    },
    en: {
      "who are you": "I'm Wenlong Zhang, an Assistant Professor at the Shenzhen Institute of Tianjin University. I mainly work on Vibe Coding and learn AI together with students. I'm also the proud dad of three kids.",
      "what do you research": "I mainly work on Vibe Coding, and use AI for urban hydroponic agriculture and wastewater resource recovery — putting technology to work in real scenarios.",
      "balance": "How do I balance life and work? I go for a \"super-young mindset, no over-striving\" — serious when it matters, relaxed when it's time to let go. With kids, I parent wholeheartedly; with passions, I enjoy them fully; I don't push myself too hard.",
      "interest": "I love top-five football leagues, billiards, and music, and I also struggle in the A-share market. A life with hobbies is a life worth living.",
      "hello": "Hello! I'm the prototype of Wenlong's digital twin. For now I can only share preset content, but feel free to click around."
    }
  };

  function appendMsg(text, who) {
    if (!twinBody) return;
    var wrap = document.createElement("div");
    wrap.className = "msg msg--" + who;
    var body = document.createElement("div");
    body.className = "msg__body";
    body.textContent = text;
    wrap.appendChild(body);
    twinBody.appendChild(wrap);
    twinBody.scrollTop = twinBody.scrollHeight;
  }

  function botReply(question) {
    var lang = (document.body.getAttribute("data-lang") === "en") ? "en" : "zh";
    var fallback = lang === "en"
      ? "I can't answer that yet. In this prototype stage I only handle preset content; real \"answering\" will be added in later lessons. Try one of the suggested questions above first."
      : "这个问题我现在还讲不太好呢。V1 阶段我只是一个预置的原型，真正会“回答”的能力会在后续课程里加上去。你可以先点上面的建议问题试试。";
    var answer = fallback;
    var q = (question || "").trim();
    // 关键词匹配预置答案
    for (var key in TWIN_FAQ[lang]) {
      if (q && q.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        answer = TWIN_FAQ[lang][key];
        break;
      }
    }
    setTimeout(function () { appendMsg(answer, "bot"); }, 400);
  }

  function ask(q) {
    if (!q) return;
    appendMsg(q, "user");
    if (twinInput) twinInput.value = "";
    botReply(q);
  }

  if (twinForm) {
    twinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      ask(twinInput && twinInput.value);
    });
  }

  if (twinSuggest) {
    twinSuggest.addEventListener("click", function (e) {
      var chip = e.target.closest(".suggest-chip");
      if (chip) ask(chip.getAttribute("data-q"));
    });
  }
})();
