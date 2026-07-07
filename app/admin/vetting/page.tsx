import { redirect } from "next/navigation";

/** Legacy route — vetting lives under the dashboard folder structure. */
export default function AdminVettingRedirectPage() {
    redirect("/dashboard/vetting");
}
