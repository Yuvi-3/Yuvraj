"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchNews, addNews, deleteNews, type NewsItem,
  fetchBlogs, addBlog, deleteBlog, type BlogItem,
  fetchPublications, addPublication, deletePublication, type PublicationItem,
  fetchExperiences, addExperience, deleteExperience, type ExperienceItem,
  fetchTeaching, addTeaching, deleteTeaching, type TeachingItem,
  fetchTalks, addTalk, deleteTalk, type TalkItem,
} from "@/lib/firebase";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

type Tab = "news" | "blog" | "publications" | "experiences" | "teaching" | "talks";

const TABS: { key: Tab; label: string }[] = [
  { key: "news", label: "News" },
  { key: "blog", label: "Blog" },
  { key: "publications", label: "Publications" },
  { key: "experiences", label: "Experiences" },
  { key: "teaching", label: "Teaching" },
  { key: "talks", label: "Talks" },
];

/* ── Design tokens (matched to site design system) ── */
const S = {
  bg: "#ffffff",
  white: "#ffffff",
  border: "#e0e0e0",
  borderFocus: "#b833ff",
  text: "#333333",
  textSec: "#666666",
  textMut: "#999999",
  accent: "#b833ff",
  accentHover: "#a028e0",
  danger: "#e74c3c",
  dangerBg: "#fdf2f2",
  dangerBorder: "#f0c4c4",
  success: "#27ae60",
  successBg: "#f0faf4",
  successBorder: "#b8e6cc",
  radius: "6px",
  inputH: "38px",
  fontStack: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ── Reusable styled components ── */
function Input({ label, value, onChange, placeholder, type = "text", rows, required, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; rows?: number; required?: boolean; hint?: string;
}) {
  const base: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: S.fontStack,
    color: S.text,
    backgroundColor: S.white,
    border: `1px solid ${S.border}`,
    borderRadius: S.radius,
    padding: "0 12px",
    height: rows ? undefined : S.inputH,
    lineHeight: rows ? "1.7" : S.inputH,
    outline: "none",
    transition: "border-color 0.15s",
  };
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: S.textSec, marginBottom: "6px", letterSpacing: "0.01em" }}>
        {label} {required && <span style={{ color: S.danger }}>*</span>}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{ ...base, padding: "10px 12px", resize: "vertical", minHeight: "80px" }}
          onFocus={(e) => (e.target.style.borderColor = S.borderFocus)}
          onBlur={(e) => (e.target.style.borderColor = S.border)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = S.borderFocus)}
          onBlur={(e) => (e.target.style.borderColor = S.border)}
        />
      )}
      {hint && <p style={{ fontSize: "12px", color: S.textMut, marginTop: "4px", lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: S.textSec, marginBottom: "6px" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", fontSize: "14px", fontFamily: S.fontStack,
          color: S.text, backgroundColor: S.white, border: `1px solid ${S.border}`,
          borderRadius: S.radius, padding: "0 12px", height: S.inputH, lineHeight: S.inputH,
          outline: "none", cursor: "pointer",
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px", cursor: "pointer", fontSize: "14px", color: S.text, fontFamily: S.fontStack }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ width: "16px", height: "16px", accentColor: S.accent }} />
      {label}
    </label>
  );
}

function Btn({ label, onClick, variant = "primary", loading, disabled, type = "button" }: {
  label: string; onClick?: () => void; variant?: "primary" | "ghost"; loading?: boolean; disabled?: boolean; type?: "button" | "submit";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: loading ? "#d4a0f0" : S.accent, color: "#fff", border: "none" },
    ghost: { backgroundColor: "transparent", color: S.textMut, border: "none" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{
        ...styles[variant], fontSize: "14px", fontWeight: 500, fontFamily: S.fontStack,
        borderRadius: S.radius, padding: "8px 20px", cursor: (disabled || loading) ? "not-allowed" : "pointer",
        opacity: (disabled || loading) ? 0.6 : 1, transition: "all 0.15s",
      }}>
      {loading ? "..." : label}
    </button>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: S.white, border: `1px solid ${S.border}`, borderRadius: S.radius, padding: "24px", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "14px" }}>
      {title} <span style={{ color: S.textMut, fontWeight: 400 }}>({count})</span>
    </h2>
  );
}

