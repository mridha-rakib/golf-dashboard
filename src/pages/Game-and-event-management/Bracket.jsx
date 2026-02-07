//App.jsx
// import "./App.css";
import React from "react";
import TournamentBracket from "../../components/Game-and-event-management/TournamentBracket";
import { useState, useEffect } from "react";

function Bracket() {
  const [tournamentData, setTournamentData] = useState(null);

  // Example function to fetch data from backend
  const fetchTournamentData = async () => {
    try {
      // Replace this with your actual API call
      // const response = await fetch('/api/tournament-data');
      // const data = await response.json();

      // Example dynamic data structure
      const dynamicData = {
        title: "Championship 2025",
        date: "FRIDAY, SEPTEMBER 15, 2025",
        time: "3:00 PM",
        participants: 16,
        rounds: {
          firstRound: [
            {
              participant1: "Player A",
              participant2: "Player B",
              winner: "Player A",
            },
            {
              participant1: "Player C",
              participant2: "Player D",
              winner: "Player C",
            },
            {
              participant1: "Player E",
              participant2: "Player F",
              winner: "Player F",
            },
            {
              participant1: "Player G",
              participant2: "Player H",
              winner: "Player G",
            },
            {
              participant1: "Player I",
              participant2: "Player J",
              winner: "Player I",
            },
            {
              participant1: "Player K",
              participant2: "Player L",
              winner: "Player L",
            },
            {
              participant1: "Player M",
              participant2: "Player N",
              winner: "Player M",
            },
            {
              participant1: "Player O",
              participant2: "Player P",
              winner: "Player P",
            },
          ],
          quarterfinals: [
            {
              participant1: "Player A",
              participant2: "Player C",
              winner: "Player A",
            },
            {
              participant1: "Player F",
              participant2: "Player G",
              winner: "Player F",
            },
            {
              participant1: "Player I",
              participant2: "Player L",
              winner: "Player I",
            },
            {
              participant1: "Player M",
              participant2: "Player P",
              winner: "Player P",
            },
          ],
          semifinals: [
            {
              participant1: "Player A",
              participant2: "Player F",
              winner: "Player A",
            },
            {
              participant1: "Player I",
              participant2: "Player P",
              winner: "Player P",
            },
          ],
          finals: [
            {
              participant1: "Player A",
              participant2: "Player P",
              winner: "Player A",
            },
          ],
        },
      };

      setTournamentData(dynamicData);
    } catch (error) {
      console.error("Error fetching tournament data:", error);
    }
  };

  useEffect(() => {
    // Uncomment to fetch real data
    // fetchTournamentData();
  }, []);

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <div className="md:transform-none  md:w-auto w-[100vh] md:h-auto h-[100vw]">
        <TournamentBracket tournamentData={tournamentData} />
      </div>
    </div>
  );
}

export default Bracket;
