'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const scrollButton = document.querySelector('.float-scroll-top');
  const menuButton = document.getElementById('menuToggleBtn');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const closeButton = document.getElementById('mobileCloseBtn');
  const sectionIds = ['home', 'about', 'products', 'contact'];
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const basePath = location.pathname.replace(/[^/]*$/, '');
  const galleryPageSize = 6;
  let galleryProducts = [];
  let galleryLoaded = false;
  let galleryFilter = 'all';
  let galleryPage = 1;

  const validateGallery = products => {
    if (!Array.isArray(products) || products.some(product =>
      !product || !['honey', 'nuts', 'oil', 'gifts', 'staples'].includes(product.category) ||
      typeof product.title !== 'string' || typeof product.description !== 'string' ||
      typeof product.image !== 'string' ||
      (product.price !== undefined && typeof product.price !== 'string') ||
      (product.options !== undefined && (!Array.isArray(product.options) || product.options.some(option =>
        !option || typeof option.label !== 'string' || typeof option.price !== 'string' ||
        (option.image !== undefined && typeof option.image !== 'string')
      )))
    )) {
      throw new Error('Gallery products contain invalid or missing fields.');
    }
  };

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
      console.error(`Unable to load CMS content for "${page}".`, error);
    }
  };

  const loadCMSContent = () => {
    document.querySelectorAll('[data-cms-page]').forEach(loadSection);
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
    // The category tabs only help once the list is longer than one page.
    const filterGroup = document.querySelector('.site-gallery-filters');
    if (filterGroup) filterGroup.hidden = products.length <= galleryPageSize;

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
      const title = document.createElement('h3');
      title.className = 'gi-title';
      title.textContent = product.title;
      const description = document.createElement('p');
      description.className = 'gi-sub';
      description.textContent = product.description;
      const options = Array.isArray(product.options) ? product.options : [];
      if (options.length) {
        const list = document.createElement('ul');
        list.className = 'gi-options';
        options.forEach(option => {
          const row = document.createElement('li');
          row.className = 'gi-option';
          if (option.image) {
            const thumb = document.createElement('img');
            thumb.className = 'gi-option-thumb';
            thumb.src = option.image;
            thumb.alt = '';
            thumb.loading = 'lazy';
            thumb.decoding = 'async';
            row.append(thumb);
          }
          const text = document.createElement('span');
          text.className = 'gi-option-text';
          const optionName = document.createElement('strong');
          optionName.textContent = option.label;
          const optionPrice = document.createElement('span');
          optionPrice.textContent = option.price;
          text.append(optionName, optionPrice);
          row.append(text);
          list.append(row);
        });
        body.append(tag, title, description, list);
      } else {
        const price = document.createElement('div');
        price.className = 'gi-price';
        const priceValue = document.createElement('strong');
        priceValue.textContent = product.price || 'Price on request';
        const priceNote = document.createElement('span');
        priceNote.textContent = product.price ? 'Confirm current price and availability' : 'Ask about sizes & availability';
        price.append(priceValue, priceNote);
        body.append(tag, title, price, description);
      }

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
    enhanceOrderCards();
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

  loadCMSContent();

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
    // Keep the address bar in sync with short links such as /about, /products and /contact.
    if (!isFirst || (id !== 'home' && !location.hash)) {
      try { history.replaceState(null, '', id === 'home' ? basePath : `${basePath}${id}`); } catch (error) { /* ignore */ }
    }
  };

  const updateScrollState = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
    scrollButton?.classList.toggle('visible', window.scrollY > 500);
    updateSection();
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateSection);
  window.addEventListener('load', updateSection);
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

  // ---- Order list -------------------------------------------------------------------
  // Visitors pick quantities on the product cards and send the finished list to WhatsApp.
  // The list only lives on the page: it is turned into the WhatsApp message and nothing else.
  // A product with options (for example bottled or wrapped) gets one quantity control per option.
  const orderPanel = document.getElementById('orderPanel');
  const orderLines = document.getElementById('orderLines');
  const orderTotal = document.getElementById('orderTotal');
  const orderSend = document.getElementById('orderSend');
  const orderClear = document.getElementById('orderClear');
  const orderName = document.getElementById('orderName');
  const orderArea = document.getElementById('orderArea');
  const orderBar = document.getElementById('orderBar');
  const orderBarText = document.getElementById('orderBarText');
  const orderBarButton = document.getElementById('orderBarButton');
  const order = new Map(); // order key -> { name, price, naira, qty }
  let productsInView = false;
  let orderPanelInView = false;
  let deliveryFix = null; // { lat, lng, accuracy } once the visitor has chosen to share their location
  let deliveryPlace = ''; // place name found for that position
  let locWatchId = null;

  const naira = value => `₦${value.toLocaleString('en-US')}`;
  const parseNaira = text => {
    const match = /₦\s*([\d,]+(?:\.\d+)?)/.exec(text || '');
    return match ? Number(match[1].replace(/,/g, '')) : null;
  };
  const orderItems = () => Array.from(order.entries()).filter(([, item]) => item.qty > 0);
  const orderTotals = items => {
    let count = 0;
    let sum = 0;
    let unpriced = 0;
    items.forEach(([, item]) => {
      count += item.qty;
      if (item.naira === null) unpriced += 1;
      else sum += item.naira * item.qty;
    });
    return { count, sum, unpriced };
  };
  const totalText = ({ sum, unpriced }) => {
    if (sum === 0) return 'We will confirm the prices when we reply.';
    return unpriced ? `Estimated total: ${naira(sum)}, plus items we price on request` : `Estimated total: ${naira(sum)}`;
  };

  const orderMessage = items => {
    const lines = ["Hello C.Zara, I'd like to order:"];
    items.forEach(([, item]) => {
      lines.push(`- ${item.qty} × ${item.name}${item.price ? ` (${item.price})` : ''}`);
    });
    lines.push('', totalText(orderTotals(items)));
    const name = orderName ? orderName.value.trim() : '';
    const area = orderArea ? orderArea.value.trim() : '';
    if (name) lines.push(`My name: ${name}`);
    if (area) lines.push(`Delivery area: ${area}`);
    lines.push(...locationLines());
    lines.push('', 'Please confirm availability, the final price and delivery. Thank you.');
    return lines.join('\n');
  };

  const updateOrderLink = () => {
    if (!orderSend) return;
    orderSend.href = `https://wa.me/2348060561101?text=${encodeURIComponent(orderMessage(orderItems()))}`;
  };

  const updateOrderBar = () => {
    if (!orderBar) return;
    orderBar.hidden = !(orderItems().length && productsInView && !orderPanelInView);
  };

  const updateOrder = () => {
    if (!orderPanel) return;
    const items = orderItems();
    const totals = orderTotals(items);
    orderPanel.hidden = items.length === 0;
    if (!items.length && (deliveryFix || locWatchId !== null)) stopLocation();

    document.querySelectorAll('.qty-stepper').forEach(stepper => {
      const key = stepper.dataset.orderKey;
      const quantity = order.has(key) ? order.get(key).qty : 0;
      const value = stepper.querySelector('.qty-value');
      const minus = stepper.querySelector('[data-qty="-1"]');
      if (value) value.textContent = String(quantity);
      if (minus) minus.disabled = quantity === 0;
    });
    document.querySelectorAll('.gallery-item').forEach(card => {
      const active = Array.from(card.querySelectorAll('.qty-stepper')).some(stepper => order.has(stepper.dataset.orderKey));
      card.classList.toggle('in-order', active);
    });

    const rows = items.map(([key, item]) => {
      const row = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'order-line-name';
      name.textContent = `${item.qty} × ${item.name}`;
      const price = document.createElement('span');
      price.className = 'order-line-price';
      price.textContent = item.naira === null ? 'Price on request' : naira(item.naira * item.qty);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'order-remove';
      remove.dataset.orderRemove = key;
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${item.name} from your order`);
      row.append(name, price, remove);
      return row;
    });
    if (orderLines) orderLines.replaceChildren(...rows);
    if (orderTotal) orderTotal.textContent = totalText(totals);
    if (orderBarText) {
      orderBarText.textContent = `${totals.count} ${totals.count === 1 ? 'item' : 'items'}${totals.sum ? ` · ${naira(totals.sum)}` : ''}`;
    }
    updateOrderLink();
    updateOrderBar();
  };

  const changeQuantity = (stepper, change) => {
    const key = stepper.dataset.orderKey;
    const price = stepper.dataset.orderPrice || '';
    const current = order.get(key) || { name: stepper.dataset.orderName, price, naira: parseNaira(price), qty: 0 };
    current.price = price;
    current.naira = parseNaira(price);
    current.qty = Math.min(99, Math.max(0, current.qty + change));
    if (current.qty === 0) order.delete(key);
    else order.set(key, current);
    updateOrder();
  };

  const makeStepper = (name, price) => {
    const stepper = document.createElement('div');
    stepper.className = 'qty-stepper';
    stepper.dataset.orderKey = name;
    stepper.dataset.orderName = name;
    stepper.dataset.orderPrice = price;
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'qty-btn';
    minus.dataset.qty = '-1';
    minus.disabled = true;
    minus.textContent = '−';
    minus.setAttribute('aria-label', `Remove one ${name}`);
    const value = document.createElement('output');
    value.className = 'qty-value';
    value.textContent = '0';
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'qty-btn';
    plus.dataset.qty = '1';
    plus.textContent = '+';
    plus.setAttribute('aria-label', `Add one ${name}`);
    stepper.append(minus, value, plus);
    return stepper;
  };

  // Adds the quantity controls to every product card (the built-in ones and the ones the
  // content file renders), reading names and prices straight from the card.
  function enhanceOrderCards() {
    if (!orderPanel) return;
    document.querySelectorAll('.gallery-item').forEach(card => {
      const heading = card.querySelector('.gi-title');
      const actions = card.querySelector('.gi-actions');
      if (!heading || !actions) return;
      const title = heading.textContent.trim();
      const optionRows = card.querySelectorAll('.gi-option');
      if (optionRows.length) {
        optionRows.forEach(row => {
          if (row.querySelector('.qty-stepper')) return;
          const label = (row.querySelector('.gi-option-text strong') || {}).textContent || '';
          const price = (row.querySelector('.gi-option-text span') || {}).textContent || '';
          row.append(makeStepper(`${title} – ${label.trim()}`, price.trim()));
        });
        return;
      }
      if (card.querySelector('.gi-qty')) return;
      const price = (card.querySelector('.gi-price strong') || {}).textContent || '';
      const control = document.createElement('div');
      control.className = 'gi-qty';
      control.setAttribute('role', 'group');
      control.setAttribute('aria-label', `Quantity of ${title}`);
      const label = document.createElement('span');
      label.className = 'qty-label';
      label.textContent = 'Add to order';
      control.append(label, makeStepper(title, price.trim()));
      actions.before(control);
    });
    const keys = new Set(Array.from(document.querySelectorAll('.qty-stepper')).map(stepper => stepper.dataset.orderKey));
    Array.from(order.keys()).forEach(key => {
      if (!keys.has(key)) order.delete(key);
    });
    updateOrder();
  }

  const galleryGridForOrder = document.getElementById('galleryGrid');
  if (galleryGridForOrder) {
    galleryGridForOrder.addEventListener('click', event => {
      const button = event.target.closest('.qty-btn');
      const stepper = button && button.closest('.qty-stepper');
      if (!stepper) return;
      changeQuantity(stepper, Number(button.dataset.qty));
    });
  }
  if (orderLines) {
    orderLines.addEventListener('click', event => {
      const button = event.target.closest('[data-order-remove]');
      if (!button) return;
      order.delete(button.dataset.orderRemove);
      updateOrder();
    });
  }
  if (orderClear) {
    orderClear.addEventListener('click', () => {
      order.clear();
      updateOrder();
    });
  }
  [orderName, orderArea].forEach(field => field && field.addEventListener('input', updateOrderLink));
  if (orderBarButton && orderPanel) {
    orderBarButton.addEventListener('click', () => {
      orderPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  if ('IntersectionObserver' in window && orderPanel) {
    const productsSection = document.getElementById('products');
    new IntersectionObserver(entries => {
      productsInView = entries[0].isIntersecting;
      updateOrderBar();
    }).observe(productsSection);
    new IntersectionObserver(entries => {
      orderPanelInView = entries[0].isIntersecting;
      updateOrderBar();
    }).observe(orderPanel);
  } else {
    productsInView = true;
  }

  // ---- Delivery location (opt-in) -----------------------------------------------------
  // The visitor taps "Share my location" and the browser asks permission first. While they are
  // looking at the order the position is followed on a Google map; the place name and a map link
  // are added to the WhatsApp message they send. Nothing is stored and nothing is sent anywhere
  // else, and sharing stops when they press Stop, clear the order or leave the page.
  const locBox = document.getElementById('orderLocation');
  const locSupported = Boolean(locBox) && 'geolocation' in navigator;
  const locParts = locBox ? Array.from(locBox.querySelectorAll('[data-loc]')) : [];
  const locEl = id => document.getElementById(id);
  const locMap = locEl('locMap');
  const locPlace = locEl('locPlace');
  const locCoords = locEl('locCoords');
  const locAccuracy = locEl('locAccuracy');
  const locOpen = locEl('locOpen');
  const locBadge = locEl('locBadge');
  const locBadgeText = locEl('locBadgeText');
  const locError = locEl('locError');
  const locShareText = locEl('locShareText');
  let locPaused = false;
  let locFrozen = false;
  let locMapAt = null;
  let locGeoAt = null;
  let locGeoToken = 0;

  const mapsLink = fix => `https://www.google.com/maps?q=${fix.lat.toFixed(6)},${fix.lng.toFixed(6)}`;
  const metresBetween = (a, b) => {
    const rad = degrees => degrees * Math.PI / 180;
    const x = rad(b.lng - a.lng) * Math.cos(rad((a.lat + b.lat) / 2));
    const y = rad(b.lat - a.lat);
    return Math.sqrt(x * x + y * y) * 6371000;
  };
  const setLocState = state => {
    if (!locBox) return;
    locBox.dataset.state = state;
    locParts.forEach(part => {
      part.hidden = part.dataset.loc !== (state === 'error' ? 'idle' : state);
    });
  };

  function locationLines() {
    if (!deliveryFix) return [];
    const lines = [
      `Delivery location: ${deliveryPlace || 'my current location'}`,
      `Map: ${mapsLink(deliveryFix)}`
    ];
    if (deliveryFix.accuracy) lines.push(`Location accuracy: about ${Math.round(deliveryFix.accuracy)} m`);
    return lines;
  }

  const placeFromAddress = data => {
    const address = (data && data.address) || {};
    const parts = [];
    [
      address.road || address.pedestrian || '',
      address.neighbourhood || address.suburb || address.quarter || address.village || address.hamlet || address.residential || '',
      address.town || address.city || address.city_district || address.municipality || address.county || '',
      address.state || ''
    ].forEach(part => {
      if (part && !parts.includes(part)) parts.push(part);
    });
    if (parts.length) return parts.slice(0, 3).join(', ');
    return String((data && data.display_name) || '').split(',').slice(0, 3).join(',').trim();
  };

  const lookupPlace = async fix => {
    const token = ++locGeoToken;
    locGeoAt = { lat: fix.lat, lng: fix.lng, time: Date.now() };
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = setTimeout(() => controller && controller.abort(), 8000);
    let place = '';
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=en&lat=${fix.lat}&lon=${fix.lng}`;
      const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
      if (!response.ok) throw new Error(`Place lookup failed with status ${response.status}`);
      place = placeFromAddress(await response.json());
    } catch (error) {
      place = '';
    } finally {
      clearTimeout(timer);
    }
    if (token !== locGeoToken || !deliveryFix) return;
    deliveryPlace = place;
    if (locPlace) locPlace.textContent = place || 'Pinned on the map';
    updateOrderLink();
  };

  const renderLocation = () => {
    if (!deliveryFix) return;
    const now = Date.now();
    if (locCoords) locCoords.textContent = `${deliveryFix.lat.toFixed(5)}, ${deliveryFix.lng.toFixed(5)}`;
    if (locAccuracy) locAccuracy.textContent = deliveryFix.accuracy ? `± ${Math.round(deliveryFix.accuracy)} m` : '';
    if (locOpen) locOpen.href = mapsLink(deliveryFix);
    if (locBadge) locBadge.classList.toggle('is-saved', locFrozen);
    if (locBadgeText) locBadgeText.textContent = locFrozen ? 'Saved' : 'Live';
    if (locMap && (!locMapAt || (metresBetween(locMapAt, deliveryFix) > 15 && now - locMapAt.time > 4000))) {
      locMap.src = `https://maps.google.com/maps?q=${deliveryFix.lat},${deliveryFix.lng}&z=17&output=embed&hl=en`;
      locMapAt = { lat: deliveryFix.lat, lng: deliveryFix.lng, time: now };
    }
    if (!locGeoAt || (metresBetween(locGeoAt, deliveryFix) > 60 && now - locGeoAt.time > 10000)) lookupPlace(deliveryFix);
  };

  const onLocation = position => {
    const first = !deliveryFix;
    deliveryFix = { lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy || 0 };
    if (first) {
      deliveryPlace = '';
      if (locPlace) locPlace.textContent = 'Finding the place name…';
      setLocState('live');
    }
    renderLocation();
    updateOrderLink();
  };

  const clearLocationWatch = () => {
    if (locWatchId !== null) {
      navigator.geolocation.clearWatch(locWatchId);
      locWatchId = null;
    }
  };
  const beginLocationWatch = () => {
    clearLocationWatch();
    locWatchId = navigator.geolocation.watchPosition(onLocation, onLocationError, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
  };

  function onLocationError(error) {
    // A short signal drop while we already have a position is not worth interrupting the visitor for.
    if (deliveryFix && error.code !== 1) return;
    clearLocationWatch();
    deliveryFix = null;
    deliveryPlace = '';
    locMapAt = null;
    locGeoAt = null;
    locGeoToken += 1;
    const messages = {
      1: 'Location is switched off for this site. You can allow it in your browser settings, or just type your delivery area above.',
      2: 'We couldn’t work out where you are. Please type your delivery area above.',
      3: 'That took too long. Check your signal and try again.'
    };
    if (locError) {
      locError.textContent = messages[error.code] || messages[2];
      locError.hidden = false;
    }
    if (locShareText) locShareText.textContent = 'Try again';
    setLocState('error');
    updateOrderLink();
  }

  function stopLocation() {
    clearLocationWatch();
    locPaused = false;
    locFrozen = false;
    deliveryFix = null;
    deliveryPlace = '';
    locMapAt = null;
    locGeoAt = null;
    locGeoToken += 1;
    if (locMap) locMap.removeAttribute('src');
    if (locError) locError.hidden = true;
    if (locShareText) locShareText.textContent = 'Share my location';
    setLocState('idle');
    updateOrderLink();
  }

  if (locBox) {
    if (!locSupported) {
      locBox.hidden = true;
    } else {
      locEl('locShare').addEventListener('click', () => {
        if (locError) locError.hidden = true;
        locFrozen = false;
        setLocState('locating');
        beginLocationWatch();
      });
      locEl('locStop').addEventListener('click', stopLocation);
      // Once the order is sent the position stops being followed; it stays in the message.
      if (orderSend) {
        orderSend.addEventListener('click', () => {
          if (!deliveryFix || locFrozen) return;
          locFrozen = true;
          clearLocationWatch();
          renderLocation();
        });
      }
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (locWatchId !== null) {
            clearLocationWatch();
            locPaused = true;
          }
        } else if (locPaused && !locFrozen) {
          locPaused = false;
          beginLocationWatch();
        }
      });
      window.addEventListener('pagehide', clearLocationWatch);
    }
  }

  enhanceOrderCards();

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
});
