/**
 * ============================================================
 * SUPERIORS — DIRECTORY HELPERS
 * ============================================================
 *
 * Small reusable functions used by the student-card renderer.
 *
 * Functions kept here:
 * - escapeHTML()
 * - handleImageError()
 *
 * These helpers do not render cards or attach events. That keeps the
 * more complex directory files focused on one responsibility each.
 * ============================================================
 */

(() => {
    "use strict";

    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    /**
     * Escape text before inserting student data into HTML.
     *
     * Student values normally come from data.js. Escaping is still
     * important because it prevents characters such as <, >, &, and
     * quotes from accidentally becoming HTML when a template string
     * is used to build a card.
     *
     * @param {*} value - Value that should be safely inserted.
     * @returns {string} HTML-safe text.
     */
    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Handle a missing student image.
     *
     * The CSS can use the `student-image-missing` class to display a
     * graceful fallback instead of leaving a broken-image indicator.
     * Removing src also prevents the browser from repeatedly retrying
     * an invalid local image path.
     *
     * @param {HTMLImageElement|null} image - Image that failed.
     */
    function handleImageError(image) {
        if (!image) {
            return;
        }

        image.classList.add("student-image-missing");
        image.removeAttribute("src");
    }

    /**
     * Make the helper functions available to the other directory files.
     */
    directory.helpers = {
        escapeHTML,
        handleImageError
    };
})();
