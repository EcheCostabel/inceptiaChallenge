export interface Client {
  id: number;
  name: string;
  alias: string;
}
interface CaseResult {
  name: string;
}

interface ExtraMetadata {
  dni?: string;
  orden?: string;
  grupo?: string
}

export interface ClientData {
  last_updated: string;
  case_uuid: string;
  phone: number;
  case_duration: string;
  status: string;
  case_result: CaseResult;
  extra_metadata: ExtraMetadata;
}