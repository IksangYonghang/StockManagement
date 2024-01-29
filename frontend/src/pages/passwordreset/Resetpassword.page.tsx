import React, { useState } from "react";
import axios from "axios";

const PasswordReset: React.FC = () => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/User/UpdatePassword/${username}`, {
        password: newPassword,
      });
      console.log("Password updated successfully:", response.data);
      // You might want to navigate to another page or show a success message
    } catch (error) {
      console.error("Password update failed:", error);
      // Handle the error in your app, e.g., display an error message
    }
  };

  return (
    <div>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Reset Password</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
