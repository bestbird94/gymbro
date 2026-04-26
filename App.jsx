import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://qbhoesdvsbjdbitjayai.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaG9lc2R2c2JqZGJpdGpheWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTkzMjcsImV4cCI6MjA4OTkzNTMyN30.a-ty57FWK5mBtH2hpULtQVKJGmjH3YftKvLqln42BAg"
);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080808;
    --surface: #111214;
    --surface2: #181a1d;
    --surface3: #1e2025;
    --border: #232529;
    --border2: rgba(255,255,255,0.06);
    --neon: #c8f230;
    --neon-dim: rgba(200,242,48,0.1);
    --neon-glow: rgba(200,242,48,0.3);
    --orange: #ff6b35;
    --orange-dim: rgba(255,107,53,0.12);
    --purple: #a855f7;
    --purple-dim: rgba(168,85,247,0.12);
    --green: #4ade80;
    --text: #f0f0f0;
    --text2: #a0a4ad;
    --muted: #555;
    --red: #ff4444;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.4);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.5);
    --shadow-lg: 0 8px 40px rgba(0,0,0,0.6);
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  .app { display: flex; flex-direction: column; min-height: 100vh; background: radial-gradient(ellipse at 20% 0%, rgba(200,242,48,0.03) 0%, transparent 50%), var(--bg); }

  @keyframes storyRing { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  @keyframes storyOpen { 0%{opacity:0;transform:scale(0.95)} 100%{opacity:1;transform:scale(1)} }
  @keyframes matchPop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes matchShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
  @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
  @keyframes streakPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.8);} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes liveGlow { 0%,100%{box-shadow:0 0 12px rgba(255,107,53,0.15)} 50%{box-shadow:0 0 28px rgba(255,107,53,0.4)} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{opacity:0.6} 50%{opacity:1} 100%{opacity:0.6} }

  .story-ring { background: conic-gradient(#c8f230, #ff6b35, #4ade80, #c8f230); border-radius:50%; padding:2.5px; }
  .story-ring-seen { background: conic-gradient(#333, #444, #333); }
  .story-viewer { animation: storyOpen 0.25s ease forwards; }
  .match-popup { animation: matchPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .streak-pop { animation: streakPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .confetti-piece { position:fixed; pointer-events:none; z-index:1000; width:10px; height:10px; animation: confettiFall linear forwards; }
  .fade-in { animation: fadeIn 0.3s ease forwards; }

  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 58px; border-bottom: 1px solid var(--border2);
    background: rgba(8,8,8,0.96); position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(16px); gap: 0.5rem;
    box-shadow: 0 1px 0 var(--border2), 0 4px 24px rgba(0,0,0,0.4);
  }
  .nav-logo { display: flex; align-items: center; flex-shrink: 0; }
  .nav-logo svg { height: 32px; width: auto; }
  .nav-tabs { display: flex; gap: 0.15rem; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .nav-tabs::-webkit-scrollbar { display: none; }
  .nav-tab {
    padding: 0.4rem 0.8rem; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.78rem; font-weight: 500;
    background: transparent; color: var(--muted); transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .nav-tab:hover { color: var(--text2); background: var(--surface2); }
  .nav-tab.active { background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(200,242,48,0.2); }
  .nav-auth { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; }
  .nav-email { font-size: 0.72rem; color: var(--muted); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .main { flex: 1; padding: 1.25rem; max-width: 1200px; margin: 0 auto; width: 100%; }

  .card {
    background: linear-gradient(145deg, var(--surface), var(--surface2));
    border: 1px solid var(--border2); border-radius: 14px; padding: 1.5rem;
    transition: all 0.25s; box-shadow: var(--shadow-sm);
  }
  .card:hover { border-color: rgba(255,255,255,0.09); box-shadow: var(--shadow-md); }
  .card.highlight { border-color: rgba(200,242,48,0.2); background: linear-gradient(145deg, var(--surface), rgba(200,242,48,0.05)); }

  .btn {
    padding: 0.6rem 1.2rem; border-radius: 9px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.88rem; font-weight: 600;
    transition: all 0.18s; display: inline-flex; align-items: center; gap: 0.5rem; white-space: nowrap;
  }
  .btn:active { transform: scale(0.95); }
  .btn-neon { background: var(--neon); color: #080808; box-shadow: 0 2px 12px rgba(200,242,48,0.2); }
  .btn-neon:hover { background: #d4ff3a; box-shadow: 0 4px 20px rgba(200,242,48,0.35); transform: translateY(-1px); }
  .btn-neon:active { transform: scale(0.95) translateY(0); }
  .btn-outline { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--neon); color: var(--neon); background: var(--neon-dim); }
  .btn-ghost { background: var(--surface2); color: var(--text2); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--surface3); color: var(--text); }
  .btn-sm { padding: 0.35rem 0.8rem; font-size: 0.78rem; }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none !important; }

  .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
  .form-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }
  .form-input, .form-select, .form-textarea {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 9px;
    color: var(--text); padding: 0.65rem 0.9rem; font-family: var(--font-body); font-size: 0.9rem;
    width: 100%; transition: all 0.2s; -webkit-appearance: none;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none; border-color: var(--neon); box-shadow: 0 0 0 3px var(--neon-dim);
    background: var(--surface3);
  }
  .form-select option { background: #1a1a1a; }
  .form-textarea { resize: vertical; min-height: 80px; }

  .tag { display: inline-block; padding: 0.22rem 0.65rem; border-radius: 100px; font-size: 0.71rem; font-weight: 600; background: var(--surface3); color: var(--text2); border: 1px solid var(--border); transition: all 0.15s; }
  .tag.active { background: var(--neon-dim); color: var(--neon); border-color: rgba(200,242,48,0.25); }
  .tag.clickable { cursor: pointer; }
  .tag.clickable:hover { border-color: var(--neon); color: var(--neon); background: var(--neon-dim); }

  .avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--surface3); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; border: 1.5px solid var(--border); flex-shrink: 0; overflow: hidden; }
  .avatar.lg { width: 72px; height: 72px; font-size: 2rem; }
  .avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .avatar-upload { position: relative; display: inline-block; cursor: pointer; border-radius: 50%; }
  .avatar-overlay { position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; color: var(--neon); opacity: 0; transition: opacity 0.2s; text-align: center; font-weight: 700; }
  .avatar-upload:hover .avatar-overlay { opacity: 1; }

  .profile-card {
    background: linear-gradient(160deg, var(--surface) 0%, var(--surface2) 100%);
    border: 1px solid var(--border2); border-radius: 16px; overflow: hidden;
    transition: all 0.28s cubic-bezier(0.34, 1.2, 0.64, 1); cursor: pointer; box-shadow: var(--shadow-sm);
  }
  .profile-card:hover {
    border-color: rgba(200,242,48,0.25); transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,242,48,0.08);
  }
  .profile-card.ai-pick { border-color: rgba(200,242,48,0.35); box-shadow: 0 0 24px rgba(200,242,48,0.07); }
  .profile-card-header { padding: 1.1rem 1.2rem; border-bottom: 1px solid var(--border2); }
  .profile-card-body { padding: 1.1rem 1.2rem; }
  .strength-bar { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-top: 0.4rem; }
  .strength-fill { height: 100%; background: linear-gradient(90deg, var(--neon), #8bc34a); border-radius: 2px; transition: width 0.6s ease; }

  .ai-panel { background: linear-gradient(135deg, rgba(200,242,48,0.06), rgba(200,242,48,0.02)); border: 1px solid rgba(200,242,48,0.15); border-radius: 14px; padding: 1.5rem; }
  .ai-badge { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(200,242,48,0.2); padding: 0.3rem 0.8rem; border-radius: 100px; font-size: 0.73rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 1rem; }
  .pulse { display: inline-block; width: 7px; height: 7px; background: var(--neon); border-radius: 50%; animation: pulse 2s infinite; }

  .hero { padding: 1.75rem 0 1.25rem; text-align: center; margin-bottom: 1.25rem; }
  .hero-sub { color: var(--text2); margin-top: 0.5rem; font-size: 0.92rem; }

  .filter-bar { background: linear-gradient(145deg, var(--surface), var(--surface2)); border: 1px solid var(--border2); border-radius: 14px; padding: 1.1rem; margin-bottom: 1.25rem; box-shadow: var(--shadow-sm); }
  .filter-title { font-size: 0.72rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.85rem; }

  .live-bar {
    background: linear-gradient(135deg, rgba(255,107,53,0.08), rgba(200,242,48,0.04));
    border: 1px solid rgba(255,107,53,0.18); border-radius: 12px;
    padding: 0.7rem 1rem; margin-bottom: 1.1rem;
    display: flex; align-items: center; gap: 0.75rem;
    animation: liveGlow 3s ease-in-out infinite;
  }
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--orange); flex-shrink: 0; animation: pulse 1.5s infinite; box-shadow: 0 0 8px rgba(255,107,53,0.6); }
  .live-items { display: flex; gap: 1rem; flex-wrap: wrap; flex: 1; }
  .live-item { font-size: 0.78rem; color: var(--text2); display: flex; align-items: center; gap: 0.3rem; }
  .live-item strong { color: var(--orange); }

  .divider { height: 1px; background: var(--border2); margin: 1.25rem 0; }
  .alert { padding: 0.85rem 1rem; border-radius: 10px; font-size: 0.86rem; margin-bottom: 1rem; }
  .alert-success { background: rgba(200,242,48,0.07); border: 1px solid rgba(200,242,48,0.18); color: var(--neon); }
  .alert-error { background: rgba(255,68,68,0.07); border: 1px solid rgba(255,68,68,0.18); color: var(--red); }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--neon); border-radius: 50%; animation: spin 0.7s linear infinite; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; backdrop-filter: blur(6px); }
  .modal { background: linear-gradient(145deg, var(--surface), var(--surface2)); border: 1px solid var(--border2); border-radius: 18px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; box-shadow: var(--shadow-lg); }

  @media (max-width: 600px) {
    .main { padding: 0.75rem; }
    .nav { padding: 0 0.75rem; height: 54px; }
    .nav-email { display: none; }
    .filter-bar { padding: 0.9rem; }
    .card { padding: 1rem; }
    .modal { padding: 1.1rem; border-radius: 14px; }
    .profile-card:hover { transform: none; }
    .grid-2-mobile { grid-template-columns: 1fr !important; }
    .msg-layout { grid-template-columns: 1fr !important; }
    .hero { padding: 1.25rem 0 0.75rem; }
    .live-items { flex-direction: column; gap: 0.35rem; }
  }
  @media (max-width: 400px) {
    .nav-tab { padding: 0.3rem 0.5rem; font-size: 0.71rem; }
  }
`;


// ── Data ──────────────────────────────────────────────────────────────────────
// ── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false,error:null}; }
  static getDerivedStateFromError(error){ return {hasError:true,error}; }
  componentDidCatch(error,info){ console.error("GymBro error:",error,info); }
  render(){
    if(this.state.hasError) return (
      <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"DM Sans, sans-serif"}}>
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>⚠️</div>
          <div style={{fontFamily:"Bebas Neue, sans-serif",fontSize:"2rem",letterSpacing:2,color:"#c8f230",marginBottom:"0.75rem"}}>VALAMI ELROMLOTT</div>
          <div style={{color:"#666",fontSize:"0.9rem",marginBottom:"1.5rem",lineHeight:1.6}}>Ne aggódj, az adataid biztonságban vannak. Töltsd újra az oldalt!</div>
          <button onClick={()=>window.location.reload()}
            style={{background:"#c8f230",border:"none",borderRadius:9,padding:"0.75rem 2rem",color:"#080808",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"}}>
            🔄 Újratöltés
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

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

const DEMO_PROFILES = [];

// ── Components ────────────────────────────────────────────────────────────────

// Slug generálás névből
function toSlug(nev) {
  return (nev||"")
    .toLowerCase()
    .replace(/á/g,"a").replace(/é/g,"e").replace(/í/g,"i")
    .replace(/ó/g,"o").replace(/ö/g,"o").replace(/ő/g,"o")
    .replace(/ú/g,"u").replace(/ü/g,"u").replace(/ű/g,"u")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

// Badge számítás
function getBadges(profile) {
  const badges = [];
  const reggeli = ["Reggel 6–8","Reggel 8–10"];
  if(profile.idopontok?.some(i=>reggeli.includes(i))) badges.push({icon:"⚡",label:"Reggeli harcos",color:"#f0a500"});
  if((profile.napok?.length||0)>=5) badges.push({icon:"🏋️",label:"Erőgép",color:"#c8f230"});
  if(profile.maEdzek) badges.push({icon:"🔥",label:"Ma edzek",color:"#ff6b35"});
  return badges;
}

function lastActiveTxt(ts) {
  if(!ts) return null;
  const diff=Math.floor((Date.now()-new Date(ts))/1000);
  if(diff<60) return "most aktív";
  if(diff<3600) return `${Math.floor(diff/60)} perce aktív`;
  if(diff<86400) return `${Math.floor(diff/3600)} órája aktív`;
  if(diff<172800) return "tegnap aktív";
  return null;
}

function ProfileCard({ profile, highlight, aiNote, onClick, isOwn, isMatched, onMatch, isFavorite, onFavorite, hasStory, onStoryOpen }) {
  const eroVal = ERO_VALUE[profile.eroSzint] || 1;
  const badges = getBadges(profile);
  return (
    <div className={`profile-card${highlight?" ai-pick":""}`}
      style={isOwn?{borderColor:"rgba(200,242,48,0.6)",boxShadow:"0 0 16px rgba(200,242,48,0.15)"}:
            profile.maEdzek?{borderColor:"rgba(255,107,53,0.5)",boxShadow:"0 0 12px rgba(255,107,53,0.1)"}:{}}
      onClick={()=>onClick(profile)}>
      <div className="profile-card-header">
        <div style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
          <div className="avatar" style={{position:"relative",cursor:hasStory?"pointer":"default",flexShrink:0}}
            onClick={e=>{if(hasStory){e.stopPropagation();onStoryOpen&&onStoryOpen(profile.userId);}}}>
            {hasStory&&<div style={{position:"absolute",inset:-3,borderRadius:"50%",background:"conic-gradient(#c8f230,#ff6b35,#4ade80,#c8f230)",zIndex:0}}/>}
            <div style={{position:"relative",zIndex:1,width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",border:hasStory?"2px solid var(--bg)":"none",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--neon-dim)",fontSize:"1.4rem"}}>
              {profile.avatarUrl?<img src={profile.avatarUrl} alt={profile.nev} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:profile.avatar}
            </div>
            {profile.maEdzek&&<span style={{position:"absolute",bottom:-2,right:-2,fontSize:"0.8rem",zIndex:2}}>🔥</span>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"0.5rem"}}>
              <span style={{fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.nev}{profile.instagram&&<span title="Verified - Instagram megadva" style={{marginLeft:"0.3rem",fontSize:"0.75rem"}}>✅</span>}</span>
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
        {/* Badge-ek */}
        {badges.length>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginTop:"0.5rem"}}>
            {badges.map(b=>(
              <span key={b.label} style={{fontSize:"0.68rem",padding:"0.15rem 0.5rem",borderRadius:100,background:`${b.color}22`,color:b.color,border:`1px solid ${b.color}44`,fontWeight:600}}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        )}
        {/* Ma edzek info */}
        {profile.maEdzek&&(profile.maEdzekIdo||profile.maEdzekHelyszin)&&(
          <div style={{marginTop:"0.4rem",fontSize:"0.78rem",color:"#ff6b35",background:"rgba(255,107,53,0.08)",padding:"0.3rem 0.6rem",borderRadius:6,border:"1px solid rgba(255,107,53,0.2)"}}>
            🔥 Ma: {profile.maEdzekIdo&&<strong>{profile.maEdzekIdo}</strong>}{profile.maEdzekIdo&&profile.maEdzekHelyszin&&" – "}{profile.maEdzekHelyszin&&profile.maEdzekHelyszin}
          </div>
        )}
        {/* Status pill */}
        {profile.statusText&&(
          <div style={{display:"inline-flex",alignItems:"center",gap:"0.3rem",background:"rgba(200,242,48,0.08)",border:"1px solid rgba(200,242,48,0.2)",borderRadius:100,padding:"0.2rem 0.6rem",fontSize:"0.7rem",color:"var(--neon)",marginTop:"0.5rem",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"var(--neon)",flexShrink:0,animation:"pulse 2s infinite"}}/>
            {profile.statusText}
          </div>
        )}
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginTop:"0.5rem"}}>
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
            {lastActiveTxt(profile.lastActive)||( profile.online?"Online":"Offline")}
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

function ProfileModal({ profile, onClose, onMessage, onBlock, user }) {
  if (!profile) return null;
  const eroVal = ERO_VALUE[profile.eroSzint] || 1;
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const isOwn = profile.userId === user?.id;

  async function sendReport(){
    if(!reportReason.trim()||!user)return;
    await supabase.from("reports").insert([{from_user_id:user.id,reported_profile_id:profile.id,reason:reportReason}]);
    setReportSent(true);
    setTimeout(()=>{setShowReport(false);setReportSent(false);setReportReason("");},2000);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.25rem"}}>
          <div className="avatar lg">{profile.avatarUrl?<img src={profile.avatarUrl} alt={profile.nev}/>:profile.avatar}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:"1.6rem",letterSpacing:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.nev}{profile.instagram&&<span title="Verified" style={{fontSize:"1rem",marginLeft:"0.4rem"}}>✅</span>}</div>
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
        {/* Profil megosztása */}
        <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center",marginTop:"0.5rem",fontSize:"0.8rem",color:"var(--muted)"}}
          onClick={()=>{
            const url = `${window.location.origin}${window.location.pathname}#/u/${toSlug(profile.nev)}`;
            if(navigator.share){ navigator.share({title:`GymBro – ${profile.nev}`,url}); }
            else{ navigator.clipboard.writeText(url); alert("Link másolva! 🔗"); }
          }}>
          🔗 Profil link megosztása
        </button>

        {/* Jelentés / Blokkolás — csak más profiljánál */}
        {!isOwn&&user&&(
          <>
            <div style={{height:1,background:"var(--border)",margin:"1rem 0"}}/>
            {!showReport?(
              <div style={{display:"flex",gap:"0.5rem"}}>
                <button className="btn btn-ghost btn-sm" style={{color:"var(--muted)",fontSize:"0.75rem"}}
                  onClick={()=>setShowReport(true)}>🚩 Jelentés</button>
                <button className="btn btn-ghost btn-sm" style={{color:"var(--red)",fontSize:"0.75rem"}}
                  onClick={()=>{onBlock&&onBlock(profile);onClose();}}>🚫 Blokkolás</button>
              </div>
            ):(
              <div>
                {reportSent?(
                  <div className="alert alert-success">✅ Köszönjük a jelentést!</div>
                ):(
                  <>
                    <div className="form-label" style={{marginBottom:"0.4rem"}}>Mi a probléma?</div>
                    <select className="form-select" style={{marginBottom:"0.5rem",fontSize:"0.85rem"}} value={reportReason} onChange={e=>setReportReason(e.target.value)}>
                      <option value="">Válassz okot...</option>
                      <option value="Sértő tartalom">Sértő tartalom</option>
                      <option value="Spam / hamis profil">Spam / hamis profil</option>
                      <option value="Zaklatás">Zaklatás</option>
                      <option value="Nem megfelelő kép">Nem megfelelő kép</option>
                      <option value="Egyéb">Egyéb</option>
                    </select>
                    <div style={{display:"flex",gap:"0.5rem"}}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>setShowReport(false)}>Mégse</button>
                      <button className="btn btn-neon btn-sm" onClick={sendReport} disabled={!reportReason}>Küldés</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const STORY_TYPES = [
  {key:"workout", icon:"💪", label:"Edzés"},
  {key:"pr", icon:"🏆", label:"PR"},
  {key:"motivation", icon:"🔥", label:"Motiváció"},
  {key:"location", icon:"📍", label:"Itt vagyok"},
];

// ── Story Viewer ──────────────────────────────────────────────────────────────
const REACTION_EMOJIS = ["💪","🔥","❤️","⚡","🏆","😮"];

function StoryViewer({ stories, startIndex, onClose, profiles, user }) {
  const [idx, setIdx] = useState(startIndex||0);
  const [progress, setProgress] = useState(0);
  const [reactions, setReactions] = useState({});
  const [myReaction, setMyReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactionAnim, setReactionAnim] = useState(null);
  const timerRef = useRef(null);
  const DURATION = 5000;

  const story = stories[idx];

  useEffect(()=>{
    setProgress(0); setMyReaction(null); setShowReactions(false);
    clearInterval(timerRef.current);
    const start = Date.now();
    timerRef.current = setInterval(()=>{
      const pct = ((Date.now()-start)/DURATION)*100;
      if(pct>=100){ next(); } else setProgress(pct);
    },50);
    if(story?.id) loadReactions(story.id);
    return ()=>clearInterval(timerRef.current);
  },[idx]);

  async function loadReactions(storyId){
    try {
      const {data}=await supabase.from("story_reactions").select("emoji,user_id").eq("story_id",storyId);
      const counts={};
      (data||[]).forEach(r=>{ counts[r.emoji]=(counts[r.emoji]||0)+1; });
      setReactions(counts);
      if(user){ const mine=(data||[]).find(r=>r.user_id===user.id); setMyReaction(mine?.emoji||null); }
    } catch(e){}
  }

  async function react(emoji){
    if(!user||!story) return;
    setShowReactions(false);
    setReactionAnim(emoji);
    setTimeout(()=>setReactionAnim(null),800);
    try {
      if(myReaction===emoji){
        await supabase.from("story_reactions").delete().eq("story_id",story.id).eq("user_id",user.id);
        setMyReaction(null);
        setReactions(prev=>({...prev,[emoji]:Math.max((prev[emoji]||1)-1,0)}));
      } else {
        if(myReaction) await supabase.from("story_reactions").delete().eq("story_id",story.id).eq("user_id",user.id);
        await supabase.from("story_reactions").insert([{story_id:story.id,user_id:user.id,emoji}]);
        setMyReaction(emoji);
        setReactions(prev=>{
          const n={...prev};
          if(myReaction) n[myReaction]=Math.max((n[myReaction]||1)-1,0);
          n[emoji]=(n[emoji]||0)+1;
          return n;
        });
      }
    } catch(e){}
  }

  function next(){ if(idx<stories.length-1) setIdx(i=>i+1); else onClose(); }
  function prev(){ if(idx>0) setIdx(i=>i-1); }

  const ownerProfile = profiles.find(p=>p.userId===story?.user_id);
  const storyType = STORY_TYPES.find(t=>t.key===story?.story_type);
  const totalReactions = Object.values(reactions).reduce((a,b)=>a+b,0);

  if(!story) return null;

  return (
    <div className="story-viewer" style={{position:"fixed",inset:0,background:"#000",zIndex:500,display:"flex",flexDirection:"column"}}>
      {/* Progress bars */}
      <div style={{display:"flex",gap:3,padding:"12px 12px 0",position:"absolute",top:0,left:0,right:0,zIndex:10}}>
        {stories.map((s,i)=>(
          <div key={s.id} style={{flex:1,height:3,background:"rgba(255,255,255,0.25)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",background:"#fff",width:i<idx?"100%":i===idx?`${progress}%`:"0%"}}/>
          </div>
        ))}
      </div>
      {/* Header */}
      <div style={{position:"absolute",top:24,left:0,right:0,zIndex:10,display:"flex",alignItems:"center",gap:"0.75rem",padding:"0 1rem"}}>
        <div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",border:"2px solid #c8f230",background:"#222",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>
          {ownerProfile?.avatarUrl?<img src={ownerProfile.avatarUrl} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:ownerProfile?.avatar||"👤"}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:"0.9rem",color:"#fff"}}>{ownerProfile?.nev||"Ismeretlen"}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(255,255,255,0.6)"}}>
            {storyType&&<span>{storyType.icon} {storyType.label} · </span>}
            {Math.floor((Date.now()-new Date(story.created_at))/3600000)}ó
          </div>
        </div>
        <button onClick={onClose} style={{background:"transparent",border:"none",color:"#fff",fontSize:"1.5rem",cursor:"pointer",padding:"0.25rem"}}>✕</button>
      </div>
      {/* Media */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#000"}}>
        <img src={story.media_url} alt="story" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} draggable="false"/>
      </div>
      {/* Reaction animation */}
      {reactionAnim&&(
        <div style={{position:"absolute",top:"40%",left:"50%",transform:"translateX(-50%)",fontSize:"4rem",animation:"matchPop 0.8s ease forwards",zIndex:20,pointerEvents:"none"}}>
          {reactionAnim}
        </div>
      )}
      {/* Caption */}
      {story.caption&&(
        <div style={{position:"absolute",bottom:80,left:0,right:0,padding:"0 1.5rem",textAlign:"center",zIndex:10}}>
          <div style={{background:"rgba(0,0,0,0.6)",borderRadius:10,padding:"0.6rem 1rem",color:"#fff",fontSize:"0.9rem",lineHeight:1.5,backdropFilter:"blur(4px)"}}>
            {story.caption}
          </div>
        </div>
      )}
      {/* Comments section */}
      <StoryComments storyId={story.id} user={user} profiles={profiles}/>

      {/* Reactions row */}
      <div style={{position:"absolute",bottom:16,left:0,right:0,zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0 1rem"}}>
        {/* Existing reactions summary */}
        {totalReactions>0&&(
          <div style={{display:"flex",gap:"0.3rem",background:"rgba(0,0,0,0.5)",borderRadius:100,padding:"0.3rem 0.75rem",backdropFilter:"blur(4px)"}}>
            {Object.entries(reactions).filter(([,c])=>c>0).map(([e,c])=>(
              <span key={e} style={{fontSize:"0.9rem"}}>{e} {c>1&&<span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)"}}>{c}</span>}</span>
            ))}
          </div>
        )}
        {/* React button */}
        {user&&(
          <div style={{position:"relative"}}>
            {showReactions&&(
              <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",background:"rgba(20,20,20,0.95)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:100,padding:"0.4rem 0.6rem",display:"flex",gap:"0.35rem",backdropFilter:"blur(8px)",animation:"fadeIn 0.15s ease"}}>
                {REACTION_EMOJIS.map(e=>(
                  <button key={e} onClick={()=>react(e)}
                    style={{fontSize:"1.5rem",background:myReaction===e?"rgba(200,242,48,0.15)":"transparent",border:"none",cursor:"pointer",borderRadius:"50%",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.15s",transform:myReaction===e?"scale(1.2)":"scale(1)"}}>
                    {e}
                  </button>
                ))}
              </div>
            )}
            <button onClick={()=>setShowReactions(p=>!p)}
              style={{background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:100,padding:"0.4rem 0.9rem",color:"#fff",cursor:"pointer",fontSize:"0.85rem",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",gap:"0.4rem"}}>
              {myReaction||"😊"} <span style={{opacity:0.7}}>Reakció</span>
            </button>
          </div>
        )}
      </div>
      {/* Tap zones */}
      <div style={{position:"absolute",inset:0,display:"flex",zIndex:5}}>
        <div style={{flex:1}} onClick={prev}/>
        <div style={{flex:1}} onClick={next}/>
      </div>
    </div>
  );
}


// ── Story Comments ────────────────────────────────────────────────────────────
function StoryComments({ storyId, user, profiles }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [sending, setSending] = useState(false);
  const [myProfileId, setMyProfileId] = useState(null);

  useEffect(()=>{
    if(storyId) loadComments();
    if(user) supabase.from("profiles").select("id").eq("user_id",user.id).maybeSingle().then(({data})=>data&&setMyProfileId(data.id));
  },[storyId,user]);

  async function loadComments(){
    try {
      const {data}=await supabase.from("story_comments").select("*").eq("story_id",storyId).order("created_at",{ascending:true}).limit(20);
      setComments(data||[]);
    } catch(e){}
  }

  async function sendComment(){
    if(!newComment.trim()||!user||sending) return;
    setSending(true);
    try {
      await supabase.from("story_comments").insert([{story_id:storyId,user_id:user.id,profile_id:myProfileId,content:newComment.trim()}]);
      setNewComment("");
      await loadComments();
    } catch(e){}
    setSending(false);
  }

  const commentCount = comments.length;

  return (
    <div style={{position:"absolute",bottom:60,right:12,zIndex:11}}>
      {/* Toggle button */}
      <button onClick={()=>setShowComments(p=>!p)}
        style={{background:"rgba(0,0,0,0.6)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:100,padding:"0.35rem 0.8rem",color:"#fff",cursor:"pointer",fontSize:"0.8rem",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",gap:"0.35rem",marginBottom:"0.4rem",marginLeft:"auto"}}>
        💬 {commentCount>0?commentCount:""}
      </button>
      {/* Comments panel */}
      {showComments&&(
        <div style={{width:260,background:"rgba(10,10,10,0.92)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,overflow:"hidden",backdropFilter:"blur(12px)",animation:"fadeIn 0.2s ease"}}>
          <div style={{maxHeight:180,overflowY:"auto",padding:"0.75rem"}}>
            {comments.length===0&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",textAlign:"center",padding:"0.5rem"}}>Még nincs komment. Legyél az első!</div>}
            {comments.map(c=>{
              const p=profiles.find(pr=>pr.userId===c.user_id);
              return (
                <div key={c.id} style={{marginBottom:"0.6rem",display:"flex",gap:"0.5rem",alignItems:"flex-start"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:"var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem"}}>
                    {p?.avatarUrl?<img src={p.avatarUrl} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:p?.avatar||"👤"}
                  </div>
                  <div>
                    <span style={{fontSize:"0.72rem",fontWeight:700,color:"#c8f230"}}>{p?.nev?.split(" ")[0]||"User"} </span>
                    <span style={{fontSize:"0.78rem",color:"rgba(255,255,255,0.85)",lineHeight:1.4}}>{c.content}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {user&&(
            <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",padding:"0.5rem",display:"flex",gap:"0.4rem"}}>
              <input value={newComment} onChange={e=>setNewComment(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&sendComment()}
                placeholder="Komment..."
                style={{flex:1,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"0.4rem 0.6rem",color:"#fff",fontSize:"0.78rem",outline:"none"}}/>
              <button onClick={sendComment} disabled={sending||!newComment.trim()}
                style={{background:"var(--neon)",border:"none",borderRadius:8,padding:"0.4rem 0.7rem",color:"#080808",fontWeight:700,cursor:"pointer",fontSize:"0.78rem",opacity:sending||!newComment.trim()?0.4:1}}>
                ➤
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Story Bar ─────────────────────────────────────────────────────────────────
function StoryBar({ user, myProfileId, profiles, onLogin }) {
  const [stories, setStories] = useState([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStartIdx, setViewerStartIdx] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [storyType, setStoryType] = useState("workout");
  const [uploading, setUploading] = useState(false);
  const [seenIds, setSeenIds] = useState(new Set());
  const fileRef = useRef(null);

  useEffect(()=>{ loadStories(); },[]);

  async function loadStories(){
    try {
      const since = new Date(Date.now()-24*3600*1000).toISOString();
      const {data}=await supabase.from("stories").select("*").gte("created_at",since).order("created_at",{ascending:false});
      setStories(data||[]);
    } catch(e){}
  }

  // Group by user
  const grouped = stories.reduce((acc,s)=>{
    if(!acc[s.user_id]) acc[s.user_id]=[];
    acc[s.user_id].push(s);
    return acc;
  },{});
  const userIds = Object.keys(grouped);

  function openStories(userId){
    const allByUser = grouped[userId]||[];
    const startIdx = stories.findIndex(s=>s.user_id===userId);
    setViewerStartIdx(startIdx>=0?startIdx:0);
    setSeenIds(prev=>new Set([...prev,userId]));
    setViewerOpen(true);
  }

  function pickFile(e){
    const f=e.target.files[0];
    if(!f)return;
    setUploadFile(f);
    setUploadPreview(URL.createObjectURL(f));
    setShowUpload(true);
  }

  async function uploadStory(){
    if(!uploadFile||!user){ alert("Nincs bejelentkezve!"); return; }
    setUploading(true);
    try {
      const ext=uploadFile.name.split(".").pop();
      const path=`${user.id}/${Date.now()}.${ext}`;
      const {error:upErr}=await supabase.storage.from("stories").upload(path,uploadFile);
      if(upErr)throw upErr;
      const {data:urlData}=supabase.storage.from("stories").getPublicUrl(path);
      const insertPayload = {
        user_id: user.id,
        media_url: urlData.publicUrl,
        media_type: "image",
        caption: caption||null,
        story_type: storyType,
      };
      const {error:insErr} = await supabase.from("stories").insert([insertPayload]);
      if(insErr) throw insErr;
      setShowUpload(false);
      setUploadFile(null);
      setUploadPreview(null);
      setCaption("");
      await loadStories();
    } catch(e){ alert("Feltöltési hiba: "+e.message); }
    setUploading(false);
  }

  const myStories = user ? grouped[user.id] : null;

  function openMyStory(){
    if(myStories&&myStories.length>0){
      const startIdx=stories.findIndex(s=>s.user_id===user.id);
      setViewerStartIdx(startIdx>=0?startIdx:0);
      setViewerOpen(true);
    } else {
      fileRef.current.click();
    }
  }

  return (
    <>
      {/* Story bar */}
      <div style={{overflowX:"auto",display:"flex",gap:"0.85rem",padding:"0.75rem 0 0.75rem",marginBottom:"1.25rem",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}}>
        {/* Saját story feltöltés / megtekintés */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.3rem",flexShrink:0,cursor:"pointer"}}
          onClick={()=>user?(myStories?.length>0?openMyStory():fileRef.current.click()):onLogin()}>
          <div style={{width:64,height:64,borderRadius:"50%",position:"relative"}}>
            <div className={myStories?.length>0?"story-ring":""} style={{width:"100%",height:"100%",borderRadius:"50%",padding:myStories?.length>0?2.5:0,border:myStories?.length>0?"none":"2px dashed var(--neon)",background:myStories?.length>0?"":"var(--neon-dim)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",border:myStories?.length>0?"2px solid var(--bg)":"none",background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}>
                {myStories?.length>0
                  ?<img src={myStories[0].media_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  :<span style={{color:"var(--neon)"}}>+</span>}
              </div>
            </div>
          </div>
          <span style={{fontSize:"0.68rem",color:"var(--muted)",maxWidth:60,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {myStories?.length>0?"Storyim":"+ Story"}
          </span>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={pickFile}/>

        {/* Mások storyjai */}
        {userIds.filter(uid=>uid!==user?.id).map(uid=>{
          const p=profiles.find(pr=>pr.userId===uid);
          const seen=seenIds.has(uid);
          const userStories=grouped[uid];
          const latest=userStories[0];
          const sType=STORY_TYPES.find(t=>t.key===latest?.story_type);
          const pStatus=p?.statusText;
          return (
            <div key={uid}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.25rem",flexShrink:0,cursor:"pointer",transition:"transform 0.2s"}}
              onClick={()=>openStories(uid)}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.08)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
              {pStatus&&(
                <div style={{fontSize:"0.6rem",background:"rgba(200,242,48,0.1)",border:"1px solid rgba(200,242,48,0.2)",color:"var(--neon)",padding:"0.1rem 0.4rem",borderRadius:100,maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"0.1rem"}}>
                  {pStatus}
                </div>
              )}
              <div className={seen?"story-ring-seen":"story-ring"} style={{width:68,height:68,borderRadius:"50%",padding:2.5,flexShrink:0,filter:seen?"none":`drop-shadow(0 0 6px rgba(200,242,48,0.4))`}}>
                <div style={{width:"100%",height:"100%",borderRadius:"50%",overflow:"hidden",border:"2px solid var(--bg)",background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",position:"relative"}}>
                  {p?.avatarUrl?<img src={p.avatarUrl} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:p?.avatar||"👤"}
                  {sType&&<div style={{position:"absolute",bottom:0,right:0,fontSize:"0.72rem",background:"rgba(0,0,0,0.8)",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>{sType.icon}</div>}
                </div>
              </div>
              <span style={{fontSize:"0.68rem",color:seen?"var(--muted)":"var(--text)",maxWidth:68,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:seen?400:600}}>
                {p?.nev?.split(" ")[0]||"User"}
              </span>
            </div>
          );
        })}
        {userIds.length===0&&user&&<div style={{color:"var(--muted)",fontSize:"0.82rem",alignSelf:"center"}}>Még nincs story. Legyél te az első!</div>}
      </div>

      {/* Upload modal */}
      {showUpload&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,padding:"1.5rem",width:"100%",maxWidth:380}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:"1.5rem",letterSpacing:1,marginBottom:"1rem"}}>📸 ÚJ STORY</div>
            {uploadPreview&&(
              <div style={{width:"100%",aspectRatio:"9/16",maxHeight:360,overflow:"hidden",borderRadius:12,marginBottom:"0.75rem",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <img src={uploadPreview} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>
              </div>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.75rem"}}>
              {STORY_TYPES.map(t=>(
                <button key={t.key} onClick={()=>setStoryType(t.key)} style={{padding:"0.35rem 0.75rem",borderRadius:100,border:`1px solid ${storyType===t.key?"var(--neon)":"var(--border)"}`,background:storyType===t.key?"var(--neon-dim)":"transparent",color:storyType===t.key?"var(--neon)":"var(--muted)",cursor:"pointer",fontSize:"0.8rem",fontWeight:storyType===t.key?700:400}}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <input className="form-input" placeholder="Felirat (opcionális)..." value={caption} onChange={e=>setCaption(e.target.value)} style={{marginBottom:"0.75rem"}}/>
            <div style={{display:"flex",gap:"0.5rem"}}>
              <button className="btn btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>{setShowUpload(false);setUploadPreview(null);setUploadFile(null);}}>Mégse</button>
              <button className="btn btn-neon" style={{flex:1,justifyContent:"center"}} onClick={uploadStory} disabled={uploading}>
                {uploading?<><span className="spinner" style={{width:16,height:16}}/>Feltöltés...</>:"📤 Story közzététel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewer */}
      {viewerOpen&&<StoryViewer stories={stories} startIndex={viewerStartIdx} onClose={()=>setViewerOpen(false)} profiles={profiles} user={user}/>}
    </>
  );
}

// Story viewer profilkártyáról nyitva
function StoryViewerFromProfile({ userId, profiles, onClose, user }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      try {
        const since=new Date(Date.now()-24*3600*1000).toISOString();
        const {data}=await supabase.from("stories").select("*").eq("user_id",userId).gte("created_at",since).order("created_at",{ascending:false});
        setStories(data||[]);
      } catch(e){}
      setLoading(false);
    }
    load();
  },[userId]);

  if(loading) return (
    <div style={{position:"fixed",inset:0,background:"#000",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <span className="spinner" style={{width:32,height:32}}/>
    </div>
  );
  if(!stories.length) return null;
  return <StoryViewer stories={stories} startIndex={0} onClose={onClose} profiles={profiles} user={user}/>;
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({length:60},(_,i)=>({
    id:i,
    x:Math.random()*100,
    color:["#c8f230","#ff4444","#4ade80","#f0a500","#ff6b35","#fff"][Math.floor(Math.random()*6)],
    size:Math.random()*10+5,
    duration:Math.random()*2+1.5,
    delay:Math.random()*0.8,
    shape:Math.random()>0.5?"50%":"0%"
  }));
  return (
    <>
      {pieces.map(p=>(
        <div key={p.id} className="confetti-piece" style={{
          left:`${p.x}%`, top:-20,
          width:p.size, height:p.size,
          background:p.color, borderRadius:p.shape,
          animationDuration:`${p.duration}s`,
          animationDelay:`${p.delay}s`
        }}/>
      ))}
    </>
  );
}

// Smart match score
function calcMatchScore(myProfile, other) {
  if(!myProfile||!other) return 0;
  let score=0;
  if(other.megye===myProfile.megye) score+=20;
  if(other.varos===myProfile.varos) score+=15;
  const tipusMatch=other.edzesTipus?.filter(t=>myProfile.edzesTipus?.includes(t)).length||0;
  score+=tipusMatch*15;
  const napMatch=other.napok?.filter(n=>myProfile.napok?.includes(n)).length||0;
  score+=napMatch*8;
  const idoMatch=other.idopontok?.filter(i=>myProfile.idopontok?.includes(i)).length||0;
  score+=idoMatch*8;
  const myEro=ERO_VALUE[myProfile.eroSzint]||0;
  const pEro=ERO_VALUE[other.eroSzint]||0;
  if(myEro>0&&Math.abs(myEro-pEro)<=1) score+=10;
  return Math.min(score,99);
}

// ── Swipe Mode ────────────────────────────────────────────────────────────────
function SwipeMode({ profiles, user, onLogin, myProfileId, myProfile }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(0);
  const [drag, setDrag] = useState({x:0,y:0,dragging:false});
  const [match, setMatch] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animating, setAnimating] = useState(null);
  const [todaySwipes, setTodaySwipes] = useState(0);
  const [streak, setStreak] = useState(0);
  const startPos = useRef({x:0,y:0});

  useEffect(()=>{
    const q=profiles.filter(p=>p.id!==myProfileId&&!p.id?.startsWith("d"));
    setQueue(q);
    if(user&&myProfileId) loadStreakData();
  },[profiles,myProfileId]);

  async function loadStreakData(){
    try {
      const {data}=await supabase.from("profiles").select("streak_days,today_swipes").eq("id",myProfileId).single();
      if(data){ setStreak(data.streak_days||0); setTodaySwipes(data.today_swipes||0); }
    } catch(e){}
  }

  async function updateStreakAndSwipes(){
    try {
      const newSwipes=todaySwipes+1;
      setTodaySwipes(newSwipes);
      await supabase.from("profiles").update({
        today_swipes:newSwipes,
        last_active:new Date().toISOString(),
        last_streak_date:new Date().toISOString().split("T")[0]
      }).eq("id",myProfileId).eq("user_id",user.id);
    } catch(e){}
  }

  const currentProfile=queue[current];
  const matchScore=calcMatchScore(myProfile,currentProfile);
  const direction=drag.x>30?"right":drag.x<-30?"left":null;
  const opacity=Math.min(Math.abs(drag.x)/100,1);

  async function doSwipe(action){
    if(!currentProfile||animating)return;
    if(!user){onLogin();return;}
    setAnimating(action);
    updateStreakAndSwipes();

    try {
      await supabase.from("swipes").insert([{user_id:user.id,target_profile_id:currentProfile.id,action}]);
      if(action==="like"){
        const {data}=await supabase.from("swipes").select("*")
          .eq("user_id",currentProfile.userId||"x")
          .eq("target_profile_id",myProfileId)
          .eq("action","like").maybeSingle();
        if(data){
          setMatch(currentProfile);
          setShowConfetti(true);
          if(navigator.vibrate) navigator.vibrate([100,50,100,50,200]);
          setTimeout(()=>setShowConfetti(false),4000);
        }
      }
    } catch(e){}

    setTimeout(()=>{
      setAnimating(null);
      setDrag({x:0,y:0,dragging:false});
      setCurrent(prev=>prev+1);
    },350);
  }

  function onStart(x,y){ if(!currentProfile)return; startPos.current={x,y}; setDrag(d=>({...d,dragging:true})); }
  function onMove(x,y){ if(!drag.dragging)return; setDrag(d=>({...d,x:x-startPos.current.x,y:y-startPos.current.y})); }
  function onEnd(){ if(!drag.dragging)return; if(drag.x>80)doSwipe("like"); else if(drag.x<-80)doSwipe("nope"); else setDrag({x:0,y:0,dragging:false}); }

  const cardStyle={
    transform:animating==="right"?"translateX(130%) rotate(25deg)":
              animating==="left"?"translateX(-130%) rotate(-25deg)":
              `translateX(${drag.x}px) translateY(${drag.y*0.3}px) rotate(${drag.x/12}deg)`,
    transition:animating?"transform 0.35s ease":drag.dragging?"none":"transform 0.25s ease",
    cursor:drag.dragging?"grabbing":"grab",
  };

  if(!user) return (
    <div style={{textAlign:"center",padding:"3rem"}}>
      <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔥</div>
      <div style={{color:"var(--muted)",marginBottom:"1rem"}}>Jelentkezz be a Swipe módhoz!</div>
      <button className="btn btn-neon" onClick={onLogin}>Belépés</button>
    </div>
  );

  if(!currentProfile||current>=queue.length) return (
    <div style={{textAlign:"center",padding:"3rem"}}>
      <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🎉</div>
      <div style={{fontFamily:"var(--font-display)",fontSize:"1.5rem",marginBottom:"0.5rem"}}>MINDENKIT VÉGIGNÉZTÉL!</div>
      <div style={{color:"var(--muted)",marginBottom:"1.5rem"}}>Gyere vissza később új profilokért.</div>
      <button className="btn btn-neon" onClick={()=>setCurrent(0)}>🔄 Újra</button>
    </div>
  );

  const badges=getBadges(currentProfile);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:"0.5rem"}}>
      {showConfetti&&<Confetti/>}

      {/* Streak + swipe stats */}
      <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",width:"100%",maxWidth:380}}>
        {streak>0&&(
          <div className="streak-pop" style={{flex:1,background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:10,padding:"0.5rem 0.75rem",textAlign:"center"}}>
            <div style={{fontSize:"1.2rem"}}>🔥</div>
            <div style={{fontWeight:700,fontSize:"0.85rem",color:"#ff6b35"}}>{streak} napos streak</div>
          </div>
        )}
        <div style={{flex:1,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"0.5rem 0.75rem",textAlign:"center"}}>
          <div style={{fontSize:"1.2rem"}}>⚡</div>
          <div style={{fontWeight:700,fontSize:"0.85rem",color:"var(--neon)"}}>{todaySwipes} swipe ma</div>
        </div>
        <div style={{flex:1,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"0.5rem 0.75rem",textAlign:"center"}}>
          <div style={{fontSize:"0.8rem",color:"var(--muted)"}}>Hátralévő</div>
          <div style={{fontWeight:700,fontSize:"0.85rem"}}>{queue.length-current} profil</div>
        </div>
      </div>

      {/* Smart match % */}
      {matchScore>0&&(
        <div style={{marginBottom:"0.75rem",background:`rgba(200,242,48,${matchScore/200})`,border:"1px solid rgba(200,242,48,0.3)",borderRadius:100,padding:"0.3rem 1rem",fontSize:"0.82rem",fontWeight:700,color:"var(--neon)"}}>
          ⚡ {matchScore}% kompatibilis veled
        </div>
      )}

      {/* Card stack */}
      <div style={{position:"relative",width:"100%",maxWidth:380,height:500,marginBottom:"1.25rem"}}>
        {queue[current+1]&&(
          <div style={{position:"absolute",inset:0,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,transform:"scale(0.95) translateY(12px)",zIndex:0}}/>
        )}
        <div style={{position:"absolute",inset:0,zIndex:1,...cardStyle,userSelect:"none"}}
          onMouseDown={e=>onStart(e.clientX,e.clientY)}
          onMouseMove={e=>onMove(e.clientX,e.clientY)}
          onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={e=>onStart(e.touches[0].clientX,e.touches[0].clientY)}
          onTouchMove={e=>{e.preventDefault();onMove(e.touches[0].clientX,e.touches[0].clientY)}}
          onTouchEnd={onEnd}>
          {drag.x>30&&(
            <div style={{position:"absolute",inset:0,borderRadius:20,border:"3px solid #4ade80",boxShadow:"0 0 50px rgba(74,222,128,0.5)",zIndex:10,pointerEvents:"none",opacity:Math.min(opacity*2,1)}}>
              <div style={{position:"absolute",top:24,left:24,background:"#4ade80",color:"#000",fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,padding:"0.3rem 1rem",borderRadius:8,transform:"rotate(-15deg)"}}>LIKE 💚</div>
            </div>
          )}
          {drag.x<-30&&(
            <div style={{position:"absolute",inset:0,borderRadius:20,border:"3px solid #ff4444",boxShadow:"0 0 50px rgba(255,68,68,0.5)",zIndex:10,pointerEvents:"none",opacity:Math.min(opacity*2,1)}}>
              <div style={{position:"absolute",top:24,right:24,background:"#ff4444",color:"#fff",fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,padding:"0.3rem 1rem",borderRadius:8,transform:"rotate(15deg)"}}>NOPE ❌</div>
            </div>
          )}
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,overflow:"hidden",height:"100%",display:"flex",flexDirection:"column"}}>
            <div style={{height:260,background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
              {currentProfile.avatarUrl
                ?<img src={currentProfile.avatarUrl} alt={currentProfile.nev} style={{width:"100%",height:"100%",objectFit:"cover"}} draggable="false"/>
                :<span style={{fontSize:"5rem"}}>{currentProfile.avatar}</span>}
              {currentProfile.maEdzek&&<div style={{position:"absolute",top:12,right:12,background:"rgba(255,107,53,0.9)",color:"#fff",fontSize:"0.72rem",fontWeight:700,padding:"0.2rem 0.6rem",borderRadius:100}}>🔥 Ma edzek</div>}
            </div>
            <div style={{padding:"1.1rem",flex:1,display:"flex",flexDirection:"column",gap:"0.4rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontFamily:"var(--font-display)",fontSize:"1.7rem",letterSpacing:1}}>{currentProfile.nev}</span>
                <span style={{color:"var(--muted)",fontSize:"0.95rem"}}>{currentProfile.kor} év</span>
              </div>
              <div style={{color:"var(--muted)",fontSize:"0.82rem"}}>{currentProfile.varos}, {currentProfile.megye}</div>
              {badges.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>{badges.map(b=><span key={b.label} style={{fontSize:"0.65rem",padding:"0.12rem 0.45rem",borderRadius:100,background:`${b.color}22`,color:b.color,border:`1px solid ${b.color}44`,fontWeight:600}}>{b.icon} {b.label}</span>)}</div>}
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>{currentProfile.edzesTipus.slice(0,3).map(t=><span key={t} className="tag active" style={{fontSize:"0.7rem"}}>{t}</span>)}</div>
              {currentProfile.leiras&&<div style={{color:"#aaa",fontSize:"0.8rem",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{currentProfile.leiras}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{display:"flex",gap:"1.5rem",alignItems:"center"}}>
        <button onClick={()=>doSwipe("nope")} style={{width:60,height:60,borderRadius:"50%",border:"2px solid #ff4444",background:"transparent",fontSize:"1.6rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,68,68,0.15)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>❌</button>
        <button onClick={()=>doSwipe("like")} style={{width:70,height:70,borderRadius:"50%",border:"2px solid #4ade80",background:"transparent",fontSize:"1.8rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(74,222,128,0.15)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>💚</button>
      </div>
      <div style={{color:"var(--muted)",fontSize:"0.72rem",marginTop:"0.6rem"}}>Húzd jobbra a like-hoz, balra a skip-hez</div>

      {/* MATCH POPUP - dopamin robbanás */}
      {match&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div className="match-popup" style={{background:"var(--surface)",border:"2px solid var(--neon)",borderRadius:24,padding:"2.5rem 2rem",textAlign:"center",maxWidth:360,width:"100%",boxShadow:"0 0 80px rgba(200,242,48,0.4)"}}>
            <div style={{fontSize:"4rem",marginBottom:"0.25rem",animation:"matchShake 0.5s ease 0.3s"}}>💥</div>
            <div style={{fontFamily:"var(--font-display)",fontSize:"3.5rem",letterSpacing:4,color:"var(--neon)",marginBottom:"0.25rem",lineHeight:1}}>MATCH!</div>
            <div style={{color:"#aaa",fontSize:"0.88rem",marginBottom:"1rem"}}>Megtaláltad az edzőpartnered 💪</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"1rem",marginBottom:"1.5rem"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:"var(--neon-dim)",border:"2px solid var(--neon)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",overflow:"hidden"}}>
                {match.avatarUrl?<img src={match.avatarUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>:match.avatar}
              </div>
              <div style={{fontFamily:"var(--font-display)",fontSize:"1.5rem",color:"var(--neon)"}}>❤️</div>
              <div style={{width:60,height:60,borderRadius:"50%",background:"var(--neon-dim)",border:"2px solid var(--neon)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}>👤</div>
            </div>
            <div style={{background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:10,padding:"0.75rem",marginBottom:"1.25rem",fontSize:"0.85rem",color:"#ff6b35",fontWeight:600}}>
              🔥 Ne hagyd kihűlni → írj rá MOST!
            </div>
            {match.instagram?(
              <button className="btn btn-neon" style={{width:"100%",justifyContent:"center",marginBottom:"0.5rem",padding:"0.85rem",fontSize:"1rem"}}
                onClick={()=>window.open(`https://instagram.com/${match.instagram.replace("@","")}`, "_blank")}>
                📷 Írj neki Instagramon
              </button>
            ):null}
            <button className="btn btn-ghost" style={{width:"100%",justifyContent:"center"}} onClick={()=>setMatch(null)}>
              Folytatom a swipelést
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Groups ────────────────────────────────────────────────────────────────────
function GroupsTab({ user, onLogin, myProfile }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myMemberships, setMyMemberships] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState({name:"",description:"",megye:"",varos:"",edzesTipus:[]});
  const [creating, setCreating] = useState(false);
  const [memberCounts, setMemberCounts] = useState({});

  const toggleArr=(arr,val)=>arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];

  useEffect(()=>{ loadGroups(); },[user]);

  async function loadGroups(){
    setLoading(true);
    try {
      const {data}=await supabase.from("groups").select("*").order("created_at",{ascending:false});
      setGroups(data||[]);
      // Tagszámok betöltése
      const counts={};
      for(const g of (data||[])){
        const {count}=await supabase.from("group_members").select("*",{count:"exact",head:true}).eq("group_id",g.id);
        counts[g.id]=count||0;
      }
      setMemberCounts(counts);
      // Saját tagságok
      if(user){
        const {data:mem}=await supabase.from("group_members").select("group_id").eq("user_id",user.id);
        setMyMemberships((mem||[]).map(m=>m.group_id));
      }
    } catch(e){}
    setLoading(false);
  }

  async function toggleMember(groupId){
    if(!user){onLogin();return;}
    if(myMemberships.includes(groupId)){
      await supabase.from("group_members").delete().eq("group_id",groupId).eq("user_id",user.id);
      setMyMemberships(prev=>prev.filter(id=>id!==groupId));
      setMemberCounts(prev=>({...prev,[groupId]:(prev[groupId]||1)-1}));
    } else {
      await supabase.from("group_members").insert([{group_id:groupId,user_id:user.id}]);
      setMyMemberships(prev=>[...prev,groupId]);
      setMemberCounts(prev=>({...prev,[groupId]:(prev[groupId]||0)+1}));
    }
  }

  async function createGroup(){
    if(!newGroup.name||!user){return;}
    setCreating(true);
    try {
      const {data,error}=await supabase.from("groups").insert([{
        name:newGroup.name, description:newGroup.description,
        megye:newGroup.megye||myProfile.megye||"",
        varos:newGroup.varos||myProfile.varos||"",
        edzes_tipus:newGroup.edzesTipus, created_by:user.id
      }]).select().single();
      if(error)throw error;
      // Automatikusan csatlakozik
      await supabase.from("group_members").insert([{group_id:data.id,user_id:user.id}]);
      setGroups(prev=>[{...data},  ...prev]);
      setMyMemberships(prev=>[...prev,data.id]);
      setMemberCounts(prev=>({...prev,[data.id]:1}));
      setShowCreate(false);
      setNewGroup({name:"",description:"",megye:"",varos:"",edzesTipus:[]});
    } catch(e){alert("Hiba: "+e.message);}
    setCreating(false);
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"1.25rem",flexWrap:"wrap",gap:"0.5rem"}}>
        <div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,marginBottom:"0.3rem"}}>GYM KÖRÖK</h1>
          <p style={{color:"var(--muted)",fontSize:"0.88rem"}}>Csatlakozz csoportokhoz vagy hozz létre sajátot</p>
        </div>
        {user&&<button className="btn btn-neon" onClick={()=>setShowCreate(true)}>+ Új kör</button>}
      </div>

      {/* Létrehozás modal */}
      {showCreate&&(
        <div className="card" style={{marginBottom:"1.5rem",border:"1px solid rgba(200,242,48,0.3)"}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:"1.3rem",letterSpacing:1,marginBottom:"1rem"}}>ÚJ GYM KÖR</div>
          <div className="form-group">
            <label className="form-label">Kör neve *</label>
            <input className="form-input" placeholder="pl. Vasárnapi deadlift crew" value={newGroup.name} onChange={e=>setNewGroup(p=>({...p,name:e.target.value}))}/>
          </div>
          <div className="form-group">
            <label className="form-label">Leírás</label>
            <textarea className="form-textarea" placeholder="Miről szól ez a kör?" value={newGroup.description} onChange={e=>setNewGroup(p=>({...p,description:e.target.value}))}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
            <div className="form-group">
              <label className="form-label">Megye</label>
              <select className="form-select" value={newGroup.megye} onChange={e=>setNewGroup(p=>({...p,megye:e.target.value}))}>
                <option value="">Válassz...</option>
                {MEGYEK.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Város</label>
              <input className="form-input" placeholder="pl. Budapest" value={newGroup.varos} onChange={e=>setNewGroup(p=>({...p,varos:e.target.value}))}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Edzéstípus</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
              {EDZES_TIPUSOK.map(t=>(
                <span key={t} className={`tag clickable${newGroup.edzesTipus.includes(t)?" active":""}`} onClick={()=>setNewGroup(p=>({...p,edzesTipus:toggleArr(p.edzesTipus,t)}))}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
            <button className="btn btn-ghost" onClick={()=>setShowCreate(false)}>Mégse</button>
            <button className="btn btn-neon" onClick={createGroup} disabled={creating||!newGroup.name}>
              {creating?"Létrehozás...":"✅ Létrehozás"}
            </button>
          </div>
        </div>
      )}

      {!user&&(
        <div className="card" style={{textAlign:"center",padding:"2rem",marginBottom:"1.5rem"}}>
          <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>👥</div>
          <div style={{color:"var(--muted)",marginBottom:"1rem"}}>Jelentkezz be hogy csatlakozz vagy létrehozz gym köröket!</div>
          <button className="btn btn-neon" onClick={onLogin}>Belépés / Regisztráció</button>
        </div>
      )}

      {loading&&<div style={{textAlign:"center",padding:"2rem"}}><span className="spinner" style={{width:28,height:28,margin:"0 auto",display:"block"}}/></div>}

      {!loading&&groups.length===0&&(
        <div className="card" style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
          <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>👥</div>
          Még nincs egyetlen gym kör sem. Legyél te az első!
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"1rem"}}>
        {groups.map(g=>{
          const isMember=myMemberships.includes(g.id);
          const isOwner=g.created_by===user?.id;
          return (
            <div key={g.id} className="card" style={{...(isMember?{borderColor:"rgba(200,242,48,0.4)"}:{})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:"1rem",marginBottom:"0.2rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.name}</div>
                  {(g.varos||g.megye)&&<div style={{color:"var(--muted)",fontSize:"0.78rem"}}>{g.varos&&g.varos}{g.varos&&g.megye&&", "}{g.megye}</div>}
                </div>
                {isOwner&&<span style={{fontSize:"0.65rem",background:"var(--neon)",color:"#0a0a0a",padding:"0.1rem 0.45rem",borderRadius:100,fontWeight:700,flexShrink:0,marginLeft:"0.5rem"}}>TE</span>}
              </div>
              {g.description&&<div style={{color:"#aaa",fontSize:"0.84rem",marginBottom:"0.75rem",lineHeight:1.5}}>{g.description}</div>}
              {g.edzes_tipus?.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginBottom:"0.75rem"}}>
                  {g.edzes_tipus.map(t=><span key={t} className="tag active" style={{fontSize:"0.68rem"}}>{t}</span>)}
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:"var(--muted)",fontSize:"0.78rem"}}>👥 {memberCounts[g.id]||0} tag</span>
                <button
                  className={`btn btn-sm ${isMember?"btn-ghost":"btn-neon"}`}
                  style={isMember?{borderColor:"var(--neon)",color:"var(--neon)",border:"1px solid"}:{}}
                  onClick={()=>toggleMember(g.id)}>
                  {isMember?"✓ Tag vagy":"Csatlakozás"}
                </button>
              </div>
            </div>
          );
        })}
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



// ── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(()=>{ loadReports(); },[filter]);

  async function loadReports(){
    setLoading(true);
    try {
      const {data}=await supabase.from("reports").select("*").eq("status",filter).order("created_at",{ascending:false});
      setReports(data||[]);
    } catch(e){}
    setLoading(false);
  }

  async function updateStatus(id, status){
    await supabase.from("reports").update({status}).eq("id",id);
    loadReports();
  }

  return (
    <div>
      <h1 style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,marginBottom:"1rem"}}>🛡️ ADMIN</h1>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem",flexWrap:"wrap"}}>
        {["pending","resolved","dismissed"].map(s=>(
          <button key={s} className={`btn btn-sm ${filter===s?"btn-neon":"btn-ghost"}`} onClick={()=>setFilter(s)}>
            {s==="pending"?"⏳ Függőben":s==="resolved"?"✅ Megoldott":"❌ Elutasított"}
          </button>
        ))}
      </div>
      {loading&&<div style={{textAlign:"center",padding:"2rem"}}><span className="spinner" style={{margin:"0 auto",display:"block"}}/></div>}
      {!loading&&reports.length===0&&<div className="card" style={{textAlign:"center",color:"var(--muted)",padding:"2rem"}}>Nincs ilyen jelentés</div>}
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
        {reports.map(r=>(
          <div key={r.id} className="card" style={{padding:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
              <div>
                <div style={{fontSize:"0.78rem",color:"var(--muted)",marginBottom:"0.2rem"}}>
                  {new Date(r.created_at).toLocaleDateString("hu")}
                </div>
                <div style={{fontWeight:600,fontSize:"0.88rem"}}>Ok: <span style={{color:"var(--orange)"}}>{r.reason}</span></div>
                <div style={{fontSize:"0.75rem",color:"var(--muted)",marginTop:"0.2rem"}}>Profil ID: {r.reported_profile_id?.slice(0,8)}...</div>
              </div>
              <div style={{display:"flex",gap:"0.4rem"}}>
                <button className="btn btn-sm btn-neon" onClick={()=>updateStatus(r.id,"resolved")}>✅</button>
                <button className="btn btn-sm btn-ghost" onClick={()=>updateStatus(r.id,"dismissed")}>❌</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
function LeaderboardSection({ profiles, user }) {
  const ranked = [...profiles]
    .filter(p=>p.userId&&!p.id?.startsWith("d"))
    .map(p=>{
      let score=0;
      if(p.streakDays>0) score+=p.streakDays*3;
      if(p.avatarUrl) score+=5;
      if(p.instagram) score+=5;
      if(p.leiras) score+=3;
      if(p.statusText) score+=2;
      if(p.maEdzek) score+=10;
      if((p.napok?.length||0)>=5) score+=4;
      if((p.edzesTipus?.length||0)>=3) score+=3;
      return {...p,_score:score};
    })
    .sort((a,b)=>b._score-a._score)
    .slice(0,5);

  if(ranked.length===0) return null;

  const medals=["🥇","🥈","🥉","4️⃣","5️⃣"];
  const colors=["#ffd700","#c0c0c0","#cd7f32","var(--muted)","var(--muted)"];

  return (
    <div style={{marginBottom:"1.5rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.75rem"}}>
        <span style={{fontSize:"0.78rem",fontWeight:700,color:"#ffd700",textTransform:"uppercase",letterSpacing:"0.8px"}}>🏆 Rangsor</span>
        <div style={{flex:1,height:1,background:"var(--border2)"}}/>
        <span style={{fontSize:"0.7rem",color:"var(--muted)"}}>streak + aktivitás alapján</span>
      </div>
      <div style={{background:"linear-gradient(145deg,var(--surface),var(--surface2))",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden",boxShadow:"var(--shadow-sm)"}}>
        {ranked.map((p,i)=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderBottom:i<ranked.length-1?"1px solid var(--border2)":"none",transition:"background 0.15s",cursor:"default"}}>
            <div style={{width:28,textAlign:"center",fontSize:i<3?"1.3rem":"0.9rem",color:colors[i],fontWeight:700,flexShrink:0}}>{medals[i]}</div>
            <div style={{width:38,height:38,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:"var(--surface3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",border:`2px solid ${i===0?"#ffd700":i===1?"#c0c0c0":i===2?"#cd7f32":"var(--border)"}` }}>
              {p.avatarUrl?<img src={p.avatarUrl} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:p.avatar}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:"0.88rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {p.nev}{p.instagram&&<span style={{marginLeft:"0.25rem",fontSize:"0.7rem"}}>✅</span>}
                {p.userId===user?.id&&<span style={{marginLeft:"0.3rem",fontSize:"0.65rem",background:"var(--neon)",color:"#080808",padding:"0.05rem 0.35rem",borderRadius:100,fontWeight:700}}>TE</span>}
              </div>
              <div style={{fontSize:"0.72rem",color:"var(--text2)"}}>{p.varos||p.megye}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"0.2rem",flexShrink:0}}>
              {p.streakDays>0&&<span style={{fontSize:"0.7rem",color:"#ff6b35",fontWeight:600}}>🔥 {p.streakDays} nap</span>}
              {p.maEdzek&&<span style={{fontSize:"0.65rem",color:"#ff6b35"}}>Ma edzek</span>}
              <span style={{fontSize:"0.65rem",color:"var(--muted)",fontWeight:600}}>{p._score} pont</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Onboarding ───────────────────────────────────────────────────────────────
function OnboardingScreen({ onDone, onLogin }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon: "🏋️",
      title: "Üdv a GymBrón!",
      desc: "Magyarország első edzőpartner kereső közössége. Találd meg azt az embert aki ugyanakkor, ugyanott, ugyanúgy szeretne edzeni mint te.",
      color: "#c8f230"
    },
    {
      icon: "🔍",
      title: "Keress & swipelj",
      desc: "Szűrj megye, edzéstípus és időpont szerint. Vagy swipe módban lapozd át a profilokat mint egy Tinder — jobbra ha tetszik, balra ha nem.",
      color: "#ff6b35"
    },
    {
      icon: "💪",
      title: "Kapcsolódj",
      desc: "Ha mindketten jelzitek hogy edzeni akartok együtt — MATCH! Azután az Instagram linken keresztül egyeztethetek az első közös edzést.",
      color: "#a855f7"
    }
  ];
  const s = steps[step];

  function finish(){
    localStorage.setItem("gymbro_seen","1");
    onDone();
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.96)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{width:"100%",maxWidth:420,textAlign:"center"}}>
        {/* Logo */}
        <GymBroLogo large/>
        <div style={{marginTop:"2.5rem",marginBottom:"2rem"}}>
          {/* Step icon */}
          <div style={{fontSize:"4rem",marginBottom:"1rem",filter:`drop-shadow(0 0 20px ${s.color})`}}>{s.icon}</div>
          {/* Title */}
          <div style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,color:s.color,marginBottom:"0.75rem"}}>{s.title}</div>
          {/* Description */}
          <div style={{color:"#aaa",fontSize:"0.95rem",lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>{s.desc}</div>
        </div>
        {/* Progress dots */}
        <div style={{display:"flex",justifyContent:"center",gap:"0.5rem",marginBottom:"2rem"}}>
          {steps.map((_,i)=>(
            <div key={i} style={{width:i===step?24:8,height:8,borderRadius:100,background:i===step?s.color:"#333",transition:"all 0.3s"}}/>
          ))}
        </div>
        {/* Buttons */}
        {step < steps.length-1 ? (
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            <button className="btn btn-neon" onClick={()=>setStep(s=>s+1)} style={{width:"100%",justifyContent:"center",padding:"0.9rem",fontSize:"1rem"}}>
              Következő →
            </button>
            <button className="btn btn-ghost" onClick={finish} style={{width:"100%",justifyContent:"center",fontSize:"0.85rem"}}>
              Kihagyom
            </button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            <button className="btn btn-neon" onClick={()=>{finish();onLogin();}} style={{width:"100%",justifyContent:"center",padding:"0.9rem",fontSize:"1rem"}}>
              🚀 Regisztrálok ingyen
            </button>
            <button className="btn btn-ghost" onClick={finish} style={{width:"100%",justifyContent:"center",fontSize:"0.85rem"}}>
              Csak nézelődöm
            </button>
          </div>
        )}
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleGoogle(){
    setGoogleLoading(true); setError("");
    try {
      const {error}=await supabase.auth.signInWithOAuth({
        provider:"google",
        options:{ redirectTo: window.location.origin }
      });
      if(error) throw error;
    } catch(e){ setError("Google belépés sikertelen: "+e.message); }
    setGoogleLoading(false);
  }

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
          {/* Google gomb */}
          <button onClick={handleGoogle} disabled={googleLoading}
            style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.75rem",padding:"0.75rem",marginBottom:"1rem",background:"#fff",border:"none",borderRadius:9,cursor:"pointer",fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.92rem",color:"#333",boxShadow:"0 2px 8px rgba(0,0,0,0.3)",transition:"all 0.2s",opacity:googleLoading?0.7:1}}>
            {googleLoading?<span className="spinner" style={{width:18,height:18,borderTopColor:"#4285f4"}}/>:(
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            Belépés Google-lel
          </button>

          {/* Elválasztó */}
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
            <div style={{flex:1,height:1,background:"var(--border)"}}/>
            <span style={{color:"var(--muted)",fontSize:"0.78rem"}}>vagy email-lel</span>
            <div style={{flex:1,height:1,background:"var(--border)"}}/>
          </div>

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
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("gymbro_seen"));

  const [dbProfiles, setDbProfiles] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [myProfileId, setMyProfileId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [msgTarget, setMsgTarget] = useState(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [myMatches, setMyMatches] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [myBlocks, setMyBlocks] = useState([]);
  const [maEdzek, setMaEdzek] = useState(false);
  const [maEdzekIdo, setMaEdzekIdo] = useState("");
  const [maEdzekHelyszin, setMaEdzekHelyszin] = useState("");
  const [maEdzekSaving, setMaEdzekSaving] = useState(false);
  const [swipeMode, setSwipeMode] = useState(false);
  const [storyUserId, setStoryUserId] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [userCount, setUserCount] = useState(0);

  // Filters
  const [fMegye, setFMegye] = useState("");
  const [fEdzTipus, setFEdzTipus] = useState([]);
  const [fEroSzint, setFEroSzint] = useState("");
  const [fNap, setFNap] = useState("");
  const [fIdo, setFIdo] = useState("");
  const [fNev, setFNev] = useState("");
  const [fAktiv, setFAktiv] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // AI
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  // Profile form
  const [myProfile, setMyProfile] = useState({nev:"",kor:"",megye:"",varos:"",gym:"",edzesTipus:[],eroSzint:"",napok:[],idopontok:[],leiras:"",instagram:"",statusText:""});
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const toggleArr=(arr,val)=>arr.includes(val)?arr.filter(x=>x!==val):[...arr,val];

  // Combine db + demo, saját profil elöl
  const profiles = [
    ...dbProfiles.filter(p=>p.userId===user?.id),
    ...dbProfiles.filter(p=>p.userId!==user?.id),
  ];

  // Meta tags
  useEffect(()=>{
    document.title = "GymBro – Edzőpartner kereső Magyarországon";
    const setMeta = (name, content, prop=false) => {
      let el = document.querySelector(prop?`meta[property="${name}"]`:`meta[name="${name}"]`);
      if(!el){ el=document.createElement("meta"); el.setAttribute(prop?"property":"name",name); document.head.appendChild(el); }
      el.setAttribute("content",content);
    };
    setMeta("description","Találd meg a tökéletes edzőpartnered Magyarországon. Szűrj megye, edzéstípus és időpont szerint.");
    setMeta("og:title","GymBro – Edzőpartner kereső",true);
    setMeta("og:description","Találd meg a tökéletes edzőpartnered Magyarországon.",true);
    setMeta("og:url","https://gymbro-five-jade.vercel.app",true);
    setMeta("og:type","website",true);
  },[]);


  // Hash-alapú URL routing — profil megnyitás linkből
  useEffect(()=>{
    function handleHash(){
      const hash = window.location.hash;
      const match = hash.match(/^#\/u\/(.+)$/);
      if(match){
        const slug = match[1];
        // Megvárjuk míg betöltenek a profilok majd megnyitjuk
        const tryOpen = (attempts=0) => {
          const found = dbProfiles.find(p=>toSlug(p.nev)===slug);
          if(found){ setSelected(found); }
          else if(attempts<10){ setTimeout(()=>tryOpen(attempts+1), 500); }
        };
        tryOpen();
      }
    }
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return ()=>window.removeEventListener("hashchange", handleHash);
  },[dbProfiles]);

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setUser(data.session?.user??null);
      if(data.session?.user) { loadMatches(data.session.user.id); loadFavorites(data.session.user.id); loadBlocks(data.session.user.id); }
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{
      setUser(session?.user??null);
      if(session?.user) {
        loadMatches(session.user.id); loadFavorites(session.user.id); loadBlocks(session.user.id);
        // last_active frissítés bejelentkezéskor
        setTimeout(async()=>{
          const {data:p}=await supabase.from("profiles").select("id").eq("user_id",session.user.id).maybeSingle();
          if(p) await supabase.from("profiles").update({last_active:new Date().toISOString()}).eq("id",p.id).eq("user_id",session.user.id);
        },1000);
      }
      else { setMyMatches([]); setMyFavorites([]); setMyBlocks([]); }
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

  async function loadBlocks(uid){
    try {
      const {data}=await supabase.from("blocks").select("blocked_profile_id").eq("user_id",uid);
      setMyBlocks((data||[]).map(b=>b.blocked_profile_id));
    } catch(e){}
  }

  async function toggleMaEdzek(){
    if(!user||!myProfileId){setShowAuth(true);return;}
    setMaEdzekSaving(true);
    const newVal=!maEdzek;
    await supabase.from("profiles").update({
      ma_edzek:newVal,
      ma_edzek_ido:newVal?maEdzekIdo:null,
      ma_edzek_helyszin:newVal?maEdzekHelyszin:null,
      ma_edzek_updated:new Date().toISOString()
    }).eq("id",myProfileId).eq("user_id",user.id);
    setMaEdzek(newVal);
    setDbProfiles(prev=>prev.map(p=>p.id===myProfileId?{...p,maEdzek:newVal,maEdzekIdo:maEdzekIdo,maEdzekHelyszin:maEdzekHelyszin}:p));
    setMaEdzekSaving(false);
  }

  async function handleBlock(profile){
    if(!user){setShowAuth(true);return;}
    if(!window.confirm(`Biztosan blokkolod ${profile.nev} profilját? Nem fogod látni többé.`))return;
    await supabase.from("blocks").insert([{user_id:user.id,blocked_profile_id:profile.id}]);
    setMyBlocks(prev=>[...prev,profile.id]);
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

  // Load stories for profile card indicators
  useEffect(()=>{
    async function loadAllStories(){
      try {
        const since=new Date(Date.now()-24*3600*1000).toISOString();
        const {data}=await supabase.from("stories").select("user_id").gte("created_at",since);
        setAllStories(data||[]);
      } catch(e){}
    }
    loadAllStories();
  },[]);
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
            avatarUrl:p.avatar_url||"",instagram:p.instagram||"",
            maEdzek:p.ma_edzek||false,maEdzekIdo:p.ma_edzek_ido||"",maEdzekHelyszin:p.ma_edzek_helyszin||"",
            lastActive:p.last_active||null,streakDays:p.streak_days||0,
            statusText:p.status_text||""
          }));
          setDbProfiles(mapped);
          const session=await supabase.auth.getSession();
          const uid=session.data.session?.user?.id;
          if(uid){
            const own=mapped.find(p=>p.userId===uid);
            if(own){
              setMyProfileId(own.id);
              if(own.avatarUrl)setAvatarUrl(own.avatarUrl);
              setMyProfile({nev:own.nev||"",kor:own.kor||"",megye:own.megye||"",varos:own.varos||"",gym:own.gym||"",edzesTipus:own.edzesTipus||[],eroSzint:own.eroSzint||"",napok:own.napok||[],idopontok:own.idopontok||[],leiras:own.leiras||"",instagram:own.instagram||"",statusText:own.statusText||""});
              setMaEdzek(own.maEdzek||false);
              setMaEdzekIdo(own.maEdzekIdo||"");
              setMaEdzekHelyszin(own.maEdzekHelyszin||"");
            }
            setProfileLoading(false);
          } else {
            setProfileLoading(false);
          }
        }
      } catch(e){}
      // User count
      try {
        const {count}=await supabase.from("profiles").select("*",{count:"exact",head:true});
        setUserCount(count||0);
      } catch(e){}
      setDbLoading(false);
    }
    load();
  },[]);

  // Filter
  const filtered=profiles.filter(p=>{
    if(myBlocks.includes(p.id)) return false;
    if(showOnlyMatches && !myMatches.includes(p.id)) return false;
    if(showOnlyFavorites && !myFavorites.includes(p.id)) return false;
    if(fNev&&!p.nev?.toLowerCase().includes(fNev.toLowerCase()))return false;
    if(fAktiv&&(!p.lastActive||(Date.now()-new Date(p.lastActive))>7*24*3600*1000))return false;
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
      const payload={nev:myProfile.nev,kor:parseInt(myProfile.kor)||25,megye:myProfile.megye,varos:myProfile.varos,gym:myProfile.gym,edzes_tipus:myProfile.edzesTipus,ero_szint:myProfile.eroSzint,napok:myProfile.napok,idopontok:myProfile.idopontok,online:true,user_id:user.id,avatar_url:avatarUrl||null};
      if(myProfileId){
        const {error}=await supabase.from("profiles").update(payload).eq("id",myProfileId);
        if(error)throw error;
        await supabase.from("profiles").update({leiras:myProfile.leiras||null,instagram:myProfile.instagram||null,status_text:myProfile.statusText||null}).eq("id",myProfileId).eq("user_id",user.id);
        setDbProfiles(prev=>prev.map(p=>p.id===myProfileId?{...p,...myProfile,avatarUrl:avatarUrl||"",statusText:myProfile.statusText}:p));
      } else {
        const {data,error}=await supabase.from("profiles").insert([payload]).select().single();
        if(error)throw error;
        setMyProfileId(data.id);
        await supabase.from("profiles").update({leiras:myProfile.leiras||null,instagram:myProfile.instagram||null,status_text:myProfile.statusText||null}).eq("id",data.id).eq("user_id",user.id);
        setDbProfiles(prev=>[{...myProfile,id:data.id,kor:parseInt(myProfile.kor)||25,avatar:"👤",online:true,userId:user.id,avatarUrl:avatarUrl||"",leiras:myProfile.leiras,instagram:myProfile.instagram,statusText:myProfile.statusText},...prev]);
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

  async function deleteMyAccount(){
    if(!user)return;
    const confirmed=window.confirm("⚠️ FIGYELEM! Ez véglegesen törli a fiókodat, profilodat, üzeneteidet és minden adatodat. Ezt nem lehet visszavonni!\n\nBiztosan folytatod?");
    if(!confirmed)return;
    const confirmed2=window.confirm("Utolsó megerősítés: véglegesen törlöd a GymBro fiókodat?");
    if(!confirmed2)return;
    try {
      await supabase.rpc("delete_user");
      await supabase.auth.signOut();
      setUser(null);
      setMyProfileId(null);
      setMyProfile({nev:"",kor:"",megye:"",varos:"",gym:"",edzesTipus:[],eroSzint:"",napok:[],idopontok:[],leiras:"",instagram:""});
      setAvatarUrl("");
      setDbProfiles([]);
      alert("Fiókod sikeresen törölve.");
    } catch(e){
      alert("Hiba a törlés során: "+e.message);
    }
  }

  const isAdmin = user?.email === "bestbird94@gmail.com";

  function handleOpenMessage(profile){
    if(profile.instagram){
      window.open(profile.instagram.startsWith("http")?profile.instagram:`https://instagram.com/${profile.instagram.replace("@","")}`, "_blank");
    }
  }

  return (
    <ErrorBoundary>
      <style>{FONTS}{STYLES}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" style={{cursor:"pointer"}} onClick={()=>setTab("kereses")}><GymBroLogo/></div>
          <div className="nav-tabs">
            {[["kereses","🔍 Keresés"],["ai","🤖 AI"],["profil","👤 Profil"],...(isAdmin?[["admin","🛡️"]]:[])] .map(([k,l])=>(
              <button key={k} className={`nav-tab${tab===k?" active":""}`} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>
          <button
            onClick={()=>{
              const txt = encodeURIComponent("Rátaláltam egy jó appra edzőpartner kereséshez Magyarországon 💪\nhttps://gymbro-five-jade.vercel.app\n– próbáld ki, ingyenes!");
              window.open(`https://wa.me/?text=${txt}`,"_blank");
            }}
            style={{background:"#25D366",border:"none",borderRadius:8,padding:"0.35rem 0.7rem",color:"#fff",fontWeight:700,fontSize:"0.72rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.3rem",flexShrink:0,whiteSpace:"nowrap"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Megosztás
          </button>
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
                {userCount>0&&(
                  <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",marginTop:"0.75rem",background:"rgba(200,242,48,0.08)",border:"1px solid rgba(200,242,48,0.2)",borderRadius:100,padding:"0.35rem 1rem",fontSize:"0.82rem",color:"var(--neon)",fontWeight:600}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:"var(--neon)",display:"inline-block",animation:"pulse 2s infinite"}}/>
                    🏋️ {userCount} regisztrált edző Magyarországon
                  </div>
                )}
              </div>

              {/* CTA ha nincs bejelentkezve */}
              {!user&&(
                <div style={{background:"linear-gradient(135deg,rgba(200,242,48,0.1),rgba(200,242,48,0.04))",border:"1px solid rgba(200,242,48,0.25)",borderRadius:14,padding:"1.25rem 1.5rem",marginBottom:"1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontWeight:700,marginBottom:"0.25rem"}}>Regisztrálj és jelenj meg a keresőben!</div>
                    <div style={{color:"var(--text2)",fontSize:"0.84rem"}}>Ingyenes · Pár perc · Azonnal használható</div>
                  </div>
                  <button className="btn btn-neon" onClick={()=>setShowAuth(true)} style={{flexShrink:0}}>
                    🚀 Csatlakozok
                  </button>
                </div>
              )}

              {/* Live Activity sáv */}
              {(()=>{
                const maEdzesek = profiles.filter(p=>p.maEdzek&&p.userId);
                const storyCount = profiles.filter(p=>p.userId&&p.userId!==user?.id).length > 0 ? Math.floor(Math.random()*3+1) : 0;
                const activeCount = profiles.filter(p=>p.lastActive&&(Date.now()-new Date(p.lastActive))<3600000).length;
                return (
                  <div className="live-bar">
                    <div className="live-dot"/>
                    <div className="live-items">
                      <div className="live-item">🔥 <strong>{maEdzesek.length>0?maEdzesek.length:Math.floor(Math.random()*4+2)}</strong> ember edz most</div>
                      {storyCount>0&&<div className="live-item">📸 <strong>{storyCount}</strong> új story</div>}
                      {activeCount>0&&<div className="live-item">⚡ <strong>{activeCount}</strong> aktív most</div>}
                      <div className="live-item" style={{marginLeft:"auto",color:"var(--muted)",fontSize:"0.72rem"}}>élő</div>
                    </div>
                  </div>
                );
              })()}
              <StoryBar user={user} myProfileId={myProfileId} profiles={profiles} onLogin={()=>setShowAuth(true)}/>

              {/* Nézet váltó */}
              <div style={{display:"flex",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"0.25rem",marginBottom:"1.25rem",gap:"0.25rem"}}>
                <button onClick={()=>setSwipeMode(false)} style={{flex:1,padding:"0.5rem",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.85rem",transition:"all 0.2s",background:!swipeMode?"var(--neon)":"transparent",color:!swipeMode?"#0a0a0a":"var(--muted)"}}>
                  🔍 Lista nézet
                </button>
                <button onClick={()=>setSwipeMode(true)} style={{flex:1,padding:"0.5rem",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"var(--font-body)",fontWeight:600,fontSize:"0.85rem",transition:"all 0.2s",background:swipeMode?"#ff4444":"transparent",color:swipeMode?"#fff":"var(--muted)"}}>
                  🔥 Swipe mód
                </button>
              </div>

              {swipeMode?(
                <SwipeMode profiles={profiles.filter(p=>!myBlocks.includes(p.id))} user={user} onLogin={()=>setShowAuth(true)} myProfileId={myProfileId} myProfile={myProfile}/>
              ):(<>
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
              <div className="filter-bar" style={{marginBottom:"1rem"}}>
                {/* Névkeresés - mindig látható */}
                <div style={{position:"relative",marginBottom:filterOpen?"0.75rem":"0"}}>
                  <span style={{position:"absolute",left:"0.75rem",top:"50%",transform:"translateY(-50%)",color:"var(--muted)",fontSize:"0.9rem",pointerEvents:"none"}}>🔍</span>
                  <input className="form-input" placeholder="Keresés névre..." value={fNev}
                    onChange={e=>setFNev(e.target.value)}
                    style={{paddingLeft:"2.2rem",paddingRight:"6rem",fontSize:"0.88rem"}}/>
                  <div style={{position:"absolute",right:"0.5rem",top:"50%",transform:"translateY(-50%)",display:"flex",gap:"0.25rem",alignItems:"center"}}>
                    {fNev&&<button onClick={()=>setFNev("")} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:"0.9rem",padding:"0.2rem"}}>✕</button>}
                    <button onClick={()=>setFilterOpen(p=>!p)}
                      style={{background:filterOpen||(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0||fAktiv)?"var(--neon-dim)":"var(--surface3)",border:`1px solid ${filterOpen||(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0||fAktiv)?"rgba(200,242,48,0.3)":"var(--border)"}`,borderRadius:8,color:filterOpen||(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0||fAktiv)?"var(--neon)":"var(--muted)",cursor:"pointer",fontSize:"0.75rem",padding:"0.25rem 0.6rem",fontWeight:600,whiteSpace:"nowrap"}}>
                      🎛 {(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0||fAktiv)?`Szűrők (${[fMegye,fEroSzint,fNap,fIdo,...fEdzTipus,fAktiv?"aktív":""].filter(Boolean).length})`:"Szűrők"}
                    </button>
                  </div>
                </div>
                {/* Összecsukható szűrők */}
                {filterOpen&&(
                  <div style={{marginTop:"0.75rem",animation:"fadeIn 0.2s ease"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"0.65rem",marginBottom:"0.75rem"}}>
                      {[["Megye",MEGYEK,fMegye,setFMegye,"Összes megye"],["Erőszint",ERO_SZINTEK,fEroSzint,setFEroSzint,"Bármely szint"],["Nap",NAPOK,fNap,setFNap,"Bármely nap"],["Időpont",IDOPONTOK,fIdo,setFIdo,"Bármely időpont"]].map(([label,opts,val,set,ph])=>(
                        <div key={label}>
                          <div className="form-label" style={{marginBottom:"0.25rem"}}>{label}</div>
                          <select className="form-select" value={val} onChange={e=>set(e.target.value)} style={{fontSize:"0.8rem",padding:"0.45rem 0.65rem"}}>
                            <option value="">{ph}</option>
                            {opts.map(o=><option key={o}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="form-label" style={{marginBottom:"0.35rem"}}>Edzéstípus</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginBottom:"0.65rem"}}>
                      {EDZES_TIPUSOK.map(t=>(
                        <span key={t} className={`tag clickable${fEdzTipus.includes(t)?" active":""}`} onClick={()=>setFEdzTipus(prev=>toggleArr(prev,t))}>{t}</span>
                      ))}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"1rem",flexWrap:"wrap"}}>
                      <label style={{display:"flex",alignItems:"center",gap:"0.5rem",cursor:"pointer",fontSize:"0.82rem",color:fAktiv?"var(--neon)":"var(--text2)"}}>
                        <div onClick={()=>setFAktiv(p=>!p)} style={{width:36,height:20,borderRadius:100,background:fAktiv?"var(--neon)":"var(--surface3)",border:`1px solid ${fAktiv?"var(--neon)":"var(--border)"}`,position:"relative",transition:"all 0.2s",flexShrink:0,cursor:"pointer"}}>
                          <div style={{position:"absolute",top:2,left:fAktiv?18:2,width:14,height:14,borderRadius:"50%",background:fAktiv?"#080808":"var(--muted)",transition:"left 0.2s"}}/>
                        </div>
                        ⚡ Csak aktív (7 napon belül)
                      </label>
                      {(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0||fAktiv)&&(
                        <button className="btn btn-ghost btn-sm" onClick={()=>{setFMegye("");setFEroSzint("");setFNap("");setFIdo("");setFEdzTipus([]);setFAktiv(false);}}>✕ Törlés</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Ma edzek banner */}
              {(()=>{
                const maEdzesek=profiles.filter(p=>p.maEdzek&&!p.userId?.includes("d"));
                if(maEdzesek.length===0)return null;
                return (
                  <div style={{background:"linear-gradient(135deg,rgba(255,107,53,0.12),rgba(255,107,53,0.05))",border:"1px solid rgba(255,107,53,0.3)",borderRadius:12,padding:"0.85rem 1.2rem",marginBottom:"1rem"}}>
                    <div style={{fontWeight:700,color:"#ff6b35",fontSize:"0.88rem",marginBottom:"0.5rem"}}>🔥 Ma edzők:</div>
                    <div style={{display:"flex",flexDirection:"column",gap:"0.25rem"}}>
                      {maEdzesek.slice(0,5).map(p=>(
                        <div key={p.id} style={{fontSize:"0.82rem",color:"#ddd"}}>
                          – <strong>{p.nev}</strong>{p.maEdzekIdo&&<span style={{color:"#ff6b35"}}> ({p.maEdzekIdo})</span>}{p.maEdzekHelyszin&&<span style={{color:"var(--muted)"}}> · {p.maEdzekHelyszin}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
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

              {/* Sikertörténetek - csak nem bejelentkezett usernek */}
              {!user&&dbProfiles.length<3&&(
                <div style={{marginBottom:"1.5rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.75rem"}}>
                    <span style={{fontSize:"0.78rem",fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:"0.8px"}}>❤️ Sikertörténetek</span>
                    <div style={{flex:1,height:1,background:"var(--border2)"}}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"0.75rem"}}>
                    {[
                      {nev1:"Kovács Balázs",nev2:"Tóth Réka",szoveg:"3 hónapja minden szerdán együtt edzünk a Gold's Gymben. Az app nélkül soha nem találtunk volna egymásra.",varos:"Budapest",emoji:"🏋️"},
                      {nev1:"Nagy Péter",nev2:"Kiss Anna",szoveg:"Ugyanabban a kerületben laktunk és ugyanolyan időpontban edzettünk — csak nem tudtunk egymásról. A GymBro megoldotta!",varos:"Debrecen",emoji:"💪"},
                    ].map((s,i)=>(
                      <div key={i} style={{background:"linear-gradient(135deg,rgba(200,242,48,0.05),rgba(200,242,48,0.02))",border:"1px solid rgba(200,242,48,0.1)",borderRadius:14,padding:"1rem"}}>
                        <div style={{fontSize:"1.5rem",marginBottom:"0.5rem"}}>{s.emoji}</div>
                        <div style={{fontSize:"0.82rem",color:"var(--text2)",lineHeight:1.6,marginBottom:"0.75rem",fontStyle:"italic"}}>"{s.szoveg}"</div>
                        <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--neon)"}}>{s.nev1} & {s.nev2}</div>
                        <div style={{fontSize:"0.7rem",color:"var(--muted)"}}>{s.varos}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rangsor */}
              <LeaderboardSection profiles={profiles} user={user}/>

              {/* Neked ajánljuk szekció */}
              {myProfile.megye&&!showOnlyMatches&&!showOnlyFavorites&&(()=>{
                const recommended = profiles
                  .filter(p=>p.userId!==user?.id&&!myBlocks.includes(p.id)&&!p.id?.startsWith("d"))
                  .map(p=>{
                    let score=0;
                    if(p.megye===myProfile.megye) score+=3;
                    if(p.varos===myProfile.varos) score+=2;
                    p.edzesTipus?.forEach(t=>{ if(myProfile.edzesTipus?.includes(t)) score+=2; });
                    return {...p,_score:score};
                  })
                  .filter(p=>p._score>0)
                  .sort((a,b)=>b._score-a._score)
                  .slice(0,3);
                if(recommended.length===0) return null;
                return (
                  <div style={{marginBottom:"1.25rem"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.75rem"}}>
                      <span style={{fontSize:"0.78rem",fontWeight:700,color:"var(--purple)",textTransform:"uppercase",letterSpacing:"0.8px"}}>🎯 Neked ajánljuk</span>
                      <div style={{flex:1,height:1,background:"var(--border2)"}}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"0.75rem"}}>
                      {recommended.map(p=>(
                        <div key={p.id} style={{background:"linear-gradient(135deg,rgba(168,85,247,0.06),rgba(200,242,48,0.03))",border:"1px solid rgba(168,85,247,0.2)",borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"all 0.25s"}}
                          onClick={()=>setSelected(p)}
                          onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(168,85,247,0.4)"}
                          onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(168,85,247,0.2)"}>
                          <div style={{padding:"0.9rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                            <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",border:"2px solid rgba(168,85,247,0.4)",flexShrink:0,background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>
                              {p.avatarUrl?<img src={p.avatarUrl} alt="" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:p.avatar}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:600,fontSize:"0.9rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nev}</div>
                              <div style={{fontSize:"0.75rem",color:"var(--text2)"}}>{p.varos}, {p.megye}</div>
                              {p.statusText&&<div style={{fontSize:"0.7rem",color:"var(--neon)",marginTop:"0.15rem"}}>⚡ {p.statusText}</div>}
                            </div>
                            <div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--purple)",background:"rgba(168,85,247,0.12)",padding:"0.2rem 0.5rem",borderRadius:100,flexShrink:0}}>
                              {Math.min(p._score*10+40,98)}% match
                            </div>
                          </div>
                          <div style={{padding:"0 0.75rem 0.4rem",display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>
                            {p.edzesTipus?.slice(0,3).map(t=><span key={t} className="tag active" style={{fontSize:"0.66rem"}}>{t}</span>)}
                          </div>
                          <div style={{padding:"0 0.75rem 0.75rem",fontSize:"0.7rem",color:"var(--muted)",lineHeight:1.4}}>
                            💡 {[
                              p.varos===myProfile.varos&&`${p.varos}`,
                              p.megye===myProfile.megye&&p.varos!==myProfile.varos&&`${p.megye} megye`,
                              p.edzesTipus?.filter(t=>myProfile.edzesTipus?.includes(t)).length>0&&p.edzesTipus.filter(t=>myProfile.edzesTipus?.includes(t)).slice(0,2).join(", "),
                            ].filter(Boolean).slice(0,2).join(" · ")||"Kompatibilis"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div style={{marginBottom:"0.75rem",color:"var(--muted)",fontSize:"0.84rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
                {dbLoading&&<span className="spinner" style={{width:14,height:14}}/>}
                {filtered.length} edzőpartner található
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:"1rem"}}>
                {filtered.map(p=><ProfileCard key={p.id} profile={p} onClick={setSelected} isOwn={p.userId===user?.id} isMatched={myMatches.includes(p.id)} onMatch={toggleMatch} isFavorite={myFavorites.includes(p.id)} onFavorite={toggleFavorite} hasStory={allStories.some(s=>s.user_id===p.userId)} onStoryOpen={uid=>{setStoryUserId(uid);}}/>)}
                {filtered.length===0&&(
                  <div style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem"}}>
                    {(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0||fNev||fAktiv)?(
                      <>
                        <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🔍</div>
                        <div style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",letterSpacing:1,marginBottom:"0.5rem"}}>NINCS TALÁLAT</div>
                        <div style={{color:"var(--text2)",fontSize:"0.88rem",marginBottom:"1rem"}}>Próbálj tágabb feltételeket!</div>
                        <button className="btn btn-outline btn-sm" onClick={()=>{setFMegye("");setFEroSzint("");setFNap("");setFIdo("");setFEdzTipus([]);setFNev("");setFAktiv(false);}}>✕ Szűrők törlése</button>
                      </>
                    ):(
                      <>
                        <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🏋️</div>
                        <div style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",letterSpacing:1,marginBottom:"0.5rem",color:"var(--neon)"}}>LEGYÉL AZ ELSŐ!</div>
                        <div style={{color:"var(--text2)",fontSize:"0.88rem",marginBottom:"1.25rem",lineHeight:1.6,maxWidth:320,margin:"0 auto 1.25rem"}}>
                          Még nincs regisztrált edző ebben a szűrőben. Töltsd ki a profilodat és Te leszel az első!
                        </div>
                        <button className="btn btn-neon" onClick={()=>user?setTab("profil"):setShowAuth(true)}>
                          {user?"👤 Profil kitöltése":"🚀 Regisztrálok ingyen"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>)}
            </>
          )}

          {/* AI */}
          {tab==="ai"&&(
            <>
              <div style={{marginBottom:"1.25rem"}}>
                <h1 style={{fontFamily:"var(--font-display)",fontSize:"2rem",letterSpacing:2,marginBottom:"0.3rem"}}>AI AJÁNLÓ</h1>
                <p style={{color:"var(--text2)",fontSize:"0.86rem"}}>A Claude AI elemzi a profilodat és a legkompatibilisebb partnereket ajánlja</p>
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

              {/* Loading state amíg töltődnek az adatok */}
              {user&&(dbLoading||profileLoading)&&(
                <div className="card" style={{textAlign:"center",padding:"3rem"}}>
                  <div className="spinner" style={{margin:"0 auto 1rem",width:32,height:32}}/>
                  <div style={{color:"var(--muted)"}}>Profil betöltése...</div>
                </div>
              )}
              {/* Csak akkor jelenjen meg a form ha betöltött */}
              {(!user||(user&&!dbLoading&&!profileLoading))&&<>
              {user&&myProfileId&&(
                <div className="card" style={{marginBottom:"1rem",padding:"1.25rem"}}>
                  <div style={{fontFamily:"var(--font-display)",fontSize:"1.2rem",letterSpacing:1,marginBottom:"0.75rem"}}>🔥 MA EDZEK</div>
                  {!maEdzek?(
                    <>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"0.75rem"}}>
                        <div className="form-group" style={{marginBottom:0}}>
                          <label className="form-label">Időpont</label>
                          <input className="form-input" placeholder="pl. 18:00" value={maEdzekIdo} onChange={e=>setMaEdzekIdo(e.target.value)}/>
                        </div>
                        <div className="form-group" style={{marginBottom:0}}>
                          <label className="form-label">Helyszín</label>
                          <input className="form-input" placeholder="pl. Gold's Gym" value={maEdzekHelyszin} onChange={e=>setMaEdzekHelyszin(e.target.value)}/>
                        </div>
                      </div>
                      <button className="btn btn-neon" onClick={toggleMaEdzek} disabled={maEdzekSaving} style={{width:"100%",justifyContent:"center"}}>
                        🔥 Ma edzek! – Megjelenés a listán
                      </button>
                    </>
                  ):(
                    <div>
                      <div style={{background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:8,padding:"0.75rem",marginBottom:"0.75rem",fontSize:"0.88rem"}}>
                        🔥 <strong>Aktív:</strong> {maEdzekIdo&&<span>{maEdzekIdo}</span>}{maEdzekIdo&&maEdzekHelyszin&&" – "}{maEdzekHelyszin&&<span>{maEdzekHelyszin}</span>}
                        <div style={{color:"var(--muted)",fontSize:"0.78rem",marginTop:"0.25rem"}}>Megjelensz a "Ma edzők" listán!</div>
                      </div>
                      <button className="btn btn-ghost" onClick={toggleMaEdzek} disabled={maEdzekSaving} style={{width:"100%",justifyContent:"center",fontSize:"0.85rem"}}>
                        ✕ Mégsem edzek ma
                      </button>
                    </div>
                  )}
                </div>
              )}
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
                    {pct===100&&(
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginTop:"0.25rem"}}>
                    <div style={{fontSize:"0.78rem",color:"var(--neon)",fontWeight:700}}>🎉 Tökéletes profil! Maxon látnak a keresőben!</div>
                    <button onClick={()=>{
                      const el=document.createElement("div");
                      el.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:9999";
                      document.body.appendChild(el);
                      Array.from({length:40},(_,i)=>{
                        const p=document.createElement("div");
                        const colors=["#c8f230","#ff6b35","#4ade80","#a855f7","#fff"];
                        p.style.cssText=`position:absolute;width:${Math.random()*10+5}px;height:${Math.random()*10+5}px;background:${colors[Math.floor(Math.random()*5)]};border-radius:${Math.random()>0.5?"50%":"0"};left:${Math.random()*100}%;top:-20px;animation:confettiFall ${Math.random()*2+1.5}s ${Math.random()*0.8}s linear forwards`;
                        el.appendChild(p);
                      });
                      setTimeout(()=>document.body.removeChild(el),4000);
                    }} style={{background:"none",border:"none",cursor:"pointer",fontSize:"1rem"}}>🎊</button>
                  </div>
                )}
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
                  <label className="form-label">⚡ Státusz (opcionális)</label>
                  <input className="form-input" placeholder="pl. Ma lábnap 💪 / PR nap / 18:00 Gold Gym" maxLength={60}
                    value={myProfile.statusText} onChange={e=>setMyProfile(p=>({...p,statusText:e.target.value}))}/>
                  <span style={{fontSize:"0.72rem",color:"var(--muted)"}}>{myProfile.statusText?.length||0}/60 — megjelenik a profilkártyádon</span>
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
                {myProfileId&&myProfile.nev&&(
                  <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center",marginTop:"0.75rem",color:"var(--text2)"}}
                    onClick={()=>{
                      const url=`${window.location.origin}${window.location.pathname}#/u/${toSlug(myProfile.nev)}`;
                      if(navigator.share){ navigator.share({title:`GymBro – ${myProfile.nev}`,text:"Nézd meg a GymBro profilomat!",url}); }
                      else{ navigator.clipboard.writeText(url); alert("Profil link másolva! 🔗\n\n"+url); }
                    }}>
                    🔗 Saját profil link megosztása
                  </button>
                )}
              </div>

              {/* Fiók törlés */}
              {user&&(
                <div style={{marginTop:"1.5rem",padding:"1.25rem",background:"rgba(255,68,68,0.05)",border:"1px solid rgba(255,68,68,0.2)",borderRadius:12}}>
                  <div style={{fontWeight:600,marginBottom:"0.4rem",fontSize:"0.9rem"}}>⚠️ Veszélyes zóna</div>
                  <div style={{color:"var(--muted)",fontSize:"0.82rem",marginBottom:"0.75rem",lineHeight:1.5}}>
                    A fiók törlése végleges — minden adatod, profilod, üzeneted és storyid törlődik. Ezt nem lehet visszavonni.
                  </div>
                  <button className="btn btn-sm" onClick={deleteMyAccount}
                    style={{background:"rgba(255,68,68,0.1)",color:"var(--red)",border:"1px solid rgba(255,68,68,0.3)"}}>
                    🗑 Teljes fiók törlése
                  </button>
                </div>
              )}
              </>}
            </>
          )}



          {/* ADMIN */}
          {tab==="admin"&&isAdmin&&<AdminPanel/>}

        </div>
      </div>
      {selected&&<ProfileModal profile={selected} onClose={()=>setSelected(null)} onMessage={handleOpenMessage} onBlock={handleBlock} user={user}/>}
      {/* Floating Ma edzek gomb - csak keresés fülön, bejelentkezett usernek */}
      {user&&myProfileId&&tab==="kereses"&&(
        <div style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:150}}>
          {!maEdzek?(
            <button onClick={()=>setTab("profil")}
              style={{background:"var(--orange)",border:"none",borderRadius:100,padding:"0.75rem 1.25rem",color:"#fff",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(255,107,53,0.5)",display:"flex",alignItems:"center",gap:"0.5rem",transition:"all 0.2s",fontFamily:"var(--font-body)"}}>
              🔥 Ma edzek
            </button>
          ):(
            <div style={{background:"rgba(255,107,53,0.15)",border:"1px solid rgba(255,107,53,0.4)",borderRadius:100,padding:"0.65rem 1.1rem",color:"#ff6b35",fontWeight:700,fontSize:"0.82rem",display:"flex",alignItems:"center",gap:"0.4rem",boxShadow:"0 4px 16px rgba(255,107,53,0.2)"}}>
              🔥 Ma edzek {maEdzekIdo&&`· ${maEdzekIdo}`}
            </div>
          )}
        </div>
      )}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)}/>}
      {showOnboarding&&<OnboardingScreen onDone={()=>setShowOnboarding(false)} onLogin={()=>{setShowOnboarding(false);setShowAuth(true);}}/>}
      {storyUserId&&<StoryViewerFromProfile userId={storyUserId} profiles={profiles} onClose={()=>setStoryUserId(null)} user={user}/>}
    </ErrorBoundary>
  );
}
