# general.js â€” Fetch all books (author, title, ISBN)

This repository contains `general.js` which provides two ways to fetch books using Axios:
- `fetchBooksWithPromises(apiUrl)` â€” returns a Promise
- `fetchBooksAsync(apiUrl)` â€” async/await

How to run locally:
1. Create a folder and add `general.js`.
2. Run `npm init -y`
3. Run `npm install axios`
4. Run: `node general.js https://example.com/api/books`

API note: `general.js` accepts APIs that return either an array of book objects or an object with a `books` array. Each returned book is normalized to have `title`, `author`, and `isbn`.

To submit:
1. Push the files to a public GitHub repository.
2. Open the file in GitHub and copy the browser URL (the `blob` URL) â€” e.g.
   `https://github.com/<your-username>/<repo>/blob/main/general.js`
3. Paste that public URL into your assignment submission.
