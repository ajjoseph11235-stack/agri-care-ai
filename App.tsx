
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import HomeView from './components/HomeView.tsx';
import DiseaseScanner from './components/DiseaseScanner.tsx';
import NutrientAnalyzer from './components/NutrientAnalyzer.tsx';
import SoilAnalyzer from './components/SoilAnalyzer.tsx';
import GardenCare from './components/GardenCare.tsx';
import WeatherView from './components/WeatherView.tsx';
import HistoryView from './components/HistoryView.tsx';
import ChatBot from './components/ChatBot.tsx';
import CCTVMonitor from './components/CCTVMonitor.tsx';
import { AppView, HistoryItem } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('agri_intel_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    localStorage.setItem('agri_intel_history', JSON.stringify(updated));
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView setView={setCurrentView} />;
      case 'disease': return <DiseaseScanner onResult={(title, content, img) => addToHistory({ type: 'disease', title, content, imageUrl: img })} />;
      case 'nutrient': return <NutrientAnalyzer onResult={(title, content, img) => addToHistory({ type: 'nutrient', title, content, imageUrl: img })} />;
      case 'soil': return <SoilAnalyzer onResult={(title, content) => addToHistory({ type: 'soil', title, content })} />;
      case 'garden': return <GardenCare onResult={(title, content) => addToHistory({ type: 'garden', title, content })} />;
      case 'weather': return <WeatherView />;
      case 'cctv': return <CCTVMonitor onAlert={(animal, desc, img) => addToHistory({ type: 'cctv', title: `INTRUSION: ${animal}`, content: desc, imageUrl: img })} />;
      case 'history': return <HistoryView history={history} clearHistory={() => { setHistory([]); localStorage.removeItem('agri_intel_history'); }} />;
      case 'chat': return <ChatBot />;
      default: return <HomeView setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView={currentView} setView={setCurrentView} />
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
