const { addBookHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId?}',
    handler: function(request, h) {

    },
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: function(request, h) {

    },

  },

  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: function(request, h) {

    },

  },
];

module.exports(routes);
