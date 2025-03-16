const API_URL = '/novels';

// 📌 Ambil semua novel
async function loadNovels() {
    try {
        const response = await fetch(API_URL);
        const novels = await response.json();

        const novelList = document.getElementById('novel-list');
        novelList.innerHTML = '';

        novels.forEach(novel => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${novel.title}</strong> - ${novel.author} (${novel.year}) - Rating: ${novel.rating}`;
            novelList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching novels:', error);
    }
}

// 📌 Ambil novel dengan rating tertinggi
async function getHighestRated() {
    try {
        const response = await fetch(`${API_URL}/highest-rated`);
        const novel = await response.json();

        alert(`Novel dengan rating tertinggi: ${novel.title} - Rating: ${novel.rating}`);
    } catch (error) {
        console.error('Error fetching highest rated novel:', error);
    }
}

// 📌 Cari novel berdasarkan judul
async function getNovelsByTitle() {
    const title = document.getElementById('search-title').value.trim();
    if (!title) {
        alert('Masukkan judul novel yang ingin dicari');
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error('Novel tidak ditemukan');

        const novels = await response.json();  // Bisa berupa array

        if (Array.isArray(novels) && novels.length > 0) {
            // Ambil semua hasil pencarian
            const resultText = novels.map(novel =>
                `Ditemukan: ${novel.title} oleh ${novel.author}, Rating: ${novel.rating}`
            ).join("\n");

            alert(resultText);
        } else {
            throw new Error('Novel tidak ditemukan');
        }
    } catch (error) {
        alert(error.message);
    }
}

// 📌 Tambah novel baru
async function addNovel() {
    const novel = {
        title: document.getElementById('add-title').value.trim(),
        year: parseInt(document.getElementById('add-year').value),
        author: document.getElementById('add-author').value.trim(),
        genre: document.getElementById('add-genre').value.trim(),
        pages: parseInt(document.getElementById('add-pages').value),
        rating: parseFloat(document.getElementById('add-rating').value),
        summary: document.getElementById('add-summary').value.trim()
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novel)
        });

        if (!response.ok) throw new Error('Gagal menambah novel');

        alert('Novel berhasil ditambahkan!');
        loadNovels(); // Refresh daftar novel
    } catch (error) {
        alert(error.message);
    }
}

// 📌 Update novel berdasarkan judul
async function updateNovel() {
    const title = document.getElementById('update-title').value.trim();
    const updatedData = {
        rating: parseFloat(document.getElementById('update-rating').value),
        pages: parseInt(document.getElementById('update-pages').value)
    };

    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(title)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error('Gagal memperbarui novel');

        alert('Novel berhasil diperbarui!');
        loadNovels();
    } catch (error) {
        alert(error.message);
    }
}

// 📌 Hapus novel berdasarkan judul
async function deleteNovel() {
    const title = document.getElementById('delete-title').value.trim();
    if (!title) {
        alert('Masukkan judul novel yang ingin dihapus');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(title)}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Gagal menghapus novel');

        alert('Novel berhasil dihapus!');
        loadNovels();
    } catch (error) {
        alert(error.message);
    }
}
