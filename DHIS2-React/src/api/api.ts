import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_DHIS2_BASE_URL,
  auth: {
    username: import.meta.env.VITE_DHIS2_USERNAME,
    password: import.meta.env.VITE_DHIS2_PASSWORD,
  },
});

export async function fetchProgram() {
  const res = await api.get(
    `/api/programs/${import.meta.env.VITE_PROGRAM_ID}`,
    {
      params: {
        fields:
          "id,name,programStages[programStageDataElements[dataElement[id,name,valueType]]]",
      },
    }
  );

  console.log("PROGRAM METADATA:", res.data); // just for DEBUG
  return res.data;
}

export async function createEvent(dataValues: any[]) {
  return api.post("/api/events", {
    program: import.meta.env.VITE_PROGRAM_ID,
    orgUnit: import.meta.env.VITE_ORG_UNIT_ID,
    eventDate: new Date().toISOString().slice(0, 10),
    dataValues,
  });
}
