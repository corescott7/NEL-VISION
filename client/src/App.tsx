import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Channel from "@/pages/Channel";
import Advertiser from "@/pages/Advertiser";
import RoleLogin from "@/pages/RoleLogin";
import Studio from "@/pages/Studio";
import Watch from "@/pages/Watch";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/watch/:id" component={Watch} /><Route path="/channel/:handle" component={Channel} /><Route path="/studio" component={Studio} /><Route path="/advertiser" component={Advertiser} /><Route path="/login/:role" component={RoleLogin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
