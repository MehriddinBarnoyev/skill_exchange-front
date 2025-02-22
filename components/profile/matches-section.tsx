"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserMatches } from "@/lib/api";

interface Match {
  id: number;
  partnerId: string;
  partnerName: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export function MatchesSection({ userId }: { userId: string }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated.");
          return;
        }

        const userMatches = await getUserMatches(userId,);
        setMatches(userMatches);
      } catch (err: any) {
        setError("Failed to load matches.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Matches</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : matches.length === 0 ? (
          <p className="text-gray-500">No matches found.</p>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="mb-2 p-2 border rounded">
              <span className="font-semibold">{match.partnerName}</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-sm ${
                  match.status === "Accepted"
                    ? "bg-green-100 text-green-800"
                    : match.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {match.status}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
