'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const sectionIds = ['home', 'products', 'about', 'contact'];
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const basePath = location.pathname.replace(/[^/]*$/, '');
  const galleryPageSize = 6;
  let galleryProducts = [];
  let galleryFilter = 'all';
  let galleryPage = 1;

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const validateGallery = products => {
    if (!Array.isArray(products) || products.some(product =>
      !product || !['honey', 'nuts', 'oil', 'gifts', 'staples'].includes(product.category) ||
      typeof product.title !== 'string' || typeof product.description !== 'string' ||
      typeof product.image !== 'string' ||
      (product.price !== undefined && typeof product.price !== 'string')
    )) {
      throw new Error('Product list contains invalid or missing fields.');
    }
  };

  // Fills every [data-cms] element from content/<page>.json. The text already in the HTML
  // is the same text, so the page still reads correctly if a file cannot be loaded.
  const loadSection = async wrapper => {
    const page = wrapper.dataset.cmsPage;
    try {
      const response = await fetch(`content/${page}.json`);
      if (!response.ok) throw new Error(`Content request failed with status ${response.status}`);
      const content = await response.json();
      const contentNodes = wrapper.querySelectorAll('[data-cms]');
      const missingFields = Array.from(contentNodes)
        .map(node => node.dataset.cms)
        .filter(field => typeof content[field] !== 'string');
      if (missingFields.length) throw new Error(`Missing text fields: ${missingFields.join(', ')}`);
      if (page === 'gallery') validateGallery(content.products);

      contentNodes.forEach(node => {
        node.textContent = content[node.dataset.cms];
      });
      if (page === 'gallery') renderGallery(content.products);
    } catch (error) {
      console.error(`Unable to load content for "${page}".`, error);
    }
  };

  const renderGallery = products => {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryProducts = products;

    // Category filters are only useful once the list is longer than one page.
    const filters = document.getElementById('galleryFilters');
    if (filters) filters.hidden = products.length <= galleryPageSize;
    document.querySelectorAll('[data-gallery-filter]').forEach(button => {
      button.hidden = button.dataset.galleryFilter !== 'all' &&
        !products.some(product => product.category === button.dataset.galleryFilter);
    });

    const fragment = document.createDocumentFragment();
    products.forEach((product, index) => {
      const item = make('article', 'product');
      item.dataset.galleryItem = product.category;
      item.dataset.galleryIndex = String(index);

      if (product.image) {
        const image = make('img');
        image.src = product.image;
        image.alt = `${product.title}, product photo`;
        image.loading = 'lazy';
        image.decoding = 'async';
        item.append(image);
      } else {
        item.append(make('div', 'product-photo-empty', 'Photo coming soon'));
      }

      const body = make('div', 'product-body');
      body.append(
        make('h3', '', product.title),
        make('p', 'price', product.price || 'Price on request'),
        make('p', 'desc', product.description)
      );

      const actions = make('div', 'product-actions');
      const whatsapp = make('a', 'btn btn-small');
      whatsapp.href = `https://wa.me/2348060561101?text=${encodeURIComponent(`Hello C.Zara, I'd like to order ${product.title}. Please share today's price, sizes, and availability.`)}`;
      whatsapp.target = '_blank';
      whatsapp.rel = 'noopener noreferrer';
      whatsapp.setAttribute('aria-label', `WhatsApp to order ${product.title}`);
      const whatsappIcon = make('i', 'fa-brands fa-whatsapp');
      whatsappIcon.setAttribute('aria-hidden', 'true');
      whatsapp.append(whatsappIcon, document.createTextNode(' WhatsApp'));

      const call = make('a', 'btn btn-small btn-line', 'Call');
      call.href = 'tel:+2348060561101';
      call.setAttribute('aria-label', `Call to order ${product.title}`);

      actions.append(whatsapp, call);
      body.append(actions);
      item.append(body);
      fragment.append(item);
    });

    galleryGrid.replaceChildren(fragment);
    updateGalleryView();
  };

  const updateGalleryView = () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const pagination = document.getElementById('galleryPagination');
    if (!galleryGrid || !pagination) return;

    const matchingProducts = galleryProducts
      .map((product, index) => ({ product, index }))
      .filter(({ product }) => galleryFilter === 'all' || product.category === galleryFilter);
    const pageCount = Math.ceil(matchingProducts.length / galleryPageSize);
    galleryPage = Math.min(galleryPage, Math.max(pageCount, 1));
    const start = (galleryPage - 1) * galleryPageSize;
    const visibleIndexes = new Set(
      matchingProducts.slice(start, start + galleryPageSize).map(({ index }) => index)
    );

    galleryGrid.querySelectorAll('[data-gallery-index]').forEach(item => {
      item.hidden = !visibleIndexes.has(Number(item.dataset.galleryIndex));
    });

    pagination.replaceChildren();
    pagination.hidden = pageCount <= 1;
    if (pageCount <= 1) return;

    const previousButton = make('button', '', 'Previous');
    previousButton.type = 'button';
    previousButton.disabled = galleryPage === 1;
    previousButton.addEventListener('click', () => {
      galleryPage -= 1;
      updateGalleryView();
    });

    const pageLabel = make('span', '', `Page ${galleryPage} of ${pageCount}`);
    pageLabel.setAttribute('aria-live', 'polite');

    const nextButton = make('button', '', 'Next');
    nextButton.type = 'button';
    nextButton.disabled = galleryPage === pageCount;
    nextButton.addEventListener('click', () => {
      galleryPage += 1;
      updateGalleryView();
    });

    pagination.append(previousButton, pageLabel, nextButton);
  };

  document.querySelectorAll('[data-gallery-filter]').forEach(button => {
    button.addEventListener('click', () => {
      galleryFilter = button.dataset.galleryFilter;
      galleryPage = 1;
      document.querySelectorAll('[data-gallery-filter]').forEach(filterButton => {
        const selected = filterButton === button;
        filterButton.setAttribute('aria-pressed', String(selected));
      });
      updateGalleryView();
    });
  });

  document.querySelectorAll('[data-cms-page]').forEach(loadSection);

  // Highlight the current section in the menu and keep the address bar on short links
  // such as /products, /about and /contact.
  let currentSection = null;
  const setActiveSection = id => {
    document.querySelectorAll('[data-nav]').forEach(link => {
      const active = link.dataset.nav === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };
  const findCurrentSection = () => {
    const line = window.innerHeight * 0.35;
    let found = sectionEls[0];
    sectionEls.forEach(el => {
      if (el.getBoundingClientRect().top <= line) found = el;
    });
    // At the very bottom of the page the last section is always the active one.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      found = sectionEls[sectionEls.length - 1];
    }
    return found ? found.id : null;
  };
  const updateSection = () => {
    const id = findCurrentSection();
    if (!id || id === currentSection) return;
    const isFirst = currentSection === null;
    currentSection = id;
    setActiveSection(id);
    if (!isFirst || (id !== 'home' && !location.hash)) {
      try { history.replaceState(null, '', id === 'home' ? basePath : `${basePath}${id}`); } catch (error) { /* ignore */ }
    }
  };
  window.addEventListener('scroll', updateSection, { passive: true });
  window.addEventListener('resize', updateSection);
  window.addEventListener('load', updateSection);
  updateSection();

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
});
