import { SystemPermissions } from "@/interfaces/permissions/permissions";
import { FaQuora } from "react-icons/fa6";
import {
  HiOutlineEye,
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineFolder,
  HiOutlineShare,
  HiOutlineTag,
  HiOutlineDocumentReport,
} from "react-icons/hi";
import { IconType } from "react-icons/lib";
import {
  MdOutlineCategory,
  MdOutlineHomeRepairService,
  MdOutlineRealEstateAgent,
} from "react-icons/md";

// ModulesCRUDPermissionsList

const modulesCRUD: {
  id: string;
  title: string; // the name of module (e.g rooms)
  Icon: IconType; // the icon of the module
  allPermission: SystemPermissions[];
  cruds: {
    name: string; // name of the curd (e.g create room)
    Icon: IconType; //
    color:
      | "green"
      | "red"
      | "blue"
      | "yellow"
      | "gray"
      | "purple"
      | "dark-red"
      | "cyan";
    dependency: SystemPermissions[]; // permissions that this crud needs but can't remove
    permission: SystemPermissions[]; // the permission that this crud needs (e.g room:create , room_category:read...)
  }[];
}[] = [
  // posts module
  {
    id: "posts-permission",
    title: "Posts Permissions",
    Icon: HiOutlineNewspaper,
    allPermission: ["post:read", "post:create", "post:update", "post:delete"],
    cruds: [
      // read posts
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["post:read"],
      },
      // create posts
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["post:read"],
        permission: ["post:create"],
      },
      // update post
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["post:read"],
        permission: ["post:update"],
      },
      // delete post
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["post:read"],
        permission: ["post:delete"],
      },
    ],
  },
  // categories module
  {
    id: "categories-permission",
    title: "Categories Permissions",
    Icon: MdOutlineCategory,
    allPermission: [
      "category:read",
      "category:create",
      "category:update",
      "category:delete",
    ],
    cruds: [
      // read category
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["category:read"],
      },
      // create category
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["category:read"],
        permission: ["category:create"],
      },
      // update category
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["category:read"],
        permission: ["category:update"],
      },
      // delete category
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["category:read"],
        permission: ["category:delete"],
      },
    ],
  },
  // tags module
  {
    id: "tags-permission",
    title: "Tags Permissions",
    Icon: HiOutlineTag,
    allPermission: ["tag:read", "tag:create", "tag:update", "tag:delete"],
    cruds: [
      // read tag
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["tag:read"],
      },
      // create tag
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["tag:read"],
        permission: ["tag:create"],
      },
      // update tag
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["tag:read"],
        permission: ["tag:update"],
      },
      // delete tag
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["tag:read"],
        permission: ["tag:delete"],
      },
    ],
  },

  // services module
  {
    id: "services-permission",
    title: "Services Permissions",
    Icon: MdOutlineHomeRepairService,
    allPermission: [
      "service:read",
      "service:create",
      "service:update",
      "service:delete",
    ],
    cruds: [
      // read services
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["service:read"],
      },
      // create services
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["service:read"],
        permission: ["service:create"],
      },
      // update service
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["service:read"],
        permission: ["service:update"],
      },
      // delete service
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["service:read"],
        permission: ["service:delete"],
      },
    ],
  },

  // portfolio module
  {
    id: "portfolio-permission",
    title: "Portfolio Permissions",
    Icon: HiOutlineDocumentReport,
    allPermission: [
      "portfolio:read",
      "portfolio:create",
      "portfolio:update",
      "portfolio:delete",
    ],
    cruds: [
      // read portfolio
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["portfolio:read"],
      },
      // create portfolio
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["portfolio:read"],
        permission: ["portfolio:create"],
      },
      // update portfolio
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["portfolio:read"],
        permission: ["portfolio:update"],
      },
      // delete portfolio
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["portfolio:read"],
        permission: ["portfolio:delete"],
      },
    ],
  },

  // tenders module
  {
    id: "tenders-permission",
    title: "Tenders Permissions",
    Icon: MdOutlineRealEstateAgent,
    allPermission: [
      "tender:read",
      "tender:create",
      "tender:update",
      "tender:delete",
    ],
    cruds: [
      // read tenders
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["tender:read"],
      },
      // create tenders
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["tender:read"],
        permission: ["tender:create"],
      },
      // update tender
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["tender:read"],
        permission: ["tender:update"],
      },
      // delete tender
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["tender:read"],
        permission: ["tender:delete"],
      },
    ],
  },

  // faqs module
  {
    id: "faqs-permission",
    title: "Faqs Permissions",
    Icon: FaQuora,
    allPermission: ["faq:read", "faq:create", "faq:update", "faq:delete"],
    cruds: [
      // read faqs
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["faq:read"],
      },
      // create faqs
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["faq:read"],
        permission: ["faq:create"],
      },
      // update faq
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["faq:read"],
        permission: ["faq:update"],
      },
      // delete faq
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["faq:read"],
        permission: ["faq:delete"],
      },
    ],
  },
  // job positions module
  {
    id: "job-positions-permission",
    title: "job Positions Permissions",
    Icon: HiOutlineBriefcase,
    allPermission: [
      "job_position:read",
      "job_position:create",
      "job_position:update",
      "job_position:delete",
    ],
    cruds: [
      // read positions
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["job_position:read"],
      },
      // create position
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["job_position:read"],
        permission: ["job_position:create"],
      },
      // update position
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["job_position:read"],
        permission: ["job_position:update"],
      },
      // delete position
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["job_position:read"],
        permission: ["job_position:delete"],
      },
    ],
  },
  // job submissions module
  {
    id: "job-submissions-permission",
    title: "job Submissions Permissions",
    Icon: HiOutlineBriefcase,
    allPermission: ["job_submission:read", "job_submission:delete"],
    cruds: [
      // read submissions
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["job_submission:read"],
      },
      // delete submission
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["job_submission:read"],
        permission: ["job_submission:delete"],
      },
    ],
  },
  // job departments module
  {
    id: "job-departments-permission",
    title: "job Departments Permissions",
    Icon: HiOutlineBriefcase,
    allPermission: [
      "job_department:read",
      "job_department:create",
      "job_department:update",
      "job_department:delete",
    ],
    cruds: [
      // read departments
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["job_department:read"],
      },
      // create department
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["job_department:read"],
        permission: ["job_department:create"],
      },
      // update department
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["job_department:read"],
        permission: ["job_department:update"],
      },
      // delete department
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["job_department:read"],
        permission: ["job_department:delete"],
      },
    ],
  },

  // CRM contacts module
  {
    id: "CRM_contacts-permission",
    title: "CRM Contacts Permissions",
    Icon: HiOutlineUserGroup,
    allPermission: [
      "crm_contacts:read",
      "crm_contacts:create",
      "crm_contacts:update",
      "crm_contacts:delete",
    ],
    cruds: [
      // read contacts
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["crm_contacts:read"],
      },
      // create contact
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["crm_contacts:read"],
        permission: ["crm_contacts:create"],
      },
      // update contact
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["crm_contacts:read"],
        permission: ["crm_contacts:update"],
      },
      // delete contact
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["crm_contacts:read"],
        permission: ["crm_contacts:delete"],
      },
    ],
  },
  // CRM companies module
  {
    id: "CRM_companies-permission",
    title: "CRM Companies Permissions",
    Icon: HiOutlineOfficeBuilding,
    allPermission: [
      "crm_company:read",
      "crm_company:create",
      "crm_company:update",
      "crm_company:delete",
    ],
    cruds: [
      // read companies
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["crm_company:read"],
      },
      // create company
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["crm_company:read"],
        permission: ["crm_company:create"],
      },
      // update company
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["crm_company:read"],
        permission: ["crm_company:update"],
      },
      // delete company
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["crm_company:read"],
        permission: ["crm_company:delete"],
      },
    ],
  },
  // file manager module
  {
    id: "file-manager-permission",
    title: "File manager Permissions",
    Icon: HiOutlineFolder,
    allPermission: [
      "file_manager:read_all",
      "file_manager:read",
      "file_manager:share",
      "file_manager:create",
      "file_manager:update",
      "file_manager:delete",
    ],
    cruds: [
      // read files
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["file_manager:read"],
      },
      // share file
      {
        Icon: HiOutlineShare,
        name: "Share",
        color: "gray",
        dependency: ["file_manager:read"],
        permission: ["file_manager:share"],
      },
      // create file
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["file_manager:read"],
        permission: ["file_manager:create"],
      },
      // update file
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["file_manager:read"],
        permission: ["file_manager:update"],
      },
      // delete file
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["file_manager:read"],
        permission: ["file_manager:delete"],
      },
    ],
  },
  // analytics module
  {
    id: "analytics-permission",
    title: "Analytics Permissions",
    Icon: HiOutlineChartBar,
    allPermission: [
      "analytics_crm_contacts:read",
      "analytics_crm_companies:read",
      "analytics_jobs:read",
      "file_manager_analytics:read",
    ],
    cruds: [
      // read crm_contacts analytics
      {
        Icon: HiOutlineEye,
        name: "CRM Contacts",
        color: "gray",
        dependency: [],
        permission: ["analytics_crm_contacts:read"],
      },
      // read crm_companies analytics
      {
        Icon: HiOutlineEye,
        name: "CRM Companies",
        color: "gray",
        dependency: [],
        permission: ["analytics_crm_companies:read"],
      },
      // read jobs analytics
      {
        Icon: HiOutlineEye,
        name: "Jobs",
        color: "gray",
        dependency: [],
        permission: ["analytics_jobs:read"],
      },
      {
        Icon: HiOutlineEye,
        name: "File manager",
        color: "gray",
        dependency: [],
        permission: ["file_manager_analytics:read"],
      },
    ],
  },
];

export { modulesCRUD };
export type modulesCRUDType = typeof modulesCRUD;
