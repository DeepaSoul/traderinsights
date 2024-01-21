const formateDate = (date: Date) => new Date(date).toISOString().split("T")[0];

export { formateDate };
