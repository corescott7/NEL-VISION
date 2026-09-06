import { ArrowLeft, Megaphone, Upload } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

export default function RoleLogin() {
  const { role = "creator" } = useParams<{ role?: string }>();
  const [, navigate] = useLocation();
  const isAdvertiser = role === "advertiser";
  const label = isAdvertiser ? "Advertiser" : "Creator";
  const continueLogin = () => { window.localStorage.setItem("nel-a-vision-login-role", isAdvertiser ? "advertiser" : "creator"); startLogin(isAdvertiser ? "/advertiser" : "/studio"); };
  return <div className="app-shell role-login"><header className="topbar"><Link href="/" className="icon-button" aria-label="Back to home"><ArrowLeft size={20}/></Link><div className="brand"><img src="/manus-storage/nel-a-vision-official-logo-transparent_76d9162f.png" alt="NEL A VISION" /></div></header><main className="role-login-card"><span className="section-kicker">ROLE-BASED ACCESS</span><div className="role-login-icon">{isAdvertiser ? <Megaphone size={24}/> : <Upload size={24}/>}</div><h1>Sign in as a<br/><em>{label.toLowerCase()}.</em></h1><p>{isAdvertiser ? "Manage campaigns, choose video placements, and review delivery." : "Publish your work, grow a channel, and see your creator share."}</p><Button className="primary-cta full" onClick={continueLogin}>Continue as {label}</Button><button className="role-switch" onClick={() => navigate(isAdvertiser ? "/login/creator" : "/login/advertiser")}>Switch to {isAdvertiser ? "creator" : "advertiser"} access</button></main></div>;
}
