// Shared site behaviour: mobile menu and site visit request forms.

// Paste the Formspree form endpoint here (e.g. 'https://formspree.io/f/abcdwxyz').
// While it is empty, forms fall back to opening a pre-filled email.
var PROTOS_FORM_ENDPOINT = 'https://formspree.io/f/xaeqpvnz';

(function () {
  // Mobile menu
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('mobile-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.classList.toggle('open', open);
      nav.classList.toggle('open', open);
      nav.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setOpen(!toggle.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
    });
  }

  // Links like "Book a home charger visit" pre-pick the job type in the form on the same page
  document.querySelectorAll('a[data-job]').forEach(function (link) {
    link.addEventListener('click', function () {
      var select = document.querySelector('.lead-form select[name="job"]');
      if (select) select.value = link.dataset.job;
    });
  });

  // Site visit request forms: any <form class="lead-form" data-subject="...">
  document.querySelectorAll('form.lead-form').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    var button = form.querySelector('button[type="submit"]');
    var say = function (text, kind) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = 'form-msg' + (kind ? ' ' + kind : '');
    };

    // Plain-text summary of every filled-in field, labelled the way the visitor saw it
    var summary = function () {
      var lines = [];
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (!el.name || el.name.charAt(0) === '_' || el.type === 'hidden') return;
        var label = el.closest('label');
        var name = label ? label.childNodes[0].textContent.trim() : el.name;
        lines.push(name + ': ' + el.value);
      });
      lines.push('', 'Sent from: ' + location.href);
      return lines.join('\n');
    };

    var subject = function () {
      var job = form.elements['job'];
      return (form.dataset.subject || 'Website site visit request') + (job && job.value ? ': ' + job.value : '');
    };

    var openEmail = function (text, kind) {
      window.location.href = 'mailto:info@protoselectrical.ca?subject=' + encodeURIComponent(subject()) +
        '&body=' + encodeURIComponent(summary());
      say(text || "Your email app should open with the details filled in. If it doesn't, email info@protoselectrical.ca or call 780-803-2868.", kind);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements['name'], contact = form.elements['contact'];
      if (!name.value.trim() || !contact.value.trim()) {
        say('Add your name and a phone number or email so we can reply.', 'warn');
        return;
      }
      if (!PROTOS_FORM_ENDPOINT) { openEmail(); return; }
      if (form.elements['_gotcha'] && form.elements['_gotcha'].value) { form.reset(); say('Thanks.', 'ok'); return; }

      var data = new FormData(form);
      data.set('_subject', subject());
      data.set('page', location.href);
      if (/@/.test(contact.value)) data.set('_replyto', contact.value.trim());
      button.disabled = true;
      say('Sending…');
      fetch(PROTOS_FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          say("Thanks, we've got your request. We'll reply within one business day (Mon–Fri, 7am–4pm).", 'ok');
        })
        .catch(function () {
          openEmail("We couldn't send that, so we're opening your email app instead. You can also call 780-803-2868.", 'warn');
        })
        .finally(function () { button.disabled = false; });
    });
  });
})();
