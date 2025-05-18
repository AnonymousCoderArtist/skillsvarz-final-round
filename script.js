import SplitType from "https://esm.sh/split-type";
import * as THREE from "https://esm.sh/three"; // Ensure this is the ONLY way Three.js is imported

gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

let lenis;

function initLenis() {
    // Check if Lenis is globally available
    if (typeof Lenis === 'undefined') {
        // console.warn("Lenis library not found.");
        return;
    }
    // Only initialize if lenis is not already created
    if (!lenis) {
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: "vertical",
                gestureDirection: "vertical",
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false
            });
            lenis.on('scroll', ScrollTrigger.update);
            // Use requestAnimationFrame directly with lenis, not gsap.ticker
            // GSAP ticker lag smoothing can interfere with lenis
            const raf = (time) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);

            // Optional: Remove GSAP ticker sync if using lenis.raf directly
            // If you still want to sync other GSAP animations to lenis:
            // gsap.ticker.lagSmoothing(0); // Still good to disable lag smoothing for other tweens
            // gsap.ticker.add((time) => {
            //     lenis.raf(time * 1000); // lenis expects milliseconds
            // });


        } catch (e) {
            console.error("Failed to initialize Lenis:", e);
            lenis = null; // Ensure lenis is null if initialization fails
        }
    }
}

// Hero SVG Path Animation
var path = "M 10 100 Q 500 100 1800 100"
var finalPath = "M 10 100 Q 500 100 1800 100"
var string = document.querySelector("#string")

