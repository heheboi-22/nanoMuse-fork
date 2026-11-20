/**
 * VoxlEmbed — live H.264 view of the real desktop Chrome (display :1) inside the
 * nanoMuse browser sidebar. Clicks/keys inside the iframe land natively on the
 * streamed desktop (XTEST over WebSocket), so take-over is the real page at 60fps.
 */
export function voxlUrl(): string {
  // same-origin proxy served by the runtime (CSS-injected, no cross-origin issues)
  return `/voxl?token=voxltest`;
}

export function VoxlEmbed({ compact }: { compact?: boolean }) {
  return (
    <iframe
      src={voxlUrl()}
      title="Live browser"
      allow="fullscreen"
      style={{
        width: "100%",
        height: compact ? "240px" : "calc(100dvh - 250px)",
        border: "0",
        borderRadius: 12,
        background: "#000",
        display: "block",
      }}
    />
  );
}
