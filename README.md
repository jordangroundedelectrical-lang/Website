# Protos Electrical website

Plain static HTML, CSS and JS. There is no build step.

- Live site: https://protoselectrical.ca
- Goes live automatically when changes are pushed to `main` (GitHub Pages).
- Custom domain is set in `CNAME` (protoselectrical.ca). DNS is at Netlify DNS. Don't delete `CNAME`.
- Forms post to Formspree. The endpoint is `PROTOS_FORM_ENDPOINT` in `assets/site.js`.
- Shared styles are in `assets/site.css` (homepage and six service pages). The homepage adds its own rules inline; `condo-ev-charging.html` and `404.html` have their own built-in styles.

## Preview locally

Double-click `index.html` to see the homepage. Service pages use root-relative links (`/assets/...`), so they only look right on the live site or a local web server.
