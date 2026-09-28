/**
 * Re-mounts on every navigation, so each page eases in rather than snapping into place.
 * Pure CSS (fill-mode "both"), so the page is never left hidden if scripts are slow or off.
 */
export default function WebTemplate({ children }: { children: React.ReactNode }) {
    return <div className="animate-page-in">{children}</div>
}
