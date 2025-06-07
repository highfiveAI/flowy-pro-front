import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SideBar from '../../components/SideBar';

// 스타일 컴포넌트 정의
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

const UserTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-bottom: 2rem;

    th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background-color: #f8f9fa;
        font-weight: 600;
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

interface User {
    user_id: string;
    user_name: string;
    user_email: string;
    user_login_id: string;
    user_phonenum: string;
    user_dept_name: string;
    user_team_name: string;
    user_jobname: string;
    // 임시
    user_company_id: string;
    user_position_id: string;
    user_sysrole_id: string;
}

const AdminUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_login_id: '',
        user_password: '',
        user_phonenum: '',
        user_dept_name: '',
        user_team_name: '',
        user_jobname: '',
        // 임시
        user_company_id: '',
        user_position_id: '',
        user_sysrole_id: '',
    });

    // 사용자 목록 조회
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('사용자 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 입력 폼 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 사용자 생성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchUsers();
                setFormData({
                    user_name: '',
                    user_email: '',
                    user_login_id: '',
                    user_password: '',
                    user_phonenum: '',
                    user_dept_name: '',
                    user_team_name: '',
                    user_jobname: '',
                    // 임시
                    user_company_id: '',
                    user_position_id: '',
                    user_sysrole_id: '',
                });
            }
        } catch (error) {
            console.error('사용자 생성 실패:', error);
        }
    };

    // 사용자 수정
    const handleUpdate = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchUsers();
                setSelectedUser(null);
            }
        } catch (error) {
            console.error('사용자 수정 실패:', error);
        }
    };

    // 사용자 삭제
    const handleDelete = async (userId: string) => {
        if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/admin/users/${userId}`, {
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

    return (
        <Container>
            <SideBar />
            <MainContent>
                <h1>사용자 관리</h1>
                
                {/* 사용자 생성/수정 폼 */}
                <Form onSubmit={handleSubmit}>
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
                    <Button type="submit">
                        {selectedUser ? '수정' : '생성'}
                    </Button>
                </Form>

                {/* 사용자 목록 테이블 */}
                <UserTable>
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>로그인 ID</th>
                            <th>전화번호</th>
                            <th>부서</th>
                            <th>팀</th>
                            <th>직무</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.user_id}>
                                <td>{user.user_name}</td>
                                <td>{user.user_email}</td>
                                <td>{user.user_login_id}</td>
                                <td>{user.user_phonenum}</td>
                                <td>{user.user_dept_name}</td>
                                <td>{user.user_team_name}</td>
                                <td>{user.user_jobname}</td>
                                <td>
                                    <Button onClick={() => {
                                        setSelectedUser(user);
                                        setFormData({
                                            ...formData,
                                            user_name: user.user_name,
                                            user_email: user.user_email,
                                            user_login_id: user.user_login_id,
                                            user_phonenum: user.user_phonenum,
                                            user_dept_name: user.user_dept_name || '',
                                            user_team_name: user.user_team_name || '',
                                            user_jobname: user.user_jobname || '',
                                        });
                                    }}>
                                        수정
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        onClick={() => handleDelete(user.user_id)}
                                    >
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </UserTable>
            </MainContent>
        </Container>
    );
};

export default AdminUser; 