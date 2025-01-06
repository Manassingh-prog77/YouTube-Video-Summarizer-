import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [videoUrl, setVideoUrl] = useState(""); // State to capture the video URL
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    setVideoUrl(e.target.value); // Update state with the input value
  };

  // Handle button click to navigate to VideoAnalyser page
  const handleSubmit = () => {
    if (videoUrl) {
      // Check if URL is not empty
      navigate(`/video/${encodeURIComponent(videoUrl)}`); // Navigate with video URL as param
    } else {
      alert("Please enter a valid YouTube URL");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col justify-center items-center p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600 animate-text">
            DecodeTube
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform YouTube videos into concise and meaningful summaries. Enter the URL and let the magic happen!
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-lg mx-auto space-y-6">
          <input
            type="text"
            placeholder="Paste YouTube link here"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
            value={videoUrl} // Bind the state to the input
            onChange={handleInputChange} // Update state on input change
          />
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-bold shadow-lg transform transition hover:scale-105"
            onClick={handleSubmit} // Trigger navigation on click
          >
            Analyze Video
          </button>
        </div>

        {/* Decorative Divider */}
        <div className="my-16 h-0.5 w-3/4 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500"></div>

        {/* Footer Section */}
        <div className="flex items-center justify-center space-x-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
            alt="YouTube Logo"
            className="w-10 h-10 sm:w-14 sm:h-14"
          />
          <p className="text-gray-400 text-sm sm:text-lg font-light">
            Simplifying Content. One Video at a Time.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
