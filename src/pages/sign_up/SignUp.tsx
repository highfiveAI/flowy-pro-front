import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SignUpSuccessModal from "./SignUpSuccessModal";
import {
  checkDuplicate,
  fetchSignupInfos,
  type Company,
  type CompanyPosition,
  // type Sysrole,
} from "../../api/fetchSignupInfos";

export const SignUpWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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

export const ErrorText = styled.div`
  color: red;
  font-size: 13px;
  margin-bottom: 15px;
  margin-left: 170px;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 14px;
`;

const ErrorMessage = styled.span`
  color: red;
`;

const SuccessMessage = styled.span`
  color: green;
`;

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    company: "",
    position: "",
    department: "",
    team: "",
    job: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [positions, setPositions] = useState<CompanyPosition[]>([]);
  const [isDuplicate, setIsDuplicate] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // const [sysroles, setSysroles] = useState<Sysrole[]>([]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "이름을 입력해주세요.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }

    if (!formData.phone.match(/^\d+$/)) {
      newErrors.phone = "전화번호는 숫자만 입력해주세요.";
    }

    if (!formData.username.match(/^[a-z0-9]{6,16}$/)) {
      newErrors.username = "아이디는 영문 소문자와 숫자 조합 6~16자입니다.";
    }

    if (
      !formData.password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,16}$/
      )
    ) {
      newErrors.password =
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.company) newErrors.company = "회사를 선택해주세요.";

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "company") {
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
        position: "", // 직급 초기화
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            login_id: formData.username,
            password: formData.password,
            phone: formData.phone,
            company: formData.company,
            department: formData.department,
            team: formData.team,
            position: formData.position,
            job: formData.job,
            sysrole: "4864c9d2-7f9c-4862-9139-4e8b0ed117f4", // 일반 사원 데이터
            login_type: "general",
          }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || "회원가입 실패");
        } else {
          throw new Error(
            response.statusText || "회원가입 실패: 서버 응답 오류"
          );
        }
      }

      setShowModal(true); // 회원가입 성공 시 모달 열기
    } catch (error: any) {
      console.error("error:", error);
      alert(`오류 발생: ${error.message}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const result = await fetchSignupInfos();
        setCompanies(result.companies);
      } catch (err) {
        // 에러 처리
        console.error("회사 목록 로딩 실패:", err);
      }
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const usernameRegex = /^[a-z0-9]{6,16}$/;

      // 아이디 길이 + 유효성 조건 통과 시에만 중복 확인 요청
      if (
        formData.username.length > 2 &&
        usernameRegex.test(formData.username)
      ) {
        checkDuplicate(formData.username).then((result) =>
          setIsDuplicate(result)
        );
      } else {
        setIsDuplicate(null); // 유효하지 않으면 중복 결과 초기화
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.username]);

  return (
    <>
      <SignUpWrapper>
        <FormContainer>
          <Title>회원가입</Title>
          <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
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
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
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
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
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
            <MessageWrapper>
              {isDuplicate === true && (
                <ErrorMessage>이미 사용 중인 아이디입니다</ErrorMessage>
              )}
              {isDuplicate === false && (
                <SuccessMessage>사용 가능한 아이디입니다</SuccessMessage>
              )}
              {errors.username && (
                <ErrorMessage>{errors.username}</ErrorMessage>
              )}
            </MessageWrapper>
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
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
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
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
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
            {errors.company && <ErrorText>{errors.company}</ErrorText>}
            <InputGroup>
              <Label>소속 직급명</Label>
              <Select
                name="position"
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
      </SignUpWrapper>
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
