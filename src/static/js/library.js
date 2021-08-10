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

let library = {
    books: [],
    addBook: function(book) {
        this.books.push(book);
    },
}

function Book(title, author, pageNumber, isRead) {
    this.title = title;
    this.author = author;
    this.pageNumber = pageNumber;
    this.isRead = isRead;
}

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    library.addBook(new Book(
            bookForm.elements["form-title"].value,
            bookForm.elements["form-author"].value,
            bookForm.elements["form-page-number"].value,
            bookForm.elements["form-mark-read"].checked
        )
    );
    overlay.toggle();
});
