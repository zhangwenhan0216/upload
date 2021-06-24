import React, { useState, useEffect } from "react";
import { List, message, Button } from "antd";
import InfiniteScroll from "react-infinite-scroller";

const baseUrl = "http://127.0.0.1:1235";

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
  const handleClick = async fileName => {
    try {
      setDownLoading(true);
      const res = await fetch(
        `${baseUrl}/file/download.do?fileName=${fileName}`
      ).then(res => res.json());
      setDownLoading(false);
      const { code, data, msg } = res || {};
      debugger;
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
                handleClick(item.file);
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
