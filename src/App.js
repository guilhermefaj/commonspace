import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import CommunityDashboard from './components/CommunityDashboard';
import MiningDashboard from './components/MiningDashboard';
import PublicAgencyDashboard from './components/PublicAgencyDashboard';
import Contact from './components/Contact';
import Forum from './components/Posts/Forum';
import PostDetail from './components/Posts/PostDetail';
import Inbox from './components/Messages/Inbox';
import Followers from './components/Company/Followers';
import SocialCases from './components/Company/SocialCases';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<CommunityDashboard />} />
            <Route path="/comunidades" element={<CommunityDashboard />} />
            <Route path="/mineradoras" element={<MiningDashboard />} />
            <Route path="/orgaos-publicos" element={<PublicAgencyDashboard />} />
            <Route path="/contato" element={<Contact />} />
            
            {/* Posts and Forum Routes */}
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/post/:postId" element={<PostDetail />} />
            
            {/* Messages Routes */}
            <Route path="/messages" element={<Inbox />} />
            <Route path="/messages/new" element={<Inbox />} />
            
            {/* Company Routes */}
            <Route path="/company/followers" element={<Followers />} />
            <Route path="/company/social-cases" element={<SocialCases />} />
            
            {/* Catch-all route for unknown paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;