import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUserCircle, FaRobot } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import Navbar from './Navbar';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Inline styles for HTML content
  const htmlStyles = `
    .parsed-html-content h3 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: #1a202c;
    }
    .parsed-html-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
    .parsed-html-content li {
      margin-bottom: 0.5rem;
      color: #2d3748;
    }
    .parsed-html-content p {
      margin-bottom: 0.75rem;
    }
  `;

  const renderHTMLContent = (htmlContent) => {
    // Sanitize the HTML content
    const cleanHTML = DOMPurify.sanitize(htmlContent);
    
    return (
      <>
        <style>{htmlStyles}</style>
        <div 
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
          className="parsed-html-content"
        />
      </>
    );
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const userMessage = { text: inputMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage('');

      try {
        const response = await axios.post('http://localhost:5000/api/chat', {
          userInput: inputMessage,
        });

        const botMessage = {
          text: response.data.response,
          isUser: false,
          isHTML: true
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = {
          text: "There was an error connecting to the chatbot. Please try again later.",
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    
    <div className="h-screen bg-[#342F49] flex items-center justify-center p-8">
      {/*<Navbar />*/}
      <div className="flex flex-col h-screen w-3/4 mx-auto bg-[#231E3D] border-[#66C5CC] rounded-lg pt-2">
        {/* Messages Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 ml-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Icon */}
              {!message.isUser && <FaRobot className="text-[#66C5CC] w-6 h-6" />}
              
              <div
  className={`w-auto max-w-full rounded-lg p-3 ${
    message.isUser
      ? 'bg-[#66C5CC] text-[#342F49] font-bold' // User message background with bold text
      : 'bg-[#7b6ba3cc] text-white font-bold' // Bot message background with bold text
  } shadow-md`}
>
                {/* Customizable font size for the message text */}
                <p className="text-base sm:text-lg md:text-xl">
                  {message.isHTML ? renderHTMLContent(message.text) : message.text}
                </p>
              </div>
            
              {/* User Icon */}
              {message.isUser && <FaUserCircle className="text-[#66C5CC] w-6 h-6" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="bg-[#3e3177] border-t border-[#66C5CC] px-6 py-6 sm:px-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 focus:ring-[#66C5CC] focus:border-[#66C5CC] block w-full rounded-md sm:text-lg border-[#4da5aa] py-3 px-4 bg-[#231E3D] text-white"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="inline-flex  font-bold items-center px-6 py-3 border border-transparent text-lg  rounded-md shadow-sm text-[#342F49] bg-[#66C5CC] hover:bg-[#4da5aa] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66C5CC]"
            >
              <FaPaperPlane className="w-6 h-6 mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}