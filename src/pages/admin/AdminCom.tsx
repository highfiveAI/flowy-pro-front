import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SideBar from '../../components/SideBar';

// 스타일 컴포넌트 재사용
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

const Table = styled.table`
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

interface Company {
    company_id: string;
    company_name: string;
    company_scale: string;
}

const AdminCom: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState({
        company_name: '',
        company_scale: '',
    });

    // 회사 목록 조회
    const fetchCompanies = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/companies');
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('회사 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // 입력 폼 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 회사 생성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchCompanies();
                setFormData({
                    company_name: '',
                    company_scale: '',
                });
            }
        } catch (error) {
            console.error('회사 생성 실패:', error);
        }
    };

    // 회사 수정
    const handleUpdate = async (companyId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/companies/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchCompanies();
                setSelectedCompany(null);
            }
        } catch (error) {
            console.error('회사 수정 실패:', error);
        }
    };

    // 회사 삭제
    const handleDelete = async (companyId: string) => {
        if (window.confirm('정말로 이 회사를 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/admin/companies/${companyId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchCompanies();
                }
            } catch (error) {
                console.error('회사 삭제 실패:', error);
            }
        }
    };

    return (
        <Container>
            <SideBar />
            <MainContent>
                <h1>회사 관리</h1>
                
                {/* 회사 생성/수정 폼 */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label>회사명</label>
                        <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>규모</label>
                        <input
                            type="text"
                            name="company_scale"
                            value={formData.company_scale}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <Button type="submit">
                        {selectedCompany ? '수정' : '생성'}
                    </Button>
                </Form>

                {/* 회사 목록 테이블 */}
                <Table>
                    <thead>
                        <tr>
                            <th>회사명</th>
                            <th>규모</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.company_id}>
                                <td>{company.company_name}</td>
                                <td>{company.company_scale}</td>
                                <td>
                                    <Button onClick={() => {
                                        setSelectedCompany(company);
                                        setFormData({
                                            company_name: company.company_name,
                                            company_scale: company.company_scale,
                                        });
                                    }}>
                                        수정
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        onClick={() => handleDelete(company.company_id)}
                                    >
                                        삭제
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </MainContent>
        </Container>
    );
};

export default AdminCom; 