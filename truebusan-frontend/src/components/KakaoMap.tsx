"use client";

import { Map, MapMarker, Polyline, useKakaoLoader } from "react-kakao-maps-sdk";
import { useState, useEffect } from "react";
import { Search, Trash2, GripVertical, MapPin, X, Plus, Clock, Car, Camera, Banknote, ChevronDown } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { mockPlaces } from "../data/mockPlaces";

const allPlaces = mockPlaces;
type Place = typeof allPlaces[0] & { menus?: any[] };

// SVG 마커 데이터 URL 생성 함수
const getMarkerIcon = (type: string, isSafe: boolean) => {
  if (!isSafe) {
    return {
      src: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='%23636E72' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 8v4'%3E%3C/path%3E%3Cpath d='M12 16h.01'%3E%3C/path%3E%3C/svg%3E",
      size: { width: 20, height: 20 },
    };
  }

  let color = "%23636E72"; // Default
  if (type === "숙소") color = "%230056B3"; // Blue
  else if (type === "관광지") color = "%2300B894"; // Green
  else if (type === "식당") color = "%23FF7675"; // Red/Orange

  return {
    src: `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='${color}' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3' fill='white'%3E%3C/circle%3E%3C/svg%3E`,
    size: { width: 36, height: 36 },
    offset: { x: 18, y: 36 } // 뾰족한 끝부분이 좌표에 맞도록 설정
  };
};

