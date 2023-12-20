const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    function generateId() {
        return +new Date();
    }

    function isStorageExist() {
        if (typeof (Storage) === undefined) {
            alert('Browser kamu tidak mendukung local storage');
            return false;
        }
        return true;
    }

    function addBook() {
        const idBuku = generateId();
        const judulBuku = document.getElementById('inputBookTitle').value;
        const penulisBuku = document.getElementById('inputBookAuthor').value;
        const tahunTerbit = document.getElementById('inputBookYear').value;
        const selesaiBaca = document.getElementById('inputBookIsComplete').checked;
        console.log('ID Buku: ' + idBuku + '\nJudul: ' + judulBuku + '\nPenulis: '+ penulisBuku + '\nTahun terbit: ' + tahunTerbit + '\nSelesai dibaca: ' + selesaiBaca);
        const bookObject = generateBookObject(idBuku, judulBuku, penulisBuku, tahunTerbit, selesaiBaca);
        books.push(bookObject);
        console.log(books);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveChanges();
    }

    function saveChanges() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));

        }
    }
    function generateBookObject(idBuku, judulBuku, penulisBuku, tahunTerbit, selesaiBaca) {
        return {
            idBuku,
            judulBuku,
            penulisBuku,
            tahunTerbit,
            selesaiBaca,
        };
    }

    function loadDataBookFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);
        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }

        doocument.dispatchEvent(new Event(RENDER_EVENT));
    }

    function makeBook(bookObject) {
        const bookTitle = document.createElement('h3');
        bookTitle.innerText = bookObject.judulBuku;

        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = bookObject.penulisBuku;

        const yearBook = document.createElement('p');
        yearBook.innerText = bookObject.tahunTerbit;

        const textContainer = document.createElement('article');
        textContainer.classList.add('book_item');
        // textContainer.setAttribute('id', 'IncompleteBookshelfList');
        textContainer.append(bookTitle, bookAuthor, yearBook);

        const container = document.createElement('div');
        container.classList.add('book_list');
        container.setAttribute('id', incompleteBookshelfList);

        if (bookObject.selesaiBaca) {
            const belumSelesai = document.createElement('button');
            belumSelesai.classList.add('belumSelesai-btn');

            belumSelesai.addEventListener('click', function () {
                belumSelesaiDibaca(bookObject.idBuku);
            });

            const hapusBuku = document.createElement('button');
            hapusBuku.classList.add('hapusBuku-btn');

            hapusBuku.addEventListener('click', function () {
                hapusBuku(bookObject.idBuku);
            });

            container.append(belumSelesai, hapusBuku);
        } else {

        }

        return container;
    }

    document.addEventListener(RENDER_EVENT, function () {
        const listBelumSelesai = document.getElementById('incompleteBookshelfList');
        listBelumSelesai.innerHTML = '';

        const selesaiBaca = document.getElementById('completeBookshelfList');
        selesaiBaca.innerHTML = '';

        for (const book of books) {
            const bookElement = makeBook(book);
            if (!book.selesaiBaca) {
                listBelumSelesai.append(bookElement);
            } else {
                selesaiBaca.append(bookElement);
            }
        }
    });
});