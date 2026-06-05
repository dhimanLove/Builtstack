import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerPlayButton,
  VideoPlayerTimeRange,
  VideoPlayerMuteButton,
} from "@/components/v1/skiper67";

const VideoPlayerExample = () => {
  return (
    <VideoPlayer style={{ width: "100%", height: "100%" }}>
      <VideoPlayerContent
        src="/showreel/skiper-ui-showreel.mp4"
        autoPlay
        slot="media"
        className="w-full object-cover"
      />
      <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full max-w-7xl -translate-x-1/2 items-center justify-center px-5">
        <VideoPlayerPlayButton className="h-4 bg-transparent" />
        <VideoPlayerTimeRange className="bg-transparent" />
        <VideoPlayerMuteButton className="size-4 bg-transparent" />
      </VideoPlayerControlBar>
    </VideoPlayer>
  );
};

export default VideoPlayerExample;
