from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.services.docs_service.docs_recommend import run_doc_recommendation, recommend_docs_from_role
from app.services.docs_service.docs_crud import (
    create_document,
    update_document,
    get_documents,
    get_document,
    delete_document
)

router = APIRouter()

# 요청/응답 모델
class DocumentRecommendRequest(BaseModel):
    query: str

class Document(BaseModel):
    id: str
    title: str
    similarity: float
    preview: str
    download_url: Optional[str]

class DocumentRecommendResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    documents: List[Document] = []

class DocumentResponse(BaseModel):
    interdocs_id: UUID
    interdocs_type_name: str
    interdocs_filename: str
    interdocs_contents: str
    interdocs_path: str
    interdocs_uploaded_date: datetime
    interdocs_updated_date: Optional[datetime]
    interdocs_update_user_id: UUID

    class Config:
        from_attributes = True

@router.post("/recommend", response_model=DocumentRecommendResponse)
async def recommend_documents(request: DocumentRecommendRequest):
    """
    역할 또는 업무 내용을 기반으로 관련 문서를 추천합니다.
    
    - **query**: 검색할 역할 또는 업무 내용
    """
    try:
        result = recommend_docs_from_role(request.query)

        if isinstance(result, str):
            return DocumentRecommendResponse(success=False, message=result)
        
        doc_objs = [Document(**doc) for doc in result]

        if not doc_objs:
            return DocumentRecommendResponse(success=True, message="추천할 문서를 찾지 못했습니다.", documents=[])

        return DocumentRecommendResponse(success=True, documents=doc_objs)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"문서 추천 중 오류 발생: {str(e)}"
        )

@router.post("/", response_model=DocumentResponse)
async def create_new_document(
    update_user_id: UUID,
    doc_type: str,
    file: UploadFile = File(...),

):
    """
    새로운 문서를 업로드합니다.
    
    - **doc_type**: 문서 유형
    - **file**: 업로드할 파일
    - **update_user_id**: 업로드 사용자 ID
    """
    return create_document(file, doc_type, update_user_id)

@router.put("/{doc_id}", response_model=DocumentResponse)
async def update_existing_document(
    update_user_id: UUID,
    doc_id: UUID,
    file: UploadFile = File(...),

):
    """
    기존 문서를 수정합니다.
    
    - **doc_id**: 수정할 문서 ID
    - **file**: 새로운 파일
    - **update_user_id**: 수정 사용자 ID
    """
    return update_document(doc_id, file, update_user_id)

@router.get("/", response_model=List[DocumentResponse])
async def get_all_documents(
    skip: int = 0,
    limit: int = 10
):
    """
    문서 목록을 조회합니다.
    
    - **skip**: 건너뛸 문서 수
    - **limit**: 조회할 문서 수
    """
    return get_documents(skip, limit)

@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_single_document(
    doc_id: UUID
):
    """
    단일 문서를 조회합니다.
    
    - **doc_id**: 조회할 문서 ID
    """
    doc = get_document(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="문서를 찾을 수 없습니다")
    return doc

@router.delete("/{doc_id}")
async def delete_existing_document(
    doc_id: UUID
):
    """
    문서를 삭제합니다.
    
    - **doc_id**: 삭제할 문서 ID
    """
    result = delete_document(doc_id)
    if result:
        return {"message": "문서가 성공적으로 삭제되었습니다"}
    raise HTTPException(status_code=500, detail="문서 삭제 중 오류가 발생했습니다")
