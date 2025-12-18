// Authoritative hazard definitions for room and structure tooling.
// Values are uppercase snake_case to ensure deterministic serialization across services.
export enum HazardType {
  FIRE = 'FIRE',
  FLOOD = 'FLOOD',
  INTRUSION = 'INTRUSION',
  ELECTRICAL = 'ELECTRICAL',
  VACUUM = 'VACUUM',
  FAUNA = 'FAUNA',
}
