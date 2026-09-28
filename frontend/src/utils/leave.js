export const leaveTypeLabel = (type) =>
  ({ casual: "Casual Leave", sick: "Sick Leave", earned: "Earned Leave" }[type] || type);

export const formatDate = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};
