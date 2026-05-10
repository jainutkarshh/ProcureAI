import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

const API_BASE = 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [csvFile, setCsvFile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorDetail, setVendorDetail] = useState(null);
  const [vendorSearch, setVendorSearch] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [retraining, setRetraining] = useState(false);
  
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

  useEffect(() => {
    loadModelInfo();
  }, []);

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
      
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Analysis failed');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Analysis failed');
      }

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
      
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Prediction failed');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Prediction failed');
      }

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
      
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Chat failed');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Chat failed');
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const response = await fetch(`${API_BASE}/vendors`);
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Failed to load vendors');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Failed to load vendors');
      }

      setVendors(data.vendors || []);
    } catch (err) {
      setError('Failed to load vendors: ' + err.message);
    }
  };

  const loadVendorDetail = async (vendorName) => {
    try {
      const response = await fetch(`${API_BASE}/vendors/${encodeURIComponent(vendorName)}`);
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Failed to load vendor');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Failed to load vendor');
      }

      setVendorDetail(data);
      setSelectedVendor(vendorName);
    } catch (err) {
      setError('Failed to load vendor: ' + err.message);
    }
  };

  const loadModelInfo = async () => {
    try {
      const response = await fetch(`${API_BASE}/model-info`);
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Failed to load model info');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Failed to load model info');
      }

      setModelInfo(data);
    } catch (err) {
      console.error('Model info failed:', err);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const response = await fetch(`${API_BASE}/retrain`, { method: 'POST' });
      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        if (!response.ok) {
          throw new Error(text || 'Retraining failed');
        }
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.detail || data.error || data.message || 'Retraining failed');
      }

      alert(`Model retrained! Version ${data.version}, Accuracy: ${(data.accuracy * 100).toFixed(1)}%`);
      loadModelInfo();
    } catch (err) {
      setError('Retraining failed: ' + err.message);
    } finally {
      setRetraining(false);
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
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { setActiveTab('history'); loadVendors(); }}
        >
          🏢 Vendor History
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

        {activeTab === 'history' && (
          <div className="section">
            <h2>🏢 Vendor History & Scoring</h2>

            {modelInfo && (
              <div className="model-info-card">
                <div className="model-stat">
                  <span className="model-label">Total PRs in DB</span>
                  <span className="model-value">{modelInfo.total_rows_in_db}</span>
                </div>
                <div className="model-stat">
                  <span className="model-label">Rows until next auto-retrain</span>
                  <span className="model-value">{modelInfo.rows_until_next_retrain}</span>
                </div>
                {modelInfo.model_versions && modelInfo.model_versions[0] && (
                  <div className="model-stat">
                    <span className="model-label">Model version</span>
                    <span className="model-value">v{modelInfo.model_versions[0].version}</span>
                  </div>
                )}
                {modelInfo.model_versions && modelInfo.model_versions[0] && (
                  <div className="model-stat">
                    <span className="model-label">Model accuracy</span>
                    <span className="model-value">
                      {(modelInfo.model_versions[0].accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                <button 
                  onClick={handleRetrain}
                  disabled={retraining}
                  className="btn-primary"
                  style={{marginLeft: 'auto'}}
                >
                  {retraining ? '⏳ Retraining...' : '🔄 Retrain Model Now'}
                </button>
              </div>
            )}

            {!selectedVendor ? (
              <>
                <input 
                  type="text"
                  placeholder="Search vendor / approver..."
                  value={vendorSearch}
                  onChange={e => setVendorSearch(e.target.value)}
                  className="vendor-search"
                />

                {vendors.length === 0 ? (
                  <div className="empty-state">
                    No vendor data yet. Upload a CSV to populate vendor history.
                  </div>
                ) : (
                  <table className="vendor-table">
                    <thead>
                      <tr>
                        <th>Vendor / Approver</th>
                        <th>Risk Score</th>
                        <th>Risk Level</th>
                        <th>Avg Cycle (hrs)</th>
                        <th>SLA Breach %</th>
                        <th>Total PRs</th>
                        <th>Last Scored</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors
                        .filter(v => v.vendor_name.toLowerCase().includes(vendorSearch.toLowerCase()))
                        .map((v, i) => (
                          <tr key={i} className={`risk-row-${v.risk_level.toLowerCase()}`}>
                            <td><strong>{v.vendor_name}</strong></td>
                            <td>
                              <div className="score-bar-wrap">
                                <div 
                                  className="score-bar"
                                  style={{width: `${v.score}%`, background: v.risk_level === 'HIGH' ? '#ef4444' : v.risk_level === 'MEDIUM' ? '#f59e0b' : '#10b981'}}
                                />
                                <span>{v.score.toFixed(1)}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`risk-badge risk-${v.risk_level.toLowerCase()}`}>
                                {v.risk_level}
                              </span>
                            </td>
                            <td>{v.avg_cycle_hours.toFixed(1)}</td>
                            <td>{v.sla_breach_rate_pct.toFixed(1)}%</td>
                            <td>{v.total_prs}</td>
                            <td style={{fontSize: '0.85em', color: '#888'}}>{v.last_scored?.split('T')[0]}</td>
                            <td>
                              <button 
                                onClick={() => loadVendorDetail(v.vendor_name)}
                                className="btn-sm"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={() => { setSelectedVendor(null); setVendorDetail(null); }}
                  className="btn-back"
                >
                  ← Back to all vendors
                </button>

                {vendorDetail && (
                  <>
                    <h3>{vendorDetail.vendor_name} — Full History</h3>

                    {vendorDetail.latest_score && (
                      <div className="metrics-grid" style={{marginBottom: '24px'}}>
                        <div className="metric-card">
                          <h3>Current Score</h3>
                          <p className="metric-value">{vendorDetail.latest_score.score.toFixed(1)}</p>
                        </div>
                        <div className={`metric-card ${vendorDetail.latest_score.risk_level === 'HIGH' ? 'warning' : ''}`}>
                          <h3>Risk Level</h3>
                          <p className="metric-value">{vendorDetail.latest_score.risk_level}</p>
                        </div>
                        <div className="metric-card">
                          <h3>Avg Cycle Time</h3>
                          <p className="metric-value">{vendorDetail.latest_score.avg_cycle_hours.toFixed(1)}h</p>
                        </div>
                        <div className="metric-card">
                          <h3>Total PRs Recorded</h3>
                          <p className="metric-value">{vendorDetail.total_prs_recorded}</p>
                        </div>
                      </div>
                    )}

                    {vendorDetail.score_history && vendorDetail.score_history.length > 1 && (
                      <div className="chart-section">
                        <h4>Score Trend Over Time</h4>
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart data={vendorDetail.score_history.map(s => ({
                            date: s.scored_at?.split('T')[0] || s.scored_at,
                            score: s.score,
                            breach: s.sla_breach_rate_pct
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                            <XAxis dataKey="date" tick={{fontSize: 11}}/>
                            <YAxis domain={[0, 100]} tick={{fontSize: 11}}/>
                            <Tooltip />
                            <Line 
                              type="monotone"
                              dataKey="score"
                              stroke="#667eea"
                              strokeWidth={2}
                              dot={{r: 4}}
                              name="Risk Score"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    <h4 style={{marginTop: '24px'}}>All PRs from {vendorDetail.vendor_name}</h4>
                    <table className="vendor-table">
                      <thead>
                        <tr>
                          <th>PR Number</th>
                          <th>Amount</th>
                          <th>Category</th>
                          <th>Submitted</th>
                          <th>Approved</th>
                          <th>Cycle Time</th>
                          <th>SLA Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(vendorDetail.pr_history || []).map((pr, i) => (
                          <tr key={i}>
                            <td>{pr.pr_number}</td>
                            <td>${pr.amount?.toLocaleString()}</td>
                            <td>{pr.category}</td>
                            <td style={{fontSize: '0.85em'}}>{pr.submitted_date?.split(' ')[0]}</td>
                            <td style={{fontSize: '0.85em'}}>{pr.approved_date?.split(' ')[0]}</td>
                            <td>{pr.cycle_time_hours?.toFixed(1)}h</td>
                            <td>
                              <span className={`risk-badge risk-${pr.sla_breached ? 'high' : 'low'}`}>
                                {pr.sla_breached ? 'BREACHED' : 'ON TIME'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
