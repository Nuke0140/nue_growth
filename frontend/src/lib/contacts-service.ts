import { apiClient } from '@/lib/http';
import type { Contact } from '@/modules/crm-sales/system/types';

export const contactsService = {
  // Fetch all contacts
  getContacts: async (): Promise<Contact[]> => {
    const { data } = await apiClient.get('/api/contacts');
    return data;
  },

  // Fetch a single contact
  getContactById: async (id: string): Promise<Contact> => {
    const { data } = await apiClient.get(`/api/contacts/${id}`);
    return data;
  },

  // Create a new contact
  createContact: async (contactData: Partial<Contact>): Promise<Contact> => {
    const { data } = await apiClient.post('/api/contacts', contactData);
    return data;
  },
};