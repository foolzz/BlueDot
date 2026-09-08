/**
 * Homepage language switch, PDF-page viewer, and Google Form helpers.
 */
(function () {
  const FORM_URL = "https://forms.gle/N6wrMZCPUs8i9Vbf7";

  /**
   * @typedef {{src: string, alt: string, doc: string, hotspots?: boolean}} PageSpec
   */

  /** @type {Record<string, PageSpec[]>} */
  const PAGES = {
    zh: [
      {
        src: "images/pages/zh-practice-p1.jpg",
        alt: "觉久却巴共修法讯",
        doc: "zh-practice",
        hotspots: true
      },
      {
        src: "images/pages/zh-intro-p1.jpg",
        alt: "觉久却巴修法介绍 第1页",
        doc: "zh-intro"
      },
      {
        src: "images/pages/zh-intro-p2.jpg",
        alt: "觉久却巴修法介绍 第2页",
        doc: "zh-intro"
      }
    ],
    en: [
      {
        src: "images/pages/en-practice-p1.jpg",
        alt: "Chöjuk Chöpa group practice announcement",
        doc: "en-practice",
        hotspots: true
      },
      {
        src: "images/pages/en-intro-p1.jpg",
        alt: "Chöjuk Chöpa introduction page 1",
        doc: "en-intro"
      },
      {
        src: "images/pages/en-intro-p2.jpg",
        alt: "Chöjuk Chöpa introduction page 2",
        doc: "en-intro"
      },
      {
        src: "images/pages/en-intro-p3.jpg",
        alt: "Chöjuk Chöpa introduction page 3",
        doc: "en-intro"
      }
    ]
  };

  /**
   * @returns {"zh"|"en"}
   */
  function readLang() {
    const saved = localStorage.getItem("kathogati-lang");
    if (saved === "en" || saved === "zh") {
      return saved;
    }
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  /**
   * @param {"zh"|"en"} lang
   */
  function setLang(lang) {
    document.body.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem("kathogati-lang", lang);
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
    });
    renderPages(lang, 0);
  }

  /**
   * @param {"zh"|"en"} lang
   * @param {number} index
   */
  function renderPages(lang, index) {
    const pages = PAGES[lang];
    const stage = document.getElementById("page-stage");
    const nav = document.getElementById("page-nav");
    const label = document.getElementById("page-label");
    if (!stage || !nav || !label) {
      return;
    }

    stage.innerHTML = pages.map(function (page, i) {
      const hotspots = page.hotspots
        ? (
          '<a class="hotspot hotspot-site" href="https://www.bodhicittasangha.org" target="_blank" rel="noopener noreferrer" aria-label="Bodhicitta Sangha website"></a>' +
          '<a class="hotspot hotspot-form" href="' + FORM_URL + '" target="_blank" rel="noopener noreferrer" aria-label="Google Form registration"></a>' +
          '<a class="hotspot hotspot-qr" href="' + FORM_URL + '" target="_blank" rel="noopener noreferrer" aria-label="Scan or open registration form"></a>'
        )
        : "";
      return (
        '<article class="page-frame' + (i === index ? " is-active" : "") + '" data-doc="' + page.doc + '" data-index="' + i + '">' +
          '<img src="' + page.src + '" alt="' + page.alt + '">' +
          hotspots +
        "</article>"
      );
    }).join("");

    nav.innerHTML = pages.map(function (page, i) {
      const title = lang === "zh"
        ? (page.hotspots ? "共修法讯" : "介绍 " + (i))
        : (page.hotspots ? "Announcement" : "Intro " + i);
      return '<button type="button" data-page="' + i + '"' + (i === index ? ' aria-current="true"' : "") + ">" + title + "</button>";
    }).join("");

    label.textContent = lang === "zh"
      ? "第 " + (index + 1) + " / " + pages.length + " 页 · 点击二维码或报名链接打开 Google 表单"
      : "Page " + (index + 1) + " of " + pages.length + " · Tap the QR code or form URL to open Google Form";
  }

  /**
   * @param {number} index
   */
  function showPage(index) {
    const lang = document.body.getAttribute("data-lang") === "en" ? "en" : "zh";
    const pages = PAGES[lang];
    const next = Math.max(0, Math.min(index, pages.length - 1));
    document.querySelectorAll(".page-frame").forEach(function (frame) {
      frame.classList.toggle("is-active", Number(frame.getAttribute("data-index")) === next);
    });
    document.querySelectorAll("#page-nav button").forEach(function (btn) {
      btn.setAttribute("aria-current", String(Number(btn.getAttribute("data-page")) === next));
    });
    const label = document.getElementById("page-label");
    if (label) {
      label.textContent = lang === "zh"
        ? "第 " + (next + 1) + " / " + pages.length + " 页 · 点击二维码或报名链接打开 Google 表单"
        : "Page " + (next + 1) + " of " + pages.length + " · Tap the QR code or form URL to open Google Form";
    }
  }

  document.addEventListener("click", function (event) {
    const langBtn = event.target.closest("[data-lang-btn]");
    if (langBtn) {
      setLang(langBtn.getAttribute("data-lang-btn") === "en" ? "en" : "zh");
      return;
    }

    const pageBtn = event.target.closest("#page-nav button");
    if (pageBtn) {
      showPage(Number(pageBtn.getAttribute("data-page")));
    }
  });

  setLang(readLang());
})();
