import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InfoChangeModal from "./mypage_popup/InfoChangeModal";
import type { User, UserUpdateRequest } from "../../types/user";
import { updateMypageUser } from "../../api/fetchMypage";

const AlterInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const PageTitle = styled.h1`
  color: #351745;
  font-size: 2rem;
  position: absolute;
  top: 30px;
  left: 40px;
  margin: 0;
  padding: 0;
`;

const FormArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 80px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const Label = styled.label`
  color: #555;
  font-weight: normal;
  flex-shrink: 0;
  width: 150px;
  margin-right: 20px;
`;

const Input = styled.input<{ isEditing?: boolean }>`
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  outline: none;
  background: ${props => props.isEditing ? '#f3eef7' : 'rgba(217, 217, 217, 0.3)'};
  width: 480px;
  flex-shrink: 0;
  transition: background-color 0.2s;
  
  &:focus {
    background: ${props => props.isEditing ? '#e5e0ee' : 'rgba(217, 217, 217, 0.3)'};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 40px;
`;

const ChangeButton = styled.button`
  background-color: #480b6a;
  color: #fff;
  padding: 15px 40px;
  border: none;
  border-radius: 48px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #351745;
  }
`;

const AlterInfo: React.FC = () => {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [mypageUser, setMypageUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    user_name: '',
    user_phonenum: '',
    user_password: ''
  });

  const closeModal = () => {
    setShowChangeModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  async function fetchData() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! 상태: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 받은 데이터:", data);
      setMypageUser(data);
      setEditedData({
        user_name: data.user_name || '',
        user_phonenum: data.user_phonenum || '',
        user_password: ''
      });
      return data;
    } catch (error) {
      console.error("🚨 에러 발생:", error);
      throw error;
    }
  }

  const handleButtonClick = async () => {
    if (!isEditing) {
      // 편집 모드로 전환
      setIsEditing(true);
    } else {
      // 저장 모드 - DB에 저장
      try {
        const updateData: UserUpdateRequest = {
          user_name: editedData.user_name,
          user_phonenum: editedData.user_phonenum,
          user_password: editedData.user_password,
        };

        const result = await updateMypageUser(updateData);

        if (result) {
          console.log("✅ 정보 변경 성공:", result);
          setShowChangeModal(true);
          setIsEditing(false);
          // 데이터 새로고침
          await fetchData();
        } else {
          console.log("❌ 정보 변경 실패");
        }
      } catch (error) {
        console.error("정보 변경 중 오류:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AlterInfoWrapper>
      <PageTitle>내 정보 확인</PageTitle>
      <FormArea>
        <Container>
          <FormContainer>
            <InputGroup>
              <Label>이름</Label>
              <Input 
                type="text" 
                name="user_name"
                value={isEditing ? editedData.user_name : (mypageUser?.user_name || "")} 
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
              />
            </InputGroup>

            <InputGroup>
              <Label>이메일주소</Label>
              <Input type="email" value={mypageUser?.user_email || ""} readOnly />
            </InputGroup>

            <InputGroup>
              <Label>아이디</Label>
              <Input
                type="text"
                value={mypageUser?.user_login_id || ""}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="user_password"
                value={isEditing ? editedData.user_password : "****************"}
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
                placeholder={isEditing ? "새 비밀번호를 입력하세요" : ""}
              />
            </InputGroup>

            <InputGroup>
              <Label>휴대폰 번호</Label>
              <Input
                type="text"
                name="user_phonenum"
                value={isEditing ? editedData.user_phonenum : (mypageUser?.user_phonenum || "")}
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
              />
            </InputGroup>

            <InputGroup>
              <Label>소속 회사명</Label>
              <Input
                type="text"
                value={mypageUser?.company_name || ""}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>소속 부서명</Label>
              <Input
                type="text"
                value={mypageUser?.user_dept_name || ""}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>소속 팀명</Label>
              <Input
                type="text"
                value={mypageUser?.user_team_name || ""}
                readOnly
              />
            </InputGroup>

            <ButtonContainer>
              <ChangeButton onClick={handleButtonClick}>
                {isEditing ? "변경내용 저장" : "정보 변경하기"}
              </ChangeButton>
            </ButtonContainer>
          </FormContainer>
        </Container>
      </FormArea>

      {showChangeModal && (
        <InfoChangeModal
          onClose={closeModal}
          title="정보 변경이 완료되었습니다."
          description={
            <>
              관리자의 확인 후 변경된 정보가 적용됩니다.
              <br />
              정보 변경 결과는 등록하신 이메일로 안내드립니다.
            </>
          }
        />
      )}
    </AlterInfoWrapper>
  );
};

export default AlterInfo;
