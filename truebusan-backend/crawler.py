import typer
from sqlalchemy.orm import Session
import random
import time

from database import SessionLocal, engine
import models

app = typer.Typer()

# ========================================================
# [전략 1] 공공데이터 연동 (위생등급 우수, 착한가격업소)
# ========================================================
PUBLIC_DATA_SAFE_LIST = [
    "해운대 정찰제 국밥", "동백밀면", "해운대 안심호텔"
]

# ========================================================
# [전략 2] 기초 수집 데이터 (AI 분석 전 껍데기 데이터)
# ========================================================
RAW_CRAWLED_DATA = [
    {"name": "시그니엘 부산", "type": "숙소", "lat": 35.1601, "lng": 129.1655, "raw_rating": 4.9},
    {"name": "파라다이스 호텔 부산", "type": "숙소", "lat": 35.1605, "lng": 129.1640, "raw_rating": 4.8},
    {"name": "웨스틴 조선 부산", "type": "숙소", "lat": 35.1545, "lng": 129.1525, "raw_rating": 4.7},
    {"name": "신라스테이 해운대", "type": "숙소", "lat": 35.1598, "lng": 129.1580, "raw_rating": 4.5},
    {"name": "파크 하얏트 부산", "type": "숙소", "lat": 35.1541, "lng": 129.1444, "raw_rating": 4.9},
    {"name": "그랜드 조선 부산", "type": "숙소", "lat": 35.1602, "lng": 129.1612, "raw_rating": 4.6},
    {"name": "라마다 앙코르 해운대", "type": "숙소", "lat": 35.1625, "lng": 129.1585, "raw_rating": 4.3},
    {"name": "토요코인 해운대2", "type": "숙소", "lat": 35.1604, "lng": 129.1665, "raw_rating": 4.2},
    
    {"name": "해운대 해수욕장", "type": "관광지", "lat": 35.1587, "lng": 129.1603, "raw_rating": 4.5},
    {"name": "블루라인파크 미포정거장", "type": "관광지", "lat": 35.1615, "lng": 129.1710, "raw_rating": 4.8},
    {"name": "동백섬", "type": "관광지", "lat": 35.1534, "lng": 129.1517, "raw_rating": 4.7},
    {"name": "더베이101", "type": "관광지", "lat": 35.1565, "lng": 129.1522, "raw_rating": 4.4},
    {"name": "부산 엑스더스카이", "type": "관광지", "lat": 35.1601, "lng": 129.1655, "raw_rating": 4.5},
    {"name": "해동용궁사", "type": "관광지", "lat": 35.1883, "lng": 129.2233, "raw_rating": 4.8},
    {"name": "광안리 해수욕장", "type": "관광지", "lat": 35.1532, "lng": 129.1186, "raw_rating": 4.6},
    {"name": "송정 해수욕장", "type": "관광지", "lat": 35.1785, "lng": 129.1996, "raw_rating": 4.4},
    {"name": "해운대 달맞이길", "type": "관광지", "lat": 35.1600, "lng": 129.1750, "raw_rating": 4.5},
    {"name": "스카이캡슐 청사포", "type": "관광지", "lat": 35.1610, "lng": 129.1915, "raw_rating": 4.9},

    {"name": "금수복국 해운대본점", "type": "식당", "lat": 35.1626, "lng": 129.1628, "raw_rating": 4.7},
    {"name": "해운대암소갈비집", "type": "식당", "lat": 35.1633, "lng": 129.1666, "raw_rating": 4.5},
    {"name": "수민이네 (조개구이)", "type": "식당", "lat": 35.1585, "lng": 129.1920, "raw_rating": 4.4},
    {"name": "극동돼지국밥", "type": "식당", "lat": 35.1618, "lng": 129.1670, "raw_rating": 4.6},
    {"name": "밀양순대돼지국밥", "type": "식당", "lat": 35.1622, "lng": 129.1595, "raw_rating": 4.3},
    {"name": "상국이네 떡볶이", "type": "식당", "lat": 35.1620, "lng": 129.1611, "raw_rating": 4.4},
    {"name": "호랑이젤라떡", "type": "식당", "lat": 35.1580, "lng": 129.1670, "raw_rating": 4.5},
    {"name": "옵스 해운대점", "type": "식당", "lat": 35.1611, "lng": 129.1622, "raw_rating": 4.6},
    {"name": "해리단길 카페거리", "type": "식당", "lat": 35.1645, "lng": 129.1580, "raw_rating": 4.7},
    {"name": "동백밀면", "type": "식당", "lat": 35.1565, "lng": 129.1540, "raw_rating": 4.5},
    
    {"name": "광안리 불법 호객 횟집거리", "type": "식당", "lat": 35.1555, "lng": 129.1333, "raw_rating": 1.5},
    {"name": "해운대 바가지 포차 (접근주의)", "type": "식당", "lat": 35.1590, "lng": 129.1630, "raw_rating": 2.1},
]

