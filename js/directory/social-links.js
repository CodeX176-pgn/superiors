/**
 * ============================================================
 * SUPERIORS — DIRECTORY SOCIAL LINKS
 * ============================================================
 *
 * Generates the social-media buttons shown underneath a student card.
 *
 * Platform-specific URL and icon rules remain in the shared social.js
 * file. This module only turns those rules into card markup.
 *
 * Unsupported platforms are ignored by the shared social helpers, so
 * this module only renders links that resolve to valid destinations.
 * ============================================================
 */

(() => {
    "use strict";

    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    const escapeHTML = directory.helpers.escapeHTML;

    /**
     * Convert one student's social-media object into HTML links.
     *
     * @param {Object} student - Student data object.
     * @returns {string} Social-link HTML, or an empty string.
     */
    function createSocialLinks(student) {
        if (!student || !student.socialMedia) {
            return "";
        }

        return Object.entries(student.socialMedia)
            .map(([platform, username]) => {
                /**
                 * Ignore empty or placeholder values such as "-" and
                 * "--". The shared helper comes from social.js.
                 */
                if (isMissingSocialValue(username)) {
                    return "";
                }

                /**
                 * Convert either a username or a complete URL into a
                 * usable profile URL using the shared social helper.
                 */
                const url = getSocialUrl(platform, username);

                if (!url) {
                    return "";
                }

                /**
                 * Resolve the appropriate Remix Icon CSS class.
                 */
                const iconName = getSocialIconName(platform);

                /**
                 * Turn the raw platform key into a readable label.
                 * Example: "github" becomes "Github".
                 */
                const readablePlatform =
                    String(platform).charAt(0).toUpperCase() +
                    String(platform).slice(1).toLowerCase();

                return `
                    <a
                        class="social-link"
                        href="${escapeHTML(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="${escapeHTML(readablePlatform)} profile for ${escapeHTML(student.name)}"
                        title="${escapeHTML(readablePlatform)} profile for ${escapeHTML(student.name)}"
                    >
                        <i
                            class="${escapeHTML(iconName)}"
                            aria-hidden="true"
                        ></i>
                    </a>
                `;
            })
            .join("");
    }

    directory.createSocialLinks = createSocialLinks;
})();
