export interface ToolTab {
  label: string;
  component: Type<any>;
}

export interface Tool {
  id: string;
  name: string;
  tabs: ToolTab[];
}
