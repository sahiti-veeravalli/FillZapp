import { useEffect, useRef, useState, useCallback } from "react";
import CursorParticles from "@/components/CursorParticles";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const sections = ["hero", "how", "features", "footer"] as const;

const Index = () => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const touchStart = useRef(0);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= sections.length || isAnimating.current) return;
    isAnimating.current = true;
    setCurrent(index);
    setTimeout(() => {
      isAnimating.current = false;
    }, 900);
  }, []);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      if (e.deltaY > 30) goTo(current + 1);
      else if (e.deltaY < -30) goTo(current - 1);
    };

    const el = containerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goTo(current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(current - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(current + 1);
        else goTo(current - 1);
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [current, goTo]);

  // Handle nav link clicks
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = sections.indexOf(hash as typeof sections[number]);
      if (idx >= 0) goTo(idx);
    };

    // Listen for hash clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']");
      if (anchor) {
        e.preventDefault();
        const hash = anchor.getAttribute("href")?.replace("#", "") || "";
        const idx = sections.indexOf(hash as typeof sections[number]);
        if (idx >= 0) goTo(idx);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("click", handleClick);
    };
  }, [goTo]);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-background relative">
      <CursorParticles />
      <Navbar currentSection={current} onNavigate={goTo} />

      {/* Slide dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((s, i) => (
          <button
            key={s}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === current
                ? "bg-primary scale-125 shadow-lg shadow-primary/40"
                : "bg-border hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to ${s}`}
          />
        ))}
      </div>

      {/* Slides container */}
      <div
        className="transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: `translateY(-${current * 100}vh)` }}
      >
        <div className="h-screen flex items-center justify-center">
          <HeroSection />
        </div>
        <div className="h-screen flex items-center justify-center overflow-y-auto">
          <HowItWorks />
        </div>
        <div className="h-screen flex items-center justify-center overflow-y-auto">
          <FeaturesSection />
        </div>
        <div className="h-screen flex items-end">
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
