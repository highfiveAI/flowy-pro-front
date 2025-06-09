import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Container와 MainContent 스타일 유지
const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background-color: #f7f7f7;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 2rem;
`;

// 새로운 스타일 컴포넌트 추가
const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
        font-size: 1.5rem;
        color: #333;
    }
`;

const FilterSection = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const FilterSelect = styled.select`
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    min-width: 120px;
`;

const UserTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }

    th {
        background-color: #f8fafc;
        color: #64748b;
        font-weight: 500;
        white-space: nowrap;
    }

    tbody tr:hover {
        background-color: #f8fafc;
    }
`;

const StatusBadge = styled.span<{ status: string }>`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    
    &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 0.5rem;
    }

    ${props => {
        switch (props.status.toLowerCase()) {
            case 'approved':
                return `
                    background-color: #dcfce7;
                    color: #15803d;
                    &::before { background-color: #15803d; }
                `;
            case 'pending':
                return `
                    background-color: #fef9c3;
                    color: #854d0e;
                    &::before { background-color: #854d0e; }
                `;
            case 'rejected':
                return `
                    background-color: #fee2e2;
                    color: #dc2626;
                    &::before { background-color: #dc2626; }
                `;
            default:
                return `
                    background-color: #e2e8f0;
                    color: #64748b;
                    &::before { background-color: #64748b; }
                `;
        }
    }}
`;

// 기존 Form 관련 스타일 유지
const Form = styled.form`
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;

        &:focus {
            outline: none;
            border-color: #007bff;
        }
    }
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' }>`
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    margin-right: 0.5rem;
    background-color: ${props => props.variant === 'danger' ? '#dc3545' : '#007bff'};
    color: white;

    &:hover {
        opacity: 0.9;
    }
`;

// 기존 인터페이스 유지
interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_login_id: string;
    user_phonenum: string;
    user_dept_name: string;
    user_team_name: string;
    user_jobname: string;
    user_company_id: string;
    user_position_id: string;
    user_sysrole_id: string;
    status?: string; // 상태 필드 추가
}

const CreateButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background-color: #0056b3;
    }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
        margin: 0;
        font-size: 1.5rem;
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    color: #666;

    &:hover {
        color: #333;
    }
`;

