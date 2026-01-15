"use client";

import * as React from "react";
import { 
  Download, 
  Search, 
  Vote, 
  Users, 
  Activity, 
  Clock, 
  Trophy 
} from "lucide-react";

// shadcn/ui components (Assumed paths)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AdminSummary = {
  totalVotes: number;
  lastUpdated: string | null;
  generatedAt: string;
  crews: Array<{ id: number; name: string; votes: number; percentage: number }>;
};

export default function AdminClient() {
  const [data, setData] = React.useState<AdminSummary | null>(null);
  const [search, setSearch] = React.useState("");

  async function refresh() {
    try {
      const res = await fetch("/api/admin/summary", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch summary");
      setData(await res.json());
    } catch (err) {
      console.error("Dashboard sync error:", err);
    }
  }

  React.useEffect(() => {
    refresh();
    const t = setInterval(refresh, 7000);
    return () => clearInterval(t);
  }, []);

  const filteredCrews = data?.crews.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  if (!data) return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
      <div className="text-cyan-400 animate-pulse font-mono tracking-widest">INITIALIZING_SYSTEM...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 p-4 md:p-8 space-y-8">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent uppercase italic">
            Command Center
          </h1>
          <div className="flex items-center gap-3 mt-2 font-mono text-xs text-slate-500">
            <span className="flex h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] animate-pulse" />
            LIVE DATA STREAM // SYNCED: {data.generatedAt}
          </div>
        </div>
        
        <Button variant="outline" className="border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-400 hover:bg-fuchsia-500/20">
          <Download className="mr-2 h-4 w-4" /> Export Results
        </Button>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Submissions" value={data.totalVotes} icon={<Vote className="text-fuchsia-500" />} />
        <StatCard label="Registered Crews" value={data.crews.length} icon={<Users className="text-cyan-400" />} />
        <StatCard label="System Status" value="Online" icon={<Activity className="text-green-400" />} />
        <StatCard label="Last Refresh" value={data.lastUpdated || "N/A"} icon={<Clock className="text-slate-400" />} />
      </div>

      {/* SEARCH & LIST */}
      <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
        <CardHeader className="border-b border-white/5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Crew Leaderboard
            </CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search crew name..." 
                className="pl-9 bg-white/5 border-white/10 focus-visible:ring-fuchsia-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-16 text-center font-bold">POS</TableHead>
                <TableHead>Crew Identity</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead className="w-[40%]">Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrews.map((crew, idx) => (
                <TableRow key={crew.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="text-center font-mono text-slate-500">
                    {(idx + 1).toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell className="font-bold text-slate-200">
                    {crew.name}
                  </TableCell>
                  <TableCell className="text-right font-mono text-cyan-400">
                    {crew.votes.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-fuchsia-600 to-cyan-500 shadow-[0_0_12px_rgba(192,38,211,0.4)]"
                          style={{ width: `${crew.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono w-12 text-right text-slate-400">
                        {crew.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-1">{label}</p>
          <p className="text-3xl font-black tracking-tighter text-slate-100 group-hover:text-cyan-400 transition-colors">
            {value}
          </p>
        </div>
        <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}