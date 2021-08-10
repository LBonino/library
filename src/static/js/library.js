const overlay = document.querySelector("#overlay");
const overlayComputedStyle = getComputedStyle(overlay);
overlay.toggle = (e) => {
    if (e.target.id !== "add" && e.target.id !== "overlay") {
        return;
    }
    
    if (overlayComputedStyle.display === "none") {
        overlay.style.display = "flex";
    }
    else {
        overlay.style.display = "none";
    }
}

const addBook = document.querySelector("#add");
addBook.addEventListener("click", overlay.toggle);
overlay.addEventListener("click", overlay.toggle);
