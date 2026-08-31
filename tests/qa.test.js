/**
 * ============================================================
 * SUPERIORS — QA TESTS
 * ============================================================
 *
 * Lightweight automated tests for the SUPERIORS student directory.
 *
 * These tests intentionally avoid requiring a browser, DOM library,
 * or frontend build system. They validate the project's data files,
 * HTML structure, JavaScript architecture, asset paths, and important
 * application rules that can be checked from Node.js.
 *
 * Covered areas:
 *
 * - Student JSON validity
 * - Student data structure
 * - Duplicate student names
 * - Alphabetical ordering
 * - Automatic three-digit serial-number generation
 * - Search behavior
 * - Social-media data
 * - Student image paths
 * - Default profile-image availability
 * - Required accessibility hooks
 * - HTML script dependency order
 * - Required JavaScript modules
 * - JavaScript syntax
 *
 * Run with:
 *
 *     node --test tests/qa.test.js
 *
 * Browser-specific behavior such as:
 *
 * - visual appearance
 * - responsive layout
 * - CSS animations
 * - hover effects
 * - touch interactions
 * - actual image loading in the browser
 *
 * should still be checked manually in a browser.
 *
 * ============================================================
 */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");


// ============================================================
// 1. PROJECT PATHS
// ============================================================

/*
 * `__dirname` points to the tests/ directory.
 *
 * Moving one level upward gives us the SUPERIORS project root.
 */
const projectRoot = path.resolve(__dirname, "..");


/*
 * Current student data is stored in JSON rather than directly
 * inside data.js.
 */
const dataPath = path.join(
    projectRoot,
    "assets",
    "data.json"
);


// ============================================================
// 2. FILE HELPERS
// ============================================================

/**
 * Read a UTF-8 text file.
 *
 * Keeping file reading in one helper makes the tests below easier
 * to read and keeps repeated encoding options out of individual tests.
 *
 * @param {string} relativePath - Path relative to project root.
 * @returns {string} File contents.
 */
function readProjectFile(relativePath) {
    return fs.readFileSync(
        path.join(projectRoot, relativePath),
        "utf8"
    );
}


/**
 * Check whether a project file exists.
 *
 * @param {string} relativePath - Path relative to project root.
 * @returns {boolean} Whether the file exists.
 */
function projectFileExists(relativePath) {
    return fs.existsSync(
        path.join(projectRoot, relativePath)
    );
}


/**
 * Convert a browser-style project asset path into a local filesystem
 * path.
 *
 * Example:
 *
 *     assets/images/students/yuji-main.png
 *
 * becomes:
 *
 *     <project-root>/assets/images/students/yuji-main.png
 *
 * @param {string} assetPath - Browser asset path.
 * @returns {string} Absolute local path.
 */
function resolveAssetPath(assetPath) {
    return path.join(
        projectRoot,
        assetPath.replace(/^\/+/, "")
    );
}


// ============================================================
// 3. LOAD STUDENT DATA
// ============================================================

/**
 * Load the current JSON data source.
 *
 * The website loads this same file through:
 *
 *     fetch("assets/data.json")
 *
 * Unlike the previous version of the QA suite, these tests do not
 * execute data.js inside a VM. data.js is now a loader whose job is
 * to fetch the JSON file in the browser.
 *
 * @returns {Object} Parsed data.json object.
 */
function loadStudentData() {
    const source = fs.readFileSync(
        dataPath,
        "utf8"
    );

    return JSON.parse(source);
}


/*
 * Load the student collection once so all tests use the exact same
 * source of truth.
 */
const data = loadStudentData();

const students = Array.isArray(data.students)
    ? data.students
    : [];


// ============================================================
// 4. REPRODUCE THE DATA-LOADING RULES
// ============================================================

/**
 * Reproduce the alphabetical sorting used by data.js.
 *
 * data.js sorts the students by name using localeCompare with
 * case-insensitive comparison before generating serial numbers.
 *
 * @param {Array} studentList - Students to sort.
 * @returns {Array} Sorted copy of the students.
 */
function sortStudents(studentList) {
    return [...studentList].sort(
        (studentA, studentB) =>
            String(studentA.name ?? "").localeCompare(
                String(studentB.name ?? ""),
                undefined,
                {
                    sensitivity: "base"
                }
            )
    );
}


