import assets from "../assets/assets";

const ChatContainer = ({ selectedUser }) => {
  return (
    <div
      className={`backdrop-blur-xl border-gray-600 h-full ${
        selectedUser ? 'col-span-8' : 'col-span-8'
      }`}
    >
      {
        selectedUser? (<div className="flex flex-col">
          <div className="flex p-4 justify-between items-center">
            <div className="flex gap-2 items-center">
              <img src={selectedUser?.profilePic || assets.avatar_icon} className="w-8 rounded-full "  alt="" />
              <span className="text-white">{selectedUser.fullName}</span>
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
            </div>
            <img src={assets.help_icon} className="w-5 h-5" alt="" />
          </div>
          <hr className="mx-4 border border-gray-600" />
        </div>):(<div className="bg-white/10 h-full flex flex-col justify-center items-center text-gray-500">
          <img src={assets.logo_icon} className="max-w-16" alt="" />
          <span className="text-white text-[1.5rem]">Chat Anytime, anywhere</span>
        </div>)
      }
    </div>
  );
};

export default ChatContainer;
