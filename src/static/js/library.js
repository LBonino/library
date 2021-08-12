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

if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify([]));
}

let library = {
    books: JSON.parse(localStorage.getItem("books")),
    addBook: function(book) {
        this.books.push(book);
    },
    getBook: function(title, author) {
        return this.books.filter(book => {
            return (book.title === title && book.author === author);
        })[0];
    }
}

function updateBooksLocalStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
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

// Books parsed from localStorage don't share the prototype of Book constructor
// so its needed to assign the prototype to each book object.
library.books.forEach(book => {
    Object.setPrototypeOf(book, Object.create(Book.prototype));
});

function markReadHandler(e) {
    const bookInfo = e.target.closest(".card").getElementsByClassName("book-info")[0];
    const title = bookInfo.getElementsByClassName("title")[0].textContent;
    const author = bookInfo.getElementsByClassName("author")[0].textContent;

    const book = library.getBook(title, author);

    book.toggleRead();
    updateBooksLocalStorage(library.books);
    let readInfo = bookInfo.getElementsByClassName("read-info")[0];
    readInfo.textContent = (book.isRead) ? "Already read" : "Not read yet";
    this.textContent = (book.isRead) ? "Mark as unread" : "Mark as read";
    this.style.backgroundColor = (book.isRead) ? "#3d8bf0" : "white";
    this.style.color = (book.isRead) ? "white" : "#3d8bf0";
}

function removeBook(e) {
    const bookInfo = e.target.closest(".card").getElementsByClassName("book-info")[0];
    const title = bookInfo.getElementsByClassName("title")[0].textContent;
    const author = bookInfo.getElementsByClassName("author")[0].textContent;

    library.books = library.books.filter(book => {
        return (book.title !== title && book.author !== author)
    });
    updateBooksLocalStorage(library.books);

    e.target.closest(".card").remove();
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

    markReadButton.style.backgroundColor = (book.isRead) ? "#3d8bf0" : "white";
    markReadButton.style.color = (book.isRead) ? "white" : "#3d8bf0";

    markReadButton.addEventListener("click", markReadHandler);
    removeButton.addEventListener("click", removeBook);

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

bookForm.renderError = function(message) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    
    const formItem = document.createElement("li");
    formItem.appendChild(errorMessage);
    formItem.id = "error";

    this.querySelector("ul").appendChild(formItem);
}

bookForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const book = new Book(
        bookForm.elements["form-title"].value,
        bookForm.elements["form-author"].value,
        bookForm.elements["form-page-number"].value,
        bookForm.elements["form-mark-read"].checked
    )
    if (library.getBook(book.title, book.author)) {
        if (this.querySelector("#error")) {
            return;
        }

        return bookForm.renderError("This book already exists in your library");
    }

    library.addBook(book);
    updateBooksLocalStorage(library.books);
    cardGrid.appendChild(generateCard(book));
    overlay.toggle();
});

function fillGrid(grid, items) {
    items.forEach(item => {
        grid.appendChild(generateCard(item));
    });
}

fillGrid(cardGrid, library.books);
