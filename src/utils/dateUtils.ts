
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const isDateInPast = (date: string): boolean => {
  const today = new Date();
  const inputDate = new Date(date);
  
  // Set time to start of day for fair comparison
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  
  return inputDate < today;
};

export const getMinDate = (): string => {
  return getTodayDate();
};