function Feedback({ type, msg }: { type: "success" | "error"; msg: string }) {
  const colors = type === "success"
    ? { bg: S.successBg, border: S.successBorder, color: S.success }
    : { bg: S.dangerBg, border: S.dangerBorder, color: S.danger };
  return (
    <div style={{ fontSize: "13px", color: colors.color, backgroundColor: colors.bg, borderRadius: S.radius, border: `1px solid ${colors.border}`, padding: "10px 14px", marginBottom: "20px", lineHeight: 1.5 }}>
      {msg}
    </div>
  );
}

function ItemCard({ children, onDelete, deleting }: { children: React.ReactNode; onDelete: () => void; deleting: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", padding: "14px 16px", backgroundColor: S.white, border: `1px solid ${S.border}`, borderRadius: S.radius, marginBottom: "6px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      <button onClick={onDelete} disabled={deleting}
        style={{
          fontSize: "12px", color: S.danger, background: "none", border: `1px solid ${S.dangerBorder}`,
          borderRadius: "4px", padding: "3px 10px", cursor: deleting ? "not-allowed" : "pointer",
          opacity: deleting ? 0.5 : 1, fontFamily: S.fontStack, whiteSpace: "nowrap", flexShrink: 0,
        }}>
        {deleting ? "..." : "Delete"}
      </button>
    </div>
  );
}

/* ── Login Gate ── */
function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => { if (localStorage.getItem("news_admin_auth") === "true") onAuth(); }, [onAuth]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { localStorage.setItem("news_admin_auth", "true"); onAuth(); setErr(""); }
    else setErr("Wrong password.");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: S.bg, fontFamily: S.fontStack }}>
      <Card style={{ width: "340px", padding: "32px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 600, color: S.text, marginBottom: "6px" }}>Admin Panel</h1>
        <p style={{ fontSize: "14px", color: S.textMut, marginBottom: "24px", lineHeight: 1.7 }}>Enter password to manage content.</p>
        <form onSubmit={submit}>
          <Input label="" value={pw} onChange={setPw} placeholder="Password" type="password" />
          {err && <p style={{ fontSize: "13px", color: S.danger, marginBottom: "12px" }}>{err}</p>}
          <Btn label="Sign In" type="submit" />
        </form>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION COMPONENTS
   ══════════════════════════════════════════════════ */

function NewsSection() {
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { try { setItems(await fetchNews()); } catch { setMsg({ type: "error", text: "Failed to load." }); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date.trim() || !content.trim()) { setMsg({ type: "error", text: "Date and content required." }); return; }
    try { setAdding(true); setMsg(null); await addNews(date.trim(), content.trim()); setDate(""); setContent(""); setMsg({ type: "success", text: "News added!" }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to add." }); } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { setDel(id); setMsg(null); await deleteNews(id); setMsg({ type: "success", text: "Deleted." }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to delete." }); } finally { setDel(null); }
  };

  return (<>
    {msg && <Feedback type={msg.type} msg={msg.text} />}
    <Card style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "18px" }}>Add News</h2>
      <form onSubmit={handleAdd}>
        <Input label="Date" value={date} onChange={setDate} placeholder='e.g. "Jul 14, 2026"' required />
        <Input label="Content" value={content} onChange={setContent} placeholder="News content..." rows={3} required />
        <Btn label="Add News" type="submit" loading={adding} />
      </form>
    </Card>
    <SectionTitle title="Existing News" count={items.length} />
    {loading ? <p style={{ fontSize: "14px", color: S.textMut }}>Loading...</p> : items.length === 0 ? <p style={{ fontSize: "14px", color: S.textMut }}>No news yet.</p> : items.map((item) => (
      <ItemCard key={item.id} onDelete={() => handleDelete(item.id)} deleting={del === item.id}>
        <p style={{ fontSize: "13px", color: S.accent, fontWeight: 500, marginBottom: "2px" }}>{item.date}</p>
        <p style={{ fontSize: "14px", color: S.text, lineHeight: 1.7 }}>{item.content}</p>
      </ItemCard>
    ))}
  </>);
}

