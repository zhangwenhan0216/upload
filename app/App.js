import React, { useState } from "react";
import { Button, message } from "antd";
import "antd/dist/antd.css";
import "./index.css";
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
    uploadFile(e.target.files[0], {
      onSuccess: () => message.success("上传成功"),
      onError: () => {
        message.error("上传失败");
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
    </div>
  );
}

export default App;
