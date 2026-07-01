import { useRef, useState } from "react";
import Mark from "../../components/Mark";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
  error: string;
}

export default function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  function submit() {
    onLogin(email.trim(), password);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") submit();
  }

  return (
    <div className="dash-login-page">
      <div className="dash-login-card">
        <div className="dash-login-brand">
          <Mark size={30} />
          <span className="brand-text">
            <span className="gradient-text">LED</span>sation
          </span>
        </div>
        <h1 className="dash-login-title">Beheerderslogin</h1>
        <p className="dash-login-sub">Log in om aanvragen en de verhuuragenda te beheren.</p>
        <label className="dash-login-label">E-mail</label>
        <input
          ref={emailRef}
          type="text"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="jij@bedrijf.nl"
          className="dash-login-input"
        />
        <label className="dash-login-label">Wachtwoord</label>
        <input
          ref={passRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="••••••••"
          className="dash-login-input"
        />
        {error && <div className="dash-login-error">{error}</div>}
        <button className="dash-login-submit" onClick={submit} disabled={loading}>
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </div>
    </div>
  );
}
