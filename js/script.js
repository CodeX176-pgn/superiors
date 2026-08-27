/**
 * ============================================================
 * SUPERIORS — DIRECTORY ENTRY POINT
 * ============================================================
 *
 * Initializes the directory after student data has loaded.
 *
 * Directory responsibilities are handled by focused modules:
 *
 * js/directory/dom.js
 *     DOM references and accessibility announcements.
 *
 * js/directory/helpers.js
 *     Shared helper functions.
 *
 * js/directory/social-links.js
 *     Student social-link generation.
 *
 * js/directory/card.js
 *     Student-card creation and behavior.
 *
 * js/directory/render.js
 *     Sorting, rendering, and empty states.
 *
 * js/directory/search.js
 *     Live student search.
 *
 * js/directory/touch.js
 *     Touchscreen interactions.
 * ============================================================
 */

(async () => {
    "use strict";

    // Make sure the data loader exists.
    if (typeof window.loadStudentData !== "function") {
        console.error(
            "SUPERIORS: data.js was not loaded. Check the script order in index.html."
        );
        return;
    }

    // Load student information from assets/data.json.
    try {
        await window.loadStudentData();
    } catch (error) {
        console.error(
            "SUPERIORS: Student data could not be loaded.",
            error
        );
        return;
    }

    // Get the directory modules after the data has loaded.
    const directory = window.SuperiorsDirectory;

    // Make sure the directory modules are available.
    if (!directory) {
        console.error(
            "SUPERIORS: Directory modules were not loaded. Check the js/directory script order in index.html."
        );
        return;
    }

    const { searchInput } = directory.dom;
    const searchStudents = directory.searchStudents;
    const displayStudents = directory.displayStudents;

    /**
     * Attach live search to the search field.
     *
     * This handles typing, pasting, deleting, and clearing
     * the search field.
     */
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchStudents(searchInput.value);
        });
    }

    // Render the complete directory using the loaded students.
    if (Array.isArray(window.students)) {
        displayStudents(window.students);
    } else {
        console.error(
            "SUPERIORS: Student data is unavailable after loading."
        );
    }

    // Initialize touchscreen card interactions.
    if (directory.touch) {
        directory.touch.initializeTouchInteractions();
    }
})();
