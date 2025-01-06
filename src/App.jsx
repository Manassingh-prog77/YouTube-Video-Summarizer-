import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NhostProvider } from '@nhost/react';
import { nhost } from './lib/nhost';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import VideoAnalyser from './Pages/VideoSummary';

function App() {
  
  return (
    <NhostProvider nhost={nhost}>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:videoUrl" element={<VideoAnalyser />} />
        </Routes>
      </Router>
    </NhostProvider>
  );
}

export default App;
