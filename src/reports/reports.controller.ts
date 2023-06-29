import { Controller,Post,Body,UseGuards,Patch, Param, Get, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportsService } from './reports.service';
import { Authguard } from '../guards/auth.guards';
import { CurrentUser } from '../users/decorators/current-user.decorators';
import { UserEntity } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { serialize } from '../interceptors/serialize.interceptor';
import { ApproveReportdto } from './dtos/Approve-dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimatedto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportservice: ReportsService){}
    
    @Get()
    getEstimate(@Query() query: GetEstimatedto){
        return this.reportservice.createEstimate(query);
    }
    
    
    @Post()
    @UseGuards(Authguard)
    @serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: UserEntity) {
        return this.reportservice.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approverequest(@Param('id') id: string, @Body() body: ApproveReportdto){
        return this.reportservice.changeApproval(id,body.approved);
    }

}
