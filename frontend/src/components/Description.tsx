import { memo, type ReactElement } from "react";

export interface DescriptionProps {
  readonly description: string;
  readonly highlights: readonly string[];
  readonly variantLabel?: string;
}

function Description({
  description,
  highlights,
  variantLabel,
}: DescriptionProps): ReactElement {
  return (
    <section className="desc">
      <h2 className="desc__title">About this product</h2>
      {variantLabel !== undefined && variantLabel.length > 0 && (
        <p className="desc__variant" aria-live="polite">
          Selected: <strong>{variantLabel}</strong>
        </p>
      )}
      <p className="desc__body" key={variantLabel ?? "default"}>
        {description}
      </p>
      {highlights.length > 0 && (
        <ul className="desc__highlights">
          {highlights.map((h, i) => (
            <li key={`${variantLabel ?? ""}-${String(i)}-${h}`}>
              <span className="check" aria-hidden>
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path
                    d="M5 12l5 5L20 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {h}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default memo(Description);
