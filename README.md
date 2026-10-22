# NED 2026 — website redesign

A one-page static site written in plain HTML, CSS and JavaScript, with no framework and no build step.

## Open it
Double-click `index.html`, or upload the whole folder to the web host so it replaces the current site.

## Files
```
index.html              all page content (sections run top to bottom in the order of the nav)
assets/css/style.css    all styling; colours and fonts are set as variables at the top
assets/js/main.js       menu, highlighting of the current section, counters, lightbox, testimonial slider
assets/fonts/           Syne + Poppins, bundled with the site (SIL Open Font License)
assets/img/             web-optimised images (logo, hero, leaders, committee, speakers, flyers, venues, gallery)
```

## Design rules
- **Colours:** the palette from the draft. Indigo `#393780`, purple `#8448F6`, light violet `#C47EFC`, lilac `#CEB6FC`, slate `#30425A` and near-black `#181818`, plus white.
- **Type:** Syne for headings, Poppins for body text.
- **Shapes:** 40px rounded cards, pill-shaped buttons, round portraits and solid navy panels, as in the draft.

## Common edits
- **Section anchors:** they match the old site (`#TRACKS`, `#Hackathon`, `#LEADERS`, `#SteeringCommittee`, `#SPEAKERS`, `#Partners`, `#Archives`, `#Testimonials`, `#venue`, `#contact`, `#WHYNED`), so old links still work.
- **Register link:** search `index.html` for `cam.mycii.in`.
- **Stats:** edit the `data-count` values in the stats section (currently 100+, 250+, 25+, 40+).
- **Documents (PDFs):** these link to `https://www.nilgiried.com/doc/...` on the live server. The 2024 and 2025 Agenda PDFs return 404 on the live site, so they are left out.
- **Add a person:** copy an `<article class="person">` block and put a square image in the matching `assets/img/` folder.
