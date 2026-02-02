import axios from "axios";

const BASE_URL = import.meta.env.VITE_DHIS2_BASE_URL;
const USERNAME = import.meta.env.VITE_DHIS2_USERNAME;
const PASSWORD = import.meta.env.VITE_DHIS2_PASSWORD;
export const PROGRAM_ID = import.meta.env.VITE_PROGRAM_ID;
export const ORG_UNIT_ID = import.meta.env.VITE_ORG_UNIT_ID;


const api = axios.create({
  baseURL: BASE_URL,
  auth: {
    username: USERNAME,
    password: PASSWORD,
  },
});

export async function fetchProgram() {
  const res = await api.get(
    `/api/programs/${PROGRAM_ID}`,
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
    program: PROGRAM_ID,
    orgUnit: ORG_UNIT_ID,
    eventDate: new Date().toISOString().slice(0, 10),
    dataValues,
  });
}
