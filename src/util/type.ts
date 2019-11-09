export interface ListResponse {
    totalCount: number;
    nextLink: string;
    value: any[];
}
   
export interface AuthorResponse {
    id: string;
    name: string;
    fullName?: string;
    birthday?: string;
    description?: string;
    bookCount?: number;
    book?: any[];
}
  
export interface BookResponse {
    id: string;
    barCode: string;
    createdDate: Date;
    modifiedDate: Date;
    description: string;
    author: any[];
    overview: string;
    price: number;
    isSell: boolean;
    selloff: number;
    finalPrice: number;
    currencyUnit: string;
    tags: string[];
    lang: string;
    quantity: number;
    category: string[];
}

export interface CategoryResponse {
    name: string;
}