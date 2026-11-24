# Bar Culture demo site

Static multi-page site: index, about, services, gallery, contact. Shared styles in css/style.css; nav, footer, gallery and location logic in js/site.js. No build step.

Visitors see their nearest service city first (IP lookup via get.geojs.io, fallback ipapi.co). If they are more than 400 miles from every city, or the lookup fails, the default Texas-first order shows.

## Put it on GitHub Pages
1. Create a new public repo on GitHub, e.g. `bar-culture`.
2. Upload `index.html`, `README.md` and the whole `img` folder (drag and drop on the repo page works).
3. Repo > Settings > Pages > Source: "Deploy from a branch", Branch: `main`, folder `/ (root)` > Save.
4. After a minute the site is live at `https://<your-username>.github.io/bar-culture/`.

## Before going live for real
- Quote form posts to FormSubmit (formsubmit.co) and emails barculturenow@gmail.com. The FIRST submission triggers an activation email to that inbox; Ronnie must click the link once, then all requests arrive as emails. To change the address, edit the form action in contact.html.
- Buy a domain (e.g. barculture-something.com) and point it at GitHub Pages or move to Netlify.
- Confirm copy, stats (30 yrs / 10 yrs), event list and service areas with Ronnie.
- Add Instagram / Facebook links and reviews if he has them.

## Draft notes for Ronnie's review
- FAQ answers are educated guesses. Items marked `<!-- CONFIRM: ... -->` in faq.html need his real policy (deposit, insurance, attire, arrival time, booking lead time, Destin certification. Pricing, alcohol, minimum hours, travel and staffing ratio are now Ronnie's real answers).
- Page copy is written in a casual first-draft voice; swap in his own stories and phrasing once he reviews.
- Source copy lives in build.py (in the chat workspace); edit the HTML files directly if that is easier.
