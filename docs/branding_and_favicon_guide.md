# Favicon & Branding Implementation Guide

## Overview

This document outlines the process used to create and implement the website's favicon and branding assets. It serves as a reference for future projects to ensure consistent quality and technical implementation.

## 1. Design Phase (AI Generation)

We used an AI image generation tool to create a unique, meaningful logo.

**Prompt Strategy:**

- **Subject:** Stylized golden lotus flower (represents purity, wellness, Thai tradition).
- **Background:** Deep dark teal (contrast, premium feel).
- **Style:** Minimalist, flat design, vector-style lines, high contrast.
- **Constraints:** Centered, symmetrical, no text (crucial for small scales like favicons).

**Prompt:**

> "A minimalist, elegant logo icon for 'Suksan Massage'. A stylized golden lotus flower on a deep dark teal background. High contrast, flat design, clean vector-style lines. Centered and symmetrical. Suitable for small sizes (favicon). No text."

## 2. Technical Implementation (Next.js App Router)

### File Placement

In the Next.js App Router (v13+), special files located in `src/app/` are automatically detected and used for metadata.

- **`src/app/favicon.ico`**: The standard browser favicon.
- **`src/app/icon.png`**: High-res icon for modern browsers and devices (usually 192x192 or 512x512).
- **`src/app/apple-icon.png`**: Specifically for Apple devices (usually 180x180).

### Image Processing (ImageMagick)

We used ImageMagick (`magick`) to convert the high-quality generation into the specific formats required.

**Commands Used:**

1.  **Multi-size ICO:** Combines 48px, 32px, and 16px versions into one file for broad compatibility.
    ```bash
    magick source_image.png -define icon:auto-resize=48,32,16 src/app/favicon.ico
    ```
2.  **Standard Icon:**
    ```bash
    magick source_image.png -resize 192x192 src/app/icon.png
    ```
3.  **Apple Touch Icon:**
    ```bash
    magick source_image.png -resize 180x180 src/app/apple-icon.png
    ```

## 3. Web App Manifest

To fully support Progressive Web Apps (PWA) and ensure the site looks good when added to a home screen, we implemented a `manifest.ts` file.

**Location:** `src/app/manifest.ts`

**Key Configuration:**

- `short_name`: Used on home screens (space limited).
- `theme_color`: Matches the brand's primary color (affects browser address bars on mobile).
- `display`: `standalone` (removes browser chrome when installed).
- `icons`: explicit link to the generated icons.

## Checklist for Future Projects

1.  [ ] **Generate/Design Master Logo:** Ensure high contrast and legibility at small sizes.
2.  [ ] **Install ImageMagick:** Ensure the tool is available for processing.
3.  [ ] **Process Images:** Create `.ico` (multi-size), `icon.png`, and `apple-icon.png`.
4.  [ ] **Place Files:** Put them directly in `src/app/`.
5.  [ ] **Create Manifest:** Add `src/app/manifest.ts` with brand colors and icon references.
6.  [ ] **Verify:** Check browser tab, save to mobile home screen, and inspect `head` tags.
