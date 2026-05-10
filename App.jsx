"""
Create React app with: npm create vite@latest pr-to-po-dash -- --template react
Then replace src/App.jsx with this code
"""

import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [csvFile, setCsvFile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Prediction state
  const [prData, setPrData] = useState({
    pr_number: 'PR-2025-001',
    amount: 25000,
    category: 'direct',
    approver: 'John Smith',
    day_of_week: 'Monday',
    vendor_type: 'approved',
    description: 'Compressor units for HVAC assembly'
  });
  const [prediction, setPrediction] = useState(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Handle file upload
  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };

  // Analyze CSV
  const handleAnalyze = async () => {
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setMetrics(data.metrics);
      setAnalysis(data.gemini_analysis);
      setActiveTab('insights');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Predict delay
  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pr_data: prData })
      });
      
      if (!response.ok) throw new Error('Prediction failed');
      
      const data = await response.json();
      setPrediction(data);
      setActiveTab('prediction');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Chat with Gemini
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    setLoading(true);
    setChatMessages([...chatMessages, { role: 'user', content: chatInput }]);
    setChatInput('');
    
    try {
      const response = await fetch(`${API_BASE}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: chatInput,
          context: metrics ? `Current metrics: ${JSON.stringify(metrics)}` : ''
        })
      });
      
      if (!response.ok) throw new Error('Chat failed');
      
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📊 PR-to-PO Approval Delay Analysis</h1>
        <p>Process Mining + AI Bottleneck Detection</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload & Analyze
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
          disabled={!metrics}
        >
          💡 Insights
        </button>
        <button 
          className={`tab ${activeTab === 'prediction' ? 'active' : ''}`}
          onClick={() => setActiveTab('prediction')}
        >
          🔮 Predict
        </button>
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Ask AI
        </button>
      </div>

      <div className="content">
        
        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="section">
            <h2>Upload PR Approval Data</h2>
            <div className="upload-area">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileUpload}
              />
              {csvFile && <p>Selected: {csvFile.name}</p>}
              <button 
                onClick={handleAnalyze}
                disabled={!csvFile || loading}
                className="btn-primary"
              >
                {loading ? '⏳ Analyzing...' : '🚀 Analyze Data'}
              </button>
            </div>
            
            <div className="guide">
              <h3>CSV Format Required:</h3>
              <pre>pr_number,amount,category,approver,submitted_date,approved_date,status
PR-001,15000,direct,John Smith,2025-01-01 09:00,2025-01-02 14:30,approved
PR-002,50000,capex,Sarah Jones,2025-01-01 10:00,2025-01-01 12:00,approved
...</pre>
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && metrics && (
          <div className="section">
            <h2>📈 Approval Metrics & Bottlenecks</h2>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Avg Cycle Time</h3>
                <p className="metric-value">{metrics.avg_cycle_time_hours} hrs</p>
                <small>Target: 48 hrs</small>
              </div>
              <div className="metric-card warning">
                <h3>SLA Breach Rate</h3>
                <p className="metric-value">{metrics.sla_breach_rate_pct}%</p>
                <small>Target: &lt;5%</small>
              </div>
              <div className="metric-card">
                <h3>Total PRs Analyzed</h3>
                <p className="metric-value">{metrics.total_prs}</p>
              </div>
              <div className="metric-card alert">
                <h3>Slowest Approver</h3>
                <p className="metric-value">{metrics.slowest_approver}</p>
                <small>{metrics.slowest_approver_avg_hours} hrs avg</small>
              </div>
            </div>

            <div className="analysis-box">
              <h3>🤖 Gemini AI Analysis</h3>
              {typeof analysis === 'string' ? (
                <div className="analysis-text">{analysis}</div>
              ) : (
                <pre className="analysis-json">{JSON.stringify(analysis, null, 2)}</pre>
              )}
            </div>
          </div>
        )}

        {/* PREDICTION TAB */}
        {activeTab === 'prediction' && (
          <div className="section">
            <h2>🔮 Will This PR Be Delayed?</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>PR Number</label>
                <input 
                  type="text"
                  value={prData.pr_number}
                  onChange={(e) => setPrData({...prData, pr_number: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Amount ($)</label>
                <input 
                  type="number"
                  value={prData.amount}
                  onChange={(e) => setPrData({...prData, amount: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={prData.category}
                  onChange={(e) => setPrData({...prData, category: e.target.value})}
                >
                  <option>direct</option>
                  <option>indirect</option>
                  <option>capex</option>
                  <option>mro</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Approver</label>
                <input 
                  type="text"
                  value={prData.approver}
                  onChange={(e) => setPrData({...prData, approver: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Day of Week</label>
                <select 
                  value={prData.day_of_week}
                  onChange={(e) => setPrData({...prData, day_of_week: e.target.value})}
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Vendor Type</label>
                <select 
                  value={prData.vendor_type}
                  onChange={(e) => setPrData({...prData, vendor_type: e.target.value})}
                >
                  <option>new</option>
                  <option>approved</option>
                  <option>sole-source</option>
                </select>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label>Description</label>
              <textarea 
                value={prData.description}
                onChange={(e) => setPrData({...prData, description: e.target.value})}
                rows="4"
              />
            </div>
            
            <button 
              onClick={handlePredict}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '⏳ Predicting...' : '🚀 Predict'}
            </button>

            {prediction && (
              <div className="prediction-result">
                <h3>Prediction Result</h3>
                <div className={`risk-gauge ${prediction.severity.toLowerCase()}`}>
                  <div className="risk-percentage">{prediction.delay_probability_pct}%</div>
                  <div className="risk-label">{prediction.severity} Risk</div>
                </div>
                
                <div className="prediction-details">
                  <p><strong>Action:</strong> {prediction.recommended_action}</p>
                  <p><strong>Predicted Cycle Time:</strong> {prediction.predicted_cycle_time_hours} hours</p>
                  <p><strong>Explanation:</strong> {prediction.explanation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="section">
            <h2>💬 Ask Gemini AI</h2>
            
            <div className="chat-window">
              {chatMessages.length === 0 && (
                <div className="chat-empty">
                  Ask questions about approval delays, bottlenecks, or recommendations
                </div>
              )}
              
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role}`}>
                  {msg.role === 'user' ? '👤' : '🤖'} {msg.content}
                </div>
              ))}
            </div>
            
            <div className="chat-input-group">
              <input 
                type="text"
                placeholder="e.g., Why is Finance team slow? How to reduce cycle time?"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              />
              <button 
                onClick={handleChat}
                disabled={loading || !chatInput.trim()}
                className="btn-primary"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
