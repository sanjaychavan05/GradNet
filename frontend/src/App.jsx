import './app.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Login from './pages/LoginPage';
import VerifyOtp from './pages/VerifyOtp';
import CreateProfilePage from './pages/CreaeteProfilePage';

import HomePage from './pages/Home';

import AlumniListPage from './pages/AlumniList';

import JobsPage from './pages/JobsPage';

import BookmarksPage from './pages/BookmarksPage';

import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';

import ForumPostPage from './pages/ForumPostPage';
import ForumPage from './pages/ForumPage';
import ForumTopicPage from './pages/ForumTopicPage';

import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';

import MentorshipPage from './pages/MentorshipPage';
import MyMentorsPage from './pages/MyMentorsPage';
import MentorDashboard from './pages/MentorDashboard';

import AdminDashboard from './pages/AdminDashboard';

import TermsOfService from './pages/TermsOfService';

//Context
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 2000,
          borderRadius: '50%',
          backdropFilter: 'blur(6px)',
        }}>
        </div>

        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/submit-auth-info" element={<VerifyOtp />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />


          <Route path="/home" element={<HomePage />} />
          <Route path="/alumni-list" element={<AlumniListPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:handle" element={<UserProfilePage />} />

          <Route path="/forums" element={<ForumPage />} />
          <Route path="/forums/:forumId" element={<ForumTopicPage />} />
          <Route path="/topic/:topicId" element={<ForumPostPage />} />

          <Route path="/messages" element={<MessagesPage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/mentorships" element={<MentorshipPage />} />
          <Route path="/my-mentorships" element={<MyMentorsPage />} />
          <Route path="/mentorship-dashboard" element={<MentorDashboard />} />

          <Route path="/admin" element={<AdminDashboard />} />  

          <Route path="/terms" element={<TermsOfService />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
