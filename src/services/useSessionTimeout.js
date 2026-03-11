// src/hooks/useSessionTimeout.js
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/api/authApi";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes idle → logout

const ACTIVITY_EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];

export default function useSessionTimeout() {
  const navigate   = useNavigate();
  const timerRef   = useRef(null);

  const logout = useCallback(async () => {
    try { await logoutUser(); } catch (_) {}
    navigate("/login", { replace: true });
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, IDLE_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    // Start timer immediately
    resetTimer();

    // Reset on any user activity
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);
}