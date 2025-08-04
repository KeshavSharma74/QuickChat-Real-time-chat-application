import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './context/AuthContextProvider.jsx'
import ChatContextProvider from './context/ChatContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>  
    </AuthContextProvider>
  </BrowserRouter>,
)
