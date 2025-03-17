const API_URL = '/novels';

// Pagination variables
let currentPage = 1;
const novelsPerPage = 9;
let allNovels = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initial page should be home (search)
    showHomePage();
    
    // Event listeners for keypresses
    document.getElementById('search-title').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getNovelsByTitle();
    });
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    });
});

// Page navigation functions
function showHomePage() {
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('novel-list-section').style.display = 'none';
    document.getElementById('best-novel-section').style.display = 'none';
    document.getElementById('add-novel-section').style.display = 'block';
    
    // Clear search results
    document.getElementById('search-list').innerHTML = '';
}

function showNovelList() {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('novel-list-section').style.display = 'block';
    document.getElementById('best-novel-section').style.display = 'none';
    document.getElementById('add-novel-section').style.display = 'none';
    
    // Load novels with pagination
    loadNovelsPaginated();
}

function showBestNovel() {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('novel-list-section').style.display = 'none';
    document.getElementById('best-novel-section').style.display = 'block';
    document.getElementById('add-novel-section').style.display = 'none';
    
    // Load best novel
    loadBestNovel();
}

// Modal functions
function openModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Show alert messages
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Format a novel item for display with edit and delete icons
function formatNovelItem(novel, includeActions = true) {
    const li = document.createElement('li');
    li.className = 'novel-card';
    li.dataset.title = novel.title; // Store title as data attribute for easy access
    
    // Create star rating display
    const starRating = getStarRating(novel.rating);
    
    let actionsHTML = '';
    if (includeActions) {
        actionsHTML = `
            <div class="card-actions">
                <i class="fas fa-edit action-icon edit-icon" onclick="showEditModal('${novel.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}')"></i>
                <i class="fas fa-trash action-icon delete-icon" onclick="showDeleteModal('${novel.title.replace(/'/g, "\\'").replace(/"/g, '\\"')}')"></i>
            </div>
        `;
    }
    
    li.innerHTML = `
        ${actionsHTML}
        <h4 class="novel-title">${novel.title}</h4>
        <p class="novel-author">by ${novel.author}</p>
        <p>${novel.genre} | ${novel.year}</p>
        <div class="novel-meta">
            <span>${novel.pages} halaman</span>
            <span class="novel-rating">${starRating} (${novel.rating})</span>
        </div>
    `;
    return li;
}

// Generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

async function loadNovelsPaginated() {
    try {
        const loadingEl = document.getElementById('loading-novels');
        loadingEl.style.display = 'block';
        
        const response = await fetch(API_URL);
        allNovels = await response.json();
        
        loadingEl.style.display = 'none';

        if (allNovels.length === 0) {
            document.getElementById('novel-list').innerHTML = '<div class="empty-state"><p>Tidak ada novel dalam koleksi</p></div>';
            return;
        }

        // Tampilkan halaman pertama dengan 9 novel
        currentPage = 1;
        displayCurrentPage();

    } catch (error) {
        console.error('Error fetching novels:', error);
        showAlert('Gagal memuat data novel', 'error');
    }
}

// Display current page of novels
function displayCurrentPage() {
    const novelList = document.getElementById('novel-list');
    novelList.innerHTML = '';
    
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * novelsPerPage;
    const endIndex = Math.min(startIndex + novelsPerPage, allNovels.length);
    
    // Get current page novels
    const currentNovels = allNovels.slice(startIndex, endIndex);
    
    // Display novels
    currentNovels.forEach((novel, index) => {
        const novelElement = formatNovelItem(novel);
        novelList.appendChild(novelElement);
        
        // Add animation effect
        novelElement.style.opacity = '0';
        novelElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            novelElement.style.transition = 'all 0.3s ease';
            novelElement.style.opacity = '1';
            novelElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Update pagination controls
    updatePagination();
}

// Update pagination buttons and indicator
function updatePagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');
    
    // Calculate total pages
    const totalPages = Math.ceil(allNovels.length / novelsPerPage);
    
    // Update page indicator
    pageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages}`;
    
    // Enable/disable previous button
    prevButton.disabled = currentPage === 1;
    
    // Enable/disable next button
    nextButton.disabled = currentPage === totalPages;
}

// Navigate to previous page
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayCurrentPage();
    }
}

// Navigate to next page
function nextPage() {
    const totalPages = Math.ceil(allNovels.length / novelsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayCurrentPage();
    }
}

// Load and display best novel 
async function loadBestNovel() {
    try {
        const bestNovelContainer = document.getElementById('best-novel-container');
        bestNovelContainer.innerHTML = '<div class="loading">Memuat novel terbaik...</div>';
        
        const response = await fetch(`${API_URL}/highest-rated`);
        if (!response.ok) throw new Error('Gagal memuat data');
        
        const novel = await response.json();
        
        // Create a special display for best novel
        const starRating = getStarRating(novel.rating);
        
        bestNovelContainer.innerHTML = `
            <div class="best-novel-card">
                <div class="best-badge">Rating Tertinggi</div>
                <h2 class="novel-title">${novel.title}</h2>
                <p class="novel-author">by ${novel.author}</p>
                <p style="margin: 15px 0;">${novel.genre} | ${novel.year}</p>
                <div class="novel-meta" style="margin-bottom: 15px;">
                    <span>${novel.pages} halaman</span>
                    <span class="novel-rating">${starRating} (${novel.rating})</span>
                </div>
                ${novel.summary ? `<p style="margin-top: 20px; font-style: italic;">"${novel.summary}"</p>` : ''}
            </div>
        `;
    } catch (error) {
        console.error('Error fetching highest rated novel:', error);
        showAlert('Gagal memuat novel dengan rating tertinggi', 'error');
    }
}

// Search novels by title
async function getNovelsByTitle() {
    const title = document.getElementById('search-title').value.trim();
    if (!title) {
        showAlert('Masukkan judul novel yang ingin dicari', 'error');
        return;
    }
    
    try {
        const searchList = document.getElementById('search-list');
        searchList.innerHTML = '<div class="loading">Mencari novel...</div>';
        
        const response = await fetch(`${API_URL}/${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error('Novel tidak ditemukan');

        const novels = await response.json();
        
        searchList.innerHTML = '';
        
        if (Array.isArray(novels) && novels.length > 0) {
            // Display search results
            novels.forEach(novel => {
                searchList.appendChild(formatNovelItem(novel));
            });
        } else if (novels) {
            // Single novel result
            searchList.appendChild(formatNovelItem(novels));
        } else {
            throw new Error('Novel tidak ditemukan');
        }
    } catch (error) {
        document.getElementById('search-list').innerHTML = 
            '<div class="empty-state"><p>Novel tidak ditemukan</p></div>';
        showAlert(error.message, 'error');
    }
}

