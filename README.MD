
![ByteCoder/Artist Header Image](Slide%2016_9%20-%2013.png)

# ByteCoder/Artist

A modern, interactive web agency website showcasing and offering advanced animations, 3D effects, and smooth scrolling.

## Description

This project is a dynamic web presence for "ByteCoder/Artist", featuring visually engaging elements such as a smooth scroll experience, animated section transitions, 3D graphics, interactive background grids, and distinct layouts for showcasing team members, work samples, skills, and client reviews. It utilizes a combination of standard web technologies and powerful JavaScript libraries for animations and 3D rendering.

## Features

*   **Smooth Scrolling:** Powered by Lenis for a fluid scroll experience.
*   **Interactive Hero Section:** SVG path reacts to mouse movement.
*   **Parallax Video Intro:** Video container scales and follows mouse slightly as you scroll past the introduction.
*   **Animated Team Section:** Profile images trigger animated text transitions and scaling on hover (desktop). Responsive layout for mobile.
*   **3D Tunnel Transition:** A dynamic 3D tunnel effect using Three.js appears between sections, controlled by scroll.
*   **Animated Work Section:** Horizontal scrolling cards combined with animated 3D letters following paths (desktop). Responsive stacking cards for mobile.
*   **Dynamic Skills Section:** Marquee animation and scroll-triggered reveal of skill pills.
*   **Interactive Review Section:** Canvas-based triangular grid animation with a fill effect synchronized with scroll, layered over horizontal-scrolling review cards.
*   **Animated Footer:** Section titles and a large text logo animate into view on scroll.
*   **Full-screen Nav Menu:** Animated menu overlay with hover effects and text shuffling.
*   **Scroll-based Menu Highlighting:** Menu links highlight automatically based on the currently visible section in the viewport.
*   **Preloader:** (Included in `2.HTML` and JS, can be integrated into `index.html`) A loading screen with a counter and animated circles.
*   **Responsive Design:** Adjustments for different screen sizes, adapting layouts and animations.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES Modules)
*   [GSAP (GreenSock Animation Platform)](https://greensock.com/) - Core animation library with plugins:
    *   ScrollTrigger
    *   CustomEase
    *   SplitText
*   [Lenis](https://lenis.darkroom.engineering/) - Smooth scrolling library
*   [SplitType](https://splittype.js.org/) - Text splitting library for animations
*   [Three.js](https://threejs.org/) - 3D graphics library for tunnel and work section text
*   [Font Awesome](https://fontawesome.com/) - Icons (used in head but not visible in HTML snippets provided)
*   [Ionicons](https://ionic.io/ionicons/) - Icons (used for menu close/logo)
*   Vimeo (Video embed)

## Getting Started

To view and run this project locally:

1.  **Clone or Download:** Download the project files or clone the repository to your local machine.
2.  **Navigate:** Open the project folder in your file explorer or terminal.
3.  **Run a Local Server:** Due to how some modern browser features (like ES modules with local paths) handle files, it's best to run a simple local web server.
    *   **Using Python:** If you have Python installed, open your terminal in the project directory and run `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
    *   **Using Node.js (`http-server`):** If you have Node.js installed, you can install `http-server` globally (`npm install -g http-server`) and then run `http-server` in the project directory.
    *   **Using VS Code Live Server:** If you use VS Code, install the "Live Server" extension and right-click `index.html` (or `2.HTML`) and select "Open with Live Server".
4.  **Open in Browser:** Open your web browser and go to the address provided by the local server (usually `http://localhost:8000` or similar).

The main page (`index.html`) should load, showcasing the interactive features. `2.HTML` provides an alternative version, notably including a preloader.

## Project Structure

```
.
├── 2.HTML
├── 3d website.png
├── IMG-20240803-WA0053 1.png
├── Screenshot 2025-05-17 190136.png
├── Slide 16_9 - 13.png
├── Untitled-Thumbnail(1).jpg
├── hackathon round 2-Cover.jpg
├── index.html
├── logitech.png
├── script.js
├── script2.js
├── starbucks.jpg
├── style.css
├── style2.css
├── suiton.png
└── uber clone.png
```

*   `index.html`: The main HTML file (without the loader in the provided snippet). Uses `style.css` and `script.js`.
*   `2.HTML`: An alternative HTML file (includes the loader in the provided snippet). Uses `style2.css` and `script2.js`.
*   `style.css`: CSS for `index.html`.
*   `style2.css`: CSS for `2.HTML`.
*   `script.js`: JavaScript with animations and logic for the main site features, including loader logic (though the loader HTML is not in the provided `index.html`). Uses ES Modules.
*   `script2.js`: JavaScript for `2.HTML` (content not provided).
*   Image files (`.png`, `.jpg`): Various assets used throughout the site.

## Credits and Acknowledgements

*   Built with [GSAP](https://greensock.com/), [Lenis](https://lenis.darkroom.engineering/), [SplitType](https://splittype.js.org/), and [Three.js](https://threejs.org/).
*   Uses icons from [Font Awesome](https://fontawesome.com/) and [Ionicons](https://ionic.io/ionicons/).
