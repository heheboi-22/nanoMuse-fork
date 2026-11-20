/**
 * LiveVnc — the browser as a real VNC view, not a picture.
 *
 * KasmVNC already streams display :1 (the desktop Chrome runs on) and forwards
 * pointer + keyboard events back as X events. The runtime proxies both the client
 * files (/vnc) and the RFB socket (/websockify), so the iframe is same-origin and
 * opens straight into the session — no login prompt, no capture loop.
 */
export function vncUrl(): string {
  const params = new URLSearchParams({
    autoconnect: "1",
    resize: "remote",
    reconnect: "1",
    path: "websockify",
    view_only: "0",
    show_dot: "0",
    password: "aorusvnc2026",
  });
  return `/vnc/vnc.html?${params.toString()}`;
}

export function LiveVnc({ className }: { className?: string }) {
  return (
    <iframe
      src={vncUrl()}
      title="Live desktop"
      allow="clipboard-read; clipboard-write; fullscreen"
      style={{ border: "0", display: "block", width: "100%", height: "100%", background: "#000" }}
      className={className}
    />
  );
}
