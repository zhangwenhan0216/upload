import React, { useState, useEffect } from "react";
import { List, message, Button } from "antd";
import { download, saveAs } from "../utils/download";
import InfiniteScroll from "react-infinite-scroller";
import CONFIG from "../config";

const baseUrl = CONFIG.baseUrl;

export default function FileList() {
  const [loading, setLoading] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/file.do`).then(res => res.json());
        setLoading(false);
        const { code, data, msg } = res || {};
        if (code === 200) {
          setData(data);
          return;
        }
        message.error(msg);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleInfiniteOnLoad = () => {};

  const handleDownLoad = async fileName => {
    try {
      setDownLoading(true);
      console.log("多线程下载开始: " + +new Date());
      download({
        url: `${baseUrl}/file/download.do?fileName=${fileName}`,
        chunkSize: 1 * 1024 * 1024,
        poolLimit: 2,
      }).then(buffers => {
        setDownLoading(false);
        console.log("多线程下载结束: " + +new Date());
        saveAs({ buffers, name: fileName, mime: "video/mp4" });
      });
    } catch (error) {
      setDownLoading(false);
    }
  };
  return (
    <InfiniteScroll
      initialLoad={false}
      pageStart={0}
      loadMore={handleInfiniteOnLoad}
      hasMore={loading && hasMore}
      useWindow={false}
    >
      <List
        loading={loading}
        dataSource={data}
        renderItem={item => (
          <List.Item key={item.id}>
            <List.Item.Meta title={<div>{item.file}</div>} />
            <Button
              type="primary"
              loading={downLoading}
              onClick={() => {
                handleDownLoad(item.file);
              }}
            >
              下载文件
            </Button>
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
}
