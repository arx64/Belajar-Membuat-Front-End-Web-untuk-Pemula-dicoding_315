const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF-APPS';

function isStorrageExist() {
  if (typeof Storage === undefined) {
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

  const searchBookForm = document.getElementById('searchBook');
  searchBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });

  function searchBook() {
    // loadDataFromStorage();
    const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const resultBook = document.getElementById('resultBook');
    const notFound = document.getElementById('notFound');
    const judulBuku = document.getElementById('judulBuku');
    const foundBook = document.getElementById('foundBook');
    const content_book = document.getElementById('content_book');
    content_book.innerText = '';
    foundBook.innerText = '';
    console.log(searchBookTitle);

    const searchResult = books.filter((book) => book.title.toLowerCase().includes(searchBookTitle));
    foundBook.innerText = searchResult.length;
    // console.log(searchResult);

    if (typeof searchBookTitle === "string" && searchBookTitle.length === 0) {
      resultBook.setAttribute('hidden', true);
      notFound.removeAttribute('hidden');
      notFound.innerHTML = '<h3 style="color: red;">Nama buku tidak boleh kosong!</h3>';

    } else if (searchResult.length > 0) {
      resultBook.removeAttribute('hidden');
      notFound.setAttribute('hidden', true);

      for (const book_result of searchResult) {
      const textBookTitle = document.createElement('h3');
      textBookTitle.innerText = book_result.title;

      const textBookAuthor = document.createElement('p');
      textBookAuthor.innerText = 'Penulis: ' + book_result.author;

      const textBookYear = document.createElement('p');
      textBookYear.innerText = 'Tahun: ' + book_result.year;

      const articleElement = document.createElement('article');
      articleElement.classList.add('book_item');
      articleElement.append(textBookTitle, textBookAuthor, textBookYear);


      const textContainer = document.createElement('div');
      textContainer.classList.add('book_list');
      textContainer.appendChild(articleElement);
      content_book.append(textContainer);
      }


    } else {
      resultBook.setAttribute('hidden', true);
      notFound.removeAttribute('hidden');
      judulBuku.innerText = searchBookTitle;
    }
    console.log(searchResult);
  }

  function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    console.log('ID Buku: ' + generatedID + '\nJudul: ' + bookTitle + '\nPenulis: ' + bookAuthor + '\nTahun terbit: ' + bookYear + '\nSelesai dibaca: ' + isComplete);
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete);
    books.push(bookObject);
    console.log(typeof JSON.stringify(bookObject));

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const book_item of books) {
      const bookElement = makeBook(book_item);

      if (book_item.isComplete) {
        completeBookshelfList.append(bookElement);
      } else {
        incompleteBookshelfList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {
    const textBookTitle = document.createElement('h3');
    textBookTitle.innerText = bookObject.title;

    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = 'Penulis: ' + bookObject.author;

    const textBookYear = document.createElement('p');
    textBookYear.innerText = 'Tahun: ' + bookObject.year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textBookTitle, textBookAuthor, textBookYear);

    if (bookObject.isComplete) {
      const undoFinishedButton = document.createElement('button');
      undoFinishedButton.classList.add('green');
      undoFinishedButton.innerText = 'Belum selesai dibaca';

      undoFinishedButton.addEventListener('click', function () {
        undoFinishedFromCompleted(bookObject.id);
        // console.log(bookObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('red');
      trashButton.innerText = 'Hapus buku';

      trashButton.addEventListener('click', function () {
        const userConfirmed = confirm(`Yakin ingin menghapus buku "${bookObject.title}"?`);
        if (userConfirmed) {
          alert(`Sukses menghapus buku: ${bookObject.title}`);
          removeBook(bookObject.id);
        } else {
          alert('Menghapus buku dibatalkan!');
        }
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
        const userConfirmed = confirm(`Yakin ingin menghapus buku "${bookObject.title}"?`);
        if (userConfirmed) {
          alert(`Sukses menghapus buku: ${bookObject.title}`);
          removeBook(bookObject.id);
        } else {
          alert('Menghapus buku dibatalkan!');
        }
      });

      const actionContainer = document.createElement('div');
      actionContainer.classList.add('action');
      actionContainer.append(FinishedButton, trashButton);
      textContainer.append(actionContainer);
    }

    return textContainer;
  }

  function removeBook(bookId) {
    // console.log(bookId);
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoFinishedFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function FinishedFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
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
    console.log(typeof localStorage.getItem(STORAGE_KEY));
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
