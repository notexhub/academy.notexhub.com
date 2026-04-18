'use client';
import { useEffect, useState } from 'react';
import { Download, ShieldCheck, Printer, XCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CertificateView() {
  const params = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/certificates/${params.id}`)
      .then(r => r.json())
      .then(d => { setCert(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"><div className="text-[#94a3b8] font-semibold flex items-center gap-2"><ShieldCheck className="animate-pulse" /> ভেরিফাই করা হচ্ছে...</div></div>;
  if (!cert || cert.status !== 'approved') return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"><div className="bg-white p-8 rounded-2xl shadow-sm border border-[#f1f5f9] text-center max-w-sm"><XCircle size={48} className="mx-auto text-[#ef4444] mb-4" /><h2 className="text-xl font-bold text-[#0f172a] mb-2">সার্টিফিকেট পাওয়া যায়নি</h2><p className="text-[#64748b] text-sm">এই সার্টিফিকেট আইডিটি সঠিক নয় বা এখনো অনুমোদিত হয়নি।</p></div></div>;

  const cfg = cert.settings || {};
  const logo = cfg.logoBase64 || null;
  const seal = cfg.sealBase64 || null;
  const isoSeal = cfg.isoSealBase64 || null;
  const sig = cfg.signatureBase64 || null;
  const watermark = cfg.watermarkBase64 || null;

  const issueDateObj = new Date(cert.issueDate || cert.requestedAt);
  const formattedDate = issueDateObj.toLocaleDateString('en-GB', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }).toUpperCase(); 

  const verifyUrl = typeof window !== 'undefined' ? `${window.location.origin}/certificate/${cert._id}` : `https://notexhub.com/verify-certificate`;

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex flex-col items-center py-6 md:py-12 px-2 md:px-4 selection:bg-[#004b87] selection:text-white">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Pirata+One&family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Open+Sans:wght@400;700;800&family=Great+Vibes&display=swap');
        
        .font-gothic { font-family: 'Old English Text MT', 'Engravers Old English', 'Pirata One', cursive; }
        .font-serif-body { font-family: 'Merriweather', serif; }
        .font-sans-bold { font-family: 'Open Sans', sans-serif; }
        .font-script { font-family: 'Great Vibes', cursive; text-shadow: 0 1px 1px rgba(0,0,0,0.1); }

        /* Premium Guilloche pattern CSS simulation */
        .guilloche-bg {
          background-image: 
            radial-gradient(circle at 100% 150%, #f1f5f9 24%, transparent 25%, transparent 28%, #f1f5f9 29%, transparent 30%),
            radial-gradient(circle at 0% 150%, #f1f5f9 24%, transparent 25%, transparent 28%, #f1f5f9 29%, transparent 30%),
            radial-gradient(circle at 100% -50%, #e2e8f0 24%, transparent 25%, transparent 28%, #e2e8f0 29%, transparent 30%),
            radial-gradient(circle at 0% -50%, #e2e8f0 24%, transparent 25%, transparent 28%, #e2e8f0 29%, transparent 30%);
          background-size: 80px 80px;
          opacity: 0.3;
        }

        .gold-accents {
           box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        }

        @media print {
          body { background: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: landscape; margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; border: none !important; }
          .print\\:transform-none { transform: none !important; margin: 0 !important; }
          
          .print-certificate-container {
            width: 297mm !important;
            height: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
        }
      `}} />

      <div className="print:hidden w-full max-w-[1050px] bg-white rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between shadow-sm border border-[#cbd5e1] gap-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f0f9ff] flex items-center justify-center text-[#0284c7]"><ShieldCheck size={20} /></div>
          <div>
            <h3 className="font-bold text-[#0f172a] text-sm leading-none">Verified Certificate</h3>
            <p className="text-xs text-[#64748b] mt-1 font-mono">ID: {cert._id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-[#f8fafc] text-[#475569] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg font-semibold text-sm transition-colors border border-[#e2e8f0]">
            <Printer size={16} /> Print
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-[#004b87] text-white hover:bg-[#003865] rounded-lg font-bold text-sm transition-all shadow-md">
            <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div 
        className="bg-white shadow-2xl print:shadow-none print:transform-none w-full max-w-[1100px] relative overflow-hidden flex items-center justify-center print-certificate-container z-10" 
        style={{ aspectRatio: '1.414 / 1' }}
      >
        <div className="absolute inset-0 border-[24px] md:border-[34px] border-[#f58220] z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-[24px] md:h-[34px] bg-[#004b87] z-10 mx-[10%]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[24px] md:h-[34px] bg-[#004b87] z-10 mx-[10%]"></div>
        <div className="absolute inset-[36px] md:inset-[50px] border-[1px] border-[#a1a1aa] z-10 shadow-sm"></div>
        <div className="absolute inset-[39px] md:inset-[54px] border-[5px] border-double border-[#d4d4d8] z-10 opacity-70"></div>
        
        <div className="absolute inset-[45px] md:inset-[60px] border-[1px] border-[#a1a1aa] z-10 box-border bg-[#fffcfa] flex flex-col gold-accents">
          
          <div className="absolute inset-0 guilloche-bg pointer-events-none z-0"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.04]">
             <svg width="600" height="600" viewBox="0 0 100 100" className="rotate-45 scale-150">
               <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="#000" strokeWidth="0.5"/>
               <circle cx="50" cy="50" r="30" fill="none" stroke="#000" strokeWidth="0.5"/>
             </svg>
          </div>

          {watermark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.08]">
              <img src={watermark} className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply drop-shadow-sm" alt="Watermark" />
            </div>
          )}

          <div className="relative z-20 w-full h-full p-6 md:p-10 flex flex-col justify-between">
            <div className="flex justify-between items-start w-full relative h-[100px]">
              <div className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center -ml-2 -mt-2">
                {isoSeal ? (
                  <img src={isoSeal} alt="ISO Seal" className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                ) : (
                  <div className="w-[85px] h-[85px] rounded-full border-[3px] border-[#004b87] bg-gradient-to-br from-white to-[#f0f9ff] flex flex-col items-center justify-center p-1 shadow-md relative overflow-hidden">
                    <div className="absolute inset-1 rounded-full border-[1.5px] border-dashed border-[#004b87] opacity-60"></div>
                    <span className="text-[9px] font-sans-bold text-[#004b87] uppercase tracking-tighter mt-1 z-10">Certified</span>
                    <span className="text-[22px] font-black text-[#004b87] leading-none mb-1 shadow-sm z-10">ISO</span>
                    <span className="text-[5.5px] text-center font-bold text-[#f58220] leading-tight tracking-wider z-10 w-[70%] border-t border-[#cbd5e1] pt-1">9001:2015<br/>COMPANY</span>
                  </div>
                )}
              </div>

              <div className="w-full h-24 flex justify-center items-center">
                {logo ? (
                  <img src={logo} alt="Company Logo" className="h-full max-w-[350px] object-contain drop-shadow-sm" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#f58220] flex items-center justify-center text-[#f58220]">
                       <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-transparent border-b-[#f58220]" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-sans-bold text-[#004b87] tracking-tighter" style={{ fontWeight: 900 }}>
                        <span className="text-[#004b87]">NOTEX</span><span className="text-[#f58220]">HUB</span> <span className="text-[22px] font-semibold tracking-normal lowercase opacity-80 italic">academy</span>
                      </h1>
                      <p className="text-[9px] text-[#f58220] uppercase font-bold tracking-widest mt-[-2px] ml-1">Since 2024</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center -mt-6">
              
              <h2 className="font-gothic text-[4.5rem] md:text-[5.5rem] text-[#27272a] tracking-wide mb-6 leading-none drop-shadow-md" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1), -1px -1px 0 rgba(255,255,255,0.5)" }}>
                Certificate of Achievement
              </h2>
              
              <p className="font-serif-body italic font-semibold text-[17px] md:text-[19px] text-[#333] mb-5 tracking-wide">
                This is to certify that
              </p>
              
              <div className="flex items-center justify-center gap-4 w-full mb-5">
                <div className="w-0 h-0 border-y-[7px] border-y-transparent border-r-[12px] border-r-[#f58220] filter drop-shadow-sm"></div>
                <h3 className="font-sans-bold text-4xl md:text-5xl text-[#004b87] uppercase tracking-wider border-b-[1.5px] border-[#cbd5e1] pb-1 px-6 min-w-[350px]">
                  {cert.user}
                </h3>
                <div className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-[#f58220] filter drop-shadow-sm"></div>
              </div>
              
              <p className="font-serif-body italic font-semibold text-[17px] md:text-[19px] text-[#333] mb-6 tracking-wide">
                has successfully completed
              </p>
              
              <h4 className="font-sans-bold text-[22px] md:text-[26px] text-[#004b87] uppercase tracking-[0.05em] mb-7 px-8 max-w-[85%] leading-snug">
                {cert.course}
              </h4>

              <p className="font-serif-body italic font-bold text-[15px] md:text-[17px] text-[#333] mb-3">
                Training programme on
              </p>

              <p className="font-sans-bold text-xl md:text-[22px] text-[#004b87] uppercase tracking-widest font-black shrink-0">
                {formattedDate}
              </p>

            </div>

            <div className="w-full flex justify-between items-end mt-2 px-2 relative z-30">
              <div className="pb-4 w-1/3 text-left">
                <p className="font-sans-bold text-xs md:text-[14px] text-[#27272a]">
                  Certificate ID : <span className="font-bold tracking-wider">{cert._id.toUpperCase()}</span>
                </p>
              </div>

              <div className="flex justify-center w-1/3 pb-[-10px]">
                {seal ? (
                  <img src={seal} alt="Company Seal" className="w-[100px] h-[100px] object-contain opacity-90 drop-shadow-md" style={{ mixBlendMode: 'multiply' }} />
                ) : (
                  <div className="w-0 h-0 opacity-0"></div> 
                )}
              </div>

              <div className="text-center w-1/3 flex flex-col items-end pb-3">
                <div className="border-b-[1px] border-[#64748b] pb-1 h-[70px] w-[240px] flex items-end justify-center relative">
                  {sig ? (
                    <img src={sig} alt="Signature" className="h-[140%] max-w-full object-contain mb-[-5px] filter drop-shadow-sm mix-blend-multiply" />
                  ) : (
                    <span className="text-[2.8rem] text-[#1e293b] font-script absolute bottom-1">
                      {cfg.authorizedByName || 'Signature Here'}
                    </span>
                  )}
                </div>
                <p className="font-sans-bold text-[12px] md:text-[13px] text-[#004b87] mt-1.5 uppercase tracking-widest font-black w-[240px] text-center">
                  {cfg.authorizedByRole || 'MANAGING DIRECTOR'}
                </p>
              </div>
            </div>

            <div className="w-full text-center mt-3 border-t-[1.5px] border-[#e2e8f0] pt-4 z-30">
              <p className="text-[10.5px] md:text-[11.5px] font-sans-bold text-[#475569] tracking-wide">
                The Certificate ID can be verified at <span className="text-[#004b87] underline tracking-widest px-1 font-black">{verifyUrl}</span> to check the authenticity of this certificate
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
