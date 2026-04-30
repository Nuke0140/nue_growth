import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsService } from '@/lib/contacts-service';
import type { Contact } from '@/modules/crm-sales/types';

// Centralized Query Keys factory
export const contactKeys = {
  all: ['contacts'] as const,
  detail: (id: string) => ['contacts', id] as const,
};

export function useContacts() {
  return useQuery({
    queryKey: contactKeys.all,
    queryFn: contactsService.getContacts,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newContact: Partial<Contact>) => 
      contactsService.createContact(newContact),
    
    onSuccess: () => {
      // Invalidate the 'all' contacts query so the list refreshes 
      // automatically after a successful creation!
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}