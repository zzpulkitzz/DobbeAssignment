
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dobbe from './Dobbe';
import Login from './Login';
import WhatsAppRegistration from './Whatsapp';
function App() {
  return (
    <div className="min-w-screen">
    <Router>
      <Routes>
        <Route path="/" element={<Dobbe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/whatsapp" element={<WhatsAppRegistration />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
