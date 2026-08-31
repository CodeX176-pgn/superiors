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

# Social Media Data Structure

Each student's social-media accounts are stored as a list in `assets/data.json`.
Every entry identifies the platform and keeps the account **username** separate from the student's **display name** on that platform.

```json
"socialMedia": [
    {
        "platform": "github",
        "username": "example_username",
        "displayName": "Example Name"
    },
    {
        "platform": "tiktok",
        "username": "example_user",
        "displayName": "Example"
    }
]
```

The two account values have different purposes:

| Value | Purpose |
| --- | --- |
| `username` | Used to build the external social-media profile URL. |
| `displayName` | Displayed in the student's profile information table. |

For example, if a TikTok account has `username` set to `example_user` and `displayName` set to `Example`, the social button opens the account associated with `@example_user`, while the profile table displays `Example`.

The `platform` value tells the application which social network is being represented and which URL/icon configuration to use.

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
