document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("create-form");

    let book = {
        title: "",
        body: "",
        tags: [],
        media: {}
    };

    form.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const formData = new FormData(form);
        let data = [];

        formData.forEach((value, key) => {
            data.push(`${key}:${value}`)
            if(key === "title"){book.title = value}
            if(key === "image_url"){book.media.url = value}
            if(key === "image_alt"){book.media.alt = value}
            if(key === "tags"){book.tags.push(value)}
        });

        const dataString = data.join("|");
        book.body = dataString;

        postRequest();
    });

    async function postRequest(){
        try {
            const response = await fetch("https://v2.api.noroff.dev/blog/posts/Nestor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmVzdG9yIiwiZW1haWwiOiJuZXNwb2wwNDExMkBzdHVkLm5vcm9mZi5ubyIsImlhdCI6MTc0NjYzNzQwMH0.MbQJm7ZeY4bFifvYczYF4dycuBKHUVghcRwDWPNYvos"
                },
                body: JSON.stringify(book)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Post successful:", result);

            alert("¡Libro creado exitosamente!");

            window.location.href = './index.html'; 

        } catch (error) {
            console.error("Error posting book:", error);
        }
    }
});
