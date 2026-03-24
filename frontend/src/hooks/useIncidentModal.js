import { useState } from "react";

export const useIncidentModal = (initialForm) => {
  const [show, setShow] = useState(false);
  const [incidentId, setIncidentId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const open = (id) => {
    setIncidentId(id);
    setForm(initialForm);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setIncidentId(null);
    setForm(initialForm);
  };

  return {
    show,
    incidentId,
    form,
    setForm,
    submitting,
    setSubmitting,
    open,
    close,
  };
};
