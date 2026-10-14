# Alejandro Rodríguez — personal portfolio

The production website is `index.html` and `projects.html` at the repository root. Open the root `index.html` with VS Code Live Server, or directly in a browser. This static site uses HTML, CSS, and vanilla JavaScript, with no build step or package installation. GitHub Pages should publish the repository root through its existing deployment workflow.

## Where to edit

| File | Purpose |
| --- | --- |
| `js/data.js` | Biography, projects, case studies, principles, volunteering quotes, research interests, education, skills, contact details, and image metadata |
| `js/display.js` | Rendering, orchid interaction, mobile navigation, image fallback/viewer, and email draft form |
| `index.html` | Homepage structure, headings, fallback hero/contact content, and form |
| `projects.html` | Case-study page structure |
| `css/base.css` | Palette, Satoshi, reset, typography, and accessibility defaults |
| `css/layout.css` | Section spacing and mobile-first layouts |
| `css/components.css` | Project compositions, figures, navigation, disclosures, and form |
| `css/responsive.css` | Desktop arrangements, mobile navigation, reduced motion, and print |
| `style.css` | Compatibility wrapper importing the four CSS files; HTML links them directly |
| `assets/` | Existing photographs, project images, and CV; originals are preserved |

Both pages load `data.js` before `display.js` with `defer`. Edit text in `portfolio`, preserving project IDs used by deep links. Project summaries stay on the homepage; details belong in `caseStudy`. Image paths and descriptions live in `portfolio.media`. Text is escaped before rendering. Detailed content requires JavaScript; fallback contact and CV links remain available without it.

Keep HTML fallback hero/contact copy aligned with `portfolio.owner` and `portfolio.hero` when changing it. Satoshi variable normal/italic loads from Fontshare's CDN, with system-font fallbacks offline. There is no external font script or build dependency.

## Page order and navigation

The homepage runs: Hero → About → Work (selected projects, then employers) → Background (education, a brief Development Engineering explanation, volunteering, principles, research interests, methods) → Contact.

The main menu is About, Work, Background, Projects, Contact. Background links to `#background`, beginning at education; its secondary links reach education, volunteering, values, research, and methods. Work links to `#work`; `#experience` remains available for the employer subsection. The filled Projects link opens `projects.html`, whose menu links back to the correct homepage sections. Scroll-based active-section highlighting is still deferred.

Organization URLs and logos live in `portfolio.experience`. University logos and program URLs live in `portfolio.education`. Local logo files and official source links are documented in `assets/logos/README.md`.

## Visual asset map

All image paths below are relative to `assets/images/`. Preserve the actual extensions: supplied files mix JPG, JPEG, and PNG.

| Asset | Placement and role |
| --- | --- |
| `portrait.jpg` | Large portrait beside About; also the Human / Global comparison hero |
| `agrored-platform.png` | Half-width homepage flagship image beside the description; opening AgroRed case-study image |
| `agrored-network.png` | Wide case-study view of potential relationships |
| `agrored-platform-map.png` | AgroRed case-study geographic context |
| `agrored-system.png` | AgroRed case-study stakeholder/system map |
| `greenlining-key-finding.jpg` | Homepage and case-study lead chart: insurer participation, 1997–2020 |
| `greenlining-data.jpg` | Case-study public reporting portal |
| `greenlining-context.jpeg` | Case-study Capitol group photograph, without a visible caption |
| `oportunidad-bioeconomy1.jpg`, `oportunidad-bioeconomy2.jpeg` | Document and workshop thumbnails in the consulting mini-case only |
| `oportunidad-invima.jpg` | Compact INVIMA document thumbnail in its mini-case |
| `oportunidad-icc.jpg` | Wider ICC strategy image, with full-size viewing |
| `ny-sun-works-dashboard2.jpg` | Homepage dashboard excerpt |
| `ny-sun-works-dashboard1.jpg`, `ny-sun-works-dashboard2.jpg`, `ny-sun-works-dashboard3.jpg` | Three case-study excerpts; open any to inspect the complete screenshot |
| `ny-sun-works-context.jpg` | Case-study educational/program context |
| `community-01.jpg`, `community-02.jpg` | Community context immediately before What guides my work, separate from professional project evidence |
| `association-house-process.jpg` (future) | Optional case-study process visual; set `media.associationProcess.src` when available |

Media records contain `src`, `alt`, `caption`, `shape`, `role`, and real image `width`/`height`. Update dimensions when replacing an image to reserve space before loading. Landscape evidence works well near 16:10; wide diagrams near 16:9; portraits near 3:4. Dashboards retain original proportions in the viewer.

Missing project images become styled placeholders explaining role and orientation. A missing portrait is omitted. Set `src: null` for a future slot. Dense images open in a native dialog with original-size zoom and a direct image link.

AgroRed, Greenlining, NY Sun Works, and Association House processes are accessible ordered lists styled with CSS. The Greenlining concentration finding is separate from the supplied participation chart.

