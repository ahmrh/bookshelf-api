const { nanoid } = require("nanoid");
const { Book, books } = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const validate = (name, pageCount, readPage) => {
    if (name === undefined)
      return "Gagal menambahkan buku. Mohon isi nama buku";
    if (readPage > pageCount)
      return "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
    return null;
  };

  const error = validate(name, pageCount, readPage);
  if (error) {
    const response = h.response({
      status: "fail",
      message: error,
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = new Book(
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  );

  books.push(newBook);

  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });
  response.code(201);

  return response;
};

const getBookHandler = (request, h) => {
  const bookId = request.params.bookId ?? null;

  if (bookId !== null) {
    const searchBook = (bookId) => {
      return books.find((book) => book.id === bookId);
    };

    const book = searchBook(bookId);

    if (book === undefined) {
      const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
      });

      response.code(404);
      return response;
    }

    const response = h.response({
      status: "success",
      data: {
        book: book,
      },
    });
    response.code(200);

    return response;
  }

  const createBookDetail = (book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  };

  const reading = request.query.reading ?? null;
  const finished = request.query.finished ?? null;
  const name = request.query.name ?? null;

  var searchedBooks = books;
  searchedBooks = reading
    ? searchedBooks.filter((book) => book.reading == reading)
    : searchedBooks;
  searchedBooks = finished
    ? searchedBooks.filter((book) => book.finished == finished)
    : searchedBooks;
  searchedBooks = name
    ? searchedBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    : searchedBooks;

  var responseBooks = searchedBooks.map((book) => createBookDetail(book));

  const response = h.response({
    status: "success",
    data: {
      books: responseBooks,
    },
  });
  response.code(200);

  return response;
};

const editBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const validate = (name, pageCount, readPage) => {
    if (name === undefined)
      return "Gagal memperbarui buku. Mohon isi nama buku";
    if (readPage > pageCount)
      return "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
    return null;
  };

  const error = validate(name, pageCount, readPage);

  if (error) {
    const response = h.response({
      status: "fail",
      message: error,
    });
    response.code(400);

    return response;
  }

  const bookId = request.params.bookId;

  const searchAndEditBook = (bookId) => {
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) return null;

    var book = books[index];

    book.name = name ?? book.name;
    book.year = year ?? book.year;
    book.author = author ?? book.author;
    book.summary = summary ?? book.summary;
    book.publisher = publisher ?? book.publisher;
    book.pageCount = pageCount ?? book.pageCount;
    book.readPage = readPage ?? book.readPage;
    book.reading = reading ?? book.reading;
    book.finished = (pageCount && pageCount === readPage) ?? book.finished; // Ensure pageCount exists
    book.updatedAt = new Date().toISOString();

    books[index] = book;

    return book;
  };

  const found = searchAndEditBook(bookId);

  if (found === null) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);

  return response;
};

const deleteBookHandler = (request, h) => {
  const bookId = request.params.bookId;

  const searchAndDeleteBook = (bookId) => {
    const index = books.findIndex((book) => book.id === bookId);

    if (index === -1) return null;

    books.splice(index, 1);

    return index;
  };

  const found = searchAndDeleteBook(bookId);

  if (found === null) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);

  return response;
};

module.exports = {
  addBookHandler,
  getBookHandler,
  editBookHandler,
  deleteBookHandler,
};
