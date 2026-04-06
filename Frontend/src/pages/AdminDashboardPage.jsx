import { useState } from "react";
import useTickets from "../hooks/useTickets";
import { assignTechnician, updateTicketStatus } from "../api/ticketApi";
import { StatusBadge, PriorityBadge } from "../components/tickets/TicketStatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const TECHNICIANS = [
  { id:"tech-001", name:"Kavindu Perera"    },
  { id:"tech-002", name:"Tharuka Fernando"  },
  { id:"tech-003", name:"Nilantha Jayasena" },
];

const STATS = (tickets, unassigned, inProgress, resolved) => [
  { label:"Total Tickets", value: tickets.length,    accent:"#173042", soft:"rgba(23,48,66,.07)"   },
  { label:"Open",          value: unassigned.length, accent:"#1a6fb5", soft:"rgba(26,111,181,.08)" },
  { label:"In Progress",   value: inProgress.length, accent:"#b45309", soft:"rgba(180,83,9,.08)"   },
  { label:"Resolved",      value: resolved.length,   accent:"#1a7a4a", soft:"rgba(26,122,74,.08)"  },
];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { tickets, loading, refetch } = useTickets();
  const [assigning, setAssigning]     = useState({});
  const [selectedTech, setSelectedTech] = useState({});
  const [rejectForm, setRejectForm]   = useState({ ticketId:"", reason:"" });
  const [rejecting, setRejecting]     = useState(false);

  const unassigned = tickets.filter(t => !t.assignedTo && t.status === "OPEN");
  const inProgress = tickets.filter(t => t.status === "IN_PROGRESS");
  const resolved   = tickets.filter(t => t.status === "RESOLVED");

  const handleAssign = async (ticketId) => {
    const techId = selectedTech[ticketId];
    if (!techId) return;
    setAssigning(p => ({ ...p, [ticketId]: true }));
    try {
      await assignTechnician(ticketId, techId);
      refetch();
    } catch { alert("Assignment failed"); }
    finally { setAssigning(p => ({ ...p, [ticketId]: false })); }
  };

  const handleReject = async () => {
    if (!rejectForm.ticketId || !rejectForm.reason.trim()) {
      alert("Select a ticket and provide a reason"); return;
    }
    setRejecting(true);
    try {
      await updateTicketStatus(rejectForm.ticketId, {
        status:"REJECTED", rejectionReason: rejectForm.reason,
      });
      setRejectForm({ ticketId:"", reason:"" }); refetch();
    } catch { alert("Rejection failed"); }
    finally { setRejecting(false); }
  };

  if (loading) return <LoadingSpinner />;

  const card = {
    background:"rgba(255,255,255,.82)",
    border:"1px solid rgba(18,51,76,.1)",
    borderRadius:"22px",
    boxShadow:"0 8px 32px rgba(23,48,66,.08)",
    backdropFilter:"blur(12px)",
    overflow:"hidden",
  };

  const selectStyle = {
    fontSize:"13px", padding:"7px 12px",
    borderRadius:"12px", border:"1px solid #d4dde5",
    background:"rgba(255,255,255,.9)", color:"#173042",
    outline:"none", cursor:"pointer", width:"100%",
    fontFamily:"'Segoe UI',sans-serif",
  };

  const inputStyle = {
    width:"100%", padding:"11px 14px",
    borderRadius:"14px", border:"1px solid #d4dde5",
    background:"rgba(255,255,255,.92)", color:"#173042",
    fontSize:"13.5px", outline:"none", boxSizing:"border-box",
    fontFamily:"'Segoe UI',sans-serif",
    transition:"border .18s",
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(circle at 70% 5%,rgba(255,196,112,.22),transparent 35%),
                  linear-gradient(135deg,#f5efe4 0%,#f7f9fc 50%,#eef4f6 100%)`,
      fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",
      paddingBottom:"60px",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap');`}</style>

      <div style={{maxWidth:"1060px",margin:"0 auto",padding:"0 28px"}}>

        {/* ── Hero ── */}
        <div style={{padding:"44px 0 32px"}}>
          <p style={{fontFamily:"'Baloo 2',sans-serif",fontSize:".75rem",
            fontWeight:700,textTransform:"uppercase",letterSpacing:".16em",
            color:"#9a5d10",margin:"0 0 5px"}}>Administration</p>
          <h1 style={{fontFamily:"'Baloo 2',sans-serif",
            fontSize:"clamp(1.9rem,4vw,2.8rem)",fontWeight:800,
            color:"#173042",letterSpacing:"-.04em",lineHeight:1.05,margin:0}}>
            Admin Dashboard
          </h1>
          <p style={{fontSize:".95rem",color:"#7a8f9e",marginTop:"6px"}}>
            Assign technicians, manage ticket workflow and monitor campus operations
          </p>
        </div>

        {/* ── Stats ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"32px"}}>
          {STATS(tickets,unassigned,inProgress,resolved).map(s => (
            <div key={s.label} style={{
              background:"rgba(255,255,255,.82)",
              border:`1px solid ${s.accent}22`,
              borderTop:`3px solid ${s.accent}`,
              borderRadius:"18px",padding:"18px 20px",
              boxShadow:"0 4px 20px rgba(23,48,66,.07)",
              backdropFilter:"blur(12px)",
            }}>
              <div style={{fontFamily:"'Baloo 2',sans-serif",
                fontSize:"2.4rem",fontWeight:800,color:s.accent,lineHeight:1}}>
                {s.value}
              </div>
              <div style={{fontSize:"12px",color:"#7a8f9e",
                marginTop:"5px",textTransform:"uppercase",letterSpacing:".06em"}}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Unassigned tickets ── */}
        <div style={{...card, marginBottom:"20px"}}>
          <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(23,48,66,.08)",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <h2 style={{fontFamily:"'Baloo 2',sans-serif",
              fontSize:"1.1rem",fontWeight:700,color:"#173042",margin:0}}>
              Unassigned Tickets
            </h2>
            <span style={{fontSize:"12px",padding:"4px 12px",borderRadius:"20px",
              background:"rgba(26,111,181,.1)",color:"#1a6fb5",fontWeight:600}}>
              {unassigned.length} pending
            </span>
          </div>

          {unassigned.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px",color:"#7a8f9e"}}>
              <div style={{fontSize:"2.4rem",marginBottom:"10px"}}></div>
              <p style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"1rem",
                fontWeight:600,color:"#173042",margin:"0 0 4px"}}>
                All caught up!
              </p>
              <p style={{fontSize:"13px"}}>All open tickets are assigned.</p>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13.5px"}}>
                <thead>
                  <tr style={{background:"rgba(23,48,66,.03)"}}>
                    {["Ticket","Priority","Category","Assign to",""].map(h => (
                      <th key={h} style={{padding:"11px 20px",textAlign:"left",
                        fontSize:"11px",color:"#7a8f9e",
                        textTransform:"uppercase",letterSpacing:".07em",
                        fontWeight:600,borderBottom:"1px solid rgba(23,48,66,.07)"}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {unassigned.map(t => (
                    <tr key={t.id}
                      style={{borderBottom:"1px solid rgba(23,48,66,.06)",
                        transition:"background .13s"}}
                      onMouseOver={e => e.currentTarget.style.background="rgba(255,196,112,.08)"}
                      onMouseOut={e  => e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"14px 20px"}}>
                        <button onClick={() => navigate(`/tickets/${t.id}`)}
                          style={{background:"none",border:"none",cursor:"pointer",
                            textAlign:"left",padding:0}}>
                          <div style={{fontSize:"11px",color:"#9a5d10",
                            fontWeight:600,marginBottom:"2px"}}>
                            #{t.id.slice(-6).toUpperCase()}
                          </div>
                          <div style={{fontWeight:600,color:"#173042",
                            maxWidth:"280px",overflow:"hidden",
                            textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {t.title}
                          </div>
                        </button>
                      </td>
                      <td style={{padding:"14px 20px"}}>
                        <PriorityBadge priority={t.priority}/>
                      </td>
                      <td style={{padding:"14px 20px",color:"#556574"}}>{t.category}</td>
                      <td style={{padding:"14px 20px",minWidth:"180px"}}>
                        <select value={selectedTech[t.id]||""}
                          onChange={e => setSelectedTech(p=>({...p,[t.id]:e.target.value}))}
                          style={selectStyle}>
                          <option value="">— Select —</option>
                          {TECHNICIANS.map(tech => (
                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{padding:"14px 20px"}}>
                        <button onClick={() => handleAssign(t.id)}
                          disabled={!selectedTech[t.id] || assigning[t.id]}
                          style={{fontFamily:"'Baloo 2',sans-serif",
                            fontSize:"12px",fontWeight:700,
                            padding:"7px 16px",borderRadius:"10px",border:"none",
                            background: !selectedTech[t.id] ? "rgba(23,48,66,.08)" : "linear-gradient(135deg,#d47a0c,#a84f00)",
                            color: !selectedTech[t.id] ? "#b0bec8" : "#fff",
                            cursor: !selectedTech[t.id] ? "not-allowed" : "pointer",
                            transition:"all .18s"}}>
                          {assigning[t.id] ? "…" : "Assign"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Reject ticket ── */}
        <div style={card}>
          <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(23,48,66,.08)"}}>
            <h2 style={{fontFamily:"'Baloo 2',sans-serif",
              fontSize:"1.1rem",fontWeight:700,color:"#173042",margin:0}}>
              Reject a Ticket
            </h2>
          </div>
          <div style={{padding:"22px 24px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
              <div>
                <label style={{display:"block",fontSize:"12.5px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>Select Ticket</label>
                <select value={rejectForm.ticketId}
                  onChange={e => setRejectForm(p=>({...p,ticketId:e.target.value}))}
                  style={selectStyle}>
                  <option value="">— Select ticket —</option>
                  {tickets
                    .filter(t => !["CLOSED","REJECTED","RESOLVED"].includes(t.status))
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        #{t.id.slice(-6).toUpperCase()} — {t.title.slice(0,38)}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label style={{display:"block",fontSize:"12.5px",fontWeight:600,
                  color:"#243746",marginBottom:"7px"}}>
                  Rejection Reason <span style={{color:"#d47a0c"}}>*</span>
                </label>
                <input value={rejectForm.reason}
                  onChange={e => setRejectForm(p=>({...p,reason:e.target.value}))}
                  placeholder="e.g. Duplicate ticket — see #TKT-0030"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor="#d47a0c"}
                  onBlur={e  => e.target.style.borderColor="#d4dde5"}/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={handleReject} disabled={rejecting}
                onMouseOver={e=>{ if(!rejecting) e.currentTarget.style.background="#fbd5d5"; }}
                onMouseOut={e =>{ e.currentTarget.style.background="#fde8e8"; }}
                style={{fontFamily:"'Baloo 2',sans-serif",
                  fontSize:"13.5px",fontWeight:700,
                  padding:"11px 24px",borderRadius:"14px",
                  border:"1px solid rgba(185,28,28,.3)",
                  background:"#fde8e8",color:"#b91c1c",
                  cursor: rejecting ? "not-allowed" : "pointer",
                  transition:"background .18s"}}>
                {rejecting ? "Rejecting…" : "Reject & Notify User"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
