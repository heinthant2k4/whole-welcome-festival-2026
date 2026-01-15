"use client";

import * as React from "react";
import {
  Download,
  Search,
  RefreshCw,
  Vote,
  Trophy,
  Play,
  Pause,
  FileSpreadsheet,
  ChevronDown,
  Filter,
  Clock,
} from "lucide-react";
import { toast, Toaster } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

/* ---------------- TYPES ---------------- */

type Crew = {
  id: number;
  name: string;
  votes: number;
  percentage: number;
};

type AdminSummary = {
  crews: Crew[];
  totalVotes: number;
  lastUpdated: string | null;
};

type VotingState = {
  paused: boolean;
  overrideSchedule: boolean;
};

/* ---------------- HELPERS ---------------- */

const fmt = (v?: string | null) =>
  v ? new Date(v).toLocaleTimeString() : "—";

/* ---------------- COMPONENT ---------------- */

export default function AdminClient() {
  const [data, setData] = React.useState<AdminSummary | null>(null);
  const [state, setState] = React.useState<VotingState | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  /* ---------- FETCHERS ---------- */

  const fetchSummary = async () => {
    const res = await fetch("/api/admin/summary", { cache: "no-store" });
    const json = await res.json();
    json.crews.sort((a: Crew, b: Crew) => b.votes - a.votes);
    setData(json);
  };

  const fetchVotingState = async () => {
    const res = await fetch("/api/admin/voting", { cache: "no-store" });
    const json = await res.json();
    setState(json);
  };

  /* ---------- TOGGLES ---------- */

  const updateVotingState = async (patch: Partial<VotingState>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      setState(json);
      toast.success("State updated");
    } catch {
      toast.error("Update failed");
    } finally {
      setBusy(false);
    }
  };

  /* ---------- EFFECT ---------- */

  React.useEffect(() => {
    const load = async () => {
      await Promise.all([fetchSummary(), fetchVotingState()]);
      setLoading(false);
    };
    load();
    const t = setInterval(load, 10_000);
    return () => clearInterval(t);
  }, []);

  if (loading || !data || !state) {
    return <div className="p-10 text-sm text-slate-500">Loading admin…</div>;
  }

  const crews = data.crews.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white min-h-screen">
      <Toaster position="top-center" richColors />

      {/* HEADER */}
      <div className="border-b px-6 py-3 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={18} />
            <strong>Festival_Voting_Summary.xlsx</strong>
            <Badge variant="secondary">Read-only</Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download size={14} />
                Export
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a href="/api/admin/export?format=csv">CSV</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/api/admin/export?format=json">JSON</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* CONTROLS */}
        <div className="mt-3 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span>System:</span>
            {state.paused ? (
              <Button
                size="sm"
                onClick={() => updateVotingState({ paused: false })}
                disabled={busy}
                className="h-7 text-[11px] font-semibold bg-emerald-600 text-black hover:bg-emerald-700 shadow-sm disabled:opacity-60"
              >
                <Play size={12} className="mr-1 text-black" /> Resume
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    className="h-7 text-[11px] font-semibold text-black shadow-sm disabled:opacity-60"
                  >
                    <Pause size={12} className="mr-1 text-black" /> Pause
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white text-black">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Pause voting?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This blocks all incoming votes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-black">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => updateVotingState({ paused: true })}
                      className="bg-red-700 text-black hover:bg-red-800"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Schedule:</span>
            <Badge>
              {state.overrideSchedule ? "Override" : "Scheduled"}
            </Badge>
            <Button
              size="sm"
              variant="link"
              disabled={busy}
              onClick={() =>
                updateVotingState({
                  overrideSchedule: !state.overrideSchedule,
                })
              }
            >
              Change Mode
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          <Metric title="Total Votes" value={data.totalVotes} />
          <Metric title="Leader" value={data.crews[0]?.name} />
          <Metric title="Sync" value="10s" />
          <Metric title="Updated" value={fmt(data.lastUpdated)} />
        </div>

        <Card>
          <div className="p-4 flex justify-between">
            <Input
              placeholder="Filter crews…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="text-xs text-slate-500">
              Showing {crews.length}
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Crew</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crews.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="text-right">{c.votes}</TableCell>
                  <TableCell>{c.percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- SMALL TILE ---------------- */

function Metric({ title, value }: { title: string; value?: any }) {
  return (
    <div className="border p-4 rounded bg-white">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-bold">{value ?? "—"}</div>
    </div>
  );
}
