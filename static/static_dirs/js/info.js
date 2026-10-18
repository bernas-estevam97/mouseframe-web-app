// Information page: measurement filter, figure lightbox and "on this page" highlighting.

// Filter chips show one family of measurement cards at a time
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => chip.addEventListener('click', () => {
  const filter = chip.dataset.filter;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
  document.querySelectorAll('.measure-card').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.kind !== filter;
  });
}));

// Clicking a figure opens it at full size in a native <dialog> (Esc closes it)
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
document.querySelectorAll('.fig-zoom').forEach(btn => btn.addEventListener('click', () => {
  const img = btn.querySelector('img');
  lightboxImg.src = btn.dataset.full;
  lightboxImg.alt = img.alt;
  lightboxCaption.innerHTML = btn.closest('figure').querySelector('figcaption').innerHTML;
  lightbox.showModal();
}));
// Click on the backdrop closes it too
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

// Highlight the section currently in view in the side navigation
const tocLinks = document.querySelectorAll('.toc nav a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    tocLinks.forEach(a => {
      if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-20% 0px -70% 0px' });
document.querySelectorAll('.info-section').forEach(s => observer.observe(s));
