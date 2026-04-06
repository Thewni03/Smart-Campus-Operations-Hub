import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const pupilL = useRef(null);
  const pupilR = useRef(null);

  useEffect(() => {
    const move = (e) => {
      [{ ref: pupilL, cx: 80, cy: 76 }, { ref: pupilR, cx: 120, cy: 76 }]
        .forEach(({ ref, cx, cy }) => {
          if (!ref.current) return;
          const svg  = ref.current.closest("svg");
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          const mx   = (e.clientX - rect.left) / (rect.width  / 200);
          const my   = (e.clientY - rect.top)  / (rect.height / 230);
          const ang  = Math.atan2(my - cy, mx - cx);
          ref.current.setAttribute("transform",
            `translate(${cx + Math.cos(ang)*4} ${cy + Math.sin(ang)*4})`);
        });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(circle at 30% 20%,rgba(255,196,112,.25),transparent 40%),
                  linear-gradient(135deg,#f5efe4 0%,#f7f9fc 50%,#eef4f6 100%)`,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      padding:"40px 24px",overflow:"hidden",position:"relative",
      fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap');
        @keyframes bob     {0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes shadow  {0%,100%{transform:scaleX(1);opacity:.18}50%{transform:scaleX(.65);opacity:.09}}
        @keyframes antBeat {0%,100%{r:6;opacity:1}50%{r:10;opacity:.4}}
        @keyframes star    {0%,100%{transform:translateY(0)rotate(0)}50%{transform:translateY(-12px)rotate(22deg)}}
        @keyframes blob    {0%,100%{transform:translateY(0)scale(1)}50%{transform:translateY(-18px)scale(1.05)}}
        @keyframes up      {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glitch  {
          0%,84%,100%{text-shadow:none;transform:skewX(0)}
          86%{text-shadow:-3px 0 #d47a0c,3px 0 #173042;transform:skewX(-1.5deg)}
          88%{text-shadow:3px 0 #d47a0c,-3px 0 #173042;transform:skewX(1.5deg)}
          90%{text-shadow:none}
        }
        @keyframes blink{0%,88%,100%{opacity:1}90%,95%{opacity:0}}
      `}</style>

      {/* blobs */}
      {[{w:340,h:340,top:"2%",left:"2%",c:"rgba(212,122,12,.07)",d:"0s"},
        {w:200,h:200,top:"70%",left:"78%",c:"rgba(23,48,66,.05)",d:"2s"},
        {w:140,h:140,top:"45%",left:"88%",c:"rgba(212,122,12,.09)",d:"1s"},
      ].map((b,i)=>(
        <div key={i} style={{position:"absolute",top:b.top,left:b.left,
          width:b.w,height:b.h,borderRadius:"50%",background:b.c,
          pointerEvents:"none",animation:`blob 7s ${b.d} ease-in-out infinite`}}/>
      ))}

      {/* Robot */}
      <div style={{position:"relative",zIndex:1,animation:"bob 3s ease-in-out infinite"}}>

        {/* stars */}
        {[{t:"-28px",l:"6px",s:16,d:"0s",dr:"3s"},
          {t:"-18px",l:"162px",s:12,d:".6s",dr:"2.8s"},
          {t:"32px",l:"-22px",s:10,d:"1.1s",dr:"3.5s"},
          {t:"16px",l:"193px",s:14,d:"1.7s",dr:"4s"},
        ].map((s,i)=>(
          <svg key={i} width={s.s} height={s.s} viewBox="0 0 24 24"
            style={{position:"absolute",top:s.t,left:s.l,
              animation:`star ${s.dr} ${s.d} ease-in-out infinite`}}>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
              fill="#d47a0c" opacity=".75"/>
          </svg>
        ))}

        <svg width="200" height="230" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
          {/* antenna */}
          <line x1="100" y1="14" x2="100" y2="36" stroke="#173042" strokeWidth="3.5" strokeLinecap="round"/>
          <circle cx="100" cy="9" fill="#d47a0c">
            <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          {/* head */}
          <rect x="50" y="34" width="100" height="84" rx="24" fill="#173042"/>
          <rect x="55" y="39" width="90" height="74" rx="20" fill="#1e3d55"/>
          {/* eye whites */}
          <circle cx="80"  cy="76" r="17" fill="white"/>
          <circle cx="120" cy="76" r="17" fill="white"/>
          {/* pupils */}
          <g ref={pupilL} transform="translate(80 76)">
            <circle cx="0" cy="0" r="10" fill="#173042"/>
            <circle cx="3" cy="-3" r="3.5" fill="white" opacity=".9"/>
          </g>
          <g ref={pupilR} transform="translate(120 76)">
            <circle cx="0" cy="0" r="10" fill="#173042"/>
            <circle cx="3" cy="-3" r="3.5" fill="white" opacity=".9"/>
          </g>
          {/* sad mouth */}
          <path d="M78 107 Q100 97 122 107" stroke="#d47a0c" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          {/* blush */}
          <circle cx="60"  cy="95" r="10" fill="#d47a0c" opacity=".14"/>
          <circle cx="140" cy="95" r="10" fill="#d47a0c" opacity=".14"/>
          {/* ear bolts */}
          <circle cx="50"  cy="74" r="5" fill="#0d2233"/>
          <circle cx="150" cy="74" r="5" fill="#0d2233"/>
          {/* neck */}
          <rect x="88" y="118" width="24" height="16" rx="5" fill="#173042"/>
          <rect x="92" y="121" width="16" height="10" rx="3" fill="#0d2233"/>
          {/* body */}
          <rect x="42" y="134" width="116" height="76" rx="22" fill="#173042"/>
          <rect x="48" y="140" width="104" height="64" rx="18" fill="#1e3d55"/>
          {/* chest screen */}
          <rect x="64" y="150" width="72" height="40" rx="12" fill="#0d2233"
            style={{animation:"blink 5s 3s ease-in-out infinite"}}/>
          <text x="100" y="176" textAnchor="middle" fontSize="15" fontWeight="800"
            fill="#d47a0c" fontFamily="monospace">404</text>
          {/* side lights */}
          <circle cx="57" cy="157" r="5.5" fill="#d47a0c" opacity=".75"/>
          <circle cx="57" cy="173" r="5.5" fill="#d47a0c" opacity=".45"/>
          <circle cx="57" cy="189" r="5.5" fill="#d47a0c" opacity=".2"/>
          <circle cx="143" cy="157" r="5.5" fill="#9a5d10" opacity=".5"/>
          <circle cx="143" cy="173" r="5.5" fill="#9a5d10" opacity=".3"/>
          {/* arms */}
          <rect x="6"   y="138" width="36" height="20" rx="10" fill="#173042"/>
          <rect x="10"  y="140" width="28" height="16" rx="8"  fill="#1e3d55"/>
          <rect x="158" y="138" width="36" height="20" rx="10" fill="#173042"/>
          <rect x="160" y="140" width="28" height="16" rx="8"  fill="#1e3d55"/>
          {/* hands */}
          <circle cx="11"  cy="148" r="10" fill="#173042"/>
          <circle cx="189" cy="148" r="10" fill="#173042"/>
          <circle cx="8"   cy="145" r="4"  fill="#1e3d55"/>
          <circle cx="186" cy="145" r="4"  fill="#1e3d55"/>
          {/* legs */}
          <rect x="66"  y="210" width="26" height="16" rx="8" fill="#173042"/>
          <rect x="108" y="210" width="26" height="16" rx="8" fill="#173042"/>
          <rect x="62"  y="222" width="34" height="8"  rx="4" fill="#0d2233"/>
          <rect x="104" y="222" width="34" height="8"  rx="4" fill="#0d2233"/>
        </svg>

        <div style={{width:"110px",height:"12px",borderRadius:"50%",
          background:"rgba(23,48,66,.15)",margin:"2px auto 0",
          animation:"shadow 3s ease-in-out infinite"}}/>
      </div>

      {/* text */}
      <div style={{position:"relative",zIndex:1,textAlign:"center",
        marginTop:"28px",animation:"up .6s .15s ease both"}}>

        <h1 style={{
          fontFamily:"'Baloo 2','Segoe UI',sans-serif",
          fontSize:"clamp(5rem,14vw,8.5rem)",fontWeight:800,
          color:"#173042",lineHeight:.88,letterSpacing:"-.04em",margin:0,
          animation:"glitch 5s 2.5s ease-in-out infinite",
        }}>4<span style={{color:"#d47a0c"}}>0</span>4</h1>

        <p style={{fontFamily:"'Baloo 2','Segoe UI',sans-serif",
          fontSize:"1.45rem",fontWeight:700,color:"#173042",margin:"14px 0 8px"}}>
          Oops — page went missing!
        </p>

        <p style={{fontSize:".98rem",color:"#7a8f9e",
          maxWidth:"340px",margin:"0 auto 30px",lineHeight:1.65}}>
          Looks like this page went on a campus tour and never came back.
          Let's get you somewhere useful.
        </p>

        <button
          onClick={() => navigate("/tickets")}
          onMouseOver={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 14px 34px rgba(212,122,12,.45)"; }}
          onMouseOut={e =>{ e.currentTarget.style.transform="translateY(0)";   e.currentTarget.style.boxShadow="0 8px 24px rgba(212,122,12,.32)"; }}
          style={{
            fontFamily:"'Baloo 2','Segoe UI',sans-serif",
            fontSize:"1.05rem",fontWeight:700,
            padding:"13px 34px",borderRadius:"16px",border:"none",
            background:"linear-gradient(135deg,#d47a0c,#a84f00)",
            color:"#fff",cursor:"pointer",
            boxShadow:"0 8px 24px rgba(212,122,12,.32)",
            transition:"all .22s",
          }}>
          Take me home
        </button>

        <p style={{marginTop:"14px",fontSize:".86rem",color:"#b0bec8"}}>
          or{" "}
          <span onClick={()=>navigate(-1)}
            style={{color:"#9a5d10",cursor:"pointer",fontWeight:600,textDecoration:"underline"}}>
            go back
          </span>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