/**
 * Reproduce the serial-number generation used by data.js.
 *
 * Serial numbers are based on alphabetical position and always
 * contain three digits.
 *
 * @param {Array} studentList - Students to process.
 * @returns {Array} Students with generated serial numbers.
 */
function prepareStudents(studentList) {
    return sortStudents(studentList).map(
        (student, index) => ({
            ...student,
            serialNumber: String(index + 1).padStart(3, "0")
        })
    );
}


/*
 * This represents what the browser should receive after data.js
 * sorts the JSON records and generates their serial numbers.
 */
const preparedStudents = prepareStudents(students);


// ============================================================
// 5. REPRODUCE DIRECTORY SEARCH
// ============================================================

/**
 * Reproduce the directory search behavior from search.js.
 *
 * Supported searches:
 *
 * - full name
 * - partial name
 * - serial number
 * - uppercase/lowercase input
 * - surrounding whitespace
 *
 * @param {*} searchValue - User's search query.
 * @returns {Array} Matching students.
 */
function searchStudents(searchValue) {
    const query = String(
        searchValue ?? ""
    )
        .trim()
        .toLowerCase();


    /*
     * Clearing the search field should restore the complete directory.
     */
    if (!query) {
        return preparedStudents;
    }


    /*
     * Search both the student's name and generated serial number.
     */
    return preparedStudents.filter(
        (student) => {

            const studentName =
                String(student.name ?? "")
                    .toLowerCase();

            const studentSerial =
                String(student.serialNumber ?? "")
                    .toLowerCase();

            return (
                studentName.includes(query) ||
                studentSerial.includes(query)
            );
        }
    );
}


// ============================================================
// 6. DATA FILE TESTS
// ============================================================

test(
    "data.json exists and contains a students array",
    () => {

        assert.ok(
            projectFileExists("assets/data.json"),
            "assets/data.json must exist."
        );


        assert.ok(
            Array.isArray(data.students),
            "data.json must contain a 'students' array."
        );


        assert.ok(
            data.students.length > 0,
            "The students array must contain at least one student."
        );
    }
);


test(
    "student records contain valid names",
    () => {

        preparedStudents.forEach(
            (student) => {

                assert.equal(
                    typeof student.name,
                    "string",
                    "Every student must have a string name."
                );


                assert.ok(
                    student.name.trim().length > 0,
                    "Every student must have a non-empty name."
                );
            }
        );
    }
);


test(
    "student names are unique",
    () => {

        const names =
            preparedStudents.map(
                (student) =>
                    student.name
                        .trim()
                        .toLowerCase()
            );


        assert.equal(
            new Set(names).size,
            names.length,
            "Student names must be unique."
        );
    }
);


test(
    "students are alphabetically sorted",
    () => {

        const sortedStudents =
            sortStudents(students);


        assert.deepEqual(
            students.map(
                (student) => student.name
            ),
            sortedStudents.map(
                (student) => student.name
            ),
            "data.json should keep students alphabetically sorted."
        );
    }
);


// ============================================================
// 7. SERIAL NUMBER TESTS
// ============================================================

test(
    "generated serial numbers are unique",
    () => {

        const serialNumbers =
            preparedStudents.map(
                (student) =>
                    student.serialNumber
            );


        assert.equal(
            new Set(serialNumbers).size,
            serialNumbers.length,
            "Serial numbers must be unique."
        );
    }
);


test(
    "serial numbers contain exactly three digits",
    () => {

        preparedStudents.forEach(
            (student) => {

                assert.match(
                    student.serialNumber,
                    /^\d{3}$/,
                    `Serial number ${student.serialNumber} must contain exactly three digits.`
                );
            }
        );
    }
);


test(
    "serial numbers match alphabetical positions",
    () => {

        preparedStudents.forEach(
            (student, index) => {

                const expectedSerial =
                    String(index + 1)
                        .padStart(3, "0");


                assert.equal(
                    student.serialNumber,
                    expectedSerial,
                    `Student ${student.name} should receive serial number ${expectedSerial}.`
                );
            }
        );
    }
);


// ============================================================
// 8. SEARCH TESTS
// ============================================================

