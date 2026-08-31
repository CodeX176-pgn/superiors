# SUPERIORS — Student Data Guide

This file explains how to add, edit, and manage student information for the SUPERIORS directory.

> **Important:** The actual student data is stored in:
>
> `assets/data.json`
>
> This file is only a **template and reference guide**. Do not put actual student records in `DATA.md`.

---

# Data Flow

The student data follows this structure:

```text
assets/data.json
       │
       ▼
   js/data.js
       │
       ▼
 window.students
       │
       ├───────────────┐
       ▼               ▼
 Directory         Profile Page
```

`assets/data.json` is the **single source of truth** for student information.

---

# Adding a New Student

To add a new student:

1. Open `assets/data.json`.
2. Find the `"students"` array.
3. Add a new student object.
4. Fill in the available information.
5. Add the student's images to:

   ```text
   assets/images/students/
   ```
6. Use the correct image paths in the JSON.
7. Add social-media accounts using the current `socialMedia` list structure.
8. **Do not manually add a `serialNumber`.**
9. Make sure the JSON syntax is valid.
10. Save the file and refresh the website.

---

# Student Template

Copy this template into the `"students"` array in `assets/data.json`:

```json
{
    "name": "Student Full Name",
    "nickname": "Student Nickname",
    "title": "Student Title",
    "phone": "+234 000 000 0000",

    "dateOfBirth": "01 January 2009",
    "stateOfOrigin": "State Name",

    "hobbies": [
        "Hobby One",
        "Hobby Two"
    ],

    "favoriteAnime": "Anime Name",
    "favoriteGame": "Game Name",
    "favoriteColor": "Color",
    "bestSubject": "Subject",

    "socialMedia": [
        {
            "platform": "github",
            "username": "github_username",
            "displayName": "GitHub Display Name"
        },
        {
            "platform": "tiktok",
            "username": "tiktok_username",
            "displayName": "TikTok Display Name"
        }
    ],

    "image": "assets/images/students/student-main.png",
    "hoverImage": "assets/images/students/student-hover.png"
}
```

You do **not** have to fill every optional field.

If information is unavailable, either omit the field or use the empty value supported by the project.

---

# Supported Student Fields

## `name`

The student's full name.

### Example

```json
"name": "John Doe"
```

**Required:** Yes

The application uses the name when:

* Displaying the student card.
* Displaying the profile.
* Sorting students alphabetically.
* Searching for students.

---

## `nickname`

The student's nickname.

### Example

```json
"nickname": "JD"
```

If there is no nickname:

```json
"nickname": ""
```

**Required:** No

---

## `title`

The student's role, position, or title.

### Example

```json
"title": "Class Representative"
```

If there is no title:

```json
"title": ""
```

**Required:** No

---

## `phone`

The student's phone number.

### Example

```json
"phone": "+234 801 234 5678"
```

If unavailable:

```json
"phone": ""
```

**Required:** No

---

## `dateOfBirth`

The student's date of birth.

### Recommended format

```json
"dateOfBirth": "15 March 2009"
```

**Required:** No

Keep the format consistent across the dataset.

---

## `stateOfOrigin`

The student's state of origin.

### Example

```json
"stateOfOrigin": "Enugu"
```

**Required:** No

---

## `hobbies`

A list of the student's hobbies.

### Example

```json
"hobbies": [
    "Reading",
    "Gaming",
    "Drawing"
]
```

If there are no hobbies to display:

```json
"hobbies": []
```

**Required:** No

---

## `favoriteAnime`

The student's favorite anime.

### Example

```json
"favoriteAnime": "Naruto"
```

**Required:** No

---

## `favoriteGame`

The student's favorite game.

### Example

```json
"favoriteGame": "Minecraft"
```

**Required:** No

---

## `favoriteColor`

The student's favorite color.

### Example

```json
"favoriteColor": "Black"
```

**Required:** No

---

## `bestSubject`

The student's best or favorite school subject.

### Example

```json
"bestSubject": "Mathematics"
```

**Required:** No

---

# Social Media

Social-media accounts are stored inside the `socialMedia` array.

Each entry contains **three values**:

* `platform` — identifies the social-media platform.
* `username` — the account username/handle used to build the profile URL.
* `displayName` — the name the student displays on that platform.

Example:

