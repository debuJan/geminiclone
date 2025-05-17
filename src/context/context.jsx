import { useRef, useState, useEffect } from "react";
import { Context } from "./Context";
import runChat from "../api/runchat";
import { marked } from "marked";

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [formattedResultData, setFormattedResultData] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [currentView, setCurrentView] = useState("chat");
  const [theme, setTheme] = useState("light");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSent = async (customPrompt) => {
    const promptToSend = (customPrompt || input).trim();
    if (!promptToSend) return;

    setLoading(true);
    setShowResult(true);
    setRecentPrompt(promptToSend);
    setResultData("");
    setFormattedResultData("");

    try {
      const response = await runChat(promptToSend);
      const words = response.split(" ");
      let index = 0;

      const animateWords = () => {
        if (index < words.length) {
          setResultData((prev) => prev + (prev ? " " : "") + words[index]);
          index++;
          scrollToBottom();
          setTimeout(animateWords, 30);
        } else {
          const html = marked.parse(response);
          setFormattedResultData(html);
          setLoading(false);
          scrollToBottom();
        }
      };

      animateWords();
      setInput("");

      setPrevPrompts((prev) => {
        const updated = [promptToSend, ...prev.filter((p) => p !== promptToSend)];
        return updated.slice(0, 10);
      });
    } catch (error) {
      setResultData("Something went wrong.");
      setFormattedResultData("<p>Something went wrong.</p>");
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setRecentPrompt("");
    setShowResult(false);
    setResultData("");
    setFormattedResultData("");
    setInput("");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Load theme from localStorage when app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  // Update HTML data-theme when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const contextValue = {
    input,
    setInput,
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    formattedResultData,
    messagesEndRef,
    prevPrompts,
    setRecentPrompt,
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    handleNewChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
