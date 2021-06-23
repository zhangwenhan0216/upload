import React, { useState } from "react";
import "./index.css";

let totalTime = 3000; // 假设视频播放为3s

export default function Progress() {
  const [isPlay, setIsPlay] = useState(false);
  const [type, setType] = useState(0); // 0重播动画
  const [count, setCount] = useState(0);

  const handleVideo = () => {
    setIsPlay(!isPlay);
  };
  const replay = () => {
    setIsPlay(true);
    setType(type ? 0 : 1);
  };
  const end = () => {
    setCount(count + 1);
    replay();
  };
  return (
    <div>
      <button onClick={handleVideo}>{isPlay ? "暂停" : "播放"}</button>
      <button onClick={replay}>重播</button>
      <span>{`播放次数为：${count}`}</span>
      <div className="container">
        <div
          className={`progress ${isPlay ? "play" : "pause"}`}
          style={{
            animationDuration: `${totalTime}ms`,
            animationName: type ? "replay" : "play",
          }}
          onAnimationEnd={end}
        />
      </div>
    </div>
  );
}
