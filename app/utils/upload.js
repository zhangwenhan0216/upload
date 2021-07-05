import { asyncPool } from "./download";
import SparkMD5 from "spark-md5";
import CONFIG from "../config";
const baseUrl = CONFIG.baseUrl;

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
      resolve(JSON.parse(xhr.responseText)); // data.isExists = true 代表已经上传过
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

const uploadFile = async (file, { onSuccess, onError }) => {
  try {
    const fileMd5 = await calcFileMD5(file); // 计算文件的MD5
    const fileStatus = await checkFileExist(
      // 判断文件是否已存在
      baseUrl + "/upload/exists.do",
      file.name,
      fileMd5
    );
    let uploadResult;
    if (fileStatus.data && fileStatus.data.isExists) {
      onSuccess();
      return;
    } else {
      uploadResult = await upload({
        url: baseUrl + "/upload/single_upload.do",
        file, // 文件对象
        fileMd5, // 文件MD5值
        fileSize: file.size, // 文件大小
        chunkSize: 1 * 1024 * 1024, // 分块大小
        chunkIds: fileStatus.data.chunkIds, // 已上传的分块列表
        poolLimit: 3, // 限制的并发数
      });
    }
    // 判断是否都上传成功
    let flag = true;
    for (let i = 0; i < uploadResult.length; i++) {
      const item = JSON.parse(uploadResult[i]);
      if (item.code == 200) continue;
      flag = false;
    }

    // 文件已全部上传完成,可以进行合并文件
    if (flag) {
      await concatFiles(
        baseUrl + "/upload/concat_files.do",
        file.name,
        fileMd5
      );
      onSuccess();
      return;
    }
    // 部分未上传成功
    onError("部分未上传成功");
  } catch (error) {
    onError(error);
  }
};

export { uploadFile };