function BlogSection() {
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState(""); const [date, setDate] = useState("");
  const [readTime, setReadTime] = useState(""); const [cat, setCat] = useState(""); const [tags, setTags] = useState("");
  const [content, setContent] = useState(""); const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<BlogItem[]>([]); const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { try { setItems(await fetchBlogs()); } catch { setMsg({ type: "error", text: "Failed to load." }); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) { setMsg({ type: "error", text: "Title and date required." }); return; }
    try {
      setAdding(true); setMsg(null);
      await addBlog({ title: title.trim(), description: desc.trim(), date: date.trim(), readTime: readTime.trim(), tags: tags.trim(), category: cat.trim(), content: content.trim() });
      setTitle(""); setDesc(""); setDate(""); setReadTime(""); setCat(""); setTags(""); setContent("");
      setMsg({ type: "success", text: "Blog post added!" }); await load();
    } catch { setMsg({ type: "error", text: "Failed to add." }); } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { setDel(id); setMsg(null); await deleteBlog(id); setMsg({ type: "success", text: "Deleted." }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to delete." }); } finally { setDel(null); }
  };

  return (<>
    {msg && <Feedback type={msg.type} msg={msg.text} />}
    <Card style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "18px" }}>Add Blog Post</h2>
      <form onSubmit={handleAdd}>
        <Input label="Title" value={title} onChange={setTitle} placeholder="Post title" required />
        <Input label="Description" value={desc} onChange={setDesc} placeholder="Short description" rows={2} />
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}><Input label="Date" value={date} onChange={setDate} placeholder='e.g. "Jun 14, 2026"' required /></div>
          <div style={{ flex: 1 }}><Input label="Read Time" value={readTime} onChange={setReadTime} placeholder='e.g. "5 min read"' /></div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}><Input label="Category" value={cat} onChange={setCat} placeholder='e.g. "tutorial"' /></div>
          <div style={{ flex: 1 }}><Input label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="ml, python, finance" /></div>
        </div>
        <Input label="Content" value={content} onChange={setContent} placeholder="Full post body (plain text)" rows={10} />
        <Btn label="Add Blog Post" type="submit" loading={adding} />
      </form>
    </Card>
    <SectionTitle title="Existing Posts" count={items.length} />
    {loading ? <p style={{ fontSize: "14px", color: S.textMut }}>Loading...</p> : items.length === 0 ? <p style={{ fontSize: "14px", color: S.textMut }}>No posts yet.</p> : items.map((item) => (
      <ItemCard key={item.id} onDelete={() => handleDelete(item.id)} deleting={del === item.id}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: S.text, marginBottom: "2px" }}>{item.title}</p>
        <p style={{ fontSize: "13px", color: S.accent, marginBottom: "4px" }}>{item.date}{item.readTime ? ` · ${item.readTime}` : ""}</p>
        {item.tags && <p style={{ fontSize: "12px", color: S.textMut }}>{item.tags.split(",").map((t) => `#${t.trim()}`).join(" ")}</p>}
      </ItemCard>
    ))}
  </>);
}

