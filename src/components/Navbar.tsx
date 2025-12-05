import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";
import { logout } from "../features/auth/authSlice";
import { selectUser } from "../features/auth/authSelectors";
import Avatar from "@mui/material/Avatar";
import profilePic from "../assets/1763278553063.jpeg";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfile = () => {
    // Profile action - inactive for now
    console.log("Profile clicked - coming soon");
  };

  const menuOptions = [
    {
      label: "Profile",
      onClick: handleProfile,
      disabled: true, // Inactive for now
      className: "opacity-50",
    },
    {
      label: "Logout",
      onClick: handleLogout,
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <div className="h-16 bg-slate-800 text-white flex items-center justify-between px-6 shadow-md sticky top-0 z-50">
      <h1 className="text-xl font-semibold">My Dashboard</h1>
      {/* Step 5: Display user information if available */}
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm ml-auto">Welcome,</span>
          <span className="font-semibold">
            {capitalize(user.name ?? "User")}
          </span>
          <UserMenu
            trigger={
              <Avatar
                alt={user.name}
                src={user.profilePicUrl || profilePic}
                sx={{ width: 32, height: 32, cursor: "pointer" }}
              />
            }
            options={menuOptions}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
