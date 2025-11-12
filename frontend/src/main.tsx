import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import Chats from './pages/Chats';
import ChatView from './pages/ChatView';
import Home from './pages/Home';
import Login from './pages/Login';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Register from './pages/Register';
import { AuthProvider } from './providers/authProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
