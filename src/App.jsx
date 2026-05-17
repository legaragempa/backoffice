import { useState, useCallback } from "react";

// ============================================================
// GARAGE MPA — BACK OFFICE
// Gmail + ClickUp + Claude AI en temps réel
// ============================================================

// ---- COMPTES AUTORISÉS ----
const COMPTES = [
  // SUPER ADMIN — accès total + gestion utilisateurs
  { login:"hassan",   mdp:"hassan2026", nom:"Hassan Anoud",    role:"super_admin",  acces:["dashboard","emails","taches","analyse","paiements","sinistres"] },

  // ADMIN — accès complet
  { login:"mohamed",  mdp:"mpa2026",    nom:"Mohamed Abbou",   role:"admin",        acces:["dashboard","emails","taches","analyse","paiements","sinistres"] },

  // GESTION ADMINISTRATIVE — accès total
  { login:"maryam",   mdp:"maryam2026", nom:"Maryam Itoukyn",  role:"administratif",acces:["dashboard","emails","taches","analyse","paiements","sinistres"] },

  // ACCUEIL & VENTE — accès partiel
  { login:"hamza",    mdp:"hamza2026",  nom:"Hamza Abbou",     role:"accueil",      acces:["dashboard","taches","sinistres"] },

  // RESPONSABLE PIÈCES — accès tâches + sinistres
  { login:"rachid",   mdp:"rachid2026", nom:"Rachid Anoud",    role:"responsable",  acces:["dashboard","taches"] },

  // ASSISTANTE — accès limité
  { login:"manal",    mdp:"manal2026",  nom:"Manal",           role:"assistante",   acces:["dashboard","emails","taches"] },
];