function PublicationsSection() {
  const [title, setTitle] = useState(""); const [authors, setAuthors] = useState(""); const [venue, setVenue] = useState("");
  const [year, setYear] = useState(""); const [abstract, setAbstract] = useState(""); const [pdfUrl, setPdfUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<PublicationItem[]>([]); const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { try { setItems(await fetchPublications()); } catch { setMsg({ type: "error", text: "Failed to load." }); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authors.trim()) { setMsg({ type: "error", text: "Title and authors required." }); return; }
    try {
      setAdding(true); setMsg(null);
      await addPublication({ title: title.trim(), authors: authors.trim(), venue: venue.trim(), year: year.trim(), abstract: abstract.trim(), pdfUrl: pdfUrl.trim() });
      setTitle(""); setAuthors(""); setVenue(""); setYear(""); setAbstract(""); setPdfUrl("");
      setMsg({ type: "success", text: "Publication added!" }); await load();
    } catch { setMsg({ type: "error", text: "Failed to add." }); } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { setDel(id); setMsg(null); await deletePublication(id); setMsg({ type: "success", text: "Deleted." }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to delete." }); } finally { setDel(null); }
  };

  return (<>
    {msg && <Feedback type={msg.type} msg={msg.text} />}
    <Card style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "18px" }}>Add Publication</h2>
      <form onSubmit={handleAdd}>
        <Input label="Title" value={title} onChange={setTitle} placeholder="Paper title" required />
        <Input label="Authors" value={authors} onChange={setAuthors} placeholder="Comma-separated" required />
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}><Input label="Venue" value={venue} onChange={setVenue} placeholder='e.g. "NeurIPS 2026"' /></div>
          <div style={{ flex: 1 }}><Input label="Year" value={year} onChange={setYear} placeholder="2026" /></div>
        </div>
        <Input label="Abstract (ABS)" value={abstract} onChange={setAbstract} placeholder="Full abstract — shown when user clicks ABS button" rows={5} />
        <Input label="PDF Link (HTML)" value={pdfUrl} onChange={setPdfUrl} placeholder="URL — shown as HTML button on site" />
        <Btn label="Add Publication" type="submit" loading={adding} />
      </form>
    </Card>
    <SectionTitle title="Existing Publications" count={items.length} />
    {loading ? <p style={{ fontSize: "14px", color: S.textMut }}>Loading...</p> : items.length === 0 ? <p style={{ fontSize: "14px", color: S.textMut }}>No publications yet.</p> : items.map((item) => (
      <ItemCard key={item.id} onDelete={() => handleDelete(item.id)} deleting={del === item.id}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: S.text, marginBottom: "2px" }}>{item.title}</p>
        <p style={{ fontSize: "13px", color: S.textSec, marginBottom: "2px" }}>{item.authors}</p>
        <p style={{ fontSize: "13px", color: S.accent }}>{item.venue}{item.year ? ` (${item.year})` : ""}</p>
      </ItemCard>
    ))}
  </>);
}

function ExperiencesSection() {
  const [type, setType] = useState("education"); const [inst, setInst] = useState(""); const [instLink, setInstLink] = useState("");
  const [degree, setDegree] = useState(""); const [dateRange, setDateRange] = useState(""); const [loc, setLoc] = useState("");
  const [details, setDetails] = useState(""); const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<ExperienceItem[]>([]); const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { try { setItems(await fetchExperiences()); } catch { setMsg({ type: "error", text: "Failed to load." }); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inst.trim() || !dateRange.trim()) { setMsg({ type: "error", text: "Institution and date range required." }); return; }
    try {
      setAdding(true); setMsg(null);
      await addExperience({ type, institution: inst.trim(), institutionLink: instLink.trim(), degree: degree.trim(), dateRange: dateRange.trim(), location: loc.trim(), details: details.trim() });
      setType("education"); setInst(""); setInstLink(""); setDegree(""); setDateRange(""); setLoc(""); setDetails("");
      setMsg({ type: "success", text: "Experience added!" }); await load();
    } catch { setMsg({ type: "error", text: "Failed to add." }); } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { setDel(id); setMsg(null); await deleteExperience(id); setMsg({ type: "success", text: "Deleted." }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to delete." }); } finally { setDel(null); }
  };

  return (<>
    {msg && <Feedback type={msg.type} msg={msg.text} />}
    <Card style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "18px" }}>Add Experience</h2>
      <form onSubmit={handleAdd}>
        <Select label="Type" value={type} onChange={setType} options={[
          { value: "education", label: "Education" }, { value: "work", label: "Work" }, { value: "other", label: "Other" },
        ]} />
        <Input label="Institution Name" value={inst} onChange={setInst} placeholder="e.g. Delhi University" required />
        <Input label="Institution Link" value={instLink} onChange={setInstLink} placeholder="https://..." />
        <Input label="Degree / Role" value={degree} onChange={setDegree} placeholder="e.g. BSc Mathematics" />
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}><Input label="Date Range" value={dateRange} onChange={setDateRange} placeholder='e.g. "Sep 2025 - Present"' required /></div>
          <div style={{ flex: 1 }}><Input label="Location" value={loc} onChange={setLoc} placeholder="e.g. New Delhi" /></div>
        </div>
        <Input label="Details" value={details} onChange={setDetails} hint="Supports HTML for hyperlinks: &lt;a href='URL'&gt;text&lt;/a&gt;" rows={6} />
        <Btn label="Add Experience" type="submit" loading={adding} />
      </form>
    </Card>
    <SectionTitle title="Existing Experiences" count={items.length} />
    {loading ? <p style={{ fontSize: "14px", color: S.textMut }}>Loading...</p> : items.length === 0 ? <p style={{ fontSize: "14px", color: S.textMut }}>No experiences yet.</p> : items.map((item) => (
      <ItemCard key={item.id} onDelete={() => handleDelete(item.id)} deleting={del === item.id}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: S.text }}>
          {item.institution}
          <span style={{ fontSize: "11px", color: S.textMut, fontWeight: 400, textTransform: "uppercase", marginLeft: "8px" }}>{item.type}</span>
        </p>
        {item.degree && <p style={{ fontSize: "13px", color: S.textSec, marginBottom: "2px" }}>{item.degree}</p>}
        <p style={{ fontSize: "13px", color: S.accent }}>{item.dateRange} · {item.location}</p>
      </ItemCard>
    ))}
  </>);
}

