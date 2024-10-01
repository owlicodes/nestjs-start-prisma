import { SetMetadata } from "@nestjs/common";

export const AllowNullResponse = () => SetMetadata("allowNullResponse", true);
