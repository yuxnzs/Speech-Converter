// SpeechSynthesisUtterance 物件，表示要合成的語音內容
// 可以為這個物件設置文字內容、語音、語調等屬性
let speech = new SpeechSynthesisUtterance();

// 瀏覽器提供的 SpeechSynthesis 物件，代表語音合成的控制介面
// 可以通過這個物件來啟動語音合成、暫停、恢復、停止等操作
let synthController = window.speechSynthesis;

let voices = [];
let voiceSelect = document.querySelector("select");

let volumeRange = document.querySelector("#volume");
let volumeLabel = document.querySelector(".volume");
let speedRange = document.querySelector("#speed");
let speedLabel = document.querySelector(".speed");
let pitchRange = document.querySelector("#pitch");
let pitchLabel = document.querySelector(".pitch");

// input 為實時獲取使用者所移動之數值
volumeRange.addEventListener("input", () => {
  volumeLabel.innerHTML = "&emsp;" + volumeRange.value;
});

function getVolume() {
  return volumeRange.value;
}

speedRange.addEventListener("input", () => {
  speedLabel.innerHTML = "&emsp;" + speedRange.value;
});

function getSpeed() {
  return speedRange.value;
}

pitchRange.addEventListener("input", () => {
  pitchLabel.innerHTML = "&emsp;" + pitchRange.value;
});

function getPitch() {
  return pitchRange.value;
}

let voiceLoaded = false;
// 網頁初次加載時被觸發，於 <select> 內添加
synthController.onvoiceschanged = () => {
  // 返回一個陣列，陣列內有許多物件，每個物件內包含各種可用語言（該物件包含名稱、語音等）
  voices = synthController.getVoices();
  // 從返回的陣列中選擇預設語音
  speech.voice = voices[0];

  // 從 SpeechSynthesisUtterance 返回的語音陣列內容，新增至 <select> 選項中
  voices.forEach((voice, i) => {
    voiceSelect.options[i] = new Option(voice.name, i); // i 為 <select> 的 index
  });
  voiceLoaded = true;

  // 用於顯示上次關閉頁面時所選的選項
  const selectedVoice = localStorage.getItem("selectedVoice");
  if (selectedVoice !== null) {
    voiceSelect.value = selectedVoice;
    speech.voice = voices[selectedVoice];
  }

  // 初始化 Label 內值，避免瀏覽器紀錄上次 input 值，卻沒更新到 Label
  volumeLabel.innerHTML = "&emsp;" + volumeRange.value;
  speedLabel.innerHTML = "&emsp;" + speedRange.value;
  pitchLabel.innerHTML = "&emsp;" + pitchRange.value;
};

// 解決 Firefox 無法觸發 onvoiceschanged，改為手動觸發
if (navigator.userAgent.includes("Firefox")) {
  if (!voiceLoaded) {
    let e = new Event("voiceschanged");
    window.speechSynthesis.dispatchEvent(e);
  }
}

voiceSelect.addEventListener("change", () => {
  // 透過 voiceSelect.value 取得 <select> 內所被點選之 index
  // 並透過這個 index 從語音 voices 陣列選取語音來切換聲音
  speech.voice = voices[voiceSelect.value];
});

// 頁面關閉前保存語音、速度等紀錄
window.addEventListener("beforeunload", () => {
  // 如果關閉前還再播放，關閉
  if (synthController.speaking) {
    synthController.cancel();
  }

  // 儲存至 localStorage
  localStorage.setItem("selectedVoice", voiceSelect.value);
});

document.querySelector(".play").addEventListener("click", () => {
  cancelIfSpeaking();
  speakText();
});

document.querySelector(".pause").addEventListener("click", () => {
  controlSynth("pause");
});

document.querySelector(".resume").addEventListener("click", () => {
  controlSynth("resume");
});

document.querySelector(".stop").addEventListener("click", () => {
  cancelIfSpeaking();
});

function controlSynth(action) {
  if (synthController.speaking) {
    switch (action) {
      case "pause":
        synthController.pause();
        break;
      case "resume":
        synthController.resume();
        break;
      default:
        console.log("Unknown Action：", action);
    }
  }
}

function cancelIfSpeaking() {
  if (synthController.speaking) {
    synthController.cancel();
  }
}

function getText() {
  return document.querySelector("textarea").value;
}

function speakText() {
  speech.text = getText();
  speech.volume = getVolume();
  speech.rate = getSpeed();
  speech.pitch = getPitch();

  console.log(getText());
  console.log(getVolume());
  console.log(getSpeed());
  console.log(getPitch());
  synthController.speak(speech);
}