function TeachingSection() {
  const [org, setOrg] = useState(""); const [orgLink, setOrgLink] = useState(""); const [role, setRole] = useState("");
  const [date, setDate] = useState(""); const [loc, setLoc] = useState(""); const [bullets, setBullets] = useState("");
  const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<TeachingItem[]>([]); const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { try { setItems(await fetchTeaching()); } catch { setMsg({ type: "error", text: "Failed to load." }); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org.trim() || !date.trim()) { setMsg({ type: "error", text: "Organization and date required." }); return; }
    try {
      setAdding(true); setMsg(null);
      await addTeaching({ orgName: org.trim(), orgLink: orgLink.trim(), role: role.trim(), date: date.trim(), location: loc.trim(), bullets: bullets.trim() });
      setOrg(""); setOrgLink(""); setRole(""); setDate(""); setLoc(""); setBullets("");
      setMsg({ type: "success", text: "Teaching entry added!" }); await load();
    } catch { setMsg({ type: "error", text: "Failed to add." }); } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { setDel(id); setMsg(null); await deleteTeaching(id); setMsg({ type: "success", text: "Deleted." }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to delete." }); } finally { setDel(null); }
  };

  return (<>
    {msg && <Feedback type={msg.type} msg={msg.text} />}
    <Card style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "18px" }}>Add Teaching Entry</h2>
      <form onSubmit={handleAdd}>
        <Input label="Organization Name (rendered as hyperlink)" value={org} onChange={setOrg} placeholder="e.g. EPFL" required />
        <Input label="Organization Link" value={orgLink} onChange={setOrgLink} placeholder="https://..." />
        <Input label="Role" value={role} onChange={setRole} placeholder="e.g. Teaching Assistant" />
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}><Input label="Date" value={date} onChange={setDate} placeholder='e.g. "Fall 2025"' required /></div>
          <div style={{ flex: 1 }}><Input label="Location" value={loc} onChange={setLoc} placeholder="e.g. Remote" /></div>
        </div>
        <Input label="Details / Bullets" value={bullets} onChange={setBullets} hint="Free text body for the teaching entry" rows={5} />
        <Btn label="Add Teaching Entry" type="submit" loading={adding} />
      </form>
    </Card>
    <SectionTitle title="Existing Entries" count={items.length} />
    {loading ? <p style={{ fontSize: "14px", color: S.textMut }}>Loading...</p> : items.length === 0 ? <p style={{ fontSize: "14px", color: S.textMut }}>No entries yet.</p> : items.map((item) => (
      <ItemCard key={item.id} onDelete={() => handleDelete(item.id)} deleting={del === item.id}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: S.text, marginBottom: "2px" }}>{item.orgName}</p>
        {item.role && <p style={{ fontSize: "13px", color: S.textSec, marginBottom: "2px" }}>{item.role}</p>}
        <p style={{ fontSize: "13px", color: S.accent }}>{item.date} · {item.location}</p>
      </ItemCard>
    ))}
  </>);
}

