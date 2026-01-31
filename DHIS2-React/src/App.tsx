import { useEffect, useState } from "react";
import { fetchProgram, createEvent } from "./api/api";
import DynamicEventForm from "./components/EventEntryForm";

function App() {
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    fetchProgram()
      .then(setProgram)
      .catch((err) => {
        console.error(err);
        alert("Failed to load program");
      });
  }, []);

  async function handleSubmit(dataValues: any[]) {
    await createEvent(dataValues);
    //alert("Event Data saved in DHIS2");
  }

  if (!program) return <p>Loading program...</p>;

  return (
    <div style={{ padding: 20 }}>
      <DynamicEventForm program={program} onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
