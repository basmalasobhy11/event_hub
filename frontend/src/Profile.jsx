import "./styles/Profile.css";

export default function Profile({ user, onLogout }) {
  const savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const currentUser = user || savedUser;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {currentUser?.email?.charAt(0).toUpperCase() || "U"}
        </div>

        <h1>My Profile</h1>

        <div className="profile-info">
          <div className="profile-row">
            <span>Email</span>
            <strong>
              {currentUser?.email || "Not available"}
            </strong>
          </div>

          <div className="profile-row">
            <span>User ID</span>
            <strong>
              {currentUser?.id || "Available after registration"}
            </strong>
          </div>

          <div className="profile-row">
            <span>Account</span>
            <strong>Active</strong>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}