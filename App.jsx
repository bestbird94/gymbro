import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://qbhoesdvsbjdbitjayai.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaG9lc2R2c2JqZGJpdGpheWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTkzMjcsImV4cCI6MjA4OTkzNTMyN30.a-ty57FWK5mBtH2hpULtQVKJGmjH3YftKvLqln42BAg"
);

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a;
    --surface: #131313;
    --surface2: #1c1c1c;
    --border: #2a2a2a;
    --neon: #c8f230;
    --neon-dim: rgba(200,242,48,0.12);
    --neon-glow: rgba(200,242,48,0.35);
    --text: #f0f0f0;
    --muted: #666;
    --red: #ff4444;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  
  /* Layout */
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .nav { 
    display: flex; align-items: center; justify-content: space-between; 
    padding: 0 2rem; height: 60px; border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.95); position: sticky; top: 0; z-index: 100;
    backdrop-filter: blur(10px);
  }
  .nav-logo { display: flex; align-items: center; }
  .nav-logo svg { height: 36px; width: auto; }
  .nav-tabs { display: flex; gap: 0.25rem; }
  .nav-tab {
    padding: 0.4rem 1rem; border-radius: 6px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.85rem; font-weight: 500;
    background: transparent; color: var(--muted); transition: all 0.2s;
  }
  .nav-tab:hover { color: var(--text); background: var(--surface2); }
  .nav-tab.active { background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(200,242,48,0.3); }

  .main { flex: 1; padding: 2rem; max-width: 1200px; margin: 0 auto; width: 100%; }
  
  /* Cards */
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 1.5rem; transition: border-color 0.2s;
  }
  .card:hover { border-color: #3a3a3a; }
  .card.highlight { border-color: rgba(200,242,48,0.4); background: linear-gradient(135deg, var(--surface), rgba(200,242,48,0.04)); }

  /* Buttons */
  .btn {
    padding: 0.6rem 1.4rem; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
    transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-neon { background: var(--neon); color: #0a0a0a; }
  .btn-neon:hover { background: #d4ff3a; box-shadow: 0 0 20px var(--neon-glow); }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--neon); color: var(--neon); }
  .btn-ghost { background: var(--surface2); color: var(--text); }
  .btn-ghost:hover { background: #252525; }
  .btn-sm { padding: 0.4rem 0.9rem; font-size: 0.8rem; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Form elements */
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
  .form-label { font-size: 0.8rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input, .form-select, .form-textarea {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); padding: 0.65rem 0.9rem; font-family: var(--font-body); font-size: 0.9rem;
    width: 100%; transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none; border-color: var(--neon); box-shadow: 0 0 0 2px var(--neon-dim);
  }
  .form-select option { background: #1c1c1c; }
  .form-textarea { resize: vertical; min-height: 80px; }

  /* Tags */
  .tag {
    display: inline-block; padding: 0.25rem 0.7rem; border-radius: 100px;
    font-size: 0.75rem; font-weight: 600; background: var(--surface2); color: var(--muted);
    border: 1px solid var(--border);
  }
  .tag.active { background: var(--neon-dim); color: var(--neon); border-color: rgba(200,242,48,0.3); }
  .tag.clickable { cursor: pointer; transition: all 0.15s; }
  .tag.clickable:hover { border-color: var(--neon); color: var(--neon); }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .flex { display: flex; }
  .flex-col { display: flex; flex-direction: column; }
  .gap-1 { gap: 0.5rem; }
  .gap-2 { gap: 1rem; }
  .gap-3 { gap: 1.5rem; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .wrap { flex-wrap: wrap; }
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .text-muted { color: var(--muted); font-size: 0.85rem; }
  .text-neon { color: var(--neon); }
  .text-sm { font-size: 0.85rem; }
  .font-display { font-family: var(--font-display); letter-spacing: 1px; }

  /* Profile card */
  .profile-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    overflow: hidden; transition: all 0.25s; cursor: pointer;
  }
  .profile-card:hover { border-color: rgba(200,242,48,0.4); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
  .profile-card.ai-pick { border-color: rgba(200,242,48,0.6); box-shadow: 0 0 20px rgba(200,242,48,0.1); }
  .profile-card-header { padding: 1.2rem; border-bottom: 1px solid var(--border); }
  .profile-card-body { padding: 1.2rem; }
  .avatar {
    width: 48px; height: 48px; border-radius: 50%; background: var(--neon-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; border: 2px solid rgba(200,242,48,0.3); flex-shrink: 0;
  }
  .avatar.lg { width: 72px; height: 72px; font-size: 2rem; }
  .strength-bar { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-top: 0.4rem; }
  .strength-fill { height: 100%; background: var(--neon); border-radius: 2px; transition: width 0.5s; }

  /* AI panel */
  .ai-panel {
    background: linear-gradient(135deg, rgba(200,242,48,0.06), rgba(200,242,48,0.02));
    border: 1px solid rgba(200,242,48,0.25); border-radius: 14px; padding: 1.5rem;
  }
  .ai-badge {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: var(--neon-dim); color: var(--neon); border: 1px solid rgba(200,242,48,0.3);
    padding: 0.3rem 0.8rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1rem;
  }
  .pulse { display: inline-block; width: 8px; height: 8px; background: var(--neon); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }

  /* Hero */
  .hero { 
    padding: 3rem 0 2rem; 
    background: radial-gradient(ellipse at 50% 0%, rgba(200,242,48,0.08) 0%, transparent 60%);
    text-align: center; margin-bottom: 2rem;
  }
  .hero-title { font-family: var(--font-display); font-size: 4rem; letter-spacing: 4px; line-height: 1; }
  .hero-sub { color: var(--muted); margin-top: 0.75rem; font-size: 1.05rem; }

  /* Filter bar */
  .filter-bar { 
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 1.25rem; margin-bottom: 1.5rem;
  }
  .filter-title { font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1rem; }

  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 1.5rem 0; }

  /* Alert */
  .alert { padding: 0.9rem 1.1rem; border-radius: 8px; font-size: 0.88rem; margin-bottom: 1rem; }
  .alert-success { background: rgba(200,242,48,0.1); border: 1px solid rgba(200,242,48,0.3); color: var(--neon); }
  .alert-error { background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); color: var(--red); }

  /* Spinner */
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--neon); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; padding: 2rem; }
  .modal-title { font-family: var(--font-display); font-size: 1.8rem; letter-spacing: 1px; margin-bottom: 1.5rem; }

  /* Responsive */
  @media (max-width: 700px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .hero-title { font-size: 2.8rem; }
    .main { padding: 1rem; }
  }
`;

// ── Data ──────────────────────────────────────────────────────────────────────

function GymBroLogo({ large }) {
  const w = large ? 320 : 140;
  const h = large ? 120 : 52;
  return (
    <svg width={w} height={h} viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f0f0f"/>
          <stop offset="100%" stopColor="#1a1a1a"/>
        </linearGradient>
        <linearGradient id="gb-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c8f230"/>
          <stop offset="100%" stopColor="#8ab510"/>
        </linearGradient>
        <linearGradient id="gb-text" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0f0f0"/>
          <stop offset="60%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#aaaaaa"/>
        </linearGradient>
        <filter id="gb-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#c8f230" floodOpacity="0.3"/>
        </filter>
      </defs>
      <rect x="60" y="20" width="560" height="220" rx="28" fill="url(#gb-bg)"/>
      <rect x="60" y="20" width="560" height="220" rx="28" fill="none" stroke="#2a2a2a" strokeWidth="1.5"/>
      <text x="340" y="148" textAnchor="middle" dominantBaseline="central"
        fontFamily="'Arial Black', Impact, sans-serif" fontWeight="900" fontSize="82" letterSpacing="6"
        fill="url(#gb-text)" filter="url(#gb-shadow)">GYMBRO</text>
      <text x="340" y="207" textAnchor="middle"
        fontFamily="Arial, sans-serif" fontSize="13" fontWeight="500" letterSpacing="5"
        fill="#c8f230" opacity="0.8">EDZŐPARTNER KERESŐ</text>
      <rect x="280" y="224" width="120" height="2" rx="1" fill="url(#gb-bar)" opacity="0.5"/>
    </svg>
  );
}

const MEGYEK = ["Budapest","Pest","Fejér","Komárom-Esztergom","Veszprém","Győr-Moson-Sopron","Vas","Zala","Somogy","Tolna","Baranya","Bács-Kiskun","Csongrád-Csanád","Békés","Hajdú-Bihar","Szabolcs-Szatmár-Bereg","Nógrád","Heves","Jász-Nagykun-Szolnok","Borsod-Abaúj-Zemplén"];
const EDZES_TIPUSOK = ["Erőedzés","CrossFit","Bodybuilding","Powerlifting","Olimpiai súlyemelés","Kardio","Funkcionális edzés","Küzdősport","Calisthenics","HIIT"];
const ERO_SZINTEK = ["Kezdő (0–6 hónap)","Haladó (6–24 hónap)","Tapasztalt (2–5 év)","Versenyző / Elite"];
const NAPOK = ["Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat","Vasárnap"];
const IDOPONTOK = ["Reggel 6–8","Reggel 8–10","Délelőtt 10–12","Délután 12–15","Délután 15–17","Este 17–19","Este 19–21","Este 21–23"];

const DEMO_PROFILES = [
  { id: 1, nev: "Kovács Balázs", kor: 26, megye: "Budapest", varos: "Budapest", gym: "Gold's Gym Árkád", edzesTipus: ["Erőedzés","Powerlifting"], eroSzint: "Tapasztalt (2–5 év)", napok: ["Hétfő","Szerda","Péntek"], idopontok: ["Este 17–19","Este 19–21"], leiras: "Komoly powerlifter keresek hasonlóan gondolkodó edzőtársat. Guggolás és holtpont specialista.", avatar: "🏋️", online: true },
  { id: 2, nev: "Tóth Réka", kor: 23, megye: "Pest", varos: "Érd", gym: "FitArena Érd", edzesTipus: ["CrossFit","HIIT"], eroSzint: "Haladó (6–24 hónap)", napok: ["Kedd","Csütörtök","Szombat"], idopontok: ["Reggel 6–8","Reggel 8–10"], leiras: "CrossFit fanatikus, versenyekre is járok. Keresem azt aki reggelenként is motivált!", avatar: "⚡", online: false },
  { id: 3, nev: "Németh Péter", kor: 31, megye: "Győr-Moson-Sopron", varos: "Győr", gym: "BodyShop Győr", edzesTipus: ["Bodybuilding"], eroSzint: "Versenyző / Elite", napok: ["Hétfő","Kedd","Csütörtök","Péntek","Szombat"], idopontok: ["Délután 15–17","Este 17–19"], leiras: "5 éve versenyző bodybuilder. Masszív, strukturált edzések. Komoly partnert keresek.", avatar: "💪", online: true },
  { id: 4, nev: "Szabó Anna", kor: 19, megye: "Veszprém", varos: "Veszprém", gym: "FitLife Veszprém", edzesTipus: ["Funkcionális edzés","Kardio"], eroSzint: "Kezdő (0–6 hónap)", napok: ["Szerda","Szombat","Vasárnap"], idopontok: ["Délelőtt 10–12","Délután 12–15"], leiras: "Frissen kezdtem el edzeni, türelmes partnert keresek aki segít a technikában!", avatar: "🌟", online: true },
  { id: 5, nev: "Horváth Gábor", kor: 28, megye: "Budapest", varos: "Budapest", gym: "BodyBoss XIII.", edzesTipus: ["Erőedzés","Olimpiai súlyemelés"], eroSzint: "Tapasztalt (2–5 év)", napok: ["Hétfő","Szerda","Péntek","Vasárnap"], idopontok: ["Este 19–21","Este 21–23"], leiras: "Olimpiai súlyemelésre specializálódtam, de alap erőedzést is csinálok. Késő esti edzések.", avatar: "🏅", online: false },
  { id: 6, nev: "Kiss Dóra", kor: 25, megye: "Csongrád-Csanád", varos: "Szeged", gym: "Titanium Gym Szeged", edzesTipus: ["Küzdősport","Funkcionális edzés"], eroSzint: "Haladó (6–24 hónap)", napok: ["Kedd","Csütörtök","Szombat"], idopontok: ["Este 17–19"], leiras: "Kick-box és MMA háttérrel rendelkezem, keresek kondicionáló edzőtársat.", avatar: "🥊", online: true },
  { id: 7, nev: "Varga Zoltán", kor: 35, megye: "Hajdú-Bihar", varos: "Debrecen", gym: "IronMill Debrecen", edzesTipus: ["Powerlifting","Erőedzés"], eroSzint: "Versenyző / Elite", napok: ["Kedd","Csütörtök","Szombat"], idopontok: ["Reggel 8–10","Délelőtt 10–12"], leiras: "Országos bajnok powerlifter. Keresek komoly embert akivel duplázhatjuk az eredményeket.", avatar: "🔱", online: false },
  { id: 8, nev: "Molnár Eszter", kor: 22, megye: "Borsod-Abaúj-Zemplén", varos: "Miskolc", gym: "Apollo Fitness Miskolc", edzesTipus: ["Calisthenics","HIIT"], eroSzint: "Haladó (6–24 hónap)", napok: ["Hétfő","Szerda","Péntek","Vasárnap"], idopontok: ["Este 17–19","Este 19–21"], leiras: "Calisthenics és street workout rajongó. Szabadtéri edzéseket is szívesen tartok.", avatar: "🤸", online: true },
];

// ── Helper ────────────────────────────────────────────────────────────────────
function matchScore(a, b) {
  let score = 0;
  if (a.megye === b.megye) score += 3;
  if (a.varos === b.varos) score += 2;
  const tipusMatch = a.edzesTipus.filter(t => b.edzesTipus.includes(t)).length;
  score += tipusMatch * 2;
  const napMatch = a.napok.filter(n => b.napok.includes(n)).length;
  score += napMatch;
  const idoMatch = a.idopontok.filter(i => b.idopontok.includes(i)).length;
  score += idoMatch;
  return score;
}

const ERO_VALUE = { "Kezdő (0–6 hónap)": 1, "Haladó (6–24 hónap)": 2, "Tapasztalt (2–5 év)": 3, "Versenyző / Elite": 4 };

// ── Components ────────────────────────────────────────────────────────────────

function ProfileCard({ profile, highlight, aiNote, onClick }) {
  const eroVal = ERO_VALUE[profile.eroSzint] || 1;
  return (
    <div className={`profile-card ${highlight ? "ai-pick" : ""}`} onClick={() => onClick(profile)}>
      <div className="profile-card-header">
        <div className="flex items-center gap-2" style={{gap:"0.8rem"}}>
          <div className="avatar">{profile.avatar}</div>
          <div style={{flex:1}}>
            <div className="flex items-center gap-1" style={{gap:"0.5rem",justifyContent:"space-between"}}>
              <span style={{fontWeight:600}}>{profile.nev}</span>
              <span className="text-muted text-sm">{profile.kor} év</span>
            </div>
            <div className="text-sm text-muted">{profile.varos}, {profile.megye}</div>
            <div className="strength-bar"><div className="strength-fill" style={{width:`${eroVal*25}%`}} /></div>
          </div>
        </div>
        <div className="flex wrap gap-1 mt-1" style={{marginTop:"0.7rem",gap:"0.35rem",flexWrap:"wrap"}}>
          {profile.edzesTipus.map(t => <span key={t} className="tag active" style={{fontSize:"0.7rem"}}>{t}</span>)}
        </div>
      </div>
      <div className="profile-card-body">
        <div className="text-sm" style={{color:"#aaa", marginBottom:"0.6rem",lineHeight:1.5}}>{profile.leiras}</div>
        <div className="flex wrap" style={{gap:"0.3rem",flexWrap:"wrap"}}>
          {profile.napok.slice(0,3).map(n => <span key={n} className="tag" style={{fontSize:"0.68rem"}}>{n}</span>)}
          {profile.napok.length > 3 && <span className="tag" style={{fontSize:"0.68rem"}}>+{profile.napok.length-3}</span>}
        </div>
        {highlight && aiNote && (
          <div style={{marginTop:"0.8rem",padding:"0.6rem 0.8rem",background:"rgba(200,242,48,0.07)",borderRadius:8,border:"1px solid rgba(200,242,48,0.2)",fontSize:"0.78rem",color:"#c8f230",lineHeight:1.5}}>
            🤖 {aiNote}
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.8rem"}}>
          <span style={{display:"flex",alignItems:"center",gap:"0.3rem",fontSize:"0.75rem",color: profile.online ? "#4ade80" : "var(--muted)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background: profile.online ? "#4ade80" : "#444",display:"inline-block"}} />
            {profile.online ? "Online" : "Offline"}
          </span>
          <span className="text-sm text-muted">{profile.gym}</span>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ profile, onClose }) {
  if (!profile) return null;
  const eroVal = ERO_VALUE[profile.eroSzint] || 1;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2" style={{gap:"1rem",marginBottom:"1.5rem"}}>
          <div className="avatar lg">{profile.avatar}</div>
          <div>
            <div style={{fontFamily:"var(--font-display)",fontSize:"1.8rem",letterSpacing:1}}>{profile.nev}</div>
            <div className="text-muted">{profile.kor} éves · {profile.varos}, {profile.megye}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{marginLeft:"auto"}}>✕</button>
        </div>
        <div className="form-group">
          <span className="form-label">Edzőterem</span>
          <span style={{color:"#ccc"}}>{profile.gym}</span>
        </div>
        <div className="form-group">
          <span className="form-label">Erőszint</span>
          <div>
            <span style={{color:"#ccc"}}>{profile.eroSzint}</span>
            <div className="strength-bar" style={{marginTop:"0.4rem"}}><div className="strength-fill" style={{width:`${eroVal*25}%`}} /></div>
          </div>
        </div>
        <div className="form-group">
          <span className="form-label">Edzéstípus</span>
          <div className="flex wrap" style={{gap:"0.35rem",flexWrap:"wrap"}}>
            {profile.edzesTipus.map(t => <span key={t} className="tag active">{t}</span>)}
          </div>
        </div>
        <div className="form-group">
          <span className="form-label">Elérhető napok</span>
          <div className="flex wrap" style={{gap:"0.35rem",flexWrap:"wrap"}}>
            {profile.napok.map(n => <span key={n} className="tag">{n}</span>)}
          </div>
        </div>
        <div className="form-group">
          <span className="form-label">Időpontok</span>
          <div className="flex wrap" style={{gap:"0.35rem",flexWrap:"wrap"}}>
            {profile.idopontok.map(i => <span key={i} className="tag">{i}</span>)}
          </div>
        </div>
        <div className="form-group">
          <span className="form-label">Bemutatkozás</span>
          <span style={{color:"#ccc",lineHeight:1.6,fontSize:"0.9rem"}}>{profile.leiras}</span>
        </div>
        <div className="divider" />
        <div className="flex gap-2" style={{gap:"0.75rem"}}>
          <button className="btn btn-neon" style={{flex:1}}>💬 Üzenet küldése</button>
          <button className="btn btn-outline btn-sm">⭐ Mentés</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function GymBro() {
  const [tab, setTab] = useState("kereses");
  const [profiles, setProfiles] = useState(DEMO_PROFILES);
  const [dbLoading, setDbLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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
  const [myProfile, setMyProfile] = useState({
    nev: "", kor: "", megye: "", varos: "", gym: "",
    edzesTipus: [], eroSzint: "", napok: [], idopontok: [], leiras: ""
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const toggleArr = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  useEffect(() => {
    async function loadProfiles() {
      setDbLoading(true);
      try {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped = data.map(p => ({
            id: p.id, nev: p.nev, kor: p.kor, megye: p.megye, varos: p.varos,
            gym: p.gym, edzesTipus: p.edzes_tipus || [], eroSzint: p.ero_szint,
            napok: p.napok || [], idopontok: p.idopontok || [], leiras: p.leiras,
            avatar: "👤", online: p.online ?? true
          }));
          setProfiles([...mapped, ...DEMO_PROFILES]);
        }
      } catch(e) {}
      setDbLoading(false);
    }
    loadProfiles();
  }, []);

  // Filter logic
  const filtered = profiles.filter(p => {
    if (fMegye && p.megye !== fMegye) return false;
    if (fEdzTipus.length && !fEdzTipus.some(t => p.edzesTipus.includes(t))) return false;
    if (fEroSzint && p.eroSzint !== fEroSzint) return false;
    if (fNap && !p.napok.includes(fNap)) return false;
    if (fIdo && !p.idopontok.includes(fIdo)) return false;
    return true;
  });

  // AI recommendation
  async function runAI() {
    if (!myProfile.nev || myProfile.edzesTipus.length === 0) {
      alert("Töltsd ki a profilodat először (legalább névvel és edzéstípussal)!");
      setTab("profil");
      return;
    }
    setAiLoading(true);
    setAiResults([]);
    setAiSummary("");
    try {
      const prompt = `Te egy okos edzőpartner-ajánló vagy a GymBro alkalmazásban.

A felhasználó profilja:
- Név: ${myProfile.nev}
- Megye: ${myProfile.megye || "nem megadott"}
- Város: ${myProfile.varos || "nem megadott"}
- Edzéstípus: ${myProfile.edzesTipus.join(", ") || "nem megadott"}
- Erőszint: ${myProfile.eroSzint || "nem megadott"}
- Elérhető napok: ${myProfile.napok.join(", ") || "nem megadott"}
- Időpontok: ${myProfile.idopontok.join(", ") || "nem megadott"}
- Bemutatkozás: ${myProfile.leiras || "nincs"}

Potenciális edzőpartnerek:
${profiles.map((p,i) => `${i+1}. ${p.nev} | ${p.varos}, ${p.megye} | ${p.edzesTipus.join("/")} | ${p.eroSzint} | Napok: ${p.napok.join(",")} | "${p.leiras}"`).join("\n")}

Válaszolj CSAK JSON-ban, semmi más szöveg ne legyen! Formátum:
{
  "ajanlott_indexek": [1,2,3],
  "magyarazatok": {"1": "rövid indoklás magyarul", "2": "...", "3": "..."},
  "osszefoglalas": "2-3 mondat összefoglaló a keresésről magyarul"
}
Az indexek 1-alapúak, max 3 ajánlást adj.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const picks = (parsed.ajanlott_indexek || []).map(i => ({
        profile: profiles[i-1],
        note: parsed.magyarazatok?.[String(i)] || ""
      })).filter(x => x.profile);
      setAiResults(picks);
      setAiSummary(parsed.osszefoglalas || "");
    } catch(e) {
      setAiSummary("Hiba az AI ajánló betöltésekor. Ellenőrizd a kapcsolatot.");
    }
    setAiLoading(false);
  }

  async function saveProfile() {
    if (!myProfile.nev || !myProfile.megye || myProfile.edzesTipus.length === 0) {
      setSaveError("Kérlek töltsd ki a kötelező mezőket: Név, Megye, Edzéstípus");
      return;
    }
    setSaveError("");
    try {
      const { data, error } = await supabase.from("profiles").insert([{
        nev: myProfile.nev, kor: parseInt(myProfile.kor) || 25,
        megye: myProfile.megye, varos: myProfile.varos, gym: myProfile.gym,
        edzes_tipus: myProfile.edzesTipus, ero_szint: myProfile.eroSzint,
        napok: myProfile.napok, idopontok: myProfile.idopontok,
        leiras: myProfile.leiras, online: true
      }]).select().single();
      if (error) throw error;
      const newP = { ...myProfile, id: data.id, kor: parseInt(myProfile.kor)||25, avatar: "👤", online: true };
      setProfiles(prev => [newP, ...prev]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(e) {
      setSaveError("Hiba a mentés során: " + (e.message || "ismeretlen hiba"));
    }
  }

  return (
    <>
      <style>{FONTS}{STYLES}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo"><GymBroLogo /></div>
          <div className="nav-tabs">
            {[["kereses","🔍 Keresés"],["ai","🤖 AI Ajánló"],["profil","👤 Profilom"]].map(([k,l]) => (
              <button key={k} className={`nav-tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>
        </nav>

        <div className="main">

          {/* ── KERESÉS ── */}
          {tab === "kereses" && (
            <>
              <div className="hero">
                <div style={{display:"flex",justifyContent:"center",marginBottom:"0.5rem"}}>
                  <GymBroLogo large />
                </div>
                <div className="hero-sub">Találd meg a tökéletes edzőpartnered Magyarország-szerte</div>
              </div>

              <div className="filter-bar mb-3">
                <div className="filter-title">Szűrők</div>
                <div className="grid-2" style={{gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))"}}>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Megye</label>
                    <select className="form-select" value={fMegye} onChange={e=>setFMegye(e.target.value)}>
                      <option value="">Összes megye</option>
                      {MEGYEK.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Erőszint</label>
                    <select className="form-select" value={fEroSzint} onChange={e=>setFEroSzint(e.target.value)}>
                      <option value="">Bármely szint</option>
                      {ERO_SZINTEK.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Nap</label>
                    <select className="form-select" value={fNap} onChange={e=>setFNap(e.target.value)}>
                      <option value="">Bármely nap</option>
                      {NAPOK.map(n=><option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{marginBottom:0}}>
                    <label className="form-label">Időpont</label>
                    <select className="form-select" value={fIdo} onChange={e=>setFIdo(e.target.value)}>
                      <option value="">Bármely időpont</option>
                      {IDOPONTOK.map(i=><option key={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginTop:"1rem"}}>
                  <div className="form-label" style={{marginBottom:"0.5rem"}}>Edzéstípus</div>
                  <div className="flex wrap" style={{gap:"0.4rem",flexWrap:"wrap"}}>
                    {EDZES_TIPUSOK.map(t=>(
                      <span key={t} className={`tag clickable ${fEdzTipus.includes(t)?"active":""}`}
                        onClick={()=>setFEdzTipus(prev=>toggleArr(prev,t))}>{t}</span>
                    ))}
                  </div>
                </div>
                {(fMegye||fEroSzint||fNap||fIdo||fEdzTipus.length>0) && (
                  <button className="btn btn-ghost btn-sm" style={{marginTop:"0.75rem"}}
                    onClick={()=>{setFMegye("");setFEroSzint("");setFNap("");setFIdo("");setFEdzTipus([])}}>
                    ✕ Szűrők törlése
                  </button>
                )}
              </div>

              <div style={{marginBottom:"0.75rem",color:"var(--muted)",fontSize:"0.85rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
                {dbLoading && <span className="spinner" style={{width:14,height:14}} />}
                {filtered.length} edzőpartner található
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
                {filtered.map(p => <ProfileCard key={p.id} profile={p} onClick={setSelected} />)}
                {filtered.length === 0 && (
                  <div style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
                    <div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔍</div>
                    Nincs találat a szűrőkre. Próbálj tágabb feltételeket!
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── AI AJÁNLÓ ── */}
          {tab === "ai" && (
            <>
              <div style={{marginBottom:"1.5rem"}}>
                <h1 className="font-display" style={{fontSize:"2.2rem",letterSpacing:2,marginBottom:"0.4rem"}}>AI AJÁNLÓ</h1>
                <p className="text-muted">A Claude AI elemzi a profilodat és a legkompatibilisebb partnereket ajánlja</p>
              </div>

              <div className="ai-panel mb-3">
                <div className="ai-badge"><span className="pulse" />Claude AI</div>
                <p style={{color:"#bbb",fontSize:"0.9rem",lineHeight:1.6,marginBottom:"1rem"}}>
                  Az AI figyelembe veszi a helyszíned, edzéstípusod, erőszinted, és az elérhető időpontjaidat,
                  majd személyre szabott indoklással ajánl edzőpartnereket.
                </p>
                <button className="btn btn-neon" onClick={runAI} disabled={aiLoading}>
                  {aiLoading ? <><span className="spinner" style={{width:16,height:16}} /> Elemzés...</> : "🤖 Partnerek keresése AI-jal"}
                </button>
              </div>

              {aiSummary && (
                <div className="alert alert-success mb-2">{aiSummary}</div>
              )}

              {aiLoading && (
                <div className="card" style={{textAlign:"center",padding:"3rem"}}>
                  <div className="spinner" style={{margin:"0 auto 1rem",width:32,height:32}} />
                  <div className="text-muted">AI elemzi a profilokat...</div>
                </div>
              )}

              {aiResults.length > 0 && (
                <>
                  <div style={{marginBottom:"0.75rem",color:"var(--neon)",fontWeight:600,fontSize:"0.9rem"}}>
                    ⭐ AI által ajánlott partnerek
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
                    {aiResults.map(({profile,note}) => (
                      <ProfileCard key={profile.id} profile={profile} highlight aiNote={note} onClick={setSelected} />
                    ))}
                  </div>
                </>
              )}

              {!aiLoading && aiResults.length === 0 && !aiSummary && (
                <div className="card" style={{textAlign:"center",padding:"3rem",color:"var(--muted)"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🤖</div>
                  Töltsd ki a profilodat, majd kattints a gombra az AI ajánlóhoz!
                </div>
              )}
            </>
          )}

          {/* ── PROFIL ── */}
          {tab === "profil" && (
            <>
              <div style={{marginBottom:"1.5rem"}}>
                <h1 className="font-display" style={{fontSize:"2.2rem",letterSpacing:2,marginBottom:"0.4rem"}}>PROFILOM</h1>
                <p className="text-muted">Töltsd ki a profilt hogy mások megtalálhassanak és az AI ajánló működjön</p>
              </div>

              {saved && <div className="alert alert-success">✅ Profil mentve! Megjelentél a keresőben.</div>}
              {saveError && <div className="alert alert-error">{saveError}</div>}

              <div className="card">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Teljes név *</label>
                    <input className="form-input" placeholder="pl. Kovács Bence" value={myProfile.nev}
                      onChange={e=>setMyProfile(p=>({...p,nev:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kor</label>
                    <input className="form-input" type="number" placeholder="25" value={myProfile.kor}
                      onChange={e=>setMyProfile(p=>({...p,kor:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Megye *</label>
                    <select className="form-select" value={myProfile.megye}
                      onChange={e=>setMyProfile(p=>({...p,megye:e.target.value}))}>
                      <option value="">Válassz megyét</option>
                      {MEGYEK.map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Város</label>
                    <input className="form-input" placeholder="pl. Budapest" value={myProfile.varos}
                      onChange={e=>setMyProfile(p=>({...p,varos:e.target.value}))} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Edzőterem neve</label>
                  <input className="form-input" placeholder="pl. Gold's Gym XIII." value={myProfile.gym}
                    onChange={e=>setMyProfile(p=>({...p,gym:e.target.value}))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Erőszint</label>
                  <select className="form-select" value={myProfile.eroSzint}
                    onChange={e=>setMyProfile(p=>({...p,eroSzint:e.target.value}))}>
                    <option value="">Válassz szintet</option>
                    {ERO_SZINTEK.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Edzéstípus * (több is választható)</label>
                  <div className="flex wrap" style={{gap:"0.4rem",flexWrap:"wrap"}}>
                    {EDZES_TIPUSOK.map(t=>(
                      <span key={t} className={`tag clickable ${myProfile.edzesTipus.includes(t)?"active":""}`}
                        onClick={()=>setMyProfile(p=>({...p,edzesTipus:toggleArr(p.edzesTipus,t)}))}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Elérhető napok</label>
                  <div className="flex wrap" style={{gap:"0.4rem",flexWrap:"wrap"}}>
                    {NAPOK.map(n=>(
                      <span key={n} className={`tag clickable ${myProfile.napok.includes(n)?"active":""}`}
                        onClick={()=>setMyProfile(p=>({...p,napok:toggleArr(p.napok,n)}))}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Időpontok</label>
                  <div className="flex wrap" style={{gap:"0.4rem",flexWrap:"wrap"}}>
                    {IDOPONTOK.map(i=>(
                      <span key={i} className={`tag clickable ${myProfile.idopontok.includes(i)?"active":""}`}
                        onClick={()=>setMyProfile(p=>({...p,idopontok:toggleArr(p.idopontok,i)}))}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bemutatkozás</label>
                  <textarea className="form-textarea" placeholder="Mesélj magadról, céljaidról, mit keresel edzőpartnerben..."
                    value={myProfile.leiras} onChange={e=>setMyProfile(p=>({...p,leiras:e.target.value}))} />
                </div>

                <div className="divider" />
                <button className="btn btn-neon" onClick={saveProfile} style={{width:"100%",justifyContent:"center",padding:"0.8rem"}}>
                  💾 Profil mentése és megjelenítése
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {selected && <ProfileModal profile={selected} onClose={()=>setSelected(null)} />}
    </>
  );
}
<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GymBro – Edzőpartner kereső</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>
