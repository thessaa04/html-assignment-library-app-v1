// URL API Server
const apiUrl = 'http://localhost:3333/books';

// Fetch semua buku saat halaman di-load pertama kali
window.onload = async function() {
    await fetchBooks();
};

// Fungsi untuk mengambil dan menampilkan semua data buku
async function fetchBooks() {
    try {
        const response = await fetch(apiUrl);
        const books = await response.json();

        // Tampilkan buku di tabel
        const tableBody = document.getElementById('book-table-body');
        tableBody.innerHTML = ''; // Clear table body

        books.forEach((book) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.quantity}</td>
                <td>
                    <button onclick="editBook(${book.id})">Edit</button>
                    <button onclick="deleteBook(${book.id})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Fungsi untuk menambah buku baru
async function addBook(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = parseInt(document.getElementById('year').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    const newBook = { title, author, year, quantity };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            alert('Buku berhasil ditambahkan!');
            await fetchBooks(); // Refresh data buku
            document.getElementById('book-form').reset(); // Reset form
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Fungsi untuk menampilkan form edit dan mengisi data buku yang akan diedit
async function editBook(bookId) {
    try {
        const response = await fetch(`${apiUrl}/${bookId}`);
        const book = await response.json();

        document.getElementById('edit-id').value = book.id;
        document.getElementById('edit-title').value = book.title;
        document.getElementById('edit-author').value = book.author;
        document.getElementById('edit-year').value = book.year;
        document.getElementById('edit-quantity').value = book.quantity;

        // Tampilkan form edit
        document.getElementById('edit-book-form').style.display = 'block';
    } catch (error) {
        console.error('Error fetching book data:', error);
    }
}

// Fungsi untuk mengubah data buku
async function updateBook(event) {
    event.preventDefault();

    const id = parseInt(document.getElementById('edit-id').value);
    const title = document.getElementById('edit-title').value;
    const author = document.getElementById('edit-author').value;
    const year = parseInt(document.getElementById('edit-year').value);
    const quantity = parseInt(document.getElementById('edit-quantity').value);

    const updatedBook = { title, author, year, quantity };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
        });

        if (response.ok) {
            alert('Buku berhasil diubah!');
            await fetchBooks(); // Refresh data buku
            document.getElementById('edit-book-form').style.display = 'none'; // Sembunyikan form edit
        }
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

// Fungsi untuk menghapus buku berdasarkan ID
async function deleteBook(bookId) {
    const confirmDelete = confirm('Apakah kamu yakin ingin menghapus buku ini?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiUrl}/${bookId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Buku berhasil dihapus!');
            await fetchBooks(); // Refresh data buku
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}
