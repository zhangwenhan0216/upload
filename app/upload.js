import { asyncPool } from "./download";
import SparkMD5 from "spark-md5";

const calcFileMD5 = file => {
  return new Promise((resolve, reject) => {
    let chunkSize = 2097152, // 2M
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

    fileReader.onload = e => {
      spark.append(e.target.result);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };
    fileReader.onerror = e => {
      reject(fileReader.error);
      fileReader.abort();
    };

    const loadNext = () => {
      let start = currentChunk * chunkSize,
        end = Math.min(start + chunkSize, file.size);
      fileReader.readAsArrayBuffer(file.slice(start, end));
    };

    loadNext();
  });
};

const checkFileExist = (url, name, md5) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}?name=${name}&md5=${md5}`);
    xhr.onload = () => {
      resolve(xhr.responseText); // data.isExists = true 代表已经上传过
    };
    xhr.onerror = reject;
    xhr.send();
  });
};

const upload = ({
  url,
  file,
  fileMd5,
  fileSize,
  chunkSize, // 请求判断当前批次是否上传，返回当前的批次数
  chunkIds,
  poolLimit = 1,
}) => {
  const chunks =
    typeof chunkSize === "number" ? Math.ceil(fileSize / chunkSize) : 1;
  const iteratorFn = i => {
    // i 当前分批数
    if (chunkIds.indexOf(i + "") !== -1) {
      // 已上传的分块直接跳过
      return Promise.resolve();
    }
    let start = i * chunkSize;
    let end = i + 1 == chunks ? fileSize : (i + 1) * chunkSize;
    const chunk = file.slice(start, end); // 对文件进行切割
    return uploadChunk({
      url,
      chunk,
      chunkIndex: i,
      fileMd5,
      fileName: file.name,
    });
  };
  return asyncPool(poolLimit, [...new Array(chunks).keys()], iteratorFn);
};

const uploadChunk = ({ url, chunk, chunkIndex, fileMd5, fileName }) => {
  let formData = new FormData();
  formData.set("file", chunk, fileMd5 + "-" + chunkIndex);
  formData.set("name", fileName);
  formData.set("timestamp", Date.now());
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onload = () => {
      resolve(xhr.responseText); // data.isExists = true 代表已经上传过
    };
    xhr.onerror = reject;
    xhr.send(formData);
  });
};

const concatFiles = (url, name, md5) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}?name=${name}&md5=${md5}`);
    xhr.onload = () => {
      resolve(xhr.responseText);
    };
    xhr.onerror = reject;
    xhr.send();
  });
};

const uploadFile = async file => {
  const fileMd5 = await calcFileMD5(file); // 计算文件的MD5
  const fileStatus = await checkFileExist(
    // 判断文件是否已存在
    "/exists",
    file.name,
    fileMd5
  );
  if (fileStatus.data && fileStatus.data.isExists) {
    alert("文件已上传[秒传]");
    return;
  } else {
    await upload({
      url: "/single",
      file, // 文件对象
      fileMd5, // 文件MD5值
      fileSize: file.size, // 文件大小
      chunkSize: 1 * 1024 * 1024, // 分块大小
      chunkIds: fileStatus.data.chunkIds, // 已上传的分块列表
      poolLimit: 3, // 限制的并发数
    });
  }
  await concatFiles("/concatFiles", file.name, fileMd5);
};

export { uploadFile };
