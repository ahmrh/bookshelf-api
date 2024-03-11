class Book {
  constructor(id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt) {
    this.id = id
    this.name = name

    this.year = Number(year)

    this.author = author
    this.name = name
    this.summary = summary
    this.publisher = publisher

    this.pageCount = Number(pageCount)
    this.readPage = Number(readPage)

    this.finished = Boolean(finished)
    this.reading = Boolean(reading)

    this.insertedAt = insertedAt
    this.updatedAt = updatedAt
  }
}

const books = [];

module.exports = { Book, books };