```json
"socialMedia": [
    {
        "platform": "github",
        "username": "CodeX176-pgn",
        "displayName": "CodeX"
    },
    {
        "platform": "tiktok",
        "username": "example_user",
        "displayName": "Example"
    }
]
```

Only add platforms that the student actually has.

---

## How the Values Are Used

The website uses the values differently depending on where they appear:

| Website element           | Value used    |
| ------------------------- | ------------- |
| Social-media platform     | `platform`    |
| Social-media button URL   | `username`    |
| Profile information table | `displayName` |

For example:

```json
{
    "platform": "tiktok",
    "username": "example_user",
    "displayName": "Example"
}
```

The social-media button uses:

```text
example_user
```

to open the student's TikTok account.

The profile information table displays:

```text
Example
```

The username shown in the profile information table is **not a clickable link**.

---

# Supported Social Platforms

The currently supported platforms are:

| Platform | `platform` value |
| -------- | ---------------- |
| GitHub   | `github`         |
| TikTok   | `tiktok`         |
| YouTube  | `youtube`        |
| Twitter  | `twitter`        |
| X        | `x`              |
| Facebook | `facebook`       |

The social-media configuration is handled by:

```text
js/social.js
```

---

# Social Media URLs

You normally only need to provide the account username/handle.

You do **not** need to enter the complete external URL.

For example:

```json
{
    "platform": "github",
    "username": "CodeX176-pgn",
    "displayName": "CodeX"
}
```

The application uses the username according to the URL rules configured in:

```text
js/social.js
```

This allows the social-media URL format to remain centralized in the project instead of being repeated throughout the student data.

---

# Student Images

Student images are stored in:

```text
assets/images/students/
```

For example:

```text
assets/
└── images/
    └── students/
        ├── john-main.png
        └── john-hover.png
```

The JSON should reference them using:

```json
"image": "assets/images/students/john-main.png",
"hoverImage": "assets/images/students/john-hover.png"
```

## Important

Always include the `assets/` portion of the path:

```text
assets/images/students/...
```

Do **not** use:

```text
images/students/...
```

when following the current project structure.

---

# Main Image

The `image` field contains the normal image displayed on the student card and profile.

### Example

```json
"image": "assets/images/students/john-main.png"
```

---

# Hover Image

The `hoverImage` field contains the alternate image used by the student-card hover interaction.

### Example

```json
"hoverImage": "assets/images/students/john-hover.png"
```

If a student does not have a separate hover image, follow the fallback behavior already implemented by the project rather than inventing a new path.

---

# Default Profile Image

The project includes a default profile image:

```text
assets/images/students/no_profile.png
```

If a student's image is unavailable, the application can use this image as the fallback.

Do not create a fake student image just to fill an empty field.

---

# Serial Numbers

## Do NOT add `serialNumber`

You should **never manually add this field** to `data.json`.

### Incorrect

```json
{
    "name": "John Doe",
    "serialNumber": "012"
}
```

### Correct

```json
{
    "name": "John Doe"
}
```

`js/data.js` automatically generates serial numbers after sorting the students alphabetically.

Serial numbers use three digits:

```text
001
002
003
004
...
```

This means you do not need to manually update serial numbers when adding a new student.

---

# Complete Example

The following example uses the current social-media structure:

```json
{
    "students": [
        {
            "name": "Alice Brown",
            "nickname": "Ali",
            "title": "Student",
            "phone": "+234 801 111 1111",

            "dateOfBirth": "12 February 2009",
            "stateOfOrigin": "Enugu",

            "hobbies": [
                "Reading",
                "Drawing"
            ],

            "favoriteAnime": "Naruto",
            "favoriteGame": "Minecraft",
            "favoriteColor": "Purple",
            "bestSubject": "English",

            "socialMedia": [
                {
                    "platform": "github",
                    "username": "alicebrown",
                    "displayName": "Alice Brown"
                },
                {
                    "platform": "tiktok",
                    "username": "alice_brown",
                    "displayName": "Ali"
                }
            ],

            "image": "assets/images/students/alice-main.png",
            "hoverImage": "assets/images/students/alice-hover.png"
        },

        {
            "name": "John Doe",
            "nickname": "JD",
            "title": "Student",
            "phone": "+234 802 222 2222",

            "dateOfBirth": "25 June 2009",
            "stateOfOrigin": "Anambra",

            "hobbies": [
                "Gaming",
                "Programming"
            ],

            "favoriteAnime": "Jujutsu Kaisen",
            "favoriteGame": "Minecraft",
            "favoriteColor": "Black",
            "bestSubject": "Mathematics",

            "socialMedia": [
                {
                    "platform": "github",
                    "username": "johndoe",
                    "displayName": "John Doe"
                },
                {
                    "platform": "youtube",
                    "username": "johndoe",
                    "displayName": "John"
                }
            ],

            "image": "assets/images/students/john-main.png",
            "hoverImage": "assets/images/students/john-hover.png"
        }
    ]
}
```

