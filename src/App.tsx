import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import ResultModal from './components/ResultModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './pages/AdminDashboard';
import AutoLikeHistory from './pages/AutoLikeHistory';
import History from './pages/History';
import UserManagement from './pages/UserManagement';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLikeRequest = async (uid: string) => {
    setLoading(true);

    try {
      if (uid === '69') {
        setTimeout(() => {
          setResult({
            player: 'DemoPlayer',
            likes_before: Math.floor(Math.random() * 10000) + 5000,
            likes_after: Math.floor(Math.random() * 10000) + 5100,
            success_count: 100,
            status: 1,
            message: 'Likes sent successfully!'
          });
          setShowResultModal(true);
          setLoading(false);
        }, 1500);
        return;
      }

      if (uid === '96') {
        setTimeout(() => {
          const nextAvailable = new Date();
          nextAvailable.setHours(nextAvailable.getHours() + 24);

          setResult({
            status: 0,
            message: 'You have already requested likes for this UID today. Please try again tomorrow.',
            next_available: nextAvailable.toISOString()
          });
          setShowResultModal(true);
          setLoading(false);
        }, 1500);
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const token = (await import('./lib/supabase')).supabase.auth
        .getSession()
        .then((session) => session.data.session?.access_token);

      const response = await fetch(
        `${supabaseUrl}/functions/v1/process-likes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await token}`,
            apikey: supabaseAnonKey,
          },
          body: JSON.stringify({ uid }),
        }
      );

      const data = await response.json();
      setResult(data);
      setShowResultModal(true);
      if (data.status === 1) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error processing like request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-black">
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <MenuBar onAuthClick={() => setShowAuthModal(true)} />
          </div>
          <Routes>
            <Route path="/" element={<HeroSection onSubmit={handleLikeRequest} loading={loading} refreshTrigger={refreshTrigger} />} />
            <Route path="/history" element={<History />} />
            <Route path="/auto-like-history" element={<AutoLikeHistory />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
          <ResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            result={result}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
