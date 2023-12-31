self.importScripts("spark-md5.min.js");
self.onmessage = event => {
  let count = 0,
    progress = 0;
  const { chunks } = event.data;
  if (!chunks || chunks.length < 1) {
    return;
  }
  var spark = new self.SparkMD5.ArrayBuffer();
  const loadNext = () => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunks[count].file);
    reader.onload = e => {
      count++;
      spark.append(e.target.result);
      if (count === chunks.length) {
        self.postMessage({
          progress: 100,
          hash: spark.end()
        });
      } else if (count < chunks.length) {
        progress += 100 / chunks.length;
        self.postMessage({
          progress
        });
        loadNext( );
      }
    };
  };
  loadNext( );
};
