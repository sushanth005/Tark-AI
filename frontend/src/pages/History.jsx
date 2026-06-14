import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, CheckCircle, XCircle, Download, PenTool, History as HistoryIcon } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function History() {
  const { token } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingCL, setGeneratingCL] = useState(false);
  const [showCLModal, setShowCLModal] = useState(false);

  const reportRef = useRef(null);
  const clRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/scan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, [fetchHistory]);

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;

    const options = {
      margin: [10, 10, 10, 10],
      filename: `ATS-Evaluation-Report-${result.filename || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  };

  const handleGenerateCL = async () => {
    if (!result || !result._id) return;
    setGeneratingCL(true);
    setShowCLModal(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/scan/generate-cover-letter/${result._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      alert(err.response?.data?.error || 'Cover letter generation failed.');
      setShowCLModal(false);
    } finally {
      setGeneratingCL(false);
    }
  };

  const downloadCoverLetter = () => {
    if (!coverLetter) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: coverLetter.split('\n').map(line =>
            new Paragraph({
              children: [new TextRun(line)],
            })
          ),
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Cover_Letter_${(result?.jobRole || 'Application').replace(/\s+/g, '_')}.docx`);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-indigo-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto mt-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 mb-12 relative z-10">

        {/* Historical Logs List */}
        <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/50 shadow-xl h-fit">
          <h4 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <HistoryIcon size={20} />
            </span>
            Assessment History
          </h4>
          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((scan, idx) => (
              <div key={idx} className={`flex justify-between items-center p-4 bg-slate-950/50 border ${result?._id === scan._id ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-800/80'} rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition cursor-pointer`} onClick={() => { setResult(scan); setCoverLetter(scan.coverLetter || ''); }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
                    <FileText size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200 max-w-[120px] sm:max-w-[150px] truncate">{scan.filename}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(scan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-base font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">{scan.overallScore}%</div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500">No historical data logs recorded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Details */}
        <div className="lg:col-span-2 space-y-8">
          {result ? (
            <div className="space-y-6">
              {/* Floating Trigger Control Block */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleGenerateCL}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition border border-slate-700/50"
                >
                  <PenTool size={16} className="text-purple-400" /> Generate Cover Letter
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20 transition"
                >
                  <Download size={16} /> Download PDF Report
                </button>
              </div>

              {/* PDF Container Capture Target */}
              <div ref={reportRef} className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/50 shadow-xl space-y-8 relative overflow-hidden text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <div>
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">ATS Evaluation Analysis</h2>
                    <p className="text-sm text-slate-500 mt-1">Target File: {result.filename || 'Uploaded_Document.pdf'}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div className="relative w-28 h-28">
                      <RadialBarChart
                        width={112}
                        height={112}
                        innerRadius="75%"
                        outerRadius="100%"
                        data={[{ name: 'Score', value: result.overallScore, fill: '#6366f1' }]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar minAngle={15} background={{ fill: '#1e293b' }} clockWise={true} dataKey="value" cornerRadius={10} />
                      </RadialBarChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-indigo-400">{result.overallScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics evaluation checklist check */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Structural Metrics Profile</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.metrics && Object.entries(result.metrics).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 transition hover:border-slate-700">
                        {value ? <CheckCircle className="text-emerald-400" size={16} /> : <XCircle className="text-rose-400" size={16} />}
                        <span className="text-xs capitalize font-medium text-slate-300">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracted Sections block */}
                {result.extractedSections && (
                  <div className="pt-4 border-t border-slate-800/50">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Extracted Sections</h4>
                    <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                      {Object.entries({
                        'Name': result.extractedSections.name,
                        'Job Title': result.extractedSections.jobTitle,
                        'Phone Number': result.extractedSections.phone,
                        'Email Address': result.extractedSections.email,
                        'Portfolio or Website Link': result.extractedSections.portfolio,
                        'Summary': result.extractedSections.summary,
                        'Experience': result.extractedSections.experience,
                        'Education': result.extractedSections.education,
                        'Hard Skills': result.extractedSections.hardSkills,
                        'Soft Skills': result.extractedSections.softSkills
                      }).map(([label, val], i) => (
                        <div key={i} className="flex items-start gap-3 p-4">
                          <div className="mt-0.5 shrink-0">
                            {val ? <CheckCircle className="text-emerald-500" size={18} /> : <XCircle className="text-rose-500" size={18} />}
                          </div>
                          <div className="text-sm">
                            <span className="font-bold text-slate-200">{label}</span>
                            {val ? (
                              <>
                                <span className="text-slate-500 mx-2">-</span>
                                <span className="text-slate-300">{val.length > 100 ? val.substring(0, 100) + '...' : val}</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical skill keyword distribution tracking matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="bg-emerald-950/20 border border-emerald-900/50 p-5 rounded-2xl">
                    <h5 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-3">Identified Core Match</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.skillsAnalysis?.hardSkills?.map((s, i) => <span key={i} className="bg-emerald-900/30 border border-emerald-800/50 text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-medium">{s}</span>)}
                    </div>
                  </div>
                  <div className="bg-rose-950/20 border border-rose-900/50 p-5 rounded-2xl">
                    <h5 className="text-xs uppercase font-bold text-rose-400 tracking-wider mb-3">Missing Priority Items</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.skillsAnalysis?.missingSkills?.length > 0 ? (
                        result.skillsAnalysis.missingSkills.map((s, i) => <span key={i} className="bg-rose-900/30 border border-rose-800/50 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-medium">{s}</span>)
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">None detected</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendations summary logs block */}
                <div className="pt-4 border-t border-slate-800/50">
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Actionable Structural Feedback</h4>
                  <ul className="space-y-3">
                    {result.improvements?.map((imp, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-3 leading-relaxed">
                        <span className="text-indigo-400 font-bold mt-0.5">•</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-16 text-center text-slate-500 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <FileText size={32} className="text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-300">No Assessment Loaded</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2">Configure parameters and run the analysis pipeline to generate detailed assessment reports.</p>
            </div>
          )}
        </div>
      </main>

      {/* Cover Letter Modal */}
      {showCLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <PenTool size={16} />
                </div>
                Tailored Cover Letter
              </h3>
              <button onClick={() => setShowCLModal(false)} className="text-slate-500 hover:text-slate-300 transition">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto bg-slate-900">
              {generatingCL ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="animate-spin w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full mb-6"></div>
                  <p className="font-medium text-slate-300 text-lg">Crafting your professional pitch...</p>
                  <p className="text-sm text-slate-500 mt-2">Analyzing your skills and generating the perfect narrative.</p>
                </div>
              ) : (
                <div ref={clRef} className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-serif bg-slate-950/50 p-6 rounded-2xl border border-slate-800/80">
                  {coverLetter || "No cover letter generated yet."}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950/30">
              <button onClick={() => setShowCLModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition">
                Close
              </button>
              <button
                onClick={downloadCoverLetter}
                disabled={generatingCL || !coverLetter}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} /> Download DOCX
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
