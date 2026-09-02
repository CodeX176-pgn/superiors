/**
 * ============================================================
 * SUPERIORS — PROFILE PAGE
 * ============================================================
 *
 * Handles:
 * - Reading the student ID from profile.html?id=001
 * - Finding the matching student from data.js
 * - Rendering the student's profile information
 * - Dynamically rendering populated information fields
 * - Rendering available social-media accounts
 * - Rendering social-media links through social.js
 * - Profile-image loading and fallback handling
 * - Missing-image handling
 * - Invalid/missing student IDs
 * - Profile → Home navigation
 *
 * IMPORTANT:
 * social.js must be loaded BEFORE this file.
 * ============================================================
 */

(() => {
    "use strict";

    /* ============================================================
       1. DEFAULT STUDENT IMAGE
       ============================================================ */

    /**
     * Default profile image used when the selected student
     * does not have a usable profile image.
     *
     * Keep this path identical to the placeholder used by card.js.
     */
    const DEFAULT_STUDENT_IMAGE =
        "assets/images/students/no_profile.png";

    /* ============================================================
       2. DOM ELEMENT REFERENCES
       ============================================================ */

    const profileName =
        document.getElementById("profileName");

    const profileNickname =
        document.getElementById("profileNickname");

    const profileTitle =
        document.getElementById("profileTitle");

    const profileSerial =
        document.getElementById("profileSerial");

    const profileInformationBody =
        document.getElementById("profileInformationBody");

    const profileSocials =
        document.getElementById("profileSocials");

    const profileImage =
        document.getElementById("profileImage");

    const profileImageName =
        document.getElementById("profileImageName");

    const profileContent =
        document.getElementById("profileContent");

    const profileLayout =
        document.getElementById("profileLayout");

    const profileError =
        document.getElementById("profileError");

    const backButton =
        document.getElementById("backButton");

    /* ============================================================
       3. HTML SAFETY HELPER
       ============================================================ */

    /**
     * Escape text before placing it inside generated HTML.
     *
     * @param {*} value - Value to escape.
     * @returns {string} Safe HTML string.
     */
    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ============================================================
       4. PROFILE FIELD HELPERS
       ============================================================ */

    /**
     * Convert a JavaScript property name into a readable label.
     *
     * @param {string} key - Object property name.
     * @returns {string} Human-readable label.
     */
    function getFieldLabel(key) {
        const specialLabels = {
            phone: "Phone",
            dateOfBirth: "Date of Birth",
            stateOfOrigin: "State of Origin",
            hobbies: "Hobbies",
            email: "Email",
            facebook: "Facebook",
            instagram: "Instagram",
            tiktok: "TikTok",
            youtube: "YouTube",
            github: "GitHub",
            twitter: "Twitter / X",
            x: "Twitter / X"
        };

        if (specialLabels[key]) {
            return specialLabels[key];
        }

        return String(key)
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    }

    /**
     * Determine whether a normal data.js field
     * contains something worth displaying.
     *
     * @param {*} value - Value to inspect.
     * @returns {boolean} Whether the value should be displayed.
     */
    function hasDisplayableValue(value) {
        if (value === null || value === undefined) {
            return false;
        }

        if (typeof value === "string") {
            return (
                value.trim() !== "" &&
                value.trim() !== "-"
            );
        }

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        if (typeof value === "object") {
            return Object.keys(value).length > 0;
        }

        return true;
    }

    /**
     * Convert a data.js value into readable text.
     *
     * @param {*} value - Value from the student object.
     * @returns {string} Human-readable value.
     */
    function formatProfileValue(value) {
        if (Array.isArray(value)) {
            return value
                .filter((item) =>
                    hasDisplayableValue(item)
                )
                .map((item) =>
                    formatProfileValue(item)
                )
                .join(", ");
        }

        if (
            typeof value === "object" &&
            value !== null
        ) {
            return Object.entries(value)
                .filter(([, nestedValue]) =>
                    hasDisplayableValue(nestedValue)
                )
                .map(([nestedKey, nestedValue]) =>
                    `${getFieldLabel(nestedKey)}: ` +
                    `${formatProfileValue(nestedValue)}`
                )
                .join(", ");
        }

        return String(value ?? "").trim();
    }

    /**
     * Create one safe value cell for a social-media account.
     *
     * The information table intentionally displays only the student's
     * `displayName` as plain text. The social-media button elsewhere on
     * the profile is responsible for opening the account URL using the
     * `username`. Keeping these responsibilities separate prevents the
     * table value from behaving like an external link.
     *
     * @param {string} platform - Social platform name.
     * @param {string} username - Account username/handle.
     * @param {string} displayName - Name shown by the student on the platform.
     * @returns {string} Generated table-cell HTML.
     */
    function createSocialValueCell(platform, username, displayName) {
        // The table must show the platform display name, not the username.
        const displayValue = String(displayName || "").trim();

        if (!displayValue) {
            return "";
        }

        // Do not create an <a> element here. The information table is
        // informational only; account navigation is handled by the
        // dedicated social-media button section below.
        return `
            <td>
                ${escapeHTML(displayValue)}
            </td>
        `;
    }

    /* ============================================================
       5. READ STUDENT ID FROM URL
       ============================================================ */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const requestedStudentId =
        urlParams.get("id");

    /* ============================================================
       6. FIND REQUESTED STUDENT
       ============================================================ */

    /**
     * Find the student whose serial number matches
     * the ID in the URL.
     *
     * @returns {Promise<Object|null>}
     */
    async function findRequestedStudent() {
        if (!requestedStudentId) {
            return null;
        }

        try {
            const loadedStudents =
                await window.loadStudentData();

            const student =
                loadedStudents.find((student) => {
                    if (
                        student.serialNumber === undefined ||
                        student.serialNumber === null
                    ) {
                        return false;
                    }

                    return (
                        String(student.serialNumber).trim() ===
                        String(requestedStudentId).trim()
                    );
                });

            return student || null;
        } catch (error) {
            console.error(
                "SUPERIORS: Unable to load student profile data.",
                error
            );

            return null;
        }
    }

    /* ============================================================
       7. CREATE PROFILE SOCIAL LINK
       ============================================================ */

    /**
     * Create one social-media button.
     *
     * The button opens the account using `username`. The student's
     * platform display name is intentionally not used to build the URL.
     *
     * @param {string} platform - Social platform name.
     * @param {string} username - Account username/handle.
     * @param {string} displayName - Name shown by the student on the platform.
     * @returns {string} Social link HTML.
     */
    function createProfileSocialLink(platform, username, displayName) {
        if (isMissingSocialValue(username)) {
            return "";
        }

        const url = getSocialUrl(platform, username);

        if (!url) {
            return "";
        }

        const iconName = getSocialIconName(platform);
        const readablePlatform = getFieldLabel(platform);
        const accessibleName = String(displayName || username).trim();

        return `
            <a
                class="profile-social-link"
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="${escapeHTML(
                    readablePlatform
                )} profile for ${escapeHTML(accessibleName)}"
                title="${escapeHTML(
                    readablePlatform
                )} profile for ${escapeHTML(accessibleName)}"
            >
                <i
                    class="${escapeHTML(iconName)}"
                    aria-hidden="true"
                ></i>
                <span>
                    ${escapeHTML(readablePlatform)}
                </span>
            </a>
        `;
    }

    /* ============================================================
       8. RENDER INFORMATION TABLE
       ============================================================ */

    /**
     * Render the complete information table.
     *
     * @param {Object} student - Selected student.
     */
    function renderProfileInformation(student) {
        if (!profileInformationBody) {
            return;
        }

        const rows = [];

        const excludedTopLevelFields =
            new Set([
                "name",
                "nickname",
                "title",
                "serialNumber",
                "coverImage",
                "profileImage",
                "socialMedia"
            ]);

        /* --------------------------------------------------------
           PHONE
           -------------------------------------------------------- */

        if (hasDisplayableValue(student.phone)) {
            const phone =
                formatProfileValue(
                    student.phone
                );

            const phoneHref =
                `tel:${phone.replace(
                    /[^+\d]/g,
                    ""
                )}`;

            rows.push(`
                <tr>
                    <th scope="row">
                        Phone
                    </th>
                    <td>
                        <a
                            class="profile-value-link"
                            href="${escapeHTML(phoneHref)}"
                        >
                            ${escapeHTML(phone)}
                        </a>
                    </td>
                </tr>
            `);
        }

        /* --------------------------------------------------------
           SOCIAL MEDIA
           -------------------------------------------------------- */

        const socialMedia = Array.isArray(student.socialMedia)
            ? student.socialMedia
            : [];

        socialMedia.forEach((social) => {
            // Ignore malformed social-media records.
            if (!social || typeof social !== "object") {
                return;
            }

            const platform = String(social.platform || "").trim();
            const username = String(social.username || "").trim();
            const displayName = String(social.displayName || "").trim();

            if (!platform || isMissingSocialValue(username) || !displayName) {
                return;
            }

            const label = getFieldLabel(platform);

            const valueCell = createSocialValueCell(
                platform,
                username,
                displayName
            );

            if (!valueCell) {
                return;
            }

            rows.push(`
                <tr>
                    <th scope="row">
                        ${escapeHTML(label)}
                    </th>
                    ${valueCell}
                </tr>
            `);
        });

        /* --------------------------------------------------------
           ALL OTHER POPULATED DATA.JS FIELDS
           -------------------------------------------------------- */

        Object.entries(student).forEach(
            ([key, value]) => {
                if (
                    excludedTopLevelFields.has(key)
                ) {
                    return;
                }

                if (key === "phone") {
                    return;
                }

                if (
                    !hasDisplayableValue(value)
                ) {
                    return;
                }

                const formattedValue =
                    formatProfileValue(value);

                if (!formattedValue) {
                    return;
                }

                rows.push(`
                    <tr>
                        <th scope="row">
                            ${escapeHTML(
                                getFieldLabel(key)
                            )}
                        </th>
                        <td>
                            ${escapeHTML(
                                formattedValue
                            )}
                        </td>
                    </tr>
                `);
            }
        );

        /* --------------------------------------------------------
           EMPTY STATE
           -------------------------------------------------------- */

        if (rows.length === 0) {
            profileInformationBody.innerHTML = `
                <tr>
                    <td
                        colspan="2"
                        class="profile-table-empty"
                    >
                        No additional information has been provided.
                    </td>
                </tr>
            `;

            return;
        }

        profileInformationBody.innerHTML =
            rows.join("");
    }

    /* ============================================================
       9. SHOW PROFILE ERROR
       ============================================================ */

    function showProfileError() {
        if (profileContent) {
            profileContent.hidden = true;
        }

        if (profileLayout) {
            profileLayout.hidden = true;
        }

        if (profileError) {
            profileError.hidden = false;
        }

        document.title =
            "Profile Not Found — SUPERIORS";
    }

    /* ============================================================
       10. DISPLAY STUDENT PROFILE
       ============================================================ */

    /**
     * Populate the profile page with the selected student's data.
     *
     * @param {Object} student - Selected student.
     */
    function displayStudentProfile(student) {
        if (profileContent) {
            profileContent.hidden = false;
        }

        if (profileLayout) {
            profileLayout.hidden = false;
        }

        if (profileError) {
            profileError.hidden = true;
        }

        /* --------------------------------------------------------
           BASIC INFORMATION
           -------------------------------------------------------- */

        if (profileSerial) {
            profileSerial.textContent =
                `#${student.serialNumber ?? ""}`;
        }

        if (profileNickname) {
            profileNickname.textContent =
                student.nickname || "";
        }

        if (profileName) {
            profileName.textContent =
                student.name ||
                "Unknown Student";
        }

        if (profileTitle) {
            profileTitle.textContent =
                student.title || "";
        }

        document.title =
            `${student.name || "Student"} — SUPERIORS`;

        /* --------------------------------------------------------
           INFORMATION TABLE
           -------------------------------------------------------- */

        renderProfileInformation(student);

        /* --------------------------------------------------------
           SOCIAL MEDIA BUTTONS
           -------------------------------------------------------- */

        const socialMedia = Array.isArray(student.socialMedia)
            ? student.socialMedia
            : [];

        if (profileSocials) {
            profileSocials.innerHTML = socialMedia
                .filter((social) => {
                    // Only render well-formed entries that have a usable
                    // platform and username.
                    return (
                        social &&
                        typeof social === "object" &&
                        String(social.platform || "").trim() &&
                        !isMissingSocialValue(social.username)
                    );
                })
                .map((social) =>
                    createProfileSocialLink(
                        String(social.platform).trim(),
                        String(social.username).trim(),
                        String(social.displayName || "").trim()
                    )
                )
                .join("");

            const hasSocialLinks =
                profileSocials.children.length > 0;

            profileSocials.hidden = !hasSocialLinks;

            const socialSection =
                profileSocials.closest(
                    ".profile-social-section"
                );

            if (socialSection) {
                socialSection.hidden = !hasSocialLinks;
            }
        }

        /* --------------------------------------------------------
           PROFILE IMAGE
           -------------------------------------------------------- */

        /**
         * The profile page always displays the student's actual
         * profile portrait. The card cover image is deliberately not
         * used here because it is intended only as directory artwork.
         */
        const profileImagePath =
            String(
                student.profileImage ?? ""
            ).trim();

        const initialImage =
            profileImagePath ||
            DEFAULT_STUDENT_IMAGE;

        profileImage.classList.remove(
            "profile-image-missing"
        );

        profileImage.dataset.profileImage =
            profileImagePath;

        profileImage.src =
            initialImage;

        profileImage.alt =
            profileImagePath
                ? `Large profile photo of ${student.name}`
                : `No profile image available for ${student.name}`;

        if (profileImageName) {
            profileImageName.textContent =
                student.name || "";
        }

        /* --------------------------------------------------------
           BROKEN IMAGE HANDLING
           -------------------------------------------------------- */

        /**
         * If the student's profile portrait cannot be loaded, fall
         * back to the shared placeholder without creating another
         * image-switching state on the profile page.
         */
        profileImage.onerror = () => {
            profileImage.onerror = null;

            profileImage.src =
                DEFAULT_STUDENT_IMAGE;

            profileImage.alt =
                `No profile image available for ${student.name}`;

            profileImage.classList.add(
                "profile-image-missing"
            );
        };
    }

    /* ============================================================
       11. PROFILE → HOME NAVIGATION
       ============================================================ */

    /**
     * Tell intro.js that the next homepage visit should NOT
     * display the cinematic opening scene.
     *
     * sessionStorage lasts for the current browser tab/session.
     * This means refreshing the homepage later can still play
     * the intro after the flag has been consumed.
     */
    function skipHomeIntro() {
        sessionStorage.setItem(
            "superiorsSkipIntro",
            "true"
        );
    }

    /**
     * Attach skip-intro behavior to every profile-page link
     * marked with [data-skip-intro].
     *
     * Examples:
     * - SUPERIORS logo
     * - Return To Students
     * - Future profile → home links
     */
    document
        .querySelectorAll("[data-skip-intro]")
        .forEach((link) => {
            link.addEventListener("click", () => {
                skipHomeIntro();
            });
        });

    /* ------------------------------------------------------------
        BACK BUTTON
    ------------------------------------------------------------ */

    /**
     * Handles the profile-page back button.
     *
     * IMPORTANT:
     * The skip-intro flag is set BEFORE history.back().
     *
     * This guarantees that returning to index.html through the
     * browser history does not replay the cinematic intro.
     */
    if (backButton) {
        backButton.addEventListener("click", () => {

            /* --------------------------------------------------------
            Tell intro.js that the next homepage visit should
            skip the cinematic opening scene.
            -------------------------------------------------------- */
            sessionStorage.setItem(
                "superiorsSkipIntro",
                "true"
            );

            /* --------------------------------------------------------
            Check whether the user came from another page on the
            same website and whether browser history is available.
            -------------------------------------------------------- */
            const referrer = document.referrer;

            const sameOriginReferrer =
                referrer &&
                referrer.startsWith(window.location.origin);

            if (
                sameOriginReferrer &&
                window.history.length > 1
            ) {
                /*
                * Return to the previous page without loading
                * index.html manually.
                */
                window.history.back();
                return;
            }

            /* --------------------------------------------------------
            If there is no useful browser history, fall back to
            the homepage directly.
            -------------------------------------------------------- */
            window.location.href = "index.html";
        });
    }

    /* ============================================================
       12. INITIAL PROFILE RENDER
       ============================================================ */

    /**
     * Initialize the profile page.
     */
    async function initializeProfilePage() {
        if (!requestedStudentId) {
            showProfileError();
            return;
        }

        const selectedStudent =
            await findRequestedStudent();

        if (!selectedStudent) {
            showProfileError();
            return;
        }

        displayStudentProfile(
            selectedStudent
        );
    }

    /* ============================================================
       13. START PROFILE PAGE
       ============================================================ */

    initializeProfilePage();

})();
