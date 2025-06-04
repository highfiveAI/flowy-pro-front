import React, { useRef, useState } from "react";

const RecordUpload: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // 마이크 권한 요청 및 녹음 시작
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("이 브라우저는 마이크 녹음을 지원하지 않습니다.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      alert("마이크 권한이 필요합니다.");
    }
  };

  // 녹음 일시정지
  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
      setIsRecording(false);
    }
  };

  // 녹음 재개
  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
      setIsRecording(true);
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // 녹음 취소
  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      setAudioUrl(null);
      setAudioBlob(null);
      audioChunks.current = [];
    }
  };

  // 녹음 파일 다운로드
  const downloadRecording = () => {
    if (audioBlob) {
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recorded_audio.webm";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>실시간 음성 녹음</h2>
      <div style={{ marginBottom: "1rem" }}>
        {!isRecording && !isPaused && (
          <button onClick={startRecording} style={{ fontSize: 24, color: "red" }}>
            ● 녹음 시작
          </button>
        )}
        {isRecording && (
          <button onClick={pauseRecording} style={{ fontSize: 24 }}>
            ⏸️ 일시정지
          </button>
        )}
        {isPaused && (
          <button onClick={resumeRecording} style={{ fontSize: 24 }}>
            ▶️ 재개
          </button>
        )}
        {(isRecording || isPaused) && (
          <button onClick={stopRecording} style={{ fontSize: 24, marginLeft: 10 }}>
            ■ 녹음 완료
          </button>
        )}
        {(isRecording || isPaused) && (
          <button onClick={cancelRecording} style={{ fontSize: 24, marginLeft: 10, color: "gray" }}>
            ✖ 녹음 취소
          </button>
        )}
      </div>
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls style={{ width: "100%" }} />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={downloadRecording}>녹음 파일 다운로드</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordUpload; 