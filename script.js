import { StorageService } from "./storage.js";

const myLibrary = StorageService.getLibrary();
const dialog = document.querySelector("dialog");
const formButton = document.querySelector(".open-dialog");
const closeButton = document.querySelector(".close-dialog");
const tableBody = document.querySelector("tbody");

displayBooks();

function Book({ title, author, pages, status }) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

function addBook(e) {
  e.preventDefault();
  const { title, author, pages, status } = e.target.elements;

  const bookData = {
    title: title.value,
    author: author.value,
    pages: parseInt(pages.value),
    status: status.value,
  };

  const newBook = new Book({ ...bookData });

  myLibrary.push(newBook);
  StorageService.saveLibrary(myLibrary); // Save to localStorage
  displayOneBook(newBook, myLibrary.indexOf(newBook));
  document.querySelector(".add-book-form").reset();
  dialog.close();
}

function displayBooks() {
  tableBody.innerHTML = "";
  myLibrary.forEach((book, index) => {
    const card = createCard(book, index);
    tableBody.appendChild(card);
  });
}

function displayOneBook(book, index) {
  const card = createCard(book, index);
  tableBody.appendChild(card);
}

function createCard(book, index) {
  const card = document.createElement("tr");
  card.setAttribute("data-index", index);
  card.classList.add("book-card");

  let keys = Object.keys(book);
  keys.forEach((key) => {
    const property = document.createElement("td");
    if (key === "status") {
      const statusButton = document.createElement("button");
      statusButton.classList.add("status-btn");
      statusButton.addEventListener("click", toggleStatus);
      switch (book[key]) {
        case "read":
          statusButton.textContent = "Read";
          statusButton.style.backgroundColor = "blue";
          break;
        case "unread":
          statusButton.textContent = "Unread";
          statusButton.style.backgroundColor = "gray";
          break;
        case "reading":
          statusButton.textContent = "Reading";
          statusButton.style.backgroundColor = "orange";
          break;
      }
      property.appendChild(statusButton);
    } else {
      property.textContent = book[key];
    }
    card.appendChild(property);
  });

  let property = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";
  deleteButton.dataset.index = index;
  deleteButton.addEventListener("click", deleteBook);
  property.appendChild(deleteButton);
  card.appendChild(property);

  property = document.createElement("td");
  const currPageInput = document.createElement("input");
  currPageInput.type = "number";
  currPageInput.defaultValue = 1;
  currPageInput.min = 1;
  currPageInput.max = book.pages;
  currPageInput.classList.add("curr-page-input");
  property.appendChild(currPageInput);
  card.appendChild(property);

  return card;
}

function deleteBook(e) {
  const index = e.target.dataset.index;
  myLibrary.splice(index, 1);
  StorageService.saveLibrary(myLibrary); // Save to localStorage
  displayBooks();
}

function toggleStatus(e) {
  const statusButton = e.target;
  const bookIndex = statusButton.closest(".book-card").dataset.index;
  const book = myLibrary[bookIndex];

  switch (statusButton.textContent) {
    case "Read":
      statusButton.textContent = "Unread";
      statusButton.style.backgroundColor = "gray";
      book.status = "unread";
      break;
    case "Unread":
      statusButton.textContent = "Reading";
      statusButton.style.backgroundColor = "orange";
      book.status = "reading";
      break;
    case "Reading":
      statusButton.textContent = "Read";
      statusButton.style.backgroundColor = "blue";
      book.status = "read";
      break;
  }
  StorageService.saveLibrary(myLibrary); // Save to localStorage
}

formButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
  document.querySelector(".add-book-form").reset();
});

document.querySelector(".add-book-form").addEventListener("submit", addBook);
