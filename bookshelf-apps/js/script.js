const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF-APPS';

function isStorrageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}
document.addEventListener('DOMContentLoaded', function () {
  const addBookForm = document.getElementById('inputBook');
  addBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const finishedReading = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    console.log('ID Buku: ' + generatedID + '\nJudul: ' + bookTitle + '\nPenulis: ' + bookAuthor + '\nTahun terbit: ' + bookYear + '\nSelesai dibaca: ' + finishedReading);
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, finishedReading);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, bookTitle, bookAuthor, bookYear, finishedReading) {
    return {
      id,
      bookTitle,
      bookAuthor,
      bookYear,
      finishedReading,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const book_item of books) {
      const bookElement = makeBook(book_item);

      if (book_item.finishedReading) {
        completeBookshelfList.append(bookElement);
      } else {
        incompleteBookshelfList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {
    const textBookTitle = document.createElement('h3');
    textBookTitle.innerText = bookObject.bookTitle;

    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = 'Penulis: ' + bookObject.bookAuthor;

    const textBookYear = document.createElement('p');
    textBookYear.innerText = 'Tahun: ' + bookObject.bookYear;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textBookTitle, textBookAuthor, textBookYear);

    if (bookObject.finishedReading) {
      const undoFinishedButton = document.createElement('button');
      undoFinishedButton.classList.add('green');
      undoFinishedButton.innerText = 'Belum selesai dibaca';

      undoFinishedButton.addEventListener('click', function () {
        undoFinishedFromCompleted(bookObject.id);
        console.log(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
        removeBook(bookObject.id);
      });

      const actionContainer = document.createElement('div');
      actionContainer.classList.add('action');
      actionContainer.append(undoFinishedButton, trashButton);
      textContainer.append(actionContainer);
    } else {
      const FinishedButton = document.createElement('button');
      FinishedButton.classList.add('green');
      FinishedButton.innerText = 'Selesai dibaca';

      FinishedButton.addEventListener('click', function () {
        FinishedFromCompleted(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
        removeBook(bookObject.id);
      });

      const actionContainer = document.createElement('div');
      actionContainer.classList.add('action');
      actionContainer.append(FinishedButton, trashButton);
      textContainer.append(actionContainer);
    }

    return textContainer;
  }

  function removeBook(bookId) {
    console.log(bookId);
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoFinishedFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget == null) return;

    bookTarget.finishedReading = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function FinishedFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget == null) return;

    bookTarget.finishedReading = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const book_item of books) {
      if (book_item.id === bookId) {
        return book_item;
      }
    }

    return null;
  }

  function saveData() {
    if (isStorrageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);        
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorrageExist()) {
    loadDataFromStorage();
  }
});
