/**
 * ============================================================
 * SUPERIORS — STUDENT CARD COMPONENT
 * ============================================================
 *
 * Responsible for creating and preparing one student card.
 *
 * Handles:
 * - Card markup
 * - Student information
 * - Phone/social controls
 * - Image fallback listeners
 * - Profile navigation
 * - Card click behavior
 *
 * Sorting, searching, and touch-state management are handled
 * by separate directory modules.
 * ============================================================
 */

(() => {
    "use strict";

    /* ========================================================
       1. DIRECTORY NAMESPACE
       ======================================================== */

    /**
     * Reuse the shared SUPERIORS directory namespace.
     */
    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    /**
     * Shared helper functions provided by the project.
     */
    const escapeHTML = directory.helpers.escapeHTML;
    const createSocialLinks = directory.createSocialLinks;


    /* ========================================================
       2. DEFAULT STUDENT IMAGE
       ======================================================== */

    /**
     * Default image used when a student's profile picture:
     * - Has not been provided
     * - Is empty
     * - Does not exist
     * - Cannot be loaded
     */
    const DEFAULT_STUDENT_IMAGE =
        "assets/images/students/no_profile.png";


    /* ========================================================
       3. CREATE STUDENT CARD
       ======================================================== */

    /**
     * Build one complete student card from a data.js object.
     *
     * @param {Object} student - Student information.
     * @returns {HTMLElement} Constructed student card.
     */
    function createStudentCard(student) {

        /* ----------------------------------------------------
           Create the semantic article representing the student.
           ---------------------------------------------------- */
        const card = document.createElement("article");

        card.className = "student-card";
        card.dataset.studentId =
            String(student.serialNumber ?? "");


        /* ====================================================
           PREPARE STUDENT VALUES
           ==================================================== */

        /**
         * Safely escape values before inserting them into HTML.
         */
        const serialNumber =
            escapeHTML(student.serialNumber ?? "");

        const name =
            escapeHTML(
                student.name ?? "Unknown Student"
            );

        const nickname =
            escapeHTML(student.nickname ?? "");

        const title =
            escapeHTML(student.title ?? "");

        const phone =
            String(student.phone ?? "").trim();

        const safePhone =
            escapeHTML(phone);


        /* ====================================================
           IMAGE PATHS
           ==================================================== */

        /**
         * The cover image is the default artwork shown on the card.
         * It can be any image chosen for the student, so it is
         * intentionally separate from the student's actual portrait.
         */
        const coverImageValue =
            String(student.coverImage ?? "").trim();

        const coverImage =
            escapeHTML(
                coverImageValue || DEFAULT_STUDENT_IMAGE
            );

        /**
         * The profile image is the student's actual/main portrait.
         * It is optional because some student records do not yet have
         * a profile photo. When absent, the card simply remains on the
         * cover image and the profile page uses its normal fallback.
         */
        const profileImage =
            escapeHTML(
                String(student.profileImage ?? "").trim()
            );


        /* ====================================================
           SOCIAL LINKS
           ==================================================== */

        /**
         * Generate social buttons through the dedicated module.
         */
        const socialLinks =
            createSocialLinks(student);

        /**
         * Only render a phone link when a meaningful number exists.
         */
        const hasPhone =
            phone &&
            phone !== "-" &&
            phone !== "--";


        /* ====================================================
           BUILD CARD HTML
           ==================================================== */

        card.innerHTML = `
            <!--
                ====================================================
                STUDENT PROFILE LINK
                ====================================================
                The image and primary student information are wrapped
                in one native link for keyboard and screen-reader users.
            -->
            <a
                class="student-profile-link"
                href="profile.html?id=${encodeURIComponent(
                    String(student.serialNumber ?? "")
                )}"
                aria-label="View ${name}'s profile"
            >
                <div class="student-image-container">

                    <!-- Student cover image shown by default -->
                    <img
                        class="student-image cover-student-image"
                        src="${coverImage}"
                        alt="Photo of ${name}"
                        loading="lazy"
                        decoding="async"
                    >

                    <!-- Optional profile image revealed on desktop hover/touch activation -->
                    ${
                        profileImage
                            ? `
                                <img
                                    class="student-image profile-student-image"
                                    src="${profileImage}"
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                    decoding="async"
                                >
                            `
                            : ""
                    }

                    <!-- Student metadata overlay -->
                    <div
                        class="student-image-overlay"
                        aria-hidden="true"
                    >
                        <span class="student-serial">
                            #${serialNumber}
                        </span>

                        ${
                            nickname
                                ? `
                                    <br>
                                    <span class="student-nickname">
                                        ${nickname}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            title
                                ? `
                                    <br>
                                    <span class="student-title">
                                        ${title}
                                    </span>
                                `
                                : ""
                        }
                    </div>
                </div>

                <!-- Student name -->
                <div class="student-info">
                    <h2 class="student-name">
                        ${name}
                    </h2>
                </div>
            </a>

            <!--
                ====================================================
                CONTACT CONTROLS
                ====================================================
                These controls remain outside the profile link so
                clicking a phone/social button doesn't open the
                student's profile.
            -->
            <div class="student-contact-info">

                ${
                    hasPhone
                        ? `
                            <a
                                class="ri-phone-line student-phone"
                                href="tel:${safePhone}"
                                aria-label="Call ${name} at ${safePhone}"
                            >
                                ${safePhone}
                            </a>
                        `
                        : ""
                }

                ${
                    socialLinks
                        ? `
                            <div
                                class="student-socials"
                                aria-label="Social media profiles for ${name}"
                            >
                                ${socialLinks}
                            </div>
                        `
                        : ""
                }
            </div>
        `;


        /* ====================================================
           COVER IMAGE FALLBACK
           ==================================================== */

        /**
         * Find the card's default cover image.
         */
        const coverImageElement =
            card.querySelector(".cover-student-image");

        if (coverImageElement) {

            /**
             * Replace a broken student image with the default
             * unavailable placeholder.
             */
            coverImageElement.addEventListener(
                "error",
                () => {
                    coverImageElement.onerror = null;
                    coverImageElement.src =
                        DEFAULT_STUDENT_IMAGE;
                },
                { once: true }
            );
        }


        /* ====================================================
           PROFILE IMAGE FALLBACK
           ==================================================== */

        /**
         * A broken profile image should simply disappear from the
         * reveal layer rather than replacing the student's cover image.
         */
        const profileImageElement =
            card.querySelector(".profile-student-image");

        if (profileImageElement) {
            profileImageElement.addEventListener(
                "error",
                () => {
                    profileImageElement.style.display = "none";
                },
                { once: true }
            );
        }


        /* ====================================================
           PROFILE LINK NAVIGATION
           ==================================================== */

        /**
         * Mark that the user is intentionally navigating from
         * the directory to a student profile.
         *
         * intro.js reads this flag when index.html is restored
         * through browser history and therefore knows not to
         * replay the cinematic intro.
         */
        const profileLink =
            card.querySelector(".student-profile-link");

        if (profileLink) {
            profileLink.addEventListener("click", () => {
                sessionStorage.setItem(
                    "superiorsReturningFromProfile",
                    "true"
                );
            });
        }


        /* ====================================================
           CARD CLICK BEHAVIOR
           ==================================================== */

        card.addEventListener("click", (event) => {

            /**
             * Existing links already have their own behavior.
             * Don't override them with the card-level handler.
             */
            if (event.target.closest("a")) {
                return;
            }

            /**
             * Touch devices are handled by touch.js.
             */
            if (
                window.matchMedia("(hover: none)").matches
            ) {
                return;
            }

            /**
             * Clicking another part of the card on a device with
             * hover support opens the student's profile.
             */
            const profileURL =
                `profile.html?id=${encodeURIComponent(
                    String(student.serialNumber ?? "")
                )}`;

            /*
             * Mark this navigation as a profile visit so that
             * returning to the homepage doesn't replay the intro.
             */
            sessionStorage.setItem(
                "superiorsReturningFromProfile",
                "true"
            );

            window.location.href = profileURL;
        });


        /* ====================================================
           RETURN CARD
           ==================================================== */

        return card;
    }


    /* ========================================================
       4. EXPOSE CARD CREATOR
       ======================================================== */

    /**
     * Make createStudentCard available to the other directory
     * modules through the shared SUPERIORS namespace.
     */
    directory.createStudentCard = createStudentCard;

})();
