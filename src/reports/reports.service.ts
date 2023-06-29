import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { UserEntity } from '../users/user.entity';
import { GetEstimatedto } from './dtos/get-estimate.dto';
@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}


    createEstimate({ company, model, lng, lat, year, mileage }: GetEstimatedto) {
        return this.repo.createQueryBuilder()
        .select('AVG(price)','price')
        .where('company = :company', { company })
        .andWhere('model = :model', { model })
        .andWhere('lng -:lng BETWEEN -5 and 5', { lng })
        .andWhere('lat -:lat BETWEEN -5 and 5', { lat })
        .andWhere('approved IS TRUE')
        .andWhere('year -:year BETWEEN -3 and 3', { year })
        .orderBy('ABS(mileage -:mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3)
        .getRawOne()
    }
    create(reportDto : CreateReportDto, user:UserEntity) {
        const report = this.repo.create(reportDto);
        report.user = user;
        return this.repo.save(report);
    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id) }});
        if(!report) {
            throw new NotFoundException('Report Not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }

}
