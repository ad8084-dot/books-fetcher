/**
 * general.js
 *
 * Two implementations to fetch books using Axios:
 *  - fetchBooksWithPromises(apiUrl)  -> returns a Promise
 *  - fetchBooksAsync(apiUrl)         -> async/await
 *
 * Both functions normalize each book to: { title, author, isbn }
 *
 * Usage:
 *  const { fetchBooksWithPromises, fetchBooksAsync } = require('./general');
 *  fetchBooksAsync('https://example.com/api/books').then(console.log).catch(console.error);
 *
 * When running from command line: node general.js <API_URL>
 */

const axios = require('axios');

/**
 * Normalize a raw book object into the expected shape.
 * Tries common field names and falls back to placeholders if unavailable.
 */
function normalizeBook(raw = {}) {
  const title = raw.title || raw.name || raw.bookTitle || '';
  const author =
    (raw.author && (typeof raw.author === 'string' ? raw.author : raw.author.name)) ||
    raw.authors ||
    raw.writer ||
    '';
  // isbn can appear as isbn, ISBN, identifiers array, or industryIdentifiers
  let isbn = raw.isbn || raw.ISBN || '';
  if (!isbn && Array.isArray(raw.identifiers) && raw.identifiers.length) {
    isbn = raw.identifiers.find(id => id.type && id.type.toLowerCase().includes('isbn'))?.identifier || raw.identifiers[0].identifier || '';
  }
  if (!isbn && Array.isArray(raw.industryIdentifiers) && raw.industryIdentifiers.length) {
    isbn = raw.industryIdentifiers[0].identifier || '';
  }

  return { title, author, isbn };
}

/**
 * Fetch books using Promise style (returns a Promise).
 * Expects the API to return either an array (res.data) or an object with a books property.
 *
 * @param {string} apiUrl
 * @returns {Promise<Array<{title:string,author:string,isbn:string}>>}
 */
function fetchBooksWithPromises(apiUrl) {
  if (!apiUrl) return Promise.reject(new Error('apiUrl is required'));
  return axios
    .get(apiUrl)
    .then(response => {
      const payload = response.data;
      const rawList = Array.isArray(payload) ? payload : payload && payload.books ? payload.books : [];
      return rawList.map(normalizeBook);
    })
    .catch(err => {
      // Re-throw or wrap the error for the caller
      throw new Error(`Failed to fetch books: ${err.message}`);
    });
}

/**
 * Fetch books using async/await.
 *
 * @param {string} apiUrl
 * @returns {Promise<Array<{title:string,author:string,isbn:string}>>}
 */
async function fetchBooksAsync(apiUrl) {
  if (!apiUrl) throw new Error('apiUrl is required');
  try {
    const response = await axios.get(apiUrl);
    const payload = response.data;
    const rawList = Array.isArray(payload) ? payload : payload && payload.books ? payload.books : [];
    return rawList.map(normalizeBook);
  } catch (err) {
    throw new Error(`Failed to fetch books: ${err.message}`);
  }
}

module.exports = {
  fetchBooksWithPromises,
  fetchBooksAsync,
  normalizeBook,
};

// If run directly, fetch from provided URL and print JSON result
if (require.main === module) {
  const apiUrl = process.argv[2];
  if (!apiUrl) {
    console.error('Usage: node general.js <API_URL>');
    process.exit(2);
  }
  fetchBooksAsync(apiUrl)
    .then(books => {
      console.log(JSON.stringify(books, null, 2));
    })
    .catch(err => {
      console.error(err.message);
      process.exit(1);
    });
}