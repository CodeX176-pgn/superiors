/**
 * ============================================================
 * SUPERIORS — DIRECTORY SEARCH
 * ============================================================
 *
 * Contains only the filtering logic for the student directory.
 *
 * Search supports:
 * - Full names
 * - Partial names
 * - Serial numbers
 * - Case-insensitive matching
 * - Leading/trailing whitespace
 *
 * Rendering is delegated to render.js.
 * ============================================================
 */

(() => {
    "use strict";

    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    const displayStudents = directory.displayStudents;

    /**
     * Filter the global student list and render the matching results.
     *
     * @param {*} searchValue - Current search field value.
     */
    function searchStudents(searchValue) {
        /**
         * Normalize the user's query so "  codex " and "CODEX" behave
         * the same as "codex".
         */
        const query = String(searchValue ?? "")
            .trim()
            .toLowerCase();

        const allStudents = Array.isArray(window.students)
            ? window.students
            : [];

        /**
         * An empty query restores the complete directory.
         */
        if (!query) {
            displayStudents(allStudents);
            return;
        }

        /**
         * Search student name, nickname, and serial number.
         */
        const matchingStudents = allStudents.filter((student) => {
            const studentName =
                String(student.name ?? "").toLowerCase();

            const studentNickname =
                String(student.nickname ?? "").toLowerCase();

            const studentSerial =
                String(student.serialNumber ?? "").toLowerCase();

            return (
                studentName.includes(query) ||
                studentNickname.includes(query) ||
                studentSerial.includes(query)
            );
        });

        displayStudents(matchingStudents);
    }

    directory.searchStudents = searchStudents;
})();
