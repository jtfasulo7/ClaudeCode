import { Container } from "../Container";

export function CredibilityBar() {
  return (
    <div className="border-b border-line bg-paper-soft">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center sm:py-6">
          <p className="eyebrow text-text-soft">Active sellers on</p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[15px] font-medium text-ink">
            <span className="display tracking-tight">Whatnot</span>
            <span aria-hidden="true" className="hidden sm:inline-block h-1 w-1 rounded-full bg-mute" />
            <span className="display tracking-tight">Amazon</span>
            <span aria-hidden="true" className="hidden sm:inline-block h-1 w-1 rounded-full bg-mute" />
            <span className="text-text">and growing e-commerce channels</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
