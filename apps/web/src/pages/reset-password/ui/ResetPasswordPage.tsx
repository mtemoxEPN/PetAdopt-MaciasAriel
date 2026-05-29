import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResetPassword } from "@/features/reset-password/model/useResetPassword";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Check, Loader2, AlertTriangle, PawPrint } from "lucide-react";
import type { CSSProperties } from "react";

/* ─── Variants ─── */

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const blurFadeUp = {
  hidden: { opacity: 0, filter: "blur(20px)", y: 40 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: {
    opacity: 0,
    filter: "blur(12px)",
    y: -24,
    transition: { duration: 0.3 },
  },
};

const iconPop = {
  hidden: { opacity: 0, scale: 0, rotate: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 14, delay: 0.05 },
  },
};

const liquidGlassBase: CSSProperties = {
  position: "relative",
  background: "rgba(255, 255, 255, 0.01)",
  backgroundBlendMode: "luminosity",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
  borderRadius: 32,
};

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260520_111942_8fc50f9e-4dfd-45c1-81bb-d93342a23d87.mp4";

/* ─── Page Shell ─── */

export const ResetPasswordPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {/* ── Video Background (z-index: 0) ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={s.bgVideo}
        src={VIDEO_URL}
      />

      {/* ── Blur Overlay (z-index: 1) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={s.blurOverlay}
      />

      {/* ── Content Layer (z-index: 10) ── */}
      <div style={s.layout}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(16px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          style={s.card}
        >
          <div style={s.cardGlowBorder} />

          <motion.div variants={blurFadeUp} style={s.brand}>
            <PawPrint size={16} strokeWidth={2} color="#fff" />
            <span style={s.brandText}>PetAdopt</span>
          </motion.div>

          <ResetPasswordForm />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Form ─── */

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valError, setValError] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);
  const { status, error, updatePassword } = useResetPassword();

  const handleSubmit = async () => {
    setDidSubmit(true);
    setValError("");
    if (password.length < 8) {
      setValError("Requiere un minimo de 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setValError("Las contrasenas no coinciden.");
      return;
    }
    await updatePassword(password);
  };

  return (
    <AnimatePresence mode="wait">
      {/* ── Loading State ── */}
      {status === "loading" && (
        <motion.div
          key="loading"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={s.centerState}
        >
          <motion.div variants={iconPop} style={s.iconRing}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            >
              <Loader2 size={42} strokeWidth={1.5} color="#fff" />
            </motion.div>
          </motion.div>
          <motion.h2 variants={blurFadeUp} style={s.title}>
            Verificando Seguridad
          </motion.h2>
          <motion.p variants={blurFadeUp} style={s.subtitle}>
            Comprobando credenciales...
          </motion.p>
        </motion.div>
      )}

      {/* ── Success State ── */}
      {status === "success" && (
        <motion.div
          key="success"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={s.centerState}
        >
          <motion.div
            variants={iconPop}
            style={{
              ...s.iconRing,
              borderColor: "rgba(52,211,153,0.3)",
              background: "rgba(52,211,153,0.06)",
            }}
          >
            <Check size={42} strokeWidth={2} color="#34d399" />
          </motion.div>
          <motion.h2 variants={blurFadeUp} style={s.title}>
            Actualizacion Completa
          </motion.h2>
          <motion.p variants={blurFadeUp} style={s.subtitle}>
            Tu nueva contrasena esta configurada. Regresa a PetAdopt para
            iniciar sesion.
          </motion.p>
        </motion.div>
      )}

      {/* ── Form State ── */}
      {status !== "loading" && status !== "success" && (
        <motion.div
          key="form"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={s.formWrapper}
        >
          <motion.h2 variants={blurFadeUp} style={s.title}>
            Nueva Contrasena
          </motion.h2>
          <motion.p variants={blurFadeUp} style={s.subtitleForm}>
            Crea una contrasena segura para tu cuenta.
          </motion.p>

          <motion.div variants={blurFadeUp} style={{ width: "100%" }}>
            <Input
              label="Nueva contrasena"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
          </motion.div>

          <motion.div variants={blurFadeUp} style={{ width: "100%" }}>
            <Input
              label="Confirmar contrasena"
              type="password"
              value={confirm}
              onChange={setConfirm}
              placeholder="••••••••"
            />
          </motion.div>

          {/* ── Error Box ── */}
          <AnimatePresence mode="wait">
            {(valError || (didSubmit && error)) && (
              <motion.div
                key="error-box"
                initial={{ opacity: 0, y: -8, scale: 0.96, height: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, height: "auto" }}
                exit={{ opacity: 0, y: -8, scale: 0.96, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={s.errorBox}
              >
                <AlertTriangle size={16} strokeWidth={2} color="#f87171" />
                <span>{valError || (didSubmit ? error : null)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={blurFadeUp} style={{ width: "100%" }}>
            <Button onClick={handleSubmit} isLoading={status === "updating"}>
              {status === "updating" ? "Guardando..." : "Confirmar cambio"}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─── Styles ─── */

const s: Record<string, CSSProperties> = {
  bgVideo: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
    pointerEvents: "none",
  },
  blurOverlay: {
    position: "fixed",
    inset: 0,
    backdropFilter: "blur(60px)",
    WebkitBackdropFilter: "blur(60px)",
    maskImage: "linear-gradient(to top, black 0%, transparent 45%)",
    WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 45%)",
    zIndex: 1,
    pointerEvents: "none",
  },
  layout: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    position: "relative",
    zIndex: 10,
  },
  card: {
    ...liquidGlassBase,
    width: "100%",
    maxWidth: 480,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  cardGlowBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: 32,
    padding: "1.4px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%)",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    pointerEvents: "none",
    zIndex: 1,
  },
  brand: {
    padding: "40px 32px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
    zIndex: 2,
  },
  brandText: {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: "#fff",
  },
  centerState: {
    padding: "44px 40px 60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },
  formWrapper: {
    padding: "36px 40px 52px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 20,
    position: "relative",
    zIndex: 2,
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: -1.2,
    margin: 0,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "#9ca3af",
    lineHeight: 1.65,
    maxWidth: "85%",
    margin: 0,
    fontWeight: 400,
  },
  subtitleForm: {
    fontSize: 15,
    color: "#9ca3af",
    lineHeight: 1.65,
    margin: 0,
    marginBottom: 4,
    fontWeight: 400,
  },
  errorBox: {
    width: "100%",
    background: "rgba(239,68,68,0.06)",
    color: "#fca5a5",
    padding: "14px 18px",
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid rgba(239,68,68,0.12)",
    lineHeight: 1.4,
  },
};
