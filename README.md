# C.Zara Enterprise

The official, static business website for C.Zara Enterprise. It is built with HTML, CSS, and vanilla JavaScript, and is suitable for GitHub Pages. The owner publishes it; it has not been deployed or hosted for you.

## Preview locally

With XAMPP, start Apache and open `http://localhost/czara/`. The pages use relative links and load their editable text and product list from the JSON files in `content/`.

The site uses only the minified Font Awesome stylesheet and its required webfonts. The unused icon package files have been removed to keep uploads small; the remaining icon assets are in `assets/fontawesome/`.

## Publish on GitHub Pages

This project is maintained in [`chiomafloxxy/czara`](https://github.com/chiomafloxxy/czara). To publish it:

1. In `chiomafloxxy/czara`, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose the `main` branch and `/(root)`, then save.
4. Wait for the Pages deployment to complete. The project site address will be `https://chiomafloxxy.github.io/czara/`.

GitHub Pages is not currently enabled for this repository. No hosting or deployment has been performed from this workspace. No custom domain or `CNAME` file is required.

## Add and update products

After enabling Pages, the product catalogue can be managed through Sveltia CMS at `/admin/`, or directly in GitHub:

1. Visit `https://chiomafloxxy.github.io/czara/admin/`.
2. Sign in with a GitHub fine-grained personal access token that has **Contents: Read and write** permission for `chiomafloxxy/czara`. Enter it only in the CMS sign-in prompt; never put the token in the repository.
3. Open **Gallery Page → Products** to add, edit, or remove products. Set the category, name, description, photo, and optionally the price/pack size (for example, `₦27,600 / 500g`).
4. Save the changes. CMS commits them to the configured `main` branch, and GitHub Pages republishes the site.

Product photos uploaded through the CMS are stored in `assets/images/products/`. If adding a photo directly in GitHub, also add a product entry in `content/gallery.json` and use an image path such as `assets/images/products/new-product.jpg`. The optional `price` value is displayed as entered, so include both the Naira amount and pack size; leave it blank to display “Price on request.” Customers confirm current prices, availability, and delivery with the business by phone or WhatsApp. The static site does not take online payments or process checkout. The catalogue has category filters and displays up to six products per page.

The CMS GitHub repository, branch, and image URL base are set in `admin/config.yml`. They are configured for the `chiomafloxxy/czara` project site.

## Contact and static-site limits

The contact page links to the business phone, WhatsApp, and `florencechi30@gmail.com`. GitHub Pages is static: the site does not process orders, store enquiry submissions, or provide a database. Phone, email, and WhatsApp links open the visitor's corresponding app.

## Content files

- `content/home.json` — homepage text
- `content/about.json` — business story and values
- `content/contact.json` — contact-page text
- `content/gallery.json` — catalogue text and product list

All repository files are public when published. Review business details, product information, and photos before uploading.
