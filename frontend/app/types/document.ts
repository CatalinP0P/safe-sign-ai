export interface Document {
  id: number;
  filename: string;
  file_path: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error'; // Opțional: adaugă toate stările posibile
  owner_id: number;
  created_at: string;
}