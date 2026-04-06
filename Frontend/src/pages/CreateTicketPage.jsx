import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/ticketApi";
import { CATEGORY, PRIORITY } from "../utils/constants";

const PRIORITY_OPTS = [
  { value:"LOW",      label:"Low",      desc:"Minor inconvenience",     accent:"#1a7a4a", soft:"#e8f5ee", border:"rgba(26,122,74,.35)"  },
  { value:"MEDIUM",   label:"Medium",   desc:"Affects some users",      accent:"#1a6fb5", soft:"#e8f1fb", border:"rgba(26,111,181,.35)" },
  { value:"HIGH",     label:"High",     desc:"Blocks normal operation", accent:"#b45309", soft:"#fff3e0", border:"rgba(180,83,9,.35)"   },
  { value:"CRITICAL", label:"Critical", desc:"Safety or data risk",     accent:"#b91c1c", soft:"#fde8e8", border:"rgba(185,28,28,.35)"  },
];

const fieldStyle = {
  width:"100%", padding:"12px 16px",
  borderRadius:"14px", border:"1px solid #d4dde5",
  background:"rgba(255,255,255,.92)", color:"#163042",
  fontSize:"14px", outline:"none", boxSizing:"border-box",
  transition:"border .18s,box-shadow .18s",
  fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",
};

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [focused, setFocused]       = useState(null);
  const [form, setForm] = useState({
    title:"", description:"", category:"",
    priority:"MEDIUM", location:"", contactDetails:"", resourceId:"",
  });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      const res = await createTicket(form);
      navigate(`/tickets/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit ticket");
    } finally { setSubmitting(false); }
  };

  const focusStyle = { borderColor:"#d47a0c", boxShadow:"0 0 0 3px rgba(212,122,12,.12)" };

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(circle at 20% 80%,rgba(255,196,112,.22),transparent 35%),
                  linear-gradient(135deg,#f5efe4 0%,#f7f9fc 50%,#eef4f6 100%)`,
      fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",
      padding:"40px 24px 60px",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap');`}</style>

      <div style={{maxWidth:"680px",margin:"0 auto"}}>

        {/* breadcrumb */}
        <button onClick={() => navigate(-1)}
          style={{display:"flex",alignItems:"center",gap:"6px",
            fontSize:"13px",color:"#9a5d10",background:"none",
            border:"none",cursor:"pointer",padding:0,marginBottom:"20px",
            fontWeight:600}}>
          ← Back to tickets
        </button>

        {/* header */}
        <div style={{marginBottom:"28px"}}>
          <p style={{fontFamily:"'Baloo 2',sans-serif",fontSize:".75rem",
            fontWeight:700,textTransform:"uppercase",letterSpacing:".16em",
            color:"#9a5d10",margin:"0 0 5px"}}>
            New Report
          </p>
          <h1 style={{fontFamily:"'Baloo 2',sans-serif",
            fontSize:"clamp(1.9rem,4vw,2.6rem)",fontWeight:800,
            color:"#173042",letterSpacing:"-.04em",lineHeight:1.05,margin:0}}>
            Report an Incident
          </h1>
          <p style={{fontSize:".93rem",color:"#7a8f9e",marginTop:"6px"}}>
            Describe the fault and attach up to 3 photos as evidence
          </p>
        </div>

        {/* card */}
        <form onSubmit={handleSubmit} style={{
          background:"rgba(255,255,255,.82)",
          border:"1px solid rgba(18,51,76,.12)",
          borderRadius:"28px",
          boxShadow:"0 24px 60px rgba(26,44,65,.1)",
          backdropFilter:"blur(16px)",
          overflow:"hidden",
        }}>

          {/* Section 1 */}
          <div style={{padding:"26px 28px",borderBottom:"1px solid rgba(23,48,66,.08)"}}>
            <h2 style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"1rem",
              fontWeight:700,color:"#173042",margin:"0 0 18px",
              display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{width:"24px",height:"24px",borderRadius:"50%",
                background:"linear-gradient(135deg,#d47a0c,#a84f00)",
                color:"#fff",fontSize:"12px",fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>1</span>
              Location & Type
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
              <div>
                <label style={{display:"block",fontSize:"13px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>
                  Category <span style={{color:"#d47a0c"}}>*</span>
                </label>
                <select name="category" value={form.category}
                  onChange={handleChange} required
                  onFocus={()=>setFocused("cat")} onBlur={()=>setFocused(null)}
                  style={{...fieldStyle, ...(focused==="cat"?focusStyle:{})}}>
                  <option value="">Select category…</option>
                  {Object.values(CATEGORY).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:"13px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Lab A-204, Block A 2F"
                  onFocus={()=>setFocused("loc")} onBlur={()=>setFocused(null)}
                  style={{...fieldStyle,...(focused==="loc"?focusStyle:{})}}/>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{padding:"26px 28px",borderBottom:"1px solid rgba(23,48,66,.08)"}}>
            <h2 style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"1rem",
              fontWeight:700,color:"#173042",margin:"0 0 18px",
              display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{width:"24px",height:"24px",borderRadius:"50%",
                background:"linear-gradient(135deg,#d47a0c,#a84f00)",
                color:"#fff",fontSize:"12px",fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>2</span>
              Incident Details
            </h2>
            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div>
                <label style={{display:"block",fontSize:"13px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>
                  Title <span style={{color:"#d47a0c"}}>*</span>
                </label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. Projector not powering on in Lab A-204"
                  onFocus={()=>setFocused("tit")} onBlur={()=>setFocused(null)}
                  style={{...fieldStyle,...(focused==="tit"?focusStyle:{})}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"13px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>
                  Description <span style={{color:"#d47a0c"}}>*</span>
                </label>
                <textarea name="description" value={form.description}
                  onChange={handleChange} required rows={4}
                  placeholder="Describe what happened, when you noticed it, and any error messages…"
                  onFocus={()=>setFocused("desc")} onBlur={()=>setFocused(null)}
                  style={{...fieldStyle,...(focused==="desc"?focusStyle:{}),resize:"none",lineHeight:1.6}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:"13px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>Preferred contact (optional)</label>
                <input name="contactDetails" value={form.contactDetails}
                  onChange={handleChange} placeholder="Phone or email"
                  onFocus={()=>setFocused("con")} onBlur={()=>setFocused(null)}
                  style={{...fieldStyle,...(focused==="con"?focusStyle:{})}}/>
              </div>
            </div>
          </div>

          {/* Section 3 — Priority */}
          <div style={{padding:"26px 28px",borderBottom:"1px solid rgba(23,48,66,.08)"}}>
            <h2 style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"1rem",
              fontWeight:700,color:"#173042",margin:"0 0 18px",
              display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{width:"24px",height:"24px",borderRadius:"50%",
                background:"linear-gradient(135deg,#d47a0c,#a84f00)",
                color:"#fff",fontSize:"12px",fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>3</span>
              Priority Level
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
              {PRIORITY_OPTS.map(opt => {
                const sel = form.priority === opt.value;
                return (
                  <label key={opt.value} style={{
                    padding:"12px 8px",borderRadius:"16px",
                    border: `2px solid ${sel ? opt.accent : "rgba(23,48,66,.12)"}`,
                    background: sel ? opt.soft : "rgba(255,255,255,.7)",
                    textAlign:"center",cursor:"pointer",
                    transition:"all .18s",
                    boxShadow: sel ? `0 4px 16px ${opt.border}` : "none",
                    transform: sel ? "translateY(-2px)" : "none",
                  }}>
                    <input type="radio" name="priority" value={opt.value}
                      checked={sel} onChange={handleChange} style={{display:"none"}}/>
                    <div style={{fontFamily:"'Baloo 2',sans-serif",
                      fontSize:"13.5px",fontWeight:700,
                      color: sel ? opt.accent : "#243746"}}>
                      {opt.label}
                    </div>
                    <div style={{fontSize:"11px",color:"#7a8f9e",marginTop:"3px"}}>
                      {opt.desc}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div style={{padding:"22px 28px"}}>
            {error && (
              <div style={{marginBottom:"16px",padding:"12px 16px",
                borderRadius:"14px",background:"#fde8e8",
                border:"1px solid rgba(185,28,28,.2)",
                fontSize:"13px",color:"#b91c1c"}}>
                {error}
              </div>
            )}
            <div style={{display:"flex",gap:"12px",justifyContent:"flex-end"}}>
              <button type="button" onClick={() => navigate(-1)}
                style={{fontFamily:"'Segoe UI',sans-serif",
                  fontSize:"14px",padding:"12px 22px",
                  borderRadius:"14px",border:"1px solid #d4dde5",
                  background:"rgba(255,255,255,.9)",color:"#556574",cursor:"pointer"}}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                onMouseOver={e=>{ if(!submitting){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(212,122,12,.45)"; }}}
                onMouseOut={e =>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(212,122,12,.28)"; }}
                style={{fontFamily:"'Baloo 2',sans-serif",
                  fontSize:"14px",fontWeight:700,
                  padding:"12px 28px",borderRadius:"14px",border:"none",
                  background: submitting ? "#c4905e" : "linear-gradient(135deg,#d47a0c,#a84f00)",
                  color:"#fff",cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow:"0 6px 20px rgba(212,122,12,.28)",
                  transition:"all .2s"}}>
                {submitting ? "Submitting…" : "Submit Incident Report"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketPage;