if (string) {
    string.addEventListener("mousemove", function (dets) {
        const svgRect = string.getBoundingClientRect();
        // Calculate mouse position relative to the SVG element
        const mouseX = dets.clientX - svgRect.left;
        const mouseY = dets.clientY - svgRect.top;

        // Ensure mouse coordinates stay within a reasonable range relative to SVG top/bottom
        // Adjust these values based on how much vertical movement you want the curve to have
        const constrainedMouseY = Math.max(svgRect.top + 50, Math.min(svgRect.bottom - 50, dets.clientY)) - svgRect.top;


        // Update the path based on mouse position
        // The Q command takes control point (cx cy) and end point (x y)
        // We want the end points (10 100 and 1800 100) to be fixed
        // and the control point (mouseX mouseY) to follow the mouse
        path = `M 10 100 Q ${mouseX} ${constrainedMouseY} 1800 100`; // Use constrainedMouseY
        gsap.to("svg path", {
            attr: { d: path },
            duration: 0.3,
            ease: "power3.out"
        });
    });
    string.addEventListener("mouseleave", function () {
        gsap.to("svg path", {
            attr: { d: finalPath },
            duration: 1.5,
            ease: "elastic.out(1,0.2)",
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    let menuState = 'closed';
    initLenis(); // Initialize Lenis after DOM is ready

    // Desktop Video Parallax Animation
    // Check for screen width greater than or equal to 900px
    if (window.innerWidth >= 900) {
        const videoContainer = document.querySelector('.video-container-desktop');
        const videoTitleElements = document.querySelectorAll('.video-title p');

        // Ensure both elements exist before proceeding
        if (videoContainer && videoTitleElements.length > 0) {
            // Define breakpoints for responsive adjustments
            const breakpoints = [
                { maxWidth: 1000, translateY: -135, movMultiplier: 450 },
                { maxWidth: 1100, translateY: -130, movMultiplier: 500 },
                { maxWidth: 1200, translateY: -125, movMultiplier: 550 },
                { maxWidth: 1300, translateY: -120, movMultiplier: 600 },
                { maxWidth: 1400, translateY: -115, movMultiplier: 625 }, // Added an intermediate breakpoint
            ];

            // Function to get initial values based on current window width
            const getInitialValues = () => {
                const width = window.innerWidth;
                for (const bp of breakpoints) {
                    if (width <= bp.maxWidth) {
                        return bp;
                    }
                }
                // Default values for widths > max breakpoint
                return { translateY: -110, movMultiplier: 650 };
            };

            // Get initial values based on the window size when the script loads
            let initialValues = getInitialValues();

            // State object to hold animation values
            const animationState = {
                scrollProgress: 0,
                initialTranslateY: initialValues.translateY, // Starting Y position from bottom (%)
                currentTranslateY: initialValues.translateY, // Current Y position
                movementMultiplier: initialValues.movMultiplier, // Multiplier for mouse horizontal movement
                scale: 0.25, // Starting scale
                fontSize: 80, // Starting font size for video titles
                gap: 2, // Starting gap for video container children
                targetMouseX: 0, // Target horizontal movement based on mouse position (-1 to 1)
                currentMouseX: 0, // Smoothed current horizontal movement in pixels
            };

            // Update initial values on window resize
            window.addEventListener("resize", () => {
                const newValues = getInitialValues();
                animationState.initialTranslateY = newValues.translateY;
                animationState.movementMultiplier = newValues.movMultiplier;
                // Reset translateY only if at or near the initial scroll state
                if (animationState.scrollProgress < 0.01) {
                     animationState.currentTranslateY = newValues.translateY;
                }
                // ScrollTrigger.refresh() will handle updating the scroll progress calculation
                // The main resize listener at the end of DOMContentLoaded handles the overall refresh
            });


            // Create the ScrollTrigger animation for vertical movement, scale, font size, and gap
            gsap.timeline({
                scrollTrigger: {
                    trigger: ".intro", // The element that triggers the animation
                    start: "top bottom", // When the top of the trigger hits the bottom of the viewport
                    end: "top 10%", // When the top of the trigger hits 10% from the top of the viewport
                    scrub: true, // Link animation progress to scroll progress
                    onUpdate: (self) => {
                        animationState.scrollProgress = self.progress;
                        // Interpolate translateY from initial value to 0% (top of section)
                        animationState.currentTranslateY = gsap.utils.interpolate(animationState.initialTranslateY, 0, self.progress);
                        // Interpolate scale from 0.25 to 1
                        animationState.scale = gsap.utils.interpolate(0.25, 1, self.progress);
                        // Interpolate gap from 2em to 1em
                        animationState.gap = gsap.utils.interpolate(2, 1, self.progress);

                        // Interpolate font size based on scroll progress zones
                        if (self.progress <= 0.4) {
                            // Fade font size from 80px to 40px in the first 40% of scroll
                            animationState.fontSize = gsap.utils.interpolate(80, 40, self.progress / 0.4);
                        } else {
                            // Fade font size from 40px to 20px in the remaining 60% of scroll
                            animationState.fontSize = gsap.utils.interpolate(40, 20, (self.progress - 0.4) / 0.6);
                        }
                    },
                },
            });

            // Add mousemove listener for horizontal movement
            document.addEventListener("mousemove", (e) => {
                // Only apply mouse movement effect when the scale is less than full size (e.g., < 95%)
                if (animationState.scale < 0.95) {
                     // Normalize mouse X position to a range of -1 to 1 relative to the center
                    animationState.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
                } else {
                     // When scaled up close to 1, disable mouse movement effect
                    animationState.targetMouseX = 0;
                }

            });

            // Animation loop for continuous updates (mouse follow, lerping)
            const animateVideoContainer = () => {
                 if (!videoContainer) return; // Stop loop if element is gone

                const { scale, targetMouseX, currentMouseX, currentTranslateY, fontSize, gap, movementMultiplier } = animationState;

                // Influence of scale on horizontal movement (less movement as it scales up)
                const scaleInfluence = Math.max(0, 1 - scale); // Go from 1 down to 0 as scale goes from 0 to 1
                const effectiveMovementMultiplier = scaleInfluence * movementMultiplier; // Apply scale influence to multiplier

                // Calculate target horizontal movement in pixels
                const maxHorizontalMovement = targetMouseX * effectiveMovementMultiplier;

                 // Lerp (smoothly interpolate) currentMouseX towards the targetMouseX
                 // Apply lerp only if scale is less than full, otherwise lerp towards 0
                 if (scale < 0.95) {
                    animationState.currentMouseX = gsap.utils.interpolate(currentMouseX, maxHorizontalMovement, 0.05); // Lerp factor 0.05
                 } else {
                    animationState.currentMouseX = gsap.utils.interpolate(currentMouseX, 0, 0.05); // Lerp back to center when scaled up
                 }


                // Apply transform to video container
                // Use translate3d for better performance if possible
                videoContainer.style.transform = `translateY(${currentTranslateY}%) translateX(${animationState.currentMouseX}px) scale(${scale})`;

                // Update gap (only if changed to avoid unnecessary DOM writes)
                if (videoContainer.style.gap !== `${gap}em`) {
                     videoContainer.style.gap = `${gap}em`;
                }

                // Update font size for video titles (only if changed)
                videoTitleElements.forEach(el => {
                     if (el.style.fontSize !== `${fontSize}px`) {
                         el.style.fontSize = `${fontSize}px`;
                     }
                });

                // Request the next frame
                requestAnimationFrame(animateVideoContainer);
            };

            // Start the animation loop
            animateVideoContainer();
        }
    }


    // Menu Functionality
    const menuToggle = document.querySelector(".menu-toggle");
    const closeBtn = document.querySelector(".close-btn");
    const menuContainer = document.querySelector(".menu-container");
    const menuItemsNodeList = document.querySelectorAll(".menu-item");
    const menuLinks = document.querySelectorAll(".menu-item-link a");
    const sections = document.querySelectorAll("main section"); // Get all main sections


    if (menuToggle && menuContainer) {
        const menuAnimationDuration = 300; // Milliseconds
        const menuStaggerDelay = 50; // Milliseconds

        menuToggle.addEventListener("click", () => {
            if (menuState === 'closed') {
                menuState = 'opening';
                menuContainer.classList.add("is-open");
                animateMenuItems(menuItemsNodeList, "in", () => {
                    menuState = 'open';
                     // Add slight delay before shuffling starts after menu is open
                    setTimeout(shuffleAll, 50);
                });
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", closeMenuAndAnimateOut);
        }


        function closeMenuAndAnimateOut() {
            if (menuState === 'open') {
                menuState = 'closing';
                if (menuContainer) {
                    animateMenuItems(menuItemsNodeList, "out", () => {
                        menuContainer.classList.remove("is-open");
                        menuState = 'closed';
                        // Clear char colors after menu is fully closed
                        clearColorChars(document.querySelectorAll(".menu-item span .char"));
                    });
                } else {
                    // Fallback if menuContainer is null for some reason
                    menuState = 'closed';
                }
            }
        }

        function animateMenuItems(items, direction, onComplete) {
            if (!items || items.length === 0) {
                if (typeof onComplete === 'function') onComplete();
                return;
            }
            const targetLeft = direction === "in" ? "0px" : "-100px";

            // Ensure elements are positioned correctly before animation if animating 'in'
             if (direction === "in") {
                 items.forEach(item => {
                     item.style.left = "-100px";
                 });
             }


            gsap.to(items, {
                left: targetLeft,
                duration: menuAnimationDuration / 1000, // Convert ms to seconds
                ease: "power3.out",
                stagger: direction === "in" ? menuStaggerDelay / 1000 : { // Stagger forwards for 'in', backwards for 'out'
                    each: menuStaggerDelay / 1000,
                    from: "end"
                },
                onComplete: onComplete // Call the callback function when the animation is complete
            });
        }

        // Smooth scroll to section when menu link is clicked
        menuLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                // Prevent default if menu is not fully open to avoid premature scrolling
                 if (menuState !== 'open') {
                     event.preventDefault();
                     return;
                 }
                event.preventDefault(); // Prevent default link behavior initially

                const targetId = link.getAttribute("href");
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Determine the actual element to scroll to
                    // If target is #home, scroll to the .hero section
                    const sectionToScrollTo = targetId === '#home' ? document.querySelector('.hero') : targetSection;

                    if (sectionToScrollTo) {
                        if (lenis) {
                            // Use Lenis for smooth scrolling if available
                            lenis.scrollTo(sectionToScrollTo, {
                                duration: 1.2, // Match Lenis duration
                                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Match Lenis easing
                            });
                        } else {
                            // Fallback to native smooth scroll
                            sectionToScrollTo.scrollIntoView({ behavior: "smooth" });
                        }
                        // Close the menu after scrolling
                        closeMenuAndAnimateOut();
                    } else {
                        // If target section element not found, just close the menu
                         closeMenuAndAnimateOut();
                    }
                } else {
                     // If target section element not found, just close the menu
                    closeMenuAndAnimateOut();
                }
            });
        });


        // Split text for shuffle and hover effects
        // Apply SplitType to menu links, span page numbers, and menu sub-titles/content
         document.querySelectorAll(".menu-item a, .menu-item span, .menu-title p, .menu-content p").forEach(el => {
            try {
                // Only split if SplitType is available
                 if(SplitType) {
                    new SplitType(el, { types: "words, chars" });
                 }
            } catch (e) {
                // console.error("SplitType error:", e, el);
                 // Continue without splitting if SplitType fails
            }
        });

        // Adjust bg-hover width based on link width
         document.querySelectorAll(".menu-item").forEach(item => {
             const linkEl = item.querySelector(".menu-item-link a");
             if (linkEl) {
                 const bgHover = item.querySelector(".menu-item-link .bg-hover");
                 if (bgHover) {
                     // Set width slightly wider than the link text
                     bgHover.style.width = linkEl.offsetWidth + 30 + "px"; // Adjust padding as needed
                 }
             }
         });


        // Color chars on hover for menu item spans
        function colorChars(chars) {
            if (!chars || chars.length === 0) return;
            // Use Array.from to ensure it's a real array for forEach and checks
             Array.from(chars).forEach((char, index) => {
                // Add a small delay for a staggered effect
                // Use checks within setTimeout in case element is removed from DOM
                 if (char && char.parentNode) { // Check if element is still in DOM
                    setTimeout(() => {
                         if (char && char.parentNode) { // Check again before adding class
                            char.classList.add("char-active");
                         }
                    }, index * 5); // Adjust delay as needed
                 }
            });
        }

        function clearColorChars(chars) {
             if (!chars || chars.length === 0) return;
             // Use Array.from
             Array.from(chars).forEach(char => {
                // Remove class directly, no stagger needed for clearing
                 if (char && char.parentNode) { // Check if element is still in DOM
                     char.classList.remove("char-active");
                 }
            });
        }


        // Add hover listeners to menu item links for span color animation
        document.querySelectorAll(".menu-item-link a").forEach(linkEl => {
            const menuItem = linkEl.closest(".menu-item");
            if (menuItem) {
                const spanEl = menuItem.querySelector("span"); // Find the span within the menu item
                if (spanEl) {
                    const spanChars = spanEl.querySelectorAll(".char"); // Find the chars inside the span
                    if (spanChars.length > 0) { // Only add listeners if chars exist
                        linkEl.addEventListener("mouseenter", () => {
                            // Only trigger effect if menu is open
                            if (menuState === 'open') {
                                colorChars(spanChars);
                            }
                        });
                        linkEl.addEventListener("mouseleave", () => {
                             // Only trigger effect if menu is open
                             if (menuState === 'open') {
                                clearColorChars(spanChars);
                             }
                        });
                    }
                }
            }
        });


        // Add shuffle effect on hover for ALL text elements inside menu items/sub-items
         document.querySelectorAll(".menu-item, .menu-sub-item").forEach(containerEl => {
             containerEl.addEventListener("mouseenter", () => {
                 // Only trigger effect if menu is open
                 if (menuState !== 'open') return;

                 // Find all text elements within this item/sub-item that have been split
                 containerEl.querySelectorAll("a, span, p").forEach(textEl => {
                     // Check if the element actually contains .char spans from SplitType
                     if (textEl.querySelectorAll('.char').length > 0) {
                          addShuffleEffect(textEl);
                     }
                 });
             });
         });

        // Function to trigger shuffle effect on all relevant elements when menu opens
        function shuffleAll() {
             // Select all elements that should shuffle when the menu opens
             document.querySelectorAll(".menu-item-link a, .menu-sub-item .menu-title p, .menu-sub-item .menu-content p, .menu-item span").forEach(el => {
                 // Ensure the element exists and has been split into chars
                 if (el && el.querySelectorAll('.char').length > 0) {
                     addShuffleEffect(el);
                 }
             });
        }


        // Function to add a shuffling text effect to a single element (SplitText chars)
        function addShuffleEffect(element) {
            if (!element) return; // Exit if element is null

            // Get all .char elements within the element
            const charsNodeList = element.querySelectorAll(".char");
            if (charsNodeList.length === 0) return; // Exit if no chars found

            // Convert NodeList to Array for easier manipulation
            const chars = Array.from(charsNodeList);

            // Store original text content to restore later
            const originalTextMap = new Map();
            chars.forEach(char => originalTextMap.set(char, char.textContent));


            const shuffleInterval = 10; // Interval between character changes (ms)
            const charDuration = 75; // How long each character shuffles before stopping (ms)
            const charStagger = 15; // Delay between starting the shuffle for each character (ms)
            const overallStaggerDelay = 100; // Delay before the first character starts shuffling (ms)


            chars.forEach((char, index) => {
                 // Set a timeout for when each character's shuffle starts
                setTimeout(() => {
                    // Check if the element is still in the DOM before starting the interval
                     if (!char || !char.parentNode) return;

                    // Start shuffling the character
                    const interval = setInterval(() => {
                        // Check if the element is still in the DOM during the interval
                         if (char && char.parentNode) {
                             // Generate a random character (printable ASCII range: 33-126)
                             char.textContent = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                         } else {
                             // Clear the interval if the element is no longer in the DOM
                             clearInterval(interval);
                         }
                    }, shuffleInterval);

                    // Set a timeout to stop the shuffling for this character
                    setTimeout(() => {
                        clearInterval(interval); // Stop the interval
                        // Restore the original character
                         const originalContent = originalTextMap.get(char);
                         // Check if element is still in DOM and original content exists
                         if (char && char.parentNode && originalContent !== undefined) {
                             char.textContent = originalContent;
                         }
                    }, charDuration + index * charStagger); // Total duration before restoring
                }, index * charStagger + overallStaggerDelay); // Delay before starting this char's shuffle
            });
        }


         // Intersection Observer for Menu Link Highlighting
         const observerOptions = {
             root: null, // Use the viewport as the root
             rootMargin: "0px",
             threshold: 0.6 // Trigger when 60% of the section is visible
         };

         const observerCallback = (entries) => {
             entries.forEach(entry => {
                 // Ignore the scroll-container and footer as they shouldn't highlight menu links
                 if (entry.target.id === 'scroll-container' || entry.target.classList.contains('footer')) {
                     return;
                 }

                 const targetId = entry.target.id;
                 // Determine the corresponding menu link href
                 // Use '#home' for the .hero section
                 let linkHref = entry.target.classList.contains('hero') ? '#home' : (targetId ? `#${targetId}` : null);

                 if (linkHref) {
                     // Find the menu link with the matching href
                     const corrLink = document.querySelector(`.menu-item-link a[href="${linkHref}"]`);
                     if (corrLink) {
                         // Find the parent menu item
                         const menuItem = corrLink.closest(".menu-item");
                         if (menuItem) {
                             if (entry.isIntersecting) {
                                 // If the section is intersecting, add the 'active' ID
                                 // Remove 'active' from any previously active menu item
                                 document.querySelectorAll('.menu-item#active').forEach(item => item.removeAttribute('id'));
                                 menuItem.id = "active";
                             } else {
                                 // If the section is no longer intersecting, remove the 'active' ID
                                 // Only remove if it's currently the active one
                                 if (menuItem.id === "active") {
                                     menuItem.removeAttribute('id');
                                 }
                             }
                         }
                     }
                 }
             });
         };

         const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

         // Observe all relevant sections
         if (sections.length > 0) {
             sections.forEach(section => {
                 // Avoid observing sections that aren't actual content sections linked in the menu
                  if (section.id !== 'scroll-container' && !section.classList.contains('footer')) {
                     sectionObserver.observe(section);
                  }
             });
         }

         // Initial check to highlight the correct menu item on page load
         // Add a slight delay to ensure observer has time to process initial state
         setTimeout(() => {
             if (sections.length === 0) return; // Exit if no sections found

             // Find the first section that is currently visible at the top
             const firstVisibleSection = Array.from(sections).find(sec => {
                  if (sec.id === 'scroll-container' || sec.classList.contains('footer')) return false; // Ignore these
                 const rect = sec.getBoundingClientRect();
                 // Check if the section is at least 60% into the viewport from the top
                 return rect.top >= 0 && rect.top < window.innerHeight * 0.6;
             });

              // If no visible section is found, default to the very first section (excluding ignored ones)
             const firstMainSection = Array.from(sections).find(sec => sec.id !== 'scroll-container' && !sec.classList.contains('footer'));

             const sectionToActivate = firstVisibleSection || firstMainSection;

             if (sectionToActivate) {
                 let linkHref = sectionToActivate.classList.contains('hero') ? '#home' : (sectionToActivate.id ? `#${sectionToActivate.id}` : null);

                 if (linkHref) {
                     const corrLink = document.querySelector(`.menu-item-link a[href="${linkHref}"]`);
                     if (corrLink) {
                         const menuItemToActivate = corrLink.closest(".menu-item");
                         if (menuItemToActivate) {
                             // Remove active from all others and set this one as active
                             document.querySelectorAll('.menu-item#active').forEach(item => item.removeAttribute('id'));
                             menuItemToActivate.id = "active";
                         }
                     }
                 }
             }
         }, 150); // Adjust delay as needed


    } // End of Menu Functionality block


    // Team Section Animation
     // Only apply complex SplitText animation on larger screens
    if (window.innerWidth > 900) {
        const profileImagesContainer = document.querySelector(".profile-images");
        const profileImages = document.querySelectorAll(".profile-images .img"); // Select image wrappers
        const nameHeadings = document.querySelectorAll(".profile-names .name h1"); // Select H1s

        // Ensure all necessary elements exist and SplitText is available
        if (profileImagesContainer && profileImages.length > 0 && nameHeadings.length > 0 && typeof SplitText !== 'undefined') {

            const splits = [];
            let splitTextFailed = false;

            // Split each h1 into characters
            nameHeadings.forEach(heading => {
                 try {
                    const split = new SplitText(heading, { type: 'chars' });
                     // Add a class to characters for potential styling (optional but good practice)
                     if(split.chars && split.chars.length > 0) {
                         splits.push(split);
                         split.chars.forEach(char => char.classList.add('letter'));
                     } else {
                         // Handle cases where SplitText might return empty chars array
                         splits.push(null); // Push null or undefined for failed splits
                         splitTextFailed = true; // Mark that splitting failed for at least one element
                     }
                 } catch (e) {
                    // Handle errors during SplitText initialization
                     // console.error("SplitText failed for element:", heading, e);
                     splits.push(null); // Push null for failed splits
                     splitTextFailed = true; // Mark that splitting failed
                 }
            });

             // Check if splitting was successful for at least the default and one other name
             // This prevents errors if SplitText fails entirely or on the first element
             if (!splitTextFailed && splits[0] && splits[0].chars && splits[0].chars.length > 0) {

                const defaultLetters = splits[0].chars; // Characters of the default name ("The Squad")
                const otherNameLetters = splits.slice(1).filter(s => s && s.chars).flatMap(split => split.chars); // Flatten chars from other names

                // Initially set all other names to be hidden and translated down
                gsap.set(otherNameLetters, { y: '100%', autoAlpha: 0 });
                // Ensure the default name is visible and in place
                gsap.set(defaultLetters, { y: '0%', autoAlpha: 1 });

                let activeLetters = defaultLetters; // Keep track of the currently active letters
                let prevImage = null; // Keep track of the previously hovered image

                // Add mouseenter listeners to each profile image
                profileImages.forEach((img, index) => {
                     // Find the corresponding SplitText chars for this image (skipping the default name)
                     const currentSplit = splits[index + 1]; // splits[0] is default, so index + 1 for the rest
                     // Ensure the split exists and has chars
                     if (!currentSplit || !currentSplit.chars || currentSplit.chars.length === 0) {
                         return; // Skip if this name didn't split correctly
                     }
                     const currentLetters = currentSplit.chars; // Characters for the current name

                    img.addEventListener("mouseenter", () => {
                        // Only animate if hovering over a different image than the currently active one
                        if (activeLetters !== currentLetters) {
                            const tl = gsap.timeline();

                            // Animate out the currently active letters
                            if (activeLetters && activeLetters.length > 0) {
                                tl.to(activeLetters, {
                                    y: '100%', // Move down
                                    autoAlpha: 0, // Fade out
                                    duration: 0.75, // Animation duration
                                    ease: "power4.out",
                                    stagger: { // Stagger from the center outwards
                                        each: 0.025,
                                        from: "center"
                                    }
                                }, 0); // Start at the beginning of the timeline
                            }


                            // Animate in the letters for the hovered image
                            if (currentLetters && currentLetters.length > 0) {
                                tl.to(currentLetters, {
                                    y: '0%', // Move to original position
                                    autoAlpha: 1, // Fade in
                                    duration: 0.75, // Animation duration
                                    ease: "power4.out",
                                    stagger: { // Stagger from the center outwards
                                        each: 0.025,
                                        from: "center"
                                    }
                                }, 0); // Start at the beginning of the timeline (simultaneous with fade out)
                            }

                             // Animate previously hovered image back to default size
                             if (prevImage && prevImage !== img) {
                                 tl.to(prevImage, {
                                     width: 70, // Default width
                                     height: 70, // Default height
                                     duration: 0.5,
                                     ease: "power4.out"
                                 }, 0); // Start simultaneous
                             }

                            // Animate the hovered image to a larger size
                            tl.to(img, {
                                width: 140, // Larger width
                                height: 140, // Larger height
                                duration: 0.5,
                                ease: "power4.out"
                            }, 0); // Start simultaneous


                            // Update the active letters and previous image tracker
                            activeLetters = currentLetters;
                            prevImage = img;
                        }
                    });
                });

                // Add mouseleave listener to the container to revert to default name
                profileImagesContainer.addEventListener("mouseleave", () => {
                    // Only revert if the currently active letters are not the default ones
                    if (activeLetters && activeLetters.length > 0 && activeLetters !== defaultLetters && defaultLetters && defaultLetters.length > 0) {
                        const tl = gsap.timeline();

                        // Animate out the current letters
                        tl.to(activeLetters, {
                            y: '100%',
                            autoAlpha: 0,
                            duration: 0.75,
                            ease: "power4.out",
                            stagger: {
                                each: 0.025,
                                from: "center"
                            }
                        }, 0);

                        // Animate in the default letters
                        tl.to(defaultLetters, {
                            y: '0%',
                            autoAlpha: 1,
                            duration: 0.75,
                            ease: "power4.out",
                            stagger: {
                                each: 0.025,
                                from: "center"
                            }
                        }, 0);

                         // Animate the previously hovered image back to default size
                         if (prevImage) {
                             tl.to(prevImage, {
                                 width: 70,
                                 height: 70,
                                 duration: 0.5,
                                 ease: "power4.out"
                             }, 0);
                         }

                        // Reset active letters and previous image tracker
                        activeLetters = defaultLetters;
                        prevImage = null;
                    }
                });

            } else {
                 // Fallback if SplitText fails: Hide non-default names
                 // console.warn("SplitText failed or returned no characters. Using fallback for team names.");
                 gsap.set(document.querySelectorAll(".profile-names .name:not(.default) h1"), { autoAlpha: 0 });
                 const defaultH1Fallback = document.querySelector(".profile-names .name.default h1");
                 if (defaultH1Fallback) {
                     gsap.set(defaultH1Fallback, { autoAlpha: 1, y: '0%' }); // Ensure default is visible
                 }
            }
        } else {
            // Fallback if necessary elements not found or SplitText is not loaded
             // console.warn("Team section elements not found or SplitText not available. Using fallback for team names.");
             gsap.set(document.querySelectorAll(".profile-names .name:not(.default) h1"), { autoAlpha: 0 });
             const defaultH1Fallback = document.querySelector(".profile-names .name.default h1");
             if (defaultH1Fallback) {
                 gsap.set(defaultH1Fallback, { autoAlpha: 1, y: '0%' }); // Ensure default is visible
             }
        }
    } else {
        // Mobile specific styles/fallback for Team Section
        // Remove SplitText generated spans and revert to raw H1 text content
        const allH1s = document.querySelectorAll(".profile-names .name h1");
        allH1s.forEach(h1 => {
            // Check if the H1 contains .letter spans (means it was split)
            if (h1.querySelectorAll('.letter').length > 0) {
                h1.innerHTML = h1.textContent; // Revert to original text
            }
        });

        // Set all names to autoAlpha 0 initially, then show only the default one
        gsap.set(allH1s, { autoAlpha: 0, y: '100%' }); // Initial state off-screen
        const defaultH1 = document.querySelector(".profile-names .name.default h1");
        if (defaultH1) {
            gsap.set(defaultH1, { autoAlpha: 1, y: '0%', color: '#b62323' }); // Show default name and set its color
        }

        // Disable pointer events on images container on mobile to prevent accidental hovers
        const profileImagesContainerMobile = document.querySelector(".profile-images");
        if (profileImagesContainerMobile) {
            profileImagesContainerMobile.style.pointerEvents = 'none';
        }
    }


    // Tunnel Scroll Animation
    // Create and append the canvas element first
    const tunnelCanvas = document.createElement('canvas');
    tunnelCanvas.id = 'tunnel-canvas';
    document.body.appendChild(tunnelCanvas); // Append the canvas to the body

    // Get the dedicated ScrollTrigger element and the sections that control opacity
    const tunnelSectionTrigger = document.getElementById('scroll-container');
    const teamSectionForTunnel = document.getElementById('team');
    const workSectionForTunnel = document.querySelector('.work');


    // Proceed with THREE.js setup only if the canvas and the main trigger element exist
    if (tunnelCanvas && tunnelSectionTrigger) {
        const tunnelScene = new THREE.Scene();
        const tunnelCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        tunnelCamera.position.z = 0; // Camera will move along the path

        const tunnelRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: tunnelCanvas, alpha: true });
        tunnelRenderer.setSize(window.innerWidth, window.innerHeight);
        // The background color should match the shader's base color or be handled by the shader entirely
        // CSS background was removed, so shader handles the base color
        tunnelRenderer.setClearColor(0xe3e3db, 0); // Use alpha: 0 if blending, otherwise match base color 100% alpha
         tunnelRenderer.setPixelRatio(window.devicePixelRatio); // Use device pixel ratio

        // Apply fixed positioning and z-index via JS if not reliably in CSS
        // (CSS is preferred but added here for robustness if CSS is missed)
        tunnelRenderer.domElement.style.position = 'fixed';
        tunnelRenderer.domElement.style.top = '0';
        tunnelRenderer.domElement.style.left = '0';
        tunnelRenderer.domElement.style.width = '100%';
        tunnelRenderer.domElement.style.height = '100%';
        tunnelRenderer.domElement.style.zIndex = '-1'; // Ensure it's behind content
        tunnelRenderer.domElement.style.pointerEvents = 'none'; // Don't block mouse events


        // Set initial opacity via GSAP (CSS also sets opacity: 0, this ensures GSAP knows the starting point)
        gsap.set(tunnelCanvas, { opacity: 0 });


        const tunnelUniforms = {
            uSmoothness: { value: 1.0 },
            uGridDensity: { value: 26.0 },
            uNoiseScale: { value: 10.0 },
            uNoiseSpeed: { value: 0.5 },
            uNoiseStrength: { value: 0.15 },
            uEnableDisplacement: { value: true },
            uTime: { value: 0.0 }, // Time for noise animation
            uWireColor: { value: new THREE.Color(0x1a1a1a) }, // Theme wire color
            uBaseColor: { value: new THREE.Color(0xe3e3db) }  // Theme base color for shader
        };

        const tunnelWireframeMaterial = new THREE.ShaderMaterial({
            uniforms: tunnelUniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uSmoothness;
                uniform float uGridDensity;
                uniform float uNoiseScale;
                uniform float uNoiseSpeed;
                uniform float uNoiseStrength;
                uniform bool uEnableDisplacement;
                uniform float uTime;
                uniform vec3 uWireColor;
                uniform vec3 uBaseColor;
                varying vec2 vUv;

                // Perlin noise function (simplified)
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f); // Smooth step
                    return mix(a, b, u.x) +
                           (c - a) * u.y * (1.0 - u.x) +
                           (d - b) * u.x * u.y;
                }

                void main() {
                    // Calculate grid lines based on UV coordinates
                    vec2 grid = abs(fract(vUv * uGridDensity - 0.5) - 0.5);
                    vec2 gridWidth = fwidth(vUv * uGridDensity); // Get pixel width for antialiasing
                    float lineX = smoothstep(0.0, gridWidth.x * uSmoothness, grid.x);
                    float lineY = smoothstep(0.0, gridWidth.y * uSmoothness, grid.y);
                    float line = 1.0 - min(lineX, lineY); // Combine X and Y lines

                    float noiseValue = 0.0;
                    if (uEnableDisplacement) {
                        // Add noise based on UV and time
                        noiseValue = noise(vUv * uNoiseScale + uTime * uNoiseSpeed) * uNoiseStrength;
                    }

                    // Mix base color, wire color, and noise
                    vec3 finalColor = mix(uBaseColor, uWireColor, line);
                     // Use noise to influence the final blend (subtle effect)
                    finalColor = mix(uBaseColor, finalColor, line + noiseValue * line);

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            side: THREE.BackSide // Render faces seen from inside the tube
        });

        // Define the path (CatmullRomCurve3 for smooth curve)
        const tunnelPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(3, 2, -20),
            new THREE.Vector3(-3, -2, -30),
            new THREE.Vector3(0, 0, -40),
            new THREE.Vector3(2, 1, -50),
            new THREE.Vector3(-2, -1, -60),
            new THREE.Vector3(1, 3, -70),
            new THREE.Vector3(-4, -1, -80),
            new THREE.Vector3(0, 0, -90),
            new THREE.Vector3(0, 0, -100)
        ]);

        // Create tube geometry
        const tunnelGeometry = new THREE.TubeGeometry(tunnelPath, 500, 2, 64, false); // path, segments, radius, radial segments, closed
        const tubeMesh = new THREE.Mesh(tunnelGeometry, tunnelWireframeMaterial);
        tunnelScene.add(tubeMesh);

        // Mouse Interaction for Tunnel Camera Shake
        const mouse = { x: 0, y: 0 };
        window.addEventListener("mousemove", (e) => {
            // Normalize mouse position to -1 to 1
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Object to hold the scroll progress (0 to 1)
        const tunnelProgress = { value: 0 };

        // Function to update camera position based on scroll progress and mouse
        function updateTunnelCameraPosition() {
             // Only update if canvas is visible (or intended to be)
             if (!tunnelCanvas || getComputedStyle(tunnelCanvas).display === 'none') return;

            // Get the point on the path at the current scroll progress
            const p1 = tunnelPath.getPointAt(tunnelProgress.value);
            // Get the tangent (direction) at that point
            const tangent = tunnelPath.getTangentAt(tunnelProgress.value);

            // Define a point slightly ahead of the current position to look at
            const lookAtPoint = new THREE.Vector3().addVectors(p1, tangent.multiplyScalar(10)); // Look 10 units ahead

            // Apply mouse shake offset
            const shakeFactor = 0.2; // Adjust sensitivity
            const shakeX = mouse.x * shakeFactor;
            const shakeY = mouse.y * shakeFactor;

            // Set camera position to the point on the path plus mouse shake
            tunnelCamera.position.set(p1.x + shakeX, p1.y + shakeY, p1.z);

            // Make the camera look at the lookAtPoint
            tunnelCamera.lookAt(lookAtPoint);
        }

        // ScrollTrigger to control tunnel canvas opacity
        // Fade in the tunnel as the team section leaves the screen
        if (teamSectionForTunnel) {
             ScrollTrigger.create({
                 trigger: teamSectionForTunnel,
                 start: "bottom bottom", // When bottom of team section hits bottom of viewport
                 end: "bottom 10%", // When bottom of team section hits 10% from top
                 scrub: true,
                 onUpdate: (self) => {
                     // Fade opacity from 0 to 1
                     gsap.to(tunnelCanvas, { opacity: self.progress, duration: 0.1, ease: "none" });
                 }
             });
        }

        // Fade out the tunnel as the work section enters the screen
         if (workSectionForTunnel) {
             ScrollTrigger.create({
                 trigger: workSectionForTunnel,
                 start: "top top", // When top of work section hits top of viewport
                 end: "top -20%", // When top of work section is 20% above top
                 scrub: true,
                 onUpdate: (self) => {
                      // Fade opacity from 1 to 0
                     gsap.to(tunnelCanvas, { opacity: 1 - self.progress, duration: 0.1, ease: "none" });
                 }
             });
         }


        // ScrollTrigger to move camera through the tunnel
        if (tunnelSectionTrigger) {
             ScrollTrigger.create({
                 trigger: tunnelSectionTrigger, // The element that defines the scrollable duration
                 start: "top top", // When the top of the trigger hits the top of the viewport
                 end: "bottom bottom", // When the bottom of the trigger hits the bottom of the viewport
                 scrub: true, // Link animation progress to scroll progress
                 onUpdate: (self) => {
                     tunnelProgress.value = self.progress; // Update tunnel progress based on scroll
                     updateTunnelCameraPosition(); // Update camera position
                 }
             });

             // Call update initially to set the camera at the starting position
             updateTunnelCameraPosition();
        }


        // Tunnel Animation Loop
        let renderTunnelLoop = () => {
            // Only render if the canvas is in the document and not set to display: none
             if (tunnelCanvas && document.body.contains(tunnelCanvas) && getComputedStyle(tunnelCanvas).display !== 'none') {
                 // Update time uniform for noise animation
                 if (tunnelUniforms.uEnableDisplacement.value) {
                    tunnelUniforms.uTime.value += 0.01; // Adjust speed as needed
                 }

                 // Render the scene
                 tunnelRenderer.render(tunnelScene, tunnelCamera);
             }

             // Request the next frame regardless of visibility, but rendering only happens if visible
             requestAnimationFrame(renderTunnelLoop);
         };

        // Start the render loop
        renderTunnelLoop();


        // Handle window resizing for tunnel
        window.addEventListener("resize", () => {
            if (tunnelCamera && tunnelRenderer && tunnelCanvas) {
                // Update camera aspect ratio and projection matrix
                tunnelCamera.aspect = window.innerWidth / window.innerHeight;
                tunnelCamera.updateProjectionMatrix();

                // Update renderer size
                tunnelRenderer.setSize(window.innerWidth, window.innerHeight);

                // Update camera position based on current scroll progress after resize
                updateTunnelCameraPosition();

                // Trigger ScrollTrigger refresh (handled by the global listener below)
            }
        });
    } else {
        // If tunnel canvas or trigger wasn't found (shouldn't happen with create/append)
         // console.warn("Tunnel canvas element or trigger element not found, tunnel animation disabled.");
        // Hide the canvas if it was created but the trigger wasn't found
        if(tunnelCanvas) {
             tunnelCanvas.style.display = 'none';
             // Also remove from DOM to clean up
             if(tunnelCanvas.parentNode) {
                 tunnelCanvas.parentNode.removeChild(tunnelCanvas);
             }
        }
    }


    // Work Section
    let workSectionElementsInitialized = false;
    let lettersScene, lettersCamera, lettersRenderer, globalTextAnimationPaths = [], globalTextContainer, globalLetterPositions = new Map(), globalLineSpeedMultipliers = [0.8, 1, 0.7, 0.9];
    let globalGridCanvas, globalGridCtx;
    let globalCardsContainerEl, globalCardsMoveDistance = 0, globalCurrentXPosition = 0;

    // Helper function for linear interpolation
    const globalLerp = (start, end, t) => start + (end - start) * t;

    // Function to create a curved path in 3D space for letters
    const globalCreateTextAnimationPath = (yPos, amplitude) => {
        const points = [];
        // Create points along the path
        for (let i = 0; i <= 20; i++) {
            const t = i / 20; // Normalized position along the path (0 to 1)
            points.push(
                new THREE.Vector3(
                    -25 + 50 * t, // X varies from -25 to 25
                    yPos + Math.sin(t * Math.PI) * -amplitude, // Y follows a sine wave
                    (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5 // Z creates a slight curve towards camera in the middle
                )
            );
        }
        const curve = new THREE.CatmullRomCurve3(points); // Create a smooth curve from points
        // Create a Line object (not visible by default) to store the curve and its points
        const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)), new THREE.LineBasicMaterial({ color: 0x000000, visible: false }));
        line.curve = curve; // Store the curve reference on the line object
        return line;
    };

    // Function to resize the grid canvas and adjust context scaling for DPR
    const resizeWorkGridCanvas = () => {
         if (!globalGridCanvas || !globalGridCtx || !workSectionElementsInitialized) return;
        const dpr = window.devicePixelRatio || 1;
        globalGridCanvas.width = window.innerWidth * dpr;
        globalGridCanvas.height = window.innerHeight * dpr;
        globalGridCanvas.style.width = `${window.innerWidth}px`;
        globalGridCanvas.style.height = `${window.innerHeight}px`;
        globalGridCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // Apply DPR scaling to the context
    };

    // Function to draw the dot grid on the canvas
    const drawWorkGrid = (scrollProgress = 0) => {
         if(!globalGridCanvas || !globalGridCtx || !workSectionElementsInitialized) return;

        const dpr = window.devicePixelRatio || 1;
        const visualWidth = globalGridCanvas.width / dpr;
        const visualHeight = globalGridCanvas.height / dpr;

        globalGridCtx.fillStyle = "black"; // Grid background color
        globalGridCtx.fillRect(0, 0, visualWidth, visualHeight); // Fill the background

        globalGridCtx.fillStyle = "#e3e3db"; // Dot color
        const dotSize = 1; // Size of the dots
        const spacing = 35; // Spacing between dots

        // Calculate offset for scrolling effect
        const offset = (scrollProgress * spacing * 10) % spacing; // Scroll 10 grid units over the section's height

        // Draw dots
        const rows = Math.ceil(visualHeight / spacing) + 1; // Ensure we cover the height
        const cols = Math.ceil(visualWidth / spacing) + 15; // Ensure we cover the width + extra for scrolling

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                globalGridCtx.beginPath();
                // Apply offset to x position
                globalGridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
                globalGridCtx.fill();
            }
        }
    };

    // Function to update the target screen positions of the letters based on scroll and 3D path
    const updateWorkTargetPositions = (scrollProgress = 0) => {
         if (!lettersCamera || globalTextAnimationPaths.length === 0 || !globalLetterPositions || !workSectionElementsInitialized) return;

        globalTextAnimationPaths.forEach((lineObj, lineIndex) => {
            if (lineObj.letterElements && lineObj.curve) {
                lineObj.letterElements.forEach((element, i) => {
                    // Get a point on the 3D curve based on letter index and scroll progress
                    // Use modulo 1 to loop the path as we scroll
                    const point = lineObj.curve.getPoint((i * 0.06 + scrollProgress * globalLineSpeedMultipliers[lineIndex % globalLineSpeedMultipliers.length]) % 1); // Use index and scroll for position on path

                    // Project the 3D point to 2D screen coordinates
                    const vector = point.clone().project(lettersCamera);

                    // Get the position state for this element
                    const positions = globalLetterPositions.get(element);

                    if (positions) {
                        // Calculate target screen coordinates (normalized -1 to 1, then scaled to pixel coords)
                        positions.target = {
                            x: (vector.x * 0.5 + 0.5) * window.innerWidth,
                            y: (-vector.y * 0.5 + 0.5) * window.innerHeight // Y is inverted in screen coords
                        };
                    }
                });
            }
        });
    };

    // Function to smoothly update the actual DOM element positions via lerping
    const updateWorkLetterPositions = () => {
         if(!workSectionElementsInitialized || !globalLetterPositions) return;

        globalLetterPositions.forEach((positions, element) => {
            const distX = positions.target.x - positions.current.x;
             const distY = positions.target.y - positions.current.y;

            // Prevent large jumps when the target wraps around the path (modulo 1)
            // If distance is too large (e.g., more than 70% of screen width), snap instead of lerping
             const jumpThreshold = window.innerWidth * 0.7; // Adjust threshold as needed
             if (Math.abs(distX) > jumpThreshold || Math.abs(distY) > jumpThreshold) {
                 positions.current.x = positions.target.x;
                 positions.current.y = positions.target.y;
             } else {
                 // Lerp current position towards target position
                 positions.current.x = globalLerp(positions.current.x, positions.target.x, 0.07); // Lerp factor
                 positions.current.y = globalLerp(positions.current.y, positions.target.y, 0.07);
             }


            // Apply the position using translate3d for performance
            element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
        });
    };

     // Function to update the horizontal position of the cards container based on scroll progress
    const updateWorkCardsPosition = () => {
         if(!workSectionElementsInitialized || !globalCardsContainerEl) return;

         // Get the specific ScrollTrigger instance for the work section pinning
        const workScrollTrigger = ScrollTrigger.getById("workPinAnimation");
        // Get the progress (0 to 1) of this specific ScrollTrigger
        const progress = workScrollTrigger ? workScrollTrigger.progress : 0;

        // Calculate the target X position based on progress and total move distance
        const targetX = -globalCardsMoveDistance * progress;

        // Smoothly interpolate the current X position towards the target
        globalCurrentXPosition = globalLerp(globalCurrentXPosition, targetX, 0.07); // Lerp factor

        // Apply the X position to the cards container using GSAP set for performance
         if (globalCardsContainerEl) {
             gsap.set(globalCardsContainerEl, { x: globalCurrentXPosition });
         }
    };


    // Main animation loop for the work section (letters, grid, cards)
    const animateWorkSection = () => {
         // Only proceed if elements are initialized
         if(!workSectionElementsInitialized) {
             // If not initialized yet, just request the next frame and wait
              requestAnimationFrame(animateWorkSection);
             return;
         }

        updateWorkLetterPositions(); // Update letter DOM positions
        updateWorkCardsPosition(); // Update cards container position

         // Render the THREE.js scene for letters
         if(lettersRenderer && lettersScene && lettersCamera) {
            lettersRenderer.render(lettersScene, lettersCamera);
         }

        // Request the next animation frame
        requestAnimationFrame(animateWorkSection);
    };


    // Initialize Work Section elements and animations
    const workSectionNode = document.querySelector(".work");
    globalCardsContainerEl = document.querySelector(".work .cards"); // Assign to global variable

    // Only initialize if the work section and cards container exist
    if (workSectionNode && globalCardsContainerEl) {
        // Calculate the total horizontal distance the cards need to move
        // It's the total width minus the viewport width (since we start off-screen to the right)
        // Assuming cards are initially positioned via padding-left: 100vw;
        // The scrollWidth accounts for padding if box-sizing is content-box, but we're using border-box.
        // A simpler approach matching the reference demo is 400vw travel distance (500vw total - 100vw padding-left).
         globalCardsMoveDistance = window.innerWidth * 4;

        // Create and append the grid canvas
        globalGridCanvas = document.createElement("canvas");
        globalGridCanvas.id = "grid-canvas";
        workSectionNode.appendChild(globalGridCanvas);
        globalGridCtx = globalGridCanvas.getContext("2d");

        // Set up THREE.js for letters
        lettersScene = new THREE.Scene();
        lettersCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        lettersCamera.position.z = 20; // Position camera ahead
        lettersRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Use alpha for transparency
        lettersRenderer.setSize(window.innerWidth, window.innerHeight);
        lettersRenderer.setClearColor(0x000000, 0); // Transparent background
        lettersRenderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio for sharpness
        lettersRenderer.domElement.id = "letters-canvas";
        workSectionNode.appendChild(lettersRenderer.domElement); // Append letters canvas

        // Create the 3D paths for the letters
        globalTextAnimationPaths = [
             globalCreateTextAnimationPath(10, 2), // Top line (y=10, amplitude 2)
             globalCreateTextAnimationPath(3.5, 1), // Upper middle line (y=3.5, amplitude 1)
             globalCreateTextAnimationPath(-3.5, -1), // Lower middle line (y=-3.5, amplitude -1)
             globalCreateTextAnimationPath(-10, -2)  // Bottom line (y=-10, amplitude -2)
         ];

         // Add path lines to the scene (they are invisible)
         globalTextAnimationPaths.forEach(lineObj => lettersScene.add(lineObj));

        // Get the container for the letter DOM elements
        globalTextContainer = document.querySelector(".work .text-container");

        // Create and append letter DOM elements and store their position states
        if (globalTextContainer) {
             // Use a fixed number of letters per line, e.g., 15 or 20, based on visual density needed
             // The reference demo seems to use around 15-20 letters per line looping "WORK "
             const lettersPerLine = 15; // Adjust as needed
             const letterContent = ["W","O","R","K"," "]; // Content to loop through

             globalTextAnimationPaths.forEach(lineObj => {
                 lineObj.letterElements = Array.from({ length: lettersPerLine }, (_, i) => {
                     const el = document.createElement("div");
                     el.className = "letter"; // Class for styling
                     el.textContent = letterContent[i % letterContent.length]; // Assign letter content
                     globalTextContainer.appendChild(el); // Append to DOM
                     // Initialize position state (current and target) for each letter
                     globalLetterPositions.set(el, { current: {x:0,y:0}, target: {x:0,y:0} });
                     return el;
                 });
             });
        }

        // Mark elements as initialized
        workSectionElementsInitialized = true;

        // Perform initial setup that requires calculated dimensions after elements are in DOM
        resizeWorkGridCanvas(); // Set grid canvas size
        drawWorkGrid(0); // Draw initial grid state
        updateWorkTargetPositions(0); // Calculate initial letter target positions

        // Set initial current letter positions to target positions to avoid animation on load
        globalLetterPositions.forEach(p => {
            p.current.x = p.target.x;
            p.current.y = p.target.y;
        });

         // Set initial cards container position based on current scroll progress
        // Get the initial progress if ScrollTrigger has already calculated it before the listener is active
        const initialCardsX = -globalCardsMoveDistance * (ScrollTrigger.getById("workPinAnimation") ? ScrollTrigger.getById("workPinAnimation").progress : 0);
         if (globalCardsContainerEl) {
             gsap.set(globalCardsContainerEl, { x: initialCardsX });
             globalCurrentXPosition = initialCardsX; // Initialize current position
         }


        // Create ScrollTrigger for pinning and updating grid/letters
        ScrollTrigger.create({
            id: "workPinAnimation", // Assign an ID for easy retrieval
            trigger: workSectionNode, // The section to pin
            start: "top top", // Pin when the top of the section hits the top of the viewport
            end: "+=700%", // Pin for a scroll distance of 700% of the viewport height
            pin: true, // Pin the trigger element
            pinSpacing: true, // Add spacing after the pinned element
            scrub: 1, // Smoothly link animation to scroll (scrub: 1 means it lags slightly)
            onUpdate: (self) => {
                // Update letter target positions and draw the grid based on scroll progress
                updateWorkTargetPositions(self.progress);
                drawWorkGrid(self.progress);
            },
        });

        // Start the work section animation loop
        animateWorkSection();

    } else {
         // Fallback if work section or cards container is not found
         // console.warn("Work section or cards container not found. Work animations disabled.");
         // Hide canvases if they were created but initialization failed
         const gridCanvasEl = document.getElementById('grid-canvas');
         const lettersCanvasEl = document.getElementById('letters-canvas');
         if(gridCanvasEl) gridCanvasEl.style.display = 'none';
         if(lettersCanvasEl) lettersCanvasEl.style.display = 'none';
    }


    // Skills Section Animation
    const skillsGrid = document.querySelector('.skills-section .skills-grid');
    if (skillsGrid) {
        const skillPills = gsap.utils.toArray(".skills-grid .skill-pill"); // Get all skill pills

        if (skillPills.length > 0) {
            // Set initial state via CSS (filter: blur(8px), opacity: 0, transform: translateY(20px))
            // Use GSAP timeline with ScrollTrigger to animate them in
            gsap.timeline({
                scrollTrigger: {
                    trigger: skillsGrid, // Trigger animation when the grid comes into view
                    start: 'top 85%', // Start when the top of the grid is 85% down the viewport
                    end: 'bottom 70%', // End when the bottom of the grid is 70% down the viewport
                    scrub: 0.5, // Smoothly animate with scroll
                }
            }).to(skillPills, {
                opacity: 1, // Fade in
                filter: "blur(0px)", // Remove blur
                y: 0, // Move to original position
                stagger: { // Stagger the animation of each pill
                    each: 0.05, // Delay between each pill's animation start
                    from: "start" // Stagger from the first pill to the last
                },
                ease: "power2.out" // Easing function
            });
        }
    }


    // Review Section
    const reviewsSectionNode = document.querySelector("section.reviews");
    const outlineLayerCanvasEl = reviewsSectionNode ? reviewsSectionNode.querySelector("canvas.outline-layer") : null;
    const fillLayerCanvasEl = reviewsSectionNode ? reviewsSectionNode.querySelector("canvas.fill-layer") : null;
    const reviewCardsContainerEl = reviewsSectionNode ? reviewsSectionNode.querySelector(".review-cards-container") : null;


    // Proceed only if all required elements are found
    if (reviewsSectionNode && outlineLayerCanvasEl && fillLayerCanvasEl && reviewCardsContainerEl) {
        const outlineCtx = outlineLayerCanvasEl.getContext("2d");
        const fillCtx = fillLayerCanvasEl.getContext("2d");

        // Constants for triangle grid animation
        const REV_TRIANGLE_SIZE = 130; // Size of each triangle
        const REV_LINE_WIDTH_OUTLINE = 1; // Stroke width for outline triangles
        const REV_SCALE_THRESHOLD = 0.01; // Minimum scale threshold to draw filled triangle
        const REV_ANIMATION_SPEED = 0.1; // Speed of scale animation (lerp factor)


        let revTriangleStates = new Map(); // Stores state for each triangle (scale, order)
        let revAnimationFrameID = null; // ID for the animation frame loop
        let revCanvasXPositionGrid = 0; // Horizontal position offset for the grid

        // Function to set canvas size and scale context for DPR
        function revSetCanvasSize(canvas, ctx) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Apply DPR scale
        }

        // Function to draw a single triangle
        function revDrawTriangle(ctx, x, y, triangleSize, fillScale, flipped, isFillLayer) {
            const halfSize = triangleSize / 2;
            ctx.beginPath();
            // Define triangle points (either pointed up or down)
            if (!flipped) {
                ctx.moveTo(x, y - halfSize); // Top point
                ctx.lineTo(x + halfSize, y + halfSize); // Bottom right
                ctx.lineTo(x - halfSize, y + halfSize); // Bottom left
            } else {
                ctx.moveTo(x, y + halfSize); // Bottom point
                ctx.lineTo(x + halfSize, y - halfSize); // Top right
                ctx.lineTo(x - halfSize, y - halfSize); // Top left
            }
            ctx.closePath();

            if (isFillLayer) {
                // Draw filled triangle with scaling
                if (fillScale > REV_SCALE_THRESHOLD) { // Only draw if scale is visible
                    ctx.save(); // Save context state
                    ctx.translate(x, y); // Move origin to triangle center
                    ctx.scale(fillScale, fillScale); // Apply scale
                    ctx.translate(-x, -y); // Move origin back
                    ctx.fillStyle = "#1a1a1a"; // Fill color (dark theme)
                    ctx.fill();
                    ctx.strokeStyle = "#1a1a1a"; // Outline color for fill layer
                    ctx.lineWidth = REV_LINE_WIDTH_OUTLINE + 0.5; // Slightly thicker outline for filled
                    ctx.stroke();
                    ctx.restore(); // Restore context state
                }
            } else {
                // Draw outline triangle (static)
                ctx.strokeStyle = "rgba(26,26,26,0.1)"; // Outline color with transparency
                ctx.lineWidth = REV_LINE_WIDTH_OUTLINE;
                ctx.stroke();
            }
        }

        // Function to initialize triangle states (positions, random order)
        function revInitializeTriangles() {
            revTriangleStates.clear(); // Clear previous states
            const canvasWidth = outlineLayerCanvasEl.offsetWidth;
            const canvasHeight = outlineLayerCanvasEl.offsetHeight;

            // Calculate number of columns and rows needed to cover the canvas (with extra buffer)
            const numCols = Math.ceil(canvasWidth / (REV_TRIANGLE_SIZE * 0.5)) + 2; // Width / half width + buffer
            const numRows = Math.ceil(canvasHeight / REV_TRIANGLE_SIZE) + 2; // Height / height + buffer

            // Create an array of potential triangle positions (row, col)
            let positions = [];
            for (let i = -1; i < numRows; i++) { // Start from -1 to add top buffer row
                for (let l = -1; l < numCols; l++) { // Start from -1 to add left buffer column
                    positions.push({ row: i, col: l, key: `${i}-${l}` }); // Store row/col and a unique key
                }
            }

            // Randomly shuffle the positions array
            for (let i = positions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [positions[i], positions[j]] = [positions[j], positions[i]]; // Swap elements
            }

            // Store initial state for each triangle (random order for fill animation)
            positions.forEach((pos, idx) => {
                revTriangleStates.set(pos.key, {
                    order: idx / (positions.length - 1), // Normalized order (0 to 1) for staggered animation
                    scale: 0, // Initial scale is 0
                    row: pos.row,
                    col: pos.col
                });
            });
        }

        // Function to draw the grid based on scroll progress and animate fill scale
        function revDrawGrid(triangleFillProgress = 0) {
            // Cancel previous animation frame if any
            if (revAnimationFrameID) {
                cancelAnimationFrame(revAnimationFrameID);
            }

            // Clear both canvases
            outlineCtx.clearRect(0, 0, outlineLayerCanvasEl.offsetWidth, outlineLayerCanvasEl.offsetHeight);
            fillCtx.clearRect(0, 0, fillLayerCanvasEl.offsetWidth, fillLayerCanvasEl.offsetHeight);

            let needsUpdate = false; // Flag to check if any triangle is still animating scale

            // Calculate horizontal grid offset based on scroll progress (subtle parallax)
            const gridParallaxFactor = -50; // Adjust speed/direction of grid movement
            revCanvasXPositionGrid = triangleFillProgress * gridParallaxFactor;


            // Map scroll progress (0-1) to the triangle fill animation progress (0-1)
            // The fill animation only happens during a specific part of the overall review section scroll
            const fillStartRatio = 0.1; // Start filling when review section progress is 10%
            const fillEndRatio = 0.9; // Finish filling when review section progress is 90%
            let fillTargetProgressValue = 0; // This is the target progress for the triangle 'order'

            if (triangleFillProgress <= fillStartRatio) {
                fillTargetProgressValue = 0; // Before start ratio, target progress is 0
            } else if (triangleFillProgress >= fillEndRatio) {
                fillTargetProgressValue = 1; // After end ratio, target progress is 1
            } else {
                // Linear mapping between start and end ratios
                fillTargetProgressValue = (triangleFillProgress - fillStartRatio) / (fillEndRatio - fillStartRatio);
            }

            // Ensure fill target progress is clamped between 0 and 1
            fillTargetProgressValue = Math.min(1, Math.max(0, fillTargetProgressValue));


            // Iterate through each triangle state
            revTriangleStates.forEach((state) => {
                // Calculate triangle center coordinates based on row/col and size, plus grid offset
                const x = state.col * (REV_TRIANGLE_SIZE * 0.5) + (REV_TRIANGLE_SIZE / 2) + revCanvasXPositionGrid;
                const y = state.row * REV_TRIANGLE_SIZE + (REV_TRIANGLE_SIZE / 2);

                // Determine if triangle should be flipped based on grid position
                const flipped = (state.row + state.col) % 2 !== 0; // Alternating pattern

                // Draw the static outline triangle
                revDrawTriangle(outlineCtx, x, y, REV_TRIANGLE_SIZE, 0, flipped, false);

                // Determine the target scale for the filled triangle based on its random order
                // If the triangle's order is less than or equal to the current fill progress, its target scale is 1
                const scaleBasedOnOrder = state.order <= fillTargetProgressValue;
                const targetScale = scaleBasedOnOrder ? 1 : 0;

                // Smoothly animate the triangle's current scale towards its target scale using lerp
                const nextScale = state.scale + (targetScale - state.scale) * REV_ANIMATION_SPEED;

                // Check if the scale is still animating (has changed significantly or not reached target)
                if (Math.abs(nextScale - state.scale) > 0.001 || state.scale !== targetScale) {
                    state.scale = nextScale; // Update scale
                    needsUpdate = true; // Mark that we need another animation frame
                }

                // Draw the filled triangle if its current scale is visible
                if (state.scale > REV_SCALE_THRESHOLD) {
                    revDrawTriangle(fillCtx, x, y, REV_TRIANGLE_SIZE, state.scale, flipped, true);
                }
            });

            // Request the next animation frame if any triangle is still animating
            if (needsUpdate) {
                revAnimationFrameID = requestAnimationFrame(() => revDrawGrid(triangleFillProgress));
            }
        }

        // Initial setup when elements are found
        revSetCanvasSize(outlineLayerCanvasEl, outlineCtx); // Set initial canvas sizes
        revSetCanvasSize(fillLayerCanvasEl, fillCtx);
        revInitializeTriangles(); // Generate triangle states
        revDrawGrid(0); // Draw the initial grid state (all outlines, no fill)


        // ScrollTrigger setup for the Review Section
        const cardsScrollDurationPercentage = 0.6; // Percentage of the total pinned height for cards scrolling
        const totalReviewPinDuration = "+=500%"; // Total scroll distance the section is pinned for

        ScrollTrigger.create({
            trigger: reviewsSectionNode, // The section to pin
            start: "top top", // Pin when the top of the section hits the top of the viewport
            end: totalReviewPinDuration, // Pin for the defined scroll distance
            pin: true, // Pin the section
            scrub: 1, // Smoothly link animation to scroll
            id: "reviewSectionST", // Assign an ID for easy retrieval

            onUpdate: (self) => {
                const overallProgress = self.progress; // Overall scroll progress (0 to 1) for the entire pinned section

                let cardsProgress = 0; // Progress for the horizontal cards scroll (0 to 1)
                let triangleFillProgressValue = 0; // Progress for the triangle fill animation (0 to 1)

                // Split the overall progress: first part for cards, second part for triangle fill
                if (overallProgress <= cardsScrollDurationPercentage) {
                    // In the first part, cards scroll horizontally
                    cardsProgress = overallProgress / cardsScrollDurationPercentage;
                    triangleFillProgressValue = 0; // Triangle fill is at 0 during this part
                } else {
                    // In the second part, cards are at the end, triangles fill
                    cardsProgress = 1; // Cards progress is 1 (at the end)
                    triangleFillProgressValue = (overallProgress - cardsScrollDurationPercentage) / (1 - cardsScrollDurationPercentage);
                }

                // Ensure progress values are clamped between 0 and 1
                cardsProgress = Math.min(1, Math.max(0, cardsProgress));
                triangleFillProgressValue = Math.min(1, Math.max(0, triangleFillProgressValue));

                // Calculate target X position for the cards container
                // The total width of the cards container minus the viewport width (or available space)
                // Need to account for padding-left: 100vw initially
                const maxCardScrollX = reviewCardsContainerEl.scrollWidth - window.innerWidth + (parseFloat(getComputedStyle(reviewCardsContainerEl).paddingLeft)||0);
                const targetCardX = -maxCardScrollX * cardsProgress;

                // Use GSAP to smoothly update the cards container position
                // Using gsap.to with a very short duration and "none" ease mimics a scrubbed lerp
                 gsap.to(reviewCardsContainerEl, {
                    x: targetCardX,
                    ease: "none", // Linear motion linked directly to progress
                    duration: 0.1 // Small duration helps GSAP handle updates efficiently with scrub
                });

                // Update and draw the grid/triangles animation
                revDrawGrid(triangleFillProgressValue);
            },
        });


        // Handle window resizing for Review Section canvases
        window.addEventListener("resize", () => {
            // Re-set canvas sizes and redraw immediately
            revSetCanvasSize(outlineLayerCanvasEl, outlineCtx);
            revSetCanvasSize(fillLayerCanvasEl, fillCtx);

             // Re-initialize triangle states based on the new size
            revInitializeTriangles();

            // Get the current scroll progress of the Review section ScrollTrigger
            let currentOverallProgress = 0;
            // Corrected way to get ScrollTrigger instance by ID
             let reviewSTInstance = null;
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.id === "reviewSectionST") { // Check by ID
                    reviewSTInstance = st;
                }
            });

             if(reviewSTInstance) {
                 currentOverallProgress = reviewSTInstance.progress;
             }


            // Determine the triangle fill progress value based on the current overall progress
            let triangleFillProgressValueOnResize = 0;
            const cardsScrollDurationPercentage = 0.6; // Need to use the same constant

            if (currentOverallProgress > cardsScrollDurationPercentage) {
                 triangleFillProgressValueOnResize = (currentOverallProgress - cardsScrollDurationPercentage) / (1 - cardsScrollDurationPercentage);
            }

            // Redraw the grid with the current triangle fill progress
             revDrawGrid(Math.min(1, Math.max(0, triangleFillProgressValueOnResize))); // Ensure clamped 0-1
        });


    } else {
         // Fallback if Review section elements not found
         // console.warn("Review section elements not found. Review animations disabled.");
    }


    // Footer Animations
    // Locate this section in your script.js file
