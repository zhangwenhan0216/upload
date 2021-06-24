import React, { useState } from "react";
import { Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";
import { download, saveAs } from "./download";
import { uploadFile } from "./upload";
import Progress from "./Progress";
import FileList from "./FileList";

function App() {
  let inputRef;
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    inputRef.click();
  };
  const upload = e => {
    uploadFile(e.target.files[0]);
  };
  const handleDownLoad = () => {
    console.log("多线程下载开始: " + +new Date());
    download({
      url: "",
      chunkSize: 0.1 * 1024 * 1024,
      poolLimit: 6,
    }).then(buffers => {
      console.log("多线程下载结束: " + +new Date());
      saveAs({ buffers, name: "我的压缩包", mime: "application/zip" });
    });
  };
  return (
    <div className="app">
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={() => {
          handleClick();
        }}
      >
        上传文件
      </Button>
      <input
        ref={el => (inputRef = el)}
        style={{ display: "none" }}
        type="file"
        onChange={e => {
          upload(e);
        }}
      />
      <Progress />
      <FileList />
    </div>
  );
}

export default App;
