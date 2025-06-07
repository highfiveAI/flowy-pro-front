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

interface Position {
    position_id: string;
    position_code: string;
    position_name: string;
    position_detail: string;
}

const AdminPosition: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const [formData, setFormData] = useState({
        position_code: '',
        position_name: '',
        position_detail: ''
    });

    // 직급 목록 조회
    const fetchPositions = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/positions');
            const data = await response.json();
            setPositions(data);
        } catch (error) {
            console.error('직급 목록 조회 실패:', error);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    // 입력 폼 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 직급 생성
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/v1/admin/positions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchPositions();
                setFormData({
                    position_code: '',
                    position_name: '',
                    position_detail: ''
                });
            }
        } catch (error) {
            console.error('직급 생성 실패:', error);
        }
    };

    // 직급 수정
    const handleUpdate = async (positionId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/admin/positions/${positionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                fetchPositions();
                setSelectedPosition(null);
            }
        } catch (error) {
            console.error('직급 수정 실패:', error);
        }
    };

    // 직급 삭제
    const handleDelete = async (positionId: string) => {
        if (window.confirm('정말로 이 직급을 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/admin/positions/${positionId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchPositions();
                }
            } catch (error) {
                console.error('직급 삭제 실패:', error);
            }
        }
    };

    return (
        <Container>
            <SideBar />
            <MainContent>
                <h1>직급 관리</h1>
                
                {/* 직급 생성/수정 폼 */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label>직급 코드</label>
                        <input
                            type="text"
                            name="position_code"
                            value={formData.position_code}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>직급명</label>
                        <input
                            type="text"
                            name="position_name"
                            value={formData.position_name}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>직급 상세</label>
                        <input
                            type="text"
                            name="position_detail"
                            value={formData.position_detail}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>
                    <Button type="submit">
                        {selectedPosition ? '수정' : '생성'}
                    </Button>
                </Form>

                {/* 직급 목록 테이블 */}
                <Table>
                    <thead>
                        <tr>
                            <th>직급 코드</th>
                            <th>직급명</th>
                            <th>레벨</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map(position => (
                            <tr key={position.position_id}>
                                <td>{position.position_code}</td>
                                <td>{position.position_name}</td>
                                <td>{position.position_detail}</td>
                                <td>
                                    <Button onClick={() => {
                                        setSelectedPosition(position);
                                        setFormData({
                                            position_code: position.position_code,
                                            position_name: position.position_name,
                                            position_detail: position.position_detail
                                        });
                                    }}>
                                        수정
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        onClick={() => handleDelete(position.position_id)}
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

export default AdminPosition; 