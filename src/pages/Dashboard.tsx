import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";




function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN SECTION */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );  
}

export default Dashboard;
