# Propx — Static Real Estate Website

## Files
- `index.html` — page structure
- `style.css` — styling and responsive layout
- `properties.js` — manually maintained property data
- `script.js` — search, filters, favourites, and property details
- `assets/images/` — add your property photos here

## Add your own photos
Put images inside `assets/images/`, for example:
- `hero-home.jpg`
- `property-1.jpg`
- `property-2.jpg`
- `property-3.jpg`

Then update the `images` paths in `properties.js`. If `hero-home.jpg` is missing, the hero section displays a colour illustration fallback. Property cards also have a background fallback.

## Add a property
Open `properties.js` and add another object inside the `PROPERTIES` array. Give every property a unique `id`.
- `type`: `Land`, `Flat`, `House`, or `Room`
- `purpose`: `rent` or `sale`
- `price`: numeric amount in INR
- `images`: relative paths to photos in `assets/images/`
- `phone`: phone number with country code and digits only, e.g. `919876543210`

## Run locally
Open `index.html` in your browser.

## Publish on GitHub Pages
1. Create a repository (for example `propx`).
2. Upload all files and the `assets` folder to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, branch `main`, folder `/(root)`.
5. Save if the settings changed, then wait for deployment.

Project URL format: `https://YOUR-USERNAME.github.io/propx/`

This is a static frontend. Listings are stored in `properties.js`; favourites are kept only in the current page session. There is no server, login system, database, or online property submission form.
