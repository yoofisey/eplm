"use server";

import {
  adminAddGalleryImage as libAdminAddGalleryImage,
  adminAddMember as libAdminAddMember,
  adminCreateEvent as libAdminCreateEvent,
  adminCreatePost as libAdminCreatePost,
  adminDeleteDues as libAdminDeleteDues,
  adminLogin as libAdminLogin,
  adminMarkDuesPaid as libAdminMarkDuesPaid,
  adminSendText as libAdminSendText,
  markMessageStatus as libMarkMessageStatus,
} from "@/lib/admin";
import type { ActionState } from "@/lib/actions";

export async function adminLogin(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminLogin(prev, formData);
}

export async function adminCreatePost(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminCreatePost(prev, formData);
}

export async function adminCreateEvent(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminCreateEvent(prev, formData);
}

export async function adminAddGalleryImage(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminAddGalleryImage(prev, formData);
}

export async function adminAddMember(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminAddMember(prev, formData);
}

export async function adminMarkDuesPaid(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminMarkDuesPaid(prev, formData);
}

export async function adminDeleteDues(formData: FormData): Promise<void> {
  return libAdminDeleteDues(formData);
}

export async function adminSendText(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return libAdminSendText(prev, formData);
}

export async function markMessageStatus(formData: FormData): Promise<void> {
  return libMarkMessageStatus(formData);
}