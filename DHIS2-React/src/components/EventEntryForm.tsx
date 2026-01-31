import React, { useEffect, useState } from "react";

export default function EventEntryForm({ program, onSubmit }: any) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Submission UI state
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitting, setSubmitting] = useState(false);

  const stage = program.programStages[0];

  // Extracting DHIS2 data elements
  const dataElements = stage.programStageDataElements.map(
    (psde: any) => psde.dataElement,
  );

  // - Config the Symptoms -
  const HAS_SYMPTOMS_ID = "f9TJA9V2oI9";

  const SYMPTOM_IDS = ["j3GG4J9zxP8", "CfwxiADvGmN", "EnOBREBKPRG"];

  // handling the symptom changes
  function handleChange(deId: string, value: string) {
    setFormData((prev) => {
      const updated = { ...prev, [deId]: value };

      if (deId === HAS_SYMPTOMS_ID && value !== "true") {
        SYMPTOM_IDS.forEach((id) => delete updated[id]);
      }

      return updated;
    });
  }

  // Rendering the imputs based on dhis2 valuetype
  function renderInput(de: any) {
    switch (de.valueType) {
      case "TEXT":
        return (
          <input
            type="text"
            className="form-control"
            value={formData[de.id] || ""}
            onChange={(e) => handleChange(de.id, e.target.value)}
          />
        );

      case "NUMBER":
        return (
          <input
            type="number"
            className="form-control"
            value={formData[de.id] || ""}
            onChange={(e) => handleChange(de.id, e.target.value)}
          />
        );

      case "BOOLEAN":
        return (
          <select
            className="form-select"
            value={formData[de.id] ?? ""}
            onChange={(e) => handleChange(de.id, e.target.value)}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      case "TRUE_ONLY":
        return (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData[de.id] === "true"}
              onChange={(e) =>
                handleChange(de.id, e.target.checked ? "true" : "")
              }
            />
          </div>
        );

      default:
        <div className="text-muted">
          return <em>Unsupported type: {de.valueType}</em>;
        </div>;
    }
  }

  // - Save the Event -
  async function handleSubmit() {
    try {
      setSubmitting(true);
      setSubmitStatus("idle");

      const dataValues = Object.entries(formData)
        .filter(([_, value]) => value !== "" && value !== undefined)
        .map(([dataElement, value]) => ({
          dataElement,
          value,
        }));

      // block empty submission
      if (dataValues.length === 0) {
        setSubmitStatus("error");
        setSubmitting(false);
        return;
      }

      await onSubmit(dataValues);

      setSubmitStatus("success");
      setFormData({}); // reset the forms
    } catch (e) {
      console.error(e);
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  }
  // success message timeout
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-primary mb-3">
                DHIS2 Event Form: {program.name}
              </h4>

              {dataElements.map((de: any) => {
                // Hide symptom checkboxes unless Has symptoms == true
                if (
                  SYMPTOM_IDS.includes(de.id) &&
                  formData[HAS_SYMPTOMS_ID] !== "true"
                ) {
                  return null;
                }
                const isSymptom = SYMPTOM_IDS.includes(de.id);

                return (
                  <div
                    key={de.id}
                    className={`mb-3 ${isSymptom ? "ms-4 border-start ps-3" : ""}`}
                  >
                    <label className="form-label">{de.name}</label>
                    <br />
                    {renderInput(de)}
                  </div>
                );
              })}

              <br />

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleSubmit}
              >
                {submitting ? "Saving..." : "SAVE"}
              </button>

              {/* Success or Error messages */}

              {submitStatus === "success" && (
                <div className="alert alert-success">
                  ✅ Event data saved successfully
                </div>
              )}

              {submitStatus === "error" && (
                <div className="alert alert-warning">
                  ⚠️ Please fill at least one field before submitting
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
