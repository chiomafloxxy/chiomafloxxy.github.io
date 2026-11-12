# C.Zara Enterprise

The official, static business website for C.Zara Enterprise. It is built with HTML, CSS, and vanilla JavaScript, and is suitable for GitHub Pages. The owner publishes it; it has not been deployed or hosted for you.

## Structure

The site is a single scrolling page (`index.html`) with four sections: Home, About, Products and Contact. Scrolling moves through them, the menu highlights the section you are in, and the address bar follows with short links: `/about`, `/products` and `/contact`. The small `about/`, `products/`, `contact/` and `gallery/` folders only redirect those short links (and old `gallery` links) to the matching section. The founder's portrait is `assets/images/florence-chioma.jpg`.

## Preview locally

With XAMPP, start Apache and open the folder you placed it in, for example `http://localhost/czara/`. The pages use relative links and load their editable text and product list from the JSON files in `content/`.

The site uses only the minified Font Awesome stylesheet and its required webfonts. The unused icon package files have been removed to keep uploads small; the remaining icon assets are in `assets/fontawesome/`.

## Publish on GitHub Pages

This project is maintained in [`chiomafloxxy/chiomafloxxy.github.io`](https://github.com/chiomafloxxy/chiomafloxxy.github.io). To publish it:

1. In `chiomafloxxy/chiomafloxxy.github.io`, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose the `main` branch and `/(root)`, then save.
4. Wait for the Pages deployment to complete. The site address will be `https://chiomafloxxy.github.io/`.

GitHub Pages is not currently enabled for this repository. No hosting or deployment has been performed from this workspace. No custom domain or `CNAME` file is required.

## Add and update products

After enabling Pages, the product catalogue can be managed through Sveltia CMS at `/admin/`, or directly in GitHub:

1. Visit `https://chiomafloxxy.github.io/admin/`.
2. Sign in with a GitHub fine-grained personal access token that has **Contents: Read and write** permission for `chiomafloxxy/chiomafloxxy.github.io`. Enter it only in the CMS sign-in prompt; never put the token in the repository.
3. Open **Gallery Page → Products** to add, edit, or remove products. Set the category, name, description, photo, and optionally the price/pack size (for example, `₦27,600 / 500g`).
4. Save the changes. CMS commits them to the configured `main` branch, and GitHub Pages republishes the site.

Product photos uploaded through the CMS are stored in `assets/images/products/`. If adding a photo directly in GitHub, also add a product entry in `content/gallery.json` and use an image path such as `assets/images/products/new-product.jpg`. The optional `price` value is displayed as entered, so include both the Naira amount and pack size; leave it blank to display “Price on request.” Customers confirm current prices, availability, and delivery with the business by phone or WhatsApp. The static site does not take online payments or process checkout. The catalogue shows up to six products per page; once there are more than six, the category tabs and Previous/Next buttons appear automatically.

The CMS GitHub repository, branch, and image URL base are set in `admin/config.yml`. They are configured for the `chiomafloxxy/chiomafloxxy.github.io` root site (public image URL base `/assets/images/products`).

## Hero photos and founder portrait

The collage at the top of the page uses the four product photos in `assets/images/products/` and is written directly in `index.html` (the `hero-tile` blocks, including the small green "Kurudu, Abuja" tile). If a product photo or name changes, update that block too. The round portrait in the About section is `assets/images/florence-chioma.jpg`; swapping the file with a new photo of the same name is enough, and the circle crops it from the top, so keep her face in the upper half of the picture.

## Order list

Each product card has a quantity control. Customers pick what they want, add an optional name and delivery area, and tap **Send order on WhatsApp**. WhatsApp opens with the list already written (items, quantities, estimated total) addressed to the business number. The total is worked out from the Naira amount at the start of each product's price, such as `₦5,160 / 400g`. Products with no price show "Price on request" and are left out of the total. Customers are told that the final price is confirmed on WhatsApp. The list exists only on the page while it is open; nothing is saved anywhere. It works from the product text on the page, so new products added through the CMS get it automatically.

## Contact file and search engine files

- `assets/c-zara-enterprise.vcf` is the "Save our contact" card in the Contact section. If the phone number or email ever changes, update it here as well as in `index.html`.
- `sitemap.xml` and `robots.txt` help search engines find the site.
- The `LocalBusiness` block in the head of `index.html` tells Google the business name, location, phone, opening hours (Monday to Saturday, 8:00am to 7:00pm) and areas served. If the hours or areas change, update that block too.

## Contact and static-site limits

The contact page links to the business phone, WhatsApp, and `florencechi30@gmail.com`. GitHub Pages is static: the site does not process orders, store enquiry submissions, or provide a database. Phone, email, and WhatsApp links open the visitor's corresponding app.

## Content files

- `content/home.json` — Home section text
- `content/about.json` — About section: the founder's story
- `content/contact.json` — Contact section text
- `content/gallery.json` — Products section text and product list

All repository files are public when published. Review business details, product information, and photos before uploading.
