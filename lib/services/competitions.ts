import type { Competition, CompetitionEntrants, CompetitionPage } from "@/types/competition";

async function getJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status === 404 ? "Competition not found" : "Couldn't load competitions");
    return res.json();
}

export const competitionsService = () => ({
    list: (states: string[], pageSize = 12) =>
        getJson<CompetitionPage>(`/api/competitions?state=${encodeURIComponent(states.join(","))}&pageSize=${pageSize}`),
    get: (id: string) => getJson<Competition>(`/api/competitions/${encodeURIComponent(id)}`),
    entrants: (id: string) => getJson<CompetitionEntrants>(`/api/competitions/${encodeURIComponent(id)}/entrants`),
});
