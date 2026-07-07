// Dropdown toggle
const dropbtn = document.getElementById('dropbtn');
const dropdown = document.getElementById('dropdown-content');
const dropicon = document.getElementById('dropicon');

dropbtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden');
    dropbtn.setAttribute('aria-expanded', String(!isOpen));
    dropicon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== dropbtn) {
      dropdown.classList.add('hidden');
      dropbtn.setAttribute('aria-expanded', 'false');
      dropicon.style.transform = 'rotate(0deg)';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
      dropbtn.setAttribute('aria-expanded', 'false');
      dropicon.style.transform = 'rotate(0deg)';
    }
});

// Little live clock for the header — pure atmosphere, matches the "workbench" feel
const clock = document.getElementById('clock');
function tick() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
}
tick();
setInterval(tick, 1000);

// Count every project card
document.addEventListener("DOMContentLoaded", () => {
    const projects = document.querySelectorAll(".project-card");
    const counter = document.getElementById("project-count");

    if (counter) {
        counter.textContent = `${String(projects.length).padStart(2, "0")} found`;
    }
});