export interface CallbackResult {
  success: boolean;
  status: "ACTION=POSTAUTH" | "APPROVED" | "FAILURE";
  message: string;
  orderData?: {
    orderId: string | undefined;
    amount: number;
    currency: string;
    transactionId: string;
  };
  errorCode?: string;
  errorMessage?: string;
}
