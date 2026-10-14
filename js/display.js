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

    function mediaFigure(key, extraClass = "", optional = false, story = null) {
        const media = portfolio.media[key];
        if (!media) return "";
        const source = assetURL(media.src);
        const ratios = { portrait: "Portrait · approximately 3:4", landscape: "Landscape · approximately 16:10", wide: "Wide · approximately 16:9", dashboard: "Tall dashboard · original proportions" };
        const placeholder = `<div class="media-placeholder"${source ? " hidden" : ""}><p class="eyebrow">Visual space</p><strong>${escapeHTML(media.role || media.alt)}</strong><small>${escapeHTML(ratios[media.shape])}</small></div>`;
        const image = source ? `<img src="${escapeHTML(source)}" alt="${escapeHTML(media.alt)}" width="${Number(media.width) || 1600}" height="${Number(media.height) || 1000}" loading="lazy" decoding="async">` : "";
        const linkedImage = source && !optional ? `<a class="media-link" href="${escapeHTML(source)}" data-enlarge aria-haspopup="dialog" aria-label="Enlarge: ${escapeHTML(media.alt)}">${image}<span class="zoom-hint" aria-hidden="true">Enlarge ↗</span></a>` : image;
        const overlay = story ? `<div class="community-overlay"><h3>${escapeHTML(story.title)}</h3></div>` : "";
        const caption = story ? `<figcaption><blockquote><p>“${escapeHTML(story.quote)}”</p></blockquote></figcaption>` : media.caption ? `<figcaption>${escapeHTML(media.caption)}</figcaption>` : "";
        return `<figure class="image-figure media-${escapeHTML(media.shape)} ${extraClass}" data-media="${escapeHTML(key)}"${optional ? ' data-optional="true"' : ""}><div class="media-frame">${linkedImage}${placeholder}${overlay}</div>${caption}</figure>`;
    }

    function homeProject(project) {
        const metric = project.homeMetric;
        if (project.type === "flagship") {
            return `<article class="project-card project-flagship project-${escapeHTML(project.id)}" aria-labelledby="card-${escapeHTML(project.id)}">
                <header class="project-heading">
                    <p class="project-kicker"><span class="project-number">${String(project.order).padStart(2, "0")} / ${escapeHTML(project.verb)}</span>${escapeHTML(project.context)}</p>
                    <p class="project-title">${escapeHTML(project.title)}</p>
                    <h3 id="card-${escapeHTML(project.id)}" class="project-headline">${escapeHTML(project.headline)}</h3>
                </header>
                ${metric ? `<p class="project-metric"><strong>${escapeHTML(metric.value)}</strong><small>${escapeHTML(metric.label)}</small></p>` : ""}
                <div class="project-copy"><p class="project-summary">${escapeHTML(project.summary)}</p>${tags(project.tags)}<a class="text-link" href="${projectLink(project)}">${escapeHTML(project.cta)}<span class="visually-hidden">: ${escapeHTML(project.title)}</span> <span aria-hidden="true">↗</span></a></div>
                ${mediaFigure(project.homeImage, "project-visual")}
            </article>`;
        }
        return `<article class="project-card project-${escapeHTML(project.type)} project-${escapeHTML(project.id)}" aria-labelledby="card-${escapeHTML(project.id)}">
            <header class="project-heading"><p class="project-kicker"><span class="project-number">${String(project.order).padStart(2, "0")} / ${escapeHTML(project.verb)}</span>${escapeHTML(project.context)}</p><h3 id="card-${escapeHTML(project.id)}" class="project-title">${escapeHTML(project.title)}</h3><p class="project-headline">${escapeHTML(project.headline)}</p></header>
            ${project.homeImage ? mediaFigure(project.homeImage, "project-visual") : ""}
            <div class="project-copy"><p class="project-summary">${escapeHTML(project.summary)}</p>${project.proof ? `<p class="project-proof">${escapeHTML(project.proof)}</p>` : ""}${tags(project.tags)}<a class="text-link" href="${projectLink(project)}">${escapeHTML(project.cta)}<span class="visually-hidden">: ${escapeHTML(project.title)}</span> <span aria-hidden="true">↗</span></a></div>
            ${metric ? `<p class="project-metric"><strong>${escapeHTML(metric.value)}</strong><small>${escapeHTML(metric.label)}</small></p>` : ""}
        </article>`;
    }

    function logoMark(src, extraClass = "") {
        const url = assetURL(src);
        return `<span class="organization-mark ${extraClass}" aria-hidden="true">${url ? `<img data-logo src="${escapeHTML(url)}" alt="" loading="lazy" decoding="async" width="160" height="64">` : ""}</span>`;
    }

    function externalLink(url, text) {
        const safeURL = assetURL(url);
        if (!safeURL) return escapeHTML(text);
        return `<a href="${escapeHTML(safeURL)}" target="_blank" rel="noopener noreferrer">${escapeHTML(text)} <span aria-hidden="true">↗</span><span class="visually-hidden"> (opens in a new tab)</span></a>`;
    }

    function valuesFlower() {
        // Geometry belongs to presentation; value titles and explanations stay in data.js.
        const petals = [
            { path: "M300 24 C224 12 184 80 200 144 C215 195 266 222 300 252 C334 222 385 195 400 144 C416 80 376 12 300 24 Z", x: 300, y: 127 },
            { path: "M282 278 C249 216 170 151 77 161 C12 167 2 212 16 264 C31 321 64 341 119 328 C188 348 241 318 282 278 Z", x: 129, y: 244 },
            { path: "M318 278 C351 216 430 151 523 161 C588 167 598 212 584 264 C569 321 536 341 481 328 C412 348 359 318 318 278 Z", x: 471, y: 244 },
            { path: "M281 307 C214 291 143 312 94 400 C58 476 68 516 127 527 C199 546 273 487 298 361 Z", x: 179, y: 438 },
            { path: "M319 307 C386 291 457 312 506 400 C542 476 532 516 473 527 C401 546 327 487 302 361 Z", x: 421, y: 438 }
        ];
        return `<svg class="orchid-values" viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" role="group" aria-labelledby="orchid-title" aria-describedby="orchid-description">
            <title id="orchid-title">Five principles that guide my work</title>
            <desc id="orchid-description">Each orchid petal is a button. Select it, or use Tab and Enter or Space, to read a principle. Escape closes the explanation.</desc>
            ${portfolio.principles.map((principle, index) => {
                const petal = petals[index];
                const lines = [];
                for (const word of principle.title.split(" ")) {
                    const last = lines.length - 1;
                    if (last >= 0 && (lines[last] + " " + word).length <= 12) lines[last] += " " + word;
                    else lines.push(word);
                }
                const labelY = petal.y - ((lines.length - 1) * 33) / 2;
                return `<g class="orchid-petal" role="button" tabindex="0" aria-label="${escapeHTML(principle.title)}" aria-haspopup="dialog" aria-controls="values-dialog" aria-expanded="false" data-principle="${index}">
                    <path d="${petal.path}" />
                    <text x="${petal.x}" y="${labelY}" text-anchor="middle" aria-hidden="true">${lines.map((line, i) => `<tspan x="${petal.x}" dy="${i ? 33 : 0}">${escapeHTML(line)}</tspan>`).join("")}</text>
                </g>`;
            }).join("")}
            <g class="orchid-core" aria-hidden="true"><path d="M266 255 C250 227 271 211 300 240 C329 211 350 227 334 255 C350 286 331 318 300 345 C269 318 250 286 266 255 Z"/><path class="orchid-lip" d="M269 305 Q300 283 331 305 Q323 341 300 355 Q277 341 269 305 Z"/><path class="orchid-vein" d="M300 260 L300 290"/></g>
        </svg>
        <dialog id="values-dialog" class="orchid-popup" aria-labelledby="values-dialog-title" aria-describedby="values-dialog-text">
            <button class="orchid-close" type="button" autofocus aria-label="Close principle explanation">Close <span aria-hidden="true">×</span></button>
            <h3 id="values-dialog-title"></h3><p id="values-dialog-text"></p>
        </dialog>
        <ul class="values-print" aria-hidden="true">${portfolio.principles.map(principle => `<li><h3>${escapeHTML(principle.title)}</h3><p>${escapeHTML(principle.text)}</p></li>`).join("")}</ul>`;
    }

    function renderBackground() {
        renderInto("about-portrait", mediaFigure(portfolio.about.portrait, "portrait", true));
        renderInto("about-content", paragraphs(portfolio.about.paragraphs));
        renderInto("community-content", `<h2 id="community-title">${escapeHTML(portfolio.about.community.text)}</h2><div class="community-images">${portfolio.about.community.stories.map(story => mediaFigure(story.image, "community-figure", false, story)).join("")}</div>`);
        renderInto("development-definition", escapeHTML(portfolio.developmentEngineering));
        renderInto("principles-list", valuesFlower());
        renderInto("skills-list", portfolio.skills.map(group => `<section class="skill-group"><h3>${escapeHTML(group.title)}</h3><ul>${group.items.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>`).join(""));
        renderInto("research-list", portfolio.research.items.map(item => `<article><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p></article>`).join(""));
        document.querySelectorAll("[data-research-label]").forEach(element => { element.textContent = portfolio.research.label; });
        renderInto("education-list", portfolio.education.map(item => `<article>
            ${logoMark(item.logo, "institution-mark" + (item.logoBackground === "dark" ? " mark-on-dark" : ""))}
            <h3>${escapeHTML(item.institution)}</h3>
            ${item.programs ? `<ul class="program-links">${item.programs.map(program => `<li>${externalLink(program.url, program.name)}</li>`).join("")}</ul>` : `<p>${escapeHTML(item.degree)}</p>`}
            ${item.dates ? `<p class="muted">${escapeHTML(item.dates)}</p>` : ""}${item.detail ? `<p class="muted">${escapeHTML(item.detail)}</p>` : ""}
        </article>`).join(""));
        renderInto("experience-list", portfolio.experience.map(item => `<li>
            <div class="organization-identity">${logoMark(item.logo)}<h4>${externalLink(item.url, item.organization)}</h4></div>
            <p>${escapeHTML(item.role)}</p>
            <a class="text-link" href="${document.body.dataset.siteBase || ""}projects.html#${encodeURIComponent(item.projectId)}">Related work<span class="visually-hidden">: ${escapeHTML(item.organization)}</span> <span aria-hidden="true">↗</span></a>
        </li>`).join(""));
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
    function caseStudy(project, index, projects) {
        const study = project.caseStudy;
        const next = projects[index + 1];
        const miniCases = study.miniCases ? `<section class="case-section case-wide"><h3>Three institutional contexts</h3><div class="mini-cases">${study.miniCases.map(item => `<article class="mini-case"><div><p class="eyebrow">${escapeHTML(item.label)}</p><h4>${escapeHTML(item.title)}</h4><p>${escapeHTML(item.text)}</p></div><div class="mini-media">${(item.images || []).map(key => mediaFigure(key)).join("")}</div></article>`).join("")}</div></section>` : "";
        return `<article id="${escapeHTML(project.id)}" class="case-study case-${escapeHTML(project.id)}" aria-labelledby="case-${escapeHTML(project.id)}">
            <div class="case-opening${project.homeImage && project.id !== "sun-works" ? " has-lead-image" : ""}">
                <header class="case-header"><span class="chapter-number" aria-hidden="true">${String(project.order).padStart(2, "0")}</span><p class="eyebrow">${escapeHTML(project.verb)} · ${escapeHTML(project.label)}</p><h2 id="case-${escapeHTML(project.id)}">${escapeHTML(project.title)}</h2><p class="case-headline">${escapeHTML(project.headline)}</p>${tags(project.tags)}</header>
                ${project.homeImage && project.id !== "sun-works" ? mediaFigure(project.homeImage, "case-lead-image") : ""}
            </div>
            <div class="case-grid">${(study.sections || []).map(section => caseSection(section)).join("")}${concentrationFigure(study.chart, project.id)}${miniCases}${(study.processes || []).map(processFigure).join("")}${caseGallery(project)}
                ${study.principle ? `<aside class="case-principle case-wide" aria-label="Product experience"><p>${escapeHTML(study.principle)}</p></aside>` : ""}
                ${study.validation ? caseSection({ title: "Validation & iteration", ...study.validation }, true) : ""}${study.relevance ? caseSection(study.relevance, true) : ""}
                ${study.futureImage ? mediaFigure(study.futureImage, "case-wide future-visual") : ""}
                ${study.tools ? `<details class="tools-disclosure case-wide"><summary>${escapeHTML(study.toolsLabel)}</summary>${tags(study.tools)}</details>` : ""}
            </div><footer class="case-footer"><a class="back-link" href="#case-studies-top">Back to index <span aria-hidden="true">↑</span></a>${next ? `<a class="text-link" href="#${escapeHTML(next.id)}">Next: ${escapeHTML(next.title)} <span aria-hidden="true">→</span></a>` : `<a class="text-link" href="index.html#contact">Continue the conversation <span aria-hidden="true">↗</span></a>`}</footer>
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

    function setupValuesFlower() {
        const dialog = document.getElementById("values-dialog");
        if (!dialog) return;
        const wrap = document.getElementById("principles-list");
        if (typeof dialog.showModal !== "function") {
            wrap.querySelector("svg").setAttribute("hidden", "");
            const list = wrap.querySelector(".values-print");
            list.classList.add("values-fallback");
            list.removeAttribute("aria-hidden");
            document.getElementById("values-hint").hidden = true;
            return;
        }
        const petals = wrap.querySelectorAll("[data-principle]");
        let opener = null;
        function openPrinciple(petal) {
            const principle = portfolio.principles[Number(petal.dataset.principle)];
            if (!principle || dialog.open) return;
            opener = petal;
            dialog.querySelector("h3").textContent = principle.title;
            dialog.querySelector("p").textContent = principle.text;
            petal.setAttribute("aria-expanded", "true");
            dialog.showModal();
            document.body.classList.add("orchid-dialog-open");
        }
        petals.forEach(petal => {
            petal.addEventListener("click", () => openPrinciple(petal));
            petal.addEventListener("keydown", event => {
                if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
                    event.preventDefault();
                    openPrinciple(petal);
                }
            });
        });
        dialog.querySelector("button").addEventListener("click", () => dialog.close());
        dialog.addEventListener("keydown", event => {
            if (event.key !== "Tab") return;
            const controls = [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')];
            if (!controls.length) return;
            event.preventDefault();
            const current = controls.indexOf(document.activeElement);
            const next = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
            controls[next].focus();
        });
        dialog.addEventListener("click", event => {
            const rect = dialog.getBoundingClientRect();
            if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
        });
        // Native dialog supplies Escape and focus containment. Return to the chosen petal.
        dialog.addEventListener("close", () => {
            document.body.classList.remove("orchid-dialog-open");
            opener?.setAttribute("aria-expanded", "false");
            opener?.focus({ preventScroll: true });
        });
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
        document.querySelectorAll("img[data-logo]").forEach(image => {
            // Keep the reserved space if a logo is replaced or unavailable.
            const hideLogo = () => { image.hidden = true; };
            image.addEventListener("error", hideLogo);
            if (image.complete && image.naturalWidth === 0) hideLogo();
        });
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
        renderInto("project-directory", projects.map(project => `<li><a href="#${escapeHTML(project.id)}"><span class="directory-number">${String(project.order).padStart(2, "0")}</span><span class="directory-title">${escapeHTML(project.title)}</span><span class="directory-verb">${escapeHTML(project.verb)} <span aria-hidden="true">↗</span></span></a></li>`).join(""));
        renderInto("case-study-index", projects.map(project => `<li><a href="#${escapeHTML(project.id)}"><small>${escapeHTML(project.verb)}</small>${escapeHTML(project.title)}</a></li>`).join(""));
        renderInto("case-studies", projects.map(caseStudy).join(""));
    }
    updateContactDetails();
    setupNavigation();
    setupValuesFlower();
    setupContactForm();
    setupImages();
    if (window.location.hash) {
        try { const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" })); }
        catch { /* An invalid fragment must not break the page. */ }
    }
})();
