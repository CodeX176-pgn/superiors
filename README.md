# SUPERIORS

SUPERIORS is a responsive student-directory website built with vanilla HTML, CSS, and JavaScript.

The project is designed to present student information in a clean directory interface with searchable student cards, individual profile pages, social-media links, responsive layouts, animations, and accessibility-friendly interactions.

---

## Features

- Search students by name or serial number.
- Case-insensitive search.
- Partial-name search.
- Search-field whitespace trimming.
- Automatic alphabetical student ordering.
- Automatic three-digit serial-number generation.
- Student cards with:
  - Profile image
  - Serial number
  - Name
  - Nickname
  - Title
  - Phone number
  - Social-media links
- Hover image transitions.
- Touch-friendly student-card interactions.
- Dynamic profile pages using:

  `profile.html?id=<serialNumber>`

- Dynamic profile information tables.
- Social-media links shown only when a student has a corresponding social-media value.
- Default profile-image fallback for students without an image.
- Sticky profile image on larger screens.
- Responsive layouts for:
  - Mobile phones
  - Tablets
  - Laptops
  - Desktops
- Remix Icon integration.
- Keyboard accessibility.
- Skip links.
- Accessible labels and live announcements.
- Visible focus states.
- Reduced-motion support.
- Empty search-result state.
- Lightweight Node.js QA tests.
- No frontend framework or build system required.

---

# Project Structure

```text
SUPERIORS/
│
├── index.html
├── profile.html
├── README.md
│
├── assets/
│   │
│   ├── data.json
│   │
│   ├── images/
│   │   ├── superiors_background.png
│   │   ├── superiors_icon.png
│   │   │
│   │   └── students/           <- Students images folder
│   │
│   └── remixicon/
│       ├── remixicon.css
│       ├── remixicon.eot
│       ├── remixicon.svg
│       ├── remixicon.ttf
│       ├── remixicon.woff
│       └── remixicon.woff2
│
├── css/
│   │
│   ├── base.css
│   ├── header.css
│   ├── cards.css
│   ├── profile.css
│   ├── footer.css
│   ├── accessibility.css
│   ├── responsive.css
│   │
│   ├── intro/
│   ├── intro_root.css
│   ├── bg_panel.css
│   ├── edge_highlight.css
│   ├── particles.css
│   ├── intro_content.css
│   ├── emblem.css
│   ├── title.css
│   ├── animations.css
│   └── intro_responsive.css
|
├── js/
│   │
│   ├── data.js
│   ├── social.js
│   ├── script.js
│   ├── profile.js
│   ├── intro.js
│   │
│   └── directory/
│       ├── dom.js
│       ├── helpers.js
│       ├── social-links.js
│       ├── card.js
│       ├── render.js
│       ├── search.js
│       └── touch.js
│
└── tests/
    └── qa.test.js
