import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Bell, Film, Heart, ListPlus, MessageCircle, MoreHorizontal, Share2, Tag, UserRound } from "lucide-react";
import { Link, useParams } from "wouter";
import { getDisplayHashtags } from "../../../shared/videoMetadata";

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const videoId = Number(id);
  const { data, isLoading, error } = trpc.videos.byId.useQuery(
    { id: videoId },
    { enabled: Number.isInteger(videoId) && videoId > 0 },
  );

  if (isLoading) return <div className="app-shell"><main className="watch-state"><Film size={28} /><p>Loading video…</p></main></div>;
  if (error || !data) return <div className="app-shell"><main className="watch-state"><Film size={28} /><h1>Video unavailable</h1><p>This video may still be a draft or may have been removed by its creator.</p><Link href="/" className="primary-cta">Return to discovery</Link></main></div>;

  const { video, related } = data;
  const hashtags = getDisplayHashtags(video.hashtags, `${video.title} ${video.description ?? ""}`);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left"><Link href="/" className="icon-button" aria-label="Back to discovery"><ArrowLeft size={20} /></Link><div className="brand"><img src="/manus-storage/nel-a-vision-official-logo-transparent_76d9162f.png" alt="NEL A VISION" /></div></div>
        <div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><Bell size={19} /></button><Button className="sign-in">Sign in</Button></div>
      </header>

      <main className="watch-page">
        <div className="watch-player">
          {video.playbackUrl ? <video src={video.playbackUrl} controls playsInline preload="metadata" aria-label={`Play ${video.title}`} /> : <div className="watch-player-center"><Film size={28} /><span>PLAYBACK PROCESSING</span></div>}
        </div>

        <div className="watch-title-row">
          <div><span className="section-kicker">NEL A VISION / NOW PLAYING</span><h1>{video.title}</h1><p className="watch-meta">{video.viewCount.toLocaleString()} views{video.durationSeconds ? ` · ${Math.round(video.durationSeconds)} seconds` : ""}</p></div>
          <div className="watch-actions"><button><Heart size={17} /> Like</button><button><Share2 size={17} /> Share</button><button><ListPlus size={17} /> Save</button><button aria-label="More options"><MoreHorizontal size={17} /></button></div>
        </div>

        <div className="watch-channel"><span className="avatar"><UserRound size={16} /></span><div><strong>Creator channel</strong><small>Independent NEL A VISION creator</small></div><Button className="primary-cta">Follow</Button></div>

        <section className="watch-description" aria-labelledby="video-description-title">
          <div className="watch-description-heading"><div><span className="section-kicker">ABOUT THIS VIDEO</span><h2 id="video-description-title">Description</h2></div><MessageCircle size={18} /></div>
          <p>{video.description || "The creator has not added a description yet."}</p>
          <div className="watch-hashtags" aria-label="Video hashtags"><Tag size={16} />{hashtags.length > 0 ? hashtags.map((tag) => <span key={tag}>{tag}</span>) : <small>No hashtags added.</small>}</div>
        </section>

        {related.length > 0 && <section className="watch-related"><span className="section-kicker">MORE FROM THIS CREATOR</span><div className="watch-related-grid">{related.map((item) => <Link href={`/watch/${item.id}`} className="watch-related-card" key={item.id}><div>{item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" /> : <Film size={22} />}</div><strong>{item.title}</strong></Link>)}</div></section>}
      </main>
    </div>
  );
}
