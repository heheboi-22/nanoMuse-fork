/**
 * VoxlEmbed — live H.264 view of the real desktop Chrome (display :1) inside the
 * nanoMuse browser sidebar. Clicks/keys inside the iframe land natively on the
 * streamed desktop (XTEST over WebSocket), so take-over is the real page at 60fps.
 */
export function voxlUrl(): string {
  // direct: voxl's own origin serves client.js/worker.js AND the /ws WebSocket.
  // The proxied /voxl path broke the ws handshake (different origin, wrong path).
  return "https://voxl.nadif.dev/?token=voxltest";
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
