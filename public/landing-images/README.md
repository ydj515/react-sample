# Landing image assets

Generate these original fictional concepts with OpenAI ImageGen on 2026-09-09.
Do not treat the scenes as photographs of an operating hotel or a real product.
No third-party brand images or remote image endpoints are part of these samples.

| File                   | Subject                                          | Usage                                                        |
| ---------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `forest-retreat.png`   | Cedar and stone retreat in a misty pine forest   | ONYU hero and collection thumbnail                           |
| `forest-suite.png`     | Quiet bedroom overlooking a forest               | ONYU room mood image                                         |
| `forma-headphones.png` | Ivory headphones with an orange physical control | FORMA hero, details, configuration, and collection thumbnail |

Keep the original 1536 × 1024 PNG assets, including their embedded generation
provenance. Serve the WebP derivatives in the application, including collection
thumbnails, with `srcSet` and layout-specific `sizes`. Keep the PNGs as source
assets only; application image requests do not use them.

Generate the derivatives with Sharp 0.35.4 / libwebp 1.6.0, WebP quality 82 and
effort 6. Resize each landscape image to 480, 960, and 1536 pixels wide without
changing its aspect ratio. For the retreat hero below 640px, use centered 3:5
crops at 360 × 600 and 600 × 1000 through a `picture` source. The crop preserves
the mobile hero composition without downloading the full landscape image.

| Image      | Original PNG | 480px landscape WebP | 1536px landscape WebP |
| ---------- | ------------ | -------------------- | --------------------- |
| Retreat    | 2,725,880 B  | 30,758 B             | 214,784 B             |
| Room       | 2,900,301 B  | 29,080 B             | 232,552 B             |
| Headphones | 1,895,951 B  | 5,946 B              | 52,370 B              |

The retreat portrait variants contain 23,316 B (360px) and 50,648 B (600px).
These are encoded file sizes, not measured page-load or LCP timings. Browser
selection depends on viewport, pixel density, cache, and the supplied sizes.

Declare dimensions on images and lazy-load images below the hero.
The room mood image does not depict separate real inventory for each room type;
the page explicitly labels it as a generated concept.

Reference-site design observations and implementation boundaries live in
`docs/landing-examples.md`. All UI text is HTML; no page copy is baked into images.
