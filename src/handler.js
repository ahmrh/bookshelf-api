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
  const bookId = request.params.bookId ? request.params.bookId : null;

  if (bookId !== null) {
    const searchBook = (bookId) => {
      books.forEach((book) => {
        if (book.id == bookId) return book;
      });

      return null;
    };

    const book = searchBook(bookId);
    console.log(book);

    if (book === null) {
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

  const searchedBooks = [];

  books.forEach((book) => {
    searchedBooks.push(createBookDetail(book));
  });

  const response = h.response({
    status: "success",
    data: {
      books: searchedBooks,
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
    if (name === null) return "Gagal memperbarui buku. Mohon isi nama buku";
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
    books.forEach((book) => {
      if (book.id === bookId) {
        book.year = year;
        book.author = author;
        book.summary = summary;
        book.publisher = publisher;
        book.pageCount = pageCount;
        book.readPage = readPage;
        book.reading = reading;
        book.updatedAt = new Date().toISOString();

        return book;
      }
    });

    return null;
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
    books.forEach((book, index) => {
      if (book.id === bookId) {
        books.splice(index, 1);

        return true;
      }
    });

    return null;
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
