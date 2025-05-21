document.addEventListener("DOMContentLoaded", function () {

    let books = [];
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
        bookGrid: document.getElementById('bookGrid')
    };



    function updateCarousel() {
        if (books.length === 0) return;

        const book = books[currentIndex];
        const bookInfo = parseBookBody(book.body);
        elements.carouselImage.src = book.media.url;
        elements.carouselImage.alt = book.title;

        let captionText = book.title;
        if (bookInfo.synopsis) {
            const shortText = bookInfo.synopsis.length > 300
                ? bookInfo.synopsis.substring(0, 300) + "..."
                : bookInfo.synopsis;
            captionText += ": " + shortText;
        } else if (bookInfo.author) {
            captionText += " by " + bookInfo.author;
        }

        elements.carouselCaption.textContent = captionText;

        elements.carouselImage.style.display = "block";
        elements.carouselCaption.style.display = "block";
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
                books = sorted.slice(0, 3);


                filteredBooks = [...allData];

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
        if (books.length === 0) return;
        currentIndex = (currentIndex - 1 + books.length) % books.length;
        updateCarousel();
    });

    elements.nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (books.length === 0) return;
        currentIndex = (currentIndex + 1) % books.length;
        updateCarousel();
    });

    elements.sortDropdown.addEventListener('change', filterAndSortBooks);
    elements.tagDropdown.addEventListener('change', filterAndSortBooks);
    elements.searchInput.addEventListener('input', filterAndSortBooks);

    loadBooks();



});
