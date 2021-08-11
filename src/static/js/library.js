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

Book.prototype.toggleRead = function() {
    if (this.isRead) {
        this.isRead = false;
    }
    else {
        this.isRead = true;
    }
}

function markReadHandler(e) {
    const bookInfo = e.target.closest(".card").getElementsByClassName("book-info")[0];
    const title = bookInfo.getElementsByClassName("title")[0].textContent;
    const author = bookInfo.getElementsByClassName("author")[0].textContent;

    const book = library.books.filter(book => {
        return (book.title === title && book.author === author)
    })[0];

    book.toggleRead();
    let readInfo = bookInfo.getElementsByClassName("read-info")[0];
    readInfo.textContent = (book.isRead) ? "Already read" : "Not read yet";
    this.textContent = (book.isRead) ? "Mark as unread" : "Mark as read";
    this.style.backgroundColor = (book.isRead) ? "#3d8bf0" : "white";
    this.style.color = (book.isRead) ? "white" : "#3d8bf0";
}

function generateCard(book) {
    const title = document.createElement("h2");
    const author = document.createElement("p");
    const pageNumber = document.createElement("p");
    const readInfo = document.createElement("p");
    
    title.classList.add("title");
    author.classList.add("author");
    pageNumber.classList.add("page-number");
    readInfo.classList.add("read-info");

    title.textContent = book.title;
    author.textContent = book.author;
    pageNumber.textContent = `${book.pageNumber} pages`;
    readInfo.textContent = (book.isRead) ? "Already read" : "Not read yet";

    const bookInfo = document.createElement("div");
    bookInfo.classList.add("book-info");
    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    bookInfo.appendChild(pageNumber);
    bookInfo.appendChild(readInfo);

    const markReadButton = document.createElement("button");
    const removeButton = document.createElement("button");

    markReadButton.classList.add("mark-read");
    removeButton.classList.add("remove");

    markReadButton.textContent = (book.isRead) ? "Mark as unread" : "Mark as read";
    removeButton.textContent = "Remove from library";

    markReadButton.addEventListener("click", markReadHandler);

    const cardButtons = document.createElement("div");
    cardButtons.classList.add("card-buttons");
    cardButtons.appendChild(markReadButton);
    cardButtons.appendChild(removeButton);

    const card = document.createElement("div");
    card.classList.add("card"); 
    card.appendChild(bookInfo);
    card.appendChild(cardButtons);

    return card;
}

const cardGrid = document.querySelector("#card-grid");

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const book = new Book(
        bookForm.elements["form-title"].value,
        bookForm.elements["form-author"].value,
        bookForm.elements["form-page-number"].value,
        bookForm.elements["form-mark-read"].checked
    )
    library.addBook(book);
    cardGrid.appendChild(generateCard(book));
    overlay.toggle();
});
