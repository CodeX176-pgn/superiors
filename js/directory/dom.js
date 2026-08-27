/**
 * ============================================================
 * SUPERIORS — DIRECTORY DOM REFERENCES
 * ============================================================
 *
 * This module contains only the DOM references and the shared
 * screen-reader announcement element used by the student directory.
 *
 * Keeping DOM setup separate means the rendering, searching, and
 * touch-interaction files do not each have to query the same elements.
 *
 * IMPORTANT:
 * The project intentionally uses classic <script> files instead of
 * ES modules, so the small `window.SuperiorsDirectory` namespace is
 * used to share functionality safely between these files.
 * ============================================================
 */

(() => {
    "use strict";

    /**
     * Create the shared namespace if another directory module has
     * already created it, or create it for the first time here.
     */
    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    /**
     * Locate the search field and student-card grid once.
     *
     * These elements exist on index.html. Keeping the references in
     * one place prevents repeated DOM lookups throughout the project.
     */
    const searchInput = document.getElementById("searchInput");
    const studentsGrid = document.getElementById("studentsGrid");

    /**
     * Create an invisible live region for screen readers.
     *
     * The visual interface does not need another result counter, but
     * assistive technology users should still be told when a search
     * changes the number of displayed students.
     */
    const searchResultsAnnouncement = document.createElement("p");
    searchResultsAnnouncement.className = "sr-only";
    searchResultsAnnouncement.setAttribute("role", "status");
    searchResultsAnnouncement.setAttribute("aria-live", "polite");
    searchResultsAnnouncement.setAttribute("aria-atomic", "true");

    /**
     * Insert the announcement immediately before the grid when the
     * grid has a parent element. The guard keeps the script safe if
     * the HTML structure is changed later.
     */
    if (studentsGrid && studentsGrid.parentElement) {
        studentsGrid.parentElement.insertBefore(
            searchResultsAnnouncement,
            studentsGrid
        );
    }

    /**
     * Expose shared directory state to the other directory modules.
     */
    directory.dom = {
        searchInput,
        studentsGrid,
        searchResultsAnnouncement
    };
})();
