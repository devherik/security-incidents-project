export const orderByField = <T extends Record<string, unknown>>({
  list,
  field,
  descending = false,
}: {
  list: T[];
  field: keyof T;
  descending?: boolean;
}): T[] => {
  return list.sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    if (valueA < valueB) return descending ? 1 : -1;
    if (valueA > valueB) return descending ? -1 : 1;
    return 0;
  });
};

export const orderByDate = <T extends Record<string, unknown>>({
  list,
  dateField,
  descending = false,
}: {
  list: T[];
  dateField: keyof T;
  descending?: boolean;
}): T[] => {
  return list.sort((a, b) => {
    const dateA = new Date(a[dateField] as string | number | Date);
    const dateB = new Date(b[dateField] as string | number | Date);
    if (dateA < dateB) return descending ? 1 : -1;
    if (dateA > dateB) return descending ? -1 : 1;
    return 0;
  });
};
