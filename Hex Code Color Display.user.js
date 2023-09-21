// ==UserScript==
// @name         Neocities Hex Color Preview
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Preview the color of a hex code as an outlined circle next to it in the Neocities HTML editor.
// @author       TabbyGarf
// @match        https://neocities.org/site_files/text_editor/*
// @icon         https://example.com/my-script-icon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const hexCodeRegex = /#[0-9A-Fa-f]{6}/g;

    // Function to convert a hex color code to RGB
    function hexToRGB(hex) {
        // Remove the hash character if it's present
        hex = hex.replace(/^#/, '');

        // Parse the hex value
        const bigint = parseInt(hex, 16);

        // Extract the individual red, green, and blue components
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return `RGB(${r}, ${g}, ${b})`;
    }

    // Function to create an outlined circle element
    function createColorCircle(hexCode) {
        const circle = document.createElement('span'); // Use a <span> element to avoid line breaks
        circle.classList.add('color-circle');
        circle.style.backgroundColor = hexCode;
        circle.style.border = `1px solid #dddddd`;
        circle.title = hexToRGB(hexCode); // Display color as a tooltip
        circle.style.width = '10px'; // Adjust circle size
        circle.style.height = '10px';
        circle.style.borderRadius = '0%'; // Make it a circle
        circle.style.display = 'inline-block'; // Ensure inline display
        circle.style.position = 'relative';
        circle.style.left="-2px";

        return circle;
    }

    // Function to check for updates and add new color circles
    function checkForUpdates() {
        const elementsWithClasses = document.querySelectorAll('.ace_constant.ace_numeric');

        if (elementsWithClasses) {
            elementsWithClasses.forEach(element => {
                const editorContent = element.innerHTML;

                // Find all hex codes in the element's content
                const hexCodes = editorContent.match(hexCodeRegex);

                if (hexCodes) {
                    // Get any existing color circles within the element
                    const existingCircles = element.querySelectorAll('.color-circle');

                    // Create a temporary document fragment to build the modified content
                    const fragment = document.createDocumentFragment();

                    // Iterate through each hex code
                    hexCodes.forEach((hexCode, index) => {
                        // Add the hex code as text before the circle
                        fragment.appendChild(document.createTextNode(hexCode));

                        // Add a space between the hex code and the circle
                        fragment.appendChild(document.createTextNode(' '));

                        // Check if an existing circle already exists for this hex code
                        if (existingCircles && existingCircles[index]) {
                            // If it exists, simply append it to the fragment
                            fragment.appendChild(existingCircles[index]);
                        } else {
                            // If it doesn't exist, create a new color circle and append it
                            const colorCircle = createColorCircle(hexCode);
                            fragment.appendChild(colorCircle);
                        }
                    });

                    // Clear the content of the element before appending the modified fragment
                    element.innerHTML = '';

                    // Append the modified fragment to the element
                    element.appendChild(fragment);
                }
            });
        }
    }

    // Initial check for updates
    checkForUpdates();

    // Periodically check for updates
    setInterval(checkForUpdates, 100); // Adjust the interval as needed
})();
