// src/components/TournamentBracket.jsx
import { ChampionIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import champion from "../../assets/logos/champion.svg";

const TrophyIcon = () => (
  <svg
    className="w-12 h-12 text-amber-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M6 2h12v6.31l-2 2V4H8v6.31l-2-2V2zM4 6v6c0 4.42 3.58 8 8s8-3.58 8-8V6h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2V0H4v2H2c-1.1 0-2 .9-2 2s.9 2 2 2h2zm16 6c0 3.31-2.69 6-6 6s-6-2.69-6-6V4h12v8z" />
    <path d="M12 15c-1.66 0-3-1.34-3-3V9c0-1.66 1.34-3 3-3s3 1.34 3 3v3c0 1.66-1.34 3-3 3z" />
  </svg>
);

const ParticipantCard = ({ name, isWinner = false, isChampion = false }) => (
  <div
    className={`p-2 border rounded text-md transition-colors duration-200 w-28 h-8 flex items-center justify-center ${
      isChampion
        ? "bg-amber-50 border-amber-400 text-amber-900 font-bold"
        : isWinner
        ? "bg-blue-50 border-blue-300 text-blue-900"
        : "bg-white border-gray-300 hover:bg-gray-50"
    }`}
  >
    {name}
  </div>
);

const BracketMatch = ({
  participant1,
  participant2,
  winner,
  showConnector = false,
  connectorDirection = "right",
}) => (
  <div className="relative">
    <div className="flex flex-col gap-1 relative z-10">
      <ParticipantCard name={participant1} isWinner={winner === participant1} />
      <ParticipantCard name={participant2} isWinner={winner === participant2} />
    </div>

    {/* Bracket connector lines */}
    {showConnector && (
      <div
        className={`absolute top-0 ${
          connectorDirection === "right" ? "-right-6" : "-left-6"
        } h-full`}
      >
        <svg width="24" height="72" style={{ overflow: "visible" }}>
          {connectorDirection === "right" ? (
            <>
              <line
                x1="0"
                y1="16"
                x2="12"
                y2="16"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="56"
                x2="12"
                y2="56"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="16"
                x2="12"
                y2="56"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="36"
                x2="24"
                y2="36"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
            </>
          ) : (
            <>
              <line
                x1="24"
                y1="16"
                x2="12"
                y2="16"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
              <line
                x1="24"
                y1="56"
                x2="12"
                y2="56"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="16"
                x2="12"
                y2="56"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
              <line
                x1="12"
                y1="36"
                x2="0"
                y2="36"
                stroke="#9D4C1D"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>
    )}
  </div>
);

const BracketRound = ({
  title,
  matches,
  className = "",
  showConnectors = false,
  connectorDirection = "right",
  marginTop = 0,
}) => (
  <div className={`flex flex-col ${className}`} style={{ marginTop }}>
    <h3 className="text-center text-lg font-semibold text-gray-700 mb-4 h-4">
      {title}
    </h3>
    <div
      className="flex flex-col justify-center"
      style={{
        gap:
          matches.length > 2 ? "16px" : matches.length === 2 ? "80px" : "160px",
      }}
    >
      {matches.map((match, index) => (
        <BracketMatch
          key={index}
          {...match}
          showConnector={showConnectors}
          connectorDirection={connectorDirection}
        />
      ))}
    </div>
  </div>
);

const TournamentBracket = ({ tournamentData }) => {
  // Default data structure
  const defaultData = {
    title: "Championship 2025",
    date: "FRIDAY, SEPTEMBER 15, 2025",
    time: "3:00 PM",
    participants: 16,
    rounds: {
      firstRound: [
        { participant1: "Player A", participant2: "Player B" },
        { participant1: "Player C", participant2: "Player D" },
        { participant1: "Player E", participant2: "Player F" },
        { participant1: "Player G", participant2: "Player H" },
        { participant1: "Player I", participant2: "Player J" },
        { participant1: "Player K", participant2: "Player L" },
        { participant1: "Player M", participant2: "Player N" },
        { participant1: "Player O", participant2: "Player P" },
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
        { participant1: "Player A", participant2: "Player F" },
        { participant1: "Player I", participant2: "Player P" },
      ],
      finals: [{ participant1: "Player A", participant2: "Player P" }],
    },
  };

  const data = tournamentData || defaultData;

  const getLeftSideMatches = (round, total) => {
    const half = Math.ceil(total / 2);
    return round.slice(0, half);
  };

  const getRightSideMatches = (round, total) => {
    const half = Math.ceil(total / 2);
    return round.slice(half);
  };

  // Get the winner from finals
  const getChampion = () => {
    if (
      data.rounds.finals &&
      data.rounds.finals[0] &&
      data.rounds.finals[0].winner
    ) {
      return data.rounds.finals[0].winner;
    }
    return "TBD"; // To Be Determined
  };

  return (
    <div className="">
      <div className=" mx-auto bg-white rounded-lg  overflow-hidden">
        {/* Header */}
        <div className=" text-center border-b">
          <h1 className="text-xl font-bold text-gray-800 ">{data.title}</h1>
          <p className="text-xs text-gray-600">
            {data.time} | {data.date}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Participants ({data.participants})
          </p>
        </div>

        {/* Bracket Container */}
        <div className=" pt-50    ">
          <div
            className="flex items-center justify-center min-w-max"
            style={{ gap: "60px" }}
          >
            {/* Left Side Bracket */}
            <div className="flex items-center " style={{ gap: "40px" }}>
              {/* Round 1 Left */}
              {data.rounds.firstRound && (
                <BracketRound
                  title="Round 1"
                  matches={getLeftSideMatches(
                    data.rounds.firstRound,
                    data.rounds.firstRound.length
                  )}
                  showConnectors={true}
                  connectorDirection="right"
                />
              )}

              {/* Quarterfinals Left */}
              {data.rounds.quarterfinals && (
                <BracketRound
                  title="Quarterfinals"
                  matches={getLeftSideMatches(
                    data.rounds.quarterfinals,
                    data.rounds.quarterfinals.length
                  )}
                  showConnectors={true}
                  connectorDirection="right"
                />
              )}

              {/* Semifinals Left */}
              {data.rounds.semifinals && data.rounds.semifinals.length > 0 && (
                <BracketRound
                  title="Semifinals"
                  matches={[data.rounds.semifinals[0]]}
                  showConnectors={true}
                  connectorDirection="right"
                />
              )}
            </div>

            {/* Center - Trophy, Finals, and Champion */}
            <div className="flex flex-col items-center justify-center -translate-y-30">
              <div className="">
                <img src={champion} alt="Champion" className="w-20 h-20" />
              </div>
              {/* Champion (Winner of Finals) */}
              <div className=" flex flex-col items-center mt-5 mb-5">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Champion
                </div>
                <ParticipantCard name={getChampion()} isChampion={true} />
              </div>

              {/* Finals Match */}
              {data.rounds.finals && (
                <BracketRound
                  title="Finals"
                  matches={data.rounds.finals}
                  className="items-center translate-y-7 "
                />
              )}

              
            </div>

            {/* Right Side Bracket */}
            <div className="flex items-center" style={{ gap: "40px" }}>
              {/* Semifinals Right */}
              {data.rounds.semifinals && data.rounds.semifinals.length > 1 && (
                <BracketRound
                  title="Semifinals"
                  matches={[data.rounds.semifinals[1]]}
                  showConnectors={true}
                  connectorDirection="left"
                />
              )}

              {/* Quarterfinals Right */}
              {data.rounds.quarterfinals && (
                <BracketRound
                  title="Quarterfinals"
                  matches={getRightSideMatches(
                    data.rounds.quarterfinals,
                    data.rounds.quarterfinals.length
                  )}
                  showConnectors={true}
                  connectorDirection="left"
                />
              )}

              {/* Round 1 Right */}
              {data.rounds.firstRound && (
                <BracketRound
                  title="Round 1"
                  matches={getRightSideMatches(
                    data.rounds.firstRound,
                    data.rounds.firstRound.length
                  )}
                  showConnectors={true}
                  connectorDirection="left"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
