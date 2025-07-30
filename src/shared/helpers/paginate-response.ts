
export function paginatedReponse<T>(data: T[],total:number,page:number,limit:number,totalALL:number){
    return {
        data,
        pageInfo: {
            page,
            pageSize: limit,
            pageCount: Math.ceil(total/limit),
            total,
            totalALL,
        }
    }
}