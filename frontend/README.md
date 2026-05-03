# Aurora PDP — React Product Detail Page

Frontend Test deliverable: a single-product Product Detail Page with variant selection (color + size), quantity control, and add-to-cart flow. Backed by a browser-side mock API that reads from `public/products.json`.

## Tech

- React 19 + Create React App (react-scripts 5)
- **TypeScript** (`strict`, `noImplicitReturns`, etc. in [`tsconfig.json`](tsconfig.json))
- Domain types in [`src/types/product.ts`](src/types/product.ts) (`Product`, `Sku`, `ColorId`, `SizeId`)
- Plain global CSS in [`src/styles.css`](src/styles.css)
- Cart state via React Context ([`src/context/CartContext.tsx`](src/context/CartContext.tsx))
- **Analytics** — typed `track()` in [`src/analytics/`](src/analytics/) (see below)

## Analytics (basic design)

All events go through **`track(event)`** ([`src/analytics/analytics.ts`](src/analytics/analytics.ts)), using a **discriminated union** ([`src/analytics/types.ts`](src/analytics/types.ts)) so new event names get compile-time checks at call sites.

| Event | When it fires | Payload highlights |
|--------|----------------|-------------------|
| `view_item` | PDP has loaded product + initial SKU | `productId`, `skuId`, `color`, `size`, `price`, `currency` |
| `select_variant` | Customer changes color/size to another SKU | `skuId`, variant dimensions, `price` |
| `add_to_cart` | `addToCart` API succeeds | `quantity`, `unitPrice`, `value` (= line total), `currency`, `skuId` |
| `add_to_cart_error` | `addToCart` throws | `message`, `productId`, `skuId` |

**Sinks**

- **Development:** each event is logged to the console as `[analytics]` with a `ts` ISO timestamp.
- **Production / GTM:** if `window.dataLayer` is an array (standard for [GA4 + GTM](https://developers.google.com/tag-platform/gtagjs)), a **GA4-shaped** object is pushed (e.g. `add_to_cart` with `ecommerce.items[]`).

**Integrating a vendor later:** replace the body of `track()` with `segment.track(...)`, `gtag('event', ...)`, or your own beacon — keep the `AnalyticsEvent` union as the contract from the UI layer.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## How to run

```bash
cd frontend
npm install   # only needed if node_modules was cleaned
npm start     # starts dev server on http://localhost:3000
```

Build for production:

```bash
npm run build
```

## Tests (Jest + React Testing Library)

```bash
npm test                 # interactive watch mode
npm run test:ci          # single run (CI / sandbox-safe; disables watchman)
```

Coverage includes:

- **`CartContext`** — cart count merges lines for the same `skuId`
- **`VariantSelector`** — color / size clicks invoke the correct callbacks
- **`QuantityPicker`** — +/- respects min/max (controlled wrapper)
- **`Description`** — variant label + body + highlights
- **`ProductDetailPage`** — mocked `getProduct` / `addToCart` / `track`: happy path, error + retry, and **analytics** (`view_item`, `select_variant`, `add_to_cart`, `add_to_cart_error`)
- **`analytics/analytics.test`** — `add_to_cart` pushes to `window.dataLayer` when present

Shared fixture: [`src/test/fixtures/product.ts`](src/test/fixtures/product.ts). Jest setup: [`src/setupTests.ts`](src/setupTests.ts) (`@testing-library/jest-dom`).

## Demo flags (URL query string)

The mock API reads the URL to simulate failure / latency:

| URL | Effect |
|-----|--------|
| `http://localhost:3000/` | Normal flow |
| `http://localhost:3000/?fail=product` | `getProduct` rejects → renders the **API error** state with a "Try again" button |
| `http://localhost:3000/?fail=cart` | `addToCart` rejects → red toast, cart count not incremented |
| `http://localhost:3000/?slow=1` | Doubles latency, makes the loading skeleton easier to see |

Out-of-stock state is built into the data — try **White / Pro** in the variant pickers; the price row shows the OOS badge, the quantity picker is disabled, and the Add-to-cart button is locked.

## Project structure

```
frontend/
  public/
    products.json              # mock product + SKUs (one SKU has stock = 0)
    images/                    # SVG product images per color
  src/
    index.tsx                  # bootstraps React, wraps in CartProvider
    App.tsx                    # layout: header + main + footer
    types/product.ts           # shared API / UI domain types
    styles.css                 # single global stylesheet
    analytics/
      types.ts                 # AnalyticsEvent discriminated union
      analytics.ts             # track() — console + optional dataLayer
      index.ts                 # public exports
    api/
      mockApi.ts               # getProduct / addToCart with delays + failure flags
    context/
      CartContext.tsx          # cart state (count, items, addItem)
    components/
      Header.tsx               # site header + cart badge
      ProductDetailPage.tsx    # orchestrates fetch + state, child layout
      ProductGallery.tsx       # main image + thumbnails
      VariantSelector.tsx      # color + size pickers
      QuantityPicker.tsx       # +/- with min 1, max stock
      AddToCartButton.tsx      # primary action with disabled / OOS / submitting states
      Description.tsx          # description + highlights (variant-aware)
      Toast.tsx                # auto-dismiss feedback
      Skeleton.tsx             # loading state
```

## How the requirements map to code

| Requirement | Where |
|-------------|------|
| Image, name, price, stock status | `ProductGallery`, `ProductDetailPage` (price row + stock badge) |
| Two variant dimensions | `VariantSelector` (color, size) — disabled combinations cross out |
| Description section | `Description` — body + highlights come from the **selected SKU** in `products.json` (falls back to product-level copy if a field is missing) |
| Variant change updates price/stock | `ProductDetailPage` derives `currentSku` from `(color, size)` |
| Quantity 1..stock | `QuantityPicker` clamps; auto-shrinks when SKU changes |
| Add-to-cart success feedback | `Toast` + `Header` cart badge increments |
| Product detail API | `getProduct` in `src/api/mockApi.ts` (reads `public/products.json`) |
| Add-to-cart API | `addToCart` in `src/api/mockApi.ts` |
| PDP analytics | `track()` in `src/analytics/` — `view_item`, `select_variant`, `add_to_cart`, `add_to_cart_error` from `ProductDetailPage` |
| Loading | `Skeleton` while `getProduct` pending |
| API error | Error block with "Try again" button (re-runs the fetch) |
| Out of stock | Stock badge `OUT OF STOCK`, picker + button disabled |

## Notes / assumptions

- A single product (`aurora-h1`) is shown; the spec asks for one PDP rather than a list.
- "Add to cart" is in-memory only — the cart count resets on page reload.
- Images are local SVGs to keep the demo offline-safe.
- Tests, routing, and persistence are intentionally out of scope.
