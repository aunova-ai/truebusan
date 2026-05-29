import sqlite3
import json

def seed_db():
    conn = sqlite3.connect("truebusan.db")
    cursor = conn.cursor()

    # 테이블 생성 (models.py 구조와 일치)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR,
            type VARCHAR,
            lat FLOAT,
            lng FLOAT,
            trust_score INTEGER,
            is_safe BOOLEAN,
            status VARCHAR,
            icon VARCHAR
        )
    ''')
    
    # 인덱스 생성
    cursor.execute('CREATE INDEX IF NOT EXISTS ix_places_id ON places (id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS ix_places_name ON places (name)')

    # 데이터 존재 여부 확인
    cursor.execute('SELECT COUNT(*) FROM places')
    if cursor.fetchone()[0] > 0:
        print("Database already seeded. Skipping...")
        conn.close()
        return

    initial_data = [
        {"name": "시그니엘 부산", "type": "숙소", "lat": 35.1601, "lng": 129.1655, "is_safe": True, "trust_score": 99, "icon": "🏨"},
        {"name": "파라다이스 호텔 부산", "type": "숙소", "lat": 35.1605, "lng": 129.1640, "is_safe": True, "trust_score": 97, "icon": "🏨"},
        {"name": "웨스틴 조선 부산", "type": "숙소", "lat": 35.1545, "lng": 129.1525, "is_safe": True, "trust_score": 95, "icon": "🏨"},
        {"name": "신라스테이 해운대", "type": "숙소", "lat": 35.1598, "lng": 129.1580, "is_safe": True, "trust_score": 92, "icon": "🏨"},
        {"name": "파크 하얏트 부산", "type": "숙소", "lat": 35.1541, "lng": 129.1444, "is_safe": True, "trust_score": 98, "icon": "🏨"},
        {"name": "그랜드 조선 부산", "type": "숙소", "lat": 35.1602, "lng": 129.1612, "is_safe": True, "trust_score": 94, "icon": "🏨"},
        {"name": "라마다 앙코르 해운대", "type": "숙소", "lat": 35.1625, "lng": 129.1585, "is_safe": True, "trust_score": 89, "icon": "🏨"},
        {"name": "토요코인 해운대2", "type": "숙소", "lat": 35.1604, "lng": 129.1665, "is_safe": True, "trust_score": 88, "icon": "🏨"},
        
        {"name": "해운대 해수욕장", "type": "관광지", "lat": 35.1587, "lng": 129.1603, "is_safe": True, "trust_score": 90, "icon": "🏖️"},
        {"name": "블루라인파크 미포정거장", "type": "관광지", "lat": 35.1615, "lng": 129.1710, "is_safe": True, "trust_score": 95, "icon": "🚂"},
        {"name": "동백섬", "type": "관광지", "lat": 35.1534, "lng": 129.1517, "is_safe": True, "trust_score": 92, "icon": "🏝️"},
        {"name": "더베이101", "type": "관광지", "lat": 35.1565, "lng": 129.1522, "is_safe": True, "trust_score": 88, "icon": "🌃"},
        {"name": "부산 엑스더스카이", "type": "관광지", "lat": 35.1601, "lng": 129.1655, "is_safe": True, "trust_score": 89, "icon": "🔭"},
        {"name": "해동용궁사", "type": "관광지", "lat": 35.1883, "lng": 129.2233, "is_safe": True, "trust_score": 97, "icon": "🏯"},
        {"name": "광안리 해수욕장", "type": "관광지", "lat": 35.1532, "lng": 129.1186, "is_safe": True, "trust_score": 94, "icon": "🌉"},
        {"name": "송정 해수욕장", "type": "관광지", "lat": 35.1785, "lng": 129.1996, "is_safe": True, "trust_score": 87, "icon": "🏄‍♂️"},
        {"name": "해운대 달맞이길", "type": "관광지", "lat": 35.1600, "lng": 129.1750, "is_safe": True, "trust_score": 91, "icon": "🌸"},
        {"name": "스카이캡슐 청사포", "type": "관광지", "lat": 35.1610, "lng": 129.1915, "is_safe": True, "trust_score": 96, "icon": "🚡"},

        {"name": "금수복국 해운대본점", "type": "식당", "lat": 35.1626, "lng": 129.1628, "is_safe": True, "trust_score": 98, "icon": "🐡"},
        {"name": "해운대암소갈비집", "type": "식당", "lat": 35.1633, "lng": 129.1666, "is_safe": True, "trust_score": 95, "icon": "🥩"},
        {"name": "수민이네 (조개구이)", "type": "식당", "lat": 35.1585, "lng": 129.1920, "is_safe": True, "trust_score": 89, "icon": "🦪"},
        {"name": "극동돼지국밥", "type": "식당", "lat": 35.1618, "lng": 129.1670, "is_safe": True, "trust_score": 93, "icon": "🍚"},
        {"name": "밀양순대돼지국밥", "type": "식당", "lat": 35.1622, "lng": 129.1595, "is_safe": True, "trust_score": 88, "icon": "🥘"},
        {"name": "상국이네 떡볶이", "type": "식당", "lat": 35.1620, "lng": 129.1611, "is_safe": True, "trust_score": 91, "icon": "🥟"},
        {"name": "호랑이젤라떡", "type": "식당", "lat": 35.1580, "lng": 129.1670, "is_safe": True, "trust_score": 90, "icon": "🍡"},
        {"name": "옵스 해운대점", "type": "식당", "lat": 35.1611, "lng": 129.1622, "is_safe": True, "trust_score": 94, "icon": "🥐"},
        {"name": "해리단길 카페거리", "type": "식당", "lat": 35.1645, "lng": 129.1580, "is_safe": True, "trust_score": 96, "icon": "☕"},
        {"name": "동백밀면", "type": "식당", "lat": 35.1565, "lng": 129.1540, "is_safe": True, "trust_score": 92, "icon": "🍜"},
        
        {"name": "광안리 불법 호객 횟집거리", "type": "식당", "lat": 35.1555, "lng": 129.1333, "is_safe": False, "trust_score": 20, "icon": "⚠️"},
        {"name": "해운대 바가지 포차 (접근주의)", "type": "식당", "lat": 35.1590, "lng": 129.1630, "is_safe": False, "trust_score": 35, "icon": "⚠️"},
    ]

    for data in initial_data:
        status = "SAFE" if data["is_safe"] else "DANGER"
        cursor.execute('''
            INSERT INTO places (name, type, lat, lng, trust_score, is_safe, status, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data["name"], data["type"], data["lat"], data["lng"], data["trust_score"], data["is_safe"], status, data["icon"]))
    
    conn.commit()
    print(f"Seeding completed. {len(initial_data)} places added to the SQLite database.")
    conn.close()

if __name__ == "__main__":
    print("Starting database seeding without SQLAlchemy...")
    seed_db()
