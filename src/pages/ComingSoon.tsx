import { Link } from "react-router-dom";
import Mark from "../components/Mark";
import "./ComingSoon.css";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="coming-soon">
      <Mark size={48} />
      <h1 className="coming-soon-title">{title}</h1>
      <p className="coming-soon-copy">Deze pagina is nog in de maak.</p>
      <Link to="/" className="coming-soon-link">
        ← Terug naar de homepage
      </Link>
    </div>
  );
}
