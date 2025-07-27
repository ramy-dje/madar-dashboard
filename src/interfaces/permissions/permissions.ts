// The system permissions types

export type SystemPermissions =
  // panel (subject) : actions
  | "panel:access"

  // Posts (subject) : actions
  | "post:create"
  | "post:update"
  | "post:delete"
  | "post:read"

  // category (subject) : actions
  | "category:create"
  | "category:update"
  | "category:read"
  | "category:delete"

  // tag (subject) : actions
  | "tag:create"
  | "tag:update"
  | "tag:read"
  | "tag:delete"

  // Services (subject) : actions
  | "service:create"
  | "service:update"
  | "service:delete"
  | "service:read"

  // service_faq (subject) : actions
  | "service_faq:create"
  | "service_faq:update"
  | "service_faq:read"
  | "service_faq:delete"

  // Portfolio (subject) : actions
  | "portfolio:create"
  | "portfolio:update"
  | "portfolio:delete"
  | "portfolio:read"

  // Tenders (subject) : actions
  | "tender:create"
  | "tender:update"
  | "tender:delete"
  | "tender:read"

  // Faqs (subject) : actions
  | "faq:create"
  | "faq:update"
  | "faq:delete"
  | "faq:read"

  // role (subject) : actions
  | "role:create"
  | "role:update"
  | "role:delete"
  | "role:read"

  // user (subject) : actions
  | "user:read"
  | "user:create"
  | "user:update"
  | "user:delete"
  | "user:activation"
  | "user_client:update"
  | "user_client:read"

  // crm contacts (subject) : actions
  | "crm_contacts:create"
  | "crm_contacts:update"
  | "crm_contacts:delete"
  | "crm_contacts:read"

  // crm company (subject) : actions
  | "crm_company:create"
  | "crm_company:update"
  | "crm_company:delete"
  | "crm_company:read"

  // crm industry (subject) : actions
  | "crm_industry:read"
  | "crm_industry:create"
  | "crm_industry:update"
  | "crm_industry:delete"

  // crm occupation (subject) : actions
  | "crm_occupation:read"
  | "crm_occupation:create"
  | "crm_occupation:update"
  | "crm_occupation:delete"

  // crm category (subject) : actions
  | "crm_category:read"
  | "crm_category:create"
  | "crm_category:update"
  | "crm_category:delete"

  // job_position (subject) : actions
  | "job_position:create"
  | "job_position:update"
  | "job_position:delete"
  | "job_position:read"

  // job_department (subject) : actions
  | "job_department:create"
  | "job_department:update"
  | "job_department:delete"
  | "job_department:read"

  // job_department (subject) : actions
  | "job_department:create"
  | "job_department:update"
  | "job_department:delete"
  | "job_department:read"

  // job_submission (subject) : actions
  | "job_submission:create"
  | "job_submission:update"
  | "job_submission:delete"
  | "job_submission:read"

  // file_manager (subject) : actions
  | "file_manager:create"
  | "file_manager:update"
  | "file_manager:delete"
  | "file_manager:read"
  | "file_manager:share"
  | "file_manager:read_all"

  // analytics (subject) : actions
  | "analytics_jobs:read"
  | "analytics_crm_contacts:read"
  | "analytics_crm_companies:read"
  | "file_manager_analytics:read";

// Permissions array type

export type SystemPermissionsArray = SystemPermissions[];
