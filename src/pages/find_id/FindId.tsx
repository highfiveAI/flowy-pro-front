import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchFindId, sendEmailCode, verifyCode } from '../../api/fetchFindId';

const Container = styled.div`
  max-width: 400px;
  margin: 60px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 10px 16px;
  margin: 8px 0;
  background-color: ${({ disabled }) => (disabled ? '#aaa' : '#007bff')};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 15px;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#aaa' : '#0056b3')};
  }
`;

const IdBox = styled.div`
  margin-top: 20px;
  font-weight: bold;
  font-size: 18px;
  color: green;
`;

const FindId: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [notFoundMsg, setNotFoundMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleEmailVerify = async () => {
    if (!email.includes('@')) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }

    setIsSending(true);
    try {
      await sendEmailCode(email);
      alert('인증 코드가 발송되었습니다.');
      setShowCodeInput(true);
    } catch (error: any) {
      alert(error.message || '이메일 전송 실패');
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeConfirm = async () => {
    if (code.length < 4) {
      alert('올바른 인증 코드를 입력해주세요.');
      return;
    }
    try {
      const result = await verifyCode(code);
      if (result.verified) {
        setIsVerified(true);
      } else {
        alert('인증이 실패했습니다.');
      }
    } catch (error: any) {
      alert(error.message || '인증 중 오류가 발생했습니다.');
    }
  };

  const handleFindId = async () => {
    try {
      const result = await fetchFindId(email);
      if (result.user_login_id) {
        setFoundId(result.user_login_id);
        setNotFoundMsg('');
      } else {
        setFoundId('');
        setNotFoundMsg('등록된 아이디가 없습니다.');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (isVerified) {
      handleFindId();
    }
  }, [isVerified]);

  return (
    <Container>
      <h2>아이디 찾기</h2>

      <Input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSending}
      />
      <Button onClick={handleEmailVerify} disabled={isSending}>
        {isSending ? '발송중...' : '이메일 인증'}
      </Button>

      {showCodeInput && (
        <>
          <Input
            type="text"
            placeholder="인증 코드 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleCodeConfirm} disabled={!code}>
            코드 확인
          </Button>
        </>
      )}

      {foundId && (
        <IdBox>
          아이디: <span>{foundId}</span>
        </IdBox>
      )}

      {notFoundMsg && <IdBox style={{ color: 'red' }}>{notFoundMsg}</IdBox>}
    </Container>
  );
};

export default FindId;
