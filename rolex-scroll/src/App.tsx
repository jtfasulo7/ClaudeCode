import {
  BackgroundPaths,
  GlobalBackgroundPaths,
  ScrollStory,
} from "@/components/ui/background-paths";

export default function App() {
  return (
    <>
      <GlobalBackgroundPaths />
      <BackgroundPaths title="Welcome to Sybago AI" />
      <ScrollStory
        panels={[
          {
            title: "Intelligent Automation",
            subtitle:
              "We build and run the AI-powered backend for service businesses — capturing leads, booking appointments, and earning 5-star reviews around the clock.",
          },
          {
            title: "Built for Service Pros",
            subtitle:
              "Roofers, contractors, med spas, dentists, cleaners. If your business books appointments and lives on reviews, Sybago plugs straight into the tools you already use.",
          },
          {
            title: "Results on Autopilot",
            subtitle:
              "A pay-per-show guarantee, a 72-hour blueprint, and continuous optimization. You only pay for appointments that actually show up.",
          },
        ]}
      />
    </>
  );
}
