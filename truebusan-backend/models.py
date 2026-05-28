from sqlalchemy import Column, Integer, String, Float, Boolean, Enum
from database import Base
import enum

class PlaceStatus(str, enum.Enum):
    SAFE = "SAFE"        # 안심 (지도에 정상 표시)
    DANGER = "DANGER"    # 경고 (작은 회색 마커로 경고 표시)
    TRASHED = "TRASHED"  # 휴지통 (지도에서 완전 숨김 - 잘못된 데이터)

class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String) # 숙소, 식당, 관광지
    lat = Column(Float)
    lng = Column(Float)
    trust_score = Column(Integer, default=50) # 0 ~ 100
    is_safe = Column(Boolean, default=False)
    status = Column(Enum(PlaceStatus), default=PlaceStatus.SAFE)
    icon = Column(String, default="") # "🏨", "🍜" 등
