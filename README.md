# OAZI IMAGERY website

The public site for www.oaziimagery.org. Seven pages (Home, About, Services, Work, Sectors, Process, Contact) plus a 404 page, built from the OAZI IMAGERY design prototype.

## Run it locally

```
npm install
npm run dev
```

Then open http://localhost:4321. Contact-form posts are printed in the terminal rather than sent anywhere.

## How it's built

Each page is pre-rendered to plain HTML, so the content loads fast and search engines can read it. Pages with tabs, toggles or the form also load a small script that makes those parts interactive.

| Where | What |
|---|---|
| `src/components/*.html` | Page and section templates (the text and layout). |
| `src/components/*.js` | The interactive behaviour and lists of content, such as projects, sectors, FAQs and process steps. |
| `src/site.config.js` | Page titles, search descriptions, URLs and the client sign-in link. |
| `src/render.js` | The template engine, shared by the build and the browser. |
| `public/` | Images and the global stylesheet, copied as-is. |
| `scripts/build.mjs` | Builds everything into `dist/`. |

Template syntax: `{{value}}` inserts a value, `<sc-for list="{{items}}" as="item">` repeats a block, `<sc-if value="{{flag}}">` shows a block conditionally, and `<dc-import name="Header">` includes another component.

## Contact form

The enquiry form posts to Netlify Forms (`ENQUIRY_ENDPOINT` in `src/components/Contact.js`). Netlify detects the form when the site is deployed. Set up email notifications under **Site configuration → Forms** in Netlify. When SIA's `submit-enquiry` function is ready, change that one constant to point at it.

## Deploy

Netlify reads `netlify.toml`: build command `npm run build`, publish folder `dist`.
