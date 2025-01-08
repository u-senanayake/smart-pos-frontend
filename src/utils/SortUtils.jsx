export const getSortedData = (data, sortConfig) => {
    if (!sortConfig || !sortConfig.key) return data;
  
    const sortedData = [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  
    return sortedData;
  };
  
  export const toggleSortDirection = (currentSortConfig, key) => {
    if (currentSortConfig.key === key) {
      return {
        key,
        direction: currentSortConfig.direction === "asc" ? "desc" : "asc",
      };
    }
    return { key, direction: "asc" };
  };
  