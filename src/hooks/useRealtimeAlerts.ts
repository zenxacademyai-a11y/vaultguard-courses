import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SecurityAlert {
  id: string;
  type: "warning" | "error" | "info";
  msg: string;
  time: string;
}

export const useRealtimeAlerts = (userId: string | undefined) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    { id: "1", type: "warning", msg: "Suspicious login attempt from new IP — user@gmail.com", time: "2 min ago" },
    { id: "2", type: "error", msg: "Screen recording detected — student45@mail.com", time: "15 min ago" },
    { id: "3", type: "info", msg: "New device registered — pro_learner@outlook.com", time: "1 hr ago" },
  ]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("security-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "playback_logs",
        },
        (payload) => {
          const log = payload.new as any;
          const alert: SecurityAlert = {
            id: log.id,
            type: log.anomaly_flag ? "error" : "info",
            msg: log.anomaly_flag
              ? `Anomaly detected — ${log.watermark_id || "unknown user"} from ${log.ip_address || "unknown IP"}`
              : `New playback session — ${log.watermark_id || "user"} from ${log.ip_address || "unknown IP"}`,
            time: "Just now",
          };
          setAlerts((prev) => [alert, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return alerts;
};
