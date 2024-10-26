"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ScoreContextType {
  scores: Record<string, number>;
  stars: number;
  updateScore: (testId: string | number, score: number) => Promise<void>;
  getScore: (testId: string | number) => number;
  refetchScores: () => Promise<void>;
  updateStars: (newStars: number) => void;
}

const ScoreContext = createContext<ScoreContextType>({
  scores: {},
  stars: 0,
  updateScore: async () => {},
  getScore: () => 0,
  refetchScores: async () => {},
  updateStars: () => {},
});

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [stars, setStars] = useState<number>(0);

  const userEmail = session?.user?.email;

  useEffect(() => {
    const fetchScores = async () => {
      if (status === "authenticated" && userEmail) {
        try {
          const response = await fetch(`/api/update-score?email=${encodeURIComponent(userEmail)}`, {
            method: 'GET',
          });

          if (response.ok) {
            const fetchedScores = await response.json();
            console.log("Raw fetched scores from API:", fetchedScores);

            const scoresMap = fetchedScores.reduce((acc: Record<string, number>, item: any) => {
              const testId = item.test_id;
              acc[testId] = Math.round(item.score);
              return acc;
            }, {});

            console.log("Mapped scores for context:", scoresMap);
            setScores(scoresMap);
          } else {
            console.error("Failed to fetch scores from API:", response.status, response.statusText);
          }
        } catch (error) {
          console.error("Error fetching scores:", error);
        }
      } else if (status === "unauthenticated") {
        console.log("User not authenticated.");
      }
    };

    if (status === "authenticated") {
      fetchScores();
    }
  }, [userEmail, status]);

  const refetchScores = async () => {
    if (status === "authenticated" && userEmail) {
      try {
        const response = await fetch(`/api/update-score?email=${encodeURIComponent(userEmail)}`, {
          method: 'GET',
        });

        if (response.ok) {
          const fetchedScores = await response.json();
          console.log("Refetched scores from API:", fetchedScores);

          const scoresMap = fetchedScores.reduce((acc: Record<string, number>, item: any) => {
            const testId = item.test_id;
            acc[testId] = Math.round(item.score);
            return acc;
          }, {});

          console.log("Mapped refetched scores:", scoresMap);
          setScores(scoresMap);
        } else {
          console.error("Failed to refetch scores from API:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error refetching scores:", error);
      }
    }
  };

  const testIdToTaskMap: Record<string, string> = {
    "1": "task1Formal",
    "2": "task1SemiFormal",
    "3": "task1Informal",
    "4": "task1Mix",
    "5": "task2Opinion",
    "6": "task2Argumentative",
    "7": "task2Combined",
    "ER1": "EverydayTopics1",
    "ER2": "EverydayTopics2",
    "ER3": "EverydayTopics3",
    "WR1": "WorkRelated1",
    "WR2": "WorkRelated2",
    "WR3": "WorkRelated3",
    "GI1": "GeneralInterest1",
    "GI2": "GeneralInterest2",
    "GI3": "GeneralInterest3",
    "PE1": "PracticeExam1",
    "PE2": "PracticeExam2",
    "PE3": "PracticeExam3",
  };

  const updateScore = async (testId: string | number, score: number) => {
    console.log("updateScore called with:", { testId, score });
    console.log("Current userEmail:", userEmail);
    console.log("Current session status:", status);

    if (!userEmail) {
      console.error("userEmail is not available. Make sure the user is authenticated.");
      return;
    }

    const taskKey = testIdToTaskMap[testId.toString()];
    if (!taskKey) {
      console.error(`Invalid testId: ${testId}. Valid testIds are:`, Object.keys(testIdToTaskMap));
      return;
    }

    try {
      const payload = {
        email: userEmail,
        testId: testId.toString(),
        score: Math.round(score),
      };
      console.log("Sending update request:", payload);

      const response = await fetch('/api/update-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to update score: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const updatedScore = await response.json();
      console.log("Updated score data:", updatedScore);

      setScores(prevScores => {
        const newScores = { ...prevScores, [taskKey]: updatedScore.score };
        console.log(`Updated scores after POST request:`, newScores);
        return newScores;
      });
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const getScore = (testId: string | number): number => {
    const taskKey = testIdToTaskMap[testId.toString()];
    if (!taskKey) {
      console.error(`Invalid testId: ${testId}. Valid testIds are:`, Object.keys(testIdToTaskMap));
      return 0;
    }

    const score = scores[testId] ?? 0;
    console.log(`getScore called for testId: ${testId}, returning score: ${Math.round(score)}`);
    return Math.round(score);
  };

  const updateStars = (newStars: number) => {
    setStars(newStars);
    console.log(`Updated stars: ${newStars}`);
  };

  return (
    <ScoreContext.Provider value={{ scores, stars, updateScore, getScore, refetchScores, updateStars }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);

export default function Component() {
  const { scores, stars, updateScore, getScore, refetchScores, updateStars } = useScore();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Current scores:", scores);
    console.log("Current stars:", stars);
    console.log("Session status:", status);
    console.log("User Email:", session?.user?.email);

    console.log("Test getScore with testId 'ER1':", getScore('ER1'));
  }, [scores, stars, session, status, getScore]);

  return null;
}