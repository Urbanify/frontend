import {
  AlertTriangle,
  BadgeAlert,
  Bike,
  Building,
  Bus,
  BusFront,
  Cable,
  Car,
  CloudRain,
  Construction,
  Dam,
  Droplet,
  DropletOff,
  Factory,
  FlashlightOff,
  Highlighter,
  House,
  Leaf,
  LightbulbOff,
  ParkingSquare,
  ShieldAlert,
  Signpost,
  Skull,
  TrafficCone,
  Trash2,
  TreeDeciduous,
  TreePine,
  Trees,
  Users,
} from 'lucide-react';

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
  { value: 'INFRASTRUCTURE', label: 'Issues.types.INFRASTRUCTURE', isHeading: true, icon: Construction },
  { value: 'ROAD_POTHOLE', label: 'Issues.types.ROAD_POTHOLE', icon: TrafficCone },
  { value: 'DAMAGED_SIGNAGE', label: 'Issues.types.DAMAGED_SIGNAGE', icon: Signpost },
  { value: 'DAMAGED_SIDEWALK', label: 'Issues.types.DAMAGED_SIDEWALK', icon: Construction },
  { value: 'STREETLIGHT_OUT', label: 'Issues.types.STREETLIGHT_OUT', icon: LightbulbOff },
  { value: 'FALLEN_WIRES', label: 'Issues.types.FALLEN_WIRES', icon: Cable },
  { value: 'WALL_RISK_OF_COLLAPSE', label: 'Issues.types.WALL_RISK_OF_COLLAPSE', icon: Building },
  { value: 'EROSION', label: 'Issues.types.EROSION', icon: Dam },
  { value: 'ABANDONED_CONSTRUCTION', label: 'Issues.types.ABANDONED_CONSTRUCTION', icon: Construction },
  { value: 'ENVIRONMENT', label: 'Issues.types.ENVIRONMENT', isHeading: true, icon: Leaf },
  { value: 'FALLEN_TREE', label: 'Issues.types.FALLEN_TREE', icon: TreeDeciduous },
  { value: 'TREE_COLLAPSE_RISK', label: 'Issues.types.TREE_COLLAPSE_RISK', icon: TreePine },
  { value: 'ILLEGAL_DEFORESTATION', label: 'Issues.types.ILLEGAL_DEFORESTATION', icon: Trees },
  { value: 'GARBAGE_ACCUMULATION', label: 'Issues.types.GARBAGE_ACCUMULATION', icon: Trash2 },
  { value: 'ILLEGAL_WASTE_DISPOSAL', label: 'Issues.types.ILLEGAL_WASTE_DISPOSAL', icon: Trash2 },
  { value: 'SEWAGE_LEAK', label: 'Issues.types.SEWAGE_LEAK', icon: Droplet },
  { value: 'LACK_OF_SANITATION', label: 'Issues.types.LACK_OF_SANITATION', icon: DropletOff },
  { value: 'DEAD_ANIMALS', label: 'Issues.types.DEAD_ANIMALS', icon: Skull },
  { value: 'FLOODING', label: 'Issues.types.FLOODING', icon: CloudRain },
  { value: 'TRANSPORTATION', label: 'Issues.types.TRANSPORTATION', isHeading: true, icon: Bus },
  { value: 'DAMAGED_BUS_STOP', label: 'Issues.types.DAMAGED_BUS_STOP', icon: BusFront },
  { value: 'OBSTRUCTED_BIKE_LANE', label: 'Issues.types.OBSTRUCTED_BIKE_LANE', icon: Bike },
  { value: 'ILLEGAL_PARKING', label: 'Issues.types.ILLEGAL_PARKING', icon: ParkingSquare },
  { value: 'ABANDONED_VEHICLE', label: 'Issues.types.ABANDONED_VEHICLE', icon: Car },
  { value: 'FADED_PEDESTRIAN_CROSSWALK', label: 'Issues.types.FADED_PEDESTRIAN_CROSSWALK', icon: Signpost },
  { value: 'SAFETY', label: 'Issues.types.SAFETY', isHeading: true, icon: ShieldAlert },
  { value: 'DARK_AREA', label: 'Issues.types.DARK_AREA', icon: FlashlightOff },
  { value: 'VANDALISM', label: 'Issues.types.VANDALISM', icon: BadgeAlert },
  { value: 'GRAFFITI', label: 'Issues.types.GRAFFITI', icon: Highlighter },
  { value: 'STRUCTURAL_RISK', label: 'Issues.types.STRUCTURAL_RISK', icon: AlertTriangle },
  { value: 'COMUNITY', label: 'Issues.types.COMUNITY', isHeading: true, icon: Users },
  { value: 'ILLEGAL_OCCUPATION', label: 'Issues.types.ILLEGAL_OCCUPATION', icon: House },
  { value: 'ILLEGAL_CONSTRUCTION', label: 'Issues.types.ILLEGAL_CONSTRUCTION', icon: Factory },
];

export type IssueStatus =
  | 'WAITING_FOR_FISCAL'
  | 'WAITING_FOR_PROCEDURE'
  | 'WAITING_FOR_MANAGER'
  | 'WAITING_FOR_MANAGER_RESOLUTION'
  | 'WAITING_FOR_RESOLUTION_VALIDATION'
  | 'SOLVED'
  | 'CLOSED';

export type Issue = {
  id: string;
  status: IssueStatus;
  cityId: string;
  latitude: string;
  longitude: string;
  category: IssueCategory;
  type: IssueType;
  description: string;
  reporterId: string;
  fiscalId: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
};

export type IssueHistoryAction =
  | 'REPORTED_ISSUE'
  | 'ASSIGNED_AS_FISCAL'
  | 'ASSIGNED_AS_MANAGER'
  | 'MARKED_AS_UNFOUNDED'
  | 'MARKED_AS_VALID'
  | 'ADDED_RESOLUTION'
  | 'MARKED_AS_SOLVED';

export type IssueHistory = {
  id: string;
  userId: string;
  userName: string;
  action: IssueHistoryAction;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type IssueDetails = Issue & { photos?: string[]; history: IssueHistory[] };
