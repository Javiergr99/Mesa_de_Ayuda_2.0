import type { AccessRepository } from "@/features/access/model/access.types";
import { accessItems } from "@/features/access/data/access.mock";
import { delay } from "@/shared/lib/delay";

export const accessRepository: AccessRepository = {
  async getAccesses() {
    await delay(650);
    return accessItems;
  },
};