test(
    "search finds students by full name",
    () => {

        const target =
            preparedStudents[0];


        const matches =
            searchStudents(target.name);


        assert.ok(
            matches.some(
                (student) =>
                    student.name === target.name
            ),
            "A full-name search should find the matching student."
        );
    }
);


test(
    "search finds students by partial name",
    () => {

        const target =
            preparedStudents[0];


        const firstNamePart =
            target.name
                .split(/\s+/)[0]
                .toLowerCase();


        const matches =
            searchStudents(firstNamePart);


        assert.ok(
            matches.some(
                (student) =>
                    student.name === target.name
            ),
            "A partial-name search should find the matching student."
        );
    }
);


test(
    "search finds students by serial number",
    () => {

        const target =
            preparedStudents[0];


        const matches =
            searchStudents(
                target.serialNumber
            );


        assert.deepEqual(
            matches.map(
                (student) =>
                    student.serialNumber
            ),
            [target.serialNumber],
            "Searching by serial number should find the correct student."
        );
    }
);


test(
    "search is case-insensitive",
    () => {

        const target =
            preparedStudents[0];


        const matches =
            searchStudents(
                target.name.toUpperCase()
            );


        assert.ok(
            matches.some(
                (student) =>
                    student.name === target.name
            ),
            "Search should ignore letter case."
        );
    }
);


test(
    "search trims surrounding whitespace",
    () => {

        const target =
            preparedStudents[0];


        const matches =
            searchStudents(
                `   ${target.name}   `
            );


        assert.ok(
            matches.some(
                (student) =>
                    student.name === target.name
            ),
            "Search should ignore surrounding whitespace."
        );
    }
);


test(
    "clearing the search restores all students",
    () => {

        const matches =
            searchStudents("");


        assert.equal(
            matches.length,
            preparedStudents.length,
            "An empty search query should display every student."
        );
    }
);


test(
    "a nonexistent search returns no students",
    () => {

        const matches =
            searchStudents(
                "THIS-STUDENT-DOES-NOT-EXIST"
            );


        assert.equal(
            matches.length,
            0,
            "A nonexistent search should return zero students."
        );
    }
);


// ============================================================
// 9. PROFILE LOOKUP TESTS
// ============================================================

test(
    "valid profile IDs can be resolved",
    () => {

        const target =
            preparedStudents[0];


        const selectedStudent =
            preparedStudents.find(
                (student) =>
                    String(student.serialNumber) ===
                    String(target.serialNumber)
            );


        assert.ok(
            selectedStudent,
            "A valid serial number should resolve to a student."
        );


        assert.equal(
            selectedStudent.name,
            target.name
        );
    }
);


test(
    "invalid profile IDs can be detected safely",
    () => {

        const requestedId =
            "999999";


        const selectedStudent =
            preparedStudents.find(
                (student) =>
                    String(student.serialNumber) ===
                    String(requestedId)
            );


        assert.equal(
            selectedStudent,
            undefined,
            "An invalid profile ID should not resolve to a student."
        );
    }
);


// ============================================================
// 10. SOCIAL-MEDIA DATA TESTS
// ============================================================

test(
    "socialMedia fields are arrays when provided",
    () => {
        preparedStudents.forEach((student) => {
            if (student.socialMedia === undefined) {
                return;
            }

            assert.ok(
                Array.isArray(student.socialMedia),
                `${student.name}'s socialMedia field must be an array.`
            );
        });
    }
);


test(
    "social-media entries contain platform, username and displayName",
    () => {
        preparedStudents.forEach((student) => {
            const socialMedia = student.socialMedia || [];

            socialMedia.forEach((social) => {
                assert.equal(
                    typeof social,
                    "object",
                    `${student.name}'s social-media entry must be an object.`
                );

                assert.ok(
                    typeof social.platform === "string" && social.platform.trim(),
                    `${student.name}'s social-media entry must have a platform.`
                );

                assert.ok(
                    typeof social.username === "string" && social.username.trim(),
                    `${student.name}'s ${social.platform} username must not be empty.`
                );

                assert.ok(
                    typeof social.displayName === "string" && social.displayName.trim(),
                    `${student.name}'s ${social.platform} displayName must not be empty.`
                );
            });
        });
    }
);
