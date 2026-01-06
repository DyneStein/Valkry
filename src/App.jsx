import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import Dashboard from './pages/Dashboard';
import LeaderboardPage from './pages/LeaderboardPage';
import ArenaPage from './pages/ArenaPage';
import LearningPage from './pages/LearningPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import FriendsPage from './pages/FriendsPage';
import VisualizerPage from './pages/VisualizerPage';
import GroupBattlePage from './pages/GroupBattlePage';
import TeamBattleArena from './pages/TeamBattleArena';
import DocsPage from './pages/DocsPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/arena" element={<ArenaPage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/features" element={<LandingPage />} />
            <Route path="/visualizer" element={<VisualizerPage />} />
            <Route path="/group-battle" element={<GroupBattlePage />} />
            <Route path="/group-battle/:lobbyId" element={<GroupBattlePage />} />
            <Route path="/team-battle/:lobbyId/:groupId" element={<TeamBattleArena />} />
            <Route path="/docs" element={<DocsPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
