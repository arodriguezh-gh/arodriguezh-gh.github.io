/* Theme preference runs before styles to prevent a light flash on dark visits. */
(() => {
    "use strict";
    const root = document.documentElement;
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const key = "portfolio-theme";

    function savedTheme() {
        try {
            const value = localStorage.getItem(key);
            return value === "dark" || value === "light" ? value : null;
        } catch { return null; }
    }
    let explicitChoice = savedTheme();
    function applyTheme(theme) {
        root.dataset.theme = theme;
        const button = document.querySelector(".theme-toggle");
        if (button) {
            button.setAttribute("aria-pressed", String(theme === "dark"));
        }
        const browserColor = document.querySelector('meta[name="theme-color"]');
        if (browserColor) browserColor.content = theme === "dark" ? "#121f22" : "#163A43";
    }

    applyTheme(explicitChoice || (system.matches ? "dark" : "light"));
    system.addEventListener("change", () => {
        if (!explicitChoice) applyTheme(system.matches ? "dark" : "light");
    });
    document.addEventListener("DOMContentLoaded", () => {
        const button = document.querySelector(".theme-toggle");
        if (!button) return;
        applyTheme(root.dataset.theme);
        button.hidden = false;
        button.addEventListener("click", () => {
            const next = root.dataset.theme === "dark" ? "light" : "dark";
            explicitChoice = next;
            try { localStorage.setItem(key, next); } catch { /* Private or local-file contexts may block storage. */ }
            applyTheme(next);
        });
    });
})();
