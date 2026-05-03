import { memo, type ReactElement } from "react";

export interface ProductGalleryProps {
  readonly image: string;
  readonly alt: string;
}

function ProductGallery({ image, alt }: ProductGalleryProps): ReactElement {
  return (
    <div className="gallery">
      <div className="gallery__main">
        <img
          src={image}
          alt={alt}
          className="gallery__img"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="gallery__thumbs" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`gallery__thumb ${i === 0 ? "is-active" : ""}`}>
            <img src={image} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProductGallery);
