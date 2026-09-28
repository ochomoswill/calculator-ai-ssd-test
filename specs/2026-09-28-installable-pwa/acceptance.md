# Feature 13: Installable PWA — Acceptance

A1 to A6 are automated under Node's built-in test runner. A7 is manual in a supporting browser.

**A1. Manifest members**
Given the manifest file, when parsed as JSON, then it has name, short_name, start_url "./", display "standalone", background_color, theme_color and an icons array, and prefer_related_applications is absent or false.

**A2. Icon entries and files**
Given the manifest's icons, then there are entries with sizes "192x192" and "512x512", each with type "image/png", each pointing at a file that exists, and each file's PNG header reports the declared width and height.

**A3. Page links**
Given the page, then it contains a link element with rel manifest pointing at the manifest file and a meta theme-color whose content equals the manifest's theme colour.

**A4. Server media types**
Given the static server source, then it maps `.webmanifest` to the manifest media type and `.png` to image/png.

**A5. Deterministic generator**
Given the icon generator, when it encodes 192 and 512 pixel icons in memory, then the bytes equal the committed files exactly.

**A6. Theme colour from tokens**
Given the base stylesheet's light root block, then the manifest's theme_color equals the light accent token value and background_color equals the light background token value.

**A7. Install prompt (manual)**
Given the app served over HTTPS (or localhost) in a Chromium-based browser, when the page loads, then the browser offers installation, and the installed app opens in a standalone window showing the calculator.
