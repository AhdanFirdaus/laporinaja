import { useState, useEffect } from "react";
import { FiMessageSquare, FiX, FiSend } from "react-icons/fi";
import { showError } from "../Elements/Alert";

const parseMessageText = (text) => {
  const lines = text.split("\n").map((line, index) => {
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      return (
        <li key={index} className="ml-4 list-disc">
          {line.replace(/^[-*]\s/, "")}
        </li>
      );
    }
    if (line.trim().match(/^\d+\.\s/)) {
      return (
        <li key={index} className="ml-4 list-decimal">
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
    }
    return line.trim() ? (
      <p key={index} className="mb-1">
        {line}
      </p>
    ) : (
      <br key={index} />
    );
  });

  const groupedLines = [];
  let currentList = [];
  let listType = null;

  lines.forEach((line, index) => {
    if (
      line.type === "li" &&
      line.props.className.includes("list-disc") &&
      listType !== "ol"
    ) {
      if (listType !== "ul") {
        if (currentList.length) {
          groupedLines.push(
            <ul key={`ul-${index}`} className="mb-2">
              {currentList}
            </ul>
          );
          currentList = [];
        }
        listType = "ul";
      }
      currentList.push(line);
    } else if (
      line.type === "li" &&
      line.props.className.includes("list-decimal") &&
      listType !== "ul"
    ) {
      if (listType !== "ol") {
        if (currentList.length) {
          groupedLines.push(
            <ol key={`ol-${index}`} className="mb-2">
              {currentList}
            </ol>
          );
          currentList = [];
        }
        listType = "ol";
      }
      currentList.push(line);
    } else {
      if (currentList.length) {
        groupedLines.push(
          listType === "ul" ? (
            <ul key={`ul-${index}`} className="mb-2">
              {currentList}
            </ul>
          ) : (
            <ol key={`ol-${index}`} className="mb-2">
              {currentList}
            </ol>
          )
        );
        currentList = [];
        listType = null;
      }
      groupedLines.push(line);
    }
  });

  if (currentList.length) {
    groupedLines.push(
      listType === "ul" ? (
        <ul key="ul-final" className="mb-2">
          {currentList}
        </ul>
      ) : (
        <ol key="ol-final" className="mb-2">
          {currentList}
        </ol>
      )
    );
  }

  return groupedLines;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [websiteContext, setWebsiteContext] = useState("");
  const [hasWelcomed, setHasWelcomed] = useState(false);

  useEffect(() => {
    fetch("/webcontext.txt")
      .then((res) => res.text())
      .then((text) => setWebsiteContext(text))
      .catch(() => {
        showError({
          title: "Gagal memuat konteks",
          text: "Pastikan file webcontext.txt tersedia.",
          confirmButtonColor: "#d33",
        });
      });
  }, []);

  useEffect(() => {
    if (isOpen && !hasWelcomed) {
      setMessages([
        {
          sender: "bot",
          text: "Selamat datang di LaporinAja Chatbot!\nSaya di sini untuk membantu menjawab pertanyaan Anda tentang LaporinAja.\nSilakan ketik pertanyaan Anda di bawah ini.",
        },
      ]);
      setHasWelcomed(true);
    }
  }, [isOpen, hasWelcomed]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "API key not found. Ensure VITE_GEMINI_API_KEY is set in .env file."
        );
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${websiteContext}\nUser question: ${input}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error("Unexpected API response structure");
      }

      const botReply = data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Sorry, an error occurred: ${error.message}. Please check the API key or try again later.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  useEffect(() => {
    const chatDisplay = document.getElementById("chat-display");
    if (chatDisplay) {
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Chat Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-soft-orange text-white p-3 sm:p-4 rounded-full shadow-xl hover:bg-soft-orange/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer ${
          isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
        } duration-300 ease-in-out`}
        aria-label="Toggle chatbot"
      >
        <FiMessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[90vw] max-w-[24rem] h-[80vh] max-h-[28rem] sm:w-[24rem] sm:h-[28rem] rounded-xl shadow-2xl flex flex-col mt-3 animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Chat Header */}
          <div className="bg-soft-orange text-white p-3 sm:p-4 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold text-base sm:text-lg">
              LaporinAja Chatbot
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-700 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
              aria-label="Close chatbot"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Chat Display Area */}
          <div
            id="chat-display"
            className="flex-1 p-3 sm:p-5 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-2 sm:p-3 rounded-lg shadow-sm text-sm sm:text-base ${
                    msg.sender === "user"
                      ? "bg-soft-orange text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {parseMessageText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 text-gray-800 p-2 sm:p-3 rounded-lg shadow-sm max-w-[80%] text-sm sm:text-base">
                  <span className="animate-pulse">Mengetik...</span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2 rounded-b-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 sm:p-3 border focus:border-soft-orange rounded-lg focus:outline-none focus:ring focus:ring-soft-orange placeholder-gray-400 disabled:bg-gray-100 text-sm sm:text-base"
              placeholder="Tanya tentang LaporinAja..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-soft-orange text-white p-2 sm:p-3 rounded-lg hover:bg-soft-orange/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-soft-orange cursor-pointer"
              aria-label="Send message"
            >
              <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;