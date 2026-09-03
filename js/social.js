/**
 * ============================================================
 * SUPERIORS — SHARED SOCIAL-MEDIA HELPERS
 * ============================================================
 *
 * This file centralizes all social-media configuration.
 *
 * Both:
 *
 * - script.js
 * - profile.js
 *
 * can use these functions.
 *
 * This means that adding or changing a platform only requires
 * updating this file instead of modifying multiple JavaScript
 * files.
 *
 * ============================================================
 */


/* ============================================================
   1. SOCIAL ICON NAMES
   ============================================================ */

/**
 * Maps a social-media platform to its Remix Icon CSS class.
 *
 * SUPERIORS uses Remix Icon rather than Lucide.
 *
 * Example:
 *
 *     github → ri-github-fill
 *     tiktok → ri-tiktok-fill
 *     youtube → ri-youtube-fill
 *
 * Documentation:
 * https://remixicon.com/
 */
const SOCIAL_ICON_NAMES = {

    youtube: "ri-youtube-fill",

    tiktok: "ri-tiktok-fill",

    twitter: "ri-twitter-x-fill",

    x: "ri-twitter-x-fill",

    facebook: "ri-facebook-fill",

    github: "ri-github-fill"

};


/* ============================================================
   2. SOCIAL PROFILE URL BUILDERS
   ============================================================ */

/**
 * Creates a profile URL when data.js contains a username
 * rather than a complete URL.
 *
 * Example:
 *
 *     github: "CodeX176-pgn"
 *
 * becomes:
 *
 *     https://github.com/CodeX176-pgn
 *
 * The username is cleaned before being inserted into the URL.
 */
const SOCIAL_URL_BUILDERS = {

    youtube: (username) =>
        `https://youtube.com/@${encodeURIComponent(username)}`,

    tiktok: (username) =>
        `https://tiktok.com/@${encodeURIComponent(username)}`,

    twitter: (username) =>
        `https://twitter.com/${encodeURIComponent(username)}`,

    x: (username) =>
        `https://x.com/${encodeURIComponent(username)}`,

    facebook: (username) =>
        `https://facebook.com/${encodeURIComponent(username)}`,

    github: (username) =>
        `https://github.com/${encodeURIComponent(username)}`

};


/* ============================================================
   3. CHECK FOR MISSING SOCIAL VALUE
   ============================================================ */

/**
 * Determines whether a social-media field contains useful data.
 *
 * The following values are considered missing:
 *
 *     null
 *     undefined
 *     ""
 *     "-"
 *     "--"
 *
 * @param {*} value - Social-media username or URL.
 * @returns {boolean} True if the value should be ignored.
 */
function isMissingSocialValue(value) {

    if (value === null || value === undefined) {
        return true;
    }

    const normalizedValue =
        String(value).trim();

    return (
        normalizedValue === "" ||
        normalizedValue === "-" ||
        normalizedValue === "--"
    );
}


/* ============================================================
   4. BUILD SOCIAL PROFILE URL
   ============================================================ */

/**
 * Converts a social-media username or URL into a usable URL.
 *
 * Supported input formats:
 *
 *     CodeX
 *     @CodeX
 *     https://github.com/CodeX
 *
 * Examples:
 *
 *     getSocialUrl("github", "CodeX")
 *
 *     → https://github.com/CodeX
 *
 *
 *     getSocialUrl("github", "@CodeX")
 *
 *     → https://github.com/CodeX
 *
 *
 *     getSocialUrl(
 *         "github",
 *         "https://github.com/CodeX"
 *     )
 *
 *     → https://github.com/CodeX
 *
 * @param {string} platform - Social-media platform.
 * @param {*} value - Username or URL.
 * @returns {string} Usable profile URL.
 */
function getSocialUrl(platform, value) {

    /* --------------------------------------------------------
       Reject missing values
       -------------------------------------------------------- */

    if (isMissingSocialValue(value)) {
        return "";
    }


    /* --------------------------------------------------------
       Convert value to a clean string
       -------------------------------------------------------- */

    const stringValue =
        String(value).trim();


    /* --------------------------------------------------------
       Existing HTTP/HTTPS URL
       -------------------------------------------------------- */

    /**
     * If data.js already contains a complete URL, don't modify
     * it.
     *
     * Example:
     *
     * https://github.com/example
     */
    if (/^https?:\/\//i.test(stringValue)) {

        return stringValue;
    }


    /* --------------------------------------------------------
       Normalize platform name
       -------------------------------------------------------- */

    const normalizedPlatform =
        String(platform)
            .trim()
            .toLowerCase();


    /* --------------------------------------------------------
       Remove @ from username
       -------------------------------------------------------- */

    const cleanUsername =
        stringValue.replace(/^@/, "").trim();


    /* --------------------------------------------------------
       Prevent empty usernames
       -------------------------------------------------------- */

    if (!cleanUsername) {
        return "";
    }


    /* --------------------------------------------------------
       Find the correct URL builder
       -------------------------------------------------------- */

    const buildUrl =
        SOCIAL_URL_BUILDERS[normalizedPlatform];


    /* --------------------------------------------------------
       Build URL
       -------------------------------------------------------- */

    return buildUrl
        ? buildUrl(cleanUsername)
        : "";
}


/* ============================================================
   5. GET SOCIAL REMIX ICON CLASS
   ============================================================ */

/**
 * Returns the correct Remix Icon class for a platform.
 *
 * Example:
 *
 *     getSocialIconName("github")
 *
 *     → "ri-github-fill"
 *
 * If the platform is not supported, a generic external-link
 * icon is returned instead.
 *
 * @param {string} platform - Social-media platform.
 * @returns {string} Remix Icon CSS class.
 */
function getSocialIconName(platform) {

    const normalizedPlatform =
        String(platform)
            .trim()
            .toLowerCase();


    return (
        SOCIAL_ICON_NAMES[normalizedPlatform] ||
        "ri-external-link-line"
    );
}
