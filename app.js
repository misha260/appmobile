/* ============================================================================
   Gallera — app logic
   A small hash-routed single-screen app: a flick-through deck of paintings,
   a slide-up reading view, saved works, albums, and settings.
   No framework, no build step.
   ============================================================================ */

(function () {
  'use strict';

  var DATA = window.GALLERA_DATA || [];

  /* ---------------------------------------------------------------- icons -- */
  var I = {
    heart: '<path d="M12 20.5l-1.6-1.5C5.4 14.4 2.5 11.8 2.5 8.6 2.5 6.1 4.5 4.2 7 4.2c1.5 0 2.9.7 3.8 1.8l1.2 1.4 1.2-1.4C15.1 4.9 16.5 4.2 18 4.2c2.5 0 4.5 1.9 4.5 4.4 0 3.2-2.9 5.8-7.9 10.4z"/>',
    heartFill: '<path fill="currentColor" stroke="none" d="M12 20.8l-1.7-1.6C5.1 14.5 2 11.7 2 8.4 2 5.7 4.1 3.6 6.8 3.6c1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2C17.9 3.6 20 5.7 20 8.4c0 3.3-3.1 6.1-8.3 10.8z" transform="translate(0 .2)"/>',
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5h4.5V14h3v5.5H18V10"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M4 12.5l5 5 11-11"/>',
    shuffle: '<path d="M4 7h3.5l9 10H20"/><path d="M4 17h3.5l9-10H20"/><path d="M17 4l3 3-3 3"/><path d="M17 14l3 3-3 3"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    swipe: '<path d="M8 11V6.5a1.8 1.8 0 0 1 3.6 0V11"/><path d="M11.6 11V5.5a1.8 1.8 0 0 1 3.6 0V11"/><path d="M15.2 11V7.5a1.8 1.8 0 0 1 3.5 0V15c0 3.6-2.4 6-6 6-2 0-3.4-.7-4.7-2.2L4.5 14c-1-1.2.6-3 1.9-2l1.6 1.4V8a1.8 1.8 0 0 1 3.6 0"/>',
    expand: '<path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    aa: '<path d="M3 18L7 7l4 11M4.2 14.5h5.6"/><path d="M14 18l3.3-8 3.3 8M15.2 15.3h4.2"/>',
    frame: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 20l4-6 3 3 2-2.5L20 18"/><circle cx="9" cy="9" r="1.3"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + I[name] + '</svg>';
  }

  /* --------------------------------------------------------------- helpers -- */
  function h(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function qs(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  }); }
  function byId(id) { for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return DATA[i]; return null; }
  function haptic(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} }

  /* ----------------------------------------------------------------- store -- */
  var store = {
    favs: [], albums: [], prefs: { type: 'classic', theme: 'auto' },
    load: function () {
      try {
        var p = localStorage.getItem('gallera.prefs');
        if (p) {
          this.favs = JSON.parse(localStorage.getItem('gallera.favs') || '[]');
          this.albums = JSON.parse(localStorage.getItem('gallera.albums') || '[]');
          this.prefs = Object.assign(this.prefs, JSON.parse(p));
          return;
        }
      } catch (e) {}
      // first run — open in a realistic state (sample data, freely editable)
      this.favs = ['starry-night', 'the-kiss'];
      this.albums = [{ id: 'a' + Date.now(), name: 'To Revisit', items: ['great-wave', 'pearl-earring', 'the-scream'] }];
      this.save();
    },
    save: function () {
      try {
        localStorage.setItem('gallera.favs', JSON.stringify(this.favs));
        localStorage.setItem('gallera.albums', JSON.stringify(this.albums));
        localStorage.setItem('gallera.prefs', JSON.stringify(this.prefs));
      } catch (e) {}
    },
    isFav: function (id) { return this.favs.indexOf(id) > -1; },
    toggleFav: function (id) {
      var i = this.favs.indexOf(id);
      if (i > -1) this.favs.splice(i, 1); else this.favs.unshift(id);
      this.save();
      return i < 0;
    }
  };

  /* --------------------------------------------------------------- toast ---- */
  var toastEl, toastT;
  function toast(msg, ic) {
    if (!toastEl) toastEl = qs('#toast');
    toastEl.innerHTML = (ic ? icon(ic) : '') + '<span>' + esc(msg) + '</span>';
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 1700);
  }

  /* ----------------------------------------------------------------- art ---- */
  function artHTML(p, extra) {
    return '<div class="art" style="--c-tone:' + p.tone + ';--c-accent:' + p.accent + '">' +
      '<div class="art-field">' +
      '<div class="ph-title">' + esc(p.title) + '</div>' +
      '<div class="ph-artist">' + esc(p.artist) + '</div>' +
      '</div>' +
      '<img class="art-img" alt="' + esc(p.title) + '" data-src="' + p.img + '">' +
      (extra || '') + '</div>';
  }
  function hydrateArt(root) {
    var imgs = root.querySelectorAll('img.art-img[data-src]');
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        img.onload = function () { img.classList.add('loaded'); };
        img.onerror = function () { img.removeAttribute('src'); };
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      })(imgs[i]);
    }
  }

  /* =============================================================== ROUTER == */
  var screen, stage, detailEl = null;

  function go(hash) { if (location.hash !== hash) location.hash = hash; else route(); }

  function route() {
    var raw = location.hash.replace(/^#\/?/, '');
    var parts = raw.split('/');
    var seg = parts[0] || 'home';
    var arg = parts[1];

    if (seg === 'art') { ensureBase(); openDetail(arg); setTabs('home'); return; }
    closeDetail();

    if (seg === 'saved') { mountScreen(viewSaved()); setTabs('saved'); }
    else if (seg === 'albums') { mountScreen(viewAlbums()); setTabs('me'); }
    else if (seg === 'album') { mountScreen(viewAlbum(arg)); setTabs('me'); }
    else if (seg === 'me') { mountScreen(viewProfile()); setTabs('me'); }
    else { mountScreen(viewHome()); setTabs('home'); }
  }

  function ensureBase() { if (!screen.firstChild) { mountScreen(viewHome()); } }

  function mountScreen(node) {
    screen.innerHTML = '';
    node.classList.add('view-in');
    screen.appendChild(node);
    screen.scrollTop = 0;
    hydrateArt(node);
  }

  /* =============================================================== TABBAR == */
  function buildTabbar() {
    var bar = qs('#tabbar');
    bar.innerHTML =
      '<button class="tab" data-go="#/saved">' + icon('heart') + '<span>Favorite</span></button>' +
      '<button class="tab center" data-go="#/home">' + icon('home') + '<span>Home</span></button>' +
      '<button class="tab" data-go="#/me">' + icon('user') + '<span>Profile</span></button>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (b) { haptic(6); go(b.getAttribute('data-go')); }
    });
  }
  function setTabs(active) {
    var map = { home: 1, saved: 0, me: 2 };
    var tabs = qs('#tabbar').children;
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle('active', i === map[active]);
  }

  /* ================================================================ HOME === */
  var deckPos = 0;
  var deckOrder = DATA.map(function (_, i) { return i; });

  function viewHome() {
    var node = h(
      '<div class="home">' +
      '<div class="brandbar">' +
      '<div class="wordmark">Gallera<span class="dot">.</span></div>' +
      '<button class="iconbtn" data-act="shuffle" aria-label="Shuffle">' + icon('shuffle') + '</button>' +
      '</div>' +
      '<div class="deck-wrap"><div class="deck" id="deck"></div></div>' +
      '<div class="deck-meta" id="deckMeta"></div>' +
      '<div class="deck-cta">' +
      '<span class="deck-hint">' + icon('swipe') + 'Swipe · tap to open</span>' +
      '</div>' +
      '</div>'
    );
    node.querySelector('[data-act="shuffle"]').addEventListener('click', function () {
      haptic(10);
      for (var i = deckOrder.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = deckOrder[i];
        deckOrder[i] = deckOrder[j]; deckOrder[j] = t;
      }
      deckPos = 0;
      buildDeck(node.querySelector('#deck'), node.querySelector('#deckMeta'));
      toast('Reshuffled', 'shuffle');
    });
    // deck builds after mount so sizes are known
    requestAnimationFrame(function () {
      buildDeck(node.querySelector('#deck'), node.querySelector('#deckMeta'));
    });
    return node;
  }

  function current() { return DATA[deckOrder[((deckPos % DATA.length) + DATA.length) % DATA.length]]; }
  function at(offset) {
    var n = DATA.length;
    return DATA[deckOrder[(((deckPos + offset) % n) + n) % n]];
  }

  function updateMeta(metaEl, p) {
    metaEl.innerHTML =
      '<h2 class="title">' + esc(p.title) + '</h2>' +
      '<p class="artist">' + esc(p.artist) + '</p>' +
      '<p class="sub">' + esc(p.movement) + ' · ' + p.year + '</p>';
    metaEl.classList.remove('swap'); void metaEl.offsetWidth; metaEl.classList.add('swap');
  }

  function buildDeck(deck, metaEl) {
    deck.innerHTML = '';
    // draw back-to-front so the top card is last in the DOM
    var cards = [];
    for (var d = 2; d >= 0; d--) {
      var p = at(d);
      var top = d === 0;
      var card = h(
        '<div class="card' + (top ? ' is-top' : '') + '">' +
        artHTML(p,
          (top ? '<button class="heart' + (store.isFav(p.id) ? ' on' : '') + '" aria-label="Save">' +
            icon(store.isFav(p.id) ? 'heartFill' : 'heart') + '</button>' : '')
        ) + '</div>'
      );
      setBase(card, d);
      deck.appendChild(card);
      hydrateArt(card);
      cards.push(card);
      if (top) attachDrag(card, deck, metaEl, p);
    }
    updateMeta(metaEl, current());
  }

  function setBase(card, depth) {
    var scale = 1 - depth * 0.06;
    var ty = -depth * 18;
    card.style.opacity = depth > 1 ? '0.9' : '1';
    card.style.transform = 'translateY(' + ty + 'px) scale(' + scale + ')';
    card.style.zIndex = String(10 - depth);
  }

  function attachDrag(card, deck, metaEl, p) {
    var startX = 0, startY = 0, dx = 0, dy = 0, dragging = false, busy = false, moved = 0, t0 = 0;
    var second = card.previousElementSibling; // depth 1
    var third = second ? second.previousElementSibling : null; // depth 2
    var heart = card.querySelector('.heart');

    if (heart) heart.addEventListener('click', function (e) {
      e.stopPropagation();
      var on = store.toggleFav(p.id);
      heart.classList.toggle('on', on);
      heart.innerHTML = icon(on ? 'heartFill' : 'heart');
      heart.classList.remove('pop'); void heart.offsetWidth; heart.classList.add('pop');
      haptic(12);
      toast(on ? 'Saved to Favorite' : 'Removed', 'heart');
    });

    function down(e) {
      if (busy) return;
      dragging = true; moved = 0; t0 = Date.now();
      startX = e.clientX; startY = e.clientY; dx = 0; dy = 0;
      card.classList.remove('anim');
      card.setPointerCapture && card.setPointerCapture(e.pointerId);
    }
    function move(e) {
      if (!dragging) return;
      dx = e.clientX - startX; dy = e.clientY - startY;
      moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
      var rot = dx * 0.035;
      card.style.transform = 'translate(' + dx + 'px,' + (dy * 0.34) + 'px) rotate(' + rot + 'deg)';
      var img = card.querySelector('.art-img');
      if (img) img.style.transform = 'translateX(' + (dx * -0.04) + 'px)';
      var prog = Math.min(Math.abs(dx) / 120, 1);
      if (second) { second.style.transform = 'translateY(' + (-18 + 18 * prog) + 'px) scale(' + (0.94 + 0.06 * prog) + ')'; }
      if (third) { third.style.transform = 'translateY(' + (-34 + 16 * prog) + 'px) scale(' + (0.88 + 0.06 * prog) + ')'; }
    }
    function up(e) {
      if (!dragging) return;
      dragging = false;
      var dt = Date.now() - t0;
      var vx = Math.abs(dx) / Math.max(dt, 1);
      // tap → open
      if (moved < 10 && dt < 350) { haptic(6); go('#/art/' + p.id); return; }
      var fling = Math.abs(dx) > 95 || (vx > 0.5 && Math.abs(dx) > 40);
      if (fling) {
        busy = true;
        var dir = dx < 0 ? -1 : 1; // left = next
        card.classList.add('gone');
        card.style.transform = 'translate(' + (dir * 640) + 'px,' + (dy * 0.5 - 40) + 'px) rotate(' + (dir * 22) + 'deg)';
        card.style.opacity = '0';
        if (second) { second.classList.add('anim'); setBase(second, 0); }
        if (third) { third.classList.add('anim'); setBase(third, 1); }
        setTimeout(function () {
          deckPos += (dir === -1 ? 1 : -1);
          buildDeck(deck, metaEl);
        }, 360);
      } else {
        card.classList.add('anim');
        setBase(card, 0);
        var img = card.querySelector('.art-img'); if (img) img.style.transform = '';
        if (second) { second.classList.add('anim'); setBase(second, 1); }
        if (third) { third.classList.add('anim'); setBase(third, 2); }
        setTimeout(function () {
          card.classList.remove('anim'); if (second) second.classList.remove('anim'); if (third) third.classList.remove('anim');
        }, 500);
      }
    }
    card.addEventListener('pointerdown', down);
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', up);
    card.addEventListener('pointercancel', up);
  }

  /* ============================================================== DETAIL === */
  function openDetail(id) {
    var p = byId(id);
    if (!p) { go('#/home'); return; }
    if (detailEl) { detailEl.remove(); detailEl = null; }

    var fav = store.isFav(id);
    var chips = [
      ['Medium', p.medium], ['Dimensions', p.dimensions],
      ['Movement', p.movement], ['Where', p.location]
    ].map(function (c) { return '<span class="chip">' + c[0] + ' <b>' + esc(c[1]) + '</b></span>'; }).join('');

    var facts = p.facts.map(function (f, i) {
      return '<li><span class="n">' + (i + 1) + '</span><span>' + esc(f) + '</span></li>';
    }).join('');

    var prose = p.description.split('\n\n').map(function (par) {
      return '<p>' + esc(par) + '</p>';
    }).join('');

    detailEl = h(
      '<div class="detail enter">' +
      '<div class="detail-hero">' + artHTML(p) +
      '<div class="detail-float">' +
      '<button class="round-btn" data-act="back" aria-label="Back">' + icon('back') + '</button>' +
      '<button class="round-btn' + (fav ? ' on' : '') + '" data-act="fav" aria-label="Save">' + icon(fav ? 'heartFill' : 'heart') + '</button>' +
      '</div></div>' +
      '<div class="detail-body">' +
      '<h1>' + esc(p.title) + '</h1>' +
      '<p class="byline">' + esc(p.artist) + ' <span class="yr">(' + p.year + ')</span></p>' +
      '<div class="valuecard"><div><div class="lbl">Estimated value</div><div class="val">' + esc(p.estimate) + '</div></div>' +
      '<div class="note">' + esc(p.estimateNote) + '</div></div>' +
      '<div class="chips">' + chips + '</div>' +
      '<div class="prose">' + prose + '</div>' +
      '<div class="facts"><h3>Notes &amp; facts</h3><ul>' + facts + '</ul></div>' +
      '<div class="detail-actions">' +
      '<button class="pill" data-act="fav2">' + icon(fav ? 'heartFill' : 'heart') + '<span>' + (fav ? 'Saved' : 'Save') + '</span></button>' +
      '<button class="pill ghost" data-act="album">' + icon('plus') + '<span>Add to album</span></button>' +
      '</div></div></div>'
    );

    stage.appendChild(detailEl);
    hydrateArt(detailEl);
    var hero = detailEl.querySelector('.detail-hero .art-img'); if (hero) hero.classList.add('zoom');

    detailEl.querySelector('[data-act="back"]').addEventListener('click', function () { history.back(); });

    function syncFav() {
      var on = store.isFav(id);
      var rb = detailEl.querySelector('[data-act="fav"]');
      rb.classList.toggle('on', on); rb.innerHTML = icon(on ? 'heartFill' : 'heart');
      rb.classList.remove('pop'); void rb.offsetWidth; rb.classList.add('pop');
      var pl = detailEl.querySelector('[data-act="fav2"]');
      pl.innerHTML = icon(on ? 'heartFill' : 'heart') + '<span>' + (on ? 'Saved' : 'Save') + '</span>';
    }
    function doFav() { var on = store.toggleFav(id); haptic(12); syncFav(); toast(on ? 'Saved to Favorite' : 'Removed', 'heart'); }
    detailEl.querySelector('[data-act="fav"]').addEventListener('click', doFav);
    detailEl.querySelector('[data-act="fav2"]').addEventListener('click', doFav);
    detailEl.querySelector('[data-act="album"]').addEventListener('click', function () { openAlbumSheet(id); });
  }

  function closeDetail() {
    if (!detailEl) return;
    var el = detailEl; detailEl = null;
    el.classList.remove('enter'); el.classList.add('leave');
    setTimeout(function () { el.remove(); }, 340);
  }

  /* ========================================================== ALBUM SHEET == */
  function openAlbumSheet(pid) {
    var scrim = qs('#scrim'), sheet = qs('#sheet');
    function render() {
      var opts = store.albums.map(function (a) {
        var inside = a.items.indexOf(pid) > -1;
        return '<button class="opt' + (inside ? ' in' : '') + '" data-album="' + a.id + '">' +
          '<span class="nm">' + esc(a.name) + '</span>' +
          '<span class="ct">' + a.items.length + '</span>' +
          (inside ? icon('check', 'tick') : '') + '</button>';
      }).join('');
      sheet.innerHTML =
        '<div class="grip"></div>' +
        '<h3>Add to album</h3>' +
        '<div class="sub">Keep this work in a collection of your own.</div>' +
        '<div class="album-pick">' + (opts || '') + '</div>' +
        '<div class="newfield"><input type="text" id="newAlbum" placeholder="New album name" maxlength="40"><button data-act="create">Create</button></div>';
      sheet.querySelectorAll('[data-album]').forEach(function (b) {
        b.addEventListener('click', function () {
          var a = store.albums.filter(function (x) { return x.id === b.getAttribute('data-album'); })[0];
          if (!a) return;
          var i = a.items.indexOf(pid);
          if (i > -1) { a.items.splice(i, 1); toast('Removed from ' + a.name); }
          else { a.items.unshift(pid); toast('Added to ' + a.name, 'check'); }
          store.save(); haptic(10); render();
        });
      });
      sheet.querySelector('[data-act="create"]').addEventListener('click', function () {
        var inp = sheet.querySelector('#newAlbum'); var nm = (inp.value || '').trim();
        if (!nm) { inp.focus(); return; }
        store.albums.unshift({ id: 'a' + Date.now(), name: nm, items: [pid] });
        store.save(); haptic(10); toast('Album created', 'check'); render();
      });
    }
    render();
    scrim.classList.add('show'); sheet.classList.add('show');
    function close() { scrim.classList.remove('show'); sheet.classList.remove('show'); scrim.removeEventListener('click', close); }
    scrim.addEventListener('click', close);
  }

  /* =============================================================== SAVED === */
  function masonry(ids, emptyNode) {
    if (!ids.length) return emptyNode;
    var wrap = h('<div class="masonry"></div>');
    ids.forEach(function (id, i) {
      var p = byId(id); if (!p) return;
      var ars = ['3 / 4', '3 / 4', '4 / 5', '1 / 1', '3 / 4', '4 / 5'];
      var tile = h(
        '<button class="tile" data-id="' + id + '" style="--ar:' + ars[i % ars.length] + '">' +
        artHTML(p) +
        '<div class="cap"><div class="t">' + esc(p.title) + '</div><div class="a">' + esc(p.artist) + '</div></div>' +
        '</button>'
      );
      tile.addEventListener('click', function () { haptic(6); go('#/art/' + id); });
      wrap.appendChild(tile);
    });
    return wrap;
  }

  function viewSaved() {
    var node = h(
      '<div><div class="page-head"><div class="eyebrow">Your collection</div>' +
      '<h2>Favorite</h2><div class="count">' + store.favs.length + ' saved works</div></div></div>'
    );
    var empty = h(
      '<div class="empty"><div class="mark">' + icon('heart') + '</div>' +
      '<h3>Nothing saved yet</h3><p>Tap the heart on any painting to keep it here.</p></div>'
    );
    node.appendChild(masonry(store.favs.slice(), empty));
    return node;
  }

  /* ============================================================== ALBUMS === */
  function coverCells(items) {
    var picks = items.slice(0, 4);
    if (!picks.length) return '<div class="cell"></div>';
    return picks.map(function (id) {
      var p = byId(id); if (!p) return '<div class="cell"></div>';
      return '<div class="cell">' + artHTML(p) + '</div>';
    }).join('');
  }

  function viewAlbums() {
    var node = h('<div><div class="page-head"><button class="iconbtn" data-act="back" style="margin-left:-8px">' + icon('back') + '</button>' +
      '<div class="eyebrow">Curated by you</div><h2>Albums</h2>' +
      '<div class="count">' + store.albums.length + ' album' + (store.albums.length === 1 ? '' : 's') + '</div></div></div>');
    node.querySelector('[data-act="back"]').addEventListener('click', function () { go('#/me'); });
    var list = h('<div class="albumlist"></div>');
    store.albums.forEach(function (a) {
      var row = h(
        '<button class="album-row" data-id="' + a.id + '">' +
        '<div class="album-cover' + (a.items.length <= 1 ? ' single' : '') + '">' + coverCells(a.items) + '</div>' +
        '<div class="album-meta"><div class="nm">' + esc(a.name) + '</div>' +
        '<div class="ct">' + a.items.length + ' work' + (a.items.length === 1 ? '' : 's') + '</div></div>' +
        '<span class="go">' + icon('chev') + '</span></button>'
      );
      row.addEventListener('click', function () { haptic(6); go('#/album/' + a.id); });
      list.appendChild(row);
    });
    var add = h('<button class="addalbum">' + icon('plus') + 'New album</button>');
    add.addEventListener('click', function () {
      store.albums.unshift({ id: 'a' + Date.now(), name: 'Untitled album', items: [] });
      store.save(); route(); toast('Album created', 'check');
    });
    list.appendChild(add);
    node.appendChild(list);
    return node;
  }

  function viewAlbum(id) {
    var a = store.albums.filter(function (x) { return x.id === id; })[0];
    if (!a) { var m = h('<div></div>'); go('#/albums'); return m; }
    var node = h('<div><div class="page-head">' +
      '<button class="iconbtn" data-act="back" style="margin-left:-8px">' + icon('back') + '</button>' +
      '<div class="eyebrow">Album</div><h2>' + esc(a.name) + '</h2>' +
      '<div class="count">' + a.items.length + ' work' + (a.items.length === 1 ? '' : 's') +
      ' · <button class="linklike" data-act="del" style="background:none;color:var(--accent);font:inherit;padding:0">delete album</button></div>' +
      '</div></div>');
    node.querySelector('[data-act="back"]').addEventListener('click', function () { go('#/albums'); });
    node.querySelector('[data-act="del"]').addEventListener('click', function () {
      var i = store.albums.indexOf(a); if (i > -1) store.albums.splice(i, 1); store.save();
      toast('Album deleted', 'trash'); go('#/albums');
    });
    var empty = h('<div class="empty"><div class="mark">' + icon('layers') + '</div>' +
      '<h3>Empty album</h3><p>Open a painting and tap “Add to album” to fill it.</p></div>');
    node.appendChild(masonry(a.items.slice(), empty));
    return node;
  }

  /* ============================================================= PROFILE === */
  function viewProfile() {
    var node = h(
      '<div>' +
      '<div class="brandbar"><div class="wordmark">Gallera<span class="dot">.</span></div></div>' +
      '<div class="profile-head"><div class="avatar">A</div>' +
      '<div class="who"><div class="nm">A Connoisseur</div><div class="role">member of the gallery</div></div></div>' +
      '<div class="stats">' +
      '<div class="stat"><div class="n">' + store.favs.length + '</div><div class="l">Saved</div></div>' +
      '<div class="stat"><div class="n">' + store.albums.length + '</div><div class="l">Albums</div></div>' +
      '<div class="stat"><div class="n">' + DATA.length + '</div><div class="l">In gallery</div></div>' +
      '</div>' +
      '<div class="section-label">Library</div>' +
      '<button class="setting" data-act="albums" style="width:100%;text-align:left">' +
      '<span class="ic">' + icon('layers') + '</span>' +
      '<span class="tx"><span class="t">Albums</span><span class="d">Collections you have curated</span></span>' +
      '<span class="go" style="color:var(--faint)">' + icon('chev') + '</span></button>' +
      '<button class="setting" data-act="saved" style="width:100%;text-align:left">' +
      '<span class="ic">' + icon('heart') + '</span>' +
      '<span class="tx"><span class="t">Favorite works</span><span class="d">Everything you have saved</span></span>' +
      '<span class="go" style="color:var(--faint)">' + icon('chev') + '</span></button>' +
      '<div class="section-label">Appearance</div>' +
      '<div class="setting"><span class="ic">' + icon('aa') + '</span>' +
      '<span class="tx"><span class="t">Typography</span><span class="d">Calligraphic or modern</span></span>' +
      '<span class="segmented" id="segType">' +
      '<button data-type="classic">Classic</button><button data-type="modern">Modern</button></span></div>' +
      '<div class="setting"><span class="ic">' + icon('moon') + '</span>' +
      '<span class="tx"><span class="t">Theme</span><span class="d">Follows your device by default</span></span>' +
      '<span class="segmented" id="segTheme">' +
      '<button data-theme="auto">Auto</button><button data-theme="light">Light</button><button data-theme="dark">Dark</button></span></div>' +
      '<div class="section-label">About</div>' +
      '<div class="setting"><span class="ic">' + icon('frame') + '</span>' +
      '<span class="tx"><span class="t">Gallera</span><span class="d">A quiet gallery for people who love paintings. Public-domain masterworks, yours to collect.</span></span></div>' +
      '<div style="height:20px"></div>' +
      '</div>'
    );
    node.querySelector('[data-act="albums"]').addEventListener('click', function () { go('#/albums'); });
    node.querySelector('[data-act="saved"]').addEventListener('click', function () { go('#/saved'); });

    var segType = node.querySelector('#segType');
    function paintType() {
      segType.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-type') === store.prefs.type); });
    }
    paintType();
    segType.addEventListener('click', function (e) {
      var b = e.target.closest('[data-type]'); if (!b) return;
      store.prefs.type = b.getAttribute('data-type'); store.save(); applyPrefs(); paintType(); haptic(8);
    });

    var segTheme = node.querySelector('#segTheme');
    function paintTheme() {
      segTheme.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-theme') === store.prefs.theme); });
    }
    paintTheme();
    segTheme.addEventListener('click', function (e) {
      var b = e.target.closest('[data-theme]'); if (!b) return;
      store.prefs.theme = b.getAttribute('data-theme'); store.save(); applyPrefs(); paintTheme(); haptic(8);
    });
    return node;
  }

  /* =============================================================== PREFS === */
  function applyPrefs() {
    var root = document.documentElement;
    root.setAttribute('data-type', store.prefs.type === 'modern' ? 'modern' : 'classic');
    if (store.prefs.theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', store.prefs.theme);
  }

  /* ================================================================ BOOT === */
  function boot() {
    screen = qs('#screen');
    stage = qs('#stage');
    store.load();
    applyPrefs();
    buildTabbar();
    window.addEventListener('hashchange', route);
    if (!location.hash) location.replace('#/home');
    route();

    // register service worker where possible (ignored in sandboxed previews)
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
