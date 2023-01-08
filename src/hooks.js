import { RugoException } from "@rugo-vn/exception";

export const before = {
  async all(args) {
    const { spaceId, driveName } = args;

    if (!spaceId || !driveName) { throw new RugoException('Fx service must have spaceId and driveName as default arguments'); }

    args.id = { spaceId, driveName };
  }
}