// ---- PAGE LOGIN ----
function PageLogin({ onLogin }) {
  const [login, setLogin]   = useState("");
  const [mdp, setMdp]       = useState("");
  const [erreur, setErreur] = useState("");
  const [voir, setVoir]     = useState(false);

  const connexion = () => {
    const compte = COMPTES.find(c => c.login === login.toLowerCase().trim() && c.mdp === mdp);
    if (compte) { onLogin(compte); }
    else { setErreur("Identifiants incorrects"); setTimeout(()=>setErreur(""),3000); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400, padding:24 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg,#FF6B35,#F59E0B)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 14px" }}>⚙️</div>
          <div style={{ fontWeight:800, fontSize:22, color:"#fff" }}>GARAGE MPA</div>
          <div style={{ fontSize:13, color:"#4B5563", marginTop:4 }}>Back Office — Accès sécurisé</div>
        </div>

        <div style={{ background:"#141414", border:"1px solid #1F2937", borderRadius:18, padding:28 }}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#6B7280", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Identifiant</label>
            <input value={login} onChange={e=>setLogin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&connexion()}
              placeholder="maryam, mohamed..."
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #2A2A2A", borderRadius:10, fontSize:14, background:"#1F1F1F", color:"#fff", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:600, color:"#6B7280", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Mot de passe</label>
            <div style={{ position:"relative" }}>
              <input value={mdp} onChange={e=>setMdp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&connexion()}
                type={voir?"text":"password"} placeholder="••••••••"
                style={{ width:"100%", padding:"13px 48px 13px 16px", border:"1.5px solid #2A2A2A", borderRadius:10, fontSize:14, background:"#1F1F1F", color:"#fff", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
              <button onClick={()=>setVoir(!voir)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#4B5563", cursor:"pointer", fontSize:16 }}>
                {voir?"🙈":"👁️"}
              </button>
            </div>
          </div>

          {erreur && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13, color:"#DC2626", textAlign:"center" }}>⚠️ {erreur}</div>}

          <button onClick={connexion}
            style={{ width:"100%", background:"linear-gradient(135deg,#FF6B35,#F59E0B)", color:"#fff", border:"none", borderRadius:11, padding:"14px", fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
            🔐 Se connecter
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:11, color:"#374151" }}>
          Accès réservé au personnel autorisé du Garage MPA
        </div>
      </div>
    </div>
  );
}

const MCP_SERVERS = [
  { type: "url", url: "https://gmailmcp.googleapis.com/mcp/v1", name: "gmail-mcp" },
  { type: "url", url: "https://mcp.clickup.com/mcp", name: "clickup-mcp" },
];

const CLICKUP_LISTS = {
  "🚗 Expertises & Véhicules":   "901218078131",
  "👥 RH & Congés":               "901218078132",
  "📅 RDV & Réunions":            "901218078135",
  "⚖️ Juridique & Litiges":       "901218078139",
  "📦 Commandes & Fournisseurs":  "901218078140",
  "💰 Finance & Paiements":       "901218078141",
};

const MODULES = [
  { id: "dashboard",  icon: "⚡", label: "Vue d'ensemble"      },
  { id: "emails",     icon: "📧", label: "Emails Gmail"        },
  { id: "taches",     icon: "✅", label: "Tâches ClickUp"      },
  { id: "analyse",    icon: "🤖", label: "Analyse IA"          },
  { id: "paiements",  icon: "💳", label: "Paiements"           },
  { id: "sinistres",  icon: "🚗", label: "Sinistres"           },
];

// ---- STYLES ----
const S = {
  card: { background:"#fff", border:"1px solid #E5E7EB", borderRadius:14, padding:20 },
  btn:  (bg="#0A0A0A", c="#fff") => ({ background:bg, color:c, border:"none", borderRadius:9, padding:"9px 18px", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", gap:8 }),
};

function Spinner({ size=20, color="#fff" }) {
  return <div style={{ width:size, height:size, border:`2px solid rgba(255,255,255,0.3)`, borderTopColor:color, borderRadius:"50%", animation:"spin 0.7s linear infinite", flexShrink:0 }}/>;
}

function Badge({ s }) {
  const cfg = {
    urgent:      { bg:"#FEE2E2", text:"#991B1B", label:"🔴 Urgent"      },
    high:        { bg:"#FEF3C7", text:"#92400E", label:"🟡 Élevé"       },
    normal:      { bg:"#DBEAFE", text:"#1E40AF", label:"⚪ Normal"      },
    low:         { bg:"#F3F4F6", text:"#374151", label:"🔵 Bas"         },
    todo:        { bg:"#EDE9FE", text:"#5B21B6", label:"À faire"        },
    en_cours:    { bg:"#DBEAFE", text:"#1E40AF", label:"En cours"       },
    done:        { bg:"#D1FAE5", text:"#065F46", label:"Terminé ✓"      },
    à_contrôler: { bg:"#FEF3C7", text:"#92400E", label:"À contrôler 👁️" },
    à_payer:     { bg:"#DBEAFE", text:"#1E40AF", label:"À payer"        },
    payé:        { bg:"#D1FAE5", text:"#065F46", label:"Payé ✓"         },
  };
  const c = cfg[s] || { bg:"#F3F4F6", text:"#374151", label:s };
  return <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:c.bg, color:c.text, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
    {c.label}
  </span>;
}

// ============================================================
// HOOK CLAUDE API
// ============================================================
function useClaudeAPI() {
  const callClaude = useCallback(async (prompt, system="", useMCP=true) => {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: system || "Tu es l'assistant du Garage MPA. Réponds uniquement en JSON valide, sans backticks.",
      messages: [{ role:"user", content:prompt }],
    };
    if (useMCP) body.mcp_servers = MCP_SERVERS;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.content?.filter(b=>b.type==="text").map(b=>b.text).join("") || "";
  }, []);
  return { callClaude };
}

function parseJSON(raw) {
  try {
    const clean = raw.replace(/```json|```/g,"").trim();
    const match = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return JSON.parse(match ? match[0] : clean);
  } catch { return null; }
}

// ============================================================
// MODULE : DASHBOARD
// ============================================================
function Dashboard({ callClaude, stats, setStats }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyser = async () => {
    setLoading(true); setError("");
    try {
      const raw = await callClaude(
        `Utilise Gmail MCP et ClickUp MCP pour faire un résumé complet du Garage MPA.
1. Compte les emails non lus dans Gmail (legaragempa@gmail.com)
2. Compte les tâches urgentes dans ClickUp workspace 90121717051
3. Identifie les 3 actions prioritaires du moment

Retourne ce JSON exact :
{
  "emails_non_lus": 0,
  "taches_urgentes": 0,
  "taches_total": 0,
  "paiements_attente": 0,
  "actions": ["action 1", "action 2", "action 3"],
  "alertes": ["alerte 1", "alerte 2"]
}`,
        "Tu es l'assistant Garage MPA. Utilise les outils MCP Gmail et ClickUp disponibles. JSON uniquement.",
        true
      );
      const parsed = parseJSON(raw);
      if (parsed) setStats(parsed);
      else setError("Impossible d'analyser la réponse.");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0A0A0A,#1F2937)", borderRadius:18, padding:"26px 30px", marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontWeight:800, fontSize:20, color:"#fff" }}>⚡ Back Office — Garage MPA</div>
          <div style={{ fontSize:13, color:"#6B7280", marginTop:6 }}>Gmail + ClickUp + Claude AI • Temps réel</div>
        </div>
        <button onClick={analyser} disabled={loading} style={S.btn()}>
          {loading ? <Spinner size={16}/> : "🔄"}
          {loading ? "Analyse..." : "Analyser maintenant"}
        </button>
      </div>

      {error && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#DC2626" }}>⚠️ {error}</div>}

      {!stats && !loading && (
        <div style={{ ...S.card, textAlign:"center", padding:48 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🤖</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>Prêt à analyser</div>
          <div style={{ fontSize:13, color:"#6B7280", marginBottom:20 }}>Claude va lire Gmail et ClickUp en temps réel</div>
          <button onClick={analyser} style={{ ...S.btn("#FF6B35"), margin:"0 auto" }}>
            🚀 Lancer l'analyse
          </button>
        </div>
      )}

      {loading && (
        <div style={{ ...S.card, textAlign:"center", padding:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:12 }}>
            <Spinner size={28} color="#0A0A0A"/>
            <span style={{ fontSize:15, fontWeight:600 }}>Claude analyse Gmail + ClickUp...</span>
          </div>
          <p style={{ fontSize:13, color:"#9CA3AF" }}>Lecture des emails · Tâches ClickUp · Priorisation</p>
        </div>
      )}

      {stats && !loading && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
            {[
              { label:"Emails non lus",    val:stats.emails_non_lus,   color:"#F59E0B", bg:"#FFFBEB",  icon:"📧" },
              { label:"Tâches urgentes",   val:stats.taches_urgentes,  color:"#EF4444", bg:"#FEF2F2",  icon:"🔴" },
              { label:"Total tâches",      val:stats.taches_total,     color:"#3B82F6", bg:"#EFF6FF",  icon:"✅" },
              { label:"Paiements attente", val:stats.paiements_attente||0, color:"#8B5CF6", bg:"#F5F3FF", icon:"💳" },
            ].map((k,i) => (
              <div key={i} style={{ background:k.bg, border:`1.5px solid ${k.color}25`, borderRadius:13, padding:"16px 18px" }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{k.icon}</div>
                <div style={{ fontSize:28, fontWeight:800, color:k.color }}>{k.val}</div>
                <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={S.card}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>🎯 Actions prioritaires</div>
              {(stats.actions||[]).map((a,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background: i===0?"#FEF2F2":i===1?"#FFFBEB":"#F0FDF4", borderRadius:10, marginBottom:8 }}>
                  <span style={{ fontWeight:800, fontSize:16, color:i===0?"#EF4444":i===1?"#F59E0B":"#10B981" }}>{i+1}</span>
                  <span style={{ fontSize:13, color:"#374151" }}>{a}</span>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>🔔 Alertes</div>
              {(stats.alertes||[]).map((a,i) => (
                <div key={i} style={{ padding:"10px 14px", background:"#FEF9C3", borderLeft:"3px solid #F59E0B", borderRadius:9, marginBottom:8, fontSize:13 }}>
                  {a}
                </div>
              ))}
              {(!stats.alertes||stats.alertes.length===0) && (
                <div style={{ color:"#9CA3AF", fontSize:13 }}>Aucune alerte ✓</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Statut connexions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:20 }}>
        {[
          { nom:"Gmail MCP",      desc:"legaragempa@gmail.com",   icon:"📧", color:"#EA4335" },
          { nom:"ClickUp MCP",    desc:"Workspace 90121717051",   icon:"✅", color:"#5f55ee" },
          { nom:"Make Automation",desc:"Toutes les 15 minutes",   icon:"⚙️", color:"#FF6D00" },
        ].map((c,i) => (
          <div key={i} style={{ ...S.card, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:22 }}>{c.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{c.nom}</div>
              <div style={{ fontSize:11, color:"#9CA3AF" }}>{c.desc}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#10B981", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, color:"#10B981", fontWeight:600 }}>Actif</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODULE : EMAILS GMAIL
// ============================================================
function Emails({ callClaude }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(null);
  const [done, setDone] = useState([]);
  const [error, setError] = useState("");

  const fetchEmails = async () => {
    setLoading(true); setError("");
    try {
      const raw = await callClaude(
        `Utilise Gmail MCP pour récupérer les 15 derniers emails non lus de legaragempa@gmail.com.
Retourne ce JSON :
{
  "emails": [
    {
      "id": "id_unique",
      "sujet": "sujet email",
      "expediteur": "nom ou email",
      "date": "date courte",
      "extrait": "résumé 1 phrase",
      "priorite": "urgent|high|normal|low",
      "categorie": "RH|Expertise|RDV|Juridique|Paiement|Autre",
      "action_requise": true
    }
  ]
}`,
        "Assistant Garage MPA. Utilise Gmail MCP. JSON uniquement.", true
      );
      const parsed = parseJSON(raw);
      if (parsed?.emails) setEmails(parsed.emails);
      else setError("Connexion Gmail nécessaire — vérifie les connecteurs MCP.");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const creerTache = async (email) => {
    setCreating(email.id);
    const listMap = { RH:CLICKUP_LISTS["👥 RH & Congés"], Expertise:CLICKUP_LISTS["🚗 Expertises & Véhicules"], RDV:CLICKUP_LISTS["📅 RDV & Réunions"], Juridique:CLICKUP_LISTS["⚖️ Juridique & Litiges"], Paiement:CLICKUP_LISTS["💰 Finance & Paiements"], Autre:CLICKUP_LISTS["📅 RDV & Réunions"] };
    const listId = listMap[email.categorie] || CLICKUP_LISTS["📅 RDV & Réunions"];
    try {
      await callClaude(
        `Utilise ClickUp MCP pour créer une tâche dans la liste ${listId} du workspace 90121717051.
Titre: "${email.sujet}"
Description: "📧 De: ${email.expediteur}\n\n${email.extrait}\n\n## Actions\n- [ ] Traiter\n- [ ] Répondre si nécessaire"
Priorité: ${email.priorite}`,
        "Utilise ClickUp MCP. Confirme la création.", true
      );
      setDone(d => [...d, email.id]);
    } catch(e) { setError(e.message); }
    setCreating(null);
  };

  const catColors = { RH:"#8B5CF6", Expertise:"#F59E0B", RDV:"#3B82F6", Juridique:"#EF4444", Paiement:"#10B981", Autre:"#9CA3AF" };
  const catIcons  = { RH:"👥", Expertise:"🚗", RDV:"📅", Juridique:"⚖️", Paiement:"💰", Autre:"📧" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800 }}>📧 Emails Gmail — Temps réel</h2>
          <p style={{ fontSize:13, color:"#6B7280", marginTop:4 }}>Lecture directe via Gmail MCP</p>
        </div>
        <button onClick={fetchEmails} disabled={loading} style={S.btn()}>
          {loading ? <Spinner size={16}/> : "🔄"}
          {loading ? "Chargement..." : "Rafraîchir Gmail"}
        </button>
      </div>

      {error && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#DC2626" }}>⚠️ {error}</div>}

      {!loading && emails.length===0 && !error && (
        <div style={{ ...S.card, textAlign:"center", padding:48 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <div style={{ fontWeight:700, fontSize:15 }}>Clique sur "Rafraîchir Gmail"</div>
          <div style={{ fontSize:13, color:"#9CA3AF", marginTop:6 }}>Claude va lire tes emails non lus via Gmail MCP</div>
        </div>
      )}

      {loading && (
        <div style={{ ...S.card, textAlign:"center", padding:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <Spinner size={24} color="#0A0A0A"/>
            <span style={{ fontSize:14, fontWeight:600 }}>Lecture des emails Gmail en cours...</span>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {emails.map(email => (
          <div key={email.id} style={{ ...S.card, display:"flex", alignItems:"center", gap:14, opacity:done.includes(email.id)?0.6:1, border:done.includes(email.id)?"1.5px solid #10B981":"1px solid #E5E7EB" }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`${catColors[email.categorie]}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
              {catIcons[email.categorie]||"📧"}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                <span style={{ fontWeight:800, fontSize:14 }}>{email.sujet||"Sans objet"}</span>
                <Badge s={email.priorite}/>
                <span style={{ fontSize:11, background:`${catColors[email.categorie]}20`, color:catColors[email.categorie]||"#9CA3AF", padding:"2px 8px", borderRadius:6, fontWeight:600 }}>{email.categorie}</span>
              </div>
              <div style={{ fontSize:12, color:"#6B7280" }}><strong>{email.expediteur}</strong> · {email.date}</div>
              <div style={{ fontSize:13, color:"#374151", marginTop:4 }}>{email.extrait}</div>
            </div>
            <div style={{ flexShrink:0 }}>
              {done.includes(email.id) ? (
                <span style={{ fontSize:13, color:"#10B981", fontWeight:700 }}>✓ Tâche créée</span>
              ) : email.action_requise ? (
                <button onClick={()=>creerTache(email)} disabled={creating===email.id}
                  style={{ ...S.btn("#5f55ee"), fontSize:12, padding:"7px 14px" }}>
                  {creating===email.id ? <Spinner size={13}/> : "➕"}
                  {creating===email.id ? "Création..." : "→ ClickUp"}
                </button>
              ) : (
                <span style={{ fontSize:12, color:"#9CA3AF" }}>Aucune action</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODULE : TÂCHES CLICKUP
// ============================================================
function Taches({ callClaude }) {
  const [taches, setTaches] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeList, setActiveList] = useState("rh");
  const [error, setError] = useState("");

  const listConfig = {
    expertises: { label:"🚗 Expertises", id:CLICKUP_LISTS["🚗 Expertises & Véhicules"] },
    rh:         { label:"👥 RH & Congés", id:CLICKUP_LISTS["👥 RH & Congés"] },
    rdv:        { label:"📅 RDV",         id:CLICKUP_LISTS["📅 RDV & Réunions"] },
    juridique:  { label:"⚖️ Juridique",  id:CLICKUP_LISTS["⚖️ Juridique & Litiges"] },
    commandes:  { label:"📦 Commandes",   id:CLICKUP_LISTS["📦 Commandes & Fournisseurs"] },
    finance:    { label:"💰 Finance",     id:CLICKUP_LISTS["💰 Finance & Paiements"] },
  };

  const fetchTaches = async (key) => {
    setLoading(true); setError("");
    const listId = listConfig[key].id;
    try {
      const raw = await callClaude(
        `Utilise ClickUp MCP pour récupérer les tâches de la liste ${listId} workspace 90121717051.
Retourne :
{
  "tasks": [
    { "id":"id", "nom":"nom tâche", "statut":"open|in_progress|done", "priorite":"urgent|high|normal|low", "date":"date courte", "description":"résumé court" }
  ]
}`,
        "Assistant Garage MPA. Utilise ClickUp MCP. JSON uniquement.", true
      );
      const parsed = parseJSON(raw);
      if (parsed?.tasks) setTaches(t => ({ ...t, [key]:parsed.tasks }));
      else setError("Connexion ClickUp nécessaire.");
    } catch(e) { setError(e.message); }
    setLoading(false);
  };

  const handleTab = (key) => { setActiveList(key); if (!taches[key]) fetchTaches(key); };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800 }}>✅ Tâches ClickUp — Live</h2>
          <p style={{ fontSize:13, color:"#6B7280", marginTop:4 }}>Données en direct via ClickUp MCP</p>
        </div>
        <button onClick={()=>fetchTaches(activeList)} disabled={loading} style={S.btn("#5f55ee")}>
          {loading ? <Spinner size={16}/> : "🔄"}
          {loading ? "Chargement..." : "Rafraîchir"}
        </button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {Object.entries(listConfig).map(([key, val]) => (
          <button key={key} onClick={()=>handleTab(key)}
            style={{ background:activeList===key?"#0A0A0A":"#fff", color:activeList===key?"#fff":"#374151", border:activeList===key?"none":"1px solid #E5E7EB", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            {val.label}
            {taches[key] && <span style={{ marginLeft:6, background:activeList===key?"#333":"#F3F4F6", padding:"1px 6px", borderRadius:10, fontSize:11 }}>{taches[key].length}</span>}
          </button>
        ))}
      </div>

      {error && <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#DC2626" }}>⚠️ {error}</div>}

      {loading && (
        <div style={{ ...S.card, textAlign:"center", padding:48 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <Spinner size={24} color="#5f55ee"/>
            <span style={{ fontSize:14, fontWeight:600 }}>Chargement ClickUp...</span>
          </div>
        </div>
      )}

      {!loading && (!taches[activeList] || taches[activeList].length===0) && !error && (
        <div style={{ ...S.card, textAlign:"center", padding:48 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>📋</div>
          <div style={{ fontWeight:700, fontSize:15 }}>Aucune tâche</div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {(taches[activeList]||[]).map((t,i) => (
          <div key={t.id||i} style={{ ...S.card, display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${t.statut==="done"?"#10B981":"#D1D5DB"}`, background:t.statut==="done"?"#10B981":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
              {t.statut==="done" && <span style={{ color:"#fff", fontSize:10 }}>✓</span>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14, color:t.statut==="done"?"#9CA3AF":"#0A0A0A", textDecoration:t.statut==="done"?"line-through":"none", marginBottom:4 }}>{t.nom}</div>
              {t.description && <div style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>{t.description}</div>}
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <Badge s={t.priorite||"normal"}/>
                <span style={{ fontSize:11, color:"#9CA3AF" }}>{t.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODULE : ANALYSE IA
// ============================================================
function AnalyseIA({ callClaude }) {
  const [question, setQuestion] = useState("");
  const [reponse, setReponse] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    "Quels emails nécessitent une action urgente aujourd'hui ?",
    "Résume les dossiers sinistres en cours",
    "Quelles tâches RH sont en attente de validation ?",
    "Y a-t-il des paiements en retard ?",
    "Quel est l'état des congés de l'équipe ?",
  ];

  const poser = async (q) => {
    const q2 = q || question;
    if (!q2) return;
    setLoading(true); setReponse("");
    try {
      const raw = await callClaude(
        `${q2}\n\nUtilise Gmail MCP et ClickUp MCP pour répondre avec des données réelles du Garage MPA. Réponds en français, de manière claire et structurée.`,
        "Tu es l'assistant du Garage MPA. Utilise les outils MCP pour donner des réponses basées sur les vraies données. Sois concis et pratique.",
        true
      );
      setReponse(raw);
    } catch(e) { setReponse("Erreur : " + e.message); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h2 style={{ fontSize:20, fontWeight:800 }}>🤖 Analyse IA — Questions sur vos données</h2>
        <p style={{ fontSize:13, color:"#6B7280", marginTop:4 }}>Posez n'importe quelle question — Claude répond avec vos vraies données Gmail + ClickUp</p>
      </div>

      {/* Questions rapides */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#6B7280", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Questions rapides</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {questions.map((q,i) => (
            <button key={i} onClick={()=>poser(q)}
              style={{ background:"#F3F4F6", color:"#374151", border:"1px solid #E5E7EB", borderRadius:8, padding:"7px 12px", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Question libre */}
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <input value={question} onChange={e=>setQuestion(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&poser()}
          placeholder="Posez votre question..."
          style={{ flex:1, padding:"12px 16px", border:"1.5px solid #E5E7EB", borderRadius:10, fontSize:13, outline:"none", fontFamily:"inherit" }}/>
        <button onClick={()=>poser()} disabled={loading||!question} style={S.btn()}>
          {loading ? <Spinner size={16}/> : "→"}
          {loading ? "Analyse..." : "Envoyer"}
        </button>
      </div>

      {/* Réponse */}
      {loading && (
        <div style={{ ...S.card, textAlign:"center", padding:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <Spinner size={24} color="#0A0A0A"/>
            <span style={{ fontSize:14, fontWeight:600 }}>Claude analyse vos données...</span>
          </div>
        </div>
      )}

      {reponse && !loading && (
        <div style={{ ...S.card, background:"#F9FAFB" }}>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:12, color:"#374151" }}>🤖 Réponse Claude</div>
          <div style={{ fontSize:14, color:"#0A0A0A", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{reponse}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MODULE : PAIEMENTS
// ============================================================
function Paiements() {
  const paiements = [
    { id:1, ref:"FACT-F-001", fournisseur:"Tesla EPC",       montant:3200, statut:"à_contrôler", echeance:"2026-05-23", urgence:"high" },
    { id:2, ref:"FACT-F-002", fournisseur:"Autodistribution",montant:480,  statut:"à_contrôler", echeance:"2026-05-30", urgence:"normal" },
    { id:3, ref:"FACT-F-003", fournisseur:"TOP BYD",         montant:280,  statut:"payé",         echeance:"2026-05-28", urgence:"normal" },
    { id:4, ref:"FACT-F-004", fournisseur:"Amazon Pro",      montant:96,   statut:"à_payer",      echeance:"2026-05-21", urgence:"urgent" },
  ];
  const [state, setState] = useState(paiements);

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:800, marginBottom:22 }}>💳 Paiements Fournisseurs</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"À contrôler", val:state.filter(p=>p.statut==="à_contrôler").length, color:"#F59E0B", bg:"#FFFBEB" },
          { label:"À payer",     val:state.filter(p=>p.statut==="à_payer").length,     color:"#3B82F6", bg:"#EFF6FF" },
          { label:"Payés",       val:state.filter(p=>p.statut==="payé").length,        color:"#10B981", bg:"#F0FDF4" },
        ].map((k,i) => (
          <div key={i} style={{ background:k.bg, border:`1px solid ${k.color}25`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:24, fontWeight:800, color:k.color }}>{k.val}</div>
            <div style={{ fontSize:12, color:"#6B7280", marginTop:3 }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {state.map(p => (
          <div key={p.id} style={{ ...S.card, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontWeight:800, fontSize:14 }}>{p.fournisseur}</span>
                <Badge s={p.statut}/>
                <Badge s={p.urgence}/>
              </div>
              <div style={{ fontSize:12, color:"#6B7280" }}>{p.ref} · Échéance {p.echeance}</div>
            </div>
            <div style={{ fontWeight:800, fontSize:20 }}>{p.montant.toLocaleString()} €</div>
            {p.statut !== "payé" && (
              <div style={{ display:"flex", gap:6 }}>
                {p.statut==="à_contrôler" && (
                  <button onClick={()=>setState(state.map(x=>x.id===p.id?{...x,statut:"à_payer"}:x))}
                    style={{ background:"#D1FAE5", color:"#065F46", border:"none", borderRadius:7, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>✓ Valider</button>
                )}
                {p.statut==="à_payer" && (
                  <button onClick={()=>setState(state.map(x=>x.id===p.id?{...x,statut:"payé"}:x))}
                    style={{ background:"#DBEAFE", color:"#1E40AF", border:"none", borderRadius:7, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>💳 Payer</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODULE : SINISTRES
// ============================================================
function Sinistres() {
  const [dossiers, setDossiers] = useState([
    { id:1, ref:"SIN-2026-041", client:"Taxi Paris",  vehicule:"Tesla Model 3",  type:"Expertise", statut:"en_cours",   assurance:"AXA",    montant:3200, date:"2026-05-16", notes:"Mise en demeure" },
    { id:2, ref:"SIN-2026-040", client:"VTC Diallo",  vehicule:"Toyota Prius",   type:"Casse",     statut:"en_attente", assurance:"MAIF",   montant:1800, date:"2026-05-14", notes:"" },
    { id:3, ref:"SIN-2026-039", client:"Taxi Lyon",   vehicule:"BYD Seal 2024",  type:"Préfecture",statut:"done",       assurance:"Allianz",montant:650,  date:"2026-05-10", notes:"Clôturé" },
  ]);

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:800, marginBottom:22 }}>🚗 Dossiers Sinistres & Assurances</h2>
      <div style={{ ...S.card, padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#FEF3C7" }}>
            {["Réf.","Client","Véhicule","Type","Assurance","Montant","Statut","Action"].map(h=>(
              <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:"#92400E", textTransform:"uppercase" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {dossiers.map(d=>(
              <tr key={d.id} style={{ borderTop:"1px solid #F3F4F6" }}>
                <td style={{ padding:"11px 14px" }}><code style={{ fontSize:11, color:"#6B7280" }}>{d.ref}</code></td>
                <td style={{ padding:"11px 14px" }}><span style={{ fontWeight:600, fontSize:13 }}>{d.client}</span></td>
                <td style={{ padding:"11px 14px" }}><span style={{ fontSize:12 }}>{d.vehicule}</span></td>
                <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, background:"#FEF3C7", color:"#92400E", padding:"2px 8px", borderRadius:6, fontWeight:600 }}>{d.type}</span></td>
                <td style={{ padding:"11px 14px" }}><span style={{ fontSize:12 }}>{d.assurance}</span></td>
                <td style={{ padding:"11px 14px" }}><span style={{ fontWeight:800 }}>{d.montant.toLocaleString()} €</span></td>
                <td style={{ padding:"11px 14px" }}><Badge s={d.statut}/></td>
                <td style={{ padding:"11px 14px" }}>
                  {d.statut==="en_attente" && <button onClick={()=>setDossiers(dossiers.map(x=>x.id===d.id?{...x,statut:"en_cours"}:x))} style={{ background:"#DBEAFE", color:"#1E40AF", border:"none", borderRadius:6, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>▶</button>}
                  {d.statut==="en_cours"   && <button onClick={()=>setDossiers(dossiers.map(x=>x.id===d.id?{...x,statut:"done"}:x))}     style={{ background:"#D1FAE5", color:"#065F46", border:"none", borderRadius:6, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>✓</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// APP PRINCIPALE
// ============================================================
export default function App() {
  const [user, setUser]     = useState(null);
  const [active, setActive] = useState("dashboard");
  const [stats, setStats]   = useState(null);
  const { callClaude }      = useClaudeAPI();

  // Modules filtrés selon les droits
  const modulesAccessibles = MODULES.filter(m => user?.acces?.includes(m.id));

  const renderModule = () => {
    if (!user?.acces?.includes(active)) return (
      <div style={{ textAlign:"center", padding:60 }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
        <div style={{ fontWeight:700, fontSize:16 }}>Accès non autorisé</div>
      </div>
    );
    switch(active) {
      case "dashboard": return <Dashboard callClaude={callClaude} stats={stats} setStats={setStats}/>;
      case "emails":    return <Emails callClaude={callClaude}/>;
      case "taches":    return <Taches callClaude={callClaude}/>;
      case "analyse":   return <AnalyseIA callClaude={callClaude}/>;
      case "paiements": return <Paiements/>;
      case "sinistres": return <Sinistres/>;
      default:          return <Dashboard callClaude={callClaude} stats={stats} setStats={setStats}/>;
    }
  };

  if (!user) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <PageLogin onLogin={u => { setUser(u); setActive(u.acces[0]); }}/>
    </>
  );

  const roleColors = { super_admin:"#EF4444", admin:"#FF6B35", administratif:"#8B5CF6", accueil:"#3B82F6", responsable:"#10B981", assistante:"#F59E0B" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:#F4F6F9;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        button:hover{opacity:0.9}
      `}</style>
      <div style={{ display:"flex", height:"100vh" }}>

        {/* SIDEBAR */}
        <div style={{ width:220, background:"#0A0A0A", display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid #1A1A1A" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:"#fff" }}>⚙️ GARAGE MPA</div>
            <div style={{ fontSize:11, color:"#4B5563", marginTop:3 }}>Back Office</div>
          </div>

          {/* Profil utilisateur */}
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #1A1A1A", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:roleColors[user.role]||"#FF6B35", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14, flexShrink:0 }}>
              {user.nom[0]}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.nom}</div>
              <div style={{ fontSize:10, color:"#4B5563", textTransform:"capitalize" }}>{user.role}</div>
            </div>
            <button onClick={()=>setUser(null)} title="Déconnexion"
              style={{ background:"none", border:"none", color:"#4B5563", cursor:"pointer", fontSize:14, padding:4 }}>🚪</button>
          </div>

          <nav style={{ flex:1, padding:"10px 8px" }}>
            {modulesAccessibles.map(m => (
              <button key={m.id} onClick={()=>setActive(m.id)} style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", marginBottom:2,
                background:active===m.id?"#1A1A1A":"transparent",
                color:active===m.id?"#fff":"#6B7280",
                border:"none", borderRadius:8, cursor:"pointer", fontSize:13,
                fontWeight:active===m.id?700:400, textAlign:"left", fontFamily:"inherit",
              }}>
                <span>{m.icon}</span><span style={{ flex:1 }}>{m.label}</span>
                {(m.id==="emails"||m.id==="taches") && (
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#10B981", animation:"pulse 2s infinite" }}/>
                )}
              </button>
            ))}
          </nav>
          <div style={{ padding:"14px 16px", borderTop:"1px solid #1A1A1A" }}>
            <div style={{ fontSize:11, color:"#374151", fontWeight:700, marginBottom:8 }}>Connexions</div>
            {[["📧","Gmail MCP"],["✅","ClickUp MCP"],["⚙️","Make·15min"]].map(([ic,lb]) => (
              <div key={lb} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <span style={{ fontSize:11 }}>{ic}</span>
                <span style={{ fontSize:11, color:"#4B5563" }}>{lb}</span>
                <div style={{ width:5, height:5, borderRadius:"50%", background:"#10B981", marginLeft:"auto" }}/>
              </div>
            ))}
          </div>
        </div>

        {/* CONTENU */}
        <div style={{ flex:1, overflow:"auto" }}>
          <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"13px 26px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:10 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>
              {MODULES.find(m=>m.id===active)?.icon} {MODULES.find(m=>m.id===active)?.label}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#6B7280", background:"#F3F4F6", padding:"5px 12px", borderRadius:8 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#10B981", animation:"pulse 2s infinite" }}/>
              Gmail + ClickUp Live
            </div>
          </div>
          <div style={{ padding:26 }}>{renderModule()}</div>
        </div>
      </div>
    </>
  );
}
