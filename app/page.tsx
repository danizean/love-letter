import { Metadata } from "next";
import ClientLetterOrchestrator from "@/components/ClientLetterOrchestrator";

export const metadata: Metadata = {
  title: "A Love Letter",
  description: "A cinematic digital love letter.",
};

export default function Home() {
  return (
    <ClientLetterOrchestrator />
  );
}
