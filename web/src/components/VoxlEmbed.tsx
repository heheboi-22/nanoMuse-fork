/**
 * VoxlEmbed — live H.264 view of the real desktop Chrome (display :1) inside the
 * nanoMuse browser sidebar.
 *
 * Reuses voxl's own client.js/worker.js pointed at the voxl WebSocket. The iframe
 * is the cleanest embed (the client expects #surface/#screen/#kbd/#tools in its own
 * document). Take over / Done via our hold API stays the chat-side flow; inside the
 * iframe the user's clicks/keys go natively into the streamed desktop (60 fps).
 */
export function voxlUrl(): string {
  const host = (window as unknown as Record<string, string>)?.VOXL_URL ?? "https://voxl.nadif.dev";
  return `${host}?token=voxltest`;
}

export function VoxlEmbed() {
  return (
    <iframe
      src={voxlUrl()}
      title="Live browser"
      allow="fullscreen"
      style={{
        width: "100%",
        height: "calc(100dvh - 240px)",
        border: "0",
        borderRadius: 12,
        background: "#000",
        display: "block",
      }}
    />
  );
}
