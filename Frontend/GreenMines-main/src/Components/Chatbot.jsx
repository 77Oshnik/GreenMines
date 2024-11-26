import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaUserCircle, FaRobot } from 'react-icons/fa';
import DOMPurify from 'dompurify';

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
    <div className="flex flex-col h-screen w-3/4 mx-auto bg-gray-300">
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && <FaRobot className="text-gray-500 w-6 h-6" />}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              } shadow`}
            >
              {message.isHTML ? renderHTMLContent(message.text) : message.text}
            </div>
            {message.isUser && <FaUserCircle className="text-blue-500 w-6 h-6" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaPaperPlane className="w-5 h-5 mr-1" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}