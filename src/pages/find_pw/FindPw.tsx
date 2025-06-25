// PasswordReset.tsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom'; // ✅ 추가
import {
  fetchChangePassword,
  sendEmailCode,
  verifyCodeWithUserLoginIdAndPw,
} from '../../api/fetchFindId';

export const ErrorText = styled.div`
  color: red;
  font-size: 13px;
  margin-bottom: 15px;
  margin-left: 170px;
`;

export const Container = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 32px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 480px) {
    margin: 40px 16px;
    padding: 24px;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
`;

export const Step = styled.div`
  margin-bottom: 32px;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 8px;
  display: block;
  color: #555;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin: 8px 0 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.15);
  }
`;

export const Button = styled.button<{ color?: string }>`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  background-color: ${({ color }) => color || '#4caf50'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:enabled {
    background-color: ${({ color }) =>
      color === '#2196f3' ? '#1976d2' : '#45a049'};
  }

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
`;

const FindPw: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userLoginId, setUserLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchParams] = useSearchParams();
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId');
    const emailFromUrl = searchParams.get('email');

    if (userIdFromUrl && emailFromUrl) {
      setUserLoginId(userIdFromUrl);
      setEmail(emailFromUrl);
      setStep(2);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !newPassword.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/
      )
    ) {
      newErrors.newPassword =
        '비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.';
    }

    if (newPassword !== checkPassword) {
      newErrors.checkPassword = '비밀번호가 일치하지 않습니다.';
    }
    return newErrors;
  };

  const handleFindPw = async () => {
    if (!email.includes('@')) {
      alert('이메일 형식을 확인해주세요.');
      return;
    }

    setIsSending(true); // 시작

    try {
      await sendEmailCode(email);
      alert('인증 코드가 발송되었습니다.');
      navigate(
        `?userId=${encodeURIComponent(userLoginId)}&email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error: any) {
      if (error.message.includes('이메일 전송 중 오류')) {
        alert('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      } else {
        alert(error.message || '알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSending(false); // 종료
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 4) {
      alert('올바른 인증 코드를 입력해주세요.');
      return;
    }

    try {
      const result = await verifyCodeWithUserLoginIdAndPw({
        user_login_id: userLoginId,
        email,
        input_code: code,
      });

      if (result.verified) {
        alert('인증이 성공했습니다.');
        setStep(3);
      } else {
        alert('인증이 실패했습니다.');
      }
    } catch (error: any) {
      alert(error.message || '인증 중 오류가 발생했습니다.');
    }
  };

  const handleChangePassword = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetchChangePassword({
        new_password: newPassword,
      });

      // 성공한 경우에만 실행
      setErrors({});
      alert(res.message);
      window.location.replace('/login');
    } catch (error: any) {
      alert(error.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>

      {step === 1 && (
        <Step>
          <Label>아이디</Label>
          <Input
            type="text"
            placeholder="아이디 입력"
            value={userLoginId}
            onChange={(e) => setUserLoginId(e.target.value)}
          />
          <Label>이메일</Label>
          <Input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button onClick={handleFindPw} color="#2196f3" disabled={isSending}>
            {isSending ? '발송중...' : '인증 코드 발송'}
          </Button>
        </Step>
      )}

      {step === 2 && (
        <Step>
          <p>
            <strong>{email}</strong>로 인증코드를 보냈습니다.
          </p>
          <Label>인증코드</Label>
          <Input
            type="text"
            placeholder="인증코드 입력"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleVerifyCode} disabled={!code}>
            인증 확인
          </Button>
          <Button onClick={handleFindPw} color="#2196f3" disabled={isSending}>
            {isSending ? '발송중...' : '인증 코드 재발송'}
          </Button>
        </Step>
      )}

      {step === 3 && (
        <Step>
          <Label>새 비밀번호</Label>
          <Input
            type="password"
            placeholder="영문+숫자+특수문자 조합, 8~16자"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && <ErrorText>{errors.newPassword}</ErrorText>}
          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            required
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          {errors.checkPassword && (
            <ErrorText>{errors.checkPassword}</ErrorText>
          )}
          <Button onClick={handleChangePassword} disabled={!newPassword}>
            비밀번호 변경
          </Button>
        </Step>
      )}
    </Container>
  );
};

export default FindPw;
