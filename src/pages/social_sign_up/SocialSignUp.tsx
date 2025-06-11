import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SignUpSuccessModal from '../sign_up/SignUpSuccessModal';
import {
  fetchSignupInfos,
  type Company,
  type CompanyPosition,
} from '../../api/fetchSignupInfos';

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
  margin-left: 2px;
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

const SocialSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    // password: "",
    confirmPassword: '',
    company: '',
    department: '',
    position: '',
    team: '',
    job: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [positions, setPositions] = useState<CompanyPosition[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'company') {
      const selectedCompany = companies.find((c) => c.company_id === value);
      if (selectedCompany) {
        setPositions(selectedCompany.company_positions || []);
      } else {
        setPositions([]);
      }

      // 회사 변경 시 직급 초기화
      setFormData((prev) => ({
        ...prev,
        company: value,
        position: '', // 직급 초기화
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/social_signup`,
        // `/api/v1/users/social_signup`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // name: formData.name,
            // email: formData.email,
            login_id: formData.username,
            password: null,
            phone: formData.phone,
            company: formData.company,
            department: formData.department,
            team: formData.team,
            position: formData.position,
            job: formData.job,
            sysrole: '4864c9d2-7f9c-4862-9139-4e8b0ed117f4', // 일반 사원 데이터
            login_type: 'google',
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

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const result = await fetchSignupInfos();
        setCompanies(result.companies);
      } catch (err) {
        // 에러 처리
        console.error('회사 목록 로딩 실패:', err);
      }
    };

    loadCompanies();
  }, []);

  return (
    <>
      <Wrapper>
        <FormContainer>
          <Title>소셜 회원가입</Title>
          <Form onSubmit={handleSubmit}>
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
                소속 회사명 <StyledAsterisk>*</StyledAsterisk>
              </Label>
              <Select
                name="company"
                required
                onChange={handleChange}
                value={formData.company}
              >
                <option value="">회사 선택</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>소속 직급명</Label>
              <Select
                name="position"
                required
                onChange={handleChange}
                value={formData.position}
              >
                <option value="">직급 선택</option>
                {positions.map((pos) => (
                  <option key={pos.position_id} value={pos.position_id}>
                    {pos.position_name}
                  </option>
                ))}
              </Select>
            </InputGroup>
            <InputGroup>
              <Label>직업군</Label>
              <Input name="job" type="text" onChange={handleChange} />
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

export default SocialSignUp;
