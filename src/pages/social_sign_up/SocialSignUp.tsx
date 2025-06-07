import React, { useState } from "react";
import styled from "styled-components";
import SignUpSuccessModal from "../sign_up/SignUpSuccessModal";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
  background: linear-gradient(to bottom, #bca0d6, #3d1454);
  min-height: 100vh;
`;

export const FormContainer = styled.div`
  background-color: white;
  padding: 3rem 2rem;
  border-radius: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #4a1168;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const Select = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const SubmitButton = styled.button`
  margin-top: 2rem;
  background-color: #4a1168;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #3a0d54;
  }
`;

const SocialSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    // password: "",
    confirmPassword: "",
    company: "",
    department: "",
    team: "",
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/social_signup`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // name: formData.name,
            // email: formData.email,
            login_id: formData.username,
            password: "none",
            phone: formData.phone,
            company: formData.company,
            department: formData.department,
            team: formData.team,
            position: "aaf44bda-6a64-4611-b0ca-4083b59c8e6e", // 더미 데이터
            job: "개발자",
            sysrole: "c4cb5e53-617e-463f-8ddb-67252f9a9742", // 더미 데이터
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입 실패");
      }

      setShowModal(true); // 회원가입 성공 시 모달 열기
    } catch (error: any) {
      console.error("error:", error);
      alert(`오류 발생: ${error.message}`);
    }
  };
  return (
    <>
      <Wrapper>
        <FormContainer>
          <Title>소셜 회원가입</Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>핸드폰번호 *</Label>
              <Input
                name="phone"
                type="tel"
                placeholder="- 없이 숫자만 입력"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>아이디 *</Label>
              <Input
                name="username"
                type="text"
                placeholder="영문소문자/숫자, 6~16자"
                required
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>소속 회사명 *</Label>
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
      <SignUpSuccessModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default SocialSignUp;
