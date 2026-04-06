export interface ChatSummaryDto {
  id: string;
  title: string;
  updatedAt?: string;
  projectId?: string | null;
  pinned?: boolean;
}