---

# Adding Another Student

Suppose `data.json` currently contains:

```json
{
    "students": [
        {
            "name": "Alice Brown"
        }
    ]
}
```

To add another student, place a comma after the existing object and add the new object:

```json
{
    "students": [
        {
            "name": "Alice Brown"
        },

        {
            "name": "John Doe"
        }
    ]
}
```

The application will automatically sort the students alphabetically and generate their serial numbers.

---

# JSON Rules

Because `assets/data.json` is a JSON file, follow these rules carefully.

## Use double quotes

Correct:

```json
"name": "John Doe"
```

Incorrect:

```json
'name': 'John Doe'
```

---

## Separate properties with commas

Correct:

```json
{
    "name": "John Doe",
    "nickname": "JD"
}
```

---

## Do not add a trailing comma

Incorrect:

```json
{
    "name": "John Doe",
}
```

Correct:

```json
{
    "name": "John Doe"
}
```

---

## Use arrays correctly

Correct:

```json
"hobbies": [
    "Gaming",
    "Reading"
]
```

---

## Use the social-media list correctly

Correct:

```json
"socialMedia": [
    {
        "platform": "github",
        "username": "example",
        "displayName": "Example"
    },
    {
        "platform": "tiktok",
        "username": "example_user",
        "displayName": "Example User"
    }
]
```

Do **not** use the old object-based format:

```json
"socialMedia": {
    "github": "example",
    "tiktok": "example_user"
}
```

The current project uses the **list/array format** so that each social-media account can contain both a username and a display name.

---

# Quick Add-Student Checklist

Before saving `assets/data.json`, check:

* [ ] Student name has been added.
* [ ] Nickname has been added if available.
* [ ] Title has been added if available.
* [ ] Phone number has been added if appropriate.
* [ ] Date of birth has been added if appropriate.
* [ ] State of origin has been added if appropriate.
* [ ] Hobbies have been added if available.
* [ ] Favorite anime has been added if available.
* [ ] Favorite game has been added if available.
* [ ] Favorite color has been added if available.
* [ ] Best subject has been added if available.
* [ ] Available social-media accounts have been added.
* [ ] Every social-media entry has a `platform`.
* [ ] Every social-media entry has a `username`.
* [ ] Every social-media entry has a `displayName`.
* [ ] Main image has been placed in `assets/images/students/`.
* [ ] Hover image has been placed in `assets/images/students/` if available.
* [ ] Image paths start with `assets/images/`.
* [ ] No `serialNumber` was manually added.
* [ ] JSON uses double quotes.
* [ ] JSON has no trailing commas.
* [ ] JSON brackets and braces are correctly closed.
* [ ] The website was tested after saving.

---

# File Locations

| Purpose                    | File                                    |
| -------------------------- | --------------------------------------- |
| Student database           | `assets/data.json`                      |
| Data loader                | `js/data.js`                            |
| Social-media configuration | `js/social.js`                          |
| Student images             | `assets/images/students/`               |
| Default profile image      | `assets/images/students/no_profile.png` |
| Data documentation         | `DATA.md`                               |
| Project documentation      | `README.md`                             |
| Automated QA               | `tests/qa.test.js`                      |

---

# Important Reminder

The file you actually edit when adding students is:

```text
assets/data.json
```

The file you are reading now:

```text
DATA.md
```

is only the **instruction/template file**.

Keep the two separate:

```text
DATA.md
    ↓
Documentation / instructions

assets/data.json
    ↓
Actual student information
```

This keeps the project easier to maintain and makes it clear where new student records should be add