// Footer Animations
const footerElement = document.querySelector(".footer");
if (footerElement) {
    // Animate footer header text on scroll
    ScrollTrigger.create({
        trigger: ".footer-header",
        start: "top 85%",
        onEnter: () => {
            gsap.from(".footer-header .light-text", { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" });
            gsap.from(".footer-header .bold-text", { opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: "power2.out" });
        },
        once: true
    });

    // Animate footer columns/sections using batch
    ScrollTrigger.batch(".footer-column .footer-section", {
        trigger: ".footer-grid",
        start: "top 90%",
        onEnter: (batch) => {
            gsap.from(batch, { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: "power2.out" });
        },
        once: true
    });

    // START OF NEW FOOTER TEXT ANIMATION CODE
    const footerLargeTextEl = footerElement.querySelector(".footer-large-text");

    // Ensure the element exists and SplitText library is available
    if (footerLargeTextEl && typeof SplitText !== 'undefined') {
        let splitFooterText; // Declare variable outside try block

        try {
            // Split the text into characters
            splitFooterText = new SplitText(footerLargeTextEl, { type: "chars" });

            // Set initial state of characters (hidden and slightly below)
            // opacity is already 0 in CSS, but setting y here ensures it starts from below
            gsap.set(splitFooterText.chars, { y: 50, opacity: 0 }); // Start 50px below and invisible

            // Create ScrollTrigger animation
            ScrollTrigger.create({
                trigger: footerElement, // *** CHANGED: Trigger on the entire footer element
                start: "top 90%",       // *** ADJUSTED: Start animation when the top of the footer hits 90% from viewport top
                                        // You might adjust this start point further (e.g., "center bottom", "bottom bottom -=100px")
                                        // depending on when exactly you want the animation to begin.
                // Adjust start/end points as needed for timing
                // end: "bottom bottom", // Optional: Add an end point if needed

                onEnter: () => {
                    // Animate characters into view
                    gsap.to(splitFooterText.chars, {
                        y: 0, // Move to original Y position
                        opacity: 1, // Fade in
                        duration: 0.6, // Duration of each character's animation
                        ease: "power2.out",
                        stagger: 0.04 // Delay between each character animation (adjust for speed)
                    });
                },
                // Optional: Add onLeaveBack to reset if scrolling up
                // onLeaveBack: () => {
                //     gsap.set(splitFooterText.chars, { y: 50, opacity: 0 });
                // },
                once: true // Animation runs only the first time scrolling down into trigger
            });

        } catch (e) {
            console.error("Error initializing SplitText or ScrollTrigger for footer text:", e);
            // Fallback: ensure text is at least visible without animation if SplitText fails
            if (footerLargeTextEl) {
                // Check if SplitText actually created characters before trying to revert
                // If SplitText failed early, the original text content might still be there
                if (!splitFooterText || !splitFooterText.chars || splitFooterText.chars.length === 0) {
                     footerLargeTextEl.style.opacity = 1; // Make the original text block visible
                     footerLargeTextEl.style.transform = 'translateY(0)'; // Ensure no leftover transform
                } else {
                    // If SplitText did split but the animation failed, reset the chars
                    gsap.set(splitFooterText.chars, { opacity: 1, y: 0 });
                }
            }
        }
    } else if (footerLargeTextEl) {
         // Fallback if SplitText is not available at all
         console.warn("SplitText not available. Footer text animation disabled.");
         footerLargeTextEl.style.opacity = 1; // Make the original text block visible
         footerLargeTextEl.style.transform = 'translateY(0)'; // Ensure no leftover transform
    }
    }


    // Global resize listener for ScrollTrigger refresh and Work section redraws
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Work Section Resize Logic
            if (workSectionElementsInitialized) {
                 // Resize grid canvas and redraw grid
                 if (globalGridCanvas) {
                     resizeWorkGridCanvas();
                     // Redraw grid at current scroll progress
                     const workST = ScrollTrigger.getById("workPinAnimation");
                     drawWorkGrid(workST ? workST.progress : 0);
                 }

                 // Resize letters canvas and update camera/positions
                 if (lettersRenderer && lettersCamera) {
                     lettersRenderer.setSize(window.innerWidth, window.innerHeight);
                     lettersCamera.aspect = window.innerWidth / window.innerHeight;
                     lettersCamera.updateProjectionMatrix();
                     // Update target positions based on new window size and current scroll
                     const workST = ScrollTrigger.getById("workPinAnimation");
                     updateWorkTargetPositions(workST ? workST.progress : 0);
                     // Snap current positions to targets immediately on resize to avoid jarring lerp
                     globalLetterPositions.forEach(p => {
                         p.current.x = p.target.x;
                         p.current.y = p.target.y;
                     });
                 }

                 // Recalculate cards move distance based on new window width
                 globalCardsMoveDistance = window.innerWidth * 4;
                 // Update current card position based on new distance and current scroll
                 const workST = ScrollTrigger.getById("workPinAnimation");
                 globalCurrentXPosition = -globalCardsMoveDistance * (workST ? workST.progress : 0);
                 // Immediately set card position via GSAP
                 if (globalCardsContainerEl) {
                    gsap.set(globalCardsContainerEl, { x: globalCurrentXPosition });
                 }
            }

            // Reviews Section Resize Logic (already handled within the Reviews block)

             // Tunnel Section Resize Logic (already handled within the Tunnel block)


            // Refresh ScrollTrigger after all dimensions are updated
            if (ScrollTrigger.getAll().length > 0) {
                ScrollTrigger.refresh();
            }
        }, 250); // Debounce time
    });

}); // End of DOMContentLoaded
