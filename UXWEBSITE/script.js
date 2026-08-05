/* ============================================
   RobloxWorld — JavaScript
   Assignment: IT1X15 UX Design in Web Development
   Handles: Form submission, response pages, DOM manipulation
   ============================================ */

// ====== JOIN COMMUNITY FORM ======
// Grabs form data, displays it on a response page below the form
function submitJoinForm(event) {
    event.preventDefault(); // Stop page reload

    // Get values from form fields
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var buildType = document.getElementById("buildType").value;
    var aboutYou = document.getElementById("aboutYou").value || "No additional info provided.";

    // Build the response HTML using DOM manipulation
    var responseHtml = "";
    responseHtml += "<strong>Roblox Username:</strong> " + username + "<br>";
    responseHtml += "<strong>Email:</strong> " + email + "<br>";
    responseHtml += "<strong>Build Interest:</strong> " + buildType + "<br>";
    responseHtml += "<strong>About You:</strong> " + aboutYou;

    // Show the response box with entered data
    document.getElementById("responseData").innerHTML = responseHtml;
    document.getElementById("responseBox").style.display = "block";

    // Hide the form after submission
    document.getElementById("joinForm").style.display = "none";

    // Scroll to the response
    document.getElementById("responseBox").scrollIntoView({ behavior: "smooth" });
}

// Reset the join form so user can submit again
function resetJoinForm() {
    document.getElementById("joinForm").reset();
    document.getElementById("joinForm").style.display = "block";
    document.getElementById("responseBox").style.display = "none";
}

// ====== CONTACT FORM ======
// Grabs contact form data, shows confirmation message
function submitContactForm(event) {
    event.preventDefault(); // Stop page reload

    // Get values from form fields
    var name = document.getElementById("cName").value;
    var email = document.getElementById("cEmail").value;
    var message = document.getElementById("cMessage").value;

    // Build the response HTML
    var responseHtml = "";
    responseHtml += "<strong>Name:</strong> " + name + "<br>";
    responseHtml += "<strong>Email:</strong> " + email + "<br>";
    responseHtml += "<strong>Message:</strong> " + message;

    // Show the response with entered data
    document.getElementById("contactData").innerHTML = responseHtml;
    document.getElementById("contactResponse").style.display = "block";

    // Hide the form after submission
    document.getElementById("contactForm").style.display = "none";

    // Scroll to the response
    document.getElementById("contactResponse").scrollIntoView({ behavior: "smooth" });
}

// ====== NAVIGATION ACTIVE STATE ======
// Highlights the current page in the navbar based on URL
document.addEventListener("DOMContentLoaded", function() {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function(link) {
        var linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});
