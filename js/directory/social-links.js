/**
 * ============================================================
 * SUPERIORS — DIRECTORY SOCIAL LINKS
 * ============================================================
 *
 * Generates the social-media buttons shown underneath a student card.
 *
 * Each social-media entry now has three pieces of information:
 *
 *     {
 *         "platform": "tiktok",
 *         "username": "example_user",
 *         "displayName": "Example Name"
 *     }
 *
 * The important distinction is that the BUTTON uses `username` to
 * build the external profile URL. The profile information table uses
 * `displayName` for what the student calls themselves on that platform.
 * ============================================================
 */

(() => {
    "use strict";

    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    const escapeHTML = directory.helpers.escapeHTML;

    /**
     * Convert one student's social-media list into HTML links.
     *
     * @param {Object} student - Student data object.
     * @returns {string} Social-link HTML, or an empty string.
     */
    function createSocialLinks(student) {
        if (!student || !Array.isArray(student.socialMedia)) {
            return "";
        }

        return student.socialMedia
            .map((social) => {
                // Ignore malformed entries instead of allowing one bad
                // social-media record to break the entire student card.
                if (!social || typeof social !== "object") {
                    return "";
                }

                const platform = String(social.platform || "").trim();
                const username = String(social.username || "").trim();

                // A platform and username are required to create a link.
                if (!platform || isMissingSocialValue(username)) {
                    return "";
                }

                // Build the external profile URL from the username only.
                const url = getSocialUrl(platform, username);

                if (!url) {
                    return "";
                }

                // Resolve the appropriate Remix Icon CSS class.
                const iconName = getSocialIconName(platform);

                // Make the platform name readable for accessibility text.
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
