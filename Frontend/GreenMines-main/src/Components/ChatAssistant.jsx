
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatAssistant = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot");  // On click, navigate to the /chatbot page
  };

  return (
    <div
      className="fixed bottom-24 right-8 w-48 min-h-20 bg-[#2697d8] text-black font-bold p-3 rounded-lg shadow-lg z-50
                 flex items-center justify-center text-xl text-center cursor-pointer"
      onClick={handleClick}
    >
      CHAT ASSISTANT
    </div>
  );
};

export default ChatAssistant;
