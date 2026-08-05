document.addEventListener("DOMContentLoaded", () => {
  // Highlight form fields on focus with pink glow
  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      input.style.borderColor = "#ff4da6";
      input.style.boxShadow = "0 0 8px rgba(255,77,166,0.7)";
    });
    input.addEventListener("blur", () => {
      input.style.borderColor = "#ff4da6";
      input.style.boxShadow = "";
    });
  });

  // Example: alert on form submit
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("🎉 Thanks for joining the RobloxWorld community!");
    });
  }
});
