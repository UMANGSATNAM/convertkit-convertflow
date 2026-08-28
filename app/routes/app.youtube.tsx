import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form, Link, useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { 
  Card, Button, Badge, Banner, Box, Text, TextField, Select, Link as PolarisLink,
  BlockStack, InlineStack, Modal, Divider, Icon, Tabs, Spinner, DataTable
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import {
  LogoYoutubeIcon as YoutubeIcon,
  PlusIcon as AddIcon,
  RefreshIcon,
  PlayIcon,
  DeleteIcon,
  MenuIcon as MoreIcon,
  ClockIcon as ScheduleIcon,
  ViewIcon as VisibilityIcon,
  EditIcon,
  UploadIcon,
  AlertTriangleIcon as WarningIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@shopify/polaris-icons";

export async function loader({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const channels = await prisma.youTubeChannel.findMany({
    where: { shop: { shopDomain: shop } },
    include: {
      _count: { select: { videos: true, shorts: true } },
      videos: { take: 1, orderBy: { publishedAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return json({ channels, shop });
}

export async function action({ request }: { request: Request }) {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action") as string;

  try {
    if (action === "connect") {
      const response = await fetch(`/api/youtube/channels?shop=${session.shop}&action=auth-url`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      return json({ authUrl: data.authUrl });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
}

function ChannelCard({ channel, onFetchVideos, onStartMonitoring, onStopMonitoring, onDelete, onViewVideos, loadingChannels }: any) {
  const [monitoringInterval, setMonitoringInterval] = useState("30");
  const [showMonitorDialog, setShowMonitorDialog] = useState(false);

  const isMonitoring = channel.isMonitoring;
  const lastChecked = channel.lastCheckedAt ? new Date(channel.lastCheckedAt).toLocaleString() : "Never";

  return (
    <Card>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <Box>
          <Text variant="headingMd" style={{ fontWeight: 600 }}>
            {channel.channelName}
          </Text>
          <Text variant="bodySm" tone="subdued">
            @{channel.channelHandle || channel.channelId}
          </Text>
        </Box>
        <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge
            status={isMonitoring ? "success" : "neutral"}
          >
            {isMonitoring ? "Monitoring" : "Idle"}
          </Badge>
        </Box>
      </Box>

      <Box style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
        <Text variant="bodySm" tone="subdued">
          Videos: <strong>{channel._count.videos}</strong>
        </Text>
        <Text variant="bodySm" tone="subdued">
          Shorts: <strong>{channel._count.shorts}</strong>
        </Text>
        <Text variant="bodySm" tone="subdued">
          Last checked: <strong>{lastChecked}</strong>
        </Text>
      </Box>

      <Box style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Button
          variant="outline"
          icon={<VisibilityIcon />}
          onClick={() => onViewVideos(channel.id)}
          disabled={loadingChannels}
        >
          View Videos
        </Button>
        <Button
          variant="outline"
          icon={<RefreshIcon />}
          onClick={() => onFetchVideos(channel.id)}
          disabled={loadingChannels}
        >
          Fetch Videos
        </Button>
        {isMonitoring ? (
          <Button
            variant="outline"
            icon={<ScheduleIcon />}
            onClick={() => onStopMonitoring(channel.id)}
            disabled={loadingChannels}
          >
            Stop Monitoring
          </Button>
        ) : (
          <Button
            variant="outline"
            icon={<ScheduleIcon />}
            onClick={() => setShowMonitorDialog(true)}
            disabled={loadingChannels}
          >
            Start Monitoring
          </Button>
        )}
        <Button
          variant="outline"
          icon={<DeleteIcon />}
          onClick={() => onDelete(channel.id)}
          disabled={loadingChannels}
        >
          Remove
        </Button>
      </Box>

      <Modal
        open={showMonitorDialog}
        onClose={() => setShowMonitorDialog(false)}
        title="Start Channel Monitoring"
      >
        <Box style={{ padding: "16px 0" }}>
          <Text variant="bodySm" tone="subdued" paragraph>
            The app will check for new videos every {monitoringInterval} minutes and automatically create Shorts.
          </Text>
          <Select
            label="Check Interval (minutes)"
            value={monitoringInterval}
            onChange={(value) => setMonitoringInterval(value)}
            options={[
              { label: "15 minutes", value: "15" },
              { label: "30 minutes", value: "30" },
              { label: "1 hour", value: "60" },
              { label: "2 hours", value: "120" },
              { label: "4 hours", value: "240" },
              { label: "8 hours", value: "480" },
              { label: "12 hours", value: "720" },
              { label: "24 hours", value: "1440" },
            ]}
            style={{ marginTop: "16px" }}
          />
        </Box>
        <Box slot="footer" style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button onClick={() => setShowMonitorDialog(false)}>Cancel</Button>
          <Button
            primary
            onClick={() => { onStartMonitoring(channel.id, parseInt(monitoringInterval)); setShowMonitorDialog(false); }}
          >
            Start Monitoring
          </Button>
        </Box>
      </Modal>
    </Card>
  );
}

function VideosTab({ channelId, shop }: any) {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creatingShort, setCreatingShort] = useState<string | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/youtube/channels?shop=${shop}&channelId=${channelId}&action=videos&page=${page}&limit=20`);
      const data = await response.json();
      setVideos(data.videos);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, [page, channelId]);

  const handleCreateShort = async (videoId: string, videoTitle: string) => {
    setCreatingShort(videoId);
    try {
      const response = await fetch(`/api/youtube/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          shop,
          channelId,
          action: "create-short",
          videoId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Short creation queued!");
      } else {
        alert(data.error || "Failed to queue short creation");
      }
    } catch (error) {
      alert("Failed to queue short creation");
    } finally {
      setCreatingShort(null);
    }
  };

  return (
    <Box>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--p-color-border)", textAlign: "left" }}>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Thumbnail</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Title</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Duration</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Published</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Shorts</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} style={{ borderBottom: "1px solid var(--p-color-border)" }}>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  {video.thumbnailUrl && (
                    <img src={video.thumbnailUrl} alt="" style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 4 }} />
                  )}
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Text variant="bodySm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }} title={video.title}>
                    {video.title}
                  </Text>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{formatDuration(video.duration)}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{new Date(video.publishedAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Badge size="small">{video.shorts.length.toString()}</Badge>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Button
                    size="slim"
                    icon={creatingShort === video.id ? <Spinner /> : <PlayIcon />}
                    onClick={() => handleCreateShort(video.videoId, video.title)}
                    disabled={creatingShort === videoId || video.isProcessed}
                  >
                    {video.isProcessed ? "Processed" : "Create Short"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 20 && (
        <Box style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <Button
            variant="outline"
            disabled={page === 1 || loading}
            onClick={() => setPage(p => p - 1)}
            icon={<ChevronLeftIcon />}
          >
            Previous
          </Button>
          <Text variant="bodySm" style={{ alignSelf: "center" }}>
            Page {page} of {Math.ceil(total / 20)}
          </Text>
          <Button
            variant="outline"
            disabled={page * 20 >= total || loading}
            onClick={() => setPage(p => p + 1)}
            icon={<ChevronRightIcon />}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}

function ShortsTab({ channelId, shop }: any) {
  const [page, setPage] = useState(1);
  const [shorts, setShorts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchShorts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        shop,
        channelId,
        action: "shorts",
        page: page.toString(),
        limit: "20",
      });
      if (filterStatus) params.append("status", filterStatus);
      
      const response = await fetch(`/api/youtube/channels?${params}`);
      const data = await response.json();
      setShorts(data.shorts);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShorts(); }, [page, channelId, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPLOADED": return "success";
      case "FAILED": return "critical";
      case "UPLOADING": return "warning";
      case "READY": return "info";
      default: return "neutral";
    }
  };

  const handleRetry = async (shortId: string) => {
    try {
      const response = await fetch(`/api/youtube/shorts`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shortId, action: "retry-upload" }),
      });
      const data = await response.json();
      if (data.success) fetchShorts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReprocess = async (shortId: string) => {
    try {
      const response = await fetch(`/api/youtube/shorts`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shortId, action: "reprocess" }),
      });
      const data = await response.json();
      if (data.success) fetchShorts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (shortId: string) => {
    if (!confirm("Delete this short?")) return;
    try {
      const response = await fetch(`/api/youtube/shorts`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shortId, action: "delete" }),
      });
      const data = await response.json();
      if (data.success) fetchShorts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <Select
          label="Filter by Status"
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          options={[
            { label: "All", value: "" },
            { label: "Pending", value: "PENDING" },
            { label: "Processing", value: "PROCESSING" },
            { label: "Ready", value: "READY" },
            { label: "Uploading", value: "UPLOADING" },
            { label: "Uploaded", value: "UPLOADED" },
            { label: "Failed", value: "FAILED" },
          ]}
          style={{ minWidth: "150px" }}
        />
      </Box>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--p-color-border)", textAlign: "left" }}>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Thumbnail</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Title</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Source Video</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Status</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Created</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shorts.map((short) => (
              <tr key={short.id} style={{ borderBottom: "1px solid var(--p-color-border)" }}>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  {short.sourceVideo?.thumbnailUrl && (
                    <img src={short.sourceVideo.thumbnailUrl} alt="" style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 4 }} />
                  )}
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Text variant="bodySm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }} title={short.title}>
                    {short.title}
                  </Text>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Text variant="bodySm" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }} title={short.sourceVideo?.title}>
                    {short.sourceVideo?.title || "Unknown"}
                  </Text>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Badge size="small" status={getStatusColor(short.status)}>{short.status}</Badge>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{new Date(short.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  {short.status === "FAILED" && (
                    <Button size="slim" variant="outline" onClick={() => handleRetry(short.id)} icon={<RefreshIcon />}>
                      Retry
                    </Button>
                  )}
                  {short.status === "READY" && (
                    <Button size="slim" variant="outline" onClick={() => handleReprocess(short.id)} icon={<UploadIcon />}>
                      Upload
                    </Button>
                  )}
                  {short.shortVideoId && (
                    <PolarisLink url={`https://youtube.com/shorts/${short.shortVideoId}`} external>
                      <Button size="slim" variant="outline" icon={<VisibilityIcon />}>View</Button>
                    </PolarisLink>
                  )}
                  <Button size="slim" variant="outline" destructive onClick={() => handleDelete(short.id)} icon={<DeleteIcon />}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 20 && (
        <Box style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <Button variant="outline" disabled={page === 1 || loading} onClick={() => setPage(p => p - 1)} icon={<ChevronLeftIcon />}>Previous</Button>
          <Text variant="bodySm" style={{ alignSelf: "center" }}>Page {page} of {Math.ceil(total / 20)}</Text>
          <Button variant="outline" disabled={page * 20 >= total || loading} onClick={() => setPage(p => p + 1)} icon={<ChevronRightIcon />}>Next</Button>
        </Box>
      )}
    </Box>
  );
}

