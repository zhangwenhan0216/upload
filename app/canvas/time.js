import React, { useState, useEffect } from "react";

export default function CanvasClock() {
  let canvasRef;
  useEffect(() => {
    init();
  });
  const init = () => {
    const ctx = canvasRef.getContext("2d");
    setInterval(() => {
      ctx.save();
      ctx.clearRect(0, 0, 600, 600);
      ctx.translate(300, 300); // 设置中心点，此时300，300变成了坐标的0，0
      ctx.save();
      // 画外成圆
      ctx.beginPath();
      //arc(x, y, radius, startAngle, endAngle, anticlockwise)
      //画一个以（x,y）为圆心的以radius为半径的圆弧（圆），
      //从startAngle开始到endAngle结束，
      //按照anticlockwise给定的方向（默认为顺时针）来生成。
      ctx.arc(0, 0, 100, 0, 2 * Math.PI, true);
      ctx.stroke();
      ctx.closePath();
      // 画内圆
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, 2 * Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      const time = new Date();
      const hour = time.getHours() % 12;
      const min = time.getMinutes();
      const sen = time.getSeconds();

      //
      ctx.rotate(
        ((2 * Math.PI) / 12) * hour +
          ((2 * Math.PI) / 12) * (min / 60) -
          Math.PI / 2
      );
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(40, 0);
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.closePath();
      // 恢复成上一次save的状态
      ctx.restore();
      // 恢复完再保存一次
      ctx.save();

      ctx.rotate(
        ((2 * Math.PI) / 60) * min +
          ((2 * Math.PI) / 60) * (sen / 60) -
          Math.PI / 2
      );
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(60, 0);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "blue";
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
      ctx.save();

      ctx.rotate(((2 * Math.PI) / 60) * sen - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(80, 0);
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
      ctx.save();

      for (let i = 1; i <= 60; i++) {
        if (i % 5 == 0) {
          ctx.lineWidth = 5;
        } else {
          ctx.lineWidth = 1;
        }
        console.log("ctx.lineWidth", ctx.lineWidth);
        ctx.rotate((2 * Math.PI) / 60);
        ctx.beginPath();
        ctx.moveTo(90, 0);
        ctx.lineTo(100, 0);
        ctx.stroke();
        ctx.closePath();
      }
      ctx.restore();
      ctx.save();
      ctx.restore();
      ctx.restore();
    }, 1000);
  };
  return (
    <canvas
      width="600px"
      height="600px"
      ref={ref => {
        console.log("ref", ref);
        canvasRef = ref;
      }}
    ></canvas>
  );
}
