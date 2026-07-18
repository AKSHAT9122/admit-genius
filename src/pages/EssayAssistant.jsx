import { useState } from 'react';
import { Wand2, MessageSquare, Check, FileText, Send, Loader2 } from 'lucide-react';

export default function EssayAssistant() {
  const [essayText, setEssayText] = useState("Ever since I was young, I liked computers. I want to go to your school to learn more about them.");
  const [activeTab, setActiveTab] = useState('chat'); // Default to chat
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your admissions coach. To help you brainstorm a powerful essay, let's start with a simple question: What specific academic interests are pulling you toward this university?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I lost connection to the server." }]);
    }
    setIsTyping(false);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 4rem)', gap: '2rem' }}>
      
      {/* Left: Text Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Statement of Purpose</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Target: Stanford University (Word Count: {essayText.split(' ').filter(w => w).length})</p>
          </div>
          <button className="btn btn-primary"><Wand2 size={16} /> Optimize Essay</button>
        </header>
        
        <textarea 
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          style={{
            flex: 1,
            resize: 'none',
            padding: '2rem',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}
          placeholder="Start writing your essay here..."
        />
      </div>

      {/* Right: Copilot */}
      <div style={{ width: '400px', background: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        
        {/* Copilot Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveTab('chat')}
            style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'chat' ? 'var(--secondary-blue)' : 'transparent', color: activeTab === 'chat' ? 'var(--primary-blue)' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}
          >
            <MessageSquare size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Brainstorm
          </button>
          <button 
            onClick={() => setActiveTab('feedback')}
            style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'feedback' ? 'var(--secondary-blue)' : 'transparent', color: activeTab === 'feedback' ? 'var(--primary-blue)' : 'var(--text-secondary)', fontWeight: '600', cursor: 'pointer' }}
          >
            <FileText size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Analysis
          </button>
        </div>

        {/* Copilot Content */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', background: 'var(--bg-light-gray)' }}>
          {activeTab === 'feedback' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: '1rem' }}>
                 <h4 style={{ color: 'var(--warning-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Weak Hook
                 </h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    "Ever since I was young, I liked computers" is a very cliché opening. Try starting with a specific anecdote about a project you built.
                 </p>
              </div>
              <div className="card" style={{ padding: '1rem' }}>
                 <h4 style={{ color: 'var(--success-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} /> Grammar Perfect
                 </h4>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    No grammatical errors detected in the current draft.
                 </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '4px' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ 
                    background: m.role === 'user' ? 'var(--primary-blue)' : 'var(--bg-white)', 
                    color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                    padding: '12px', 
                    borderRadius: m.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0', 
                    border: m.role === 'user' ? 'none' : '1px solid var(--border-color)', 
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', 
                    maxWidth: '85%' 
                  }}>
                     <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{m.content}</p>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <Loader2 className="animate-spin" size={14} /> Typing...
                  </div>
                )}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                 <input 
                   type="text" 
                   placeholder="Type your answer..." 
                   style={{ padding: '10px', fontSize: '0.9rem' }} 
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                 />
                 <button className="btn btn-primary" style={{ padding: '10px' }} onClick={sendMessage}>
                   <Send size={18} />
                 </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
