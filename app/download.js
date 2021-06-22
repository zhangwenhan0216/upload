/**
 * @description 获取大文件长度
 * @param {URL} url 请求地址
 * @returns {Number} 文件大小
 */
const getFileLength = url => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url);
    xhr.send();
    xhr.onload = () => {
      resolve(+xhr.getResponseHeader("Content-Length"));
    };
    xhr.onerror = reject;
  });
};

/**
 * @description 定义分批下载并发函数
 * @param {Number} poolLimit 每次分批数量
 * @param {Array} array 分批下载长度
 * @param {Promise} iteratorFn 执行函数
 * @returns {Promise} 所以执行任务的结果
 */
const asyncPool = async (poolLimit, array, iteratorFn) => {
  const ret = []; // 存储所有的异步任务
  const extcuting = []; // 存储正在执行的任务
  for (const item of array) {
    // 调用iteratorFn函数创建异步任务
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p); // 保存新的异步任务

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => extcuting.splice(extcuting.indexOf(e), 1));
      extcuting.push(e); // 保存正在执行的异步任务
      if (extcuting.length >= poolLimit) {
        await Promise.race(extcuting); // 等待较快的任务执行完成
      }
    }
  }
  return Promise.all(ret);
};
/**
 * @description  函数用于根据传入的参数发起范围请求，从而下载指定范围内的文件数据块：
 * @param {URL} url 请求地址
 * @param {Number} start 下载的文件快的开始位置
 * @param {Number} end 下载的文件快的结束位置
 * @param {Number} i 当前的批次
 * @returns {Promise} 当前的成功的数据和索引
 */
const getBinaryContent = (url, start, end, i) => {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      // 如果multipart属性为true则这个必须为true，否则将引发异常。
      xhr.open("GET", url, true);
      xhr.setRequestHeader("range", `bytes=${start}-${end}`); // 请求头上设置范围请求信息
      xhr.responseType = "arraybuffer"; // 设置返回的类型为arraybuffer
      xhr.onload = () => {
        resolve({
          index: i, // 文件块的索引
          buffer: xhr.response, // 范围请求对应的数据
        });
      };
      xhr.send();
    } catch (error) {
      reject(new Error(err));
    }
  });
};
/**
 * @description 合并已下载的文件数据块，
 * @param {Array} arrays 所有数据的Uint8Array对象数组
 * @returns {ArrayBuffer} 合并后的数据
 */
const concatenate = arrays => {
  if (!arrays.length) return null;
  // 所以下载的 arrayBuffer 的 length 总和
  const totalLength = arrays.reduce((acc, cur) => acc + cur.length, 0);
  let result = new Uint8Array(totalLength);
  let length = 0;
  for (const array of arrays) {
    result.set(array, length);
    length += array.length;
  }
  return result;
};
/**
 * @description 下载函数
 * @param {Object} url 请求地址 chunkSize 分批大小 bytes单位 chunkSize 分批大小 bytes单位
 * @returns {}
 */
const download = async ({ url, chunkSize, poolLimit = 1 }) => {
  const contentLength = await getFileLength(url);
  const chunks =
    typeof chunkSize === "number" ? Math.ceil(contentLength / chunkSize) : 1;
  const iteratorFn = i => {
    let start = i * chunkSize;
    let end = i + 1 == chunks ? contentLength - 1 : (i + 1) * chunkSize - 1;
    return getBinaryContent(url, start, end, i);
  };
  const results = await asyncPool(
    poolLimit,
    [...new Array(chunks).keys()],
    iteratorFn
  );
  const sortedBuffers = results.map(item => new Uint8Array(item.buffer));
  return concatenate(sortedBuffers);
};

/**
 * @description 文件下载的功能
 * @param {Object}
 */
const saveAs = ({ name, buffers, mime = "application/octet-stream" }) => {
  const blob = new Blob([buffers], { type: mime });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = name || Math.random();
  a.href = blobUrl;
  a.click();
  URL.revokeObjectURL(blob);
};

export { saveAs, download };
