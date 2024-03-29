import React, { useState, FormEvent, useEffect } from "react";
import Background from "../../images/background.jpg";
import LoginImg from "../../images/login.png";
import { Link, useNavigate } from "react-router-dom";
import { ILogin } from "../../types/global.typing";
import httpModule from "../../helpers/http.module";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NepaliDateConverter from "nepali-date-converter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginProps {
  handleLoginStatus: (status: boolean) => void;
  isLoggedIn: boolean;
}
interface DateDisplayProps {
  style?: React.CSSProperties;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ style }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nepaliDate, setNepaliDate] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);

      const convertedDate = new NepaliDateConverter(now);
      const nepaliYear = convertedDate.getYear().toString();
      const nepaliMonth = (convertedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const nepaliDay = convertedDate.getDate().toString().padStart(2, "0");

      setNepaliDate(`${nepaliYear}/${nepaliMonth}/${nepaliDay}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dateDisplayStyle: React.CSSProperties = {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    marginBottom: "-6rem",
    marginRight: "720px",
    ...(style || {}),
  };

  return (
    <div style={dateDisplayStyle}>
      <p>Date : {nepaliDate}</p>
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ handleLoginStatus, isLoggedIn }) => {
  const redirect = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isFormHovered, setIsFormHovered] = useState(false);
  const [login, setLogin] = useState<ILogin>({
    userName: "",
    password: "",
  });

  const formHoverStyle = {
    transition: "transform 0.3s ease-in-out",
    transform: isFormHovered ? "scale(1.25)" : "scale(1)",
  };

  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxLoginAttempts = 5;
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      handleLoginStatus(true);
      redirect("/");
    }
  }, [isLoggedIn, redirect, handleLoginStatus]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await httpModule.post("/User/Login", {
        userName: username,
        password: password,
      });

      const token = response.data;
      const userData = await fetchUserData(username);

      localStorage.setItem("token", token);
      localStorage.setItem("userName", username);
      localStorage.setItem("userId", userData.id);

      const welcomeMessage = `Welcome, ${username}!`;

      toast.success(welcomeMessage, {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleLoginStatus(true);
      setLoginAttempts(0);
      setShowError(false);
      redirect("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginAttempts(loginAttempts + 1);
      if (loginAttempts + 1 >= maxLoginAttempts) {
        setShowError(true);
        if (
          window.confirm(
            "Too many wrong attempts, do you want to reset the password?"
          )
        ) {
          redirect("/reset-password");
        }
      } else if (
        error.response &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        setLoginError(true);
        alert("User not found. Please check your username and try again.");
      } else if (
        error.response &&
        "status" in error.response &&
        error.response.status === 400
      ) {
        setLoginError(true);
        alert("Incorrect password. Please check your password and try again.");
      }
    }
  };
  const fetchUserData = async (username: string) => {
    try {
      const userResponse = await httpModule.get(
        `/User/GetByUsername?username=${username}`
      );
      return userResponse.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user data");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const handleForgotPassword = () => {
    redirect("/reset-password");
  };

  const formContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "999",
    position: "absolute" as "absolute",
    inset: "0",
    minHeight: "100vh",
    background: `url(${Background})`,
    backgroundSize: "cover",
  };

  const formStyle = {
    width: "40%",
    margin: "0 auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 6)",
    zIndex: 1,
    transition: "transform 0.3s ease-in-out",
    transform: isFormHovered ? "scale(1.25)" : "scale(1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "25px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    textAlign: "center" as const,
    fontSize: "15px",
  };

  const buttonStyle = {
    padding: "12px 30px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
    marginLeft: "5px",
    font: "bold",
  };

  const forgotPasswordStyle = {
    display: "block",
    marginTop: "15px",
    color: "#3498db",
    textDecoration: "none",
    marginBottom: "30px",
    marginLeft: "50px",
  };

  const signUpButtonStyle = {
    padding: "12px 20px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginLeft: "30px",
  };
  const imageBackgroundStyle = {
    background: `url(${LoginImg})`,
    backgroundSize: "cover",
  };
  const leftSectionStyle = {
    width: "50%",
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
    overflow: "hidden",
    ...imageBackgroundStyle,
  };

  return (
    <div style={formContainerStyle}>
      <DateDisplay
        style={{
          color: "purple",
          fontWeight: "bold",
          fontSize: "20px",
          position: "absolute",
          bottom: "20px",
          right: "20px",
        }}
      />
      <form
        style={{ ...formStyle, ...formHoverStyle }}
        onMouseEnter={() => setIsFormHovered(true)}
        onMouseLeave={() => {
          setIsFormHovered(false);
          setTimeout(() => setIsFormHovered(false), 0);
        }}
        onSubmit={handleLogin}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
          <div style={{ ...leftSectionStyle }}>
            <h2
              style={{
                color: "white",
                textAlign: "center",
                marginTop: "100px",
                fontSize: "2rem",
                fontFamily: "serif, Times New Roman",
                textShadow: "0 0 10px #000, 0 0 20px #000, 0 0 30px #000",
              }}
            >
              Inventory Management System
            </h2>
          </div>

          <div style={{ width: "50%", padding: "60px" }}>
            <div>
              <input
                type="text"
                id="username"
                placeholder="👤 Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="🔒 Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "35%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
            <a
              href="#"
              onClick={handleForgotPassword}
              style={forgotPasswordStyle}
            >
              Forgot Password?
            </a>
            <button type="submit" style={buttonStyle}>
              Login
            </button>
            <Link to="/register">
              <button type="button" style={signUpButtonStyle}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
