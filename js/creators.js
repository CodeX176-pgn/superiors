/**
 * ============================================================
 * SUPERIORS — PROJECT CREATOR LINKS
 * ============================================================
 *
 * Keeps creator-profile availability separate from the footer HTML.
 *
 * Leslie's GitHub profile is currently unavailable, so the link is
 * intentionally disabled. When the profile becomes available, you
 * only need to change PARTNER_GITHUB_URL below. No HTML editing is
 * required.
 * ============================================================
 */

(() => {
    "use strict";

    /*
     * ========================================================
     * EASY-TO-CHANGE CONFIGURATION
     * ========================================================
     *
     * Leave this value empty while the GitHub profile is unavailable.
     *
     * Later, replace the empty string with the real profile URL, for
     * example:
     *
     *     const PARTNER_GITHUB_URL = "https://github.com/username";
     *
     * The script will automatically turn the disabled footer button
     * into a normal external GitHub link.
     */
    /*
     * Your GitHub profile.
     *
     * Keep your current URL here, or replace it later if your GitHub
     * username ever changes. The creator button in index.html is wired
     * to this value automatically.
     */
    const CREATOR_GITHUB_URL = "https://github.com/codex176-pgn";

    /*
     * Leslie's GitHub profile is currently unavailable.
     *
     * Leave this as an empty string until the account is available.
     * Once Leslie sends the real profile URL, change only this line:
     *
     *     const PARTNER_GITHUB_URL = "https://github.com/username";
     */
    const PARTNER_GITHUB_URL = "";

    const creatorLink = document.getElementById("creatorGithubLink");
    const partnerLink = document.getElementById("partnerGithubLink");

    /**
     * Configure one creator's GitHub button from a single URL value.
     *
     * This keeps the HTML simple and makes future username/profile changes
     * easy: edit the URL at the top of this file instead of editing HTML.
     */
    function configureGithubLink(link, profileUrl, displayName) {
        // Do nothing if this page does not contain the requested button.
        if (!link) {
            return;
        }

        const urlValue = profileUrl.trim();
        const handle = link.querySelector(".creator-handle");

        if (urlValue !== "") {
            // A URL exists, so make the button a normal external GitHub link.
            link.href = urlValue;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.removeAttribute("aria-disabled");
            link.classList.remove("creator-github-link--unavailable");
            link.setAttribute("aria-label", `${displayName} on GitHub`);
            link.setAttribute("title", `${displayName} on GitHub`);

            if (handle) {
                /*
                 * Extract the username from the final URL path so there is
                 * no second username value that could become outdated.
                 */
                try {
                    const url = new URL(urlValue);
                    const username = url.pathname.replace(/^\/+|\/+$/g, "");
                    handle.textContent = username || "GitHub";
                } catch {
                    // Keep a neutral label if an invalid URL is supplied.
                    handle.textContent = "GitHub";
                }
            }

            return;
        }

        /*
         * An empty URL means the profile is unavailable. Remove navigation
         * behavior so clicking the disabled button cannot jump to the top
         * of the page.
         */
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.classList.add("creator-github-link--unavailable");
        link.setAttribute("aria-label", `${displayName}'s GitHub profile is currently unavailable`);
        link.setAttribute("title", `${displayName}'s GitHub profile is currently unavailable`);

        if (handle) {
            handle.textContent = "GitHub unavailable";
        }

        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    }

    // Configure both project creators from the two URL values above.
    configureGithubLink(creatorLink, CREATOR_GITHUB_URL, "CodeX");
    configureGithubLink(partnerLink, PARTNER_GITHUB_URL, "Leslie");
})();
