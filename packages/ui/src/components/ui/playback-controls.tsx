import {
  NextFrameRegular,
  NextRegular,
  PauseRegular,
  PlayRegular,
  PreviousFrameRegular,
  PreviousRegular,
} from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { Button } from "./button";

export const PLAYBACK_SPEED_STEPS = [0.125, 0.25, 0.5, 1, 2, 4, 8] as const;

export interface PlaybackControlsProps {
  compact: boolean;
  isPlaying: boolean;
  disabled?: boolean;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onFirstFrame: () => void;
  onPreviousFrame: () => void;
  onTogglePlayback: () => void;
  onNextFrame: () => void;
  onLastFrame: () => void;
  lastFrameLabel?: string;
  playLabel?: string;
  pauseLabel?: string;
}

function TransportButton({
  label,
  disabled,
  onClick,
  children,
  primary = false,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Button
      variant={primary ? "default" : "ghost"}
      size="icon-sm"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function formatSpeedLabel(speed: number): string {
  if (speed < 1) return `${speed.toString().replace(/^0/, "")}×`;
  return `${speed}×`;
}

function nextSpeed(current: number): number {
  const steps = PLAYBACK_SPEED_STEPS as readonly number[];
  const index = steps.indexOf(current);
  if (index < 0) return 1;
  return steps[(index + 1) % steps.length] ?? 1;
}

/** Transport row. The product owns the frame index and the clock. */
export function PlaybackControls({
  compact,
  isPlaying,
  disabled = false,
  speed,
  onSpeedChange,
  onFirstFrame,
  onPreviousFrame,
  onTogglePlayback,
  onNextFrame,
  onLastFrame,
  lastFrameLabel = "Last frame",
  playLabel = "Play",
  pauseLabel = "Pause",
}: PlaybackControlsProps) {
  const speedLabel = formatSpeedLabel(speed);
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {compact ? null : (
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          aria-label={`Playback speed ${speedLabel}. Click to change.`}
          title={`Speed ${speedLabel} — click to cycle`}
          onClick={() => onSpeedChange(nextSpeed(speed))}
          className="min-w-8 px-1.5 font-mono text-micro font-normal tabular-nums"
        >
          {speedLabel}
        </Button>
      )}
      {compact ? null : (
        <TransportButton label="First frame" disabled={disabled} onClick={onFirstFrame}>
          <PreviousRegular />
        </TransportButton>
      )}
      <TransportButton label="Previous frame" disabled={disabled} onClick={onPreviousFrame}>
        <PreviousFrameRegular />
      </TransportButton>
      <TransportButton
        label={isPlaying ? pauseLabel : playLabel}
        disabled={disabled && !isPlaying}
        onClick={onTogglePlayback}
        primary
      >
        {isPlaying ? <PauseRegular /> : <PlayRegular />}
      </TransportButton>
      <TransportButton label="Next frame" disabled={disabled} onClick={onNextFrame}>
        <NextFrameRegular />
      </TransportButton>
      {compact ? null : (
        <TransportButton label={lastFrameLabel} disabled={disabled} onClick={onLastFrame}>
          <NextRegular />
        </TransportButton>
      )}
    </div>
  );
}
