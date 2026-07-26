import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { tokenStorage } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    const finish = async () => {
      if (!accessToken) {
        navigate("/login", { replace: true });
        return;
      }
      tokenStorage.setTokens(accessToken, refreshToken);
      try {
        await refreshProfile();
        navigate("/dashboard", { replace: true });
      } catch (err) {
        tokenStorage.clearTokens();
        navigate("/login", { replace: true });
      }
    };

    finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-teal-600 to-slate-900 text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <span className="text-sm text-teal-100">Signing you in…</span>
    </div>
  );
}