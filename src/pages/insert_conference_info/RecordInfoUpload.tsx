import React, { useRef, useState } from "react";
import styled from "styled-components";
import RecordIcon from "/images/record.svg";

const ButtonGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button<{ color?: string }>`
  font-size: 1rem;
  color: white;
  background-color: ${({ color }) =>
    color === "red" ? "transparent" : color || "#6a0dad"};
  border: none;
  border-radius: 8px;
  padding: ${({ color }) => (color === "red" ? "0" : "10px 18px")};
  cursor: pointer;

  &:hover {
    background-color: ${({ color }) => {
      if (color === "red") return "transparent";
      if (color === "gray") return "#6c757d";
      return "#5a099a";
    }};
    opacity: ${({ color }) => (color === "red" ? "0.8" : "1")};
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: 1rem;
`;

const DownloadButton = styled.button`
  margin-top: 1rem;
  padding: 8px 18px;
  background-color: #6a0dad; /* InsertConferenceInfo.tsx의 버튼 색상 */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5a099a;
  }
`;

interface RecordUploadProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const RecordInfoUpload: React.FC<RecordUploadProps> = ({ setFile }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const audioChunks = useRef<Blob[]>([]);

  // 날짜+시간 파일명 생성 함수
  const getCurrentFileName = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    return `${year}.${month}.${day} ${hour}:${min}.webm`;
  };

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
        const name = getCurrentFileName();
        setFileName(name);
        // Blob을 File로 변환해서 setFile로 부모에 전달
        const file = new File([blob], name, { type: "audio/webm" });
        setFile(file);
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

  // 녹음 중지 (파일만 생성)
  const stopRecording = async () => {
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
      setFileName("");
      setFile(null);
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
      a.download = fileName || "recorded_audio.webm";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <ButtonGroup>
        {!isRecording && !isPaused && !audioBlob && (
          <Button color="red" onClick={startRecording}>
            <img src={RecordIcon} alt="녹음 시작" />
          </Button>
        )}
        {isRecording && <Button onClick={pauseRecording}>⏸️ 일시정지</Button>}
        {isPaused && <Button onClick={resumeRecording}>▶️ 재개</Button>}
        {(isRecording || isPaused) && (
          <Button onClick={stopRecording}>■ 녹음 완료</Button>
        )}
        {(isRecording || isPaused) && (
          <Button color="gray" onClick={cancelRecording}>
            ✖ 녹음 취소
          </Button>
        )}
      </ButtonGroup>
      {audioUrl && (
        <div>
          <div
            style={{
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#351745",
            }}
          >
            파일명: {fileName}
          </div>
          <AudioPlayer src={audioUrl} controls />
          <DownloadButton onClick={downloadRecording}>
            녹음 파일 다운로드
          </DownloadButton>
        </div>
      )}
    </div>
  );
};

export default RecordInfoUpload;
