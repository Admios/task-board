import { clsx } from "clsx";
import classes from "./EmptyView.module.scss";

interface EmptyViewProps {
  onOpenStateDialog(): void;
}

export function EmptyView({ onOpenStateDialog }: EmptyViewProps) {
  return (
    <div className={clsx("card", classes.emptyContent)}>
      <header className="card-header">
        <p className="card-header-title">Your Workspace is empty!</p>
      </header>

      <div className="card-content">
        <div className="content">
          <p>You can create your first column below.</p>
        </div>
      </div>

      <footer className="card-footer">
        <a className="card-footer-item" onClick={onOpenStateDialog}>
          Create Column
        </a>
      </footer>
    </div>
  );
}
