import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTicketDetail from "../hooks/useTicketDetail";
import useComments from "../hooks/useComments";
import { useAuth } from "../context/AuthContext";
import TicketWorkflow from "../components/tickets/TicketWorkflow";
import { StatusBadge, PriorityBadge } from "../components/tickets/TicketStatusBadge";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import AttachmentUpload from "../components/attachments/AttachmentUpload";
import AttachmentGrid from "../components/attachments/AttachmentGrid";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { formatDateTime } from "../utils/formatDate";
import { TICKET_STATUS } from "../utils/constants";

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isTechnician } = useAuth();
  const { ticket, loading, error, changeStatus, refetch } = useTicketDetail(id);
  const { comments, loading: cLoading, postComment, editComment, removeComment } = useComments(id);

  const [statusForm, setStatusForm] = useState({ status:"", rejectionReason:"", resolutionNotes:"" });
  const [updatingStatus, setUpdating] = useState(false);
  const [attachments, setAttachments] = useState([]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!ticket) return null;

  const canUpdate = isAdmin() || (isTechnician() && ticket.assignedTo === user?.id);

  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;
    setUpdating(true);
    try {
      await changeStatus(statusForm);
      setStatusForm({ status:"", rejectionReason:"", resolutionNotes:"" });
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdating(false);
    }
  };

  const glassCard = {
    background:"rgba(255,255,255,.86)",
    border:"1px solid rgba(18,51,76,.1)",
    borderRadius:"24px",
    boxShadow:"0 18px 34px rgba(23,48,66,.08)",
    backdropFilter:"blur(12px)",
    overflow:"hidden",
  };

  const cardHead = {
    padding:"15px 22px",
    borderBottom:"1px solid rgba(23,48,66,.08)",
    display:"flex",alignItems:"center",justifyContent:"space-between",
  };

  const cardBody = { padding:"20px 22px" };

  const labelStyle = {
    fontSize:"10.5px",fontWeight:700,
    textTransform:"uppercase",letterSpacing:".08em",color:"#7a8f9e",
  };

  const selectStyle = {
    width:"100%",padding:"10px 14px",
    borderRadius:"14px",border:"1px solid #d4dde5",
    background:"rgba(255,255,255,.92)",color:"#173042",
    fontSize:"13px",outline:"none",cursor:"pointer",
    fontFamily:"'Segoe UI',sans-serif",transition:"border .18s",
  };

  const textareaStyle = {
    width:"100%",padding:"10px 14px",
    borderRadius:"14px",border:"1px solid #d4dde5",
    background:"rgba(255,255,255,.92)",color:"#173042",
    fontSize:"13px",outline:"none",resize:"none",
    fontFamily:"'Segoe UI',sans-serif",lineHeight:1.6,
    transition:"border .18s",
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(circle at top left, rgba(196, 233, 223, 0.95), transparent 24%),
                  linear-gradient(180deg, #d9efe7 0%, #f7faf6 28%, #eef4f6 100%)`,
      fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",
      paddingBottom:"60px",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap');`}</style>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"0 28px"}}>
        <div style={{paddingTop:"32px",marginBottom:"20px"}}>
          <button
            onClick={() => navigate("/tickets")}
            style={{
              display:"flex",
              alignItems:"center",
              gap:"5px",
              fontSize:"13px",
              color:"#ec6272",
              background:"none",
              border:"none",
              cursor:"pointer",
              padding:0,
              fontWeight:600,
            }}
          >
            ← All Tickets
          </button>
        </div>

        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"18px",flexWrap:"wrap",marginBottom:"28px"}}>
          <div>
            <p style={{margin:"0 0 6px",fontSize:".76rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".16em",color:"#ec6272"}}>
              Ticket Overview
            </p>
            <h1 style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"clamp(1.8rem,4vw,2.7rem)",fontWeight:800,color:"#173042",letterSpacing:"-.04em",margin:"0 0 6px",lineHeight:1.02}}>
              {ticket.title}
            </h1>
            <p style={{margin:0,color:"#6f7f98",fontSize:".95rem"}}>
              #{id.slice(-6).toUpperCase()} • {ticket.category} • {ticket.location || "Campus location"}
            </p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
            <StatusBadge status={ticket.status}/>
            <PriorityBadge priority={ticket.priority}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 330px",gap:"20px",alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
            <div style={glassCard}>
              <div style={cardHead}>
                <h2 style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"1rem",fontWeight:700,color:"#173042",margin:0}}>
                  Description
                </h2>
              </div>
              <div style={cardBody}>
                <p style={{fontSize:"14px",color:"#556574",lineHeight:1.75,margin:0}}>
                  {ticket.description}
                </p>
                {ticket.resolutionNotes && (
                  <div style={{marginTop:"16px",padding:"13px 16px",borderRadius:"16px",background:"#e8f5ee",border:"1px solid rgba(26,122,74,.2)"}}>
                    <p style={{fontSize:"11px",fontWeight:700,color:"#1a7a4a",textTransform:"uppercase",letterSpacing:".06em",margin:"0 0 4px"}}>
                      Resolution Notes
                    </p>
                    <p style={{fontSize:"13.5px",color:"#1a5c36",margin:0}}>
                      {ticket.resolutionNotes}
                    </p>
                  </div>
                )}
                {ticket.rejectionReason && (
                  <div style={{marginTop:"16px",padding:"13px 16px",borderRadius:"16px",background:"#fde8e8",border:"1px solid rgba(185,28,28,.2)"}}>
                    <p style={{fontSize:"11px",fontWeight:700,color:"#b91c1c",textTransform:"uppercase",letterSpacing:".06em",margin:"0 0 4px"}}>
                      Rejection Reason
                    </p>
                    <p style={{fontSize:"13.5px",color:"#7f1d1d",margin:0}}>
                      {ticket.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={glassCard}>
              <div style={cardHead}>
                <span style={labelStyle}>Ticket Workflow</span>
              </div>
              <div style={{...cardBody, background:"rgba(248,251,255,.55)"}}>
                <TicketWorkflow currentStatus={ticket.status}/>
              </div>
            </div>

            <div style={glassCard}>
              <div style={cardHead}>
                <span style={labelStyle}>Evidence Photos</span>
                <span style={{fontSize:"12px",color:"#b0bec8"}}>
                  {ticket.attachments?.length||0} / 3
                </span>
              </div>
              <div style={{...cardBody,display:"flex",flexDirection:"column",gap:"16px", background:"rgba(248,251,255,.45)"}}>
                <AttachmentGrid
                  ticketId={id}
                  attachments={ticket.attachments||[]}
                  onDeleted={aid => setAttachments(p=>p.filter(a=>a.id!==aid))}
                />
                <AttachmentUpload
                  ticketId={id}
                  currentCount={ticket.attachments?.length||0}
                  onUploaded={att => setAttachments(p=>[...p,att])}
                />
              </div>
            </div>

            <div style={glassCard}>
              <div style={cardHead}>
                <span style={labelStyle}>Comments & Updates</span>
              </div>
              <div style={{...cardBody, background:"rgba(248,251,255,.3)"}}>
                <CommentList comments={comments} loading={cLoading} onEdit={editComment} onDelete={removeComment}/>
                <CommentForm onSubmit={postComment}/>
              </div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
            <div style={glassCard}>
              <div style={cardHead}>
                <span style={labelStyle}>Details</span>
              </div>
              <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:"12px"}}>
                {[
                  { k:"Category", v: ticket.category },
                  { k:"Location", v: ticket.location || "—" },
                  { k:"Reported by", v: ticket.reportedBy },
                  { k:"Assigned to", v: ticket.assignedTo || "—", warn: !ticket.assignedTo },
                  { k:"Contact", v: ticket.contactDetails || "—" },
                  { k:"Created", v: formatDateTime(ticket.createdAt) },
                  { k:"Updated", v: formatDateTime(ticket.updatedAt) },
                ].map(({ k, v, warn }) => (
                  <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"10px",padding:"10px 0",borderBottom:"1px solid rgba(23,48,66,.06)"}}>
                    <span style={{fontSize:"11.5px",color:"#7a8f9e"}}>{k}</span>
                    <span style={{fontSize:"12px",fontWeight:600,textAlign:"right",color: warn ? "#d47a0c" : "#173042"}}>
                      {warn ? "Unassigned" : v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {canUpdate && (
              <div style={glassCard}>
                <div style={cardHead}>
                  <span style={labelStyle}>Update Status</span>
                </div>
                <div style={{padding:"18px 20px",display:"flex",flexDirection:"column",gap:"12px", background:"rgba(248,251,255,.45)"}}>
                  <select
                    value={statusForm.status}
                    onChange={e => setStatusForm(p=>({...p,status:e.target.value}))}
                    onFocus={e => e.target.style.borderColor="#ec6272"}
                    onBlur={e => e.target.style.borderColor="#d4dde5"}
                    style={selectStyle}
                  >
                    <option value="">Move to…</option>
                    {Object.values(TICKET_STATUS)
                      .filter(s => s !== ticket.status)
                      .map(s => (
                        <option key={s} value={s}>{s.replace("_"," ")}</option>
                      ))}
                  </select>

                  <textarea
                    value={statusForm.resolutionNotes}
                    rows={2}
                    onChange={e => setStatusForm(p=>({...p,resolutionNotes:e.target.value}))}
                    placeholder="Resolution notes…"
                    onFocus={e => e.target.style.borderColor="#ec6272"}
                    onBlur={e => e.target.style.borderColor="#d4dde5"}
                    style={textareaStyle}
                  />

                  {statusForm.status === "REJECTED" && (
                    <textarea
                      value={statusForm.rejectionReason}
                      rows={2}
                      onChange={e => setStatusForm(p=>({...p,rejectionReason:e.target.value}))}
                      placeholder="Rejection reason (required)…"
                      onFocus={e => e.target.style.borderColor="#b91c1c"}
                      onBlur={e => e.target.style.borderColor="#d4dde5"}
                      style={{...textareaStyle,borderColor:"rgba(185,28,28,.3)"}}
                    />
                  )}

                  <button
                    onClick={handleStatusUpdate}
                    disabled={!statusForm.status || updatingStatus}
                    onMouseOver={e=>{ if(!updatingStatus&&statusForm.status){ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(240,93,114,.32)"; }}}
                    onMouseOut={e =>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(240,93,114,.2)"; }}
                    style={{
                      fontFamily:"'Baloo 2',sans-serif",
                      fontSize:"13.5px",
                      fontWeight:700,
                      padding:"11px 0",
                      borderRadius:"14px",
                      border:"none",
                      width:"100%",
                      background: (!statusForm.status||updatingStatus) ? "rgba(23,48,66,.12)" : "linear-gradient(135deg,#f05d72,#ea5160)",
                      color: (!statusForm.status||updatingStatus) ? "#b0bec8" : "#fff",
                      cursor: (!statusForm.status||updatingStatus) ? "not-allowed" : "pointer",
                      boxShadow:"0 4px 16px rgba(240,93,114,.2)",
                      transition:"all .2s",
                    }}
                  >
                    {updatingStatus ? "Saving…" : "Save Status"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
