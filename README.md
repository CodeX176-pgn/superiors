# SUPERIORS

**SUPERIORS** is a responsive student-directory website built with vanilla HTML, CSS, and JavaScript.

The project presents student information through an interactive directory with searchable student cards, individual profile pages, social-media links, responsive layouts, animations, and accessibility-friendly interactions.

---

## Features

* Search students by name or serial number.

* Case-insensitive search.

* Partial-name search.

* Search-field whitespace trimming.

* Automatic alphabetical student ordering.

* Automatic three-digit serial-number generation.

* Student cards with:

  * Profile image
  * Serial number
  * Name
  * Nickname
  * Title
  * Phone number
  * Social-media links

* Alternate hover images.

* Touch-friendly student-card interactions.

* Dynamic profile pages using:

  `profile.html?id=<serialNumber>`

* Dynamic profile information tables.

* Social-media information displayed using separate:

  * Username
  * Display name

* Social-media buttons use usernames to open the corresponding external account.

* Social-media display names are shown as plain information in the profile table rather than as links.

* Default profile-image fallback for students without an image.

* Sticky profile image on larger screens.

* Responsive layouts for:

  * Mobile phones
  * Tablets
  * Laptops
  * Desktops

* Remix Icon integration.

* Keyboard accessibility.

* Skip links.

* Accessible labels and live announcements.

* Visible focus states.

* Reduced-motion support.

* Empty search-result state.

* Cinematic opening/intro scene.

* Lightweight Node.js QA tests.

* No frontend framework or build system required.

---

# Social Media Data Structure

Each student's social-media accounts are stored as a list in:

```text
assets/data.json
```

Every social-media entry contains three values:

* `platform`
* `username`
* `displayName`

Example:

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

The values have different purposes:

| Value         | Purpose                                                                            |
| ------------- | ---------------------------------------------------------------------------------- |
| `platform`    | Identifies the social-media platform.                                              |
| `username`    | Used to construct the external social-media profile URL.                           |
| `displayName` | Displayed as the student's name on that platform in the profile information table. |

For example, if a TikTok account contains:

```json
{
    "platform": "tiktok",
    "username": "example_user",
    "displayName": "Example"
}
```

the social-media button uses `example_user` to open the student's TikTok account, while the profile information table displays `Example`.

The username displayed in the profile table is **not a link**.

The supported platforms and their URL/icon configuration are handled by:

```text
js/social.js
```

---

# Project Structure

```text
SUPERIORS/
│
├── index.html
├── profile.html
├── README.md
├── DATA.md
│
├── assets/
│   │
│   ├── data.json
│   │
│   ├── images/
│   │   ├── superiors_background.png
│   │   ├── superiors_icon.png
│   │   │
│   │   └── students/
│   │       └── ...student images...
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
│   └── intro/
│       ├── intro_root.css
│       ├── bg_panel.css
│       ├── edge_highlight.css
│       ├── particles.css
│       ├── intro_content.css
│       ├── emblem.css
│       ├── title.css
│       ├── animations.css
│       └── intro_responsive.css
│
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
```

---

# Technologies

SUPERIORS is built using:

* **HTML5** — page structure and semantic markup.
* **CSS3** — styling, responsive layouts, animations, and visual effects.
* **JavaScript** — student data processing, directory rendering, searching, profiles, social-media links, and interactions.
* **JSON** — storage format for student information.
* **Remix Icon** — interface and social-media icons.
* **Node.js** — lightweight automated QA testing.
* **GitHub Pages** — website deployment.

No frontend framework or build system is required.

---

# Main Pages

## Home Page

```text
index.html
```

The home page contains the student directory, search interface, student cards, header, opening animation, and footer.

---

## Profile Page

```text
profile.html
```

Individual profiles are loaded dynamically using the student's serial number.

Example:

```text
profile.html?id=001
```

The profile page retrieves the matching student from the project data and displays the student's information.

---

# Student Data

Student information is stored in:

```text
assets/data.json
```

The data structure and instructions for adding or editing students are documented in:

```text
DATA.md
```

`DATA.md` should be treated as the reference guide for maintaining the student dataset.

---

# Student Serial Numbers

Serial numbers are generated automatically by the application.

They use a three-digit format:

```text
001
002
003
004
...
```

Students are sorted alphabetically before serial numbers are assigned.

Therefore, **do not manually add or modify `serialNumber` values in `assets/data.json`.**

---

# Images

Student images are stored in:

```text
assets/images/students/
```

Each student can have:

* A main image
* A hover image

Example:

```text
assets/images/students/student-main.png
assets/images/students/student-hover.png
```

If a student's image is unavailable, the project can use:

```text
assets/images/students/no_profile.png
```

as the default profile-image fallback.

---

# Accessibility

Accessibility is an important part of the project.

The website includes:

* Semantic HTML.
* Meaningful image alternative text.
* Keyboard-accessible interactions.
* Skip links.
* Accessible labels.
* Visible focus states.
* Screen-reader-friendly announcements.
* Search-result announcements.
* Reduced-motion support.
* Responsive layouts.

---

# Testing

The project includes lightweight automated QA tests:

```text
tests/qa.test.js
```

These tests can be used to check important project behavior and structure after making changes.

---

# Deployment

SUPERIORS is designed to work as a static website and can be deployed using **GitHub Pages**.

Because the project does not require a frontend build system, the repository can be served directly as a static site.

---

# Versioning

SUPERIORS uses version tags for significant releases.

The recommended format is:

```text
vMAJOR.MINOR.PATCH
```

Examples:

```text
v1.0.0
v1.1.0
v1.1.1
```

### MAJOR

Used for significant redesigns, major architectural changes, or breaking changes.

Example:

```text
v2.0.0
```

### MINOR

Used when adding new features without breaking existing functionality.

Example:

```text
v1.1.0
```

### PATCH

Used for bug fixes, small improvements, or documentation corrections.

Example:

```text
v1.0.1
```

GitHub Releases can be used to provide a public history of stable versions of the project.

---

# Contributing / Editing

When making changes:

1. Update the relevant source files.
2. Keep student information in `assets/data.json`.
3. Follow the structure documented in `DATA.md`.
4. Test the website locally.
5. Run the available QA tests when appropriate.
6. Check the browser console for errors.
7. Test responsive layouts.
8. Check keyboard accessibility.
9. Update documentation when project behavior or structure changes.
10. Create a meaningful Git commit.

---

# Project Documentation

| File               | Purpose                                                                           |
| ------------------ | --------------------------------------------------------------------------------- |
| `README.md`        | Project overview, features, structure, technologies, and development information. |
| `DATA.md`          | Instructions for adding and maintaining student data.                             |
| `assets/data.json` | Actual student dataset.                                                           |
| `tests/qa.test.js` | Automated QA checks.                                                              |

---

# License

No license has currently been specified for the project.

If the project is intended to be reused, modified, or redistributed by others, add an appropriate `LICENSE` file to the repository.
