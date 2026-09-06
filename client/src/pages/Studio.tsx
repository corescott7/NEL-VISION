import { useAuth } from "@/_core/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BarChart3, Check, DollarSign, Film, Info, Trash2, Upload, Users } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { classifyContent, getMonetizationEligibility } from "../../../shared/earnings";
import { getDisplayHashtags, normalizeHashtags } from "../../../shared/videoMetadata";

function readVideoMetadata(file: File) {
  return new Promise<{ duration: number; width: number; height: number }>((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({ duration: video.duration, width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video metadata"));
    };
    video.src = url;
  });
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function Studio() {
  const { user, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [metadata, setMetadata] = useState<{ duration: number; width: number; height: number } | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const { data: metrics, refetch: refetchMetrics } = trpc.studio.metrics.useQuery(undefined, { enabled: Boolean(user) });
  const { data: library, isLoading: libraryLoading, error: libraryError, refetch: refetchVideos } = trpc.studio.videos.useQuery(undefined, { enabled: Boolean(user) });
  const publishMutation = trpc.studio.publish.useMutation({
    onSuccess: () => {
      setMessage("Video published. It is now visible in your public channel.");
      refetchVideos();
      refetchMetrics();
    },
    onError: (error) => setMessage(error.message || "Could not publish this video. Please try again."),
  });
  const deleteMutation = trpc.studio.delete.useMutation({
    onSuccess: (deleted) => {
      setDeleteTarget(null);
      setMessage(deleted ? "Video deleted from your library." : "That video could not be found in your library.");
      refetchVideos();
      refetchMetrics();
    },
    onError: (error) => setMessage(error.message || "Could not delete this video. Please try again."),
  });

  const monetization = getMonetizationEligibility(metrics?.shortsCount ?? 0, metrics?.longVideosCount ?? 0);
  const classification = metadata ? classifyContent(metadata.duration, metadata.width, metadata.height) : null;

  const chooseFile = async (nextFile: File | undefined) => {
    if (!nextFile) return;
    setMessage("");
    try {
      setFile(nextFile);
      setMetadata(await readVideoMetadata(nextFile));
    } catch {
      setMessage("We could not read this video. Please choose a valid video file.");
    }
  };

  const upload = async () => {
    if (!file || !metadata || !title.trim()) {
      setMessage("Choose a video, enter a title, and try again.");
      return;
    }
    if (!classification?.qualifies) {
      setMessage(classification?.type === "short" ? "Shorts must be under 30 seconds and exactly 9:16." : "Long videos must be over 30 seconds. A video exactly 30 seconds is not eligible.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const base64 = await fileToBase64(file);
      const response = await fetch("/api/creator/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          base64,
          title: title.trim(),
          description: description.trim(),
          hashtags: normalizeHashtags(hashtags),
          durationSeconds: metadata.duration,
          width: metadata.width,
          height: metadata.height,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");

      setMessage("Upload saved as a draft. It is now in your video library.");
      setFile(null);
      setMetadata(null);
      setTitle("");
      setDescription("");
      setHashtags("");
      if (fileInput.current) fileInput.current.value = "";
      refetchMetrics();
      refetchVideos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link href="/" className="icon-button" aria-label="Back to discovery"><ArrowLeft size={20} /></Link>
          <div className="brand"><img src="/manus-storage/nel-a-vision-official-logo-transparent_76d9162f.png" alt="NEL A VISION" /></div>
        </div>
        <div className="topbar-actions"><span className="section-kicker">CREATOR STUDIO</span></div>
      </header>

      <main className="studio-page">
        <div className="studio-heading">
          <div><span className="section-kicker"><Upload size={14} /> YOUR WORKSPACE</span><h1>Make the next<br /><em>great thing.</em></h1><p>Publish with clarity. Understand your audience. Keep the economics visible.</p></div>
          {!isAuthenticated && <Link href="/login/creator" className="primary-cta"><Upload size={16} /> Sign in as creator</Link>}
        </div>

        {isAuthenticated ? <>
          <section className="upload-card">
            <div className="card-heading"><div><span className="section-kicker"><Upload size={14} /> PUBLISH A VIDEO</span><h2>Start with your next upload</h2></div><Info size={18} /></div>
            <p className="upload-help">Shorts are under 30 seconds and must be 9:16. Long videos are over 30 seconds and may use any ratio.</p>
            <div className="upload-fields">
              <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your video a clear title" /></label>
              <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell viewers what this video is about" rows={3} /></label>
              <label className="upload-field-wide">Hashtags<input value={hashtags} onChange={(event) => setHashtags(event.target.value)} placeholder="#music #tutorial #shorts" /><small>Separate tags with spaces or commas. Up to 15 will be saved.</small></label>
            </div>
            <input ref={fileInput} type="file" accept="video/*" hidden onChange={(event) => chooseFile(event.target.files?.[0])} />
            <div className="upload-actions">
              <Button className="outline-light" onClick={() => fileInput.current?.click()}><Film size={15} /> {file ? file.name : "Choose video file"}</Button>
              {metadata && <span className={classification?.qualifies ? "upload-valid" : "upload-invalid"}>{Math.round(metadata.duration)}s · {metadata.width}:{metadata.height} · {classification?.type === "short" ? "Short" : classification?.type === "long" ? "Long" : "Not eligible"}</span>}
              <Button className="primary-cta" disabled={busy} onClick={upload}><Upload size={15} /> {busy ? "Uploading…" : "Upload draft"}</Button>
            </div>
            {message && <p className="upload-message" role="status">{message}</p>}
          </section>

          <section className="studio-card library-card">
            <div className="card-heading"><div><span className="section-kicker"><Film size={14} /> YOUR VIDEO LIBRARY</span><h2>Shorts &amp; Long videos</h2></div><span className="library-count">{library?.length ?? 0} saved</span></div>
            {libraryLoading ? <p className="library-state">Loading your videos…</p> : libraryError ? <div className="library-error"><p>We could not load your video library.</p><Button className="small-cta" onClick={() => refetchVideos()}>Retry</Button></div> : library && library.length > 0 ? (
              <div className="video-library">
                {library.map((video) => {
                  const kind = video.durationSeconds && video.width && video.height ? classifyContent(video.durationSeconds, video.width, video.height) : null;
                  const displayHashtags = getDisplayHashtags(video.hashtags, `${video.title} ${video.description ?? ""}`);
                  return <article className="library-item" key={video.id}>
                    <div className="library-thumb">{video.playbackUrl ? <video src={video.playbackUrl} preload="metadata" muted playsInline /> : <Film size={24} />}<span>{video.visibility === "public" ? "PUBLIC" : "DRAFT"}</span></div>
                    <div className="library-details">
                      <strong>{video.title}</strong>
                      <p>{kind?.type === "short" ? "Short" : kind?.type === "long" ? "Long video" : "Needs metadata"} · {video.durationSeconds ? `${Math.round(video.durationSeconds)} sec` : "Duration pending"}{video.width && video.height ? ` · ${video.width}:${video.height}` : ""}</p>
                      <small>{video.description || "No description yet."}</small>
                      {displayHashtags.length > 0 && <div className="library-tags">{displayHashtags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
                    </div>
                    <div className="library-actions">
                      {video.playbackUrl && (video.visibility === "public" ? <Link href={`/watch/${video.id}`} className="library-link">Watch</Link> : <a href={video.playbackUrl} target="_blank" rel="noreferrer" className="library-link">Preview</a>)}
                      {video.visibility !== "public" && <Button className="small-cta" disabled={publishMutation.isPending} onClick={() => publishMutation.mutate({ videoId: video.id })}>Publish</Button>}
                      <Button className="delete-video-button" aria-label={`Delete ${video.title}`} onClick={() => setDeleteTarget({ id: video.id, title: video.title })}><Trash2 size={15} /> Delete</Button>
                    </div>
                  </article>;
                })}
              </div>
            ) : <div className="library-empty"><Film size={24} /><h3>Your library is ready</h3><p>Upload a Short or Long video above and it will appear here as a draft.</p></div>}
          </section>

          <div className="studio-metrics"><div><BarChart3 size={18} /><span>Views</span><strong>{metrics?.views ?? 0}</strong><small>Across published work</small></div><div><Users size={18} /><span>Followers</span><strong>{metrics?.followers ?? 0}</strong><small>Build your audience</small></div><div><DollarSign size={18} /><span>Creator share</span><strong>65%</strong><small>Of eligible platform revenue</small></div></div>

          <section className="studio-card earnings-card monetization-card">
            <div className="card-heading"><div><span className="section-kicker"><DollarSign size={14} /> HOW TO GET MONETIZED</span><h2>{monetization.eligible ? "You are eligible" : "Complete your starter set"}</h2></div><Check size={18} color="#d1a350" /></div>
            <p className="monetization-intro">Follow these three steps to unlock the initial monetization model:</p>
            <ol className="monetization-steps"><li><strong>Publish Short 1</strong><span>Under 30 seconds, exactly 9:16.</span></li><li><strong>Publish Short 2</strong><span>Under 30 seconds, exactly 9:16.</span></li><li><strong>Publish 1 Long video</strong><span>Over 30 seconds; any aspect ratio is accepted.</span></li></ol>
            <div className="requirements-grid"><div className={monetization.shortsCount >= 2 ? "requirement complete" : "requirement"}><strong>{Math.min(monetization.shortsCount, 2)}/2</strong><span>Shorts</span><small>Under 30s · 9:16</small></div><div className={monetization.longVideosCount >= 1 ? "requirement complete" : "requirement"}><strong>{Math.min(monetization.longVideosCount, 1)}/1</strong><span>Long video</span><small>Over 30s · any ratio</small></div></div>
            <div className="earnings-summary"><strong>65<span>%</span></strong><p>Creator allocation of eligible platform revenue once requirements are complete.</p></div>
            <small>Final payment timing, deductions, and payout rules will be published before launch. The 65% figure is the initial creator-share model.</small>
          </section>
        </> : <section className="studio-card"><h2>Sign in to upload</h2><p>Your creator account unlocks uploads, publishing, progress tracking, and the monetization checklist.</p><Link href="/login/creator" className="primary-cta">Continue as creator</Link></section>}
      </main>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && !deleteMutation.isPending && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this video?</AlertDialogTitle><AlertDialogDescription>“{deleteTarget?.title}” will be removed from your library and public channel. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={deleteMutation.isPending}>Keep video</AlertDialogCancel><AlertDialogAction className="delete-confirm" disabled={deleteMutation.isPending} onClick={() => deleteTarget && deleteMutation.mutate({ videoId: deleteTarget.id })}>{deleteMutation.isPending ? "Deleting…" : "Delete video"}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
