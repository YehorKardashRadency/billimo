import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { companies } from './companies';
import { Company } from 'src/shared/entities/company.entity';

@Injectable()
export class CompanySeederService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}
  async create() {
    const count = await this.companyRepository.count();
    console.log(`Found ${count} companies`);
    if (count == 0) {
      await this.companyRepository.save(companies);
    } else {
      console.log('Skipping');
    }
  }
}
