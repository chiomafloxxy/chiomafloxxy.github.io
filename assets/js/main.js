'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const scrollButton = document.querySelector('.float-scroll-top');
  const menuButton = document.getElementById('menuToggleBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const closeButton = document.getElementById('mobileCloseBtn');
  const cmsPage = document.body.dataset.cmsPage;
  const galleryPageSize = 6;
  let galleryProducts = [];
  let galleryLoaded = false;
  let galleryFilter = 'all';
  let galleryPage = 1;

  const loadCMSContent = async () => {
    try {
      const response = await fetch(`content/${cmsPage}.json`);
      if (!response.ok) throw new Error(`Content request failed with status ${response.status}`);
      const content = await response.json();
      const contentNodes = document.querySelectorAll('[data-cms]');
      const missingFields = Array.from(contentNodes)
        .map(node => node.dataset.cms)
        .filter(field => typeof content[field] !== 'string');

      if (missingFields.length) {
        throw new Error(`Missing text fields: ${missingFields.join(', ')}`);
      }

      if (cmsPage === 'gallery') {
        if (!Array.isArray(content.products) || content.products.some(product =>
          !product || !['honey', 'nuts', 'oil', 'gifts', 'staples'].includes(product.category) ||
          typeof product.title !== 'string' || typeof product.description !== 'string' ||
          typeof product.image !== 'string' ||
          (product.price !== undefined && typeof product.price !== 'string')
        )) {
          throw new Error('Gallery products contain invalid or missing fields.');
        }
      }

      contentNodes.forEach(node => {
        node.textContent = content[node.dataset.cms];
      });

      if (cmsPage === 'gallery') {
        renderGallery(content.products);
      }
    } catch (error) {
      console.error(`Unable to load CMS content for "${cmsPage}".`, error);
    }
  };

  const renderGallery = products => {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryProducts = products;
    galleryLoaded = true;
    document.querySelectorAll('[data-gallery-filter]').forEach(button => {
      button.hidden = button.dataset.galleryFilter !== 'all' &&
        !products.some(product => product.category === button.dataset.galleryFilter);
    });

    const categoryLabels = {
      honey: 'Honey',
      nuts: 'Nuts',
      oil: 'Oils',
      gifts: 'Gifts',
      staples: 'Foodstuffs'
    };
    const fragment = document.createDocumentFragment();

    products.forEach((product, index) => {
      const item = document.createElement('article');
      item.className = 'gallery-item';
      item.dataset.galleryItem = product.category;
      item.dataset.galleryIndex = String(index);

      const art = document.createElement('div');
      art.className = 'site-gallery-art';
      if (product.image) {
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = `${product.title} product photo`;
        image.loading = 'lazy';
        image.decoding = 'async';
        art.append(image);
      } else {
        art.classList.add('site-gallery-art-empty');
        art.textContent = 'Product photo coming soon';
      }

      const body = document.createElement('div');
      body.className = 'gi-body';
      const tag = document.createElement('div');
      tag.className = 'gi-tag';
      tag.textContent = categoryLabels[product.category];
      const title = document.createElement('h2');
      title.className = 'gi-title';
      title.textContent = product.title;
      const description = document.createElement('p');
      description.className = 'gi-sub';
      description.textContent = product.description;
      const price = document.createElement('div');
      price.className = 'gi-price';
      const priceValue = document.createElement('strong');
      priceValue.textContent = product.price || 'Price on request';
      const priceNote = document.createElement('span');
      priceNote.textContent = product.price ? 'Confirm current price and availability' : 'Ask about sizes & availability';
      price.append(priceValue, priceNote);

      body.append(tag, title, price, description);

      const actions = document.createElement('div');
      actions.className = 'gi-actions';
      const enquiry = document.createElement('a');
      enquiry.className = 'gi-inquiry';
      enquiry.href = `https://wa.me/2348060561101?text=${encodeURIComponent(`Hello C.Zara, I'd like to order ${product.title}. Please share today's price, sizes, and availability.`)}`;
      enquiry.target = '_blank';
      enquiry.rel = 'noopener noreferrer';
      enquiry.setAttribute('aria-label', `WhatsApp to order ${product.title}`);
      const whatsappIcon = document.createElement('i');
      whatsappIcon.className = 'fa-brands fa-whatsapp';
      whatsappIcon.setAttribute('aria-hidden', 'true');
      enquiry.append(whatsappIcon, document.createTextNode(' WhatsApp'));

      const call = document.createElement('a');
      call.className = 'gi-call';
      call.href = 'tel:+2348060561101';
      call.setAttribute('aria-label', `Call to order ${product.title}`);
      const phoneIcon = document.createElement('i');
      phoneIcon.className = 'fa-solid fa-phone';
      phoneIcon.setAttribute('aria-hidden', 'true');
      call.append(phoneIcon, document.createTextNode(' Call'));
      actions.append(enquiry, call);
      body.append(actions);

      item.append(art, body);
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

    const previousButton = document.createElement('button');
    previousButton.type = 'button';
    previousButton.textContent = 'Previous';
    previousButton.disabled = galleryPage === 1;
    previousButton.addEventListener('click', () => {
      galleryPage -= 1;
      updateGalleryView();
    });

    const pageLabel = document.createElement('span');
    pageLabel.className = 'site-gallery-page-label';
    pageLabel.textContent = `Page ${galleryPage} of ${pageCount}`;
    pageLabel.setAttribute('aria-live', 'polite');

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = 'Next';
    nextButton.disabled = galleryPage === pageCount;
    nextButton.addEventListener('click', () => {
      galleryPage += 1;
      updateGalleryView();
    });

    pagination.append(previousButton, pageLabel, nextButton);
  };

  if (cmsPage) loadCMSContent();

  const updateScrollState = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
    scrollButton?.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  scrollButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const closeMenu = () => {
    const wasOpen = menu?.classList.contains('open');
    menu?.classList.remove('open');
    overlay?.classList.remove('open');
    menuButton?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    menu?.setAttribute('aria-hidden', 'true');
    menu?.setAttribute('inert', '');
    document.body.style.overflow = '';
    if (wasOpen) menuButton?.focus();
  };
  const openMenu = () => {
    menu?.removeAttribute('inert');
    menu?.classList.add('open');
    overlay?.classList.add('open');
    menuButton?.classList.add('open');
    menuButton?.setAttribute('aria-expanded', 'true');
    menuButton?.setAttribute('aria-label', 'Close menu');
    menu?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  };

  menuButton?.addEventListener('click', () => {
    if (menu?.classList.contains('open')) closeMenu();
    else openMenu();
  });
  closeButton?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  const revealElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('visible'));
  }

  document.querySelectorAll('[data-gallery-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.galleryFilter;
      document.querySelectorAll('[data-gallery-filter]').forEach(filterButton => {
        const selected = filterButton === button;
        filterButton.classList.toggle('active', selected);
        filterButton.setAttribute('aria-pressed', String(selected));
      });
      if (galleryLoaded) {
        galleryFilter = filter;
        galleryPage = 1;
        updateGalleryView();
      } else {
        document.querySelectorAll('[data-gallery-item]').forEach(item => {
          item.hidden = filter !== 'all' && item.dataset.galleryItem !== filter;
        });
      }
    });
  });

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
});
