"use client";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import { MessageCircle, X, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I assist you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const playSendSound = () => {
    new Audio("/sound/send.mp3").play();
  };

  const playReceiveSound = () => {
    new Audio("/sound/send.mp3").play();
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setSessionId(
        user ? user.uid : `guest_${Math.random().toString(36).slice(2)}`
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    playSendSound();
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, sessionId }),
      });
      const data = await response.json();
      const botMessage = { text: data.response, isUser: false };
      setMessages((prev) => [...prev, botMessage]);
      playReceiveSound();
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Try again!",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="open"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition"
            aria-label="Open chatbot"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        ) : (
          <motion.div
            key="chatbot"
            drag
            dragConstraints={{
              top: -1000,
              bottom: 1000,
              left: -1000,
              right: 1000,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-[90vw] max-w-md h-[75vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 cursor-grab bg-orange-500 text-white">
              <h3 className="font-semibold">Yumcycle Assistant</h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-md text-sm ${
                    msg.isUser
                      ? "bg-orange-100 ml-auto text-right"
                      : "bg-white border mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="bg-white border text-sm px-4 py-2 rounded-2xl shadow-md max-w-[60%] mr-auto flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ask me anything..."
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                >
                  <SendHorizonal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
