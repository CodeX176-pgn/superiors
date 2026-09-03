/**
 * ============================================================
 * SUPERIORS — STUDENT DATA LOADER
 * ============================================================
 *
 * Loads student information from assets/data.json.
 * Student data is kept in JSON so it can be edited without
 * changing the JavaScript application logic.
 * ============================================================
 */

(() => {
    "use strict";

    // Path to the student data file.
    const DATA_URL = "assets/data.json";

    /**
     * Loads and prepares the student data.
     *
     * @returns {Promise<Array>} The loaded student array.
     */
    async function loadStudentData() {
        try {
            // Request the JSON file.
            const response = await fetch(DATA_URL);

            // Handle HTTP errors such as a missing data.json.
            if (!response.ok) {
                throw new Error(
                    `Failed to load data.json: ${response.status} ${response.statusText}`
                );
            }

            // Convert the response into a JavaScript object.
            const data = await response.json();

            // Validate the expected JSON structure.
            if (!data || !Array.isArray(data.students)) {
                throw new Error(
                    "Invalid data.json: 'students' must be an array."
                );
            }

            // Sort students alphabetically by full name.
            data.students.sort((studentA, studentB) => {
                return String(studentA.name ?? "").localeCompare(
                    String(studentB.name ?? ""),
                    undefined,
                    { sensitivity: "base" }
                );
            });

            // Generate serial numbers from the sorted positions.
            data.students.forEach((student, index) => {
                student.serialNumber = String(index + 1).padStart(3, "0");
            });

            // Expose the processed data globally for the existing
            // non-module directory scripts.
            window.students = data.students;

            return data.students;
        } catch (error) {
            console.error("SUPERIORS: Failed to load student data.", error);
            throw error;
        }
    }

    // Expose the loader globally so script.js can initialize
    // the directory after the JSON file has loaded.
    window.loadStudentData = loadStudentData;
})();
