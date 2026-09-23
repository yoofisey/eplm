"use server";

import {
  adminAddGalleryImage as libAdminAddGalleryImage,
  adminCreateEvent as libAdminCreateEvent,
  adminCreatePost as libAdminCreatePost,
  adminLogin as libAdminLogin,
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

export async function markMessageStatus(formData: FormData): Promise<void> {
  return libMarkMessageStatus(formData);
}