const getPagination = (page, size) => {
    const limit = size ? +size : 20;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  };
  
  const getPagingData = (data, page, limit) => {
    const { count, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(count / limit);
  
    return { count, rows, totalPages, currentPage };
  };
  
  const getPaginationPayload = (data, page, limit) => ({
    rows: data,
    count: data.length,
    get totalPages() {
      return Math.ceil(this.count / limit);
    },
    currentPage: Number(page),
  });
  
  export { getPagination, getPagingData, getPaginationPayload };
  