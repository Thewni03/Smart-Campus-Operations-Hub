import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTickets from "../hooks/useTickets";
import TicketCard from "../components/tickets/TicketCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import { TICKET_STATUS, PRIORITY } from "../utils/constants";

const TicketListPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({ status:"", priority:"" });
  const [myOnly, setMyOnly]   = useState(false);

  const { tickets, loading, error, refetch } = useTickets(
    filters.status || filters.priority ? filters : {}, myOnly
  );

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

        {/* ── Hero ── */}
        <div style={{padding:"40px 0 26px",display:"flex",
          alignItems:"flex-end",justifyContent:"space-between",
          gap:"20px",flexWrap:"wrap"}}>
          <div>
            <p style={{fontFamily:"'Baloo 2',sans-serif",fontSize:".75rem",
              fontWeight:700,textTransform:"uppercase",letterSpacing:".16em",
              color:"#ec6272",margin:"0 0 6px"}}>
              Incident Management
            </p>
            <h1 style={{fontFamily:"'Baloo 2',sans-serif",
              fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,
              color:"#173042",letterSpacing:"-.05em",lineHeight:1.02,margin:0}}>
              Incident Tickets
            </h1>
            <p style={{fontSize:".96rem",color:"#6f7f98",marginTop:"8px",maxWidth:"40rem",lineHeight:1.7}}>
              {isAdmin()
                ? "All campus incidents — track, assign, and resolve"
                : "Your reported incidents and their current status"}
            </p>
          </div>

          <button
            onClick={() => navigate("/tickets/create")}
            onMouseOver={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(212,122,12,.42)"; }}
            onMouseOut={e =>{ e.currentTarget.style.transform="translateY(0)";   e.currentTarget.style.boxShadow="0 6px 20px rgba(212,122,12,.28)"; }}
            style={{fontFamily:"'Baloo 2',sans-serif",fontSize:".95rem",
              fontWeight:700,padding:"12px 26px",borderRadius:"16px",border:"none",
              background:"linear-gradient(135deg,#f05d72,#ea5160)",
              color:"#fff",cursor:"pointer",
              boxShadow:"0 6px 20px rgba(234,81,96,.28)",
              transition:"all .2s",whiteSpace:"nowrap"}}>
            + Create Ticket
          </button>
        </div>

        {/* ── Filter bar ── */}
        <div style={{
          background:"rgba(255,255,255,.86)",
          border:"1px solid rgba(23,48,66,.1)",
          borderRadius:"24px",
          boxShadow:"0 18px 34px rgba(23,48,66,.08)",
          backdropFilter:"blur(12px)",
          padding:"16px 20px",
          display:"flex",alignItems:"center",
          gap:"10px",flexWrap:"wrap",marginBottom:"28px",
        }}>
          {[
            { value: filters.status,   onChange: v => setFilters(p=>({...p,status:v})),
              placeholder:"All Status",  opts: Object.values(TICKET_STATUS).map(s=>({v:s,l:s.replace("_"," ")})) },
            { value: filters.priority, onChange: v => setFilters(p=>({...p,priority:v})),
              placeholder:"All Priority", opts: Object.values(PRIORITY).map(p=>({v:p,l:p})) },
          ].map((sel,i) => (
            <select key={i} value={sel.value}
              onChange={e => sel.onChange(e.target.value)}
              style={{fontSize:"13px",padding:"10px 14px",
                borderRadius:"14px",border:"1px solid rgba(23,48,66,.12)",
                background:"#f8fbff",color:"#173042",
                outline:"none",cursor:"pointer"}}>
              <option value="">{sel.placeholder}</option>
              {sel.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          ))}

          {isAdmin() && (
            <button
              onClick={() => setMyOnly(p=>!p)}
              style={{fontFamily:"'Baloo 2',sans-serif",fontSize:"13px",fontWeight:600,
                padding:"10px 16px",borderRadius:"14px",border:"1px solid",
                borderColor: myOnly ? "#ec6272" : "rgba(23,48,66,.12)",
                background: myOnly ? "linear-gradient(135deg,#f05d72,#ea5160)" : "#f8fbff",
                color: myOnly ? "#fff" : "#173042",
                cursor:"pointer",transition:"all .18s"}}>
              {myOnly ? "My Tickets" : "All Tickets"}
            </button>
          )}

          <button
            onClick={() => { setFilters({status:"",priority:""}); refetch(); }}
            style={{fontSize:"13px",color:"#637886",background:"#f8fbff",
              border:"1px solid rgba(23,48,66,.12)",cursor:"pointer",padding:"10px 14px",borderRadius:"14px",fontWeight:600}}>
            Clear
          </button>

          <span style={{marginLeft:"auto",fontSize:"12px",
            padding:"8px 14px",borderRadius:"999px",
            background:"rgba(240,93,114,.08)",color:"#6f7f98",fontWeight:700}}>
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Content ── */}
        {loading && <LoadingSpinner />}
        {error   && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && tickets.length === 0 && (
          <div style={{textAlign:"center",padding:"70px 20px",
            background:"rgba(255,255,255,.82)",borderRadius:"28px",
            border:"1px solid rgba(23,48,66,.08)",
            boxShadow:"0 18px 34px rgba(23,48,66,.08)"}}>
            <div style={{fontSize:"3.2rem",marginBottom:"14px"}}>📋</div>
            <p style={{fontFamily:"'Baloo 2',sans-serif",
              fontSize:"1.15rem",fontWeight:700,color:"#173042",margin:"0 0 7px"}}>
              No tickets found
            </p>
            <p style={{fontSize:".9rem",color:"#7a8f9e"}}>
              Try changing your filters or report a new incident
            </p>
          </div>
        )}

        {!loading && !error && tickets.length > 0 && (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
            gap:"18px",
          }}>
            {tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketListPage;
