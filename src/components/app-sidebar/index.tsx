"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import madar_logo_horizental from "../../app/madar_logo.svg";
import { NavMain, NavMainProps } from "./nav-main";
import { NavUser } from "./nav-user";
import { VscDashboard } from "react-icons/vsc";
import { FiLayout } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import {
  // HiOutlineBriefcase,
  HiOutlineDocumentReport,
  HiOutlineKey,
  HiOutlineNewspaper,
} from "react-icons/hi";
import { MdOutlineHomeRepairService, MdOutlineWidgets } from "react-icons/md";
// import { IoFileTrayStackedOutline } from "react-icons/io5";
const data: { navMain: NavMainProps["items"] } = {
  navMain: [
    {
      name: "",
      title: "Dashboard",
      url: "/",
      icon: VscDashboard,
    },
    {
      name: "posts",
      title: "Blog",
      url: "/posts",
      access: ["post:read", "category:read"],
      icon: HiOutlineNewspaper,
      items: [
        {
          name: "",
          access: ["post:read"],
          title: "Posts",
          url: "/posts",
        },
        {
          name: "categories",
          access: ["category:read"],
          title: "Categories",
          url: "/posts/categories",
        },
        {
          name: "tags",
          access: ["tag:read"],
          title: "Tags",
          url: "/posts/tags",
        },
      ],
    },
    {
      name: "services",
      title: "Services",
      url: "/services",
      icon: MdOutlineHomeRepairService,
      access: ["service:read", "category:read"],
      items: [
        {
          name: "",
          access: ["service:read"],
          title: "Services",
          url: "/services",
        },
        {
          name: "categories",
          access: ["category:read"],
          title: "Categories",
          url: "/services/categories",
        },
      ],
    },
    {
      name: "portfolio",
      title: "Portfolio",
      url: "/portfolio",
      icon: HiOutlineDocumentReport,
      access: ["portfolio:read", "category:read"],
      items: [
        {
          name: "",
          access: ["portfolio:read"],
          title: "Portfolio",
          url: "/portfolio",
        },
        {
          name: "categories",
          access: ["category:read"],
          title: "Categories",
          url: "/portfolio/categories",
        },
        {
          name: "tags",
          access: ["tag:read"],
          title: "Tags",
          url: "/portfolio/tags",
        },
      ],
    },
    // {
    //   name: "tenders",
    //   title: "Tenders",
    //   url: "/tenders",
    //   icon: IoFileTrayStackedOutline,
    //   access: ["tender:read", "category:read"],
    //   items: [
    //     {
    //       name: "",
    //       access: ["tender:read"],
    //       title: "Tenders",
    //       url: "/tenders",
    //     },
    //     {
    //       name: "categories",
    //       access: ["category:read"],
    //       title: "Categories",
    //       url: "/tenders/categories",
    //     },
    //   ],
    // },
    {
      name: "faqs",
      title: "Widgets",
      url: "/faqs",
      icon: MdOutlineWidgets,
      access: ["faq:read", "category:read"],
      items: [
        {
          name: "",
          access: ["faq:read"],
          title: "FAQs",
          url: "/faqs",
        },
        {
          name: "categories",
          access: ["category:read"],
          title: "Categories",
          url: "/faqs/categories",
        },
      ],
    },
    {
      name: "crm",
      title: "CRM",
      url: "/crm",
      icon: CgProfile,
      access: [
        "crm_contacts:read",
        "crm_company:read",
        // "analytics_crm_contacts:read",
        // "analytics_crm_companies:read",
      ],
      items: [
        // {
        //   name: "overview",
        //   access: [
        //     "analytics_crm_contacts:read",
        //     "analytics_crm_companies:read",
        //   ],
        //   title: "Overview",
        //   url: "/crm/overview",
        // },
        {
          name: "contacts",
          access: ["crm_contacts:read"],
          title: "Contacts",
          url: "/crm/contacts",
        },
        {
          name: "companies",
          access: ["crm_company:read"],
          title: "Companies",
          url: "/crm/companies",
        },
      ],
    },
    {
      name: "layout",
      title: "Layout",
      url: "/layout",
      icon: FiLayout,
      access: ["user:read", "role:read"],
    },
    // {
    //   name: "jobs",
    //   title: "Career",
    //   url: "/jobs",
    //   icon: HiOutlineBriefcase,
    //   access: [
    //     "job_position:read",
    //     "job_submission:read",
    //     "job_department:read",
    //   ],
    //   items: [
    //     {
    //       name: "submissions",
    //       access: ["job_submission:read"],
    //       title: "Submissions",
    //       url: "/jobs/submissions",
    //     },
    //     {
    //       name: "positions",
    //       access: ["job_position:read"],
    //       title: "Positions",
    //       url: "/jobs/positions",
    //     },
    //     {
    //       name: "departments",
    //       access: ["job_department:read"],
    //       title: "Departments",
    //       url: "/jobs/departments",
    //     },
    //   ],
    // },
    {
      name: "roles-permissions",
      title: "Roles & Permissions",
      url: "/roles-permissions",
      icon: HiOutlineKey,
      access: ["user:read", "role:read"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center py-2">
            <Image alt="" src={madar_logo_horizental} width={120} height={40} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
