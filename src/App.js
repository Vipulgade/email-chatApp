import './App.css';
import Register from './Components/Register'; 
import Login from './Components/LoginUser';
import Chat from './Components/ChatDashBoard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Login />} /> {/* Redirect unknown routes to Login */}
      </Routes>
   
  );
}

export default App;
