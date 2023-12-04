// 選擇DOM元素
const recordBtn = document.querySelector(".record"), // 錄音按鈕
  result = document.querySelector(".result"), // 顯示識別結果的區域
  downloadBtn = document.querySelector(".download"), // 下載按鈕
  inputLanguage = document.querySelector("#language"), // 語言選擇下拉框
  clearBtn = document.querySelector(".clear"); // 清除按鈕

// 語音識別相關變數
let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition, // 獲取瀏覽器支持的語音識別對象
  recognition,
  recording = false;

// 用於填充語言選擇下拉框的函數
function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

// 在頁面加載時調用函數填充語言選擇下拉框
populateLanguages();

// 啟動語音識別的函數
function speechToText() {
  try {
    // 初始化語音識別對象
    recognition = new SpeechRecognition();
    recognition.lang = inputLanguage.value; // 設置語音識別語言
    recognition.interimResults = true; // 獲取中間結果

    // 更新UI以顯示錄音狀態
    recordBtn.classList.add("recording");
    recordBtn.querySelector("p").innerHTML = "正在聽...";

    // 啟動語音識別
    recognition.start();

    // 語音識別結果的事件處理
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;

      // 當識別結果是最終結果時
      if (event.results[0].isFinal) {
        // 將最終結果追加到顯示區域
        result.innerHTML += " " + speechResult;
        // 移除中間結果的段落
        result.querySelector("p").remove();
      } else {
        // 如果中間結果的段落不存在，則創建一個
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        // 更新中間結果的段落
        document.querySelector(".interim").innerHTML = " " + speechResult;
      }

      // 啟用下載按鈕
      downloadBtn.disabled = false;
    };

    // 語音結束事件處理
    recognition.onspeechend = () => {
      // 語音結束後繼續語音識別
      speechToText();
    };

    // 語音識別錯誤事件處理
    recognition.onerror = (event) => {
      // 停止錄音
      stopRecording();

      // 處理不同類型的錯誤
      if (event.error === "no-speech") {
        alert("未檢測到語音。停止錄音...");
      } else if (event.error === "audio-capture") {
        alert("未找到麥克風。請確保安裝了麥克風。");
      } else if (event.error === "not-allowed") {
        alert("麥克風使用權限被拒絕。");
      } else if (event.error === "aborted") {
        alert("錄音已停止。");
      } else {
        alert("語音識別發生錯誤: " + event.error);
      }
    };
  } catch (error) {
    // 初始化時捕獲和處理任何錯誤
    recording = false;
    console.log(error);
  }
}

// 錄音按鈕點擊事件監聽器
recordBtn.addEventListener("click", () => {
  if (!recording) {
    // 如果沒有在錄音，則開始錄音
    speechToText();
    recording = true;
  } else {
    // 如果已在錄音，則停止錄音
    stopRecording();
  }
});

// 停止錄音的函數
function stopRecording() {
  recognition.stop();

  // 更新UI以顯示停止錄音狀態
  recordBtn.querySelector("p").innerHTML = "開始聽";
  recordBtn.classList.remove("recording");
  recording = false;
}

// 下載識別文本的函數
function download() {
  const text = result.innerText;
  const filename = "speech.txt";

  // 創建下載鏈接並觸發下載
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// 下載按鈕點擊事件監聽器
downloadBtn.addEventListener("click", download);

// 清除按鈕點擊事件監聽器
clearBtn.addEventListener("click", () => {
  // 清空顯示區域並禁用下載按鈕
  result.innerHTML = "";
  downloadBtn.disabled = true;
});


