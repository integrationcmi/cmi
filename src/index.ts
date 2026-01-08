// Core exports
export {
  CMIPaymentGateway,
  CallbackHandler,
  PaymentBuilder,
  FormGenerator,
  CallbackVerifier,
} from './core';

// Type exports
export type {
  PaymentConfig,
  PaymentRequest,
  CallbackResult,
  CallbackHandlerOptions,
  CallbackRequest,
  CallbackResponse,
  ConfirmationMode,
  CallbackMiddleware,
  CMIPaymentGatewayOptions
} from './types';

// Constant exports
export {
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
  SUPPORTED_STORE_TYPES,
  // Field definitions
  BILLING_FIELDS,
  OPTIONAL_PAYMENT_FIELDS,
  STANDARD_PAYMENT_FIELDS,
  HASH_SANITIZE_FIELDS,
} from './constants';

// Validator exports (optional, for advanced users)
export { ConfigValidator, PaymentValidator } from './validators';

// Utility exports (for advanced users)
export { timingSafeCompare, sha512Base64 } from './utils/crypto';

// Logger exports
export { logger, configureLogger, resetLogger } from './logger';

// ============================================
// Framework-Specific Helpers
// ============================================

// Express
export {
  createExpressMiddleware,
  createCallbackHandler,
} from './middleware';

// Next.js (Pages Router & App Router)
export {
  createNextJsHandler,
  handleNextJsCallback
} from './middleware';

// Fastify
export {
  createFastifyHandler,
  registerFastifyCallback
} from './middleware';

// Hono (Edge/Cloudflare Workers/Bun)
export {
  createHonoHandler,
  registerHonoCallback
} from './middleware';

// NestJS
export {
  NestJSCallbackHandler,
  createNestJSHandler
} from './middleware';
