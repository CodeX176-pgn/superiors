/**
 * ============================================================
 * SUPERIORS — DIRECTORY RENDERING
 * ============================================================
 *
 * Responsible for taking a student array and rendering it into the
 * directory grid.
 *
 * This module owns:
 * - Alphabetical sorting
 * - Screen-reader result announcements
 * - Empty/no-results state
 * - Card insertion and animation indexes
 *
 * It does NOT handle search input itself; search.js decides which
 * students should be passed to displayStudents().
 * ============================================================
 */

(() => {
    "use strict";

    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    const { studentsGrid, searchResultsAnnouncement } = directory.dom;
    const createStudentCard = directory.createStudentCard;

    /**
     * Render a supplied list of students.
     *
     * Results are sorted alphabetically every time so filtered results
     * keep the same ordering as the full directory.
     *
     * @param {Array} studentsList - Students to render.
     */
    function displayStudents(studentsList) {
        if (!studentsGrid) {
            return;
        }

        /**
         * Clear the existing cards before rendering the new result set.
         */
        studentsGrid.innerHTML = "";

        /**
         * Copy before sorting so the original data.js array is never
         * modified accidentally by a search/render operation.
         */
        const sortedStudents = [...studentsList].sort((a, b) => {
            const nameA = String(a.name ?? "");
            const nameB = String(b.name ?? "");

            return nameA.localeCompare(
                nameB,
                undefined,
                { sensitivity: "base" }
            );
        });

        /**
         * Announce the new result count to assistive technology users.
         */
        if (searchResultsAnnouncement) {
            searchResultsAnnouncement.textContent =
                sortedStudents.length === 0
                    ? "No matching students found."
                    : `${sortedStudents.length} student${
                        sortedStudents.length === 1 ? "" : "s"
                    } displayed.`;
        }

        /**
         * Show a dedicated empty state when the search returns nothing.
         */
        if (sortedStudents.length === 0) {
            studentsGrid.innerHTML = `
                <div
                    class="no-results"
                    role="region"
                    aria-labelledby="no-results-title"
                >
                    <div
                        class="no-results-icon"
                        aria-hidden="true"
                    >
                        <i class="ri-search-eye-line"></i>
                    </div>

                    <h2
                        class="no-results-title"
                        id="no-results-title"
                    >
                        No matching students found
                    </h2>

                    <p class="no-results-subtitle">
                        We couldn't find any student matching your
                        search query. Try checking the spelling or
                        searching by full name or serial number.
                    </p>
                </div>
            `;

            return;
        }

        /**
         * Build and append each card. The index is exposed to CSS so
         * card entrance animations can be staggered naturally.
         */
        sortedStudents.forEach((student, index) => {
            const card = createStudentCard(student);

            card.style.setProperty("--card-index", index);
            studentsGrid.appendChild(card);
        });
    }

    directory.displayStudents = displayStudents;
})();