function TalksSection() {
  const [title, setTitle] = useState(""); const [venue, setVenue] = useState(""); const [invited, setInvited] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""); const [adding, setAdding] = useState(false);
  const [items, setItems] = useState<TalkItem[]>([]); const [loading, setLoading] = useState(true);
  const [del, setDel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => { try { setItems(await fetchTalks()); } catch { setMsg({ type: "error", text: "Failed to load." }); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setMsg({ type: "error", text: "Title required." }); return; }
    try {
      setAdding(true); setMsg(null);
      await addTalk({ title: title.trim(), venue: venue.trim(), invited, videoUrl: videoUrl.trim() });
      setTitle(""); setVenue(""); setInvited(false); setVideoUrl("");
      setMsg({ type: "success", text: "Talk added!" }); await load();
    } catch { setMsg({ type: "error", text: "Failed to add." }); } finally { setAdding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { setDel(id); setMsg(null); await deleteTalk(id); setMsg({ type: "success", text: "Deleted." }); await load(); }
    catch { setMsg({ type: "error", text: "Failed to delete." }); } finally { setDel(null); }
  };

  return (<>
    {msg && <Feedback type={msg.type} msg={msg.text} />}
    <Card style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 600, color: S.text, marginBottom: "18px" }}>Add Talk</h2>
      <form onSubmit={handleAdd}>
        <Input label="Title" value={title} onChange={setTitle} placeholder="Talk title" required />
        <Input label="Venue" value={venue} onChange={setVenue} placeholder='e.g. "NeurIPS 2026 Workshop"' />
        <Checkbox label="Invited Talk" checked={invited} onChange={setInvited} />
        <Input label="Video URL" value={videoUrl} onChange={setVideoUrl} placeholder="Link to recording (optional)" />
        <Btn label="Add Talk" type="submit" loading={adding} />
      </form>
    </Card>
    <SectionTitle title="Existing Talks" count={items.length} />
    {loading ? <p style={{ fontSize: "14px", color: S.textMut }}>Loading...</p> : items.length === 0 ? <p style={{ fontSize: "14px", color: S.textMut }}>No talks yet.</p> : items.map((item) => (
      <ItemCard key={item.id} onDelete={() => handleDelete(item.id)} deleting={del === item.id}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: S.text }}>
          {item.title}
          {item.invited && <span style={{ fontSize: "11px", color: S.accent, backgroundColor: "#f3e8ff", borderRadius: "4px", padding: "2px 8px", marginLeft: "8px", fontWeight: 500 }}>Invited</span>}
        </p>
        <p style={{ fontSize: "13px", color: S.accent, marginBottom: "2px" }}>{item.venue}</p>
        {item.videoUrl && <p style={{ fontSize: "12px", color: S.textMut }}><a href={item.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: S.accent }}>Video link</a></p>}
      </ItemCard>
    ))}
  </>);
}

/* ══════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ══════════════════════════════════════════════════ */
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("news");

  useEffect(() => { if (localStorage.getItem("news_admin_auth") === "true") setAuthed(true); }, []);

  const signOut = () => { localStorage.removeItem("news_admin_auth"); setAuthed(false); };

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: S.bg, fontFamily: S.fontStack }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${S.border}` }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px", height: "48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: "14px", color: S.textSec, textDecoration: "none" }}>
            ← Back to Site
          </a>
          <button onClick={signOut} style={{ fontSize: "13px", color: S.textMut, background: "none", border: "none", cursor: "pointer", fontFamily: S.fontStack }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: `1px solid ${S.border}`, overflowX: "auto" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 20px", display: "flex", gap: "0" }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                fontSize: "14px", fontWeight: tab === t.key ? 600 : 400, fontFamily: S.fontStack,
                color: tab === t.key ? S.accent : S.textMut,
                backgroundColor: "transparent", border: "none", borderBottom: tab === t.key ? `2px solid ${S.accent}` : "2px solid transparent",
                padding: "12px 14px", cursor: "pointer", whiteSpace: "nowrap", marginBottom: "-1px",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "28px 20px 80px" }}>
        {tab === "news" && <NewsSection />}
        {tab === "blog" && <BlogSection />}
        {tab === "publications" && <PublicationsSection />}
        {tab === "experiences" && <ExperiencesSection />}
        {tab === "teaching" && <TeachingSection />}
        {tab === "talks" && <TalksSection />}
      </div>
    </div>
  );
}