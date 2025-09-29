"use client";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/libs/firebase-client";
import {
  MessageCircle,
  X,
  SendHorizonal,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I assist you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const chatEndRef = useRef(null);

  // FAQ Questions
  const faqQuestions = [
    {
      id: 1,
      question: "How do I place an order?",
      icon: "",
      category: "ordering",
    },
    {
      id: 2,
      question: "What are surplus items?",
      icon: "",
      category: "surplus",
    },
    {
      id: 3,
      question: "How does delivery work?",
      icon: "",
      category: "delivery",
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      icon: "",
      category: "payment",
    },
    {
      id: 5,
      question: "How can I track my order?",
      icon: "",
      category: "tracking",
    },
    {
      id: 6,
      question: "What is your refund policy?",
      icon: "",
      category: "refund",
    },
    {
      id: 7,
      question: "How do I become a restaurant partner?",
      icon: "",
      category: "partner",
    },
    {
      id: 8,
      question: "Can I pay cash on delivery for my order?",
      icon: "",
      category: "payment",
    },
    {
      id: 10,
      question: "Other questions",
      icon: "",
      category: "custom",
      isCustom: true,
    },
  ];

  const playSendSound = () => {
    try {
      new Audio("/sound/send.mp3").play().catch(() => {});
    } catch (e) {}
  };

  const playReceiveSound = () => {
    try {
      new Audio("/sound/send.mp3").play().catch(() => {});
    } catch (e) {}
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

  const handleFAQClick = async (question) => {
    if (question.isCustom) {
      setShowCustomInput(true);
      return;
    }

    const userMessage = { text: question.question, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    playSendSound();
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question.question, sessionId }),
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

  const sendCustomMessage = async () => {
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

  const handleBackToFAQ = () => {
    setShowCustomInput(false);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="open"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="relative p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 group"
            aria-label="Open chatbot"
          >
            <MessageCircle className="h-7 w-7" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
            />
          </motion.button>
        ) : (
          <motion.div
            key="chatbot"
            drag
            dragConstraints={{
              top: -window.innerHeight + 600,
              bottom: 0,
              left: -window.innerWidth + 400,
              right: 0,
            }}
            dragElastic={0.1}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[90vw] max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 cursor-grab active:cursor-grabbing bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10 flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">YumCycle Assistant</h3>
                  <p className="text-xs text-orange-100">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCustomInput(false);
                }}
                className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.isUser
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-auto"
                        : "bg-white border border-gray-200 mr-auto"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-gray-200 text-sm px-4 py-3 rounded-2xl shadow-sm max-w-[60%] mr-auto"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0s]" />
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* FAQ Questions or Custom Input */}
            <div className="p-4 border-t bg-white">
              {!showCustomInput ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    How can we help you?
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {faqQuestions.map((faq) => (
                      <motion.button
                        key={faq.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFAQClick(faq)}
                        className={`p-3 rounded-xl text-left transition-all duration-200 ${
                          faq.isCustom
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg col-span-2"
                            : "bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{faq.icon}</span>
                          <span className="text-xs font-medium line-clamp-2">
                            {faq.question}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleBackToFAQ}
                    className="flex items-center space-x-2 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to FAQ</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && sendCustomMessage()
                      }
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      placeholder="Type your question..."
                      autoFocus
                    />
                    <button
                      onClick={sendCustomMessage}
                      disabled={!input.trim()}
                      className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <SendHorizonal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
