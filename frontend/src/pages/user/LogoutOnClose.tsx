import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LogoutOnCloseProps {
  isLoggedIn: boolean;
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutOnClose: React.FC<LogoutOnCloseProps> = ({
  isLoggedIn,
  setLoginStatus,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("isLoggedIn");
    setLoginStatus(false);
    // Perform any other necessary logout operations
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log("Before unload event triggered");
    // Check conditions for logout and perform logout if needed
    // Remember, certain actions may not be allowed here due to browser restrictions
    // Add appropriate logic based on the openTabs array or other conditions
  };

  const handleVisibilityChange = () => {
    console.log("Visibility change detected");
    // Check visibility state and perform logout if needed
  };

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setLoginStatus(true); // Update React state if the user was logged in
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setLoginStatus]);

  return null;
};

export default LogoutOnClose;