function JobsTab({ channelId, shop }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/youtube/channels?shop=${shop}&channelId=${channelId}&action=jobs`);
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [channelId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "success";
      case "FAILED": return "critical";
      case "RUNNING": return "warning";
      case "QUEUED": return "info";
      default: return "neutral";
    }
  };

  return (
    <Box>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--p-color-border)", textAlign: "left" }}>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Type</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Status</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Progress</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Current Step</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Created</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, fontSize: "12px", color: "var(--p-color-text-subdued)" }}>Completed</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} style={{ borderBottom: "1px solid var(--p-color-border)" }}>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Badge size="small">{job.type}</Badge>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>
                  <Badge size="small" status={getStatusColor(job.status)}>{job.status}</Badge>
                </td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{job.progress}%</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{job.currentStep || "-"}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{new Date(job.createdAt).toLocaleString()}</td>
                <td style={{ padding: "12px", verticalAlign: "middle" }}>{job.completedAt ? new Date(job.completedAt).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + "h " : ""}${m}m ${s}s`;
}

export default function YouTubePage() {
  const { channels, shop } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [tab, setTab] = useState<"channels" | "videos" | "shorts" | "jobs">("channels");
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadingChannels = navigation.state === "loading";

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const response = await fetch(`/api/youtube/channels?shop=${shop}&action=auth-url`);
      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to initiate connection" });
    } finally {
      setConnecting(false);
    }
  };

  const handleFetchVideos = async (channelId: string) => {
    try {
      const response = await fetch(`/api/youtube/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shop, channelId, action: "fetch-videos" }),
      });
      const data = await response.json();
      setMessage({ type: data.success ? "success" : "error", text: data.message || data.error });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch videos" });
    }
  };

  const handleStartMonitoring = async (channelId: string, interval: number) => {
    try {
      const response = await fetch(`/api/youtube/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shop, channelId, action: "start-monitoring", interval: interval.toString() }),
      });
      const data = await response.json();
      setMessage({ type: data.success ? "success" : "error", text: data.message || data.error });
      if (data.success) {
        setSelectedChannel(channelId);
        setTab("videos");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to start monitoring" });
    }
  };

  const handleStopMonitoring = async (channelId: string) => {
    try {
      const response = await fetch(`/api/youtube/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shop, channelId, action: "stop-monitoring" }),
      });
      const data = await response.json();
      setMessage({ type: data.success ? "success" : "error", text: data.message || data.error });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to stop monitoring" });
    }
  };

  const handleDelete = async (channelId: string) => {
    if (!confirm("Remove this YouTube channel? This will delete all associated videos and shorts.")) return;
    try {
      const response = await fetch(`/api/youtube/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ shop, channelId, action: "delete-channel" }),
      });
      const data = await response.json();
      setMessage({ type: data.success ? "success" : "error", text: data.message || data.error });
      if (data.success && selectedChannel === channelId) {
        setSelectedChannel(null);
        setTab("channels");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete channel" });
    }
  };

  const handleViewVideos = (channelId: string) => {
    setSelectedChannel(channelId);
    setTab("videos");
  };

  const ConnectCard = () => (
    <Card>
      <Box style={{ textAlign: "center", padding: "32px" }}>
        <YoutubeIcon style={{ fontSize: 48, color: "var(--p-color-primary)", marginBottom: "16px" }} />
        <Text variant="headingMd" style={{ marginBottom: "8px" }}>Connect YouTube Channel</Text>
        <Text variant="bodyMd" tone="subdued" paragraph>
          Connect your YouTube channel to automatically create and upload Shorts from your videos or monitored channels.
        </Text>
        <Button
          primary
          size="large"
          icon={<AddIcon />}
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? "Connecting..." : "Connect YouTube Channel"}
        </Button>
      </Box>
    </Card>
  );

  if (channels.length === 0) {
    return (
      <Box style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 32px" }}>
        <Text variant="headingLg" style={{ marginBottom: "16px" }}>YouTube Shorts Automation</Text>
        <ConnectCard />
      </Box>
    );
  }

  return (
    <Box style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 32px" }}>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Text variant="headingLg">YouTube Shorts Automation</Text>
        <Button variant="outline" icon={<AddIcon />} onClick={() => { setSelectedChannel(null); setTab("channels"); }}>
          Add Channel
        </Button>
      </Box>

      {message && (
        <Banner status={message.type} title={message.type === "success" ? "Success" : "Error"} onDismiss={() => setMessage(null)} style={{ marginBottom: "24px" }}>
          {message.text}
        </Banner>
      )}

      {selectedChannel ? (
        <Box>
          <Box style={{ display: "flex", gap: "8px", marginBottom: "24px", alignItems: "center" }}>
            <Button
              variant={tab === "channels" ? "primary" : "outline"}
              onClick={() => { setSelectedChannel(null); setTab("channels"); }}
            >
              ← Back to Channels
            </Button>
            <Tabs
              selected={["videos", "shorts", "jobs"].indexOf(tab)}
              onSelect={(index) => setTab(["videos", "shorts", "jobs"][index] as any)}
              tabs={[
                { id: "videos", content: "Videos" },
                { id: "shorts", content: "Shorts" },
                { id: "jobs", content: "Jobs" },
              ]}
              style={{ flex: 1 }}
            />
          </Box>

          {tab === "videos" && <VideosTab channelId={selectedChannel} shop={shop} />}
          {tab === "shorts" && <ShortsTab channelId={selectedChannel} shop={shop} />}
          {tab === "jobs" && <JobsTab channelId={selectedChannel} shop={shop} />}
        </Box>
      ) : (
        <Box>
          <Box style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
            <Button variant="outline" icon={<AddIcon />} onClick={handleConnect}>
              Connect Another Channel
            </Button>
          </Box>
          <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onFetchVideos={handleFetchVideos}
                onStartMonitoring={handleStartMonitoring}
                onStopMonitoring={handleStopMonitoring}
                onDelete={handleDelete}
                onViewVideos={handleViewVideos}
                loadingChannels={loadingChannels}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}