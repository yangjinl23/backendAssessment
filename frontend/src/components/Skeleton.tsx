import type { ReactElement } from "react";

export default function Skeleton(): ReactElement {
  return (
    <div className="pdp pdp--loading" aria-busy="true" aria-live="polite">
      <div className="pdp__media">
        <div className="skeleton skeleton--media" />
      </div>
      <div className="pdp__info">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" style={{ width: "40%" }} />
        <div className="skeleton skeleton--price" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" style={{ width: "70%" }} />
        <div className="skeleton skeleton--block" />
      </div>
    </div>
  );
}
