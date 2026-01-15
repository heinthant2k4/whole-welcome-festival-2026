"use client";

import * as React from "react";
import { Download, Search, RefreshCw } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  generatedAt?: string;
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminClient() {
  const [data, setData] = React.useState<AdminSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchData = React.useCallback(async (manual = false) => {
    if (manual) setIsRefreshing(true);

    try {
      const res = await fetch("/api/admin/summary", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch summary (${res.status})`);

      const result: AdminSummary = await res.json();
      // Server already sorts desc in the ideal setup, but keeping it safe:
      result.crews = [...result.crews].sort((a, b) => b.votes - a.votes);

      setData(result);

      if (manual) {
        toast.success("Refreshed", {
          description: "Dashboard data updated.",
        });
      }
    } catch (err: any) {
      toast.error("Refresh failed", {
        description: err?.message ?? "Unknown error",
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData(false);
    const t = setInterval(() => fetchData(false), 10_000);
    return () => clearInterval(t);
  }, [fetchData]);

  const filteredCrews =
    data?.crews.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    ) ?? [];

  if (loading && !data) {
    return (
      <div className="p-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading admin summary…</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Fetching the latest vote counts.
          </CardContent>
        </Card>
      </div>
    );
  }

  const topCrew = data?.crews?.[0];

  return (
    <div
      className="space-y-6 min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)",
        // fallback for dark mode, you can adjust as needed
        // backgroundColor: "#f8fafc",
      }}
    >
      <Toaster position="bottom-right" />

      {/* Overlay to cover any layout image background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(248,250,252,0.98) 0%, rgba(224,231,239,0.98) 100%)",
          backdropFilter: "blur(2px)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Live vote summary (auto-refresh every 10s).
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing…" : "Refresh"}
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href="/api/admin/export?format=csv" download>
                    Export as CSV
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/api/admin/export?format=json" download>
                    Export as JSON
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">
                {data?.totalVotes?.toLocaleString() ?? "0"}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Last vote at: {formatDateTime(data?.lastUpdated)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Leading crew
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold truncate">
                {topCrew?.name ?? "—"}
              </div>
              <div className="mt-1 text-sm text-muted-foreground tabular-nums">
                {topCrew ? `${topCrew.votes.toLocaleString()} votes` : "—"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Snapshot time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {formatDateTime(data?.generatedAt ?? new Date().toISOString())}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Polling is enabled.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table controls */}
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">Vote breakdown</CardTitle>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Sorted by votes (descending). Showing {filteredCrews.length} of{" "}
                {data?.crews?.length ?? 0}.
              </p>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search crew name…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Crew</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                  <TableHead className="w-[240px]">Share</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCrews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No crews match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCrews.map((crew, idx) => (
                    <TableRow key={crew.id}>
                      <TableCell className="text-muted-foreground tabular-nums">
                        {idx + 1}
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{crew.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Crew ID: {crew.id}
                        </div>
                      </TableCell>

                      <TableCell className="text-right tabular-nums font-medium">
                        {crew.votes.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, crew.percentage)
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="w-[64px] text-right tabular-nums text-sm">
                            {crew.percentage.toFixed(2)}%
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
