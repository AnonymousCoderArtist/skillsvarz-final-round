![ByteCoder/Artist Header Image](https://github.com/AnonymousCoderArtist/skillsvarz-final-round/blob/main/Slide%2016_9%20-%2021.png)

# ByteCoder/Artist

✨🎨 A modern, interactive web agency website showcasing and offering advanced animations, 3D effects, and smooth scrolling. ✨

## Description

This project is a dynamic web presence for "ByteCoder/Artist", featuring visually engaging elements such as a fluid scroll experience, animated section transitions, stunning 3D graphics, interactive background grids, and distinct layouts for showcasing the team, work samples, skills, and client reviews. It leverages a powerful stack of standard web technologies combined with cutting-edge JavaScript libraries for high-performance animations and immersive 3D rendering.

## Features

Here's a glimpse of the cool stuff you'll find:

*   ➡️ **Smooth Scrolling:** Experience buttery-smooth navigation with [Lenis](https://lenis.darkroom.engineering/).
*   🖱️ **Interactive Hero Section:** The initial SVG path dynamically reacts to your mouse movements.
*   🎬 **Parallax Video Intro:** A showreel video container scales and subtly follows the mouse as you scroll past the introduction.
*   👥 **Animated Team Section:** Profile images aren't just pictures! On desktop, hovering over them triggers animated text transitions and delightful scaling effects. Includes a thoughtful responsive layout for mobile.
*   🌌 **3D Tunnel Transition:** Dive into a dynamic 3D tunnel effect, built with [Three.js](https://threejs.org/), that seamlessly connects sections and is controlled by your scroll.
*   🖼️ **Animated Work Section:** Showcases your projects with a captivating horizontal-scrolling card layout on desktop, layered with animated 3D letters following intricate paths. Falls back to responsive stacking cards for mobile.
*   💊 **Dynamic Skills Section:** Features a vibrant, continuous marquee animation combined with a scroll-triggered reveal effect for the skill pills.
*   ✨ **Interactive Review Section:** A visually striking canvas-based triangular grid animates with a synchronized fill effect as you scroll, creating a dynamic background for the horizontally-scrolling review cards.
*   ✉️ **Animated Footer:** The footer content, including section titles and a large text logo, gracefully animates into view upon scrolling.
*   🍔 **Full-screen Nav Menu:** A stylish animated overlay menu provides easy navigation with smooth transitions, hover effects, and a text shuffling animation.
*   📍 **Scroll-based Menu Highlighting:** Navigation links in the menu intelligently highlight automatically to indicate the section currently visible in the viewport.
*   ⏳ **Preloader:** (Implemented in `2.HTML` and `script.js`) Provides a polished loading experience with a counter and engaging animated circles before the main content appears.
*   📱 **Responsive Design:** The layout, styling, and animations are carefully adjusted across different screen sizes to ensure a great experience on desktops, tablets, and mobile devices.

## Technologies Used 🛠️

This project is built upon a robust foundation using the following technologies and libraries:

*   🌐 **HTML5:** Providing the semantic structure of the web pages.
*   🎨 **CSS3:** Styling the visuals, handling layout, and basic responsiveness.
*   💻 **JavaScript (ES Modules):** The core engine for interactivity, complex animations, and 3D rendering.
*   ✨ **[GSAP (GreenSock Animation Platform)](https://greensock.com/):** The industry-standard JavaScript animation library, powering most of the complex sequenced and scroll-driven animations.
    *   **ScrollTrigger:** Enabling powerful scroll-based interactions and pinning effects.
    *   **CustomEase:** Defining unique, smooth animation curves.
    *   **SplitText:** Advanced text splitting for character-level animations.
*   🎢 **[Lenis](https://lenis.darkroom.engineering/):** For achieving that signature smooth scroll physics.
*   📐 **[SplitType](https://splittype.js.org/):** Simplifying the process of splitting text elements into words or characters for animation.
*   📦 **[Three.js](https://threejs.org/):** The powerful 3D library used to render the animated tunnel and the dynamic letter paths in the work section.
*   🖼️ [Font Awesome](https://fontawesome.com/) & [Ionicons](https://ionic.io/ionicons/): Providing scalable vector icons used throughout the design.
*   ▶️ Vimeo: Used for embedding the video content.

## Getting Started 🚀

To explore and run this project on your local machine, follow these simple steps:

1.  ⬇️ **Clone or Download:** Get the project files by cloning the repository using `git clone [repository_url]` or by downloading the ZIP archive.
2.  📁 **Navigate:** Open your terminal or file explorer and move into the root project directory.
3.  🖥️ **Run a Local Server:** Modern browser security policies (especially for ES modules and local file access) often require files to be served over HTTP. The easiest way is typically:
    *   **Recommended (VS Code):** If you use Visual Studio Code, install the "Live Server" extension. Right-click on `index.html` or `2.HTML` and select "Open with Live Server".
    *   **Python:** If you have Python installed, open your terminal in the project directory and run `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
    *   **Node.js:** If you have Node.js installed, you can install `http-server` globally (`npm install -g http-server`) and then run `http-server` in the project directory.
4.  🌐 **Open in Browser:** Once the local server is running, open your preferred web browser and navigate to the address provided by the server (usually `http://localhost:8000` or a similar address).

The `index.html` file will launch the main version of the site, while `2.HTML` includes the animated preloader experience.

## Project Structure 📁

The project directory contains the following files and folders:

| File/Directory                | Description                                                                                                                               |
| :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `.`                           | The root directory of the project.                                                                                                        |
| `2.HTML`                      | An alternative entry point HTML file that includes the animated preloader. It links to `style2.css` and `script2.js`.                      |
| `index.html`                  | The main entry point HTML file, showcasing the primary website experience without the preloader in the initial load. Links to `style.css` and `script.js`. |
| `style.css`                   | The primary CSS stylesheet for `index.html`, containing general styling, responsiveness, and specific section styles.                       |
| `style2.css`                  | The CSS stylesheet for `2.HTML`, including styles for the preloader and potentially variations in section styling/responsiveness.            |
| `script.js`                   | The main JavaScript file for `index.html`, implementing all the advanced animations, scroll triggers, 3D effects, and interactive features. Uses ES Modules. |
| `script2.js`                  | The JavaScript file for `2.HTML`, expected to include the preloader logic and potentially integrate animations similar to `script.js`. (Content not fully provided in snippet). |
| `3d website.png`              | An image asset. (Likely a project thumbnail or showcase image).                                                                           |
| `IMG-20240803-WA0053 1.png`   | An image asset, used as one of the profile images in the Team section.                                                                    |
| `Screenshot 2025-05-17 190136.png`| An image asset, used as a thumbnail for a project in the Work section.                                                                    |
| `Slide 16_9 - 13.png`         | An image asset, used as a thumbnail in the Work section and as the background image for the Reviews section.                               |
| `Untitled-Thumbnail(1).jpg`   | An image asset, used as a thumbnail for a project (Portfolio) in the Work section.                                                        |
| `hackathon round 2-Cover.jpg` | An image asset, used as a thumbnail for a project (CineVerse) in the Work section.                                                        |
| `logitech.png`                | An image asset, used as a thumbnail for a project (Logitech Redesign) in the Work section.                                                |
| `starbucks.jpg`               | An image asset, used as a thumbnail for a project (Starbucks Redesign) in the Work section.                                               |
| `suiton.png`                  | An image asset, used as a thumbnail for a project (Suiton) in the Work section.                                                           |
| `uber clone.png`              | An image asset. (Listed in the file structure but not explicitly used in the provided HTML snippets).                                     |

## Credits and Acknowledgements 🙏

A heartfelt thank you to the incredible open-source community AND Gravity Coding for organizing SkillsVarz 1.0 and the developers behind these amazing libraries and resources:

*   [GSAP](https://greensock.com/)
*   [Lenis](https://lenis.darkroom.engineering/)
*   [SplitType](https://splittype.js.org/)
*   [Three.js](https://threejs.org/)
*   [Font Awesome](https://fontawesome.com/) & [Ionicons](https://ionic.io/ionicons/)
