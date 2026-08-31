// ==========================================================================
// 张文龙个人主页 · Feedback 反馈提交（Supabase REST API）
// 说明：使用 Supabase REST API 直接 POST，无需第三方 SDK（项目零依赖）。
//      表 homepage_feedback 已开启 RLS：仅放开匿名 insert，前端只用
//      publishable key，不读取、不泄露任何其他数据。
// ==========================================================================

(function () {
  "use strict";

  // ---- Supabase 配置（publishable key 可安全放前端；绝不放 secret / service_role）----
  var SUPABASE_URL = "https://fktngogmsfzkazgndeqx.supabase.co";
  var SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7jcygiKSE172cuiCh_yUoQ_8sYO5NHt";
  var TABLE = "homepage_feedback";

  // 双语文案
  var I18N = {
    zh: {
      errEmpty: "请填写昵称、关系和建议内容后再提交。",
      errTooLong: "建议内容请控制在 2000 字以内。",
      sending: "正在提交…",
      success: "谢谢你！你的反馈已收到，我会认真看的。",
      failed: "提交失败，请稍后再试，或直接发邮件给我。"
    },
    en: {
      errEmpty: "Please fill in your nickname, relationship, and feedback before submitting.",
      errTooLong: "Please keep your feedback within 2000 characters.",
      sending: "Submitting…",
      success: "Thank you! Your feedback has been received — I'll read it carefully.",
      failed: "Submission failed. Please try again later, or email me directly."
    }
  };

  var form = document.getElementById("feedbackForm");
  if (!form) return;

  function lang() {
    return document.body.getAttribute("data-lang") === "en" ? "en" : "zh";
  }

  function fieldValue(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = I18N[lang()];

    var visitorName = fieldValue("fbVisitorName");
    var relationship = fieldValue("fbRelationship");
    var message = fieldValue("fbMessage");
    var status = document.getElementById("fbStatus");
    var submitBtn = document.getElementById("fbSubmit");

    // 校验
    if (!visitorName || !relationship || !message) {
      if (status) { status.textContent = t.errEmpty; status.className = "fb-status fb-status--err"; }
      return;
    }
    if (message.length > 2000) {
      if (status) { status.textContent = t.errTooLong; status.className = "fb-status fb-status--err"; }
      return;
    }

    if (status) { status.textContent = t.sending; status.className = "fb-status fb-status--sending"; }
    if (submitBtn) { submitBtn.disabled = true; }

    var payload = {
      visitor_name: visitorName,
      relationship: relationship,
      message: message,
      page_url: window.location.href
    };

    var url = SUPABASE_URL + "/rest/v1/" + TABLE;

    fetch(url, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": "Bearer " + SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        if (status) { status.textContent = t.success; status.className = "fb-status fb-status--ok"; }
        form.reset();
      })
      .catch(function () {
        if (status) { status.textContent = t.failed; status.className = "fb-status fb-status--err"; }
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; }
      });
  });
})();
