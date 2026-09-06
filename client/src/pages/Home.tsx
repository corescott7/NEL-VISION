import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  Compass,
  DollarSign,
  Eye,
  Film,
  Flame,
  Grid2X2,
  Menu,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const categories = ["For you", "Documentary", "Music", "Learning", "Gaming", "Culture", "Business"];

const features = [
  {
    title: "Signal / Noise",
    creator: "NEL Originals",
    duration: "12:48",
    tone: "from-[#24131b] via-[#6f1d2c] to-[#c64c43]",
    icon: Sparkles,
  },
  {
    title: "The craft behind the frame",
    creator: "Field Notes",
    duration: "08:26",
    tone: "from-[#101820] via-[#294655] to-[#98a6ab]",
    icon: Film,
  },
  {
    title: "Build something that lasts",
    creator: "Studio Hours",
    duration: "21:03",
    tone: "from-[#171717] via-[#433d37] to-[#b69370]",
    icon: TrendingUp,
  },
  {
    title: "Night shift / city light",
    creator: "After Eight",
    duration: "05:19",
    tone: "from-[#0e1525] via-[#243b75] to-[#b14a6d]",
    icon: Compass,
  },
  {
    title: "How ideas become movement",
    creator: "Open Canvas",
    duration: "16:40",
    tone: "from-[#182016] via-[#526338] to-[#d6bb70]",
    icon: Users,
  },
  {
    title: "A better way to begin",
    creator: "First Cut",
    duration: "09:55",
    tone: "from-[#291c27] via-[#6d315d] to-[#d9a2bb]",
    icon: Play,
  },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand brand-compact" : "brand"}>
      <img src="/manus-storage/nel-a-vision-official-logo-transparent_76d9162f.png" alt="NEL A VISION — Video Unleashed" />
    </div>
  );
}

