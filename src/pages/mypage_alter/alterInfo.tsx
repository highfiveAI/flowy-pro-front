const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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

import React, { useEffect, useState } from 'react';
import type { User /*, UserUpdateRequest*/ } from '../../types/user';
import { fetchUserData /*, updateMypageUser*/ } from '../../api/fetchMypage';
import InfoChangeModal from './mypage_popup/InfoChangeModal';
import {
  AlterInfoWrapper,
  FormArea,
  FormContainer,
  Input,
  InputGroup,
  Label,
  PageTitle,
} from './alterInfo.styles';
import styled from 'styled-components';

const AlterInfo: React.FC = () => {
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [mypageUser, setMypageUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    user_name: '',
    user_phonenum: '',
    user_password: '',
  });

  const closeModal = () => {
    setShowChangeModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // async function fetchData() {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/api/v1/users/one`,
  //       {
  //         method: 'GET',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! 상태: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log('📦 받은 데이터:', data);
  //     setMypageUser(data);
  //     setEditedData({
  //       user_name: data.user_name || '',
  //       user_phonenum: data.user_phonenum || '',
  //       user_password: '',
  //     });
  //     return data;
  //   } catch (error) {
  //     console.error('🚨 에러 발생:', error);
  //     throw error;
  //   }
  // }

  // 변경내용 저장
  const handleButtonClick = async () => {
    if (!isEditing) {
      // 편집 모드로만 전환하고, 함수 종료!
      setIsEditing(true);
      return;
    }

    // 편집 모드일 때만 API 호출
    try {
      const result = await updateMypageUser(editedData); // 이 API에서 모든 처리
      // user 객체에서 user_id, user_name, user_phonenum만 추출해서 새 객체로 출력
      const filteredUser = result && result.user ? {
        user_id: result.user.user_id,
        user_name: result.user.user_name,
        user_phonenum: result.user.user_phonenum,
      } : null;
      console.log('updateMypageUser 응답:', {
        message: result?.message,
        user: filteredUser
      });
      if (result && result.user) {
        alert('정보 변경 완료');
        // 모달 닫기 등
      } else {
        alert('정보 변경에 실패했습니다');
      }
    } catch (e) {
      alert('서버 오류가 발생했습니다');
    }
  };

  // const runUpdate = async <K extends keyof UserUpdateRequest>(
  //   fieldKey: K,
  //   fieldValue: UserUpdateRequest[K]
  // ) => {
  //   const updateData: UserUpdateRequest = {
  //     [fieldKey]: fieldValue,
  //   };

  //   const result = await updateMypageUser(updateData);

  //   if (result) {
  //     console.log(`✅ ${fieldKey} 업데이트 성공:`, result);
  //   } else {
  //     // 저장 모드 - DB에 저장
  //     try {
  //       const updateData: UserUpdateRequest = {
  //         user_name: editedData.user_name,
  //         user_phonenum: editedData.user_phonenum,
  //         user_password: editedData.user_password,
  //       };

  //       const result = await updateMypageUser(updateData);

  //       if (result) {
  //         console.log('✅ 정보 변경 성공:', result);
  //         setShowChangeModal(true);
  //         setIsEditing(false);
  //         // 데이터 새로고침
  //         await fetchData();
  //       } else {
  //         console.log('❌ 정보 변경 실패');
  //       }
  //     } catch (error) {
  //       console.error('정보 변경 중 오류:', error);
  //     }
  //   }
  // };

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
        <Container>
          <FormContainer>
            <InputGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="user_name"
                value={
                  isEditing ? editedData.user_name : mypageUser?.user_name || ''
                }
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
              />
            </InputGroup>

            <InputGroup>
              <Label>이메일주소</Label>
              <Input
                type="email"
                value={mypageUser?.user_email || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>아이디</Label>
              <Input
                type="text"
                value={mypageUser?.user_login_id || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="user_password"
                value={
                  isEditing ? editedData.user_password : '****************'
                }
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
                placeholder={isEditing ? '새 비밀번호를 입력하세요' : ''}
              />
            </InputGroup>

            <InputGroup>
              <Label>휴대폰 번호</Label>
              <Input
                type="text"
                name="user_phonenum"
                value={
                  isEditing
                    ? editedData.user_phonenum
                    : mypageUser?.user_phonenum || ''
                }
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
              />
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
                value={mypageUser?.user_dept_name || ''}
                readOnly
              />
            </InputGroup>

            <InputGroup>
              <Label>소속 팀명</Label>
              <Input
                type="text"
                value={mypageUser?.user_team_name || ''}
                readOnly
              />
            </InputGroup>

            <ButtonContainer>
              <ChangeButton onClick={handleButtonClick}>
                {isEditing ? '변경내용 저장' : '정보 변경하기'}
              </ChangeButton>
            </ButtonContainer>
          </FormContainer>
        </Container>

        {/* <InputGroup>
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
        </FormContainer> */}
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
