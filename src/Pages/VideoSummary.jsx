import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VideoAnalyser() {
  const { videoUrl } = useParams(); // Get the video URL from URL parameters
  const [videoSummary, setVideoSummary] = useState("Loading video summary...");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for the API call
  const navigate = useNavigate(); // To navigate programmatically

  // Function to validate YouTube URL and extract video ID
  const extractVideoId = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\/videos\/|e\/|shorts\/)?([a-zA-Z0-9_-]{11})/;
    const match = url?.match(youtubeRegex);
    return match ? match[6] : null;
  };

  // Fetch the video summary from GraphQL API
  const fetchVideoSummary = async (videoId) => {
    // Retrieve the token from storage
  const token = localStorage.getItem("authToken");

  // Check if the token exists
  if (!token) {
    alert("Please log in first to view the Video Summary.");
    navigate("/")
    return; // Exit the function if no token is present
  }

    const query = `
      mutation {
        description(videoId: "${videoId}") {
          output
        }
      }
    `;
    
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_HASURA_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": import.meta.env.VITE_HASURA_SECRET, 
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.errors) {
        setErrorMessage("Unable to fetch description.");
        setVideoSummary("");
      } else {
        // Assuming 'output' is the description we need
        console.log(data)
        const summary = data.data.description.output || "No description available.";
        setVideoSummary(summary);
        setErrorMessage("");
      }
    } catch (error) {
      console.log("Error fetching video summary:", error.message);
      setErrorMessage("Unable to show description for this video. Try another link.");
      setVideoSummary("");
    } finally {
      setLoading(false);
    }
  };

  // Handle the video URL and extract the video ID
  useEffect(() => {
    if (videoUrl) {
      const videoId = extractVideoId(videoUrl);
      if (videoId) {
        fetchVideoSummary(videoId); // Fetch video summary using the video ID
        setErrorMessage("");
      } else {
        setErrorMessage("Please provide a complete and correct YouTube video URL.");
        setVideoSummary(""); // Clear any existing summary
      }
    }
  }, [videoUrl]);

  return (
    <div className="bg-[#181818] text-white w-full h-screen flex flex-col items-center py-6 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // This will navigate to the previous page
        className="absolute top-18 left-6 bg-transparent text-white p-2 rounded-full border-2 border-yellow-500 hover:bg-gray-800 hover:border-yellow-600 transition"
      >
        <span className="text-xl">&larr; Back</span>
      </button>

      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 mb-6">
        Video Summary
      </h1>

      <div className="w-full max-w-4xl p-6 bg-black rounded-lg border-4 border-yellow-500 shadow-lg">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Video Summary</h2>
        </div>

        <div className="bg-[#333333] p-4 rounded-lg border border-gold-500">
          {/* Show loader while the API is loading */}
          {loading ? (
            <div className="text-center text-white text-lg">
              <p>Loading...</p>
              {/* Loader animation */}
              <div className="spinner-border animate-spin border-4 border-t-4 border-yellow-500 w-8 h-8 rounded-full mx-auto"></div>
            </div>
          ) : errorMessage ? (
            // Show error message if API call fails
            <p className="text-red-500 text-lg">{errorMessage}</p>
          ) : (
            // Show the video summary content
            <p className="text-white text-lg">{videoSummary}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoAnalyser;
