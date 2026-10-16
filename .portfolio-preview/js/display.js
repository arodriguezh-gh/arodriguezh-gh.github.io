/* DISPLAY — content lives in data.js; this file renders it into named containers.
 * Native links, details, forms, and dialogs keep interactions understandable.
 */
(() => {
    "use strict";

    function escapeHTML(value) {
        const characters = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
        return String(value ?? "").replace(/[&<>"']/g, character => characters[character]);
    }
    function renderInto(id, html) {
        const container = document.getElementById(id);
        if (container) container.innerHTML = html;
    }
    function paragraphs(items = []) {
        return items.map(text => `<p>${escapeHTML(text)}</p>`).join("");
    }
    function tags(items = []) {
        return `<ul class="tags" aria-label="Methods and tools">${items.map(tag => `<li>${escapeHTML(tag)}</li>`).join("")}</ul>`;
    }
    function projectLink(project) {
        return `${document.body.dataset.siteBase || ""}projects.html#${encodeURIComponent(project.id)}`;
    }

    // Preview pages can reuse real assets without copying them or changing data.js.
    function assetURL(value) {
        if (!value || typeof value !== "string") return null;
        try {
            const localValue = value.startsWith("assets/") ? (document.body.dataset.assetBase || "") + value : value;
            const url = new URL(localValue, document.baseURI);
            const relative = !/^[a-z][a-z0-9+.-]*:/i.test(localValue) && !localValue.startsWith("//");
            if (url.protocol === "https:" || (relative && ["http:", "https:", "file:"].includes(url.protocol))) return url.href;
        } catch { /* Missing optional content should never stop the page. */ }
        return null;
    }

    function mediaFigure(key, extraClass = "", optional = false) {
        const media = portfolio.media[key];
        if (!media) return "";
        const source = assetURL(media.src);
        const ratios = { portrait: "Portrait · approximately 3:4", landscape: "Landscape · approximately 16:10", wide: "Wide · approximately 16:9", dashboard: "Tall dashboard · original proportions" };
        const placeholder = `<div class="media-placeholder"${source ? " hidden" : ""}><p class="eyebrow">Visual space</p><strong>${escapeHTML(media.role || media.alt)}</strong><small>${escapeHTML(ratios[media.shape])}</small></div>`;
        const image = source ? `<img src="${escapeHTML(source)}" alt="${escapeHTML(media.alt)}" width="${Number(media.width) || 1600}" height="${Number(media.height) || 1000}" loading="lazy" decoding="async">` : "";
        const linkedImage = source && !optional ? `<a class="media-link" href="${escapeHTML(source)}" data-enlarge aria-haspopup="dialog" aria-label="Enlarge: ${escapeHTML(media.alt)}">${image}<span class="zoom-hint" aria-hidden="true">Enlarge ↗</span></a>` : image;
        return `<figure class="image-figure media-${escapeHTML(media.shape)} ${extraClass}" data-media="${escapeHTML(key)}"${optional ? ' data-optional="true"' : ""}><div class="media-frame">${linkedImage}${placeholder}</div>${media.caption ? `<figcaption>${escapeHTML(media.caption)}</figcaption>` : ""}</figure>`;
    }

    function homeProject(project) {
        const metric = project.homeMetric;
        return `<article class="project-card project-${escapeHTML(project.type)} project-${escapeHTML(project.id)}" aria-labelledby="card-${escapeHTML(project.id)}">
            <header class="project-heading"><p class="project-kicker"><span class="project-number">${String(project.order).padStart(2, "0")} / ${escapeHTML(project.verb)}</span>${escapeHTML(project.context)}</p><h3 id="card-${escapeHTML(project.id)}" class="project-title">${escapeHTML(project.title)}</h3><p class="project-headline">${escapeHTML(project.headline)}</p></header>
            ${project.homeImage ? mediaFigure(project.homeImage, "project-visual") : ""}
            <div class="project-copy"><p class="project-summary">${escapeHTML(project.summary)}</p>${project.proof ? `<p class="project-proof">${escapeHTML(project.proof)}</p>` : ""}${tags(project.tags)}<a class="text-link" href="${projectLink(project)}">${escapeHTML(project.cta)}<span class="visually-hidden">: ${escapeHTML(project.title)}</span> <span aria-hidden="true">↗</span></a></div>
            ${metric ? `<p class="project-metric"><strong>${escapeHTML(metric.value)}</strong><small>${escapeHTML(metric.label)}</small></p>` : ""}
        </article>`;
    }

    function renderBackground() {
        renderInto("about-portrait", mediaFigure(portfolio.about.portrait, "portrait", true));
        renderInto("about-content", paragraphs(portfolio.about.paragraphs));
        renderInto("community-content", `<p>${escapeHTML(portfolio.about.community.text)}</p><div class="community-images">${portfolio.about.community.images.map(key => mediaFigure(key)).join("")}</div>`);
        renderInto("development-definition", escapeHTML(portfolio.developmentEngineering));
        renderInto("principles-list", portfolio.principles.map((item, index) => `<li><details class="principle"><summary><h3><span class="item-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>${escapeHTML(item.title)}</h3></summary><p>${escapeHTML(item.text)}</p></details></li>`).join(""));
        renderInto("skills-list", portfolio.skills.map((group, index) => `<details class="skill-group skill-${index + 1}"><summary><h3>${escapeHTML(group.title)}</h3></summary><ul>${group.items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></details>`).join(""));
        renderInto("education-list", portfolio.education.map(item => `<article><h3>${escapeHTML(item.institution)}</h3><p>${escapeHTML(item.degree)}</p>${item.dates ? `<p class="muted">${escapeHTML(item.dates)}</p>` : ""}${item.detail ? `<p class="muted">${escapeHTML(item.detail)}</p>` : ""}</article>`).join(""));
        renderInto("experience-list", portfolio.experience.map(item => `<li><h4>${escapeHTML(item.organization)}</h4><p>${escapeHTML(item.role)}</p><a class="text-link" href="${document.body.dataset.siteBase || ""}projects.html#${encodeURIComponent(item.projectId)}">Related work<span class="visually-hidden">: ${escapeHTML(item.organization)}</span> <span aria-hidden="true">↗</span></a></li>`).join(""));
    }

    function caseSection(section, wide = false) {
        return `<section class="case-section${wide ? " case-wide" : ""}"><h3>${escapeHTML(section.title)}</h3>${paragraphs(section.paragraphs)}${section.items ? `<ul>${section.items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul>` : ""}</section>`;
    }
    function processFigure(process) {
        return `<section class="case-section case-wide"><h3>${escapeHTML(process.title)}</h3><figure class="process-figure"><ol class="process-list">${process.steps.map(step => `<li><strong>${escapeHTML(step.title)}</strong><small>${escapeHTML(step.detail)}</small></li>`).join("")}</ol><figcaption>${escapeHTML(process.caption)}</figcaption></figure></section>`;
    }
    function concentrationFigure(chart, id) {
        if (!chart) return "";
        return `<section class="case-section case-wide"><h3>${escapeHTML(chart.title)}</h3><figure class="concentration-figure"><label for="${escapeHTML(id)}-concentration">${escapeHTML(chart.label)}</label><meter id="${escapeHTML(id)}-concentration" min="0" max="${Number(chart.maximum)}" value="${Number(chart.value)}" aria-describedby="${escapeHTML(id)}-chart-caption">${Number(chart.value)}%</meter><p>${escapeHTML(chart.context)}</p><figcaption id="${escapeHTML(id)}-chart-caption">${escapeHTML(chart.caption)}</figcaption></figure></section>`;
    }
    function caseGallery(project) {
        const keys = project.caseStudy.gallery;
        if (!keys) return "";
        if (project.id === "sun-works") return `<section class="case-section case-wide"><h3>Three views of the work</h3><div class="dashboard-gallery">${keys.filter(key => key !== "sunContext").map(key => mediaFigure(key)).join("")}</div>${mediaFigure("sunContext", "context-photo")}</section>`;
        return `<div class="media-gallery gallery-${escapeHTML(project.id)} case-wide">${keys.map(key => mediaFigure(key)).join("")}</div>`;
    }
    function caseStudy(project) {
        const study = project.caseStudy;
        const miniCases = study.miniCases ? `<section class="case-section case-wide"><h3>Three institutional contexts</h3><div class="mini-cases">${study.miniCases.map(item => `<article class="mini-case"><div><p class="eyebrow">${escapeHTML(item.label)}</p><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.text)}</p></div><div class="mini-media">${(item.images || []).map(key => mediaFigure(key)).join("")}</div></article>`).join("")}</div></section>` : "";
        return `<article id="${escapeHTML(project.id)}" class="case-study case-${escapeHTML(project.id)}" aria-labelledby="case-${escapeHTML(project.id)}">
            <header class="case-header"><p class="eyebrow">${String(project.order).padStart(2, "0")} / ${escapeHTML(project.verb)} · ${escapeHTML(project.label)}</p><h2 id="case-${escapeHTML(project.id)}">${escapeHTML(project.title)}</h2><p class="case-headline">${escapeHTML(project.headline)}</p>${tags(project.tags)}</header>
            ${project.homeImage && project.id !== "sun-works" ? mediaFigure(project.homeImage, "case-lead-image") : ""}
            <div class="case-grid">${(study.sections || []).map(section => caseSection(section)).join("")}${concentrationFigure(study.chart, project.id)}${miniCases}${(study.processes || []).map(processFigure).join("")}${caseGallery(project)}
                ${study.principle ? `<aside class="case-principle case-wide" aria-label="Product experience"><p>${escapeHTML(study.principle)}</p></aside>` : ""}
                ${study.validation ? caseSection({ title: "Validation & iteration", ...study.validation }, true) : ""}${study.relevance ? caseSection(study.relevance, true) : ""}
                ${study.futureImage ? mediaFigure(study.futureImage, "case-wide future-visual") : ""}
                ${study.tools ? `<details class="tools-disclosure case-wide"><summary>${escapeHTML(study.toolsLabel)}</summary>${tags(study.tools)}</details>` : ""}
            </div><footer class="case-footer"><a class="back-link" href="#case-studies-top">Back to index <span aria-hidden="true">↑</span></a></footer>
        </article>`;
    }

    function updateContactDetails() {
        document.querySelectorAll("[data-owner]").forEach(element => { const value = portfolio.owner[element.dataset.owner]; if (value) element.textContent = value; });
        document.querySelectorAll("[data-hero]").forEach(element => element.textContent = portfolio.hero[element.dataset.hero]);
        document.querySelectorAll("[data-email]").forEach(link => { link.textContent = portfolio.owner.email; link.href = `mailto:${portfolio.owner.email}`; });
        document.querySelectorAll("[data-linkedin]").forEach(link => link.href = assetURL(portfolio.owner.linkedin) || `mailto:${portfolio.owner.email}`);
        document.querySelectorAll("[data-cv]").forEach(link => { const cvURL = assetURL(portfolio.owner.cvUrl); link.href = cvURL || `mailto:${portfolio.owner.email}?subject=CV%20request`; link.textContent = cvURL ? "View CV" : "Request CV"; });
        document.querySelectorAll("[data-year]").forEach(element => element.textContent = new Date().getFullYear());
    }

    function setupNavigation() {
        const header = document.querySelector(".site-header");
        const button = document.querySelector(".menu-button");
        const navigation = document.getElementById("site-navigation");
        if (!header || !button || !navigation) return;
        const mobile = window.matchMedia("(max-width: 720px)");
        function setOpen(open) { button.setAttribute("aria-expanded", String(open)); navigation.classList.toggle("is-open", open); }
        button.hidden = false;
        header.classList.add("navigation-ready");
        button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
        navigation.addEventListener("click", event => {
            const link = event.target.closest("a");
            if (!link || !mobile.matches) return;
            setOpen(false);
            if (link.getAttribute("href").startsWith("#")) {
                const target = document.querySelector(link.getAttribute("href"));
                if (target) { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
            }
        });
        document.addEventListener("keydown", event => { if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") { setOpen(false); button.focus(); } });
        document.addEventListener("click", event => {
            if (!header.contains(event.target)) { const focusWasInNavigation = navigation.contains(document.activeElement); setOpen(false); if (mobile.matches && focusWasInNavigation) button.focus(); }
        });
        mobile.addEventListener("change", () => { const focusWasInNavigation = navigation.contains(document.activeElement); setOpen(false); if (mobile.matches && focusWasInNavigation) button.focus(); });
    }

    function setupContactForm() {
        const form = document.getElementById("contact-form");
        if (!form) return;
        const status = document.getElementById("form-status");
        const draft = document.getElementById("email-draft");
        document.getElementById("prepare-email").disabled = false;
        form.addEventListener("submit", event => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const fields = new FormData(form);
            const name = fields.get("name").trim();
            const email = fields.get("email").trim();
            const message = fields.get("message").trim();
            if (!name || !message) { status.textContent = "Please add your name and a message."; return; }
            const subject = fields.get("subject").trim() || "Portfolio conversation";
            draft.href = `mailto:${portfolio.owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`)}`;
            draft.hidden = false;
            status.textContent = "Draft ready. Open it in your email app to review and send. Nothing has been sent by this website.";
        });
        form.addEventListener("input", () => { draft.hidden = true; draft.removeAttribute("href"); status.textContent = ""; });
    }

    function setupImages() {
        document.querySelectorAll(".image-figure img").forEach(image => {
            function showFallback() {
                const figure = image.closest("figure");
                if (figure.dataset.optional) { figure.hidden = true; figure.closest(".about-layout, .hero")?.classList.add("without-media"); return; }
                (image.closest("a") || image).hidden = true;
                figure.querySelector(".media-placeholder").hidden = false;
                figure.classList.add("is-missing");
            }
            image.addEventListener("error", showFallback);
            if (image.complete && image.naturalWidth === 0) showFallback();
        });
        // Native dialog supplies focus containment and Escape handling.
        const dialog = document.createElement("dialog");
        dialog.id = "media-dialog";
        dialog.className = "media-dialog";
        dialog.setAttribute("aria-labelledby", "media-dialog-title");
        dialog.innerHTML = `<header class="dialog-header"><h2 id="media-dialog-title">Image detail</h2><button type="button" class="dialog-close" autofocus>Close <span aria-hidden="true">×</span></button></header><div class="zoom-viewport" tabindex="0" aria-label="Image area; scroll to explore when zoomed"><img class="dialog-image" alt=""></div><footer class="dialog-footer"><button type="button" class="zoom-toggle" aria-pressed="false">View original size</button><a class="original-link" target="_blank" rel="noopener noreferrer">Open image in new tab ↗</a></footer>`;
        document.body.append(dialog);
        let opener = null;
        document.addEventListener("click", event => {
            const link = event.target.closest("[data-enlarge]");
            if (!link || typeof dialog.showModal !== "function") return;
            event.preventDefault();
            opener = link;
            const image = dialog.querySelector("img");
            image.src = link.href;
            image.alt = link.querySelector("img").alt;
            dialog.querySelector(".original-link").href = link.href;
            dialog.querySelector("h2").textContent = link.closest("figure").querySelector("figcaption")?.textContent || "Image detail";
            dialog.classList.remove("is-zoomed");
            dialog.querySelector(".zoom-toggle").setAttribute("aria-pressed", "false");
            dialog.querySelector(".zoom-toggle").textContent = "View original size";
            dialog.showModal();
            document.body.classList.add("dialog-open");
        });
        dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
        dialog.addEventListener("close", () => { document.body.classList.remove("dialog-open"); opener?.focus(); });
        dialog.querySelector(".zoom-toggle").addEventListener("click", event => { const zoomed = dialog.classList.toggle("is-zoomed"); event.currentTarget.setAttribute("aria-pressed", String(zoomed)); event.currentTarget.textContent = zoomed ? "Fit to screen" : "View original size"; });
    }

    const projects = [...portfolio.projects].sort((first, second) => first.order - second.order);
    if (document.getElementById("selected-work")) {
        const selected = document.body.dataset.direction ? projects.slice(0, 1) : projects;
        renderInto("selected-work", selected.map(homeProject).join(""));
        if (!document.body.dataset.direction) renderBackground();
        if (document.body.dataset.direction === "c") renderInto("hero-portrait", mediaFigure("portrait", "portrait", true));
    }
    if (document.getElementById("case-studies")) {
        renderInto("case-study-index", projects.map(project => `<li><a href="#${escapeHTML(project.id)}"><small>${escapeHTML(project.verb)}</small>${escapeHTML(project.title)}</a></li>`).join(""));
        renderInto("case-studies", projects.map(caseStudy).join(""));
    }
    updateContactDetails();
    setupNavigation();
    setupContactForm();
    setupImages();
    if (window.location.hash) {
        try { const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" })); }
        catch { /* An invalid fragment must not break the page. */ }
    }
})();
