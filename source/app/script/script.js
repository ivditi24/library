const add = document.querySelector(".main__btn");
const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");

const submit_btn = document.querySelector(".form__submit");
const library_section = document.querySelector(".library");

class Book {
  constructor(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
  }
}

class Library {
  static createElement(tag, text, className) {
    const elem = document.createElement(tag);
    elem.innerText = text;
    elem.classList.add(className);

    return elem;
  }

  constructor() {
    this.library = JSON.parse(localStorage.getItem("Books")) || [];
  }

  addBook(book) {
    this.library.push(book);
    this.save();
    this.updateLibrary(book);
  }

  save() {
    localStorage.setItem("Books", JSON.stringify(this.library));
  }

  remove(e) {
    const book = e.target.parentElement;

    for (let x = 0, l = this.library.length; x < l; x++) {
      if (this.library[x].title === book.firstChild.textContent) {
        this.library.splice(x, 1);
      }
    }
    this.save();

    library_section.removeChild(book);
  }

  toggleReadStatus(e) {
    const bookTitle = e.target.parentElement.firstChild.textContent;

    if (e.target.innerText === "Read") {
      e.target.innerText = "Not Read";
    } else {
      e.target.innerText = "Read";
    }

    for (let book of this.library) {
      if (bookTitle === book.title) {
        book.readStatus = e.target.innerText;
      }
    }

    this.save();
  }

  updateLibrary(book) {
    const bookElement = Library.createElement("div", "", "library__book");
    const titleElement = Library.createElement(
      "h1",
      book.title,
      "library__book-title"
    );
    const authorElement = Library.createElement(
      "h2",
      book.author,
      "library__book-author"
    );
    const pagesElement = Library.createElement(
      "h3",
      book.pages,
      "library__book-pages"
    );
    const readElement = Library.createElement(
      "button",
      book.readStatus,
      "library__book-read"
    );
    const removeElement = Library.createElement(
      "button",
      "Remove",
      "library__book-remove"
    );

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(pagesElement);
    bookElement.appendChild(readElement);
    bookElement.appendChild(removeElement);
    library_section.appendChild(bookElement);

    removeElement.addEventListener("click", (e) => this.remove(e));
    readElement.addEventListener("click", (e) => this.toggleReadStatus(e));
  }

  showBookOnLoad() {
    this.library.forEach((book) => {
      this.updateLibrary(book);
    });
  }
}

const library = new Library();

library.showBookOnLoad();

const getBook = () => {
  const title = document.querySelector("[data-title]").value;
  const author = document.querySelector("[data-author]").value;
  const pages = document.querySelector("[data-pages]").value;
  const read = document.querySelector("[data-read]").checked;

  const readStatus = read ? "Read" : "Not read";

  return new Book(title, author, pages, readStatus);
};

const resetForm = () => {
  document.querySelector("[data-title]").value = "";
  document.querySelector("[data-author]").value = "";
  document.querySelector("[data-pages]").value = "";

  [form, overlay].forEach((el) => el.classList.remove("open"));
};

submit_btn.addEventListener("click", (e) => {
  if (form.checkValidity()) {
    e.preventDefault();
    library.addBook(getBook());
    resetForm();
  }
});

add.addEventListener("click", () => {
  [form, overlay].forEach((el) => el.classList.add("open"));
});

overlay.addEventListener("click", () => {
  resetForm();
});
