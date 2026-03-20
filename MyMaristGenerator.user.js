// ==UserScript==
// @name         MyMarist Calendar
// @namespace    Special Script
// @version      2026-03-20
// @description  Convert MyMarist Registration Calendar to iCal
// @author       Bobby/Robert McDonald
// @match        https://*.edu/*
// @icon         https://www.citypng.com/public/uploads/preview/hd-vector-calendar-icon-transparent-background-701751695033013y1f6o6ukoh.png
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    (function () {
    const origOpen = XMLHttpRequest.prototype.open;

    const testing = true;

    // Define ClassList So The ICS Builder Can Use It
    let classList = [];

    /**
      * (GENERIC FILE CONVERTER FUNCTION I FOUND ONLINE)
      *
      * Triggers a browser download of a file created from a string.
      * @param {string} content - The text content of the file.
      * @param {string} fileName - The name of the file (e.g., 'event.ics').
      * @param {string} contentType - The MIME type (e.g., 'text/calendar').
      */
        function createFile(content, fileName, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a); // Required for some browsers
            a.click();
            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

    // Build An ICS File Based Given The Classes In An Array
    function BuildICS(classes) {
        // Define With The Default Required Fields
        let ICS_String = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//BobbyMcD422//Banner Schedule Export//EN\n";
        // Add Classes From Array And All Of Their Fields (c bc you can't call an obj class :( )
        classes.forEach((c) => {
            // Open Event
            ICS_String += "BEGIN:VEVENT\n";
            for (const [key, value] of Object.entries(c)) {
                ICS_String += `${key}:${value}\n`;
            }
            // Close Event
            ICS_String += "END:VEVENT\n";
        });

        ICS_String += "END:VCALENDAR\n";

        return createFile(ICS_String, 'event.ics', 'text/calendar;charset=utf-8');
    }

    // Make A Button On The Page To Download The File
    GM_registerMenuCommand("Export Schedule", () => {
        BuildICS(classList);
    });

    // Intercept and Organize The Info that We Need + Save it To the Classes Array
    XMLHttpRequest.prototype.open = function (method, url) {
        // Check for the Registration Loading Your Classes
        if (url.includes("getRegistrationEvents")) {
            // Run This When It Stops Loading / Fully Loads In
            this.addEventListener("load", function () {
                try {
                    // Unpack The JSON Data Into an actual String
                    const data = JSON.parse(this.responseText);
                    // Clear Out Old Data (this script will run everytime you change terms)
                    classList = [];
                    // UID For Class
                    let UID = 1;

                    data.forEach(course => {

                        let newStart = course.start.trim().replaceAll("-","").replaceAll(":","").slice(0, -4);
                        let newEnd = course.end.trim().replaceAll("-","").replaceAll(":","").slice(0, -4);
                        // Add Only Necessary Info To An Obj | Reformat for ICal
                        const newClass = {
                            SUMMARY: `${course.title} ${course.subject}${course.courseNumber}`,
                            UID: `${course.subject}${course.courseNumber}${UID}`,
                            DTSTAMP: newStart,
                            DTSTART: newStart,
                            DTEND: newEnd,
                        };
                        // Add It To Our ClassList
                        classList.push(newClass);

                        // Print Course Objs Into Console For Troubleshooting
                        if(testing) {
                            console.log(course);
                            console.log(classList[UID - 1]);
                        }
                        // Increment UID
                        UID++;

                    });
                } catch (e) {
                    console.error("Failed to parse schedule JSON", e);
                }
            });
        }

        return origOpen.apply(this, arguments);
    };
    })();
})();