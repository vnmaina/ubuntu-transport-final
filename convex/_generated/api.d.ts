/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as blog from "../blog.js";
import type * as chat from "../chat.js";
import type * as clients from "../clients.js";
import type * as collections from "../collections.js";
import type * as forms from "../forms.js";
import type * as http from "../http.js";
import type * as invoices from "../invoices.js";
import type * as notifications from "../notifications.js";
import type * as organization from "../organization.js";
import type * as pages from "../pages.js";
import type * as quotations from "../quotations.js";
import type * as receipts from "../receipts.js";
import type * as roles from "../roles.js";
import type * as routes from "../routes.js";
import type * as seedBlogPosts from "../seedBlogPosts.js";
import type * as seedUbuntuData from "../seedUbuntuData.js";
import type * as services from "../services.js";
import type * as storage from "../storage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blog: typeof blog;
  chat: typeof chat;
  clients: typeof clients;
  collections: typeof collections;
  forms: typeof forms;
  http: typeof http;
  invoices: typeof invoices;
  notifications: typeof notifications;
  organization: typeof organization;
  pages: typeof pages;
  quotations: typeof quotations;
  receipts: typeof receipts;
  roles: typeof roles;
  routes: typeof routes;
  seedBlogPosts: typeof seedBlogPosts;
  seedUbuntuData: typeof seedUbuntuData;
  services: typeof services;
  storage: typeof storage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
