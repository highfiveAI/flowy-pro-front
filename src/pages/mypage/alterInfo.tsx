import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InfoChangeModal from './mypage_popup/InfoChangeModal';
import type { User, UserUpdateRequest } from '../../types/user';
import { updateMypageUser } from '../../api/fetchMypage';

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
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px; /* 항목 간 간격 */
  width: 100%;
  max-width: 1000px; /* 폼 너비 조정 */
  padding: 20px;
  box-sizing: border-box;
  align-items: flex-start; /* FormContainer 내부 요소들을 좌측 정렬 */
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 입력란 박스들을 좌측 정렬 */
  width: 100%;
`;

const Label = styled.label`
  color: #555;
  font-weight: normal;
  flex-shrink: 0;
  width: 150px; /* 레이블 너비 고정 */
  margin-right: 20px; /* 레이블과 입력 필드 사이 간격 */
`;

const Input = styled.input`
  border: none; /* 테두리 제거 */
  padding: 10px 15px;
  font-size: 1rem;
  outline: none;
  background: rgba(217, 217, 217, 0.3);
  width: 480px; /* 모든 입력란의 가로폭을 동일하게 통일 */
  flex-shrink: 0; /* 입력란이 줄어들지 않도록 */
`;

const Button = styled.button`
  background-color: #480b6a;
  color: #fff;
  padding: 8px 15px; /* 버튼 패딩 조정 */
  border: none;
  border-radius: 48px; /* 버튼 테두리 반경 변경 */
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto; /* 버튼을 오른쪽으로 밀어냅니다 */
  flex-shrink: 0; /* 버튼이 줄어들지 않도록 */

  &:hover {
    background-color: #351745;
  }
`;

const AlterInfo: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [mypageUser, setMypageUser] = useState<User | null>(null);

  const handlePasswordChange = () => setShowPasswordModal(true);
  const handlePhoneChange = () => setShowPhoneModal(true);
  const handleDepartmentChange = () => setShowDepartmentModal(true);
  const handleTeamChange = () => setShowTeamModal(true);

  const closeModal = () => {
    setShowPasswordModal(false);
    setShowPhoneModal(false);
    setShowDepartmentModal(false);
    setShowTeamModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setMypageUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  async function fetchData() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // 필요 시 인증 토큰 등 추가
            // 'Authorization': `Bearer ${yourToken}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! 상태: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 받은 데이터:', data);
      setMypageUser(data);
      return data;
    } catch (error) {
      console.error('🚨 에러 발생:', error);
      throw error;
    }
  }

  const runUpdate = async <K extends keyof UserUpdateRequest>(
    fieldKey: K,
    fieldValue: UserUpdateRequest[K]
  ) => {
    const updateData: UserUpdateRequest = {
      [fieldKey]: fieldValue,
    };

    const result = await updateMypageUser(updateData);

    if (result) {
      console.log(`✅ ${fieldKey} 업데이트 성공:`, result);
    } else {
      console.log(`❌ ${fieldKey} 업데이트 실패`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AlterInfoWrapper>
      <PageTitle>내 정보 확인</PageTitle>
      <FormArea>
        <FormContainer>
          <InputGroup>
            <Label>이름</Label>
            <Input type="text" value={mypageUser?.user_name || ''} readOnly />
          </InputGroup>

          <InputGroup>
            <Label>이메일주소</Label>
            <Input type="email" value={mypageUser?.user_email || ''} readOnly />
          </InputGroup>

          <InputGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              value={mypageUser?.user_login_id || ''}
              readOnly
            />
          </InputGroup>

          {/* <InputGroup>
            <Label>비밀번호</Label>
            <Input type="password" value="************" readOnly />
            <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
          </InputGroup> */}

          <InputGroup>
            <Label>휴대폰 번호</Label>
            <Input
              type="text"
              name="user_phonenum"
              value={mypageUser?.user_phonenum || ''}
              onChange={handleChange}
            />
            <Button
              onClick={() => {
                runUpdate('user_phonenum', mypageUser?.user_phonenum);
                handlePhoneChange();
              }}
            >
              휴대폰 번호 변경
            </Button>
          </InputGroup>

          <InputGroup>
            <Label>소속 회사명</Label>
            <Input
              type="text"
              value={mypageUser?.company.company_name || ''}
              readOnly
            />
          </InputGroup>

          <InputGroup>
            <Label>소속 부서명</Label>
            <Input
              type="text"
              name="user_dept_name"
              value={mypageUser?.user_dept_name || ''}
              onChange={handleChange}
            />
            <Button
              onClick={() => {
                runUpdate('user_dept_name', mypageUser?.user_dept_name);
                handleDepartmentChange();
              }}
            >
              소속 부서 변경
            </Button>
          </InputGroup>

          <InputGroup>
            <Label>소속 팀명</Label>
            <Input
              type="text"
              name="user_team_name"
              value={mypageUser?.user_team_name || ''}
              onChange={handleChange}
            />
            <Button
              onClick={() => {
                runUpdate('user_team_name', mypageUser?.user_team_name);
                handleTeamChange();
              }}
            >
              소속 팀 변경
            </Button>
          </InputGroup>
        </FormContainer>
      </FormArea>

      {showPasswordModal && (
        <InfoChangeModal
          onClose={closeModal}
          title="비밀번호 변경이 완료되었습니다."
          description={
            <>변경된 비밀번호로 로그인하신 후 서비스를 이용해 주세요.</>
          }
        />
      )}

      {showPhoneModal && (
        <InfoChangeModal
          onClose={closeModal}
          title="연락처 변경이 완료되었습니다."
          description={<>변경된 정보는 마이페이지에서 확인하실 수 있습니다.</>}
        />
      )}

      {showDepartmentModal && (
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

      {showTeamModal && (
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