// Validate novel data
function validateNovelData(novel) {
    if (!novel.title || novel.title.trim() === '') {
        showAlert('Judul novel tidak boleh kosong', 'error');
        return false;
    }
    
    if (!novel.author || novel.author.trim() === '') {
        showAlert('Penulis novel tidak boleh kosong', 'error');
        return false;
    }
    
    if (isNaN(novel.year) || novel.year < 1000 || novel.year > new Date().getFullYear()) {
        showAlert('Tahun terbit tidak valid', 'error');
        return false;
    }
    
    if (isNaN(novel.pages) || novel.pages <= 0) {
        showAlert('Jumlah halaman harus lebih dari 0', 'error');
        return false;
    }
    
    if (isNaN(novel.rating) || novel.rating < 0 || novel.rating > 10) {
        showAlert('Rating harus antara 0 dan 10', 'error');
        return false;
    }
    
    return true;
}

// Add new novel
async function addNovel() {
    const novel = {
        title: document.getElementById('add-title').value.trim(),
        author: document.getElementById('add-author').value.trim(),
        year: parseInt(document.getElementById('add-year').value),
        genre: document.getElementById('add-genre').value.trim(),
        pages: parseInt(document.getElementById('add-pages').value),
        rating: parseFloat(document.getElementById('add-rating').value),
        summary: document.getElementById('add-summary').value.trim()
    };
    
    if (!validateNovelData(novel)) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novel)
        });

        if (!response.ok) throw new Error('Gagal menambah novel');

        showAlert(`Novel "${novel.title}" berhasil ditambahkan!`, 'success');
        
        // Clear form
        document.getElementById('add-title').value = '';
        document.getElementById('add-author').value = '';
        document.getElementById('add-year').value = '';
        document.getElementById('add-genre').value = '';
        document.getElementById('add-pages').value = '';
        document.getElementById('add-rating').value = '';
        document.getElementById('add-summary').value = '';
        
        // Reload novels if we're on that page
        if (document.getElementById('novel-list-section').style.display === 'block') {
            loadNovelsPaginated();
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// Show edit modal for a novel
function showEditModal(title) {
    // Find the novel
    const novel = allNovels.find(n => n.title === title);
    if (!novel) {
        showAlert('Novel tidak ditemukan', 'error');
        return;
    }
    
    const modalContent = `
        <div class="form-group">
            <input type="number" step="0.1" min="0" max="10" id="edit-rating" class="form-control" 
                placeholder="Rating baru" value="${novel.rating}">
            <input type="number" min="1" id="edit-pages" class="form-control" 
                placeholder="Jumlah halaman baru" value="${novel.pages}">
        </div>
        <button class="btn" onclick="updateNovelFromModal('${title}')">
            <i class="fas fa-sync-alt"></i> Perbarui
        </button>
    `;
    
    openModal(`Edit Novel: ${title}`, modalContent);
}

// Show delete confirmation modal
function showDeleteModal(title) {
    const modalContent = `
        <p>Apakah Anda yakin ingin menghapus novel "${title}"?</p>
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button class="btn" onclick="closeModal()">Batal</button>
            <button class="btn btn-accent" onclick="deleteNovelFromModal('${title}')">
                <i class="fas fa-trash"></i> Hapus
            </button>
        </div>
            `;
    
    openModal('Konfirmasi Hapus', modalContent);
}

// Delete novel from modal
async function deleteNovelFromModal(title) {
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(title)}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Gagal menghapus novel');

        showAlert(`Novel "${title}" berhasil dihapus!`, 'success');
        closeModal();

        // Perbarui daftar novel jika sedang ditampilkan
        if (document.getElementById('novel-list-section').style.display === 'block') {
            loadNovelsPaginated();
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// Update novel from modal
async function updateNovelFromModal(title) {
    const newRating = parseFloat(document.getElementById('edit-rating').value);
    const newPages = parseInt(document.getElementById('edit-pages').value);

    if (isNaN(newRating) || newRating < 0 || newRating > 10) {
        showAlert('Rating harus antara 0 dan 10', 'error');
        return;
    }

    if (isNaN(newPages) || newPages <= 0) {
        showAlert('Jumlah halaman harus lebih dari 0', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(title)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: newRating, pages: newPages })
        });

        if (!response.ok) throw new Error('Gagal memperbarui novel');

        showAlert(`Novel "${title}" berhasil diperbarui!`, 'success');
        closeModal();

        // Perbarui daftar novel jika sedang ditampilkan
        if (document.getElementById('novel-list-section').style.display === 'block') {
            loadNovelsPaginated();
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
