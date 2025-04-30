import { storage } from "../storage";
import { EducationalResource, InsertEducationalResource } from "@shared/schema";

export async function getAllEducationalResources(): Promise<EducationalResource[]> {
  return storage.getEducationalResources();
}

export async function getEducationalResourcesByType(type: string): Promise<EducationalResource[]> {
  return storage.getEducationalResourcesByType(type);
}

export async function getEducationalResourceById(id: number): Promise<EducationalResource | undefined> {
  return storage.getEducationalResource(id);
}

export async function createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource> {
  return storage.createEducationalResource(resource);
}
