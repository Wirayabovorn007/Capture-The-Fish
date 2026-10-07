import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronUp, Download, ExternalLink } from "lucide-react";
import Reveal from "../effects/Reveal";
import {
  extendChallenge,
  getActiveChallenge,
  getChallenge,
  getChallengeStatus,
  spawnChallenge,
  terminateChallenge,
} from "../../services/challengeApi";
import type { Challenge, RuntimeContainer } from "../../types/challenge";

type TaskSetupProps = { challengeId: string };

export default function TaskSetup({ challengeId }: TaskSetupProps) {
  const [open, setOpen] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState("OFF");
  const [containers, setContainers] = useState<RuntimeContainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [terminateAt, setTerminateAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [graceSeconds, setGraceSeconds] = useState(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const pollRef = useRef<number | null>(null);

  const hasContainer =
    challenge?.hasContainer ?? Boolean(challenge?.containers?.length);
  const challengeFiles =
    challenge?.challengeFiles ??
    (challenge?.challengeFile ? [challenge.challengeFile] : []);
  const websites =
    challenge?.websites ??
    (challenge?.websiteUrl?.trim()
      ? [{ label: "Website", url: challenge.websiteUrl }]
      : []);
  const hasResources =
    hasContainer || challengeFiles.length > 0 || websites.length > 0;

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const checkStatus = async (id: string) => {
    try {
      const result = await getChallengeStatus(challengeId, id);
      setStatus(result.status);
      setContainers(result.containers ?? []);
      setExpiresAt(
        result.expiresAt && result.expiresAt > 0 ? result.expiresAt : null,
      );
      setTerminateAt(
        result.terminateAt && result.terminateAt > 0
          ? result.terminateAt
          : null,
      );
      if (result.timerState === "GRACE_PERIOD") setTimeExpired(true);
      if (["RUNNING", "STOPPED", "NOT_FOUND"].includes(result.status))
        stopPolling();
      if (result.status === "STOPPED" && result.reason) setError(result.reason);
    } catch (err) {
      stopPolling();
      setError(
        err instanceof Error ? err.message : "ไม่สามารถตรวจสอบสถานะ Lab ได้",
      );
    }
  };

  const startPolling = (id: string) => {
    stopPolling();
    void checkStatus(id);
    pollRef.current = window.setInterval(() => void checkStatus(id), 3000);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError("");
        const challengeData = await getChallenge(challengeId);
        if (cancelled) return;
        setChallenge(challengeData);

        const usesContainer =
          challengeData.hasContainer ??
          Boolean(challengeData.containers?.length);
        if (!usesContainer) {
          setSessionId(null);
          setContainers([]);
          setExpiresAt(null);
          setTerminateAt(null);
          setTimeExpired(false);
          setStatus("OFF");
          return;
        }

        const result = await getActiveChallenge(challengeId);
        if (cancelled) return;

        if (result.hasActive && result.sessionId) {
          setSessionId(result.sessionId);
          setExpiresAt(
            result.expiresAt && result.expiresAt > 0 ? result.expiresAt : null,
          );
          setTerminateAt(
            result.terminateAt && result.terminateAt > 0
              ? result.terminateAt
              : null,
          );
          setTimeExpired(result.timerState === "GRACE_PERIOD");
          setStatus("PENDING");
          startPolling(result.sessionId);
        } else {
          setSessionId(null);
          setContainers([]);
          setExpiresAt(null);
          setTerminateAt(null);
          setTimeExpired(false);
          setStatus("OFF");
        }
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "ไม่สามารถโหลดข้อมูล Setup ได้",
          );
      }
    };

    void load();
    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [challengeId]);

  useEffect(() => {
    if (!sessionId || !expiresAt || !terminateAt) return;
    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, expiresAt - now);
      const grace = Math.max(0, terminateAt - now);
      setRemainingSeconds(remaining);
      setGraceSeconds(grace);
      if (remaining <= 0 && grace > 0) setTimeExpired(true);
      if (grace <= 0) {
        setTimeExpired(false);
        setSessionId(null);
        setContainers([]);
        setExpiresAt(null);
        setTerminateAt(null);
        setStatus("OFF");
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [sessionId, expiresAt, terminateAt]);

  const handleExtend = async () => {
    if (!sessionId || loading) return;
    try {
      setLoading(true);
      setError("");
      const result = await extendChallenge(sessionId);
      setExpiresAt(
        result.expiresAt && result.expiresAt > 0 ? result.expiresAt : null,
      );
      setTerminateAt(
        result.terminateAt && result.terminateAt > 0
          ? result.terminateAt
          : null,
      );
      setRemainingSeconds(
        Math.max(0, result.expiresAt - Math.floor(Date.now() / 1000)),
      );
      setGraceSeconds(0);
      setTimeExpired(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถต่อเวลา Lab ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (loading || sessionId || !hasContainer) return;
    try {
      setLoading(true);
      setError("");
      setContainers([]);
      setStatus("STARTING");
      const result = await spawnChallenge(challengeId);
      setSessionId(result.sessionId);
      setExpiresAt(result.expiresAt ?? null);
      setTerminateAt(result.terminateAt ?? null);
      setTimeExpired(false);
      setStatus("PENDING");
      startPolling(result.sessionId);
    } catch (err) {
      setStatus("OFF");
      setError(
        err instanceof Error ? err.message : "ไม่สามารถเปิด Lab machine ได้",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!sessionId || loading) return;
    try {
      setLoading(true);
      setError("");
      stopPolling();
      await terminateChallenge(sessionId);
      setSessionId(null);
      setContainers([]);
      setExpiresAt(null);
      setTerminateAt(null);
      setTimeExpired(false);
      setStatus("OFF");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถหยุด Lab machine ได้",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const statusText = status === "OFF" ? "off" : status.toLowerCase();
  const statusClass =
    status === "RUNNING"
      ? "text-[#59ff4b]"
      : status === "STOPPED"
        ? "text-red-500"
        : "text-yellow-300";

  if (!challenge && !error) return null;
  if (!hasResources && !error) return null;

  return (
    <Reveal>
      <section className="mx-20 mb-10 overflow-hidden bg-[#1d1d1d] text-white">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-[52px] w-full items-center justify-between bg-[#b51217] px-10"
        >
          <h2 className="text-lg font-bold">
            Task 1 - Challenge Resources & Setup
          </h2>
          <ChevronUp
            className={`h-6 w-6 transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`}
            strokeWidth={3}
          />
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`space-y-10 px-10 py-12 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
            >
              {hasContainer && (
                <ResourceSection
                  title="Lab Environment"
                  description="เปิด Environment ของโจทย์ เมื่อระบบพร้อมจะแสดง Container ที่ผู้เล่นสามารถเข้าถึงได้"
                >
                  <div className="mt-6 flex items-center">
                    <div className="relative z-10 flex w-[95px] flex-col gap-2">
                      <ServerUnit />
                      <ServerUnit />
                      <ServerUnit />
                    </div>
                    <div className="-ml-8 flex min-h-[122px] min-w-0 flex-1 items-center gap-8 bg-[#3a3a3a] px-6 py-5 pl-[87px]">
                      <div>
                        <h3 className="text-base font-bold">Lab environment</h3>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <div className="inline-flex rounded-full bg-[#292929] px-3 py-1">
                            <span
                              className={`text-xs font-medium ${statusClass}`}
                            >
                              Status: {statusText}
                            </span>
                          </div>
                          {sessionId &&
                            status === "RUNNING" &&
                            expiresAt &&
                            !timeExpired && (
                              <div className="font-mono text-sm font-bold text-[#59ff4b]">
                                Time: {formatTime(remainingSeconds)}
                              </div>
                            )}
                          {sessionId && status !== "RUNNING" && (
                            <div className="text-xs font-medium text-yellow-300">
                              กำลังสร้างสภาพแวดล้อมของโจทย์...
                            </div>
                          )}
                        </div>
                      </div>
                      {!sessionId ? (
                        <button
                          type="button"
                          onClick={handleStart}
                          disabled={loading}
                          className="ml-auto shrink-0 rounded-md bg-[#59ff4b] px-4 py-3 text-sm font-bold text-[#111] disabled:opacity-60"
                        >
                          {loading ? "กำลังเปิด..." : "เปิด Lab"}
                        </button>
                      ) : (
                        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-2">
                          {status === "RUNNING" &&
                            expiresAt &&
                            !timeExpired && (
                              <button
                                type="button"
                                onClick={handleExtend}
                                disabled={loading}
                                className="rounded-md bg-[#59ff4b] px-4 py-3 text-sm font-bold text-[#111] disabled:opacity-60"
                              >
                                {loading
                                  ? "กำลังต่อเวลา..."
                                  : "ต่อเวลา 3 ชั่วโมง"}
                              </button>
                            )}
                          <button
                            type="button"
                            onClick={handleStop}
                            disabled={loading}
                            className="shrink-0 whitespace-nowrap rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
                          >
                            {loading ? "กำลังหยุด..." : "ปิด Lab"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {status === "RUNNING" && containers.length > 0 && (
                    <div className="mt-8 grid max-w-[900px] gap-3 sm:grid-cols-2">
                      {containers
                        .filter((container) => container.accessType !== "none")
                        .map((container, index) => (
                          <div
                            key={`${container.name}-${index}`}
                            className="bg-[#303030] px-5 py-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="font-medium">
                                {container.name}
                              </div>
                              {container.url ? (
                                <a
                                  href={container.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-md bg-[#59ff4b] px-4 py-2 text-sm font-bold text-[#111]"
                                >
                                  {container.buttonLabel ||
                                    (container.accessType === "terminal"
                                      ? "Open Terminal"
                                      : "Open Website")}
                                </a>
                              ) : (
                                <span className="rounded bg-[#252525] px-3 py-2 text-xs text-yellow-300">
                                  Preparing...
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </ResourceSection>
              )}

              {websites.length > 0 && (
                <ResourceSection
                  title="Websites"
                  description="เว็บไซต์หรือ Resource ภายนอกที่ใช้สำหรับ Challenge นี้"
                >
                  <div className="grid gap-3">
                    {websites.map((site, index) => (
                      <div
                        key={`${site.url}-${index}`}
                        className="flex flex-wrap items-center justify-between gap-4 bg-[#303030] px-5 py-4"
                      >
                        <div className="min-w-0">
                          <div className="font-medium">
                            {site.label || `Website ${index + 1}`}
                          </div>
                          <div className="mt-1 break-all text-xs text-gray-400">
                            {site.url}
                          </div>
                        </div>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-md bg-[#59ff4b] px-4 py-2 text-sm font-bold text-[#111]"
                        >
                          <ExternalLink className="h-4 w-4" /> เปิด Website
                        </a>
                      </div>
                    ))}
                  </div>
                </ResourceSection>
              )}

              {challengeFiles.length > 0 && (
                <ResourceSection
                  title="Challenge Files"
                  description="ไฟล์สำหรับดาวน์โหลดเพื่อนำไปวิเคราะห์หรือใช้ทำโจทย์"
                >
                  <div className="grid gap-3">
                    {challengeFiles.map((file, index) => (
                      <div
                        key={`${file.fileUrl}-${index}`}
                        className="flex flex-wrap items-center justify-between gap-4 bg-[#303030] px-5 py-4"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {file.fileName}
                          </div>
                          {file.contentType && (
                            <div className="mt-1 text-xs text-gray-400">
                              {file.contentType}
                            </div>
                          )}
                        </div>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-md bg-[#59ff4b] px-4 py-2 text-sm font-bold text-[#111]"
                        >
                          <Download className="h-4 w-4" /> ดาวน์โหลดไฟล์
                        </a>
                      </div>
                    ))}
                  </div>
                </ResourceSection>
              )}

              {timeExpired && sessionId && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
                  <div className="w-full max-w-md rounded-xl bg-white p-7 text-center text-[#111] shadow-2xl">
                    <h3 className="text-2xl font-bold text-[#b51217]">
                      เวลาของคุณหมดแล้ว
                    </h3>
                    <p className="mt-3 text-sm text-gray-600">
                      ต้องการต่อเวลา Environment เดิมหรือไม่?
                    </p>
                    <div className="mt-5 rounded-lg bg-red-50 px-4 py-3">
                      <div className="text-xs font-semibold uppercase text-red-600">
                        Auto terminate in
                      </div>
                      <div className="mt-1 font-mono text-3xl font-bold text-red-600">
                        00:{String(graceSeconds).padStart(2, "0")}
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleExtend}
                        disabled={loading || graceSeconds <= 0}
                        className="rounded-md bg-[#59ff4b] px-4 py-3 text-sm font-bold text-[#111] disabled:opacity-50"
                      >
                        {loading ? "กำลังต่อเวลา..." : "ต่อเวลา 3 ชั่วโมง"}
                      </button>
                      <button
                        type="button"
                        onClick={handleStop}
                        disabled={loading}
                        className="rounded-md bg-red-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
                      >
                        Terminate ทันที
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function ResourceSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ServerUnit() {
  return (
    <div className="relative h-[27px] w-[95px] bg-[#075776]">
      <div className="absolute left-0 top-0 h-full w-[48px] bg-[#08688b]" />
      <div className="absolute left-2 top-[9px] flex gap-2">
        <span className="h-[6px] w-[6px] bg-[#00ffb7]" />
        <span className="h-[6px] w-[6px] bg-[#ffe900]" />
      </div>
      <div className="absolute right-2 top-[9px] h-[6px] w-[25px] bg-[#a8d6df]" />
    </div>
  );
}
