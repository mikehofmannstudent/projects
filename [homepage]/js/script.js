document.addEventListener("DOMContentLoaded", () => {
    // Toggle Versions
    const dropbtnElement = document.getElementById("dropbtn");
    const dropdownElement = document.getElementById("dropdown-content");

    dropbtnElement.addEventListener("click", () => {
        dropdownElement.classList.toggle("show");
        dropbtnElement.classList.toggle("active");
    });
})