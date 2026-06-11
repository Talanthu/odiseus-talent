"use client";
import { useEffect, useRef } from "react";

export default function GlowButton({
  href,
  children,
  variant = "dark",
  className = "",
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const raw = getComputedStyle(ref.current).borderRadius;
    const rx = raw.split(" ")[0];
    ref.current.querySelectorAll("rect").forEach((rect) => {
      rect.setAttribute("rx", rx);
    });
  }, []);

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={ref}
      href={href}
      className={`glow-btn glow-btn--${variant}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
      <svg className="glow-btn__svg" aria-hidden="true">
        <rect
          pathLength="100"
          strokeLinecap="round"
          className="glow-btn__blur"
        />
        <rect
          pathLength="100"
          strokeLinecap="round"
          className="glow-btn__line"
        />
      </svg>
    </Tag>
  );
}
