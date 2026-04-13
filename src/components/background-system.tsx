'use client';

/**
 * BackgroundSystem - Botanical Clay ambient background
 * 
 * Renders floating blobs and paper grain texture overlay
 * that creates the warm, tactile foundation of the design system.
 */
export function BackgroundSystem() {
  return (
    <>
      {/* Ambient Background Blobs */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Primary orange soft blob - top left */}
        <div 
          className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-primary-soft/30 blur-3xl animate-clay-float" 
        />
        {/* Sage green blob - right side */}
        <div 
          className="absolute top-[30%] -right-[10%] h-[55vh] w-[55vh] rounded-full bg-accent/25 blur-3xl animate-clay-float-delayed" 
        />
        {/* Warm ochre blob - bottom */}
        <div 
          className="absolute -bottom-[10%] left-[20%] h-[50vh] w-[50vh] rounded-full bg-tertiary/25 blur-3xl animate-clay-float-slow" 
        />
      </div>

      {/* Paper Grain Texture Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
