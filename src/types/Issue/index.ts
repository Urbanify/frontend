import type { ComboboxOptions } from '@/components/ui/combobox/combobox';

export type IssueType =
  // Infraestrutura
  | 'ROAD_POTHOLE'
  | 'DAMAGED_SIGNAGE'
  | 'DAMAGED_SIDEWALK'
  | 'STREETLIGHT_OUT'
  // Meio ambiente
  | 'FALLEN_WIRES'
  | 'WALL_RISK_OF_COLLAPSE'
  | 'EROSION'
  | 'ABANDONED_CONSTRUCTION'
  | 'FALLEN_TREE'
  | 'TREE_COLLAPSE_RISK'
  | 'ILLEGAL_DEFORESTATION'
  | 'GARBAGE_ACCUMULATION'
  | 'ILLEGAL_WASTE_DISPOSAL'
  | 'SEWAGE_LEAK'
  | 'LACK_OF_SANITATION'
  | 'DEAD_ANIMALS'
  | 'FLOODING'
  // Transporte
  | 'DAMAGED_BUS_STOP'
  | 'OBSTRUCTED_BIKE_LANE'
  | 'ILLEGAL_PARKING'
  | 'ABANDONED_VEHICLE'
  | 'FADED_PEDESTRIAN_CROSSWALK'
  // Segurança
  | 'DARK_AREA'
  | 'VANDALISM'
  | 'GRAFFITI'
  | 'STRUCTURAL_RISK'
  // Comunidade
  | 'ILLEGAL_OCCUPATION'
  | 'ILLEGAL_CONSTRUCTION';

export type IssueCategory =
  | 'INFRASTRUCTURE'
  | 'ENVIRONMENT'
  | 'TRANSPORTATION'
  | 'SAFETY'
  | 'COMUNITY';

export const issueCategories: ComboboxOptions = [
  { value: 'INFRASTRUCTURE', label: 'Issues.types.INFRASTRUCTURE', isHeading: true },
  { value: 'ROAD_POTHOLE', label: 'Issues.types.ROAD_POTHOLE' },
  { value: 'DAMAGED_SIGNAGE', label: 'Issues.types.DAMAGED_SIGNAGE' },
  { value: 'DAMAGED_SIDEWALK', label: 'Issues.types.DAMAGED_SIDEWALK' },
  { value: 'STREETLIGHT_OUT', label: 'Issues.types.STREETLIGHT_OUT' },
  { value: 'FALLEN_WIRES', label: 'Issues.types.FALLEN_WIRES' },
  { value: 'WALL_RISK_OF_COLLAPSE', label: 'Issues.types.WALL_RISK_OF_COLLAPSE' },
  { value: 'EROSION', label: 'Issues.types.EROSION' },
  { value: 'ABANDONED_CONSTRUCTION', label: 'Issues.types.ABANDONED_CONSTRUCTION' },
  { value: 'ENVIRONMENT', label: 'Issues.types.ENVIRONMENT', isHeading: true },
  { value: 'FALLEN_TREE', label: 'Issues.types.FALLEN_TREE' },
  { value: 'TREE_COLLAPSE_RISK', label: 'Issues.types.TREE_COLLAPSE_RISK' },
  { value: 'ILLEGAL_DEFORESTATION', label: 'Issues.types.ILLEGAL_DEFORESTATION' },
  { value: 'GARBAGE_ACCUMULATION', label: 'Issues.types.GARBAGE_ACCUMULATION' },
  { value: 'ILLEGAL_WASTE_DISPOSAL', label: 'Issues.types.ILLEGAL_WASTE_DISPOSAL' },
  { value: 'SEWAGE_LEAK', label: 'Issues.types.SEWAGE_LEAK' },
  { value: 'LACK_OF_SANITATION', label: 'Issues.types.LACK_OF_SANITATION' },
  { value: 'DEAD_ANIMALS', label: 'Issues.types.DEAD_ANIMALS' },
  { value: 'FLOODING', label: 'Issues.types.FLOODING' },
  { value: 'TRANSPORTATION', label: 'Issues.types.TRANSPORTATION', isHeading: true },
  { value: 'DAMAGED_BUS_STOP', label: 'Issues.types.DAMAGED_BUS_STOP' },
  { value: 'OBSTRUCTED_BIKE_LANE', label: 'Issues.types.OBSTRUCTED_BIKE_LANE' },
  { value: 'ILLEGAL_PARKING', label: 'Issues.types.ILLEGAL_PARKING' },
  { value: 'ABANDONED_VEHICLE', label: 'Issues.types.ABANDONED_VEHICLE' },
  { value: 'FADED_PEDESTRIAN_CROSSWALK', label: 'Issues.types.FADED_PEDESTRIAN_CROSSWALK' },
  { value: 'SAFETY', label: 'Issues.types.SAFETY', isHeading: true },
  { value: 'DARK_AREA', label: 'Issues.types.DARK_AREA' },
  { value: 'VANDALISM', label: 'Issues.types.VANDALISM' },
  { value: 'GRAFFITI', label: 'Issues.types.GRAFFITI' },
  { value: 'STRUCTURAL_RISK', label: 'Issues.types.STRUCTURAL_RISK' },
  { value: 'COMUNITY', label: 'Issues.types.COMUNITY', isHeading: true },
  { value: 'ILLEGAL_OCCUPATION', label: 'Issues.types.ILLEGAL_OCCUPATION' },
  { value: 'ILLEGAL_CONSTRUCTION', label: 'Issues.types.ILLEGAL_CONSTRUCTION' },
];
