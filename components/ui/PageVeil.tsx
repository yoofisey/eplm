"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function PageVeil() {
  const router = useRouter();
  const pathname = usePathname();
  const veilRef = useRef<HTMLDivElement>(null);
  const state = useRef({ path: pathname, timer: 0 });

  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;

    const cover = () => {
      veil.classList.remove("page-veil--open");
      veil.classList.add("page-veil--cover");
      veil.style.pointerEvents = "auto";
    };
    const reveal = () => {
      veil.classList.remove("page-veil--cover");
      veil.classList.add("page-veil--open");
      veil.style.pointerEvents = "none";
    };
    const clearTimer = () => {
      if (state.current.timer) {
        window.clearTimeout(state.current.timer);
        state.current.timer = 0;
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as Node | null;
      const anchor =
        target?.nodeType === Node.ELEMENT_NODE
          ? (target as HTMLElement).closest("a")
          : null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      const rel = anchor.getAttribute("rel");
      if (rel && rel.includes("external")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === pathname) return;

      e.preventDefault();
      state.current.path = url.pathname;
      clearTimer();
      cover();
      state.current.timer = window.setTimeout(() => {
        state.current.timer = 0;
        router.push(url.pathname + url.search + url.hash);
        window.setTimeout(reveal, 650);
      }, 240);
    };

    window.addEventListener("click", onClickCapture, true);
    return () => {
      window.removeEventListener("click", onClickCapture, true);
      clearTimer();
    };
  }, [pathname, router]);

  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;

    const cover = () => {
      veil.classList.remove("page-veil--open");
      veil.classList.add("page-veil--cover");
      veil.style.pointerEvents = "auto";
    };
    const reveal = () => {
      veil.classList.remove("page-veil--cover");
      veil.classList.add("page-veil--open");
      veil.style.pointerEvents = "none";
    };

    if (pathname === state.current.path) {
      if (veil.classList.contains("page-veil--cover")) {
        window.setTimeout(reveal, 30);
      }
      return;
    }

    state.current.path = pathname;
    cover();
    window.setTimeout(reveal, 200);
  }, [pathname]);

  return (
    <div className="page-veil" aria-hidden="true">
      <span className="page-veil__mark">E</span>
    </div>
  );
}