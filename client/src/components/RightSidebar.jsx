const RightSideBar = ({ selectedUser }) => {
  if (!selectedUser) return null; // completely hide if no user is selected

  return (
    <div className="col-span-4 backdrop-blur-xl border border-gray-600 h-full">
      RightSideBar
    </div>
  );
};

export default RightSideBar;
