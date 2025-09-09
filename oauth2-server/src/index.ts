#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for pandadoc-public-api v6.0.0
 * Generated on: 2025-09-09T18:44:14.530Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";
import { setupWebServer } from "./web-server.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
}

/**
 * Server configuration
 */
export const SERVER_NAME = "pandadoc-public-api";
export const SERVER_VERSION = "6.0.0";
export const API_BASE_URL = "https://api.pandadoc.com";

/**
 * MCP Server instance
 */
const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["accessToken", {
    name: "accessToken",
    description: `Create/Refresh Access Token`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body (content type: application/x-www-form-urlencoded)"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/oauth2/access_token",
    executionParameters: [],
    requestBodyContentType: "application/x-www-form-urlencoded",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listDocuments", {
    name: "listDocuments",
    description: `List documents`,
    inputSchema: {"type":"object","properties":{"completed_from":{"type":"string","format":"datetime","description":"Return results where the `date_completed` field (ISO 8601) is greater than or equal to this value."},"completed_to":{"type":"string","format":"datetime","description":"Return results where the `date_completed` field (ISO 8601) is less than or equal to this value."},"contact_id":{"type":"string","description":"Returns results where 'contact_id' is present in document as recipient or approver"},"count":{"type":"number","description":"Specify how many document results to return. Default is 50 documents, maximum is 100 documents."},"created_from":{"type":"string","format":"datetime","description":"Return results where the `date_created` field (ISO 8601) is greater than or equal to this value."},"created_to":{"type":"string","format":"datetime","description":"Return results where the `date_created` field (ISO 8601) is less than this value."},"deleted":{"type":"boolean","description":"Returns only the deleted documents."},"id":{"type":"string","description":"Specify document's ID."},"folder_uuid":{"type":"string","description":"The UUID of the folder where the documents are stored."},"form_id":{"type":"string","description":"Specify the form used for documents creation. This parameter can't be used with template_id."},"membership_id":{"type":"string","description":"Returns results where 'membership_id' is present in document as owner (should be member uuid)"},"metadata":{"type":"array","items":{"type":"string"},"description":"Specify metadata to filter by in the format of `metadata_{metadata-key}={metadata-value}` such as `metadata_opportunity_id=2181432`. The `metadata_` prefix is always required."},"modified_from":{"type":"string","format":"datetime","description":"Return results where the `date_modified` field (iso-8601) is greater than or equal to this value."},"modified_to":{"type":"string","format":"datetime","description":"Return results where the `date_modified` field (iso-8601) is less than this value."},"order_by":{"type":"string","enum":["name","date_created","date_status_changed","date_of_last_action","date_modified","date_sent","date_completed","date_expiration","date_declined","status","-name","-date_created","-date_status_changed","-date_of_last_action","-date_modified","-date_sent","-date_completed","-date_expiration","-date_declined","-status"],"description":"Specify the order of documents to return. Use `value` (for example, `date_created`) for ASC and `-value` (for example, `-date_created`) for DESC."},"page":{"type":"number","minimum":1,"description":"Specify which page of the dataset to return."},"q":{"type":"string","description":"Search query. Filter by document reference number (this token is stored on the template level) or name."},"status":{"type":"number","enum":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"description":"Specify the status of documents to return.\n  * 0: document.draft\n  * 1: document.sent\n  * 2: document.completed\n  * 3: document.uploaded\n  * 4: document.error\n  * 5: document.viewed\n  * 6: document.waiting_approval\n  * 7: document.approved\n  * 8: document.rejected\n  * 9: document.waiting_pay\n  * 10: document.paid\n  * 11: document.voided\n  * 12: document.declined\n  * 13: document.external_review\n"},"status__ne":{"type":"number","enum":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"description":"Specify the status of documents to return (exclude).\n  * 0: document.draft\n  * 1: document.sent\n  * 2: document.completed\n  * 3: document.uploaded\n  * 4: document.error\n  * 5: document.viewed\n  * 6: document.waiting_approval\n  * 7: document.approved\n  * 8: document.rejected\n  * 9: document.waiting_pay\n  * 10: document.paid\n  * 11: document.voided\n  * 12: document.declined\n  * 13: document.external_review\n"},"tag":{"type":"string","description":"Search tag. Filter by document tag."},"template_id":{"type":"string","description":"Specify the template used for documents creation. Parameter can't be used with form_id."}}},
    method: "get",
    pathTemplate: "/public/v1/documents",
    executionParameters: [{"name":"completed_from","in":"query"},{"name":"completed_to","in":"query"},{"name":"contact_id","in":"query"},{"name":"count","in":"query"},{"name":"created_from","in":"query"},{"name":"created_to","in":"query"},{"name":"deleted","in":"query"},{"name":"id","in":"query"},{"name":"folder_uuid","in":"query"},{"name":"form_id","in":"query"},{"name":"membership_id","in":"query"},{"name":"metadata","in":"query"},{"name":"modified_from","in":"query"},{"name":"modified_to","in":"query"},{"name":"order_by","in":"query"},{"name":"page","in":"query"},{"name":"q","in":"query"},{"name":"status","in":"query"},{"name":"status__ne","in":"query"},{"name":"tag","in":"query"},{"name":"template_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createDocument", {
    name: "createDocument",
    description: `Create document`,
    inputSchema: {"type":"object","properties":{"editor_ver":{"type":"string","description":"Set this parameter as `ev1` if you want to create a document from PDF with Classic Editor when both editors are enabled for the workspace."},"requestBody":{"type":"object","properties":{"name":{"type":"string","description":"Name the document you are creating."},"detect_title_variables":{"type":"boolean","description":"Set this parameter as true if you want to detect title variables in the document."},"template_uuid":{"type":"string","description":"ID of the template you want to use. You can copy it from an in-app template URL such as `https://app.pandadoc.com/a/#/templates/{ID}/content`. A template ID is also obtained by listing templates."},"folder_uuid":{"type":"string","description":"ID of the folder where the created document should be stored."},"owner":{"type":"object","description":"You can set an owner of a document as an `email` or `membership_id`","additionalProperties":{"type":"string"}},"recipients":{"type":"array","description":"The list of recipients you're sending the document to. Every object must contain the `email` parameter. The `role`, `first_name` and `last_name` parameters are optional. If the `role` parameter is passed, a person is assigned all fields matching their corresponding role. If a role was not passed, a person receives a read-only link to view the document. If the `first_name` and `last_name` are not passed, the system does this 1. Creates a new contact, if none exists with the given `email`; or 2. Gets the existing contact with the given `email` that already exists.","items":{"type":"object","properties":{"email":{"type":"string"},"first_name":{"type":"string"},"last_name":{"type":"string"},"role":{"type":"string"},"signing_order":{"type":"number"}},"required":["email"]}},"tokens":{"type":"array","description":"You can pass a list of tokens/values to pre-fill tokens used in a template. Name is a token name in a template. Value is a real value you would like to replace a token with.","items":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}},"required":["name","value"]}},"fields":{"type":["object","null"],"description":"You can pass a list of fields/values to pre-fill fields used in a template. Please note Signature field can't be pre-filled."},"metadata":{"type":["object","null"],"description":"You can pass arbitrary data in the key-value format to associate custom information with a document. This information is returned in any API requests for the document details by id."},"tags":{"type":"array","description":"Mark your document with one or several tags.","items":{"type":"string"}},"images":{"type":"array","description":"You can pass a list of images to image blocks (one image in one block) for replacement.","items":{"type":["object","null"],"properties":{"urls":{"type":"array","items":{"type":"string"},"example":["https://s3.amazonaws.com/pd-static-content/public-docs/pandadoc-panda-bear.png"]},"name":{"type":"string","example":"Image 1"}},"required":["urls","name"]}},"pricing_tables":{"type":"array","description":"Information to construct or populate a pricing table can be passed when creating a document. All product information must be passed when creating a new document. Products stored in PandaDoc cannot be used to populate table rows at this time. Keep in mind that this is an array, so multiple table objects can be passed to a document.","items":{"type":"object","properties":{"name":{"type":"string"},"data_merge":{"type":"boolean","description":"When set to true all field names in data rows must be passed as external names defined in the template."},"options":{"type":"object"},"sections":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"default":{"type":"boolean"},"multichoice_enabled":{"type":"boolean","default":false},"rows":{"type":"array","items":{"type":"object","properties":{"options":{"type":"object","title":"Pricing Table Request Row Options","properties":{"qty_editable":{"type":"boolean"},"optional_selected":{"type":"boolean"},"optional":{"type":"boolean"}}},"data":{"type":"object","title":"Pricing Table Request Row Data"},"custom_fields":{"type":"object"}}}}},"required":["title"]}}},"required":["name"]}},"content_placeholders":{"type":"array","description":"You may replace Content Library Item Placeholders with a few content library items each and pre-fill fields/variables values, pricing table items, and assign recipients to roles from there.","items":{"type":"object","properties":{"block_id":{"type":"string","description":"Content placeholder block id"},"content_library_items":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string","description":"Content library item id"},"pricing_tables":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"data_merge":{"type":"boolean","description":"When set to true all field names in data rows must be passed as external names defined in the template."},"options":{"type":"object"},"sections":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"default":{"type":"boolean"},"multichoice_enabled":{"type":"boolean","default":false},"rows":{"type":"array","items":{"type":"object","properties":{"options":{"type":"object","title":"Pricing Table Request Row Options","properties":{"qty_editable":{"type":"boolean"},"optional_selected":{"type":"boolean"},"optional":{"type":"boolean"}}},"data":{"type":"object","title":"Pricing Table Request Row Data"},"custom_fields":{"type":"object"}}}}},"required":["title"]}}},"required":["name"]}},"fields":{"type":"object"},"recipients":{"type":"array","items":{"type":"object","properties":{"email":{"type":"string"},"first_name":{"type":"string"},"last_name":{"type":"string"},"role":{"type":"string"},"signing_order":{"type":["number","null"]}},"required":["email"]}}},"required":["id"]}}}}},"url":{"type":"string","description":"Use a URL to specify the PDF. We support only URLs starting with https."},"parse_form_fields":{"type":"boolean","description":"Set this parameter as true if you create a document from a PDF with form fields and as false if you upload a PDF with field tags."}},"description":"Use a PandaDoc template or an existing PDF to create a document.\nSee the creation request examples [by template](/schemas/DocumentCreateByTemplateRequest)\nand [by pdf](/schemas/DocumentCreateByPdfRequest)\n"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents",
    executionParameters: [{"name":"editor_ver","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["statusDocument", {
    name: "statusDocument",
    description: `Document status`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteDocument", {
    name: "deleteDocument",
    description: `Delete document by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/public/v1/documents/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["updateDocument", {
    name: "updateDocument",
    description: `Update Document only in the draft status`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document ID"},"requestBody":{"type":"object","properties":{"name":{"type":"string","description":"The name of the document."},"recipients":{"type":"array","description":"The list of recipients you're sending the document to. The ID or email are required. If the ID is passed, an existing recipient will be updated. If the email is passed, a new recipient will be added to CC.","items":{"type":"object","properties":{"id":{"type":"string"},"email":{"type":"string"},"first_name":{"type":"string"},"last_name":{"type":"string"}}}},"fields":{"type":"object","description":"You may pass a list of fields/values which exist in a document. Please use `Merge Field` property of the fields like the key."},"tokens":{"type":"array","description":"You can pass a list of tokens/values. If a token name exists in a document then the value will be updated. Otherwise, a new token will be added to the document.","items":{"type":"object","properties":{"name":{"type":"string"},"value":{"type":"string"}},"required":["name","value"]}},"metadata":{"type":"object","description":"You can pass arbitrary data in the key-value format to associate custom information with a document. This information is returned in any API requests for the document details by id. If metadata exists in a document then the value will be updated. Otherwise, metadata will be added to the document."},"pricing_tables":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"data_merge":{"type":"boolean","description":"When set to true all field names in data rows must be passed as external names defined in the template."},"options":{"type":"object"},"sections":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string"},"default":{"type":"boolean"},"multichoice_enabled":{"type":"boolean","default":false},"rows":{"type":"array","items":{"type":"object","properties":{"options":{"type":"object","title":"Pricing Table Request Row Options","properties":{"qty_editable":{"type":"boolean"},"optional_selected":{"type":"boolean"},"optional":{"type":"boolean"}}},"data":{"type":"object","title":"Pricing Table Request Row Data"},"custom_fields":{"type":"object"}}}}},"required":["title"]}}},"required":["name"]}}},"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/documents/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["changeDocumentStatus", {
    name: "changeDocumentStatus",
    description: `Document status change`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"requestBody":{"type":"object","properties":{"status":{"type":"number","enum":[0,1,2,3,4,5,6,7,8,9,10,11,12,13]},"note":{"type":"string","description":"Provide “private notes” regarding the manual status change."},"notify_recipients":{"type":"boolean","description":"Send a notification email about the status change to all recipients."}},"required":["status"],"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/documents/{id}/status",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsDocument", {
    name: "detailsDocument",
    description: `Document details`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/details",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createDocumentLink", {
    name: "createDocumentLink",
    description: `Create a Document Link`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document ID"},"requestBody":{"type":"object","properties":{"recipient":{"type":"string","description":"The email address for the recipient you're creating a document link for."},"lifetime":{"type":"number","description":"Provide the number of seconds that a document link should be valid for. Default is 3600 seconds."}},"required":["recipient"],"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/session",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["sendDocument", {
    name: "sendDocument",
    description: `Send Document`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document ID"},"requestBody":{"type":"object","properties":{"message":{"type":"string","description":"A message that will be sent by email with a link to a document to sign."},"subject":{"type":"string","description":"Value that will be used as the email subject."},"silent":{"type":"boolean","description":"Disables sent, viewed, comment, and completed email notifications for document recipients and the document sender. By default, notifications emails are sent for specific actions. If set as true, it won't affect the \"Approve document\" email notification sent to the Approver."},"sender":{"type":"object","description":"You can set a sender of a document as an `email` or `membership_id`","additionalProperties":{"type":"string"}},"forwarding_settings":{"type":"object","description":"Forwarding settings","properties":{"forwarding_allowed":{"type":"boolean","description":"Allow forwarding"},"forwarding_with_reassigning_allowed":{"type":"boolean","description":"Allow forwarding with reassigning"}}},"selected_approvers":{"type":"object","description":"Configuration for selected approvers","properties":{"steps":{"type":"array","description":"Approval steps","items":{"type":"object","required":["id","group"],"properties":{"id":{"type":"string","description":"Step ID"},"group":{"type":"object","description":"Group information","required":["id","type","assignees"],"properties":{"id":{"type":"string","description":"Group ID"},"type":{"type":"string","description":"Group type"},"assignees":{"type":"array","description":"Assignees for the group","required":["user","is_selected"],"items":{"type":"object","properties":{"user":{"type":"string","description":"User ID"},"is_selected":{"type":"boolean","description":"Whether the user is selected"}}}}}}}}}}}},"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/send",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["downloadDocument", {
    name: "downloadDocument",
    description: `Document download`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"watermark_color":{"type":"string","description":"HEX code (for example `#FF5733`)."},"watermark_font_size":{"type":"number","description":"Font size of the watermark."},"watermark_opacity":{"type":"number","format":"float","description":"In range 0.0-1.0"},"watermark_text":{"type":"string","description":"Specify watermark text."},"separate_files":{"type":"boolean","description":"Set as `true` if you want to receive a zip file with all documents in separate when document transaction contains more than 1."}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/download",
    executionParameters: [{"name":"id","in":"path"},{"name":"watermark_color","in":"query"},{"name":"watermark_font_size","in":"query"},{"name":"watermark_opacity","in":"query"},{"name":"watermark_text","in":"query"},{"name":"separate_files","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["downloadProtectedDocument", {
    name: "downloadProtectedDocument",
    description: `Download a signed PDF of a completed document`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"separate_files":{"type":"boolean","description":"Set as `true` if you want to receive a zip file with all documents in separate when document transaction contains more than 1."}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/download-protected",
    executionParameters: [{"name":"id","in":"path"},{"name":"separate_files","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listLinkedObjects", {
    name: "listLinkedObjects",
    description: `List Linked Objects`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/linked-objects",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createLinkedObject", {
    name: "createLinkedObject",
    description: `Create Linked Object`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"requestBody":{"type":"object","properties":{"provider":{"type":"string","description":"CRM name (lowercase). See the list above."},"entity_type":{"type":"string","description":"Entity type. The system validates if the type is supported. See the list for each CRM above."},"entity_id":{"type":"string","description":"Entity unique identifier. The system validates if the entity exists."}},"required":["provider","entity_type","entity_id"],"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/linked-objects",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteLinkedObject", {
    name: "deleteLinkedObject",
    description: `Delete Linked Object`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"linked_object_id":{"type":"string","description":"Specify linked object ID."}},"required":["id","linked_object_id"]},
    method: "delete",
    pathTemplate: "/public/v1/documents/{id}/linked-objects/{linked_object_id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"linked_object_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listDocumentAttachments", {
    name: "listDocumentAttachments",
    description: `Return list of objects attached to particular document`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/attachments",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createDocumentAttachment", {
    name: "createDocumentAttachment",
    description: `Creates an attachment for a particular document`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"requestBody":{"type":"string","description":"Uploads attachment to document by using Multipart Form Data"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/attachments",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "multipart/form-data",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsDocumentAttachment", {
    name: "detailsDocumentAttachment",
    description: `Returns details of the specific document's attachment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"attachment_id":{"type":"string","description":"Attachment UUID"}},"required":["id","attachment_id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/attachments/{attachment_id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"attachment_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteDocumentAttachment", {
    name: "deleteDocumentAttachment",
    description: `Deletes specific document's attachment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"attachment_id":{"type":"string","description":"Attachment UUID"}},"required":["id","attachment_id"]},
    method: "delete",
    pathTemplate: "/public/v1/documents/{id}/attachments/{attachment_id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"attachment_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["downloadDocumentAttachment", {
    name: "downloadDocumentAttachment",
    description: `Returns document attachment file for download`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"attachment_id":{"type":"string","description":"Attachment UUID"}},"required":["id","attachment_id"]},
    method: "get",
    pathTemplate: "/public/v1/documents/{id}/attachments/{attachment_id}/download",
    executionParameters: [{"name":"id","in":"path"},{"name":"attachment_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["transferDocumentOwnership", {
    name: "transferDocumentOwnership",
    description: `Update document ownership`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"requestBody":{"type":"object","properties":{"membership_id":{"type":"string","description":"A unique identifier of a workspace member."}},"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/documents/{id}/ownership",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["transferAllDocumentsOwnership", {
    name: "transferAllDocumentsOwnership",
    description: `Transfer all documents ownership`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"from_membership_id":{"type":"string","description":"A unique identifier of a workspace member from whom you want to transfer ownership."},"to_membership_id":{"type":"string","description":"A unique identifier of a workspace member to whom you want to transfer ownership."}},"description":"The JSON request body."}},"required":["requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/documents/ownership",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["documentMoveToFolder", {
    name: "documentMoveToFolder",
    description: `Document move to folder`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Specify document ID."},"folder_id":{"type":"string","description":"Specify folder ID."}},"required":["id","folder_id"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/move-to-folder/{folder_id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"folder_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["addDocumentRecipient", {
    name: "addDocumentRecipient",
    description: `Adds recipient as CC to document`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"requestBody":{"type":"object","properties":{"id":{"type":"string"},"kind":{"type":"string","enum":["contact","contact_group"]}},"required":["id","kind"],"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/recipients",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteDocumentRecipient", {
    name: "deleteDocumentRecipient",
    description: `Deleted recipient from document`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"recipient_id":{"type":"string","description":"Recipient UUID"}},"required":["id","recipient_id"]},
    method: "delete",
    pathTemplate: "/public/v1/documents/{id}/recipients/{recipient_id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"recipient_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["editDocumentRecipient", {
    name: "editDocumentRecipient",
    description: `Edit document recipient's details`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"recipient_id":{"type":"string","description":"Recipient UUID"},"requestBody":{"type":"object","properties":{"email":{"type":"string"},"first_name":{"type":["string","null"]},"last_name":{"type":["string","null"]},"company":{"type":["string","null"]},"job_title":{"type":["string","null"]},"phone":{"type":["string","null"]},"state":{"type":["string","null"]},"street_address":{"type":["string","null"]},"city":{"type":["string","null"]},"postal_code":{"type":["string","null"]}},"description":"The JSON request body."}},"required":["id","recipient_id","requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/documents/{id}/recipients/{recipient_id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"recipient_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["reassignDocumentRecipient", {
    name: "reassignDocumentRecipient",
    description: `Replace document recipient with another contact`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Document UUID"},"recipient_id":{"type":"string","description":"Recipient UUID"},"requestBody":{"type":"object","properties":{"id":{"type":"string"},"kind":{"type":"string","enum":["contact","contact_group"]}},"required":["id","kind"],"description":"The JSON request body."}},"required":["id","recipient_id","requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/{id}/recipients/{recipient_id}/reassign",
    executionParameters: [{"name":"id","in":"path"},{"name":"recipient_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listContentLibraryItems", {
    name: "listContentLibraryItems",
    description: `Optionally filter by a search query or tags.`,
    inputSchema: {"type":"object","properties":{"q":{"type":"string","description":"Search query. Filter by content library item name."},"id":{"type":"string","description":"Specify content library item ID."},"deleted":{"type":"boolean","description":"Returns only the deleted content library items."},"folder_uuid":{"type":"string","description":"The UUID of the folder where the content library items are stored."},"count":{"type":"number","format":"int32","minimum":1,"description":"Specify how many content library items to return. Default is 50 content library items, maximum is 100 content library items."},"page":{"type":"number","format":"int32","minimum":1,"description":"Specify which page of the dataset to return."},"tag":{"type":"string","description":"Search tag. Filter by content library item tag."}}},
    method: "get",
    pathTemplate: "/public/v1/content-library-items",
    executionParameters: [{"name":"q","in":"query"},{"name":"id","in":"query"},{"name":"deleted","in":"query"},{"name":"folder_uuid","in":"query"},{"name":"count","in":"query"},{"name":"page","in":"query"},{"name":"tag","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsContentLibraryItem", {
    name: "detailsContentLibraryItem",
    description: `Return detailed data about a content library item.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Content Library Item ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/content-library-items/{id}/details",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listTemplates", {
    name: "listTemplates",
    description: `Optionally, filter by a search query or tags.`,
    inputSchema: {"type":"object","properties":{"q":{"type":"string","description":"Optional search query. Filter by template name."},"shared":{"type":"boolean","description":"Returns only the shared templates."},"deleted":{"type":"boolean","description":"Optional. Returns only the deleted templates."},"count":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify how many templates to return. Default is 50 templates, maximum is 100 templates."},"page":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify which page of the dataset to return."},"id":{"type":"string","description":"Optionally, specify template ID."},"folder_uuid":{"type":"string","description":"UUID of the folder where the templates are stored."},"tag":{"type":"array","items":{"type":"string"},"description":"Optional search tag. Filter by template tag."}}},
    method: "get",
    pathTemplate: "/public/v1/templates",
    executionParameters: [{"name":"q","in":"query"},{"name":"shared","in":"query"},{"name":"deleted","in":"query"},{"name":"count","in":"query"},{"name":"page","in":"query"},{"name":"id","in":"query"},{"name":"folder_uuid","in":"query"},{"name":"tag","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsTemplate", {
    name: "detailsTemplate",
    description: `Return detailed data about a template.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Template ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/templates/{id}/details",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteTemplate", {
    name: "deleteTemplate",
    description: `Delete a template`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Template ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/public/v1/templates/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listForm", {
    name: "listForm",
    description: `List forms.`,
    inputSchema: {"type":"object","properties":{"count":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify how many forms to return. Default is 50 forms, maximum is 100 forms."},"page":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify which page of the dataset to return."},"status":{"type":"array","items":{"type":"string","enum":["draft","active","disabled"]},"description":"Optionally, specify which status of the forms dataset to return."},"order_by":{"type":"string","enum":["name","responses","status","created_date","modified_date"],"description":"Optionally, specify the form dataset order to return."},"asc":{"type":"boolean","description":"Optionally, specify sorting the result-set in ascending or descending order."},"name":{"type":"string","description":"Specify the form name."}}},
    method: "get",
    pathTemplate: "/public/v1/forms",
    executionParameters: [{"name":"count","in":"query"},{"name":"page","in":"query"},{"name":"status","in":"query"},{"name":"order_by","in":"query"},{"name":"asc","in":"query"},{"name":"name","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listDocumentFolders", {
    name: "listDocumentFolders",
    description: `Get the list of folders that contain Documents in your account.`,
    inputSchema: {"type":"object","properties":{"parent_uuid":{"type":"string","description":"The UUID of the folder containing folders. To list the folders located in the root folder, remove this parameter in the request."},"count":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify how many folders to return. Default is 50 folders, maximum is 100 folders."},"page":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify which page of the dataset to return."}}},
    method: "get",
    pathTemplate: "/public/v1/documents/folders",
    executionParameters: [{"name":"parent_uuid","in":"query"},{"name":"count","in":"query"},{"name":"page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createDocumentFolder", {
    name: "createDocumentFolder",
    description: `Create a new folder to store your documents.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"name":{"type":"string","description":"Name the folder for the Documents you are creating."},"parent_uuid":{"type":"string","description":"ID of the parent folder. To create a new folder in the root folder, remove this parameter in the request."}},"required":["name"],"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/documents/folders",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["renameDocumentFolder", {
    name: "renameDocumentFolder",
    description: `Rename Documents Folder.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"The UUID of the folder that you are renaming."},"requestBody":{"type":"object","properties":{"name":{"type":"string","description":"Provide a new name for the folder."}},"required":["name"],"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/public/v1/documents/folders/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listTemplateFolders", {
    name: "listTemplateFolders",
    description: `Get the list of folders that contain Templates in your account.`,
    inputSchema: {"type":"object","properties":{"parent_uuid":{"type":"string","description":"The UUID of the folder containing folders. To list the folders located in the root folder, remove this parameter in the request."},"count":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify how many folders to return. Default is 50 folders, maximum is 100 folders."},"page":{"type":"number","format":"int32","minimum":1,"description":"Optionally, specify which page of the dataset to return."}}},
    method: "get",
    pathTemplate: "/public/v1/templates/folders",
    executionParameters: [{"name":"parent_uuid","in":"query"},{"name":"count","in":"query"},{"name":"page","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createTemplateFolder", {
    name: "createTemplateFolder",
    description: `Create a new folder to store your templates.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"name":{"type":"string","description":"Name the folder for Templates you are creating."},"parent_uuid":{"type":"string","description":"ID of the parent folder. To create a new folder in the root folder, remove this parameter in the request."}},"required":["name"],"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/templates/folders",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["renameTemplateFolder", {
    name: "renameTemplateFolder",
    description: `Rename a templates folder.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"The UUID of the folder which you are renaming."},"requestBody":{"type":"object","properties":{"name":{"type":"string","description":"Provide a new name for the folder."}},"required":["name"],"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/public/v1/templates/folders/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listLogs", {
    name: "listLogs",
    description: `Get the list of all logs within the selected workspace. Optionally filter by date, page, and \`#\` of items per page.`,
    inputSchema: {"type":"object","properties":{"since":{"type":"string","description":"Determines a point in time from which logs should be fetched. Either a specific ISO 8601 datetime or a relative identifier such as \"-90d\" (for past 90 days)."},"to":{"type":"string","description":"Determines a point in time from which logs should be fetched. Either a specific ISO 8601 datetime or a relative identifier such as \"-10d\" (for past 10 days) or a special \"now\" value."},"count":{"type":"number","format":"int32","minimum":1,"description":"The amount of items on each page."},"page":{"type":"number","format":"int32","minimum":1,"description":"Page number of the results returned."},"statuses":{"type":"array","items":{"type":"number","enum":[100,200,300,400,500]},"description":"Returns only the predefined status codes. Allows 1xx, 2xx, 3xx, 4xx, and 5xx."},"methods":{"type":"array","items":{"type":"string","enum":["GET","POST","PUT","PATCH","DELETE"]},"description":"Returns only the predefined HTTP methods. Allows GET, POST, PUT, PATCH, and DELETE."},"search":{"type":"string","description":"Returns the results containing a string."},"environment_type":{"type":"string","enum":["PRODUCTION","SANDBOX"],"description":"Returns logs for production/sandbox."}}},
    method: "get",
    pathTemplate: "/public/v1/logs",
    executionParameters: [{"name":"since","in":"query"},{"name":"to","in":"query"},{"name":"count","in":"query"},{"name":"page","in":"query"},{"name":"statuses","in":"query"},{"name":"methods","in":"query"},{"name":"search","in":"query"},{"name":"environment_type","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsLog", {
    name: "detailsLog",
    description: `Returns details of the specific API log event.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Log event id."}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/logs/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listContacts", {
    name: "listContacts",
    description: `List contacts`,
    inputSchema: {"type":"object","properties":{"email":{"type":"string","description":"Optional search parameter. Filter results by exact match."}}},
    method: "get",
    pathTemplate: "/public/v1/contacts",
    executionParameters: [{"name":"email","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createContact", {
    name: "createContact",
    description: `Create contact`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"email":{"type":"string"},"first_name":{"type":["string","null"]},"last_name":{"type":["string","null"]},"company":{"type":["string","null"]},"job_title":{"type":["string","null"]},"phone":{"type":["string","null"]},"state":{"type":["string","null"]},"street_address":{"type":["string","null"]},"city":{"type":["string","null"]},"postal_code":{"type":["string","null"]}},"required":["email"],"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/contacts",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsContact", {
    name: "detailsContact",
    description: `Get contact details by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Contact id."}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/contacts/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteContact", {
    name: "deleteContact",
    description: `Delete contact by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Contact id."}},"required":["id"]},
    method: "delete",
    pathTemplate: "/public/v1/contacts/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["updateContact", {
    name: "updateContact",
    description: `Update contact by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Contact id."},"requestBody":{"type":"object","properties":{"email":{"type":"string"},"first_name":{"type":["string","null"]},"last_name":{"type":["string","null"]},"company":{"type":["string","null"]},"job_title":{"type":["string","null"]},"phone":{"type":["string","null"]},"state":{"type":["string","null"]},"street_address":{"type":["string","null"]},"city":{"type":["string","null"]},"postal_code":{"type":["string","null"]}},"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/contacts/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listMembers", {
    name: "listMembers",
    description: `Retrieve all members details of the workspace`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/public/v1/members",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsCurrentMember", {
    name: "detailsCurrentMember",
    description: `A method to define to whom credentials belong`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/public/v1/members/current",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsMember", {
    name: "detailsMember",
    description: `A method to retrieve a member's details by id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Membership id"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/members/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listWebhookSubscriptions", {
    name: "listWebhookSubscriptions",
    description: `Get all webhook subscriptions`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/public/v1/webhook-subscriptions",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["createWebhookSubscription", {
    name: "createWebhookSubscription",
    description: `Create webhook subscription`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string","format":"url"},"payload":{"type":["array","null"],"items":{"type":"string","enum":["metadata","fields","products","tokens","pricing"],"example":"pricing"}},"triggers":{"type":["array","null"],"items":{"type":"string","enum":["recipient_completed","document_updated","document_deleted","document_state_changed","document_creation_failed","quote_updated"],"example":"document_state_changed"}}},"required":["name","url","triggers"],"description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/public/v1/webhook-subscriptions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsWebhookSubscription", {
    name: "detailsWebhookSubscription",
    description: `Get webhook subscription by uuid`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Webhook subscription uuid"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/webhook-subscriptions/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["deleteWebhookSubscription", {
    name: "deleteWebhookSubscription",
    description: `Delete webhook subscription`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Webhook subscription uuid"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/public/v1/webhook-subscriptions/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["updateWebhookSubscription", {
    name: "updateWebhookSubscription",
    description: `Update webhook subscription`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Webhook subscription uuid"},"requestBody":{"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string","format":"url"},"active":{"type":"boolean","default":true},"payload":{"type":["array","null"],"items":{"type":"string","enum":["metadata","fields","products","tokens","pricing"],"example":"pricing"}},"triggers":{"type":["array","null"],"items":{"type":"string","enum":["recipient_completed","document_updated","document_deleted","document_state_changed","document_creation_failed","quote_updated"],"example":"document_state_changed"}}},"description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "patch",
    pathTemplate: "/public/v1/webhook-subscriptions/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["updateWebhookSubscriptionSharedKey", {
    name: "updateWebhookSubscriptionSharedKey",
    description: `Regenerate webhook subscription shared key`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Webhook subscription uuid"}},"required":["id"]},
    method: "patch",
    pathTemplate: "/public/v1/webhook-subscriptions/{id}/shared-key",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["listWebhookEvent", {
    name: "listWebhookEvent",
    description: `Get webhook event page`,
    inputSchema: {"type":"object","properties":{"count":{"type":"number","format":"int32","minimum":0,"description":"Number of element in page"},"page":{"type":"number","format":"int32","minimum":0,"description":"Page number"},"since":{"type":"string","format":"date-time","description":"Filter option: all events from specified timestamp"},"to":{"type":"string","format":"date-time","description":"Filter option: all events up to specified timestamp"},"type":{"type":"array","items":{"type":"string","enum":["recipient_completed","document_updated","document_deleted","document_state_changed","document_creation_failed","quote_updated"]},"description":"Filter option: all events of type"},"http_status_code":{"type":"array","items":{"type":"number","format":"int32","enum":[100,200,300,400,500]},"description":"Filter option: all events of http status code"},"error":{"type":"array","items":{"type":"string","enum":["INTERNAL_ERROR","NOT_VALID_URL","CONNECT_ERROR","TIMEOUT_ERROR"]},"description":"Filter option: all events with following error"}},"required":["count","page"]},
    method: "get",
    pathTemplate: "/public/v1/webhook-events",
    executionParameters: [{"name":"count","in":"query"},{"name":"page","in":"query"},{"name":"since","in":"query"},{"name":"to","in":"query"},{"name":"type","in":"query"},{"name":"http_status_code","in":"query"},{"name":"error","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
  ["detailsWebhookEvent", {
    name: "detailsWebhookEvent",
    description: `Get webhook event by uuid`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","format":"uuid","description":"Webhook event uuid"}},"required":["id"]},
    method: "get",
    pathTemplate: "/public/v1/webhook-events/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"apiKey":[]},{"oauth2":[]}]
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "apiKey": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header"
    },
    "oauth2": {
      "type": "oauth2",
      "flows": {
        "authorizationCode": {
          "authorizationUrl": "https://app.pandadoc.com/oauth2/authorize",
          "tokenUrl": "https://api.pandadoc.com/oauth2/access_token",
          "refreshUrl": "https://api.pandadoc.com/oauth2/access_token",
          "scopes": {
            "read+write": "Use `read+write` to create, send, delete, and download documents, and `read` to view templates and document details."
          }
        }
      },
      "description": "Send the authenticating user to the PandaDoc OAuth2 request URL. We recommend a button or a link titled\n\"Connect to PandaDoc\" if you are connecting users from a custom application. Users will see the \"Authorize Application\" screen.\nWhen the user clicks \"Authorize\", PandaDoc redirects the user back to your site with an authorization code inside the URL.\n\nhttps://app.pandadoc.com/oauth2/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=read+write&response_type=code\n\n`client_id` and `redirect_uri` values should match your application settings.\n"
    }
  };


server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});



/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials
        const clientId = process.env[`OAUTH_CLIENT_ID_SCHEMENAME`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_SCHEMENAME`];
        const scopes = process.env[`OAUTH_SCOPES_SCHEMENAME`];
        
        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }
        
        console.error(`Requesting OAuth2 token from ${tokenUrl}`);
        
        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 * 
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL
    const requestUrl = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }


    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            // HTTP security (basic, bearer)
            if (scheme.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    return !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    return !!process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] && 
                           !!process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
            }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
            // HTTP security (Bearer or Basic)
            else if (scheme?.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    const token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (token) {
                        headers['authorization'] = `Bearer ${token}`;
                        console.error(`Applied Bearer token for '${schemeName}'`);
                    }
                } 
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    const username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    const password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (username && password) {
                        headers['authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
                        console.error(`Applied Basic authentication for '${schemeName}'`);
                    }
                }
            }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(), 
      url: requestUrl, 
      params: queryParams, 
      headers: headers,
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);
    
    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}


/**
 * Main function to start the server
 */
async function main() {
// Set up Web Server transport
  try {
    await setupWebServer(server, 3000);
  } catch (error) {
    console.error("Error setting up web server:", error);
    process.exit(1);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}
