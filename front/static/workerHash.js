self.importScripts("spark-md5.min.js");
self.onmessage = event => {
  const { chunks } = event.data;
  let count = 0,
    progress = 0;
  if (!chunks || chunks.length < 1) {
    return;
  }
  var spark = new self.SparkMD5.ArrayBuffer();
  loadNext();
  function loadNext() {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunks[count].file);
    reader.onload = function(e) {
      count++;
      spark.append(e.target.result);
      if (count < chunks.length) {
        self.postMessage({
          progress: (progress += 100 / chunks.length)
        });
        loadNext();
      } else {
        self.postMessage({
          hash: spark.end(),
          progress: 100
        });
      }
    };
  }
};
