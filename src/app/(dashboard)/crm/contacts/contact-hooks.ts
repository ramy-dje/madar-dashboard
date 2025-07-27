import CRMCompanyCategoryInterface from "@/interfaces/crm-category.interface";
import CRMContactInterface, {
  CRMContactFilters,
} from "@/interfaces/crm-contact.interface";
import CRMIndustryInterface from "@/interfaces/crm-industry.interface";
import CRMContactOccupationInterface from "@/interfaces/crm-occupation.interface";
import { ResponseAPIPaginationInterface } from "@/interfaces/pagination.interface";
import axiosAPI from "@/lib/axios";
import { handleRetry } from "@/utils/retry";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllContacts(filters: CRMContactFilters | undefined = {}) {
  return useQuery<ResponseAPIPaginationInterface<CRMContactInterface>>({
    queryKey: ["contacts", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`crm/contacts`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch contacts");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useGetAllIndustries(
  filters:
    | {
        page?: number;
        size?: number;
      }
    | undefined = {}
) {
  return useQuery<ResponseAPIPaginationInterface<CRMIndustryInterface>>({
    queryKey: ["industries", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`crm/industries`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch industries");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useGetAllOccupations(
  filters:
    | {
        page?: number;
        size?: number;
      }
    | undefined = {}
) {
  return useQuery<
    ResponseAPIPaginationInterface<CRMContactOccupationInterface>
  >({
    queryKey: ["occupations", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`crm/occupations`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch occupations");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}
export function useGetAllCRMCategories(
  filters:
    | {
        page?: number;
        size?: number;
      }
    | undefined = {}
) {
  return useQuery<ResponseAPIPaginationInterface<CRMCompanyCategoryInterface>>({
    queryKey: ["crm-categories", filters],
    staleTime: 600000, //5 min
    queryFn: async () => {
      const response = await axiosAPI.get(`crm/categories`, {
        params: filters,
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch crm categories");
      }
      return response.data!;
    },
    retry: handleRetry,
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId }: { contactId: string }) => {
      const response = await axiosAPI.delete(`crm/contacts/${contactId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete contact");
      }

      return true;
    },
    onSuccess: () => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    },
  });
}

export function useDeleteContacts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactIds }: { contactIds: string[] }) => {
      let success = true;

      // Delete contacts
      for (const contactId of contactIds) {
        try {
          const response = await axiosAPI.delete(`crm/contacts/${contactId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting contact:", error);
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
        queryKey: ["contacts"],
      });
    },
  });
}
