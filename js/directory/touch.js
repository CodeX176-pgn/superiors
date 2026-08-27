/**
 * ============================================================
 * SUPERIORS — TOUCH CARD INTERACTIONS
 * ============================================================
 *
 * Desktop browsers can use CSS :hover, but touchscreens do not have
 * a traditional hover state. This module provides the touch equivalent
 * by toggling the `.active` class on the tapped student card.
 *
 * Event delegation is used because search.js/render.js replace cards
 * dynamically. One listener on the grid therefore works for every
 * current and future card.
 * ============================================================
 */

(() => {
    "use strict";

    const directory = window.SuperiorsDirectory =
        window.SuperiorsDirectory || {};

    const { studentsGrid } = directory.dom;

    /**
     * Return whether the current device reports that it has no hover
     * capability. This keeps touch behavior away from normal desktops.
     */
    function isTouchDevice() {
        return window.matchMedia("(hover: none)").matches;
    }

    /**
     * Remove the active state from every rendered student card.
     */
    function clearActiveCards() {
        if (!studentsGrid) {
            return;
        }

        studentsGrid
            .querySelectorAll(".student-card")
            .forEach((card) => {
                card.classList.remove("active");
            });
    }

    /**
     * Attach the touch-card listeners once the DOM references exist.
     */
    function initializeTouchInteractions() {
        if (!studentsGrid) {
            return;
        }

        /**
         * Event delegation keeps this listener valid even after search
         * results cause the student cards to be recreated.
         */
        studentsGrid.addEventListener("click", (event) => {
            if (!isTouchDevice()) {
                return;
            }

            const card = event.target.closest(".student-card");

            if (!card) {
                return;
            }

            /**
             * Links already have meaningful actions. Do not turn a tap
             * on a phone/social/profile link into a touch-state toggle.
             */
            if (event.target.closest("a")) {
                return;
            }

            /**
             * Only one card should remain active at a time.
             */
            studentsGrid
                .querySelectorAll(".student-card")
                .forEach((otherCard) => {
                    if (otherCard !== card) {
                        otherCard.classList.remove("active");
                    }
                });

            card.classList.toggle("active");
        });

        /**
         * Tapping anywhere outside a card clears the active state.
         */
        document.addEventListener("click", (event) => {
            if (!isTouchDevice()) {
                return;
            }

            if (event.target.closest(".student-card")) {
                return;
            }

            clearActiveCards();
        });
    }

    directory.touch = {
        isTouchDevice,
        clearActiveCards,
        initializeTouchInteractions
    };
})();
