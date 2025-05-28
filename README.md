# Slide Timer Overlay

A Chrome extension that overlays a transparent timer on top of Google Slides presentations.

## Features

- Three timer modes:
  - Count Up
  - Count Down
  - Count Down + Overrun (continues to count up after reaching zero, in red)
- Configurable position: top-right, top-left, bottom-left, bottom-right, center
- Configurable size: normal, large, extra-large
- Optional alarm with sound and shake animation
- Simple, user-friendly interface

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** in the top right
4. Click **Load unpacked** and select this project folder
5. You will see the Slide Timer icon appear in the Chrome toolbar

## How to Use

1. Open your Google Slides presentation
2. Start presentation mode
3. Click the Slide Timer extension icon in the toolbar
4. Choose timer mode, duration, position, size, and alarm option
5. Click **Start** to begin the overlay timer
6. Use **Stop** to remove the overlay

## Keyboard Shortcut (Recommended for Presentation Mode)

When using Google Slides in presentation mode, Chrome disables normal extension popups.
Therefore, the **only way to activate the Slide Timer** is via a keyboard shortcut.

We highly recommend setting a keyboard shortcut as follows:

1. Go to: `chrome://extensions/shortcuts`
2. Find "Slide Timer Overlay"
3. Set a shortcut (e.g., `Ctrl+Shift+T` or `Cmd+Shift+T`) for **"Activate the extension"**

Once set, you can launch the timer overlay during a presentation by simply using the shortcut key.

## License

This project is licensed under the MIT License - see the LICENSE file for details.