function VideoCard({ video, index }: { video: (typeof features)[number]; index: number }) {
  const Icon = video.icon;
  return (
    <article className="video-card">
      <button className={`video-art bg-gradient-to-br ${video.tone}`} aria-label={`Play ${video.title}`}>
        <span className="video-art-grain" />
        <span className="video-art-index">0{index + 1}</span>
        <span className="video-art-mark"><Icon size={18} /></span>
        <span className="video-play"><Play size={18} fill="currentColor" /></span>
        <span className="video-duration">{video.duration}</span>
      </button>
      <div className="video-copy">
        <div>
          <h3>{video.title}</h3>
          <p>{video.creator}</p>
        </div>
        <button className="icon-button small" aria-label={`More options for ${video.title}`}><Settings2 size={16} /></button>
      </div>
    </article>
  );
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState("For you");
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showStudio, setShowStudio] = useState(false);

  const filteredFeatures = features.filter((video) => {
    if (!query.trim()) return true;
    return `${video.title} ${video.creator}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button menu-trigger" aria-label="Open navigation" onClick={() => setShowMenu((value) => !value)}><Menu size={20} /></button>
          <Logo />
        </div>
        <div className="search-wrap">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the signal" aria-label="Search videos" />
          {query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}
        </div>
        <div className="topbar-actions">
          <Link href="/studio" className="text-action studio-action"><Upload size={17} /> Creator Studio</Link><Link href="/advertiser" className="text-action advertiser-action"><DollarSign size={17} /> Advertisers</Link>
          <button className="icon-button" aria-label="Notifications"><Bell size={19} /></button>
          {isAuthenticated ? (
            <button className="profile-chip" onClick={logout}><span className="avatar"><UserRound size={16} /></span><span>{user?.name || "Account"}</span></button>
          ) : (
            <Button className="sign-in" onClick={() => startLogin()}>Sign in</Button>
          )}
        </div>
      </header>

      {showMenu && <div className="mobile-menu">
        <a href="#discover"><Compass size={17} /> Discover</a>
        <a href="#following"><Users size={17} /> Following</a>
        <Link href="/studio"><Upload size={17} /> Creator Studio</Link><a href="/advertiser"><DollarSign size={17} /> Advertisers</a>
      </div>}

      <main>
        <section className="hero-section" id="discover">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> The creator-first video platform</div>
            <h1>Make your <em>vision</em><br />impossible to miss.</h1>
            <p className="hero-lede">A calmer, more considered home for video. Discover work worth watching, and build a channel that rewards the people behind it.</p>
            <div className="hero-actions">
              <Link href="/studio" className="primary-cta"><Plus size={17} /> Start creating</Link>
              <a href="#explore" className="secondary-cta">Explore the feed <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-note"><Check size={15} /> Initial model: creators receive 65% of eligible platform revenue.</div>
          </div>
          <div className="hero-visual" aria-label="Featured NEL A VISION video artwork">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-screen">
              <span className="screen-label">NOW PLAYING / 001</span>
              <span className="screen-title">A new<br /><strong>frequency</strong></span>
              <span className="screen-footer">NEL A VISION <i>VIDEO UNLEASHED</i></span>
              <button className="hero-play" aria-label="Play featured video"><Play size={25} fill="currentColor" /></button>
            </div>
            <div className="hero-stat"><span className="stat-icon"><DollarSign size={17} /></span><span><strong>65%</strong><small>creator share model</small></span></div>
          </div>
        </section>

        <section className="marketing-video" aria-labelledby="marketing-video-title"><div className="marketing-video-copy"><span className="section-kicker"><Play size={14} /> NEL A VISION / 001</span><h2 id="marketing-video-title">Your vision.<br/><em>In motion.</em></h2><p>Meet the creator-first video platform built for work worth watching, channels worth following, and a clearer share of the upside.</p><span className="marketing-video-note">30-second brand film · sound on</span></div><div className="marketing-video-player"><video controls preload="metadata" playsInline aria-label="NEL A VISION 30-second marketing video"><source src="/manus-storage/marketing-shot-01_9c8641a7.mp4" type="video/mp4" />Your browser does not support embedded video. Download the NEL A VISION brand film to view it.</video><span className="marketing-video-caption">VIDEO UNLEASHED <i>/</i> CREATED FOR THE NEXT FRAME</span></div></section>\n\n        <section className="category-row" aria-label="Video categories">
          {categories.map((category) => <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>{category}</button>)}
          <button className="category-more"><Grid2X2 size={15} /> Browse all</button>
        </section>

        <section className="content-section" id="explore">
          <div className="section-heading"><div><span className="section-kicker"><Flame size={14} /> Curated for your attention</span><h2>{query ? "Search results" : "A sharper kind of feed"}</h2></div><a href="#explore" className="view-all">View all <ChevronRight size={16} /></a></div>
          <div className="video-grid">{filteredFeatures.map((video, index) => <VideoCard key={video.title} video={video} index={index} />)}</div>
          {filteredFeatures.length === 0 && <div className="empty-state"><Search size={24} /><h3>No signals found</h3><p>Try a different search phrase.</p></div>}
        </section>

        <section className="creator-banner" id="following">
          <div className="creator-banner-copy"><span className="section-kicker"><Users size={14} /> Built for the people behind the play button</span><h2>Your work deserves<br /><em>more of the upside.</em></h2><p>Follow the creators you care about. Publish your next chapter. See exactly how the initial earnings model is calculated.</p><Link href="/studio" className="outline-light">Open creator studio <ArrowUpRight size={16} /></Link></div>
          <div className="earnings-panel"><div className="earnings-panel-top"><span>INITIAL EARNINGS MODEL</span><DollarSign size={18} /></div><div className="earnings-number">65<span>%</span></div><div className="earnings-bar"><span /></div><div className="earnings-legend"><span><i className="legend-creator" /> Creator share</span><span><i className="legend-platform" /> Platform operations</span></div><p>This is an initial model for eligible platform revenue. Final payment, eligibility, deductions, and payout rules will be defined before launch.</p></div>
        </section>
      </main>

      <footer className="footer"><Logo compact /><span>© 2026 NEL A VISION</span><span className="footer-tag">VIDEO UNLEASHED</span><a href="#discover">Back to top <ArrowUpRight size={14} /></a></footer>

      {showStudio && <div className="modal-backdrop" onClick={() => setShowStudio(false)}><section className="studio-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowStudio(false)} aria-label="Close creator studio"><X size={19} /></button><span className="section-kicker"><Upload size={14} /> Creator Studio</span><h2>Make the next<br /><em>great thing.</em></h2><p>Creator accounts, uploading, publishing, analytics, and channel following are being shaped around a transparent 65% initial earnings model.</p><div className="studio-preview-grid"><div><Eye size={17} /><span>Views</span><strong>—</strong></div><div><TrendingUp size={17} /><span>Watch time</span><strong>—</strong></div><div><Users size={17} /><span>Followers</span><strong>—</strong></div></div><Button className="primary-cta full" onClick={() => startLogin()}>Sign in to continue <ArrowUpRight size={16} /></Button><small className="modal-disclaimer">No payout rules are finalized yet. The 65% figure is an initial model, not a payment promise.</small></section></div>}
    </div>
  );
}
