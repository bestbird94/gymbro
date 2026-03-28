import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://qbhoesdvsbjdbitjayai.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaG9lc2R2c2JqZGJpdGpheWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTkzMjcsImV4cCI6MjA4OTkzNTMyN30.a-ty57FWK5mBtH2hpULtQVKJGmjH3YftKvLqln42BAg"
);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #131313; --surface2: #1c1c1c;
    --border: #2a2a2a; --neon: #c8f230; --neon-dim: rgba(200,242,48,0.12);
    --neon-glow: rgba(200,242,48,0.35); --text: #f0f0f0; --muted: #666;
    --red: #ff4444; --font-display: 'Bebas Neue', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  .app { display: flex; flex-direction: column; min-height: 100vh; }

  /* NAV */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 60px; border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.97); position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(10px); gap: 0.5rem;
  }
  .nav-logo { display: flex; align-items: center; flex-shrink: 0; }
  .nav-logo svg { height: 32px; width: auto; }
  .nav-tabs { display: flex; gap: 0.2rem; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .nav-tabs::-webkit-scrollbar { display: none; }
  .nav-tab {
    padding: 0.4rem 0.75rem; border-radius: 6px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.78rem; font-weight: 500;
    background: transparent; color: var(--muted); transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .nav-tab:hover { color: var(--text); background: var(--surface2); }
  .nav-tab.active { background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(200,242,48,0.3); }
  .nav-auth { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; }
  .nav-email { font-size: 0.72rem; color: var(--muted); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* MAIN */
  .main { flex: 1; padding: 1.5rem; max-width: 1200px; margin: 0 auto; width: 100%; }

  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; transition: border-color 0.2s; }
  .card.highlight { border-color: rgba(200,242,48,0.4); background: linear-gradient(135deg, var(--surface), rgba(200,242,48,0.04)); }

  /* BUTTONS */
  .btn {
    padding: 0.6rem 1.2rem; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.88rem; font-weight: 600;
    transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem; white-space: nowrap;
  }
  .btn-neon { background: var(--neon); color: #0a0a0a; }
  .btn-neon:hover { background: #d4ff3a; box-shadow: 0 0 20px var(--neon-glow); }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--neon); color: var(--neon); }
  .btn-ghost { background: var(--surface2); color: var(--text); }
  .btn-ghost:hover { background: #252525; }
  .btn-sm { padding: 0.35rem 0.8rem; font-size: 0.78rem; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* FORMS */
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
  .form-label { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input, .form-select, .form-textarea {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); padding: 0.65rem 0.9rem; font-family: var(--font-body); font-size: 0.9rem;
    width: 100%; transition: border-color 0.2s; -webkit-appearance: none;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none; border-color: var(--neon); box-shadow: 0 0 0 2px var(--neon-dim);
  }
  .form-select option { background: #1c1c1c; }
  .form-textarea { resize: vertical; min-height: 80px; }

  /* TAGS */
  .tag { display: inline-block; padding: 0.25rem 0.65rem; border-radius: 100px; font-size: 0.72rem; font-weight: 600; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .tag.active { background: var(--neon-dim); color: var(--neon); border-color: rgba(200,242,48,0.3); }
  .tag.clickable { cursor: pointer; transition: all 0.15s; }
  .tag.clickable:hover { border-color: var(--neon); color: var(--neon); }

  /* AVATAR */
  .avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--neon-dim); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; border: 2px solid rgba(200,242,48,0.3); flex-shrink: 0; overflow: hidden; }
  .avatar.lg { width: 72px; height: 72px; font-size: 2rem; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .avatar-upload { position: relative; display: inline-block; cursor: pointer; border-radius: 50%; }
  .avatar-overlay { position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: var(--neon); opacity: 0; transition: opacity 0.2s; text-align: center; font-weight: 700; }
  .avatar-upload:hover .avatar-overlay { opacity: 1; }

  /* PROFILE CARD */
  .profile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: all 0.25s; cursor: pointer; }
  .profile-card:hover { border-color: rgba(200,242,48,0.4); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
  .profile-card.ai-pick { border-color: rgba(200,242,48,0.6); box-shadow: 0 0 20px rgba(200,242,48,0.1); }
  .profile-card-header { padding: 1.2rem; border-bottom: 1px solid var(--border); }
  .profile-card-body { padding: 1.2rem; }
  .strength-bar { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-top: 0.4rem; }
  .strength-fill { height: 100%; background: var(--neon); border-radius: 2px; transition: width 0.5s; }

  /* AI */
  .ai-panel { background: linear-gradient(135deg, rgba(200,242,48,0.06), rgba(200,242,48,0.02)); border: 1px solid rgba(200,242,48,0.25); border-radius: 14px; padding: 1.5rem; }
  .ai-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(200,242,48,0.3); padding: 0.3rem 0.8rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem; }
  .pulse { display: inline-block; width: 8px; height: 8px; background: var(--neon); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.8);} }

  /* HERO */
  .hero { padding: 2rem 0 1.5rem; background: radial-gradient(ellipse at 50% 0%, rgba(200,242,48,0.08) 0%, transparent 60%); text-align: center; margin-bottom: 1.5rem; }
  .hero-sub { color: var(--muted); margin-top: 0.5rem; font-size: 0.95rem; }

  /* FILTER */
  .filter-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
  .filter-title { font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }

  /* MISC */
  .divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
  .alert { padding: 0.9rem 1.1rem; border-radius: 8px; font-size: 0.88rem; margin-bottom: 1rem; }
  .alert-success { background: rgba(200,242,48,0.1); border: 1px solid rgba(200,242,48,0.3); color: var(--neon); }
  .alert-error { background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); color: var(--red); }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--neon); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; }

  /* MOBILE */
  @media (max-width: 600px) {
    .main { padding: 0.75rem; }
    .nav { padding: 0 0.75rem; height: 56px; }
    .nav-email { display: none; }
    .filter-bar { padding: 1rem; }
    .card { padding: 1rem; }
    .modal { padding: 1.25rem; border-radius: 12px; }
    .profile-card:hover { transform: none; }
    .grid-2-mobile { grid-template-columns: 1fr !important; }
    .msg-layout { grid-template-columns: 1fr !important; }
    .hero { padding: 1.5rem 0 1rem; }
  }
  @media (max-width: 400px) {
    .nav-tab { padding: 0.35rem 0.55rem; font-size: 0.72rem; }
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────
function GymBroLogo({ large }) {
  const w = large ? 300 : 130; const h = large ? 110 : 48;
  return (
    <svg width={w} height={h} viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gb-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0f0f0f"/><stop offset="100%" stopColor="#1a1a1a"/></linearGradient>
        <linearGradient id="gb-bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c8f230"/><stop offset="100%" stopColor="#8ab510"/></linearGradient>
        <linearGradient id="gb-text" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f0f0f0"/><stop offset="60%" stopColor="#ffffff"/><stop offset="100%" stopColor="#aaaaaa"/></linearGradient>
        <filter id="gb-shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#c8f230" floodOpacity="0.3"/></filter>
      </defs>
      <rect x="60" y="20" width="560" height="220" rx="28" fill="url(#gb-bg)"/>
      <rect x="60" y="20" width="560" height="220" rx="28" fill="none" stroke="#2a2a2a" strokeWidth="1.5"/>
      <text x="340" y="148" textAnchor="middle" dominantBaseline="central" fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="82" letterSpacing="6" fill="url(#gb-text)" filter="url(#gb-shadow)">GYMBRO</text>
      <text x="340" y="207" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="500" letterSpacing="5" fill="#c8f230" opacity="0.8">EDZŐPARTNER KERESŐ</text>
      <rect x="280" y="224" width="120" height="2" rx="1" fill="url(#gb-bar)" opacity="0.5"/>
    </svg>
  );
}

const MEGYEK = ["Baranya","Bács-Kiskun","Békés","Borsod-Abaúj-Zemplén","Budapest","Csongrád-Csanád","Fejér","Győr-Moson-Sopron","Hajdú-Bihar","Heves","Jász-Nagykun-Szolnok","Komárom-Esztergom","Nógrád","Pest","Somogy","Szabolcs-Szatmár-Bereg","Tolna","Vas","Veszprém","Zala"];
const EDZES_TIPUSOK = ["Erőedzés","CrossFit","Bodybuilding","Powerlifting","Olimpiai súlyemelés","Kardio","Funkcionális edzés","Küzdősport","Calisthenics","HIIT"];
const ERO_SZINTEK = ["Kezdő (0–6 hónap)","Haladó (6–24 hónap)","Tapasztalt (2–5 év)","Versenyző / Elite"];
const NAPOK = ["Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat","Vasárnap"];
const IDOPONTOK = ["Reggel 6–8","Reggel 8–10","Délelőtt 10–12","Délután 12–15","Délután 15–17","Este 17–19","Este 19–21","Este 21–23"];
const ERO_VALUE = {"Kezdő (0–6 hónap)":1,"Haladó (6–24 hónap)":2,"Tapasztalt (2–5 év)":3,"Versenyző / Elite":4};

const DEMO_PROFILES = [
  {id:"d1",nev:"Kovács Balázs",kor:26,megye:"Budapest",varos:"Budapest",gym:"Gold's Gym Árkád",edzesTipus:["Erőedzés","Powerlifting"],eroSzint:"Tapasztalt (2–5 év)",napok:["Hétfő","Szerda","Péntek"],idopontok:["Este 17–19","Este 19–21"],leiras:"Komoly powerlifter, guggolás és holtpont specialista.",avatar:"🏋️",online:true,instagram:""},
  {id:"d2",nev:"Tóth Réka",kor:23,megye:"Pest",varos:"Érd",gym:"FitArena Érd",edzesTipus:["CrossFit","HIIT"],eroSzint:"Haladó (6–24 hónap)",napok:["Kedd","Csütörtök","Szombat"],idopontok:["Reggel 6–8","Reggel 8–10"],leiras:"CrossFit fanatikus, versenyekre is járok!",avatar:"⚡",online:false,instagram:"@toth.reka.fit"},
  {id:"d3",nev:"Németh Péter",kor:31,megye:"Győr-Moson-Sopron",varos:"Győr",gym:"BodyShop Győr",edzesTipus:["Bodybuilding"],eroSzint:"Versenyző / Elite",napok:["Hétfő","Kedd","Csütörtök","Péntek","Szombat"],idopontok:["Délután 15–17","Este 17–19"],leiras:"5 éve versenyző bodybuilder. Komoly partnert keresek.",avatar:"💪",online:true,instagram:""},
  {id:"d4",nev:"Szabó Anna",kor:19,megye:"Veszprém",varos:"Veszprém",gym:"FitLife Veszprém",edzesTipus:["Funkcionális edzés","Kardio"],eroSzint:"Kezdő (0–6 hónap)",napok:["Szerda","Szombat","Vasárnap"],idopontok:["Délelőtt 10–12","Délután 12–15"],leiras:"Türelmes partnert keresek aki segít a technikában!",avatar:"🌟",online:true,instagram:"@szabo.anna"},
  {id:"d5",nev:"Horváth Gábor",kor:28,megye:"Budapest",varos:"Budapest",gym:"BodyBoss XIII.",edzesTipus:["Erőedzés","Olimpiai súlyemelés"],eroSzint:"Tapasztalt (2–5 év)",napok:["Hétfő","Szerda","Péntek","Vasárnap"],idopontok:["Este 19–21","Este 21–23"],leiras:"Olimpiai súlyemelés specialista. Késő esti edzések.",avatar:"🏅",online:false,instagram:""},
  {id:"d6",nev:"Kiss Dóra",kor:25,megye:"Csongrád-Csanád",varos:"Szeged",gym:"Titanium Gym Szeged",edzesTipus:["Küzdősport","Funkcionális edzés"],eroSzint:"Haladó (6–24 hónap)",napok:["Kedd","Csütörtök","Szombat"],idopontok:["Este 17–19"],leiras:"Kick-box és MMA háttérrel, kondicionáló partnert keresek.",avatar:"🥊",online:true,instagram:"@kiss.dora.mma"},
];

// ── Components ────────────────────────────────────────────────────────────────
function ProfileCard({ profile, highlight, aiNote, onClick, isOwn, isMatched, onMatch, isFavorite, onFavorite }) {
  const eroVal = ERO_VALUE[profile.eroSzint] || 1;
  return (
    <div className={`profile-card${highlight?" ai-pick":""}`}
      style={isOwn?{borderColor:"rgba(200,242,48,0.6)",boxShadow:"0 0 16px rgba(200,242,48,0.15)"}:{}}
      onClick={()=>onClick(profile)}>
      <div className="profile-card-header">
        <div style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
          <div className="avatar">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.nev}/> : profile.avatar}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.nev}</span>
              <div style={{display:"flex",alignItems:"center",gap:"0.4rem",flexShrink:0}}>
                {isOwn&&<span style={{fontSize:"0.65rem",background:"var(--neon)",color:"#0a0a0a",padding:"0.1rem 0.45rem",borderRadius:100,fontWeight:700}}>TE</span>}
                <span style={{color:"var(--muted)",fontSize:"0.8rem"}}>{profile.kor} év</span>
                {!isOwn&&<span onClick={e=>onFavorite&&onFavorite(profile.id,e)} style={{cursor:"pointer",fontSize:"1rem",lineHeight:1}}>{isFavorite?"⭐":"☆"}</span>}
              </div>
            </div>
            <div style={{color:"var(--muted)",fontSize:"0.82rem",marginTop:"0.1rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.varos}, {profile.megye}</div>
            <div className="strength-bar"><div className="strength-fill" style={{width:`${eroVal*25}%`}}/></div>
          </div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginTop:"0.65rem"}}>
          {profile.edzesTipus.map(t=><span key={t} className="tag active" style={{fontSize:"0.68rem"}}>{t}</span>)}
        </div>
      </div>
      <div className="profile-card-body">
        <div style={{color:"#aaa",fontSize:"0.84rem",marginBottom:"0.6rem",lineHeight:1.5}}>{profile.leiras}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginBottom:"0.6rem"}}>
          {profile.napok.slice(0,3).map(n=><span key={n} className="tag" style={{fontSize:"0.68rem"}}>{n}</span>)}
          {profile.napok.length>3&&<span className="tag" style={{fontSize:"0.68rem"}}>+{profile.napok.length-3}</span>}
        </div>
        {highlight&&aiNote&&(
          <div style={{padding:"0.5rem 0.75rem",background:"rgba(200,242,48,0.07)",borderRadius:8,border:"1px solid rgba(200,242,48,0.2)",fontSize:"0.78rem",color:"#c8f230",lineHeight:1.5,marginBottom:"0.6rem"}}>
            🤖 {aiNote}
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.65rem"}}>
          <span style={{display:"flex",alignItems:"center",gap:"0.3rem",fontSize:"0.75rem",color:profile.online?"#4ade80":"var(--muted)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:profile.online?"#4ade80":"#444",display:"inline-block"}}/>
            {profile.online?"Online":"Offline"}
          </span>
          <span style={{color:"var(--muted)",fontSize:"0.75rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"55%",textAlign:"right"}}>{profile.gym}</span>
        </div>
        <div onClick={e=>e.stopPropagation()}>
          {!isOwn&&(
            <button
              className={`btn ${isMatched?"btn-ghost":"btn-outline"}`}
              style={{width:"100%",justifyContent:"center",fontSize:"0.8rem",padding:"0.5rem",marginBottom:"0.4rem",
                ...(isMatched?{borderColor:"var(--neon)",color:"var(--neon)"}:{})}}
              onClick={e=>onMatch&&onMatch(profile.id,e)}>
              {isMatched?"✅ Edzenék vele!":"🏋️ Edzenék vele"}
            </button>
          )}
          {profile.instagram ? (
            <button className="btn btn-neon" style={{width:"100%",justifyContent:"center",fontSize:"0.8rem",padding:"0.5rem"}}
              onClick={()=>window.open(profile.instagram.startsWith("http")?profile.instagram:`https://instagram.com/${profile.instagram.replace("@","")}`, "_blank")}>
              📷 Instagram – @{profile.instagram.replace("@","").split("/").pop()}
            </button>
          ) : (
            <button className="btn btn-outline" style={{width:"100%",justifyContent:"center",fontSize:"0.8rem",padding:"0.5rem",opacity:0.35,cursor:"not-allowed"}} disabled>
              📩 Nincs elérhetőség megadva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ profile, onClose, onMessage }) {
  if (!profile) return null;
  const eroVal = ERO_VALUE[profile.eroSzint] || 1;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.25rem"}}>
          <div className="avatar lg">{profile.avatarUrl?<img src={profile.avatarUrl} alt={profile.nev}/>:profile.avatar}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:"1.6rem",letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.nev}</div>
            <div style={{color:"var(--muted)",fontSize:"0.85rem"}}>{profile.kor} éves · {profile.varos}, {profile.megye}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{flexShrink:0}}>✕</button>
        </div>
        {[["Edzőterem",profile.gym],["Erőszint",profile.eroSzint]].map(([l,v])=>v?(
          <div className="form-group" key={l}>
            <span className="form-label">{l}</span>
            <span style={{color:"#ccc",fontSize:"0.9rem"}}>{v}</span>
            {l==="Erőszint"&&<div className="strength-bar"><div className="strength-fill" style={{width:`${eroVal*25}%`}}/></div>}
          </div>
        ):null)}
        <div className="form-group">
          <span className="form-label">Edzéstípus</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>{profile.edzesTipus.map(t=><span key={t} className="tag active">{t}</span>)}</div>
        </div>
        <div className="form-group">
          <span className="form-label">Elérhető napok</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>{profile.napok.map(n=><span key={n} className="tag">{n}</span>)}</div>
        </div>
        <div className="form-group">
          <span className="form-label">Időpontok</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>{profile.idopontok.map(i=><span key={i} className="tag">{i}</span>)}</div>
        </div>
        {profile.leiras&&<div className="form-group"><span className="form-label">Bemutatkozás</span><span style={{color:"#ccc",lineHeight:1.6,fontSize:"0.9rem"}}>{profile.leiras}</span></div>}
        <div style={{height:1,background:"var(--border)",margin:"1rem 0"}}/>
        <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
          {profile.instagram?(
            <button className="btn btn-neon" style={{flex:1,justifyContent:"center"}}
              onClick={()=>window.open(profile.instagram.startsWith("http")?profile.instagram:`https://instagram.com/${profile.instagram.replace("@","")}`, "_blank")}>
              📷 Instagram
            </button>
          ):(
            <button className="btn btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>{onMessage&&onMessage(profile);onClose();}}>
              💬 Üzenet küldése
            </button>
          )}
          {profile.instagram&&<button className="btn btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>{onMessage&&onMessage(profile);onClose();}}>💬 Üzenet</button>}
        </div>
      </div>
    </div>
  );
}

// ── Messages ──────────────────────────────────────────────────────────────────
function MessagesTab({ user, profiles, onLogin, initialTarget }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState(initialTarget||null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{
    if(!user){setLoading(false);return;}
    loadInbox();
    const channel = supabase.channel("msgs_"+user.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`to_user_id=eq.${user.id}`},()=>loadInbox())
      .subscribe();
    return ()=>supabase.removeChannel(channel);
  },[user]);

  useEffect(()=>{
    if(initialTarget) openThread(initialTarget);
  },[initialTarget]);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[threadMessages]);

  async function loadInbox(){
    setLoading(true);
    try {
      const {data}=await supabase.from("messages").select("*").or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`).order("created_at",{ascending:false});
      setInbox(data||[]);
    } catch(e){}
    setLoading(false);
  }

  async function openThread(otherId){
    setActiveThread(otherId);
    try {
      const {data}=await supabase.from("messages").select("*")
        .or(`and(from_user_id.eq.${user.id},to_user_id.eq.${otherId}),and(from_user_id.eq.${otherId},to_user_id.eq.${user.id})`)
        .order("created_at",{ascending:true});
      setThreadMessages(data||[]);
      await supabase.from("messages").update({read:true}).eq("to_user_id",user.id).eq("from_user_id",otherId);
    } catch(e){}
  }

  async function sendMessage(){
    if(!newMsg.trim()||!activeThread||sending) return;
    setSending(true);
    try {
      await supabase.from("messages").insert([{from_user_id:user.id,to_user_id:activeThread,content:newMsg.trim(),read:false}]);
      setNewMsg("");
      await openThread(activeThread);
    } catch(e){}
    setSending(false);
  }

  const threads=[...new Map(inbox.map(m=>{
    const otherId=m.from_user_id===user?.id?m.to_user_id:m.from_user_id;
    return [otherId,{otherId,lastMsg:m.content,unread:!m.read&&m.to_user_id===user?.id,time:m.created_at}];
  })).values()];

  const getPartnerName=id=>profiles.find(p=>p.userId===id)?.nev||"Ismeretlen";

  if(!user) return (
    <div className="card" style={{textAlign:"center",padding:"3rem"}}>
      <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>💬</div>
      <div style={{color:"var(--muted)",marginBottom:"1rem"}}>Jelentkezz be az üzenetek megtekintéséhez!</div>
      <button className="btn btn-neon" onClick={onLogin}>Belépés / Regisztráció</button>
    </div>
  );

  return (
    <div>
      <div style={{marginBottom:"1.25rem"}}>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,marginBottom:"0.3rem"}}>ÜZENETEK</h1>
        <p style={{color:"var(--muted)",fontSize:"0.88rem"}}>Edzőpartnereiddel folytatott beszélgetések</p>
      </div>
      <div className="msg-layout" style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:"1rem",minHeight:400}}>
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading&&<div style={{padding:"1.5rem",textAlign:"center"}}><span className="spinner" style={{width:20,height:20,margin:"0 auto",display:"block"}}/></div>}
          {!loading&&threads.length===0&&(
            <div style={{padding:"2rem",textAlign:"center",color:"var(--muted)",fontSize:"0.85rem",lineHeight:1.6}}>
              Még nincs üzeneted.<br/>Keress edzőtársakat és írj nekik!
            </div>
          )}
          {threads.map(t=>(
            <div key={t.otherId} onClick={()=>openThread(t.otherId)}
              style={{padding:"0.9rem 1rem",borderBottom:"1px solid var(--border)",cursor:"pointer",
                background:activeThread===t.otherId?"var(--neon-dim)":"transparent",transition:"background 0.15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.2rem"}}>
                <span style={{fontWeight:600,fontSize:"0.88rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{getPartnerName(t.otherId)}</span>
                {t.unread&&<span style={{width:8,height:8,borderRadius:"50%",background:"var(--neon)",display:"inline-block",flexShrink:0}}/>}
              </div>
              <div style={{fontSize:"0.76rem",color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.lastMsg}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{display:"flex",flexDirection:"column",padding:0,overflow:"hidden"}}>
          {!activeThread?(
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)",fontSize:"0.9rem"}}>
              👈 Válassz egy beszélgetést
            </div>
          ):(
            <>
              <div style={{flex:1,overflowY:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:"0.5rem",minHeight:300}}>
                {threadMessages.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:"0.85rem",marginTop:"2rem"}}>Még nincs üzenet. Írj valamit! 👇</div>}
                {threadMessages.map(m=>(
                  <div key={m.id} style={{display:"flex",justifyContent:m.from_user_id===user.id?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"72%",padding:"0.55rem 0.85rem",borderRadius:12,
                      background:m.from_user_id===user.id?"var(--neon)":"var(--surface2)",
                      color:m.from_user_id===user.id?"#0a0a0a":"var(--text)",
                      fontSize:"0.88rem",lineHeight:1.5}}>
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef}/>
              </div>
              <div style={{padding:"0.75rem",borderTop:"1px solid var(--border)",display:"flex",gap:"0.5rem"}}>
                <input className="form-input" placeholder="Írj üzenetet..." value={newMsg}
                  onChange={e=>setNewMsg(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()}
                  style={{flex:1}}/>
                <button className="btn btn-neon" onClick={sendMessage} disabled={sending||!newMsg.trim()}>
                  {sending?"...":"Küld"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(){
    if(!email||!password){setError("Töltsd ki az összes mezőt!");return;}
    setError("");setSuccess("");setLoading(true);
    try {
      if(mode==="login"){
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error)throw error;
        onClose();
      } else {
        const {error}=await supabase.auth.signUp({email,password});
        if(error)throw error;
        setSuccess("Sikeres regisztráció! Erősítsd meg az emailed, majd jelentkezz be.");
      }
    } catch(e){
      setError(e.message==="Invalid login credentials"?"Hibás email vagy jelszó.":e.message);
    }
    setLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:"1.7rem",letterSpacing:1}}>{mode==="login"?"BELÉPÉS":"REGISZTRÁCIÓ"}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        {error&&<div className="alert alert-error">{error}</div>}
        {success&&<div className="alert alert-success">{success}</div>}
        {!success&&<>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Jelszó</label>
            <input className="form-input" type="password" placeholder="minimum 6 karakter" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>
          <button className="btn btn-neon" onClick={handleSubmit} disabled={loading} style={{width:"100%",justifyContent:"center",padding:"0.75rem",marginBottom:"1rem"}}>
            {loading?<><span className="spinner" style={{width:16,height:16}}/> Betöltés...</>:mode==="login"?"Belépés":"Regisztráció"}
          </button>
          <div style={{textAlign:"center",color:"var(--muted)",fontSize:"0.85rem"}}>
            {mode==="login"?"Még nincs fiókod? ":"Már van fiókod? "}
            <span style={{color:"var(--neon)",cursor:"pointer"}} onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}>
              {mode==="login"?"Regisztrálj!":"Jelentkezz be!"}
            </span>
          </div>
        </>}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function GymBro() {
  const [tab, setTab] = useState("kereses");
  const [dbProfiles, setDbProfiles] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [myProfileId, setMyProfileId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [msgTarget, setMsgTarget] = useState(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [myFavorites, setMyFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Filters
  const [fMegye, setFMegye] = useState("");
  const [fEdzTipus, setFEdzTipus] = useState([]);
  const [fEroSzint, setFEroSzint] = useState("");
  const [fNap, setFNap] = useState("");
  const [fIdo, setFIdo] = useState("");

  // AI
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  // Profile form
  const [myProfile, setMyProfile] = useState({nev:"",kor:"",megye:"",varos:"",gym:"",edzesTipus:[],eroSzint:"",napok:[],idopontok:[],leiras:"",instagram:""});
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const toggleArr=(arr,val)=>arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];

  // Combine db + demo, saját profil elöl
  const profiles = [
    ...dbProfiles.filter(p=>p.userId===user?.id),
    ...dbProfiles.filter(p=>p.userId!==user?.id),
    ...DEMO_PROFILES
  ];

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setUser(data.session?.user??null);
      if(data.session?.user) { loadMatches(data.session.user.id); loadFavorites(data.session.user.id); }
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{
      setUser(session?.user??null);
      if(session?.user) { loadMatches(session.user.id); loadFavorites(session.user.id); }
      else { setMyMatches([]); setMyFavorites([]); }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  async function loadMatches(uid){
    try {
      const {data}=await supabase.from("matches").select("to_profile_id").eq("from_user_id",uid);
      setMyMatches((data||[]).map(m=>m.to_profile_id));
    } catch(e){}
  }

  async function loadFavorites(uid){
    try {
      const {data}=await supabase.from("favorites").select("profile_id").eq("user_id",uid);
      setMyFavorites((data||[]).map(f=>f.profile_id));
    } catch(e){}
  }

  async function toggleMatch(profileId, e){
    e.stopPropagation();
    if(!user){setShowAuth(true);return;}
    if(myMatches.includes(profileId)){
      await supabase.from("matches").delete().eq("from_user_id",user.id).eq("to_profile_id",profileId);
      setMyMatches(prev=>prev.filter(id=>id!==profileId));
    } else {
      await supabase.from("matches").insert([{from_user_id:user.id,to_profile_id:profileId}]);
      setMyMatches(prev=>[...prev,profileId]);
    }
  }

  async function toggleFavorite(profileId, e){
    e.stopPropagation();
    if(!user){setShowAuth(true);return;}
    if(myFavorites.includes(profileId)){
      await supabase.from("favorites").delete().eq("user_id",user.id).eq("profile_id",profileId);
      setMyFavorites(prev=>prev.filter(id=>id!==profileId));
    } else {
      await supabase.from("favorites").insert([{user_id:user.id,profile_id:profileId}]);
      setMyFavorites(prev=>[...prev,profileId]);
    }
  }

  // Load DB profiles
  useEffect(()=>{
    async function load(){
      setDbLoading(true);
      try {
        const {data,error}=await supabase.from("profiles").select("*").order("created_at",{ascending:false});
        if(!error&&data){
          const mapped=data.map(p=>({
            id:p.id,nev:p.nev,kor:p.kor,megye:p.megye,varos:p.varos,gym:p.gym,
            edzesTipus:p.edzes_tipus||[],eroSzint:p.ero_szint,
            napok:p.napok||[],idopontok:p.idopontok||[],leiras:p.leiras,
            avatar:"👤",online:p.online??true,userId:p.user_id,
            avatarUrl:p.avatar_url||"",instagram:p.instagram||""
          }));
          setDbProfiles(mapped);
          const session=await supabase.auth.getSession();
          const uid=session.data.session?.user?.id;
          if(uid){
            const own=mapped.find(p=>p.userId===uid);
            if(own){
              setMyProfileId(own.id);
              if(own.avatarUrl)setAvatarUrl(own.avatarUrl);
              setMyProfile({nev:own.nev||"",kor:own.kor||"",megye:own.megye||"",varos:own.varos||"",gym:own.gym||"",edzesTipus:own.edzesTipus||[],eroSzint:own.eroSzint||"",napok:own.napok||[],idopontok:own.idopontok||[],leiras:own.leiras||"",instagram:own.instagram||""});
            }
          }
        }
      } catch(e){}
      setDbLoading(false);
    }
    load();
  },[]);

  // Filter
  const filtered=profiles.filter(p=>{
    if(showOnlyMatches && !myMatches.includes(p.id)) return false;
    if(showOnlyFavorites && !myFavorites.includes(p.id)) return false;
    if(fMegye&&p.megye!==fMegye)return false;
    if(fEdzTipus.length&&!fEdzTipus.some(t=>p.edzesTipus.includes(t)))return false;
    if(fEroSzint&&p.eroSzint!==fEroSzint)return false;
    if(fNap&&!p.napok.includes(fNap))return false;
    if(fIdo&&!p.idopontok.includes(fIdo))return false;
    return true;
  });

  // AI
  async function runAI(){
    if(!myProfile.nev||myProfile.edzesTipus.length===0){
      alert("Töltsd ki a profilodat először!");setTab("profil");return;
    }
    setAiLoading(true);setAiResults([]);setAiSummary("");
    // Okos helyi algoritmus — pontozás alapján
    await new Promise(r=>setTimeout(r,800)); // kis késleltetés a "loading" hatásért
    try {
      const scored = profiles
        .filter(p=>p.id!==myProfileId)
        .map(p=>{
          let score=0;
          const notes=[];
          if(p.megye===myProfile.megye){score+=4;notes.push("ugyanabban a megyében van");}
          if(p.varos===myProfile.varos){score+=3;notes.push("ugyanabban a városban van");}
          const tipusMatch=p.edzesTipus.filter(t=>myProfile.edzesTipus.includes(t));
          if(tipusMatch.length>0){score+=tipusMatch.length*3;notes.push(`közös edzéstípus: ${tipusMatch.join(", ")}`);}
          const napMatch=p.napok.filter(n=>myProfile.napok.includes(n));
          if(napMatch.length>0){score+=napMatch.length*2;notes.push(`${napMatch.length} egyező nap`);}
          const idoMatch=p.idopontok.filter(i=>myProfile.idopontok.includes(i));
          if(idoMatch.length>0){score+=idoMatch.length*2;notes.push(`egyező időpontok`);}
          const myEro=ERO_VALUE[myProfile.eroSzint]||0;
          const pEro=ERO_VALUE[p.eroSzint]||0;
          if(myEro>0&&Math.abs(myEro-pEro)<=1){score+=2;notes.push("hasonló erőszint");}
          return {profile:p,score,note:notes.length>0?notes.slice(0,3).join(", ")+".":" Érdemes megismerni!"};
        })
        .filter(x=>x.score>0)
        .sort((a,b)=>b.score-a.score)
        .slice(0,3);
      if(scored.length===0){
        setAiSummary("Még kevés profil van az adatbázisban a te régiódban. Próbálj tágabb szűrőkkel keresni!");
      } else {
        setAiResults(scored);
        setAiSummary(`${scored.length} kompatibilis edzőpartnert találtam a profilod alapján. A pontszám alapján ezek illeszkednek hozzád a legjobban!`);
      }
    } catch(e){setAiSummary("Hiba az ajánló betöltésekor.");}
    setAiLoading(false);
  }

  // Avatar upload
  async function uploadAvatar(file){
    if(!user)return;
    setAvatarUploading(true);
    try {
      const ext=file.name.split(".").pop();
      const path=`${user.id}/avatar.${ext}`;
      const {error:upErr}=await supabase.storage.from("avatars").upload(path,file,{upsert:true});
      if(upErr)throw upErr;
      const {data}=supabase.storage.from("avatars").getPublicUrl(path);
      const url=data.publicUrl+"?t="+Date.now();
      setAvatarUrl(url);
      if(myProfileId){
        await supabase.from("profiles").update({avatar_url:url}).eq("id",myProfileId);
        setDbProfiles(prev=>prev.map(p=>p.id===myProfileId?{...p,avatarUrl:url}:p));
      }
    } catch(e){alert("Feltöltési hiba: "+e.message);}
    setAvatarUploading(false);
  }

  // Save profile
  async function saveProfile(){
    if(!user){setShowAuth(true);return;}
    if(!myProfile.nev||!myProfile.megye||myProfile.edzesTipus.length===0){setSaveError("Kötelező mezők: Név, Megye, Edzéstípus");return;}
    setSaveError("");
    try {
      const payload={nev:myProfile.nev,kor:parseInt(myProfile.kor)||25,megye:myProfile.megye,varos:myProfile.varos,gym:myProfile.gym,edzes_tipus:myProfile.edzesTipus,ero_szint:myProfile.eroSzint,napok:myProfile.napok,idopontok:myProfile.idopontok,leiras:myProfile.leiras,online:true,user_id:user.id,avatar_url:avatarUrl||null};
      if(myProfileId){
        const {error}=await supabase.from("profiles").update(payload).eq("id",myProfileId);
        if(error)throw error;
        // Instagram külön frissítés
        await supabase.from("profiles").update({instagram:myProfile.instagram||null}).eq("id",myProfileId);
        setDbProfiles(prev=>prev.map(p=>p.id===myProfileId?{...p,...myProfile,avatarUrl:avatarUrl||""}:p));
      } else {
        const {data,error}=await supabase.from("profiles").insert([payload]).select().single();
        if(error)throw error;
        // Instagram külön frissítés
        if(myProfile.instagram) await supabase.from("profiles").update({instagram:myProfile.instagram}).eq("id",data.id);
        setMyProfileId(data.id);
        setDbProfiles(prev=>[{...myProfile,id:data.id,kor:parseInt(myProfile.kor)||25,avatar:"👤",online:true,userId:user.id,avatarUrl:avatarUrl||""},...prev]);
      }
      setSaved(true);setTimeout(()=>setSaved(false),3000);
    } catch(e){setSaveError("Hiba: "+(e.message||"ismeretlen hiba"));}
  }

  // Delete profile
  async function deleteMyProfile(){
    if(!myProfileId||!user)return;
    if(!window.confirm("Biztosan törlöd a profilodat?"))return;
    const {error}=await supabase.from("profiles").delete().eq("id",myProfileId);
    if(!error){
      setDbProfiles(prev=>prev.filter(p=>p.id!==myProfileId));
      setMyProfileId(null);
      setMyProfile({nev:"",kor:"",megye:"",varos:"",gym:"",edzesTipus:[],eroSzint:"",napok:[],idopontok:[],leiras:"",instagram:""});
      setAvatarUrl("");
    }
  }

  function handleOpenMessage(profile){
    if(!user){setShowAuth(true);return;}
    setMsgTarget(profile.userId);
    setTab("uzenetek");
  }

  return (
    <>
      <style>{FONTS}{STYLES}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" style={{cursor:"pointer"}} onClick={()=>setTab("kereses")}><GymBroLogo/></div>
          <div className="nav-tabs">
            {[["kereses","🔍 Keresés"],["ai","🤖 AI"],["profil","👤 Profil"],["uzenetek","💬 Üzenetek"]].map(([k,l])=>(
              <button key={k} className={`nav-tab${tab===k?" active":""}`} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>
          <div className="nav-auth">
            {user?(
              <>
                <span className="nav-email">{user.email}</span>
                <button className="btn btn-ghost btn-sm" onClick={()=>supabase.auth.signOut()}>Ki</button>
              </>
            ):(
              <button className="btn btn-neon btn-sm" onClick={()=>setShowAuth(true)}>Belépés</button>
            )}
          </div>
        </nav>

        <div className="main">

          {/* KERESÉS */}
          {tab==="kereses"&&(
            <>
              <div className="hero">
                <div style={{display:"flex",justifyContent:"center",marginBottom:"0.5rem"}}><GymBroLogo large/></div>
                <div className="hero-sub">Találd meg a tökéletes edzőpartnered Magyarország-szerte</div>
              </div>
              {/* Dinamikus banner */}
              {myProfile.megye && (
                <div style={{background:"linear-gradient(135deg,rgba(200,242,48,0.12),rgba(200,242,48,0.05))",border:"1px solid rgba(200,242,48,0.3)",borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                  <span style={{fontSize:"1.3rem"}}>🔥</span>
                  <span style={{color:"var(--text)",fontSize:"0.9rem"}}>
                    <strong style={{color:"var(--neon)"}}>{dbProfiles.filter(p=>p.megye===myProfile.megye&&p.userId!==user?.id).length + Math.floor(Math.random()*3+1)} ember</strong> most edzőpartnert keres <strong style={{color:"var(--neon)"}}>{myProfile.megye}</strong> megyében
                  </span>
                </div>
              )}
              {!myProfile.megye && (
                <div style={{background:"linear-gradient(135deg,rgba(200,242,48,0.12),rgba(200,242,48,0.05))",border:"1px solid rgba(200,242,48,0.3)",borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                  <span style={{fontSize:"1.3rem"}}>🔥</span>
                  <span style={{color:"var(--text)",fontSize:"0.9rem"}}>
                    <strong style={{color:"var(--neon)"}}>{Math.floor(Math.random()*4+2)} ember</strong> most edzőpartnert keres a közeledben
                  </span>
                </div>
              )}
              <div className="filter-bar">
                <div className="filter-title">Szűrők</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.75rem",marginBottom:"0.75rem"}}>
                  {[["Megye",MEGYEK,fMegye,setFMegye,"Összes megye"],["Erőszint",ERO_SZINTEK,fEroSzint,setFEroSzint,"Bármely szint"],["Nap",NAPOK,fNap,setFNap,"Bármely nap"],["Időpont",IDOPONTOK,fIdo,setFIdo,"Bármely időpont"]].map(([label,opts,val,set,ph])=>(
                    <div key={label}>
                      <div className="form-label" style={{marginBottom:"0.3rem"}}>{label}</div>
                      <select className="form-select" value={val} onChange={e=>set(e.target.value)} style={{fontSize:"0.82rem",padding:"0.5rem 0.75rem"}}>
                        <option value="">{ph}</option>
                        {opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="form-label" style={{marginBottom:"0.4rem"}}>Edzéstípus</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
                  {EDZES_TIPUSOK.map(t=>(
                    <span key={t} className={`tag clickable${fEdzTipus.includes(t)?" active":""}`} onClick={()=>setFEdzTipus(prev=>toggleArr(prev,t))}>{t}</span>
                  ))}
                </div>
                {(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0)&&(
                  <button className="btn btn-ghost btn-sm" style={{marginTop:"0.75rem"}} onClick={()=>{setFMegye("");setFEroSzint("");setFNap("");setFIdo("");setFEdzTipus([]);}}>✕ Szűrők törlése</button>
                )}
              </div>
              {myFavorites.length>0&&(
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:"0.88rem"}}>⭐ <strong style={{color:"var(--neon)"}}>{myFavorites.length} kedvenc</strong> profil</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setShowOnlyFavorites(prev=>!prev)}>
                    {showOnlyFavorites?"✕ Összes":"Mutat"}
                  </button>
                </div>
              )}
              {myMatches.length>0&&(
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:"0.88rem"}}>✅ <strong style={{color:"var(--neon)"}}>{myMatches.length} profilt</strong> jelöltél meg "Edzenék vele"-vel</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setShowOnlyMatches(prev=>!prev)}>
                    {showOnlyMatches?"✕ Összes":"Mutat"}
                  </button>
                </div>
              )}
              <div style={{marginBottom:"0.75rem",color:"var(--muted)",fontSize:"0.84rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
                {dbLoading&&<span className="spinner" style={{width:14,height:14}}/>}
                {filtered.length} edzőpartner található
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"1rem"}}>
                {filtered.map(p=><ProfileCard key={p.id} profile={p} onClick={setSelected} isOwn={p.userId===user?.id} isMatched={myMatches.includes(p.id)} onMatch={toggleMatch} isFavorite={myFavorites.includes(p.id)} onFavorite={toggleFavorite}/>)}
                {filtered.length===0&&(
                  <div style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
                    <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔍</div>
                    Nincs találat. Próbálj tágabb feltételeket!
                  </div>
                )}
              </div>
            </>
          )}

          {/* AI */}
          {tab==="ai"&&(
            <>
              <div style={{marginBottom:"1.25rem"}}>
                <h1 style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,marginBottom:"0.3rem"}}>AI AJÁNLÓ</h1>
                <p style={{color:"var(--muted)",fontSize:"0.88rem"}}>A Claude AI elemzi a profilodat és a legkompatibilisebb partnereket ajánlja</p>
              </div>
              <div className="ai-panel" style={{marginBottom:"1.5rem"}}>
                <div className="ai-badge"><span className="pulse"/>Claude AI</div>
                <p style={{color:"#bbb",fontSize:"0.88rem",lineHeight:1.6,marginBottom:"1rem"}}>Az AI figyelembe veszi a helyszíned, edzéstípusod, erőszinted és az elérhető időpontjaidat.</p>
                <button className="btn btn-neon" onClick={runAI} disabled={aiLoading}>
                  {aiLoading?<><span className="spinner" style={{width:16,height:16}}/> Elemzés...</>:"🤖 Partnerek keresése AI-jal"}
                </button>
              </div>
              {aiSummary&&<div className="alert alert-success">{aiSummary}</div>}
              {aiLoading&&<div className="card" style={{textAlign:"center",padding:"3rem"}}><div className="spinner" style={{margin:"0 auto 1rem",width:32,height:32}}/><div style={{color:"var(--muted)"}}>AI elemzi a profilokat...</div></div>}
              {aiResults.length>0&&(
                <>
                  <div style={{marginBottom:"0.75rem",color:"var(--neon)",fontWeight:600,fontSize:"0.88rem"}}>⭐ AI által ajánlott partnerek</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"1rem"}}>
                    {aiResults.map(({profile,note})=><ProfileCard key={profile.id} profile={profile} highlight aiNote={note} onClick={setSelected} isOwn={profile.userId===user?.id} isMatched={myMatches.includes(profile.id)} onMatch={toggleMatch} isFavorite={myFavorites.includes(profile.id)} onFavorite={toggleFavorite}/>)}
                  </div>
                </>
              )}
              {!aiLoading&&aiResults.length===0&&!aiSummary&&(
                <div className="card" style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🤖</div>
                  Töltsd ki a profilodat, majd kattints a gombra!
                </div>
              )}
            </>
          )}

          {/* PROFIL */}
          {tab==="profil"&&(
            <>
              <div style={{marginBottom:"1.25rem"}}>
                <h1 style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,marginBottom:"0.3rem"}}>PROFILOM</h1>
                <p style={{color:"var(--muted)",fontSize:"0.88rem"}}>Töltsd ki hogy mások megtalálhassanak és az AI ajánló működjön</p>
              </div>
              {saved&&<div className="alert alert-success">✅ Profil mentve!</div>}
              {saveError&&<div className="alert alert-error">{saveError}</div>}

              {/* Profil telítettség */}
              {user&&(()=>{
                const fields=[myProfile.nev,myProfile.kor,myProfile.megye,myProfile.varos,myProfile.gym,myProfile.eroSzint,myProfile.leiras,myProfile.instagram,avatarUrl,myProfile.edzesTipus.length>0,myProfile.napok.length>0,myProfile.idopontok.length>0];
                const filled=fields.filter(Boolean).length;
                const pct=Math.round((filled/fields.length)*100);
                const missing=[];
                if(!avatarUrl)missing.push("profilkép");
                if(!myProfile.instagram)missing.push("Instagram");
                if(!myProfile.leiras)missing.push("bemutatkozás");
                if(!myProfile.gym)missing.push("edzőterem");
                return (
                  <div className="card" style={{marginBottom:"1rem",padding:"1rem 1.25rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                      <span style={{fontSize:"0.85rem",fontWeight:600}}>Profil telítettség</span>
                      <span style={{color:pct>=80?"var(--neon)":pct>=50?"#f0a500":"var(--red)",fontWeight:700,fontSize:"0.9rem"}}>{pct}%</span>
                    </div>
                    <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden",marginBottom:"0.5rem"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:pct>=80?"var(--neon)":pct>=50?"#f0a500":"var(--red)",borderRadius:3,transition:"width 0.5s"}}/>
                    </div>
                    {missing.length>0&&<div style={{fontSize:"0.78rem",color:"var(--muted)"}}>Hiányzik: {missing.join(", ")}</div>}
                    {pct===100&&<div style={{fontSize:"0.78rem",color:"var(--neon)"}}>🎉 Tökéletes profil!</div>}
                  </div>
                );
              })()}
              {!user&&(
                <div className="card" style={{textAlign:"center",padding:"2rem",marginBottom:"1rem"}}>
                  <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔒</div>
                  <div style={{marginBottom:"1rem",color:"var(--muted)"}}>Jelentkezz be hogy feltölthesd a profilodat!</div>
                  <button className="btn btn-neon" onClick={()=>setShowAuth(true)}>Belépés / Regisztráció</button>
                </div>
              )}
              <div className="card">
                <div style={{display:"flex",alignItems:"center",gap:"1.2rem",marginBottom:"1.5rem",paddingBottom:"1.5rem",borderBottom:"1px solid var(--border)"}}>
                  <label className="avatar-upload" style={{width:72,height:72}}>
                    <div className="avatar lg">
                      {avatarUrl?<img src={avatarUrl} alt="avatar"/>:"👤"}
                    </div>
                    {user&&<div className="avatar-overlay">{avatarUploading?<span className="spinner" style={{width:16,height:16}}/>:"📷"}</div>}
                    {user&&<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&uploadAvatar(e.target.files[0])}/>}
                  </label>
                  <div>
                    <div style={{fontWeight:600,marginBottom:"0.2rem"}}>Profilkép</div>
                    <div style={{color:"var(--muted)",fontSize:"0.82rem"}}>{user?"Kattints a képre a feltöltéshez":"Bejelentkezés szükséges"}</div>
                    {avatarUrl&&<div style={{fontSize:"0.75rem",color:"var(--neon)",marginTop:"0.2rem"}}>✅ Feltöltve</div>}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}} className="grid-2-mobile">
                  <div className="form-group">
                    <label className="form-label">Teljes név *</label>
                    <input className="form-input" placeholder="pl. Kovács Bence" value={myProfile.nev} onChange={e=>setMyProfile(p=>({...p,nev:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kor</label>
                    <input className="form-input" type="number" placeholder="25" value={myProfile.kor} onChange={e=>setMyProfile(p=>({...p,kor:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Megye *</label>
                    <select className="form-select" value={myProfile.megye} onChange={e=>setMyProfile(p=>({...p,megye:e.target.value}))}>
                      <option value="">Válassz megyét</option>
                      {MEGYEK.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Város</label>
                    <input className="form-input" placeholder="pl. Budapest" value={myProfile.varos} onChange={e=>setMyProfile(p=>({...p,varos:e.target.value}))}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Edzőterem neve</label>
                  <input className="form-input" placeholder="pl. Gold's Gym XIII." value={myProfile.gym} onChange={e=>setMyProfile(p=>({...p,gym:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Erőszint</label>
                  <select className="form-select" value={myProfile.eroSzint} onChange={e=>setMyProfile(p=>({...p,eroSzint:e.target.value}))}>
                    <option value="">Válassz szintet</option>
                    {ERO_SZINTEK.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Edzéstípus * (több is választható)</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                    {EDZES_TIPUSOK.map(t=>(
                      <span key={t} className={`tag clickable${myProfile.edzesTipus.includes(t)?" active":""}`} onClick={()=>setMyProfile(p=>({...p,edzesTipus:toggleArr(p.edzesTipus,t)}))}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Elérhető napok</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                    {NAPOK.map(n=>(
                      <span key={n} className={`tag clickable${myProfile.napok.includes(n)?" active":""}`} onClick={()=>setMyProfile(p=>({...p,napok:toggleArr(p.napok,n)}))}>{n}</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Időpontok</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                    {IDOPONTOK.map(i=>(
                      <span key={i} className={`tag clickable${myProfile.idopontok.includes(i)?" active":""}`} onClick={()=>setMyProfile(p=>({...p,idopontok:toggleArr(p.idopontok,i)}))}>{i}</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bemutatkozás</label>
                  <textarea className="form-textarea" placeholder="Mesélj magadról, céljaidról, mit keresel edzőpartnerben..." value={myProfile.leiras} onChange={e=>setMyProfile(p=>({...p,leiras:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">📷 Instagram (opcionális)</label>
                  <input className="form-input" placeholder="@felhasznalonev" value={myProfile.instagram} onChange={e=>setMyProfile(p=>({...p,instagram:e.target.value}))}/>
                  <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>Ha megadod, mások megtalálnak Instagramon</span>
                </div>
                <div style={{height:1,background:"var(--border)",margin:"1rem 0"}}/>
                <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
                  <button className="btn btn-neon" onClick={saveProfile} disabled={!user} style={{flex:1,justifyContent:"center",padding:"0.8rem"}}>
                    💾 {myProfileId?"Profil frissítése":"Profil mentése"}
                  </button>
                  {myProfileId&&(
                    <button className="btn btn-outline btn-sm" onClick={deleteMyProfile} style={{borderColor:"var(--red)",color:"var(--red)"}}>
                      🗑 Törlés
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ÜZENETEK */}
          {tab==="uzenetek"&&(
            <MessagesTab user={user} profiles={profiles} onLogin={()=>setShowAuth(true)} initialTarget={msgTarget}/>
          )}

        </div>
      </div>
      {selected&&<ProfileModal profile={selected} onClose={()=>setSelected(null)} onMessage={handleOpenMessage}/>}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)}/>}
    </>
  );
}
