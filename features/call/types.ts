export type VapiCallProps = {
  systemPrompt: string
  firstMessage: string
}

export enum CALL_STATUS {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  LOADING = 'loading',
}
