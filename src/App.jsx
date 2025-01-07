import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import VideoAnalyser from './Pages/VideoSummary';

function App() {
  
  return (
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:videoUrl" element={<VideoAnalyser />} />
        </Routes>
      </Router>
  );
}

export default App;
