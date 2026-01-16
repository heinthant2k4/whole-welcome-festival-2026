"use client";

import * as React from "react";
import {
  Download,
  Play,
  Pause,
  FileSpreadsheet,
  ChevronDown,
  Trash2,
  AlertTriangle,
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
  const [confirmText, setConfirmText] = React.useState("");

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

  /* ---------- RESET VOTES ---------- */

  const resetAllVotes = async () => {
    if (confirmText !== "RESET") {
      toast.error("Please type RESET to confirm");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const result = await res.json();
        toast.success(`✅ Reset complete! ${result.deletedCount} votes deleted`);
        setConfirmText("");
        await fetchSummary(); // Refresh data
      } else {
        const error = await res.json();
        toast.error(error.error || "Reset failed");
      }
    } catch (error) {
      toast.error("Reset failed");
      console.error(error);
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

  const crews = data.crews.filter((c) =>
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
            <Badge variant="secondary">Admin</Badge>
          </div>

          <div className="flex gap-2">
            {/* RESET BUTTON */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
               <Button
                size="sm"
                variant="destructive"
                disabled={false}  // Force enable
                style={{ backgroundColor: 'red', color: 'white' }}  // Force red
              >
                <Trash2 size={14} className="mr-1" />
                RESET Voting Data
              </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white text-black">
                <AlertDialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-red-600" size={24} />
                    <AlertDialogTitle className="text-red-600">
                      ⚠️ DANGER: Reset All Votes
                    </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription>
                    <div className="space-y-3 text-black">
                      <p className="font-semibold">This will PERMANENTLY delete:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>All {data.totalVotes} votes</li>
                        <li>All voting history</li>
                        <li>All fingerprint records</li>
                      </ul>
                      <p className="text-red-600 font-bold">
                        ⚠️ THIS CANNOT BE UNDONE!
                      </p>
                      <p className="text-sm text-gray-600 mt-4">
                        Type <strong>RESET</strong> below to confirm:
                      </p>
                      <Input
                        placeholder="Type RESET"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                        className="border-red-300 focus:border-red-500"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="text-black"
                    onClick={() => setConfirmText("")}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetAllVotes}
                    disabled={confirmText !== "RESET" || busy}
                    className="bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
                  >
                    {busy ? "Resetting..." : "Confirm Reset"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* EXPORT BUTTON */}
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
                className="h-7 text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm disabled:opacity-60 text-black"
              >
                <Play size={12} className="mr-1" /> Resume
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busy}
                    className="h-7 text-[11px] font-semibold shadow-sm disabled:opacity-60 text-black"
                  >
                    <Pause size={12} className="mr-1" /> Pause
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
                    <AlertDialogCancel className="text-black">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => updateVotingState({ paused: true })}
                      className="bg-red-700 text-white hover:bg-red-800"
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
            <Badge>{state.overrideSchedule ? "Override" : "Scheduled"}</Badge>
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
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="text-xs text-slate-500">
              Showing {crews.length}
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Crew</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crews.map((c, i) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{i + 1}</span>
                      {i === 0 && c.votes > 0 && (
                        <span className="text-yellow-500">🏆</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-right font-mono">
                    {c.votes}
                  </TableCell>
                  <TableCell className="font-mono">
                    {c.percentage.toFixed(2)}%
                  </TableCell>
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