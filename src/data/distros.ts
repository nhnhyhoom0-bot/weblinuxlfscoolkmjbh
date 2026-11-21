import { FLAGSHIP_DISTROS } from './flagshipDistros';
import { hydrateDistros } from './catalogBuilder';
import { CATALOG_BATCH_1 } from './catalogBatch1';
import { CATALOG_BATCH_2 } from './catalogBatch2';
import { CATALOG_BATCH_3 } from './catalogBatch3';
import { CATALOG_BATCH_4 } from './catalogBatch4';
import { CATALOG_BATCH_5 } from './catalogBatch5';
import type { Distro } from '../types/linux';

const ALL_SEEDS = [
  ...CATALOG_BATCH_1,
  ...CATALOG_BATCH_2,
  ...CATALOG_BATCH_3,
  ...CATALOG_BATCH_4,
  ...CATALOG_BATCH_5,
];

export const DISTROS: Distro[] = [
  ...FLAGSHIP_DISTROS,
  ...hydrateDistros(ALL_SEEDS, FLAGSHIP_DISTROS.length + 1),
];

export const TOTAL_DISTROS_COUNT = DISTROS.length;
