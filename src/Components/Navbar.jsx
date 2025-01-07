import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check session logic here, if needed
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Login handler (modified to use Hasura API)
  const handleLogin = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HASURA_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": import.meta.env.VITE_HASURA_SECRET,
        },
        body: JSON.stringify({
          query: `
            mutation {
              signIn(credentials: {email: "${email}", password: "${password}"}){
                session{
                   accessToken
                   accessTokenExpiresIn
                   refreshToken
                   refreshTokenId
                   user{
                   avatarUrl
                   displayName
                   email
                   }
                }
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (data.errors) {
        setError(data.errors[0].message); // Show error message
      } else {
        const token = data.data.signIn.session.refreshToken;
        localStorage.setItem("authToken", token); // Store token in localStorage
        alert("Login successful");
        setIsLoggedIn(true); // User logged in successfully
        setShowModal(false);
        navigate("/"); // Redirect to dashboard after login
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  // Create account handler (modified to use Hasura API)
  const handleCreateAccount = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_HASURA_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": import.meta.env.VITE_HASURA_SECRET,
        },
        body: JSON.stringify({
          query: `
            mutation {
              signUp(newuser: {email: "${email}", password: "${password}"}) {
                success
              }
            }
          `,
        }),
      });

      const data = await response.json();
      if (data.errors) {
        setError(data.errors[0].message); // Show error message
      } else {
        setSuccessMessage(
          "Account created successfully. A verification email has been sent."
        );
        setIsCreatingAccount(false); // Switch to login modal after account creation
      }
    } catch (err) {
      console.error(err);
      setError("Account creation failed");
    }
  };

  // Log out handler (modified to use Hasura API)
  const handleLogout = async () => {
    try {
      // Clear auth token from localStorage
      localStorage.removeItem("authToken");
      setIsLoggedIn(false); // Update state to reflect logout
      alert("Logged out successfully");
    } catch (err) {
      console.error(err);
      alert("Error logging out");
    }
  };

  return (
    <nav className="bg-[#181818] text-white w-full py-4 px-6 flex items-center justify-between shadow-lg border-b border-gray-700">
      {/* Left Section - Website Title */}
      <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 animate-text hover:scale-105 transition duration-300 cursor-pointer">
        YouTube Video Analyzer
      </h1>

      {/* Right Section - Login or Logout Button */}
      {isLoggedIn ? (
        <button
          className="px-6 py-2 text-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-110 hover:shadow-lg"
          onClick={handleLogout}
        >
          Log Out
        </button>
      ) : (
        <button
          className="px-6 py-2 text-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-110 hover:shadow-lg"
          onClick={() => setShowModal(true)}
        >
          Login
        </button>
      )}

      {/* Modal for Login */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#202020] p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl text-center text-white mb-4">
              {isCreatingAccount ? "Create Account" : "Login"}
            </h2>

            {successMessage && (
              <p className="text-green-500 text-center mb-4">
                {successMessage}
              </p>
            )}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-[#333333] text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-[#333333] text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              {isCreatingAccount ? (
                <button
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg"
                  onClick={handleCreateAccount}
                >
                  Create Account
                </button>
              ) : (
                <button
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg"
                  onClick={handleLogin}
                >
                  Login
                </button>
              )}

              <button
                className="px-6 py-2 bg-gray-600 text-white rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 text-center">
              {isCreatingAccount ? (
                <p className="text-white">
                  Already have an account?{" "}
                  <span
                    className="text-cyan-500 cursor-pointer"
                    onClick={() => setIsCreatingAccount(false)}
                  >
                    Login
                  </span>
                </p>
              ) : (
                <p className="text-white">
                  {"Don't"} have an account?{" "}
                  <span
                    className="text-cyan-500 cursor-pointer"
                    onClick={() => setIsCreatingAccount(true)}
                  >
                    Create one
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
