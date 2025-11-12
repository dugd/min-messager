import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from './components/deprecated/PrivateRoute';
import { AuthProvider } from './context/authContext';
import './index.css';
import Chats from './pages/Chats';
import ChatView from './pages/ChatView';
import Home from './pages/Home';
import Login from './pages/Login';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Register from './pages/Register';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/chats" element={<Chats/>}/>
          <Route path="/chats/:id" element={<ChatView/>}/>
          <Route path="/posts" element={<Posts/>}/>
          <Route path="/profile/:username" element={<Profile/>}/>
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
