export { userService, UserService } from './services/userService';
export { absenceService, AbsenceService } from './services/absenceService';
export { ideaService, IdeaService } from './services/ideaService';
export { supportService, SupportService } from './services/supportService';
export { meetingService, MeetingService } from './services/meetingService';
export { aboutService, AboutService } from './services/aboutService';
export * as adminService from './services/adminService';
export * as logoService from './services/logoService';
export { createClient } from './client';
export type { Database } from './types';

// Grade hierarchy for promotions (inclut les grades personnalisés)
export const GRADE_HIERARCHY = [
  'Stagiaire',
  'Kappa',
  'Gamma',
  'Membre',
  'Adjoint',
  'Haut communicant',
  'Responsable',
  'Président'
] as const;

export type GradeType = typeof GRADE_HIERARCHY[number];
