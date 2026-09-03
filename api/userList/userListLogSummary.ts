export function getUserListLogSummary(responseData: any): { pageNumber?: number, pageSize?: number, totalPages?: number, totalRecords?: number, userCount?: number } {
  if (!responseData || typeof responseData !== 'object') {
    return {};
  }

  return {
    pageNumber: responseData.page_number,
    pageSize: responseData.page_size,
    totalPages: responseData.total_pages,
    totalRecords: responseData.total_records,
    userCount: Array.isArray(responseData.users) ? responseData.users.length : undefined
  };
}

export function getUserListErrorLogSummary(error: any): { apiMessage?: string, message?: string, status?: number, statusText?: string } {
  return {
    apiMessage: error && error.data ? error.data.message || error.data.errorMessage : undefined,
    message: error ? error.message : undefined,
    status: error ? error.status || error.statusCode : undefined,
    statusText: error ? error.statusText : undefined
  };
}
