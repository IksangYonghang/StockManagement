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
    //console.log("Logging out...");
    localStorage.removeItem("isLoggedIn");
    setLoginStatus(false);
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log("Before unload event triggered");
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      // This tab has become hidden, indicating the user switched to another tab or closed the browser
      // Check if all tabs are hidden
      if (!document.hidden) {
        // At least one tab is still visible
        // Update a value in localStorage to indicate that at least one tab is still open
        localStorage.setItem("appTabOpen", "true");
      } else {
        // All tabs are hidden, indicating that the user has closed all tabs related to the application
        // Perform logout
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setLoginStatus(true); // Update React state if the user was logged in
    }

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      // Remove event listener when component unmounts
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setLoginStatus]);

  return null;
};

export default LogoutOnClose;