def simulate_ai_nlp_analysis(name: str, rating: float) -> tuple[int, bool, models.PlaceStatus]:
    """오픈AI 연동을 가정한 정밀 텍스트 분석 로직 (비용 발생)"""
    typer.echo(f"  🔍 [AI 정밀 분석 중] '{name}'의 리뷰 텍스트 500개 형태소 분석 중...")
    time.sleep(random.uniform(0.5, 1.2)) # Anti-Ban 및 AI 대기시간 시뮬레이션
    
    if rating >= 4.5:
        return (random.randint(90, 100), True, models.PlaceStatus.SAFE)
    else:
        return (random.randint(10, 40), False, models.PlaceStatus.DANGER)

@app.command()
def run():
    """30/40/30 룰이 적용된 지능형 크롤링 파이프라인 가동"""
    typer.echo("🚀 [1단계] 크롤링 봇 가동 (Anti-Ban 랜덤 딜레이 적용)...")
    
    # 1. 평점순으로 정렬
    sorted_data = sorted(RAW_CRAWLED_DATA, key=lambda x: x["raw_rating"], reverse=True)
    total_count = len(sorted_data)
    
    top_30_idx = int(total_count * 0.3)
    bottom_30_idx = int(total_count * 0.7)
    
    db: Session = SessionLocal()
    
    stats = {"SAFE": 0, "DANGER": 0, "SKIPPED_AI": 0}

    for idx, item in enumerate(sorted_data):
        time.sleep(random.uniform(0.1, 0.4)) # Anti-Ban 시뮬레이션
        
        name = item["name"]
        raw_rating = item["raw_rating"]
        
        # [공공데이터 가산점]
        is_public_certified = name in PUBLIC_DATA_SAFE_LIST
        if is_public_certified:
            typer.echo(f"✨ [공공데이터 매칭] '{name}' -> 부산시 착한가격/위생 우수 업소 확인 (가산점 부여)")
            raw_rating += 0.5 

        # [30/40/30 룰 적용]
        if idx <= top_30_idx or idx >= bottom_30_idx or is_public_certified:
            # 상하위 30% 이거나 공공데이터 인증된 곳 -> AI 정밀 분석 (비용 지출)
            trust_score, is_safe, status = simulate_ai_nlp_analysis(name, raw_rating)
        else:
            # 중간 40% -> AI 분석 스킵 (비용 절감)
            typer.echo(f"  ⏭️ [AI 분석 생략] '{name}' -> 평점 {raw_rating}점 (중간 40%로 분류, 기본값 60점 부여)")
            trust_score = 60
            is_safe = True
            status = models.PlaceStatus.SAFE
            stats["SKIPPED_AI"] += 1

        stats[status.value] += 1

        # DB 저장 로직 (중복 방지)
        existing = db.query(models.Place).filter(models.Place.name == name).first()
        if not existing:
            new_place = models.Place(
                name=name, type=item["type"], lat=item["lat"], lng=item["lng"],
                trust_score=trust_score, is_safe=is_safe, status=status
            )
            db.add(new_place)
            
    db.commit()
    db.close()
    
    typer.echo("\n=============================================")
    typer.echo(f"🎉 크롤링 및 AI 분석 완료! (총 {total_count}개 장소)")
    typer.echo(f"💰 AI 서버 비용 절감 횟수 (중간 40% 생략): {stats['SKIPPED_AI']}건")
    typer.echo(f"✅ 안심(SAFE) 마커 등록: {stats['SAFE']}건")
    typer.echo(f"🚨 경고(DANGER) 블랙리스트 박제: {stats['DANGER']}건")
    typer.echo("=============================================")

if __name__ == "__main__":
    app()
