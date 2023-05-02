export interface PublicLinkTokenModel {
  link_token: string;
  expiration: Date;
  error?: any;
  request_id: string;
  statusCode: number;
  isSuccessStatusCode: boolean;
}
