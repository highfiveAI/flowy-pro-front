import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NewPosition from '../../popup/newposition';
import EditPosition from '../../popup/editposition';

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(80,0,80,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 420px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  z-index: 10;
`;
const AddButton = styled.button`
  background: #351745;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 18px;
  margin-bottom: 1.2rem;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #4b2067; }
`;
const PositionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const PositionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
`;
const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;
const ActionBtn = styled.button`
  background: #ede6f7;
  color: #351745;
  border: 1.5px solid #a48be0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 4px 12px;
  cursor: pointer;
  &:hover { background: #e5e0ee; }
`;

interface Position {
  position_id: string;
  position_code: string;
  position_name: string;
  position_detail: string;
  position_company_id: string;
}

interface ManagePositionsModalProps {
  companyId: string;
  onClose: () => void;
}

const ManagePositionsModal: React.FC<ManagePositionsModalProps> = ({ companyId, onClose }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    position_code: '',
    position_name: '',
    position_detail: '',
  });

  // 직책 목록 조회
  const fetchPositions = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/companies/${companyId}/positions/`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setPositions(data);
    }
  };
  useEffect(() => { fetchPositions(); }, [companyId]);

  // 추가
  const handleNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/positions/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, position_company_id: companyId }),
    });
    if (res.ok) {
      setIsNewOpen(false);
      setFormData({ position_code: '', position_name: '', position_detail: '' });
      fetchPositions();
    }
  };
  // 수정
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${editTarget.position_id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, position_company_id: companyId }),
    });
    if (res.ok) {
      setIsEditOpen(false);
      setEditTarget(null);
      setFormData({ position_code: '', position_name: '', position_detail: '' });
      fetchPositions();
    }
  };
  // 삭제
  const handleDelete = async (position_id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/positions/${position_id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) fetchPositions();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ModalBg>
      <ModalBox>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h2 style={{ marginBottom: 18 }}>직책 관리</h2>
        <AddButton onClick={() => { setIsNewOpen(true); setFormData({ position_code: '', position_name: '', position_detail: '' }); }}>+ 새 직책 추가</AddButton>
        <PositionList>
          {positions.length === 0 && <li style={{ color: '#aaa', padding: '16px 0' }}>직책이 없습니다.</li>}
          {positions.map((pos) => (
            <PositionItem key={pos.position_id}>
              <div>
                <b>{pos.position_name}</b> <span style={{ color: '#b0a3c2', fontSize: 13 }}>({pos.position_code})</span>
                <div style={{ fontSize: 13, color: '#888' }}>{pos.position_detail}</div>
              </div>
              <ActionGroup>
                <ActionBtn onClick={() => { setEditTarget(pos); setFormData({ position_code: pos.position_code, position_name: pos.position_name, position_detail: pos.position_detail }); setIsEditOpen(true); }}>수정</ActionBtn>
                <ActionBtn onClick={() => handleDelete(pos.position_id)}>삭제</ActionBtn>
              </ActionGroup>
            </PositionItem>
          ))}
        </PositionList>
        {/* 추가 모달 */}
        <NewPosition
          isOpen={isNewOpen}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleNew}
          onClose={() => setIsNewOpen(false)}
        />
        {/* 수정 모달 */}
        <EditPosition
          visible={isEditOpen}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleEdit}
          onDelete={editTarget ? () => { handleDelete(editTarget.position_id); setIsEditOpen(false); } : undefined}
          onClose={() => { setIsEditOpen(false); setEditTarget(null); }}
        />
      </ModalBox>
    </ModalBg>
  );
};

export default ManagePositionsModal; 