export interface options {
  [key : string] : boolean;
}

export interface message {
  action?: "get" | "set",
  key: string,
  value: boolean
}
