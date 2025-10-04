export const StorageService = {
  saveLibrary(books) {
    localStorage.setItem("myLibrary", JSON.stringify(books));
  },

  getLibrary() {
    const books = localStorage.getItem("myLibrary");
    return books ? JSON.parse(books) : [];
  },
};
