/**
 * ============================================================
 * SUPERIORS — CINEMATIC INTRO CONTROLLER
 * ============================================================
 *
 * Responsible only for controlling the homepage opening scene.
 *
 * Behavior:
 * - Plays the intro on normal homepage visits and refreshes.
 * - Skips the intro when returning from profile.html.
 * - Supports profile links using [data-skip-intro].
 * - Also detects browser-history navigation from the profile page.
 * - Consumes the sessionStorage skip flag after using it.
 *
 * IMPORTANT:
 * The intro itself should only exist on index.html.
 * profile.html does NOT need to load this file.
 *
 * ============================================================
 */

(() => {
    "use strict";

    /* ============================================================
       1. INTRO CONFIGURATION
       ============================================================ */

    /**
     * sessionStorage key shared with profile.js.
     *
     * profile.js sets this to "true" when a profile → home
     * navigation should bypass the cinematic intro.
     */
    const SKIP_INTRO_KEY = "superiorsSkipIntro";

    /**
     * Name of the homepage file.
     *
     * Keeping this in one place makes the navigation logic easier
     * to maintain if the homepage filename changes later.
     */
    const HOME_PAGE = "index.html";


    /* ============================================================
       2. PAGE DETECTION
       ============================================================ */

    /**
     * Determine whether the current page is the SUPERIORS homepage.
     *
     * This prevents the intro controller from doing anything on
     * profile.html or any other page.
     */
    function isHomePage() {
        const currentPath = window.location.pathname;

        return (
            currentPath.endsWith("/") ||
            currentPath.endsWith(`/${HOME_PAGE}`)
        );
    }

    /**
     * Only continue if this is the homepage.
     */
    if (!isHomePage()) {
        return;
    }


    /* ============================================================
       3. INTRO ELEMENT
       ============================================================ */

    /**
     * Main cinematic intro container.
     *
     * IMPORTANT:
     * This selector should match the outermost element in your
     * final intro markup.
     *
     * If your final markup uses a different ID, change ONLY this
     * selector.
     */
    const intro = document.getElementById("superiorsIntro");

    /**
     * If the intro element does not exist, there is nothing for
     * this script to control.
     */
    if (!intro) {
        return;
    }


    /* ============================================================
       4. SKIP-FLAG CHECK
       ============================================================ */

    /**
     * Check whether profile.js requested that the next homepage
     * visit should bypass the cinematic intro.
     */
    const skipIntro =
        sessionStorage.getItem(SKIP_INTRO_KEY) === "true";


    /* ============================================================
       5. PROFILE → HOME DETECTION
       ============================================================ */

    /**
     * Browser-history navigation is slightly different from a
     * normal profile link.
     *
     * Your profile.js uses history.back() when possible, so the
     * sessionStorage flag may not have been created before the
     * browser returns to index.html.
     *
     * We therefore also inspect document.referrer.
     *
     * Example:
     *
     * profile.html?id=001
     *          ↓
     * history.back()
     *          ↓
     * index.html
     *
     * The referrer tells us that the previous page was profile.html,
     * allowing us to skip the intro in this situation as well.
     */
    function cameFromProfilePage() {
        const referrer = document.referrer;

        if (!referrer) {
            return false;
        }

        try {
            const referrerURL =
                new URL(referrer);

            /**
             * Only treat the referrer as a profile page when it
             * belongs to the same website.
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
       6. DETERMINE WHETHER INTRO SHOULD BE SKIPPED
       ============================================================ */

    /**
     * The intro is skipped when either:
     *
     * 1. profile.js explicitly set the sessionStorage flag, OR
     * 2. The browser returned to index.html from profile.html.
     */
    const returningFromProfile =
        cameFromProfilePage();

    const shouldSkipIntro =
        skipIntro ||
        returningFromProfile;


    /* ============================================================
       7. SKIP INTRO
       ============================================================ */

    if (shouldSkipIntro) {
        /**
         * Remove the flag immediately.
         *
         * This is VERY important.
         *
         * It means:
         *
         * Profile → Home
         *     ↓
         * Intro skipped
         *     ↓
         * Flag removed
         *     ↓
         * Refresh Home
         *     ↓
         * Intro plays normally
         */
        sessionStorage.removeItem(
            SKIP_INTRO_KEY
        );

        /**
         * Immediately hide the cinematic intro.
         *
         * The CSS class should already exist in your intro.css.
         */
        intro.classList.add(
            "intro-skipped"
        );

        /**
         * Make sure the intro cannot block interaction with
         * the homepage after being skipped.
         */
        intro.setAttribute(
            "aria-hidden",
            "true"
        );

        /**
         * Remove the intro from the accessibility tree and
         * interaction flow.
         */
        intro.style.pointerEvents =
            "none";

        /**
         * Dispatch a custom event so other homepage scripts can
         * optionally know that the intro was intentionally skipped.
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
     * A normal homepage visit reaches this point.
     *
     * Therefore the cinematic intro is allowed to play.
     */
    intro.classList.add(
        "intro-active"
    );

    intro.setAttribute(
        "aria-hidden",
        "false"
    );


    /* ============================================================
    9. INTRO OPENING
    ============================================================ */

    /**
     * The entrance animations on the logo/text are separate from
     * the actual diagonal panel reveal.
     *
     * Therefore we do NOT wait for "animationend" on the intro root.
     *
     * Instead:
     *
     *   intro-active
     *        ↓
     *   wait for the branding entrance
     *        ↓
     *   intro-opening
     *        ↓
     *   panels move apart
     *        ↓
     *   intro-finished
     *        ↓
     *   intro is removed
     */


    /**
     * Prevent finishIntro() from being executed more than once.
     */
    let introFinished = false;


    /**
     * Begin the diagonal panel reveal.
     */
    function startIntroOpening() {

        /*
        * If the intro has already finished, do nothing.
        */
        if (introFinished) {
            return;
        }


        /*
        * Force the browser to render the panels in their original
        * position BEFORE we add "intro-opening".
        *
        * This is important because the opening is a CSS transition
        * from:
        *
        *     translate3d(0, 0, 0)
        *
        * to:
        *
        *     translate3d(-115%, -115%, 0)
        *
        * and:
        *
        *     translate3d(115%, 115%, 0)
        *
        * Reading offsetWidth forces a layout/reflow so the browser
        * cannot combine both states into a single frame.
        */
        void intro.offsetWidth;


        /*
        * Tell the CSS that it is now time to open the intro.
        *
        * bg_panel.css already contains the corresponding rules:
        *
        * .intro-opening .intro-panel--purple
        * .intro-opening .intro-panel--gold
        */
        intro.classList.add(
            "intro-opening"
        );


        /*
        * Wait for the diagonal panel transition to finish.
        *
        * The CSS transition is 1.35 seconds.
        *
        * We deliberately use a timer here rather than relying only
        * on transitionend, because transitionend can fail to fire
        * in some situations (for example if the element is removed
        * or the transition is disabled).
        */
        window.setTimeout(
            finishIntro,
            1400
        );
    }


    /* ============================================================
    10. FINISH INTRO
    ============================================================ */

    /**
     * Completely finish the cinematic intro.
     */
    function finishIntro() {

        /*
        * Prevent duplicate execution.
        */
        if (introFinished) {
            return;
        }

        introFinished = true;


        /*
        * Remove the active state.
        *
        * The panels have already moved away at this point.
        */
        intro.classList.remove(
            "intro-active"
        );


        /*
        * IMPORTANT:
        *
        * The original CSS uses "intro-finished".
        *
        * The old JavaScript incorrectly used "intro-complete".
        *
        * Keep the class name identical to the CSS.
        */
        intro.classList.add(
            "intro-finished"
        );


        /*
        * Make sure the finished intro cannot intercept clicks.
        */
        intro.style.pointerEvents =
            "none";


        /*
        * Restore normal page scrolling.
        */
        document.body.classList.remove(
            "intro-active"
        );


        /*
        * Tell other scripts that the intro has completed.
        */
        document.dispatchEvent(
            new CustomEvent(
                "superiors:introComplete"
            )
        );


        /*
        * Remove the intro after its short CSS fade.
        *
        * The original CSS uses a 0.25 second fade.
        */
        window.setTimeout(() => {

            if (intro.parentNode) {
                intro.remove();
            }

        }, 300);
    }


    /* ============================================================
    11. START THE OPENING SEQUENCE
    ============================================================ */

    /**
     * Give the emblem, "Meet", title and decoration enough time to
     * finish their entrance animations before opening the panels.
     *
     * The longest original entrance animation finishes at roughly
     * 1.8 seconds, so 2.1 seconds gives the branding a brief moment
     * to remain fully visible.
     */
    window.setTimeout(
        startIntroOpening,
        2100
    );


    /* ============================================================
    12. SAFETY FALLBACK
    ============================================================ */

    /**
     * The intro must NEVER permanently trap the visitor.
     *
     * If something prevents the normal sequence from completing,
     * force the intro to finish after 7 seconds.
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
