// Interactive scripts for RobloxWorld
document.addEventListener('DOMContentLoaded', () => {
  // Add click events to build cards
  const buildCards = document.querySelectorAll('.build-card');
  buildCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h4').textContent;
      alert(`You clicked on: ${title}! Detailed page coming soon.`);
    });
  });
});
