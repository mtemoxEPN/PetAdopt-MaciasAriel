import { useConfirmEmail } from "@/features/confirm-email/model/useConfirmEmail";
import type { CSSProperties } from "react";

export const ConfirmEmailPage = () => {
  const { status, error } = useConfirmEmail();

  const content = () => {
    if (status === "loading") return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
        <h2 style={{ color: "#1c1917" }}>Confirmando tu cuenta...</h2>
        <p style={{ color: "#78716c" }}>Un momento por favor.</p>
      </div>
    );
    if (status === "error") return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
        <h2 style={{ color: "#dc2626" }}>Link inválido</h2>
        <p style={{ color: "#78716c" }}>{error}</p>
      </div>
    );
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>🐾</div>
        <h2 style={{ color: "#f97316", marginBottom: "12px" }}>
          ¡Cuenta confirmada!
        </h2>
        <p style={{ color: "#44403c", marginBottom: "8px" }}>
          Tu cuenta ha sido verificada exitosamente.
        </p>
        <p style={{ color: "#78716c", fontWeight: "600" }}>
          Regresa a la app PetAdopt e inicia sesión.
        </p>
      </div>
    );
  };

  return (
    <main style={layout}>
      <div style={card}>
        <div style={header}>
          <span style={{ fontSize: "42px" }}>🐾</span>
          <h1 style={{ color: "#fff", margin: "8px 0 4px", fontSize: "22px" }}>
            PetAdopt
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "14px" }}>
            Confirmación de cuenta
          </p>
        </div>
        <div style={{ padding: "36px 32px" }}>{content()}</div>
      </div>
    </main>
  );
};

const layout: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "24px",
};
const card: CSSProperties = {
  background: "#fff", borderRadius: "20px",
  boxShadow: "0 20px 60px rgba(249,115,22,0.15)",
  width: "100%", maxWidth: "420px", overflow: "hidden",
};
const header: CSSProperties = {
  background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  padding: "28px 32px", textAlign: "center",
};