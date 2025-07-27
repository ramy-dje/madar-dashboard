// the type of the response that returns data
export interface ResponseAPIPaginationInterface<T> {
  page: number;
  total: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  data: T[];
}

// the type of the pagination request
export interface RequestAPIPaginationInterface {
  page: number;
  size: number;
}
