import React, { useState } from "react";
import { Button, message } from "antd";
import "antd/dist/antd.css";
import "./index.css";
import { uploadFile } from "./utils/upload";
import Progress from "./Progress";
import FileList from "./FileList";
import CanvasClock from "./canvas/time";
import ScratchCard from "./canvas/scratchCard";
import "./utils";

function App() {
  let inputRef;
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    inputRef.click();
  };
  const upload = e => {
    const file = e.target.files[0];
    setLoading(true);
    uploadFile(file, {
      onSuccess: () => {
        setLoading(false);
        message.success("上传成功");
      },
      onError: (err = "上传失败") => {
        message.error(err);
        setLoading(false);
      },
    });
  };
  return (
    <div className="app">
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={handleClick}
      >
        上传文件
      </Button>
      <input
        ref={el => (inputRef = el)}
        style={{ display: "none" }}
        type="file"
        onChange={upload}
      />
      <Progress />
      <FileList />
      <CanvasClock />
      <ScratchCard />
    </div>
  );
}

export default App;
