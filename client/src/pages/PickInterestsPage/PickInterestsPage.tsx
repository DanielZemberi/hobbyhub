import React, { useState } from "react";
import interestsData from "../../data/interests.json";
import classNames from "classnames";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PickInterestsPage: React.FC = () => {
  const [activeInterest, setActiveInterest] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handlePick = (topic: string) => {
    setPicked((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((item) => item !== topic);
      }

      return [...prev, topic];
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:4000/interests/${userId}/add`, {
        interests: picked,
      });
      navigate("/lobby");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="max-w-5xl flex flex-wrap gap-2">
        {interestsData.map((interest) => (
          <div key={interest.title}>
            <button
              onClick={() => setActiveInterest(interest.title)}
              className={classNames({
                "border-green-400": activeInterest === interest.title,
              })}
            >
              {interest.title}
            </button>
            {activeInterest === interest.title ? (
              <div className="flex flex-wrap gap-2 bg-white my-2 p-4 w-full">
                {interest.topics.map((topic) => (
                  <button
                    onClick={() => handlePick(topic)}
                    className={classNames({
                      "bg-white text-black border-green-400":
                        picked.includes(topic),
                    })}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-2">{picked.join(", ")}</div>
      <button className="mt-5" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default PickInterestsPage;
