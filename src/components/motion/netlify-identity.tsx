import { useEffect } from "react";

type Identity = {
  on: (event: string, cb: (user?: unknown) => void) => void;
};

const TOKEN_HASH = /(recovery_token|invite_token|confirmation_token|access_token)=/;

export function NetlifyIdentity() {
  useEffect(() => {
    const hash = window.location.hash || "";
    if (TOKEN_HASH.test(hash) && !window.location.pathname.startsWith("/admin")) {
      window.location.replace("/admin/" + hash);
      return;
    }

    let tries = 0;
    const bind = () => {
      const ni = (window as Window & { netlifyIdentity?: Identity }).netlifyIdentity;
      if (!ni) return false;
      ni.on("init", (user) => {
        if (!user) {
          ni.on("login", () => {
            if (!window.location.pathname.startsWith("/admin")) {
              document.location.href = "/admin/";
            }
          });
        }
      });
      return true;
    };
    if (bind()) return;
    const id = window.setInterval(() => {
      tries += 1;
      if (bind() || tries > 40) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