// 드래그 가능한 리스트 아이템 컴포넌트
function SortableItineraryItem({ item, index, onRemove }: { item: Place, index: number, onRemove: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm relative group">
      {/* 드래그 핸들 */}
      <div {...attributes} {...listeners} className="flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
        <GripVertical size={20} />
      </div>
      
      {/* 번호 및 선 (시각적 디자인) */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${item.type === '숙소' ? 'bg-[#0056B3]' : 'bg-[#00B894]'}`}>
          {index + 1}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="text-base font-bold text-gray-800">{item.icon} {item.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-[#00B894] bg-[#00B894]/10 px-2 py-0.5 rounded-md">안심 {item.type}</span>
          {item.trustScore && <span className="text-xs text-gray-400 font-medium">Score: {item.trustScore}</span>}
        </div>
      </div>

      {/* 휴지통 (삭제 버튼) */}
      <button 
        onClick={() => onRemove(item.id)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function KakaoMap() {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
  });

  // API 연동 전 임시(초기) 데이터 세트
  const [places, setPlaces] = useState<Place[]>(allPlaces);

  // [프론트-백엔드 연동] FastAPI 서버에서 장소 데이터 불러오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/places");
        if (response.ok) {
          const data = await response.json();
          const placesWithImage = data.map((place: any) => {
            let menus = [];
            if (place.type === "식당") {
              menus = [
                { name: "시그니처 대표 메뉴", price: 15000, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80" },
                { name: "인기 사이드 메뉴", price: 8000, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80" }
              ];
            } else if (place.type === "숙소") {
              menus = [
                { name: "스탠다드 더블룸 (1박)", price: 120000, img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=100&q=80" },
                { name: "오션뷰 디럭스룸 (1박)", price: 180000, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&q=80" }
              ];
            } else {
              menus = [
                { name: "성인 기본 입장권", price: 12000, img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=100&q=80" },
                { name: "소인/우대 입장권", price: 9000, img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=100&q=80" }
              ];
            }

            return {
              ...place,
              isSafe: place.is_safe,
              trustScore: place.trust_score,
              image: place.type === "숙소" 
                ? "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" 
                : place.type === "식당" 
                  ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" 
                  : "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
              phone: `051-${Math.floor(Math.random() * 800 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
              menus
            };
          });
          setPlaces(placesWithImage);
          console.log("✅ 백엔드 데이터 연동 성공:", placesWithImage);
        }
      } catch (err) {
        console.warn("⚠️ 백엔드 서버가 꺼져있어 임시 데이터를 사용합니다.", err);
        // 서버가 꺼져있을 경우 기존 allPlaces 유지
      }
    };
    fetchPlaces();
  }, []);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 여행 코스 상태
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [isCourseMode, setIsCourseMode] = useState(false);
  
  // AI 스케줄 상태
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState<any[]>([]);

  // dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleCreateCourse = (baseCamp: Place) => {
    // 하드코딩된 ID 대신, 현재 로드된 places 배열에서 카테고리별로 장소를 찾습니다.
    const spots = places.filter(p => p.type === "관광지" && p.id !== baseCamp.id);
    const foods = places.filter(p => p.type === "식당" && p.id !== baseCamp.id);
    
    const newItinerary = [baseCamp];
    if (spots.length > 0) newItinerary.push(spots[0]); // 첫 번째 관광지
    if (foods.length > 0) newItinerary.push(foods[0]); // 첫 번째 식당
    if (spots.length > 1) newItinerary.push(spots[1]); // 두 번째 관광지

    setItinerary(newItinerary);
    setIsCourseMode(true);
    setSelectedPlace(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItinerary((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveFromItinerary = (id: number) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToItinerary = (place: Place) => {
    setItinerary(prev => [...prev, place]);
    setSelectedPlace(null); // 추가 후 바텀시트 닫기
  };

  const handleStartGuidance = () => {
    if (itinerary.length === 0) return;
    
    const generated = itinerary.map((place, index) => {
      const startTime = new Date();
      startTime.setHours(10 + index * 2, 0, 0); // 10:00 AM, 12:00 PM...
      const timeStr = startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      let transport = "도보 이동 (약 10분)";
      let cost = 0;
      if (index > 0) {
        transport = "카카오T 택시 (약 15분)";
        cost = 6000 + Math.floor(Math.random() * 5) * 1000;
      }

      let tip = "인증샷 스팟: 입구에서 예쁘게 한 컷!";
      if (place.type === "식당") tip = "추천 메뉴: 영수증 리뷰가 가장 많은 시그니처 메뉴";
      if (place.type === "숙소") tip = "꿀팁: 체크인 전 프론트에 짐 보관 가능 여부 확인하기";

      return {
        id: place.id,
        time: timeStr,
        place: place.name,
        type: place.type,
        transport,
        cost,
        tip,
        icon: place.icon
      };
    });
    
    setScheduleData(generated);
    setShowSchedule(true);
    setIsCourseMode(false); // 사이드 패널 닫기
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-100">지도를 불러오는 중...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-red-100">API 오류 발생</div>;

  const polylinePath = itinerary.map((p) => ({ lat: p.lat, lng: p.lng }));

  const handleReset = () => {
    setItinerary([]);
    setIsCourseMode(false);
    setShowSchedule(false);
    setScheduleData([]);
    setSelectedPlace(null);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-100">
      
      {/* 통합 검색창 및 상단 헤더 */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-3 px-5 flex flex-col md:flex-row gap-4 items-center pointer-events-auto border border-gray-100">
          <h1 onClick={handleReset} className="text-2xl font-black tracking-tight text-[#0056B3] cursor-pointer hover:opacity-80 transition">
            TrueBusan
          </h1>
          
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="장소나 주소를 검색해보세요 (예: 해동용궁사)" 
              className="w-full bg-gray-100/50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056B3]/30 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {!isCourseMode && (
              <button className="bg-[#00B894] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-[#00a383] transition">
                내 주변 숙소 찾기
              </button>
            )}
          </div>
        </div>
      </div>

      <Map
        center={{ lat: 35.1587, lng: 129.1603 }}
        style={{ width: "100%", height: "100%" }}
        level={isCourseMode ? 7 : 6}
        onClick={() => setSelectedPlace(null)}
      >
        {/* 모든 핀 렌더링 (카테고리별 마커 디자인 적용) */}
        {places.map((place) => {
          const markerProps = getMarkerIcon(place.type, place.isSafe);
          return (
            <MapMarker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              title={place.name}
              image={markerProps}
              onClick={() => setSelectedPlace(place)}
            />
          );
        })}

        {/* 동선(Polyline) 렌더링 */}
        {isCourseMode && itinerary.length > 1 && (
          <Polyline
            path={[polylinePath]}
            strokeWeight={5}
            strokeColor="#0056B3"
            strokeOpacity={0.8}
            strokeStyle="solid"
          />
        )}
      </Map>

      {/* 우측 사이드 패널 (코스 모드) - 모바일에서는 하단 50% 바텀 시트로 동작 */}
      <div 
        className={`absolute bottom-0 md:top-0 right-0 w-full md:w-[380px] h-[55vh] md:h-full bg-gray-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[-10px_0_40px_rgba(0,0,0,0.1)] rounded-t-3xl md:rounded-none transition-transform duration-500 ease-in-out z-20 flex flex-col ${
          isCourseMode ? "translate-y-0 md:translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
      >
        <div className="p-4 md:p-6 bg-white border-b border-gray-100 pt-4 md:pt-24 rounded-t-3xl md:rounded-none">
          <div className="flex justify-between items-center mb-2">
            <div className="inline-block px-3 py-1 bg-blue-50 text-[#0056B3] rounded-full text-xs font-bold">✨ AI 맞춤 추천</div>
            <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800">해운대 힐링 코스</h2>
          <p className="text-gray-500 text-sm mt-1">블록을 끌어서 순서를 바꾸거나 핀을 눌러 추가하세요.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 px-6 relative">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itinerary.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3">
                {itinerary.map((item, index) => (
                  <SortableItineraryItem key={item.id} item={item} index={index} onRemove={handleRemoveFromItinerary} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {itinerary.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <MapPin className="mx-auto mb-2 opacity-50" size={32} />
              <p>지도에서 장소를 선택해 코스를 만들어보세요!</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-white">
          <button onClick={handleStartGuidance} className="w-full py-4 bg-[#0056B3] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">
            이 동선으로 길안내 시작
          </button>
        </div>
      </div>

      {/* 장소 정보 바텀 시트 (마커 클릭 시) */}
      <div 
        className={`absolute bottom-0 left-0 w-full md:w-[400px] md:left-4 bg-white rounded-t-3xl md:rounded-3xl md:bottom-4 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out z-30 ${
          selectedPlace ? "translate-y-0 opacity-100" : "translate-y-full md:translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {selectedPlace && (
          <div className="relative">
            {/* 상단 썸네일 이미지 영역 */}
            <div className="w-full h-48 relative overflow-hidden rounded-t-3xl md:rounded-t-3xl">
              <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedPlace(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6">
              <div className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full mb-3 ${selectedPlace.isSafe ? "bg-[#00B894]/10 text-[#00B894]" : "bg-red-500/10 text-red-500"}`}>
                {selectedPlace.isSafe ? "✅ 안심 인증 완료" : "⚠️ 리뷰 주의"}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedPlace.icon} {selectedPlace.name}</h2>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-700">{selectedPlace.type}</span>
                <span>·</span>
                <span>📞 {selectedPlace.phone}</span>
              </div>

              {/* 메뉴 및 가격 정보 */}
              {selectedPlace.menus && selectedPlace.menus.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                    {selectedPlace.type === '숙소' ? '객실 정보' : selectedPlace.type === '관광지' ? '이용 요금' : '대표 메뉴'}
                  </h3>
                  <div className="space-y-2">
                    {selectedPlace.menus.map((menu: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <img src={menu.img} alt={menu.name} className="w-10 h-10 rounded-md object-cover shadow-sm" />
                          <span className="text-sm font-medium text-gray-700">{menu.name}</span>
                        </div>
                        <span className="text-sm font-bold text-[#0056B3]">₩{menu.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 코스 모드 동작 분기 */}
            {!isCourseMode ? (
              // 아직 코스 짜기 전이면 숙소 선택 모드
              selectedPlace.type === "숙소" ? (
                <button 
                  onClick={() => handleCreateCourse(selectedPlace)}
                  className="w-full mt-2 py-4 bg-[#0056B3] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
                >
                  ✨ 이 숙소 기반으로 코스 시작
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold text-gray-600 mb-1">AI Trust Score</p>
                  <div className="text-3xl font-extrabold text-[#00B894]">{selectedPlace.trustScore || 90} <span className="text-sm text-gray-400">/ 100</span></div>
                </div>
              )
            ) : (
              // 이미 코스를 짜는 중이면 리스트에 추가/삭제 모드
              itinerary.some(p => p.id === selectedPlace.id) ? (
                <button 
                  onClick={() => handleRemoveFromItinerary(selectedPlace.id)}
                  className="w-full py-4 bg-red-50 text-red-500 rounded-xl font-bold text-lg hover:bg-red-100 transition flex justify-center items-center gap-2"
                >
                  <Trash2 size={20} /> 코스에서 제거하기
                </button>
              ) : (
                <button 
                  onClick={() => handleAddToItinerary(selectedPlace)}
                  className="w-full py-4 bg-[#00B894] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#00a383] transition flex justify-center items-center gap-2"
                >
                  <Plus size={20} /> 이 장소 코스에 넣기
                </button>
              )
            )}
            </div>
          </div>
        )}
      </div>

      {/* AI 스케줄 바텀 시트 */}
      <div 
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-in-out z-40 flex flex-col ${
          showSchedule ? "translate-y-0 h-[85vh] md:h-[70vh]" : "translate-y-full h-[85vh]"
        }`}
      >
        <div className="w-full flex justify-center py-3 cursor-pointer" onClick={() => setShowSchedule(false)}>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="px-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-[#0056B3] rounded-full text-xs font-black mb-2 border border-blue-100">
              ✨ AI Travel Planner
            </div>
            <h2 className="text-2xl font-black text-gray-800">나만의 맞춤형 일정표</h2>
          </div>
          <button onClick={() => setShowSchedule(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
            <ChevronDown size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="max-w-2xl mx-auto relative">
            {/* 타임라인 연결선 */}
            <div className="absolute left-[27px] top-4 bottom-10 w-0.5 bg-gradient-to-b from-blue-200 to-green-200 z-0"></div>

            <div className="space-y-8 relative z-10">
              {scheduleData.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  {/* 타임라인 노드 */}
                  <div className="w-14 h-14 rounded-full bg-white border-4 border-blue-100 shadow-sm flex items-center justify-center flex-shrink-0 z-10 text-2xl">
                    {step.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[#0056B3] bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1"><Clock size={12}/> {step.time}</span>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">{step.place}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                          <Car size={18} className="text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-700">{step.transport}</p>
                            {step.cost > 0 && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Banknote size={12}/> 예상 결제: ₩{step.cost.toLocaleString()}</p>}
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                          <Camera size={18} className="text-[#0056B3] mt-0.5" />
                          <p className="text-sm font-bold text-[#0056B3]">{step.tip}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 mb-6 bg-gray-800 text-white rounded-2xl p-6 text-center shadow-lg">
              <h3 className="font-bold text-lg mb-2">총 예상 경비: ₩{scheduleData.reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}</h3>
              <p className="text-sm text-gray-400 mb-4">트루부산 안심 검증 데이터를 기반으로 산출된 내역입니다.</p>
              <button className="bg-white text-gray-800 font-black py-3 px-8 rounded-xl w-full hover:bg-gray-100 transition">
                이 일정 그대로 결제 및 출발
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
