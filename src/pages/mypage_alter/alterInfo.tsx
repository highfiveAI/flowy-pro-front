import React, { useEffect, useState } from 'react';
import type { User /*, UserUpdateRequest*/ } from '../../types/user';
import { fetchUserData, updateMypageUser } from '../../api/fetchMypage';
import InfoChangeModal from './mypage_popup/InfoChangeModal';
import {
  AlterInfoWrapper,
  ButtonContainer,
  ChangeButton,
  Container,
  FormArea,
  FormContainer,
  Input,
  InputGroup,
  Label,
  PageTitle,
} from './alterInfo.styles';

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

  // 변경내용 저장
  const handleButtonClick = async () => {
    if (!isEditing) {
      // 편집 모드로 진입할 때 기존 정보 세팅
      if (mypageUser) {
        setEditedData({
          user_name: mypageUser.user_name,
          user_phonenum: mypageUser.user_phonenum,
          user_password: '', // 새 비밀번호만 입력받도록 초기화
        });
      }
      setIsEditing(true);
      return;
    }

    // 편집 모드일 때만 API 호출
    try {
      const result = await updateMypageUser(editedData);
      const filteredUser =
        result && result.user
          ? {
              user_id: result.user.user_id,
              user_name: result.user.user_name,
              user_phonenum: result.user.user_phonenum,
            }
          : null;

      console.log('updateMypageUser 응답:', {
        message: result?.message,
        user: filteredUser,
      });

      if (result && result.user) {
        setIsEditing(false);
        alert('정보 변경 완료');
      } else {
        alert('정보 변경에 실패했습니다');
      }
    } catch (e) {
      alert('서버 오류가 발생했습니다');
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
  }, [isEditing]);

  return (
    <AlterInfoWrapper>
      <PageTitle>내 정보 확인</PageTitle>
      <FormArea>
        <Container>
          <FormContainer>
            <InputGroup>
              <Label>
                이름{' '}
                {isEditing && (
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    {' '}
                    (수정 가능)
                  </span>
                )}
              </Label>
              <Input
                type="text"
                name="user_name"
                value={
                  isEditing ? editedData.user_name : mypageUser?.user_name || ''
                }
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={!isEditing}
                placeholder={isEditing ? '새 이름을 입력하세요' : ''}
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
              <Label>
                비밀번호{' '}
                {isEditing && (
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    {' '}
                    (수정 가능)
                  </span>
                )}
              </Label>
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
              <Label>
                휴대폰 번호{' '}
                {isEditing && (
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>
                    {' '}
                    (수정 가능)
                  </span>
                )}
              </Label>
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
                placeholder={isEditing ? '휴대폰 번호를 입력하세요' : ''}
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
