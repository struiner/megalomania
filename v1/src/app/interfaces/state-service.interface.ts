export interface IStateService {
  get(key: string): Promise<any | undefined>;
  set(key: string, value: any): Promise<void>;
  getAll(): Promise<Record<string, any> | undefined>;
}
