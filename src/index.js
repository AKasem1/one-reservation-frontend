import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import  { StudentsContextProvider } from './context/StudentsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <StudentsContextProvider>
        <App />
      </StudentsContextProvider>
    <App />
    </AuthContextProvider>
  </React.StrictMode>
);
