import React, { useState, useEffect } from 'react';
import { tanyaGemini, cekRepoGitHub } from './lib/agentBridge';

export default function App() {
  const [activeTab, setActiveTab] = useState('control');
  const [servoAngle, setServoAngle] = useState(90);
  const [melodyNote, setMelodyNote] = useState('C4');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // AI State
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // GitHub Status
  const [githubStatus, setGithubStatus] = useState('Memeriksa...');

  useEffect(() => {
    cekRepoGitHub('esilayuniamina-jpg/servo-melody-voice')
      .then(res => setGithubStatus(`Terhubung: ${res.name} (${res.default_branch})`))
      .catch(err => setGithubStatus(`Gagal terhubung: ${err.message}`));
  }, []);

  const handleAskGemini = async () => {
    if (!prompt.trim()) return;
    setLoadingAi(true);
    setAiResponse('Menghubungi Gemini (Anti-Limit Bottleneck)...');
    try {
      const res = await tanyaGemini(`Bertindaklah sebagai pengontrol Animatronic ESP32 cerdas. Jawab dengan format JSON atau teks singkat untuk perintah ini: ${prompt}`);
      setAiResponse(res);
    } catch (err) {
      setAiResponse(`Error: ${err.message}`);
    } finally {
      setLoadingAi(false);
    }
  };

  const triggerServo = (angle) => {
    setServoAngle(angle);
    // Simulasi web audio / serial web api jika tersedia
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-cyan-400 tracking-wider flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></span>
            SERVO MELODY VOICE PRO
          </h1>
          <p className="text-xs text-slate-400">Igor Labs Animatronic Intelligence Suite v4.3</p>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300 truncate max-w-[250px]">{githubStatus}</span>
        </div>
      </header>

      {/* Navigation */}
      <nav className="flex border-b border-slate-800 bg-slate-900/40 px-6 gap-2">
        <button 
          onClick={() => setActiveTab('control')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'control' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          ⚙️ Panel Servo & Melody
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`px-5 py-3 border-b-2 font-medium text-sm transition-all ${activeTab === 'ai' ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          🧠 Gemini AI Controller
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {activeTab === 'control' ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Servo Card */}
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-xl shadow-cyan-950/20">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                  <span>🤖</span> Kontrol Sudut Servo
                </h2>
                <span className="text-xl font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-500/40">{servoAngle}°</span>
              </div>
              
              <div className="space-y-2">
                <input 
                  type="range" 
                  min="0" 
                  max="180" 
                  value={servoAngle} 
                  onChange={(e) => triggerServo(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0° (Min)</span>
                  <span>90° (Mid)</span>
                  <span>180° (Max)</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2">
                {[0, 45, 90, 135, 180].map((angle) => (
                  <button 
                    key={angle}
                    onClick={() => triggerServo(angle)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${servoAngle === angle ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>

            {/* Melody & Voice Card */}
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-xl shadow-cyan-950/20">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                  <span>🎵</span> Melody & Animatronic Voice
                </h2>
                <span className={`text-xs px-2.5 py-1 rounded-full ${isPlaying ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                  {isPlaying ? 'Memutar...' siaps : 'Standby'}
                </span>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-slate-400 block">Pilih Nada Dasar / Note</label>
                <div className="grid grid-cols-4 gap-2">
                  {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map((note) => (
                    <button
                      key={note}
                      onClick={() => {
                        setMelodyNote(note);
                        setIsPlaying(true);
                        setTimeout(() => setIsPlaying(false), 800);
                      }}
                      className="py-2.5 bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-sm font-bold text-cyan-300 transition-all"
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    if (window.responsiveVoice) {
                      window.responsiveVoice.speak("Igor Labs Animatronic Systems online and ready.", "Indonesian Female");
                    } else {
                      alert("ResponsiveVoice belum termuat.");
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                >
                  🔊 Tes Suara Animatronic (ResponsiveVoice)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AI Controller Tab */
          <div className="bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-xl shadow-cyan-950/20">
            <h2 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
              <span>🧠</span> Gemini AI Assistant & Code Generator
            </h2>
            <p className="text-xs text-slate-400">
              Kirim perintah bahasa alami untuk menghasilkan gerakan servo, rangkaian melodi, atau skrip ESP32. Dilindungi oleh Bottleneck anti-limit RPM/TPM.
            </p>

            <div className="space-y-3">
              <textarea 
                rows="3"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Buat gerakan servo meliuk-liuk lembut seperti menari bersama melodi C4, E4, G4..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-4 text-sm text-slate-200 outline-none resize-none"
              ></textarea>
              
              <button 
                onClick={handleAskGemini}
                disabled={loadingAi}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center gap-2"
              >
                {loadingAi ? 'Memproses AI...' : '✨ Kirim ke Gemini AI'}
              </button>
            </div>

            {aiResponse && (
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Respon AI:</h3>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-cyan-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 px-6 py-4 text-center text-xs text-slate-500">
        Igor Labs &bull; Hermes v4.3 Autonomous Agent System
      </footer>
    </div>
  );
}
