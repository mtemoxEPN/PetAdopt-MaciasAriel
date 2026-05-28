import { useState } from "react";
import { useResetPassword } from "../model/useResetPassword";

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valError, setValError] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);
  const { status, error, updatePassword } = useResetPassword();

  const handleSubmit = async () => {
    setDidSubmit(true);
    setValError("");
    if (password.length < 8) {
      setValError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setValError("Las contraseñas no coinciden.");
      return;
    }
    await updatePassword(password);
  };

  if (status === "loading") {
    return (
      <p style={{ textAlign: "center", color: "#78716c" }}>
        Verificando link...
      </p>
    );
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🐾</div>
        <h3 style={{ color: "#f97316", marginBottom: "8px" }}>
          ¡Contraseña actualizada!
        </h3>
        <p style={{ color: "#78716c" }}>
          Regresa a PetAdopt e inicia sesión con tu nueva contraseña.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Input nueva contraseña */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "10px", fontWeight: "700", color: "#78716c", letterSpacing: "2px", textTransform: "uppercase" }}>
          NUEVA CONTRASEÑA
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          style={inputStyle}
        />
      </div>

      {/* Input confirmar contraseña */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "10px", fontWeight: "700", color: "#78716c", letterSpacing: "2px", textTransform: "uppercase" }}>
          CONFIRMAR CONTRASEÑA
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repite tu contraseña"
          style={inputStyle}
        />
      </div>

      {/* Error */}
      {(valError || (didSubmit && error)) && (
        <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
          ⚠ {valError || (didSubmit ? error : null)}
        </p>
      )}

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={status === "updating"}
        style={{
          backgroundColor: status === "updating" ? "#fed7aa" : "#f97316",
          color: "#fff",
          border: "none",
          borderRadius: "100px",
          padding: "16px",
          fontSize: "15px",
          fontWeight: "700",
          cursor: status === "updating" ? "not-allowed" : "pointer",
          marginTop: "8px",
        }}
      >
        {status === "updating" ? "Actualizando..." : "Actualizar contraseña 🐾"}
      </button>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "#e7e5e4",
  borderRadius: "14px",
  padding: "14px 16px",
  fontSize: "15px",
  color: "#1c1917",
  backgroundColor: "#fafaf9",
  outline: "none",
  fontFamily: "inherit",
};