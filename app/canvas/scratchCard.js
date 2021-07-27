import React, { useEffect } from "react";
import "./scratchCard.css";

export default function SratchCard() {
  let canvasRef;
  useEffect(() => {
    const ctx = canvasRef.getContext("2d");
    ctx.fillStyle = "darkgray";
    ctx.fillRect(0, 0, 400, 100);
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText("刮刮卡", 200, 50);

    let isDray = false;
    canvasRef.onmousedown = () => {
      isDray = true;
    };
    canvasRef.onmousemove = e => {
      if (!isDray) return;
      const x = e.pageX - canvasRef.offsetLeft;
      const y = e.pageY - canvasRef.offsetTop;
      ctx.globalCompositeOperation = "destination-out";
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    };
    canvasRef.onmouseup = () => {
      isDray = false;
    };
  });

  return (
    <div className="scratch-card">
      <canvas
        ref={ref => {
          canvasRef = ref;
        }}
        width="400px"
        height="100px"
      ></canvas>
      <div className="scratch-text">中奖了1000万</div>
    </div>
  );
}
