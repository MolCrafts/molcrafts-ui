import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { PlaybackControls } from "@molcrafts/ui";

const noop = () => {};

const meta = {
  title: "UI/PlaybackControls",
  component: PlaybackControls,
  parameters: {
    docs: {
      description: {
        component:
          'import { PlaybackControls, PLAYBACK_SPEED_STEPS } from "@molcrafts/ui". Frame stepping, play/pause and a speed selector over `PLAYBACK_SPEED_STEPS`.',
      },
    },
  },
  args: {
    compact: false,
    isPlaying: false,
    speed: 1,
    onSpeedChange: noop,
    onFirstFrame: noop,
    onPreviousFrame: noop,
    onTogglePlayback: noop,
    onNextFrame: noop,
    onLastFrame: noop,
  },
  render: args => {
    const [isPlaying, setPlaying] = useState(args.isPlaying);
    const [speed, setSpeed] = useState(args.speed);
    return (
      <PlaybackControls
        {...args}
        isPlaying={isPlaying}
        speed={speed}
        onSpeedChange={setSpeed}
        onTogglePlayback={() => setPlaying(value => !value)}
      />
    );
  },
} satisfies Meta<typeof PlaybackControls>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Compact: Story = { args: { compact: true } };
export const Disabled: Story = { args: { disabled: true } };
