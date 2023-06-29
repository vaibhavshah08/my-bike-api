import { Injectable,NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { create } from 'domain';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>) {
    }
    create(email: string, password: string){
        const user = this.repo.create({ email, password});
        return this.repo.save(user);
    }
    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<UserEntity>) {
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('User not Found!!');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const rid = id;
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('User not Found!!');
        }
        console.log('Removed User with id', rid);
        return this.repo.remove(user)
    }
}
