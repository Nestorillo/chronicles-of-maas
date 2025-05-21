document.addEventListener("DOMContentLoaded", function () {

    let books = [];
    let top3Books = [];
    let currentIndex = 0;
    let filteredBooks = [];

    const elements = {
        loading: document.getElementById('loading'),
        error: document.getElementById('error'),
        carouselImage: document.querySelector('.carousel-image'),
        carouselCaption: document.querySelector('.carousel-caption'),
        prevButton: document.querySelector('.nav-button:first-child'),
        nextButton: document.querySelector('.nav-button:last-child'),
        sortDropdown: document.getElementById('sortDropdown'),
        tagDropdown: document.getElementById('tagDropdown'),
        searchInput: document.getElementById('searchInput'),
        bookGrid: document.getElementById('bookGrid'),
        carouselContainer: document.querySelector('.carousel-container')
    };

    function updateCarousel() {
        if (top3Books.length === 0) return;

        const book = top3Books[currentIndex];
        const bookInfo = parseBookBody(book.body);

        // Actualiza imagen y alt
        elements.carouselImage.src = book.media.url;
        elements.carouselImage.alt = "Cover of " + book.title;

        // Actualiza caption
        elements.carouselCaption.innerHTML = `
            <div class="carousel-caption-content">
                <h2>${book.title}</h2>
                <p>${bookInfo.synopsis ? bookInfo.synopsis.substring(0, 300) + "..." : ""}</p>
                <span class="read-more">READ MORE</span>
            </div>
        `;

        elements.carouselImage.style.display = "block";
        elements.carouselCaption.style.display = "block";

        // Hacer toda el área del carrusel clicable (menos las flechas)
        elements.carouselContainer.onclick = function (e) {
            const isNavButton = e.target.classList.contains("nav-button");
            if (!isNavButton) {
                window.location.href = `book.html?id=${book.id}`;
            }
        };
    }

    function updateBookGrid() {
        elements.bookGrid.innerHTML = '';

        filteredBooks.forEach(book => {
            const bookInfo = parseBookBody(book.body);
            const card = document.createElement('div');
            card.className = 'book-card';
            card.style.cursor = "pointer";
            card.addEventListener('click', () => {
                window.location.href = `book.html?id=${book.id}`;
            });

            card.innerHTML = `
                <img class="book-image" src="${book.media.url}" alt="Cover of ${book.title}">
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-description">
                        ${bookInfo.synopsis ? bookInfo.synopsis : bookInfo.author ? `By ${bookInfo.author}` : book.tags.join(', ')}
                    </p>
                    <span class="read-more">READ MORE</span>
                </div>
            `;

            elements.bookGrid.appendChild(card);
        });
    }

    function filterAndSortBooks() {
        const searchQuery = elements.searchInput.value.toLowerCase();
        const selectedTag = elements.tagDropdown.value;
        const sortOption = elements.sortDropdown.value;

        filteredBooks = books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchQuery);
            const matchesTag = selectedTag === 'all' || book.tags.includes(selectedTag);
            return matchesSearch && matchesTag;
        });

        switch (sortOption) {
            case 'latest':
                filteredBooks.sort((a, b) => new Date(b.created) - new Date(a.created));
                break;
            case 'oldest':
                filteredBooks.sort((a, b) => new Date(a.created) - new Date(b.created));
                break;
            case 'titleAsc':
                filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'titleDesc':
                filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }

        updateBookGrid();
    }

    async function loadBooks() {
        try {
            const response = await fetch('https://v2.api.noroff.dev/blog/posts/Nestor?limit=20');

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.data && Array.isArray(data.data)) {
                const allData = data.data;

                const sorted = [...allData].sort((a, b) => new Date(b.created) - new Date(a.created));
                books = sorted;
                top3Books = sorted.slice(0, 3);
                filteredBooks = [...books];

                const allTags = new Set();
                allData.forEach(book => {
                    book.tags.forEach(tag => allTags.add(tag));
                });

                Array.from(allTags).sort().forEach(tag => {
                    const option = document.createElement('option');
                    option.value = tag;
                    option.textContent = tag;
                    elements.tagDropdown.appendChild(option);
                });

                elements.loading.style.display = "none";
                updateCarousel();
                updateBookGrid();
            } else {
                throw new Error("Unexpected data format");
            }
        } catch (error) {
            console.error("Error loading books:", error);
            elements.loading.style.display = "none";
            elements.error.style.display = "block";
        }
    }

    elements.prevButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (top3Books.length === 0) return;
        currentIndex = (currentIndex - 1 + top3Books.length) % top3Books.length;
        updateCarousel();
    });

    elements.nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (top3Books.length === 0) return;
        currentIndex = (currentIndex + 1) % top3Books.length;
        updateCarousel();
    });

    elements.sortDropdown.addEventListener('change', filterAndSortBooks);
    elements.tagDropdown.addEventListener('change', filterAndSortBooks);
    elements.searchInput.addEventListener('input', filterAndSortBooks);

    loadBooks();
});
