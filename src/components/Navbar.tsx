import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";
import { logout } from "../features/auth/authSlice";
import { selectUser } from "../features/auth/authSelectors";

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
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