## Content and evidence notes

- AgroRed uses **804 initiatives** throughout production, as confirmed in the latest content iteration. The metric sits beside the flagship headline.
- AgroRed remains in development. `caseStudy.validation` is `null`; add documented stakeholder feedback when available.
- Greenlining concentration refers to analyzed investment volume, not verified California benefit. NY Sun Works organizational reach and Association House operational scope are not presented as attributable impact.
- About uses the four supplied paragraphs. The Development Engineering explanation follows education in a smaller style. Volunteering introduces the principles; methods are always visible.

## Volunteering, values, and research

`portfolio.about.community.stories` stores each existing photo's media key, subtitle, and formative quote. The subtitles are real HTML over the photographs; quotes are semantic blockquotes in their figure captions. CSS controls the overlay treatment. Image files and meaningful alt text remain unchanged, and the full-size viewer still works.

`portfolio.principles` remains the source for the five value names and explanations. `valuesFlower()` in `js/display.js` renders the orchid SVG, wraps the labels, and adds a labelled native dialog. Each petal is exposed as a button and supports click, Enter, and Space. Tab stays within the popup; Close, Escape, or a backdrop click dismisses it and returns focus to the selected petal. There are visible focus styles and a text-only fallback for browsers without native dialog support. Printed pages include all five explanations.

`portfolio.research` holds two supporting items under **Research Interests**. The label **Current academic interests & work** distinguishes them from completed publications or professional projects. The section follows values and precedes methods; it is not part of the Selected Work project list.

## Editorial overlaps to consider later

These overlaps were identified but left unchanged, as requested:

- **Hero ↔ About paragraphs 1–2:** data, technology, systems thinking, and complex development challenges appear in both the positioning statement and personal explanation.
- **About paragraph 2 ↔ Technology in Service of People ↔ AgroRed:** technology as a useful means appears in the biography, decision principle, and practitioner-oriented project description.
- **About paragraph 3 ↔ Human Dignity & Pluralism:** opportunities, community knowledge, voice, and self-determination carry a shared idea.
- **About paragraphs 2 and 4 ↔ Systems Over Symptoms:** root causes and systems change recur in the professional interests and principle.
- **Hero ↔ Evidence + Judgment ↔ Greenlining:** evidence for decisions recurs as positioning, a working principle, and a concrete research example.
- **Capacity, Not Dependency ↔ New York Sun Works:** sustainable use appears in the principle and the reporting project's headline. This is a useful promise-and-proof connection.
- **About paragraph 1 ↔ Education:** the Berkeley degree and AI/Data Analytics focus appear in both the narrative and credentials.

Project examples often demonstrate a principle rather than merely repeat it. Any future trimming can preserve that distinction.

## Contact and CV

The CV points to `assets/CVAlejandroRodriguezHernandez09072026.pdf`. Email and LinkedIn retain their original destinations.

The form preserves `action="#" method="post"`. GitHub Pages does not process submissions. JavaScript validates fields and prepares a `mailto:` draft; the visitor opens, reviews, and sends it in an email application. The website does not send or store messages. Editing a field clears an earlier draft. Direct email remains available.

## Original visual explorations

Open **`.portfolio-preview/directions/index.html`** with Live Server. These are focused Hero + AgroRed explorations:

- **A — Editorial Research:** Sentient; spacious typography and asymmetrical image placement.
- **B — Systems / Data Editorial:** Cabinet Grotesk; restrained connecting lines and stronger metric placement.
- **C — Human / Global:** Satoshi; the portrait participates in the opening composition.

These pages are archived composition studies from the previous iteration. Production now adopts **C's Satoshi and human/global language**, keeps the portrait in About, and combines a half-width flagship screenshot with B's headline-adjacent metric. The archived studies retain their original content and are not synchronized with production.

The `.portfolio-preview/` snapshot reuses root assets. Production does **not** import anything from preview or checks folders. Dot-prefixed development folders may be excluded by GitHub Pages/Jekyll; compare locally with Live Server.

## Verification and publishing

Run `node .portfolio-checks/verify-source.cjs .` from the repository root for dependency-free source, rendered-template, content, and local-link checks. This does not launch a browser or verify visual layout.

The focused October iteration is checked at 320, 375, 720, 721, 1024, and 1440 pixels. Verification covers source/template links, overflow, images, Satoshi loading, mobile navigation, all five orchid buttons, focus containment/restoration, accessible button names, printed values, visible methods, image zoom, email draft preparation/reset, project deep links, and direct `file:` preview. Desktop and mobile screenshots are reviewed separately. Browser checks are development-only and are not dependencies of the public site.

The original root HTML/CSS backup is retained locally under `.portfolio-checks/backups/` and ignored by Git. Existing assets, `.vscode/`, `old index.md`, and `projects.md` are preserved. Applying this update does not commit or push it.
