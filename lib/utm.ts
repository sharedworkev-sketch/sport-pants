/**
 * Чтение маркетинговых меток из URL и окружения браузера.
 * Вызывается только на клиенте.
 */
export type LeadMeta = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  ttclid: string;
  referrer: string;
  userAgent: string;
};

export function readLeadMeta(): LeadMeta {
  const empty: LeadMeta = {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    ttclid: "",
    referrer: "",
    userAgent: "",
  };

  if (typeof window === "undefined") return empty;

  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k)?.slice(0, 300) ?? "";

  return {
    utm_source: get("utm_source"),
    utm_medium: get("utm_medium"),
    utm_campaign: get("utm_campaign"),
    utm_content: get("utm_content"),
    // TikTok прокидывает click id как ttclid
    ttclid: get("ttclid"),
    referrer: document.referrer.slice(0, 300),
    userAgent: navigator.userAgent.slice(0, 300),
  };
}
