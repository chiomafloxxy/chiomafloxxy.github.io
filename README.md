# C.Zara Enterprise

The official, static business website for C.Zara Enterprise. It is built with HTML, CSS, and vanilla JavaScript, and is suitable for GitHub Pages. The owner publishes it; it has not been deployed or hosted for you.

## Structure

The site is a single scrolling page (`index.html`) with four sections: Home, Products, About and Contact. Scrolling moves through them, the menu highlights the section you are in, and the address bar follows with short links: `/products`, `/about` and `/contact`. The small `products/`, `about/`, `contact/` and `gallery/` folders only redirect those short links (and old `gallery` links) to the matching section. `404.html` also sends old `about.html`, `gallery.html` and `contact.html` links to the right section. The founder's portrait is `assets/images/florence-chioma.jpg`.

- `assets/css/style.css` — colours, fonts, buttons, header, footer and the 404 page
- `assets/css/site.css` — the Home, Products, About and Contact sections
- `assets/js/main.js` — loads the text and product list from `content/`, menu highlighting, short links, and (for long product lists) category filters and paging

The site uses system fonts, so no web fonts are downloaded.

## Preview locally

With XAMPP, start Apache and open the folder you placed it in, for example `http://localhost/czara/`. The pages use relative links and load their editable text and product list from the JSON files in `content/`. (`404.html` uses addresses starting with `/`, so it is meant for the published `chiomafloxxy.github.io` site and will not display correctly from a subfolder.)

The only icon used is the WhatsApp logo, from the minified Font Awesome stylesheet in `assets/fontawesome/`. The unused icon package files have been removed to keep uploads small.

## Publish on GitHub Pages

This project is maintained in [`chiomafloxxy/chiomafloxxy.github.io`](https://github.com/chiomafloxxy/chiomafloxxy.github.io). To publish it:

1. In `chiomafloxxy/chiomafloxxy.github.io`, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose the `main` branch and `/(root)`, then save.
4. Wait for the Pages deployment to complete. The site address will be `https://chiomafloxxy.github.io/`.

No custom domain or `CNAME` file is required.

## Add and update products

After enabling Pages, the product catalogue can be managed through Sveltia CMS at `/admin/`, or directly in GitHub:

1. Visit `https://chiomafloxxy.github.io/admin/`.
2. Sign in with a GitHub fine-grained personal access token that has **Contents: Read and write** permission for `chiomafloxxy/chiomafloxxy.github.io`. Enter it only in the CMS sign-in prompt; never put the token in the repository.
3. Open **Products → Products** to add, edit, or remove products. Set the category, name, description, photo, and optionally the price/pack size (for example, `₦27,600 / 500g`).
4. Save the changes. CMS commits them to the configured `main` branch, and GitHub Pages republishes the site.

Product photos uploaded through the CMS are stored in `assets/images/products/`. If adding a photo directly in GitHub, also add a product entry in `content/gallery.json` and use an image path such as `assets/images/products/new-product.jpg`. The optional `price` value is displayed as entered, so include both the Naira amount and pack size; leave it blank to display “Price on request.” Customers confirm current prices, availability, and delivery with the business by phone or WhatsApp. The static site does not take online payments or process checkout. The catalogue shows up to six products per page; once there are more than six, category filters and Previous/Next buttons appear automatically.

The CMS GitHub repository, branch, and image URL base are set in `admin/config.yml`. They are configured for the `chiomafloxxy/chiomafloxxy.github.io` root site (public image URL base `/assets/images/products`).

## Contact and static-site limits

The contact section links to the business phone, WhatsApp, and `florencechi30@gmail.com`. GitHub Pages is static: the site does not process orders, store enquiry submissions, or provide a database. Phone, email, and WhatsApp links open the visitor's corresponding app. The phone number and email are written directly in `index.html` (header, product buttons, contact list and footer), so change them there if they ever change.

## Content files

Each file's fields appear under the matching name in the CMS, and the same text is written into `index.html` so the page still reads correctly if a file cannot load. If you edit a JSON file by hand, keep the field names unchanged.

- `content/home.json` — Home headline and intro
- `content/gallery.json` — Products section title, intro and product list
- `content/about.json` — About section title and three paragraphs
- `content/contact.json` — Contact section title, intro, location, hours and areas served

All repository files are public when published. Review business details, product information, and photos before uploading.
