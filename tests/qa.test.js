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
    "socialMedia fields are objects when provided",
    () => {

        preparedStudents.forEach(
            (student) => {

                if (
                    student.socialMedia ===
                    undefined
                ) {
                    return;
                }


                assert.equal(
                    typeof student.socialMedia,
                    "object",
                    `${student.name}'s socialMedia field must be an object.`
                );


                assert.ok(
                    !Array.isArray(
                        student.socialMedia
                    ),
                    `${student.name}'s socialMedia field must not be an array.`
                );
            }
        );
    }
);


test(
    "social-media usernames are non-empty when provided",
    () => {

        preparedStudents.forEach(
            (student) => {

                const socialMedia =
                    student.socialMedia || {};


                Object.entries(
                    socialMedia
                ).forEach(
                    ([platform, value]) => {

                        assert.equal(
                            typeof value,
                            "string",
                            `${student.name}'s ${platform} social value must be a string.`
                        );


                        assert.ok(
                            value.trim().length > 0,
                            `${student.name}'s ${platform} social value must not be empty.`
                        );
                    }
                );
            }
        );
    }
);


// ============================================================
// 11. IMAGE / ASSET TESTS
// ============================================================

test(
    "student image paths point into the assets directory",
    () => {

        preparedStudents.forEach(
            (student) => {

                if (
                    student.image !==
                    undefined
                ) {

                    assert.match(
                        student.image,
                        /^assets\/images\//,
                        `${student.name}'s image must use an assets/images path.`
                    );
                }


                if (
                    student.hoverImage !==
                    undefined
                ) {

                    assert.match(
                        student.hoverImage,
                        /^assets\/images\//,
                        `${student.name}'s hoverImage must use an assets/images path.`
                    );
                }
            }
        );
    }
);


test(
    "referenced student images exist",
    () => {

        preparedStudents.forEach(
            (student) => {

                [
                    "image",
                    "hoverImage"
                ].forEach(
                    (field) => {

                        const imagePath =
                            student[field];


                        /*
                         * A student may intentionally omit an image.
                         * In that case the application's default
                         * no_profile.png image is used.
                         */
                        if (
                            !imagePath
                        ) {
                            return;
                        }


                        assert.ok(
                            fs.existsSync(
                                resolveAssetPath(
                                    imagePath
                                )
                            ),
                            `${student.name}'s ${field} file does not exist: ${imagePath}`
                        );
                    }
                );
            }
        );
    }
);


test(
    "default student profile image exists",
    () => {

        assert.ok(
            projectFileExists(
                "assets/images/students/no_profile.png"
            ),
            "The default no_profile.png image must exist."
        );
    }
);


// ============================================================
// 12. INDEX.HTML ACCESSIBILITY TESTS
// ============================================================

test(
    "index page contains required accessibility hooks",
    () => {

        const html =
            readProjectFile(
                "index.html"
            );


        assert.match(
            html,
            /class="skip-link"/,
            "index.html should contain a skip link."
        );


        assert.match(
            html,
            /id="main-content"/,
            "index.html should contain the main-content target."
        );


        assert.match(
            html,
            /id="searchInput"/,
            "index.html should contain the search input."
        );


        assert.match(
            html,
            /aria-describedby="searchHelp"/,
            "The search field should reference its accessibility help text."
        );


        assert.match(
            html,
            /id="searchHelp"/,
            "index.html should contain search instructions."
        );


        assert.match(
            html,
            /class="students-grid"/,
            "index.html should contain the student grid."
        );
    }
);


// ============================================================
// 13. PROFILE.HTML ACCESSIBILITY TESTS
// ============================================================

test(
    "profile page contains required accessibility hooks",
    () => {

        const html =
            readProjectFile(
                "profile.html"
            );


        assert.match(
            html,
            /class="skip-link"/,
            "profile.html should contain a skip link."
        );


        assert.match(
            html,
            /id="profileContent"/,
            "profile.html should contain the profile content target."
        );


        assert.match(
            html,
            /id="backButton"/,
            "profile.html should contain the back button."
        );


        assert.match(
            html,
            /aria-label="Go back to student list"/,
            "The back button should have an accessible label."
        );


        assert.match(
            html,
            /id="profileImage"/,
            "profile.html should contain the profile image."
        );


        assert.match(
            html,
            /id="profileInformationBody"/,
            "profile.html should contain the dynamic information table body."
        );


        assert.match(
            html,
            /id="profileSocials"/,
            "profile.html should contain the dynamic social-links container."
        );
    }
);


// ============================================================
// 14. HTML SCRIPT DEPENDENCY ORDER
// ============================================================

test(
    "index scripts load in the required dependency order",
    () => {

        const html =
            readProjectFile(
                "index.html"
            );


        /*
         * Helper used to make script-order assertions easier to read.
         */
        const position =
            (scriptPath) =>
                html.indexOf(
                    `src="${scriptPath}"`
                );


        assert.ok(
            position("js/data.js") !== -1,
            "index.html must load data.js."
        );


        assert.ok(
            position("js/social.js") !== -1,
            "index.html must load social.js."
        );


        assert.ok(
            position("js/directory/dom.js") !== -1,
            "index.html must load directory/dom.js."
        );


        /*
         * data.js must run before directory modules because the
         * application needs the data loader before initialization.
         */
        assert.ok(
            position("js/data.js") <
            position("js/directory/dom.js")
        );


        /*
         * social.js defines the shared social helpers used by
         * social-links.js and the card/profile code.
         */
        assert.ok(
            position("js/social.js") <
            position("js/directory/social-links.js")
        );


        /*
         * Directory modules are intentionally loaded from their
         * lower-level dependencies toward the final entry point.
         */
        const orderedScripts = [
            "js/directory/dom.js",
            "js/directory/helpers.js",
            "js/directory/social-links.js",
            "js/directory/card.js",
            "js/directory/render.js",
            "js/directory/search.js",
            "js/directory/touch.js",
            "js/script.js"
        ];


        for (
            let index = 0;
            index < orderedScripts.length - 1;
            index += 1
        ) {

            assert.ok(
                position(orderedScripts[index]) <
                position(orderedScripts[index + 1]),
                `${orderedScripts[index]} must load before ${orderedScripts[index + 1]}.`
            );
        }
    }
);


