import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Bounce, ToastContainer } from 'react-toastify';
import ChatBot from './pages/chatbot/Chatbot';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <>
    <App />
    <ChatBot />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      style={{ zIndex: "20000" }}
    />
  </>
  // </React.StrictMode>
);

reportWebVitals();
