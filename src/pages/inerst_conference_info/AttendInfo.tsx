import React from "react";

type Attendee = { name: string; email: string; role: string };

interface AttendInfoProps {
  subject: string;
  attendees: Attendee[];
  setSubject: (s: string) => void;
  setAttendees: (a: Attendee[]) => void;
}

const AttendInfo: React.FC<AttendInfoProps> = ({ subject, attendees, setSubject, setAttendees }) => {
  const handleAttendeeChange = (idx: number, field: string, value: string) => {
    const updated = [...attendees];
    updated[idx] = { ...updated[idx], [field]: value };
    setAttendees(updated);
  };

  const handleAddAttendee = () => {
    setAttendees([...attendees, { name: "", email: "", role: "" }]);
  };

  const handleRemoveAttendee = (idx: number) => {
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ margin: "2rem 0", textAlign: "left", width: 500 }}>
      <div style={{ marginBottom: "1rem" }}>
        <label>subject: </label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          style={{ width: "80%", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>
      <div>
        <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>참석자 정보</div>
        {attendees.map((att, idx) => (
          <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              placeholder="이름"
              value={att.name}
              onChange={e => handleAttendeeChange(idx, "name", e.target.value)}
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="email"
              placeholder="이메일"
              value={att.email}
              onChange={e => handleAttendeeChange(idx, "email", e.target.value)}
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="text"
              placeholder="역할"
              value={att.role}
              onChange={e => handleAttendeeChange(idx, "role", e.target.value)}
              style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            {attendees.length > 1 && (
              <button type="button" onClick={() => handleRemoveAttendee(idx)} style={{ background: "#dc3545", color: "white", border: "none", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}>삭제</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddAttendee} style={{ background: "#28a745", color: "white", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", marginTop: "0.5rem" }}>참석자 추가</button>
      </div>
    </div>
  );
};

export default AttendInfo; 