import { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mic, Send, ArrowLeft, FileSearch, Sparkles, User, Bot, StopCircle } from 'lucide-react';

export default function MockInterview() {
  const { token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scanId = searchParams.get('scanId');

  const [scanData, setScanData] = useState(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Fetch scan data and start interview when scanId is present
  useEffect(() => {
    if (!scanId) return;

    const fetchAndStart = async () => {
      setLoadingScan(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/interview/scan/${scanId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setScanData(res.data);
        
        // Start the interview with an initial greeting
        setIsTyping(true);
        const chatRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/chat`, {
          scanId,
          messages: []
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessages([{ role: 'assistant', content: chatRes.data.reply, timestamp: new Date() }]);
        setInterviewStarted(true);
      } catch (err) {
        console.error('Failed to start interview:', err);
        alert(err.response?.data?.error || 'Failed to start interview session.');
      } finally {
        setLoadingScan(false);
        setIsTyping(false);
      }
    };

    fetchAndStart();
  }, [scanId, token]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping || interviewEnded) return;

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Send only role and content to the API
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/chat`, {
        scanId,
        messages: apiMessages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply, timestamp: new Date() }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an issue. Could you please repeat your last response?', 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const endInterview = async () => {
    if (isTyping || interviewEnded) return;

    setIsTyping(true);
    const endMessage = { role: 'user', content: 'END_INTERVIEW', timestamp: new Date() };
    const updatedMessages = [...messages, endMessage];

    try {
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/chat`, {
        scanId,
        messages: apiMessages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply, timestamp: new Date() }]);
      setInterviewEnded(true);
    } catch (err) {
      console.error('End interview error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format message content with basic markdown-like formatting
  const formatContent = (text) => {
    // Bold text
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet points
    formatted = formatted.replace(/^• /gm, '<span class="text-indigo-400 mr-1">•</span>');
    return formatted;
  };

  // ─── MODE 1: No scan context ───
  if (!scanId) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 relative z-10 animate-fade-in">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-xl p-10 relative overflow-hidden animate-slide-up">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-cyan-400/15 to-indigo-500/15 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                <Mic size={36} className="text-white" />
              </div>
              
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                AI Mock Interview
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                Practice for your next interview with our AI-powered interviewer. 
                To get started, scan your resume against a job description first, 
                and we'll tailor the interview questions specifically to your profile.
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <FileSearch size={20} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">How it works</span>
                </div>
                <ol className="text-left text-sm text-slate-500 dark:text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    Upload your resume & paste the job description
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    Get your ATS compatibility scan report
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    Start your personalized AI mock interview
                  </li>
                </ol>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/40 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <FileSearch size={18} />
                Scan Resume Now
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Loading state ───
  if (loadingScan) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 animate-fade-in">
        <div className="animate-spin w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Preparing your interview session...</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Analyzing your profile and crafting questions</p>
      </main>
    );
  }

  // ─── MODE 2: Interview chat session ───
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col px-4 sm:px-6 py-6 relative z-10 animate-fade-in" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-xl px-6 py-4 mb-4 flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mic size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Mock Interview
              {!interviewEnded && interviewStarted && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live
                </span>
              )}
              {interviewEnded && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Completed
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {scanData?.jobRole || 'Interview'} {scanData?.extractedSections?.name ? `• ${scanData.extractedSections.name}` : ''}
            </p>
          </div>
        </div>

        {!interviewEnded && interviewStarted && (
          <button
            onClick={endInterview}
            disabled={isTyping}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition border border-rose-200 dark:border-rose-500/20 disabled:opacity-50"
          >
            <StopCircle size={16} />
            End Interview
          </button>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900/30 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-xl mb-4 p-4 sm:p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20' 
                : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}>
              {msg.role === 'user' 
                ? <User size={14} className="text-white" /> 
                : <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
              }
            </div>
            
            {/* Message Bubble */}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-md shadow-lg shadow-indigo-500/15'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 rounded-tl-md'
              }`}>
                <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content).replace(/\n/g, '<br/>') }} />
              </div>
              <p className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-tl-md px-5 py-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      {!interviewEnded ? (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-xl p-3 animate-slide-up flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "Interviewer is thinking..." : "Type your response..."}
            disabled={isTyping || !interviewStarted}
            rows={1}
            className="flex-1 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 resize-none transition disabled:opacity-50"
            style={{ maxHeight: '120px', minHeight: '44px' }}
            onInput={(e) => {
              e.target.style.height = '44px';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || !interviewStarted}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-xl p-4 animate-slide-up text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Sparkles size={18} className="text-indigo-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Interview session completed</span>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition"
            >
              Back to Report
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
