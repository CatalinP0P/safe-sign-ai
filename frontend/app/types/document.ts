export interface Document {
  id: number;
  filename: string;
  file_path: string;
  status: 'UPLOADED' | 'ANALYZING' | 'ANALYZED' | 'FAILED' | string;
  summary?: string;
  owner_id: number;
  created_at: string;
}