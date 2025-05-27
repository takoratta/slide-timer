document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
  
    function getMode() {
      return document.querySelector('input[name="mode"]:checked').value;
    }
    function getPosition() {
      return document.querySelector('input[name="position"]:checked').value;
    }
    function getSize() {
      return document.querySelector('input[name="size"]:checked').value;
    }
  
    startBtn.onclick = async () => {
      const mode = getMode();
      const mins = parseInt(document.getElementById("minutes").value, 10) || 0;
      const secs = parseInt(document.getElementById("seconds").value, 10) || 0;
      const alarmEnabled = document.getElementById("alarm-toggle").checked;
      if (secs < 0 || secs > 59) {
        alert("秒数は 0〜59 の範囲で指定してください。");
        return;
      }
      const durationSec = mins * 60 + secs;
      const position = getPosition();
      const size = getSize();
  
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: (mode, durationSec, position, size, alarmEnabled) => {
          if (!document.getElementById("shake-style")) {
            const style = document.createElement("style");
            style.id = "shake-style";
            style.textContent = `
              @keyframes shake {
                0% { transform: translate(0, 0); }
                25% { transform: translate(4px, 0); }
                50% { transform: translate(-4px, 0); }
                75% { transform: translate(4px, 0); }
                100% { transform: translate(0, 0); }
              }
              .shake {
                animation: shake 0.1s infinite;
              }
            `;
            document.head.appendChild(style);
          }
  
          const existingContainer = document.getElementById("slide-timer-container");
          const existingOverlay = document.getElementById("slide-timer-overlay");
          if (existingContainer) existingContainer.remove();
          if (existingOverlay) existingOverlay.remove();
  
          const sizeMap = {
            normal: "30px",
            large: "48px",
            xlarge: "72px"
          };
  
          const baseStyle = {
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "6px 12px",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: sizeMap[size] || "30px",
            pointerEvents: "none"
          };
  
          const div = document.createElement("div");
          div.id = "slide-timer-overlay";
          div.textContent = "00:00";
          Object.assign(div.style, baseStyle);
  
          if (position === "center") {
            const container = document.createElement("div");
            container.id = "slide-timer-container";
            Object.assign(container.style, {
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "999999",
              pointerEvents: "none"
            });
            container.appendChild(div);
            document.body.appendChild(container);
          } else {
            Object.assign(div.style, {
              position: "fixed",
              zIndex: "999999",
              pointerEvents: "none"
            });
  
            const posMap = {
              "top-right": { top: "10px", right: "20px" },
              "top-left": { top: "10px", left: "20px" },
              "bottom-left": { bottom: "10px", left: "20px" },
              "bottom-right": { bottom: "10px", right: "20px" }
            };
  
            Object.assign(div.style, posMap[position] || {});
            document.body.appendChild(div);
          }
  
          const startTime = Date.now();
          window.slideTimerStopped = false;
          window.slideTimerInterval = setInterval(() => {
            if (window.slideTimerStopped) return;
  
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            let time;
  
            if (mode === "countup") {
              time = elapsed;
              div.style.color = "white";
            } else if (mode === "countdown") {
              time = Math.max(0, durationSec - elapsed);
              div.style.color = "white";
            } else if (mode === "countdown-over") {
              if (elapsed <= durationSec) {
                time = durationSec - elapsed;
                div.style.color = "white";
              } else {
                time = elapsed - durationSec;
                div.style.color = "red";
              }
            }
  
            const min = String(Math.floor(time / 60)).padStart(2, "0");
            const sec = String(time % 60).padStart(2, "0");
            div.textContent = `${min}:${sec}`;
  
            if (!window.slideTimerStopped && (mode === "countdown" || mode === "countdown-over") && elapsed === durationSec) {
              if (alarmEnabled) {
                const audio = new Audio(chrome.runtime.getURL("alarm.mp3"));
                audio.play();
              }
              div.classList.add("shake");
              setTimeout(() => {
                div.classList.remove("shake");
              }, 5000);
            }
          }, 1000);
        },
        args: [mode, durationSec, position, size, alarmEnabled]
      });
    };
  
    stopBtn.onclick = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => {
          window.slideTimerStopped = true;
          const container = document.getElementById("slide-timer-container");
          const overlay = document.getElementById("slide-timer-overlay");
          if (window.slideTimerInterval) {
            clearInterval(window.slideTimerInterval);
            window.slideTimerInterval = null;
          }
          if (container) container.remove();
          if (overlay) overlay.remove();
        }
      });
    };
  
    document.querySelectorAll('input[name="mode"]').forEach((el) => {
      el.addEventListener("change", () => {
        document.getElementById("countdown-settings").classList.toggle(
          "hidden",
          getMode() === "countup"
        );
      });
    });
  });
  