test(
    "profile scripts load in the required dependency order",
    () => {

        const html =
            readProjectFile(
                "profile.html"
            );


        const position =
            (scriptPath) =>
                html.indexOf(
                    `src="${scriptPath}"`
                );


        assert.ok(
            position("js/data.js") <
            position("js/profile.js"),
            "data.js must load before profile.js."
        );


        assert.ok(
            position("js/social.js") <
            position("js/profile.js"),
            "social.js must load before profile.js."
        );
    }
);


// ============================================================
// 15. REQUIRED JAVASCRIPT MODULES
// ============================================================

test(
    "directory JavaScript modules exist",
    () => {

        const requiredFiles = [

            "js/data.js",

            "js/social.js",

            "js/directory/dom.js",

            "js/directory/helpers.js",

            "js/directory/social-links.js",

            "js/directory/card.js",

            "js/directory/render.js",

            "js/directory/search.js",

            "js/directory/touch.js",

            "js/script.js",

            "js/profile.js"
        ];


        requiredFiles.forEach(
            (relativePath) => {

                assert.ok(
                    projectFileExists(
                        relativePath
                    ),
                    `${relativePath} must exist.`
                );
            }
        );
    }
);


// ============================================================
// 16. DATA LOADER TESTS
// ============================================================

test(
    "data.js references the current JSON data source",
    () => {

        const source =
            readProjectFile(
                "js/data.js"
            );


        assert.match(
            source,
            /assets\/data\.json/,
            "data.js must load assets/data.json."
        );


        assert.match(
            source,
            /window\.loadStudentData/,
            "data.js must expose loadStudentData globally."
        );
    }
);


test(
    "data.js no longer embeds the student dataset directly",
    () => {

        const source =
            readProjectFile(
                "js/data.js"
            );


        /*
         * The student records now belong to assets/data.json.
         * data.js should act as a loader rather than containing the
         * complete student database itself.
         */
        assert.doesNotMatch(
            source,
            /\bconst\s+students\s*=/,
            "data.js should not contain a separate const students dataset."
        );
    }
);


// ============================================================
// 17. DIRECTORY ARCHITECTURE TESTS
// ============================================================

test(
    "directory modules use the shared namespace",
    () => {

        const directoryRoot =
            path.join(
                projectRoot,
                "js",
                "directory"
            );


        const files =
            fs.readdirSync(
                directoryRoot
            );


        files
            .filter(
                (fileName) =>
                    fileName.endsWith(".js")
            )
            .forEach(
                (fileName) => {

                    const source =
                        fs.readFileSync(
                            path.join(
                                directoryRoot,
                                fileName
                            ),
                            "utf8"
                        );


                    assert.match(
                        source,
                        /window\.SuperiorsDirectory/,
                        `${fileName} should use the shared SuperiorsDirectory namespace.`
                    );
                }
            );
    }
);


// ============================================================
// 18. JAVASCRIPT SYNTAX TESTS
// ============================================================

test(
    "project JavaScript files pass Node syntax checks",
    () => {

        const javascriptFiles = [

            "js/data.js",

            "js/social.js",

            "js/intro.js",

            "js/profile.js",

            "js/script.js",

            "js/directory/dom.js",

            "js/directory/helpers.js",

            "js/directory/social-links.js",

            "js/directory/card.js",

            "js/directory/render.js",

            "js/directory/search.js",

            "js/directory/touch.js"
        ];


        /*
         * `node --check` is executed through a child process so the
         * test verifies syntax exactly as Node would parse each file.
         */
        const {
            spawnSync
        } = require("node:child_process");


        javascriptFiles.forEach(
            (relativePath) => {

                const result =
                    spawnSync(
                        process.execPath,
                        [
                            "--check",
                            path.join(
                                projectRoot,
                                relativePath
                            )
                        ],
                        {
                            encoding: "utf8"
                        }
                    );


                assert.equal(
                    result.status,
                    0,
                    `${relativePath} contains a JavaScript syntax error.\n${result.stderr}`
                );
            }
        );
    }
);


// ============================================================
// 19. SOCIAL CONFIGURATION TESTS
// ============================================================

test(
    "social.js defines the supported social platforms",
    () => {

        const source =
            readProjectFile(
                "js/social.js"
            );


        [
            "youtube",
            "tiktok",
            "twitter",
            "x",
            "facebook",
            "github"
        ].forEach(
            (platform) => {

                assert.match(
                    source,
                    new RegExp(
                        `\\b${platform}\\b`,
                        "i"
                    ),
                    `social.js should contain support for ${platform}.`
                );
            }
        );
    }
);


// ============================================================
// 20. FINAL PROJECT SANITY CHECK
// ============================================================

test(
    "main project files exist",
    () => {

        [
            "index.html",
            "profile.html",
            "README.md",
            "assets/data.json",
            "assets/images/superiors_background.png",
            "assets/images/superiors_icon.png",
            "assets/images/students/no_profile.png",
            "assets/remixicon/remixicon.css"
        ].forEach(
            (relativePath) => {

                assert.ok(
                    projectFileExists(
                        relativePath
                    ),
                    `${relativePath} must exist.`
                );
            }
        );
    }
);
