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

Product photos uploaded through the CMS are stored in `assets/images/products/`. All the product photos there are the shop's own pictures, cropped square. If adding a photo directly in GitHub, also add a product entry in `content/gallery.json` and use an image path such as `assets/images/products/new-product.jpg`. The optional `price` value is displayed as entered, so include both the Naira amount and pack size; leave it blank to display “Price on request.” Customers confirm current prices, availability, and delivery with the business by phone or WhatsApp. The static site does not take online payments or process checkout. The catalogue shows up to six products per page; once there are more than six, the category tabs and Previous/Next buttons appear automatically.

The CMS GitHub repository, branch, and image URL base are set in `admin/config.yml`. They are configured for the `chiomafloxxy/chiomafloxxy.github.io` root site (public image URL base `/assets/images/products`).

## Hero photos and founder portrait

The collage at the top of the page uses the four product photos in `assets/images/products/` and is written directly in `index.html` (the `hero-tile` blocks, including the small green "Kurudu, Abuja" tile). If a product photo or name changes, update that block too. The round portrait in the About section is `assets/images/florence-chioma.jpg`; swapping the file with a new photo of the same name is enough, and the circle crops it from the top, so keep her face in the upper half of the picture.

## Products with more than one pack or price

Some products come in different packs with different prices (for example groundnuts, bottled at ₦4,000 and in small wrapped packs at ₦100 each; cashew nuts, bottled at ₦6,500 / 400g and in small wrapped packs at ₦500 each). In the CMS, open the product, leave **Price and Pack Size** blank, and add **Options**: a name, a price and an optional photo for each. The card then lists each option with its own price and quantity buttons, and the order list treats each option as its own line. The `options` list in `content/gallery.json` is where this is stored.

## Areas we serve

The list of areas in the Contact section (Kurudu, Karu, Nyanya, Garki, Wuse, Maitama, Gwarinpa, Lugbe, Mararaba, Nasarawa, Onitsha, Enugu, Lagos and Port Harcourt) is written in `index.html` inside `site-area-list`, and the same places are in the `areaServed` list in the head of `index.html` for Google. Change both when the areas change.

## Speed and many visitors

The site is plain files on GitHub Pages, so there is no server of ours to overload: GitHub's network serves every visitor, and thousands at once is fine. What costs bandwidth is the size of the page, so it is kept small: the whole page is about 700 KB including every product photo, and the part seen first is about 400 KB.

- Photos are 720 px or smaller and roughly 35 to 110 KB each. When adding a photo, crop it square, keep it near 720 px wide and save it as a JPEG at about 80% quality.
- The icon fonts in `assets/fontawesome/webfonts/fa-solid-900.woff2` and `fa-brands-400.woff2` contain only the 26 icons the site uses (4 KB instead of 225 KB). If a new icon is ever added to the page, download Font Awesome Free 7 from fontawesome.com and put its full `fa-solid-900.woff2` and `fa-brands-400.woff2` back in that folder, or re-run a font subset that includes the new icon, otherwise the new icon will show as an empty box.
- GitHub Pages has soft limits (about 100 GB of downloads a month, 1 GB of files). At this page size that is well over 100,000 visits a month. If the shop ever grows past that, or wants its own web address, the same files can move to Cloudflare Pages or Netlify unchanged.

## Being found on Google

What is already in place: a clear title, description and headings that use the real product and place names; `LocalBusiness` and product details (names, prices in naira) for Google, which refresh from `content/gallery.json`; a sitemap listing the page and the product photos; descriptive picture text; an icon file for the browser tab and for Google's results; and a page that works fast on phones. Nothing can guarantee a ranking or an exact date, but these are the things that decide it, and the steps below are what make Google find the site sooner. They need the owner's Google account, so they have to be done by a person.

1. **Google Search Console** (search.google.com/search-console). Add a "URL prefix" property for `https://chiomafloxxy.github.io/`. Choose the **HTML tag** way to verify and copy the `<meta name="google-site-verification" ...>` line it shows. Paste it in the `<head>` of `index.html` just under the `robots` line, publish, then press Verify.
2. In Search Console, open **Sitemaps**, enter `sitemap.xml` and submit.
3. Open **URL inspection**, paste `https://chiomafloxxy.github.io/`, wait for the check and press **Request indexing**. This is the fastest way to get a new page looked at, often within a day or two.
4. **Google Business Profile** (business.google.com): create a free profile for C.Zara Enterprise with the Kurudu location, phone, hours, products and the website address. This is what makes the shop appear on Google Maps and in "honey near me" searches, and it usually matters more for a local shop than anything on the website itself.
5. Put the website address in every place the shop already has: the WhatsApp Business profile, Facebook and Instagram bios, and any listings. Links from other sites are how Google finds new sites quickly.
6. After changing prices or products, update the date in `sitemap.xml` (`lastmod`) and, if it matters, request indexing again.

## Delivery location

In the "Your order" box the customer can tap **Share my location**. The browser asks for permission first. If they allow it, the box shows a live Google map with a pin, the place name, the coordinates and how accurate the position is, plus an **Open in Google Maps** link. The place name, a Google Maps link and the accuracy are added to the WhatsApp message, so Florence can tap the link and navigate straight to the customer.

- The first time, it only starts when the customer taps the button, and the browser asks for permission. After a successful share the site remembers that choice on that device (a small `on`/`off` flag in the browser's storage, never the position itself). On later visits, if the browser still allows location, sharing starts by itself as soon as the customer adds something to their order, with a note and a **Stop sharing** button. Tapping **Stop sharing** switches the memory off until they choose to share again. The site never triggers a second permission question: if the browser has forgotten the permission, the customer just sees the normal button. Browsers decide how long they remember an "Allow" (some phones ask again for each session), and the site cannot change that.
- The map is the Google Maps embed (`maps.google.com/maps?...&output=embed`, no key needed) and the place name comes from OpenStreetMap's free Nominatim lookup, with BigDataCloud's free lookup as a backup. If both are unavailable the order still works and the message uses the map link. Both are free services meant for light use, which suits a small shop. If the shop ever gets very busy, replace them with a Google Maps API key.
- Location sharing needs the site to be on `https`, which GitHub Pages is. It works on phones and laptops with location switched on.
- A website cannot follow someone around in the background, and this one does not try to. For real-time tracking while a delivery is on the way, ask the customer to use WhatsApp's **Share live location** in the chat.

## Order list

Each product card has a quantity control (a product that comes in different packs, such as bottled or wrapped groundnuts, has one for each option). Customers pick what they want, add an optional name and delivery area, and tap **Send order on WhatsApp**. WhatsApp opens with the list already written (items, quantities, estimated total) addressed to the business number. The total is worked out from the Naira amount at the start of each price, such as `₦5,160 / 400g` or `₦100 each`. Products with no price show "Price on request" and are left out of the total. Customers are told that the final price is confirmed on WhatsApp. The list exists only on the page while it is open; nothing is saved anywhere. It works from the product text on the page, so new products added through the CMS get it automatically.

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
