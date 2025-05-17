import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';
import './Sidebar.css';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'help' | 'activity' | 'settings'
  const {
    onSent,
    prevPrompts,
    setRecentPrompt,
    theme,
    toggleTheme,
    handleNewChat
  } = useContext(Context);

  // Load prompt into input + run it
  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const Modal = ({ title, children }) => (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}
        <button onClick={() => setActiveModal(null)}>Close</button>
      </div>
    </div>
  );

  return (
    <div className={`sidebar ${extended ? 'extended' : ''}`}>
      {/* Top Section */}
      <div className="top">
        <img
          className="menu"
          src={assets.menu_icon}
          alt="Toggle Sidebar"
          onClick={() => setExtended((prev) => !prev)}
        />

        <div className="new-chat" onClick={() => {
          handleNewChat();
          setExtended(false);
        }}>
          <img src={assets.plus_icon} alt="New Chat" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.length === 0 ? (
              <p className="empty-text">No recent prompts</p>
            ) : (
              prevPrompts.map((item, index) => (
                <div
                  key={index}
                  className="recent-entry"
                  onClick={() => loadPrompt(item)}
                >
                  <img src={assets.message_icon} alt="Prompt" />
                  <p>{item.slice(0, 18)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="bottom">
        <div className="bottom-item recent-entry" onClick={() => setActiveModal("help")}>
          <img src={assets.question_icon} alt="Help" />
          {extended && <p>Help</p>}
        </div>
        <div className="bottom-item recent-entry" onClick={() => setActiveModal("activity")}>
          <img src={assets.history_icon} alt="Activity" />
          {extended && <p>Activity</p>}
        </div>
        <div className="bottom-item recent-entry" onClick={() => setActiveModal("settings")}>
          <img src={assets.setting_icon} alt="Settings" />
          {extended && <p>Settings</p>}
        </div>
      </div>

      {/* Modal Overlays */}
      {activeModal === "help" && (
        <Modal title="Help">
          <p>Need help? Try asking things like:</p>
          <ul>
            <li>“Summarize this code…”</li>
            <li>“Explain quantum computing…”</li>
            <li>“How do I deploy on Netlify?”</li>
          </ul>
        </Modal>
      )}

      {activeModal === "activity" && (
        <Modal title="Recent Activity">
          {prevPrompts.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            <ul>
              {prevPrompts.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </Modal>
      )}

      {activeModal === "settings" && (
        <Modal title="Settings">
          <label>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            Dark Mode
          </label>
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
