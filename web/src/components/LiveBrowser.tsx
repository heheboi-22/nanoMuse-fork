/**
 * LiveBrowser — the agent's real browser as a live stream (Chrome's own CDP
 * screencast, served as MJPEG from our origin). One <img>; the server pushes a
 * frame every time the page paints, so it moves like the screen.
 *
 * Take-over input rides the existing /control API: tap = CDP mouse click at the
 * same fractional point, keys = CDP keyboard, so typing lands on the page itself.
 */
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { getToken } from "../api";
import { signedParams } from "../ticket";

/** The MJPEG endpoint, signed like any other inline resource. */
export function liveStreamUrl(thread: string): string {
  const token = getToken();
  const path = `/api/browser/${encodeURIComponent(thread)}/live.mjpeg`;
  return token ? `${path}?${signedParams(token, path)}` : path;
}

export interface LiveBrowserProps {
  thread: string;
  title?: string;
  interactive?: boolean;
  onTap?: (x: number, y: number) => void;
  onScroll?: (dy: number) => void;
  className?: string;
}

export function LiveBrowser({ thread, title, interactive, onTap, onScroll, className }: LiveBrowserProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [gone, setGone] = useState(false);

  // an <img> keeps the multipart response open; remount it after an error
  useEffect(() => {
    setLoaded(false);
    setGone(false);
    const t = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(t);
  }, [thread]);

  const pointFrom = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return [Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1)] as const;
  };

  return (
    <div className={className}>
      {gone ? (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-1 text-muted">
          <span className="text-[12.5px]">The live view stopped.</span>
          <button
            type="button"
            onClick={() => {
              setGone(false);
              setLoaded(false);
              if (imgRef.current) imgRef.current.src = liveStreamUrl(thread) + `&r=${Date.now()}`;
            }}
            className="text-accent text-[13px] font-medium"
          >
            Reconnect
          </button>
        </div>
      ) : (
        /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
        <img
          ref={imgRef}
          src={liveStreamUrl(thread)}
          alt={title ?? "Live browser"}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setGone(true)}
          onClick={(e) => {
            if (!interactive || !onTap) return;
            const [x, y] = pointFrom(e);
            onTap(x, y);
          }}
          onWheel={(e) => {
            if (!interactive || !onScroll) return;
            e.preventDefault();
            onScroll(e.deltaY);
          }}
          className={
            "block w-full select-none rounded-2xl border border-border bg-black " +
            (interactive ? "cursor-crosshair " : "") +
            (loaded ? "" : "opacity-70")
          }
        />
      )}
    </div>
  );
}
