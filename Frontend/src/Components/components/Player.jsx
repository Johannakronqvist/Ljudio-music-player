import React, { useEffect,useRef } from "react";

function Player({  onLoad, onStateChange }) {
  let player;

  useEffect(() => {
    onYouTubeIframeAPIReady();
  }, []);


  function onYouTubeIframeAPIReady() {
    player = new YT.Player("yt-player", {
      height: "0",
      width: "0",
      events: {
          onStateChange: onPlayerStateChange,
      },
    });
    onLoad(player)
  }

  // this function triggers when we change song in player
  // can be used to update things, like counters
  function onPlayerStateChange(event) {
   onStateChange(event)
  }

  return <div id="yt-player"></div>;
}

export default Player;
