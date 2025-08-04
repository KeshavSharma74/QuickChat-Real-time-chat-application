import ChatContext from "./ChatContext";

const ChatContextProvider = async({props})=>{

    


    const value={

    }
    return (
        <ChatContext.Provider value={value} >
            {props.children}
        </ChatContext.Provider>
    )
}
export default ChatContextProvider;