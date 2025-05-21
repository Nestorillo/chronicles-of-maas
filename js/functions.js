function parseBookBody(body) {
    const bookInfo = {};

    if (!body) return bookInfo;

    const fields = body.split('|');

    fields.forEach(field => {
        if (field.includes(':')) {
            const [key, value] = field.split(':');
            if (key && value) {
                bookInfo[key.trim()] = value.trim();
            }
        }
    });

    if (body.includes('synopsis:')) {
        const synopsisMatch = body.match(/synopsis:(.*?)(?=\||$)/s);
        if (synopsisMatch && synopsisMatch[1]) {
            bookInfo.synopsis = synopsisMatch[1].trim();
        }
    }

    return bookInfo;
}

async function hashFileName(file) {
    const [name, ext] = file.name.split(/\.(?=[^\.]+$)/); 

    const encoder = new TextEncoder();
    const data = encoder.encode(name + Date.now());

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return `${hashHex}.${ext}`;
}


function getQueryId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function separateThemes(themes) {
    return themes.split(',').map(theme => theme.trim());
}