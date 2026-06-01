export const formatDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const normalizeString = (str = "") =>
  String(str).trim().toLowerCase().replace(/\s+/g, "");

export const formatDateShort = () => {
  const date = new Date();
  const exactDate = formatDate(date).split(", ")[1];
  const exactYear = formatDate(date).split(", ")[2];
  return exactDate + " " + exactYear;
};

export const formatISODate = () => {
  return new Date().toISOString().split("T")[0];
};
