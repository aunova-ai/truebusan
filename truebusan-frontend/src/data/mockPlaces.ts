export const mockPlaces = [
  // 🏨 숙소
  { id: 1, type: "숙소", name: "시그니엘 부산", lat: 35.1601, lng: 129.1655, isSafe: true, trustScore: 99, icon: "🏨" },
  { id: 2, type: "숙소", name: "파라다이스 호텔 부산", lat: 35.1605, lng: 129.1640, isSafe: true, trustScore: 97, icon: "🏨" },
  { id: 3, type: "숙소", name: "웨스틴 조선 부산", lat: 35.1545, lng: 129.1525, isSafe: true, trustScore: 95, icon: "🏨" },
  { id: 4, type: "숙소", name: "신라스테이 해운대", lat: 35.1598, lng: 129.1580, isSafe: true, trustScore: 92, icon: "🏨" },
  { id: 5, type: "숙소", name: "파크 하얏트 부산", lat: 35.1541, lng: 129.1444, isSafe: true, trustScore: 98, icon: "🏨" },
  { id: 6, type: "숙소", name: "그랜드 조선 부산", lat: 35.1602, lng: 129.1612, isSafe: true, trustScore: 94, icon: "🏨" },
  { id: 7, type: "숙소", name: "라마다 앙코르 해운대", lat: 35.1625, lng: 129.1585, isSafe: true, trustScore: 89, icon: "🏨" },
  { id: 8, type: "숙소", name: "토요코인 해운대2", lat: 35.1604, lng: 129.1665, isSafe: true, trustScore: 88, icon: "🏨" },
  
  // 🏖️ 관광지
  { id: 10, type: "관광지", name: "해운대 해수욕장", lat: 35.1587, lng: 129.1603, isSafe: true, trustScore: 90, icon: "🏖️" },
  { id: 11, type: "관광지", name: "블루라인파크 미포정거장", lat: 35.1615, lng: 129.1710, isSafe: true, trustScore: 95, icon: "🚂" },
  { id: 12, type: "관광지", name: "동백섬", lat: 35.1534, lng: 129.1517, isSafe: true, trustScore: 92, icon: "🏝️" },
  { id: 13, type: "관광지", name: "더베이101", lat: 35.1565, lng: 129.1522, isSafe: true, trustScore: 88, icon: "🌃" },
  { id: 14, type: "관광지", name: "부산 엑스더스카이", lat: 35.1601, lng: 129.1655, isSafe: true, trustScore: 89, icon: "🔭" },
  { id: 15, type: "관광지", name: "해동용궁사", lat: 35.1883, lng: 129.2233, isSafe: true, trustScore: 97, icon: "🏯" },
  { id: 16, type: "관광지", name: "광안리 해수욕장", lat: 35.1532, lng: 129.1186, isSafe: true, trustScore: 94, icon: "🌉" },
  { id: 17, type: "관광지", name: "송정 해수욕장", lat: 35.1785, lng: 129.1996, isSafe: true, trustScore: 87, icon: "🏄‍♂️" },
  { id: 18, type: "관광지", name: "해운대 달맞이길", lat: 35.1600, lng: 129.1750, isSafe: true, trustScore: 91, icon: "🌸" },
  { id: 19, type: "관광지", name: "스카이캡슐 청사포", lat: 35.1610, lng: 129.1915, isSafe: true, trustScore: 96, icon: "🚡" },

  // 🍽️ 식당 및 카페
  { id: 20, type: "식당", name: "금수복국 해운대본점", lat: 35.1626, lng: 129.1628, isSafe: true, trustScore: 98, icon: "🐡" },
  { id: 21, type: "식당", name: "해운대암소갈비집", lat: 35.1633, lng: 129.1666, isSafe: true, trustScore: 95, icon: "🥩" },
  { id: 22, type: "식당", name: "수민이네 (조개구이)", lat: 35.1585, lng: 129.1920, isSafe: true, trustScore: 89, icon: "🦪" },
  { id: 23, type: "식당", name: "극동돼지국밥", lat: 35.1618, lng: 129.1670, isSafe: true, trustScore: 93, icon: "🍚" },
  { id: 24, type: "식당", name: "밀양순대돼지국밥", lat: 35.1622, lng: 129.1595, isSafe: true, trustScore: 88, icon: "🥘" },
  { id: 25, type: "식당", name: "상국이네 떡볶이", lat: 35.1620, lng: 129.1611, isSafe: true, trustScore: 91, icon: "🥟" },
  { id: 26, type: "식당", name: "호랑이젤라떡", lat: 35.1580, lng: 129.1670, isSafe: true, trustScore: 90, icon: "🍡" },
  { id: 27, type: "식당", name: "옵스 해운대점", lat: 35.1611, lng: 129.1622, isSafe: true, trustScore: 94, icon: "🥐" },
  { id: 28, type: "식당", name: "해리단길 카페거리", lat: 35.1645, lng: 129.1580, isSafe: true, trustScore: 96, icon: "☕" },
  { id: 29, type: "식당", name: "동백밀면", lat: 35.1565, lng: 129.1540, isSafe: true, trustScore: 92, icon: "🍜" },
  
  // ⚠️ 경고 및 비추천 (테스트용)
  { id: 30, type: "식당", name: "광안리 불법 호객 횟집거리", lat: 35.1555, lng: 129.1333, isSafe: false, trustScore: 20, icon: "⚠️" },
  { id: 31, type: "식당", name: "해운대 바가지 포차 (접근주의)", lat: 35.1590, lng: 129.1630, isSafe: false, trustScore: 35, icon: "⚠️" },
].map(place => ({
  ...place,
  image: place.type === "숙소" 
    ? "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" 
    : place.type === "식당" 
      ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
      : "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
  phone: `051-${Math.floor(Math.random() * 800 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
}));
