import { useCallback, useState } from "react";
import {
  Product,
  ProductQueryParams,
  ProductResponse,
} from "../types/product.type";
import axiosInstance from "../services/axios";
import { API_BASE } from "../services/api-route";

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [productById, setProductById] = useState<Product>();

  const getProduct = useCallback(
    async (params?: ProductQueryParams): Promise<ProductResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          API_BASE.PRODUCT.GET_ALL_PRODUCTS,
          { params },
        );
        setProducts(response.data.data);
        setMeta(response.data?.meta);
        return response;
      } catch (error) {
        const message = `Fail to fetch get all product ${error}`;
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getProductById = useCallback(async (id: string) => {
    if (!id) return null;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        API_BASE.PRODUCT.GET_PRODUCT_BY_ID(id),
      );
      console.log(response);
      setProductById(response.data);
      return response;
    } catch (error) {
      const message = "Error fetching product By Id" + error;
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    products,
    getProduct,
    meta,
    error,
    getProductById,
    productById,
  };
};
