const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';


document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

        if (isStorageExist()) {
            loadDataFromStorage();
        }
        });
       
    
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




    function addBook() {
        const titleBook = document.getElementById('inputBookTitle').value;
        const authorBook = document.getElementById('inputBookAuthor').value;
        const yearBook = parseInt(document.getElementById('inputBookYear').value);

        const generatedID = generateId();
        const checkedBook = document.getElementById('inputBookIsComplete').checked;
        const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook,checkedBook);
        books.push(bookObject);

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
            isComplete
        }
    }

    document.addEventListener(RENDER_EVENT, function () {
        const uncompletedBookList = document.getElementById('incompleteBookshelfList');
        uncompletedBookList.innerHTML = '';

        const completedBookList = document.getElementById('completeBookshelfList');
        completedBookList.innerHTML = '';

        for (const bookItem of books) {
            const bookElement = makeBook(bookItem);
            if (!bookItem.isComplete) 
              uncompletedBookList.append(bookElement);
            else 
              completedBookList.append(bookElement);
        }
    });

    function makeBook(bookObject) {
        const textTitle = document.createElement('h2');
        textTitle.innerText = `Judul: ${bookObject.title}`;

        const textAuthor = document.createElement('h2') ;
        textAuthor.innerText = `Penulis: ${bookObject.author}`;

        const textYear = document.createElement('h2');
        textYear.innerText = `Tahun: ${bookObject.year}`;

        const textContainer = document.createElement('article');
        textContainer.classList.add('book_item');
        textContainer.append(textTitle, textAuthor, textYear);

        const container = document.createElement('div');
        container.classList.add('action');
        textContainer.append(container);
        container.setAttribute('id', `book-${bookObject.id}`);

        if (bookObject.isComplete) {
            const greenButton = document.createElement('button');
            greenButton.classList.add('green');
            greenButton.innerText = 'Belum selesai dibaca';

            greenButton.addEventListener('click', function (){
                greenButtonFromCompleted(bookObject.id);
            });

            const redButton = document.createElement('button');
            redButton.classList.add('red');
            redButton.innerText = 'Hapus buku';

            redButton.addEventListener('click', function (){
                redButtonRemoveCompleted(bookObject.id);
            });

            container.append(greenButton, redButton);
        } else {
            const greenButtonSuccess = document.createElement('button');
            greenButtonSuccess.classList.add('green');
            greenButtonSuccess.innerText='Selesai dibaca';

            greenButtonSuccess.addEventListener('click', function () {
                greenButtonSuccessFromCompleted(bookObject.id);
            });

            const redButtonSuccess = document.createElement('button');
            redButtonSuccess.classList.add('red');
            redButtonSuccess.innerText='Hapus buku';

            redButtonSuccess.addEventListener('click', function () {
                redButtonSuccessRemoveCompleted(bookObject.id);
            });

            container.append(greenButtonSuccess, redButtonSuccess);
        }

        return textContainer;
    }

function greenButtonSuccessFromCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function redButtonSuccessRemoveCompleted (bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function greenButtonFromCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function redButtonRemoveCompleted (bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if(books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}
