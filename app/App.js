import React, { useEffect, useState } from "react";
import { Button } from "antd";
import "antd/dist/antd.css";
import "./index.css";
import { download, saveAs } from "./download";
import { uploadFile } from "./upload";

function App() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="app">
      <Button
        type="primary"
        size="large"
        block
        loading={loading}
        onClick={() => {
          this.handleClick();
        }}
      >
        上传文件
      </Button>
      <input
        ref={el => (this.inputRef = el)}
        style={{ display: "none" }}
        type="file"
        onChange={e => {
          this.upload(e);
        }}
      />
    </div>
  );
}
// class App extends React.Component {
//   state = {
//     loading: false,
//   };
//   handleDownLoad() {
//     console.log("多线程下载开始: " + +new Date());
//     download({
//       url: "",
//       chunkSize: 0.1 * 1024 * 1024,
//       poolLimit: 6,
//     }).then(buffers => {
//       console.log("多线程下载结束: " + +new Date());
//       saveAs({ buffers, name: "我的压缩包", mime: "application/zip" });
//     });
//   }
//   handleClick() {
//     this.setState({ loading: true });
//     this.inputRef.click();
//   }
//   upload(e) {
//     uploadFile(e.target.files[0]);
//   }
//   render() {
//     const { loading } = this.state;
//     return (
//       <div className="app">
//         <Button
//           type="primary"
//           size="large"
//           block
//           loading={loading}
//           onClick={() => {
//             this.handleClick();
//           }}
//         >
//           上传文件
//         </Button>
//         <input
//           ref={el => (this.inputRef = el)}
//           style={{ display: "none" }}
//           type="file"
//           onChange={e => {
//             this.upload(e);
//           }}
//         />
//       </div>
//     );
//   }
// }

export default App;
