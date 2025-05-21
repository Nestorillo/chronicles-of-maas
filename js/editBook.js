document.addEventListener("DOMContentLoaded", async function () {
    let formBook = {
        title: "",
        body: "",
        tags: [],
        media: {}
    };

    let providedBook;

    const id = getQueryId();

    const book = await loadBook();
    loadBookDOM(book);

    async function loadBook() {
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/Nestor/${id}`);
        const data = await response.json();
        providedBook = data.data;
        return parseBookBody(providedBook.body);
    }

    function loadBookDOM(book) {
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("series").value = book.series;
        document.getElementById("order").value = book.order;
        document.getElementById("publication_date").value = new Date(book.publication_date).toISOString().split('T')[0];
        document.getElementById("themes").value = book.themes;
        document.getElementById("synopsis").value = book.synopsis;

        document.getElementById("image_url").value = providedBook.media?.url || "";
        document.getElementById("image_alt").value = providedBook.media?.alt || "";
        document.getElementById("image_preview").src = providedBook.media?.url || "";
    }

    const form = document.getElementById("edit-form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        formBook.tags = [];
        let data = [];

        formData.forEach((value, key) => {
            data.push(`${key}:${value}`);
            if (key === "title") formBook.title = value;
            if (key === "image_url") formBook.media.url = value;
            if (key === "image_alt") formBook.media.alt = value;
            if (key === "tags") formBook.tags.push(value);
        });

        const dataString = data.join("|");
        formBook.body = dataString;

        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/Nestor/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVzdG9yIiwiZW1haWwiOiJuZXNwb2wwNDExMkBzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTc0NjYzNzQwMH0.MbQJm7ZeY4bFifvYczYF4dycuBKHUVghcRwDWPNYvos"
            },
            body: JSON.stringify(formBook)
        });
        
        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (response.ok) {
            // Mostrar un alert de confirmación
            alert("¡Actualización exitosa!");

            // Redirigir al hacer clic en el OK del alert
            window.location.href = './index.html'; // Redirigir a index.html
        }
    });
});
