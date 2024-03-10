const { nanoid } = require("nanoid");
const { Book, books } = require("./books");



const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const validateBook = (name, pageCount, readPage) => {
    if (name === null) return "Gagal menambahkan buku. Mohon isi nama buku";
    if (readPage > pageCount) return "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
    return null; 
  }
  
  const error = validateBook(name, pageCount, readPage);
  if(error){
    const response = h.response({
      status: "fail",
      message: error,
    });
    response.code(201);
  
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = new Book(id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt )

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

}

module.exports = { addBookHandler, getBookHandler};