const EditSection = styled.div<{ $isVisible: boolean }>`
    display: ${props => props.$isVisible ? 'block' : 'none'};
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AdminUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('HDX');
    const [selectedLevel, setSelectedLevel] = useState('최신순');
    
    // 모달 상태 관리
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // 폼 데이터 초기 상태
    const initialFormData = {
        user_name: '',
        user_email: '',
        user_login_id: '',
        user_password: '',
        user_phonenum: '',
        user_dept_name: '',
        user_team_name: '',
        user_jobname: '',
        user_company_id: '',
        user_position_id: '',
        user_sysrole_id: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // 기존 API 호출 함수들 유지
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('사용자 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchUsers();
                setFormData(initialFormData);
            }
        } catch (error) {
            console.error('사용자 생성 실패:', error);
        }
    };

    const handleUpdate = async (userId: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchUsers();
                setSelectedUserId(null);
            }
        } catch (error) {
            console.error('사용자 수정 실패:', error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error('사용자 삭제 실패:', error);
            }
        }
    };

    const handleCreateClick = () => {
        setFormData(initialFormData);
        setIsCreateModalOpen(true);
    };

    const handleRowClick = (user: User) => {
        setSelectedUserId(user.user_id);
        setFormData({
            user_name: user.user_name,
            user_email: user.user_email,
            user_login_id: user.user_login_id,
            user_password: '',
            user_phonenum: user.user_phonenum,
            user_dept_name: user.user_dept_name || '',
            user_team_name: user.user_team_name || '',
            user_jobname: user.user_jobname || '',
            user_company_id: user.user_company_id || '',
            user_position_id: user.user_position_id || '',
            user_sysrole_id: user.user_sysrole_id || '',
        });
        setIsEditModalOpen(true);
    };

    return (
        <Container>
            <MainContent>
                <PageHeader>
                    <h1>사용자 관리</h1>
                    <CreateButton onClick={handleCreateClick}>
                        + 새 사용자 생성
                    </CreateButton>
                </PageHeader>

                <FilterSection>
                    <FilterSelect 
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="HDX">HDX</option>
                    </FilterSelect>

                    <FilterSelect
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        <option value="최신순">최신순</option>
                    </FilterSelect>
                </FilterSection>

                <UserTable>
                    <thead>
                        <tr>
                            <th>Requested ID</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>소속 부서명</th>
                            <th>소속 팀명</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr 
                                key={user.user_id}
                                onClick={() => handleRowClick(user)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{user.user_id}</td>
                                <td>{user.user_login_id}</td>
                                <td>{user.user_name}</td>
                                <td>{user.user_dept_name}</td>
                                <td>{user.user_team_name}</td>
                                <td>
                                    <StatusBadge status={user.status || 'pending'}>
                                        {user.status || 'Pending'}
                                    </StatusBadge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </UserTable>

                {/* 생성 모달 */}
                <Modal $isOpen={isCreateModalOpen}>
                    <ModalContent>
                        <ModalHeader>
                            <h2>새 사용자 생성</h2>
                            <button onClick={() => setIsCreateModalOpen(false)}>×</button>
                        </ModalHeader>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(e);
                            setIsCreateModalOpen(false);
                        }}>
                            <FormGroup>
                                <label>이름</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>이메일</label>
                                <input
                                    type="email"
                                    name="user_email"
                                    value={formData.user_email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>로그인 ID</label>
                                <input
                                    type="text"
                                    name="user_login_id"
                                    value={formData.user_login_id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>비밀번호</label>
                                <input
                                    type="password"
                                    name="user_password"
                                    value={formData.user_password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>전화번호</label>
                                <input
                                    type="tel"
                                    name="user_phonenum"
                                    value={formData.user_phonenum}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>회사</label>
                                <input
                                    type="text"
                                    name="user_company_id"
                                    value={formData.user_company_id}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>직급</label>
                                <input
                                    type="text"
                                    name="user_position_id"
                                    value={formData.user_position_id}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>시스템 역할</label>
                                <input
                                    type="text"
                                    name="user_sysrole_id"
                                    value={formData.user_sysrole_id}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>부서명</label>
                                <input
                                    type="text"
                                    name="user_dept_name"
                                    value={formData.user_dept_name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>팀명</label>
                                <input
                                    type="text"
                                    name="user_team_name"
                                    value={formData.user_team_name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>직무</label>
                                <input
                                    type="text"
                                    name="user_jobname"
                                    value={formData.user_jobname}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="submit">생성</Button>
                                <Button type="button" onClick={() => setIsCreateModalOpen(false)}>
                                    취소
                                </Button>
                            </div>
                        </Form>
                    </ModalContent>
                </Modal>

                {/* 수정 모달 */}
                <Modal $isOpen={isEditModalOpen}>
                    <ModalContent>
                        <ModalHeader>
                            <h2>사용자 정보 수정</h2>
                            <button onClick={() => setIsEditModalOpen(false)}>×</button>
                        </ModalHeader>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            if (selectedUserId) {
                                handleUpdate(selectedUserId);
                                setIsEditModalOpen(false);
                            }
                        }}>
                            <FormGroup>
                                <label>이름</label>
                                <input
                                    type="text"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>이메일</label>
                                <input
                                    type="email"
                                    name="user_email"
                                    value={formData.user_email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>로그인 ID</label>
                                <input
                                    type="text"
                                    name="user_login_id"
                                    value={formData.user_login_id}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>비밀번호</label>
                                <input
                                    type="password"
                                    name="user_password"
                                    value={formData.user_password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>전화번호</label>
                                <input
                                    type="tel"
                                    name="user_phonenum"
                                    value={formData.user_phonenum}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>회사</label>
                                <input
                                    type="text"
                                    name="user_company_id"
                                    value={formData.user_company_id}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>직급</label>
                                <input
                                    type="text"
                                    name="user_position_id"
                                    value={formData.user_position_id}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>시스템 역할</label>
                                <input
                                    type="text"
                                    name="user_sysrole_id"
                                    value={formData.user_sysrole_id}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>부서명</label>
                                <input
                                    type="text"
                                    name="user_dept_name"
                                    value={formData.user_dept_name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>팀명</label>
                                <input
                                    type="text"
                                    name="user_team_name"
                                    value={formData.user_team_name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>직무</label>
                                <input
                                    type="text"
                                    name="user_jobname"
                                    value={formData.user_jobname}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="submit">수정</Button>
                                <Button 
                                    type="button" 
                                    variant="danger"
                                    onClick={() => {
                                        if (selectedUserId) {
                                            handleDelete(selectedUserId);
                                            setIsEditModalOpen(false);
                                        }
                                    }}
                                >
                                    삭제
                                </Button>
                                <Button type="button" onClick={() => setIsEditModalOpen(false)}>
                                    취소
                                </Button>
                            </div>
                        </Form>
                    </ModalContent>
                </Modal>
            </MainContent>
        </Container>
    );
};

export default AdminUser; 