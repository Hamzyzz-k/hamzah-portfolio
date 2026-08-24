import { useEffect, useRef, useState } from 'react';

import { useSound } from '../hooks/useSound';

interface Props {
  /** The raw value to copy — a URL, phone number, or email address. */
  value: string;
  label: string;
}

/**
 * Small pixel copy-to-clipboard button. Falls back to a hidden-textarea +
 * execCommand copy for browsers/contexts where the async Clipboard API is
 * unavailable, and never throws into the page if both fail.
 */
export default function CopyButton({ value, label }: Props) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }

    if (ok) {
      play('select');
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button
      type="button"
      className={`copy-btn ${copied ? 'is-copied' : ''}`}
      onClick={copy}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
    >
      {copied ? '✓' : '⧉'}
    </button>
  );
}
