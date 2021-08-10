const overlay = document.querySelector("#overlay");
const overlayComputedStyle = getComputedStyle(overlay);
const bookForm = document.querySelector("#book-form");

overlay.toggle = (e) => {
    if (e) {
        if (e.target.id !== "add" && e.target.id !== "overlay") {
            return;
        }
    }
    
    if (overlayComputedStyle.display === "none") {
        overlay.style.display = "flex";
    }
    else {
        bookForm.reset();
        overlay.style.display = "none";
    }
}

const addBook = document.querySelector("#add");
addBook.addEventListener("click", overlay.toggle);
overlay.addEventListener("click", overlay.toggle);

