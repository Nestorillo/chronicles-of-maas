# Chronicles of Maas – Final Project

This is the project for the Front-End Development course at Noroff.  
It is a fully responsive blog website inspired by the fantasy works of author **Sarah J. Maas**.

Users can browse books, view summaries, and interact with post pages dynamically. The project includes a responsive design, dynamic API data loading, accessibility compliance, and SEO best practices.

## Live Site

[https://chronicles-of-maas.netlify.app](https://chronicles-of-maas.netlify.app)

## Figma Prototype

[View Figma Design](https://www.figma.com/design/NmUwqWv1Opb3WFFbbNieFw/blog-sarah-j-maas?node-id=0-1&t=cHjgF7xsb01eOXJM-1)

The Figma file includes:
- Desktop and mobile versions of all pages
- Style guide: logo, fonts, color palette, components (buttons, inputs, cards)
- Page designs: Home, Book, Create Post, Edit Post, Login, Register

## Technologies Used

- HTML5
- CSS3
- JavaScript 
- API: Noroff Blog API
- Netlify (deployment)
- Git & GitHub (version control)

## Features

- Responsive design (desktop and mobile)
- Book listing with filtering and search
- Single book detail page
- Create, edit and delete post functionality
- Login and register flow
- Protected features (only visible when logged in)
- SEO meta tags, sitemap and robots.txt
- Accessibility-compliant structure using WAVE guidelines

## Accessibility Checklist (WCAG AA)

- [x] All inputs have `<label>` elements
- [x] Only one `<h1>` per page
- [x] Sufficient color contrast for text elements
- [x] All images include meaningful `alt` text
- [x] Landmarks used (`<main>`, `<header>`, `<footer>`)
- [x] Buttons have clear text or `aria-label`
- [x] Tested with [https://wave.webaim.org/](https://wave.webaim.org/)

## SEO Best Practices

- [x] `<title>` with more than 15 characters
- [x] `<meta name="description">` unique per page
- [x] `robots.txt` file included
- [x] `sitemap.xml` with valid structure
- [x] `<h1>` visible on all main pages
- [x] All images have `alt` attributes


## Manual Testing

The following was manually tested on both desktop and mobile:

- [x] Page loads and navigation work as expected
- [x] Filtering and search return accurate results
- [x] Book detail page loads correct data
- [x] Login hides/shows buttons properly (Create/Edit)
- [x] Create/Edit/Delete posts work correctly
- [x] Responsive layout tested on multiple screen sizes

## Folder Structure

/blog-nestor

index.html
book.html
createBook.html
editBook.html
login.html
register.html
sitemap.xml
robots.txt
styles/
js/
images/

## GitHub Project & Kanban Board

A GitHub Project board is available here:  
🔗 [https://github.com/YOUR-REPO-URL/projects](https://github.com/NoroffFEU/FED1-PE1-Nestorillo)

### Columns:
- `To Do`
- `In Progress`
- `Done`

### Sample Tasks:
- Build Figma prototype ✅  
- Implement book API fetch ✅  
- Add login/logout system ✅  
- Validate accessibility ✅  
- SEO optimization ✅  
- Manual user testing ✅

## Notes

- This project uses the Noroff Blog API (v2).
- Login and register endpoints are functional with Noroff credentials.
- Create/Edit/Delete options are only available when logged in.
- Post images are hosted externally and use descriptive alt attributes.

## Author

Created by Nestor Polo

