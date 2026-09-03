/**
 * ============================================================
 * SUPERIORS — CINEMATIC INTRO CONTROLLER
 * ============================================================
 *
 * Responsible only for controlling the homepage opening scene.
 *
 * Behavior:
 * - Plays the intro on a normal homepage visit.
 * - Plays the intro when the homepage is refreshed.
 * - Skips the intro when returning from profile.html.
 * - Supports profile links using [data-skip-intro].
 * - Supports the profile Back button.
 * - Uses sessionStorage for profile → home navigation.
 * - Removes the intro completely when it is skipped.
 *
 * IMPORTANT:
 * The intro exists only on index.html.
 * profile.html does not load this file.
 *
 * ============================================================
 */

(() => {
    "use strict";

    /* ============================================================
       1. CONFIGURATION
       ============================================================ */

    /**
     * Shared sessionStorage key.
     *
     * profile.js sets this to "true" before navigating from
     * profile.html back to the homepage.
     *
     * intro.js consumes and removes the flag when index.html loads.
     */
    const SKIP_INTRO_KEY = "superiorsSkipIntro";

    /**
     * Homepage filename.
     */
    const HOME_PAGE = "index.html";


    /* ============================================================
       2. HOMEPAGE DETECTION
       ============================================================ */
    /* ============================================================
       2. FIND INTRO ELEMENT
       ============================================================ */

    /**
     * Main cinematic intro container.
     *
     * This element only exists on index.html. If it is not in the DOM,
     * this is not the homepage and there is nothing to control.
     */
    const intro =
        document.getElementById(
            "superiorsIntro"
        );

    if (!intro) {
        return;
    }


    /* ============================================================
       4. BODY SCROLL STATE
       ============================================================ */

    /**
     * Lock homepage scrolling while the cinematic intro is
     * playing.
     */
    document.body.classList.add(
        "intro-active"
    );


    /* ============================================================
       5. PROFILE → HOME DETECTION
       ============================================================ */

    /**
     * Check whether the previous page was profile.html.
     *
     * This provides an additional safety mechanism for browser
     * history navigation.
     *
     * Example:
     *
     * profile.html?id=001
     *        ↓
     * history.back()
     *        ↓
     * index.html
     */
    function cameFromProfilePage() {
        const referrer =
            document.referrer;

        if (!referrer) {
            return false;
        }

        try {
            const referrerURL =
                new URL(referrer);

            /**
             * Only consider a profile page on the same website.
             */
            if (
                referrerURL.origin !==
                window.location.origin
            ) {
                return false;
            }

            return referrerURL.pathname.endsWith(
                "/profile.html"
            );

        } catch (error) {

            /**
             * A malformed referrer should never prevent the
             * homepage from loading.
             */
            console.warn(
                "SUPERIORS: Unable to inspect referrer.",
                error
            );

            return false;
        }
    }


    /* ============================================================
       6. DETERMINE INTRO STATE
       ============================================================ */

    /**
     * Check the sessionStorage flag created by profile.js.
     */
    const skipFlag =
        sessionStorage.getItem(
            SKIP_INTRO_KEY
        ) === "true";

    /**
     * Check browser-history navigation from profile.html.
     */
    const returningFromProfile =
        cameFromProfilePage();

    /**
     * Either condition means the cinematic intro should be
     * skipped for this homepage visit.
     */
    const shouldSkipIntro =
        skipFlag ||
        returningFromProfile;


    /* ============================================================
       7. SKIP INTRO
       ============================================================ */

    if (shouldSkipIntro) {

        /**
         * IMPORTANT:
         *
         * Consume the flag immediately.
         *
         * This means:
         *
         * Profile → Home
         *        ↓
         * Intro skipped
         *        ↓
         * Flag removed
         *        ↓
         * Refresh Home
         *        ↓
         * Intro plays normally
         */
        sessionStorage.removeItem(
            SKIP_INTRO_KEY
        );


        /**
         * Remove the scroll lock.
         *
         * Without this, the homepage could remain in the
         * "intro-active" body state.
         */
        document.body.classList.remove(
            "intro-active"
        );


        /**
         * Mark the intro as skipped for accessibility and
         * consistency with the normal lifecycle.
         */
        intro.setAttribute(
            "aria-hidden",
            "true"
        );


        /**
         * Prevent the intro from intercepting mouse/touch input
         * while it is being removed.
         */
        intro.style.pointerEvents =
            "none";


        /**
         * Remove the intro completely.
         *
         * This is the important fix.
         *
         * The previous version only added:
         *
         *     intro-skipped
         *
         * but there was no CSS rule that actually hid the intro.
         *
         * Removing it from the DOM guarantees that it cannot
         * freeze over the homepage.
         */
        intro.remove();


        /**
         * Notify any other homepage scripts that the intro was
         * intentionally skipped.
         */
        document.dispatchEvent(
            new CustomEvent(
                "superiors:introSkipped"
            )
        );

        return;
    }


    /* ============================================================
       8. NORMAL INTRO START
       ============================================================ */

    /**
     * The visitor reached index.html normally.
     *
     * Therefore the cinematic opening should play.
     */
    intro.classList.add(
        "intro-active"
    );

    intro.setAttribute(
        "aria-hidden",
        "false"
    );


    /* ============================================================
       9. INTRO LIFECYCLE
       ============================================================ */

    /**
     * Prevent finishIntro() from running more than once.
     */
    let introFinished = false;


    /* ============================================================
       10. START PANEL OPENING
       ============================================================ */

    /**
     * Begin the diagonal panel reveal.
     */
    function startIntroOpening() {

        /**
         * Never start the opening after the intro has already
         * finished.
         */
        if (introFinished) {
            return;
        }


        /**
         * Force a browser reflow before applying the opening class.
         *
         * This guarantees that the browser sees the panels in their
         * original position before transitioning them outward.
         */
        void intro.offsetWidth;


        /**
         * Trigger the CSS panel transition.
         */
        intro.classList.add(
            "intro-opening"
        );


        /**
         * The panel transition is approximately 1.35 seconds.
         *
         * A slightly longer timer provides enough time for the
         * transition to finish reliably.
         */
        window.setTimeout(
            finishIntro,
            1400
        );
    }


    /* ============================================================
       11. FINISH INTRO
       ============================================================ */

    /**
     * Completely finish the cinematic opening.
     */
    function finishIntro() {

        /**
         * Prevent duplicate execution.
         */
        if (introFinished) {
            return;
        }

        introFinished = true;


        /**
         * Remove the active animation state.
         */
        intro.classList.remove(
            "intro-active"
        );


        /**
         * Mark the intro as finished.
         *
         * intro_root.css uses this class to fade the intro out.
         */
        intro.classList.add(
            "intro-finished"
        );


        /**
         * Make sure the finished intro cannot intercept
         * homepage interactions.
         */
        intro.style.pointerEvents =
            "none";


        /**
         * Restore normal homepage scrolling.
         */
        document.body.classList.remove(
            "intro-active"
        );


        /**
         * Notify other homepage scripts that the cinematic
         * intro has completed.
         */
        document.dispatchEvent(
            new CustomEvent(
                "superiors:introComplete"
            )
        );


        /**
         * Remove the intro from the DOM after the short fade.
         */
        window.setTimeout(() => {

            if (intro.parentNode) {
                intro.remove();
            }

        }, 300);
    }


    /* ============================================================
       12. START OPENING SEQUENCE
       ============================================================ */

    /**
     * Wait for the branding animations to finish before moving
     * the diagonal panels apart.
     *
     * The longest branding animation finishes at approximately
     * 1.8 seconds, so 2.1 seconds gives the content time to settle.
     */
    window.setTimeout(
        startIntroOpening,
        2100
    );


    /* ============================================================
       13. SAFETY FALLBACK
       ============================================================ */

    /**
     * Safety mechanism:
     *
     * The intro must never permanently trap the visitor.
     *
     * If an animation or timer fails unexpectedly, the intro is
     * forcibly completed after seven seconds.
     */
    window.setTimeout(() => {

        if (!introFinished) {

            console.warn(
                "SUPERIORS: Intro safety fallback triggered."
            );

            finishIntro();
        }

    }, 7000);

})();
