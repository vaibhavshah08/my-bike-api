import { IsBoolean } from "class-validator";

export class ApproveReportdto{
    @IsBoolean()
    approved: boolean;
}
