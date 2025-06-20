import React, { useEffect, useState } from 'react';
import type { User, UserUpdateRequest } from '../../types/user';
import { fetchUserData, updateMypageUser } from '../../api/fetchMypage';
import InfoChangeModal from './mypage_popup/InfoChangeModal';
import {
  AlterInfoWrapper,
  Button,
  FormArea,
  FormContainer,
  Input,
  InputGroup,
  Label,
  PageTitle,
} from './alterInfo.styles';

const AlterInfo: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [mypageUser, setMypageUser] = useState<User | null>(null);

  // const handlePasswordChange = () => setShowPasswordModal(true);
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
    const getUser = async () => {
      try {
        const data = await fetchUserData();
        setMypageUser(data);
      } catch (err) {
        console.error('🚨 사용자 데이터 로딩 실패:', err);
      }
    };

    getUser();
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
              value={mypageUser?.company_name || ''}
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
