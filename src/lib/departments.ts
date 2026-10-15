import type { IssueType } from '@/types/Issue';

// Default mapping from issue types to city departments. The v2 API has no departments table, so the
// sidebar filters the city issues by type. In v3 this moves to the database and becomes configurable.
export type Department = {
  slug: string;
  label: string;
  types: IssueType[];
};

export const DEPARTMENTS: Department[] = [
  { slug: 'obras', label: 'Obras e vias', types: ['ROAD_POTHOLE', 'DAMAGED_SIDEWALK', 'WALL_RISK_OF_COLLAPSE', 'EROSION', 'ABANDONED_CONSTRUCTION', 'STRUCTURAL_RISK'] },
  { slug: 'iluminacao', label: 'Iluminação pública', types: ['STREETLIGHT_OUT', 'FALLEN_WIRES', 'DARK_AREA'] },
  { slug: 'limpeza', label: 'Limpeza urbana e coleta', types: ['GARBAGE_ACCUMULATION', 'ILLEGAL_WASTE_DISPOSAL', 'DEAD_ANIMALS', 'GRAFFITI'] },
  { slug: 'meio-ambiente', label: 'Meio ambiente e saneamento', types: ['FALLEN_TREE', 'TREE_COLLAPSE_RISK', 'ILLEGAL_DEFORESTATION', 'SEWAGE_LEAK', 'LACK_OF_SANITATION', 'FLOODING'] },
  { slug: 'transito', label: 'Trânsito e transporte', types: ['DAMAGED_SIGNAGE', 'DAMAGED_BUS_STOP', 'OBSTRUCTED_BIKE_LANE', 'ILLEGAL_PARKING', 'ABANDONED_VEHICLE', 'FADED_PEDESTRIAN_CROSSWALK'] },
  { slug: 'fiscalizacao', label: 'Fiscalização urbana', types: ['ILLEGAL_OCCUPATION', 'ILLEGAL_CONSTRUCTION', 'VANDALISM'] },
];

export const departmentBySlug = (slug: string | null) => DEPARTMENTS.find(department => department.slug === slug);

export const departmentForType = (type: IssueType) => DEPARTMENTS.find(department => department.types.includes(type));
