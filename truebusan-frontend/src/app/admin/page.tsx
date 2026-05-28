"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, MapPin, ShieldCheck, Users, Settings, LogOut, Search, Edit2, Trash2 } from "lucide-react";

import { mockPlaces } from "../../data/mockPlaces";

const initialData = mockPlaces;

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState("places"); // "home", "places", "reviews", "users"
  
  const [places, setPlaces] = useState(initialData);

  // [프론트-백엔드 연동] FastAPI 서버에서 데이터 불러오기
  useEffect(() => {
    const fetchAdminPlaces = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/places");
        if (response.ok) {
          const data = await response.json();
          setPlaces(data);
        }
      } catch (err) {
        console.warn("⚠️ 백엔드 미연결: 임시 데이터를 사용합니다.", err);
      }
    };
    fetchAdminPlaces();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const toggleSafeStatus = (id: number) => {
    setPlaces(places.map(place => 
      place.id === id ? { ...place, isSafe: !place.isSafe } : place
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("정말로 이 데이터를 삭제하시겠습니까?")) {
      setPlaces(places.filter(place => place.id !== id));
    }
  };

  // 로그인되지 않은 상태면 로그인 화면 렌더링
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-[#0056B3]">TrueBusan</h1>
            <p className="text-gray-500 mt-2 font-medium">관리자 시스템 접속</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">아이디</label>
              <input 
                type="text" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0056B3]/30 transition" 
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">비밀번호</label>
              <input 
                type="password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0056B3]/30 transition" 
                placeholder="1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {loginError && <p className="text-red-500 text-sm font-bold">아이디 또는 비밀번호가 일치하지 않습니다.</p>}

            <button type="submit" className="w-full bg-[#0056B3] text-white rounded-xl py-3.5 font-bold text-lg hover:bg-blue-700 transition shadow-md mt-4">
              시스템 로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 로그인 성공 시 대시보드 화면 렌더링
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-black text-[#0056B3]">TrueBusan</h1>
          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-bold mt-1">Admin Pro</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab("home")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "home" ? "bg-blue-50 text-[#0056B3] font-bold" : "text-gray-600 hover:bg-gray-50 font-semibold"}`}>
            <LayoutDashboard size={20} /> 대시보드 홈
          </button>
          <button onClick={() => setActiveTab("places")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "places" ? "bg-blue-50 text-[#0056B3] font-bold" : "text-gray-600 hover:bg-gray-50 font-semibold"}`}>
            <MapPin size={20} /> 장소 데이터 관리
          </button>
          <button onClick={() => setActiveTab("reviews")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "reviews" ? "bg-blue-50 text-[#0056B3] font-bold" : "text-gray-600 hover:bg-gray-50 font-semibold"}`}>
            <ShieldCheck size={20} /> 리뷰 & 안심 검증
          </button>
          <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "users" ? "bg-blue-50 text-[#0056B3] font-bold" : "text-gray-600 hover:bg-gray-50 font-semibold"}`}>
            <Users size={20} /> 사용자 관리
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition font-bold">
            <LogOut size={20} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === "home" && "대시보드 홈"}
            {activeTab === "places" && "장소 데이터 관리"}
            {activeTab === "reviews" && "리뷰 & 안심 검증"}
            {activeTab === "users" && "사용자 관리"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="데이터 검색..." className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056B3]/30 w-64" />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0056B3] font-bold">
              AD
            </div>
          </div>
        </header>

        {/* 데이터 테이블 영역 */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "places" ? (
            <>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">등록된 장소 리스트</h3>
                  <p className="text-gray-500 text-sm">총 {places.length}개의 데이터가 시스템에 연동되어 있습니다.</p>
                </div>
                <button className="bg-[#0056B3] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
                  + 신규 장소 등록
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                      <th className="py-4 px-6 font-semibold w-16">ID</th>
                      <th className="py-4 px-6 font-semibold">장소명</th>
                      <th className="py-4 px-6 font-semibold w-32">카테고리</th>
                      <th className="py-4 px-6 font-semibold w-32 text-center">AI Trust Score</th>
                      <th className="py-4 px-6 font-semibold w-40 text-center">안심 마크 (공개)</th>
                      <th className="py-4 px-6 font-semibold w-32 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {places.map((place) => (
                      <tr key={place.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 text-gray-500 font-medium">#{place.id}</td>
                        <td className="py-4 px-6 font-bold text-gray-800">{place.name}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            place.type === '숙소' ? 'bg-blue-50 text-blue-600' : 
                            place.type === '식당' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {place.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`font-black ${place.trustScore >= 80 ? 'text-[#00B894]' : place.trustScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {place.trustScore}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {/* 커스텀 토글 스위치 */}
                          <button 
                            onClick={() => toggleSafeStatus(place.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${place.isSafe ? 'bg-[#00B894]' : 'bg-gray-200'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${place.isSafe ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(place.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {places.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    데이터가 없습니다.
                  </div>
                )}
              </div>
            </>
          ) : activeTab === "reviews" ? (
            <>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">공공데이터 안심 검증 현황</h3>
                  <p className="text-gray-500 text-sm">리뷰 분석 및 지자체 공공데이터(위생등급, 착한가격 등)를 대조한 신뢰도 검증 결과입니다.</p>
                </div>
                <button className="bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition shadow-sm flex items-center gap-2">
                  <ShieldCheck size={18} /> 전체 데이터 재검증
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                      <th className="py-4 px-6 font-semibold w-16">ID</th>
                      <th className="py-4 px-6 font-semibold w-56">장소명</th>
                      <th className="py-4 px-6 font-semibold text-center">지자체 안심식당</th>
                      <th className="py-4 px-6 font-semibold text-center">착한가격업소</th>
                      <th className="py-4 px-6 font-semibold text-center">식약처 위생등급</th>
                      <th className="py-4 px-6 font-semibold w-32 text-center">최종 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {places.filter(p => p.type === '식당' || p.type === '숙소').map((place) => (
                      <tr key={place.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 text-gray-500 font-medium">#{place.id}</td>
                        <td className="py-4 px-6 font-bold text-gray-800">{place.name}</td>
                        <td className="py-4 px-6 text-center">
                          {place.trustScore >= 90 ? <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md font-bold text-xs">인증됨</span> : <span className="text-gray-300">-</span>}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {place.trustScore >= 95 ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md font-bold text-xs">지정업소</span> : <span className="text-gray-300">-</span>}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {place.trustScore >= 85 ? <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md font-bold text-xs">매우우수(🌟🌟🌟)</span> : <span className="text-gray-300">-</span>}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {place.isSafe ? (
                            <span className="text-[#00B894] font-black flex items-center justify-center gap-1"><ShieldCheck size={16}/> PASS</span>
                          ) : (
                            <span className="text-red-500 font-black flex items-center justify-center gap-1">⚠️ FAIL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShieldCheck size={64} className="mb-4 text-gray-300 opacity-50" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">해당 기능은 아직 준비 중입니다.</h3>
              <p>베타 버전에서는 '장소 데이터 관리' 및 '리뷰 & 안심 검증' 탭이 활성화되어 있습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
