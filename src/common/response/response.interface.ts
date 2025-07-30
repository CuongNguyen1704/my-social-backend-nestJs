

export interface PaginatedReponse<T> {
    data: T[],
    pageInfo: PageInfo
}

export interface PageInfo {
    page: number,
    pageSize: number,
    pageCount: number,
    total: number
}