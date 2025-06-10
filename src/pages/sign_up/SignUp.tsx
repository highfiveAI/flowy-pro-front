import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpSuccessModal from './SignUpSuccessModal';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: radial-gradient(
      100% 100% at 50% 0%,
      #e3cfee 0%,
      #a480b8 29.81%,
      #654477 51.92%,
      #351745 75.48%,
      #170222 93.75%
    ),
    #2e0446;
  min-height: 100vh;
  font-family: 'Rethink Sans', sans-serif;
`;

export const FormContainer = styled.div`
  background-color: white;
  padding: 40px 60px;
  border-radius: 35px;
  width: 100%;
  max-width: 533px;
  box-shadow: 5px 5px 4px 0px rgba(0, 0, 0, 0.2);
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #480b6a;
  margin-bottom: 40px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #c6c6c7;
  padding: 0 16px;
  height: 50px;
`;

export const Label = styled.label`
  width: 150px;
  flex-shrink: 0;
  margin-right: 20px;
  font-weight: 500;
  color: #333;
  font-size: 16px;
`;

export const StyledAsterisk = styled.span`
  color: #ed6e00;
  margin-left: 2px; /* Adjust as needed for spacing */
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: black;

  &::placeholder {
    color: #a0a0a0;
    font-size: 14px;
    font-weight: 400;
    text-align: right;
  }
`;

export const Select = styled.select`
  flex-grow: 1;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  color: black;

  &::placeholder {
    color: #a0a0a0;
    font-size: 14px;
    font-weight: 400;
    text-align: right;
  }
`;

export const SubmitButton = styled.button`
  height: 66px;
  border-radius: 8px;
  background-color: #480b6a;
  color: white;
  font-size: 18px;
  font-weight: 700;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #35084d;
  }
`;

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    company: '',
    department: '',
    team: '',
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            login_id: formData.username,
            password: formData.password,
            phone: formData.phone,
            company: formData.company,
            department: formData.department,
            team: formData.team,
            position: 'aaf44bda-6a64-4611-b0ca-4083b59c8e6e', // 더미 데이터
            job: '개발자',
            sysrole: 'c4cb5e53-617e-463f-8ddb-67252f9a9742', // 더미 데이터
            login_type: 'general',
          }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || '회원가입 실패');
        } else {
          throw new Error(
            response.statusText || '회원가입 실패: 서버 응답 오류'
          );
        }
      }

      setShowModal(true); // 회원가입 성공 시 모달 열기
    } catch (error: any) {
      console.error('error:', error);
      alert(`오류 발생: ${error.message}`);
    }
  };
  return (
    <>
      <Wrapper>
        <FormContainer>
          <Title>회원가입</Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>
                이름 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>
                이메일주소 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="email"
                type="email"
                placeholder="이메일을 입력하세요"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>
                핸드폰번호 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="phone"
                type="tel"
                placeholder="- 없이 숫자만 입력"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>
                아이디 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="username"
                type="text"
                placeholder="영문소문자/숫자, 6~16자"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>
                비밀번호 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="password"
                type="password"
                placeholder="영문+숫자+특수문자 조합, 8~16자"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>
                비밀번호 확인 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>
                소속 회사명 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Select name="company" required onChange={handleChange}>
                <option value="">선택</option>
                <option value="3db3ef9a-947e-4237-93da-d306b7bdb52d">
                  회사A
                </option>
                {/* <option value="회사B">회사B</option> */}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>소속 부서명</Label>
              <Input name="department" type="text" onChange={handleChange} />
            </InputGroup>
            <InputGroup>
              <Label>소속 팀명</Label>
              <Input name="team" type="text" onChange={handleChange} />
            </InputGroup>
            <SubmitButton type="submit">가입 완료</SubmitButton>
          </Form>
        </FormContainer>
      </Wrapper>
      {showModal && (
        <SignUpSuccessModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default SignUp;
