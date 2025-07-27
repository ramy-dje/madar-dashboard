import CRMCompanyInterface, {
  CRMCompanyFilters,
} from "@/interfaces/crm-company.interface";
import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllCompanies(
  filters: CRMCompanyFilters | undefined = {}
) {
  return useQuery<ResponseAPIPaginationInterface<CRMCompanyInterface>>({
    queryKey: ["companies", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`crm/companies`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch companies");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId }: { companyId: string }) => {
      const response = await axiosAPI.delete(`crm/companies/${companyId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete company");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
    },
  });
}

export function useDeleteCompanies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyIds }: { companyIds: string[] }) => {
      let success = true;

      // Delete companies
      for (const companyId of companyIds) {
        try {
          const response = await axiosAPI.delete(`crm/companies/${companyId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting company:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to delete some items");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
    },
  });
}
