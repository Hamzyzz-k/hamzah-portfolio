import type { ReactNode } from 'react';

import { useTypewriter } from '../hooks/useTypewriter';

interface Props {
  /** Who is talking — drawn as a tab on top of the box. */
  speaker?: string;
  lines: string[];
  active?: boolean;
  speed?: number;
  children?: ReactNode;
  className?: string;
  /** When given, the box gets a close button that calls this. */
  onClose?: () => void;
}

/**
 * The RPG text box. Types its lines out, shows the little blinking advance
 * arrow when it finishes, and lets a click skip to the end.
 */
export default function DialogueBox({
  speaker,
  lines,
  active = true,
  speed = 24,
  children,
  className = '',
  onClose,
}: Props) {
  const { text, done, finish } = useTypewriter(lines, active, speed);

  return (
    <div
      className={`dialogue ${className}`}
      onClick={finish}
      role={done ? undefined : 'button'}
      tabIndex={done ? undefined : 0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') finish();
      }}
      aria-label={done ? undefined : 'Skip typing'}
    >
      {speaker && <span className="dialogue__speaker">{speaker}</span>}
      {onClose && (
        <button
          type="button"
          className="dialogue__close"
          aria-label="Close"
          // The box itself skips the typewriter on click, which would other-
          // wise swallow this one.
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      )}
      <p className="dialogue__text">
        {text}
        {!done && <span className="dialogue__caret" />}
      </p>
      {children}
      {done && <span className="dialogue__advance" aria-hidden="true" />}
    </div>
  );
}
