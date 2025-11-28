const Sidebar = () => {
  return (
    <div className="w-60 bg-slate-100 h-full border-r border-gray-300 p-4">
      <ul className="space-y-4">
        <li className="cursor-pointer hover:text-blue-600">Home</li>
        <li className="cursor-pointer hover:text-blue-600">Profile</li>
        <li className="cursor-pointer hover:text-blue-600">Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
