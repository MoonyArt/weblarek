import { ProductsList } from "../components/Models/ProductsList";
import { CardCatalog } from "../components/views/card/CardCatalog";
import { cloneTemplate } from "../utils/utils";

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: 'card' | 'cash' | '';
  address: string;
  email: string;
  phone: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export type ProductsResponse = {
    total: number;
    items: IProduct[];
};

export type PostOrder = IBuyer & {
    total: number,
    items: string[]
}

export type OrderResponse = {
    id: string;
    total: number;
};
