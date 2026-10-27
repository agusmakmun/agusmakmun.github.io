(function () {
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var store = {
    get: function (k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    },
  };

  function flash(btn, html) {
    var old = btn.innerHTML;
    btn.innerHTML = html;
    setTimeout(function () {
      btn.innerHTML = old;
    }, 2000);
  }
  function copy(text, btn, html) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(function () {
      flash(btn, html);
    });
  }
  var COPIED = '<span class="icon green">check</span><span>Copied!</span>';

  // theme
  var root = document.documentElement;
  var themeBtn = $('#theme-toggle');
  function paintThemeBtn() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.querySelector('.icon').textContent = dark ? 'light_mode' : 'dark_mode';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (themeBtn) {
    paintThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('theme', next);
      paintThemeBtn();
    });
  }

  // GitHub star count (cached per tab session; anonymous API allows 60 req/hour per IP)
  var gh = $('[data-gh-repo]');
  if (gh) {
    var ghCount = gh.querySelector('.count');
    var showStars = function (n) {
      ghCount.textContent = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n;
      ghCount.hidden = false;
    };
    var cached = null;
    try {
      cached = sessionStorage.getItem('gh-stars');
    } catch (e) {}
    if (cached) showStars(+cached);
    else
      fetch('https://api.github.com/repos/' + gh.getAttribute('data-gh-repo'))
        .then(function (r) {
          return r.ok ? r.json() : null;
        })
        .then(function (d) {
          if (!d || typeof d.stargazers_count !== 'number') return;
          try {
            sessionStorage.setItem('gh-stars', d.stargazers_count);
          } catch (e) {}
          showStars(d.stargazers_count);
        })
        .catch(function () {});
  }

  // mobile menu
  var menuBtn = $('#menu-toggle'),
    mobileNav = $('#mobile-nav');
  if (menuBtn)
    menuBtn.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });

  // search (⌘K)
  var dialog = $('#search-dialog'),
    input = $('#search-input'),
    results = $('#search-results');
  var posts = null,
    sel = 0;
  function render() {
    var q = input.value.toLowerCase().trim();
    var hits = (posts || [])
      .filter(function (p) {
        return !q || (p.title + ' ' + p.categories.join(' ')).toLowerCase().indexOf(q) !== -1;
      })
      .slice(0, 12);
    sel = Math.min(sel, Math.max(hits.length - 1, 0));
    results.innerHTML = hits.length
      ? hits
          .map(function (p, i) {
            return (
              '<li><a href="' +
              p.url +
              '"' +
              (i === sel ? ' class="sel"' : '') +
              '><span class="t"></span><span class="d">' +
              p.date +
              '</span></a></li>'
            );
          })
          .join('')
      : '<li class="empty">' + (posts ? 'No posts found.' : 'Loading…') + '</li>';
    // titles via textContent, never innerHTML
    $$('.t', results).forEach(function (el, i) {
      el.textContent = hits[i].title;
    });
  }
  function openSearch() {
    if (!dialog) return;
    dialog.showModal();
    input.select();
    if (!posts)
      fetch(dialog.getAttribute('data-src'))
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          posts = d;
          render();
        })
        .catch(function () {
          posts = [];
          render();
        });
    render();
  }
  $$('[data-open-search]').forEach(function (b) {
    b.addEventListener('click', openSearch);
  });
  window.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
  if (dialog) {
    input.addEventListener('input', function () {
      sel = 0;
      render();
    });
    input.addEventListener('keydown', function (e) {
      var links = $$('a', results);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % (links.length || 1);
        render();
      } else if (e.key === 'Enter' && links[sel]) {
        location.href = links[sel].href;
      }
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  // home: compact / expanded view
  var list = $('#posts-list');
  var viewBtns = $$('[data-view]');
  function setView(v) {
    if (!list) return;
    list.classList.toggle('cards', v === 'cards');
    viewBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-view') === v);
    });
    store.set('view', v);
  }
  if (list && viewBtns.length) {
    setView(store.get('view') || 'compact');
    viewBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        setView(b.getAttribute('data-view'));
      });
    });
  }

  // copy buttons
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      copy(b.getAttribute('data-copy'), b, COPIED);
    });
  });
  var linkBtn = $('#copy-link');
  if (linkBtn)
    linkBtn.addEventListener('click', function () {
      copy(location.href, linkBtn, '<span class="icon">check</span><span>Copied!</span>');
    });

  // article: share menu (+ OS share sheet where the browser has one)
  var shareBtn = $('#share-btn'),
    shareMenu = $('#share-menu'),
    shareNative = $('#share-native');
  if (shareBtn) {
    var setShare = function (open) {
      shareMenu.hidden = !open;
      shareBtn.setAttribute('aria-expanded', open);
      if (open) shareMenu.querySelector('a').focus();
    };
    shareBtn.addEventListener('click', function () {
      setShare(shareMenu.hidden);
    });
    document.addEventListener('click', function (e) {
      if (!shareMenu.hidden && !e.target.closest('.share')) setShare(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !shareMenu.hidden) {
        setShare(false);
        shareBtn.focus();
      }
    });
    $$('a', shareMenu).forEach(function (a) {
      a.addEventListener('click', function () {
        setShare(false);
      });
    });
    if (navigator.share) {
      shareNative.hidden = false;
      shareNative.addEventListener('click', function () {
        setShare(false);
        navigator.share({ title: document.title, url: location.href }).catch(function () {});
      });
    }
  }

  // article: wrap code blocks with a header bar + copy button
  $$('.prose div.highlighter-rouge, .prose figure.highlight').forEach(function (block) {
    if (block.closest('.codeblock') || block.parentElement.closest('.highlighter-rouge')) return;
    var m = (block.className + ' ' + ((block.querySelector('code') || {}).className || '')).match(/language-([\w+-]+)/);
    var code = block.querySelector('code');
    var wrap = document.createElement('div');
    wrap.className = 'codeblock';
    wrap.innerHTML =
      '<div class="codeblock-bar"><span><span class="icon">code_blocks</span><span class="lang"></span></span>' +
      '<button type="button"><span class="icon">content_copy</span><span>Copy</span></button></div>';
    wrap.querySelector('.lang').textContent = m ? m[1] : 'code';
    block.parentNode.insertBefore(wrap, block);
    wrap.appendChild(block);
    var btn = wrap.querySelector('button');
    btn.addEventListener('click', function () {
      var gutter = code.querySelector('.rouge-code'); // line-numbered tables
      copy((gutter || code).innerText.replace(/\n$/, ''), btn, COPIED);
    });
  });

  // article: table of contents + scroll spy
  var toc = $('#toc'),
    tocNav = $('#toc-nav');
  var heads = $$('.prose h2[id], .prose h3[id]');
  if (toc && heads.length > 1) {
    heads.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      if (h.tagName === 'H3') a.className = 'sub';
      tocNav.appendChild(a);
    });
    $('#toc-count').textContent = heads.length + ' sections';
    var links = $$('a', tocNav);
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
          });
        });
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    heads.forEach(function (h) {
      spy.observe(h);
    });
  } else if (toc) {
    toc.querySelector('.toc-head').hidden = true;
    tocNav.hidden = true;
  }

  // projects: tag filter
  $$('.tag-filter button').forEach(function (b, _, all) {
    b.addEventListener('click', function () {
      var tag = b.getAttribute('data-tag');
      all.forEach(function (x) {
        x.classList.toggle('active', x === b);
      });
      $$('.project-card').forEach(function (c) {
        c.hidden = tag !== 'all' && JSON.parse(c.getAttribute('data-tags')).indexOf(tag) === -1;
      });
    });
  });
})();
