const addFolderToggleBtn = document.getElementById("addFolderToggle");
const addFolderBox = document.getElementById("addFolderBox");

addFolderToggleBtn.addEventListener("click", function() {
    addFolderBox.classList.toggle("hidden");
});

const addFolderButton = document.getElementById("createFolderBtn");
const container = document.getElementById("foldersGridContainer");
const folderNameInput = document.getElementById("folderName")

addFolderButton.addEventListener("click", function() {

    const folderName = folderNameInput.value.trim();
    if (!folderName) return; // prevent empty buttons

    // 1️⃣ Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "button-wrapper";

    // 2️⃣ Create button
    const newBox = document.createElement("button");
    newBox.classList.add("folderBox");
    newBox.textContent = folderName;

    // 3️⃣ Add SVG using innerHTML
    wrapper.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
             fill="currentColor" class="delFolder" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
    `;

    // 4️⃣ Put button inside wrapper (BEFORE the SVG)
    wrapper.prepend(newBox);

    // 5️⃣ Add wrapper to container
    container.appendChild(wrapper);

    // 6️⃣ Delete when SVG clicked
    

    // 7️⃣ Clear input properly
    folderNameInput.value = "";
});
