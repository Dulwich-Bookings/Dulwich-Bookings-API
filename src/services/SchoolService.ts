import {SchoolAttributes, SchoolCreationAttributes} from '../models/School';
import SchoolRepository from '../repositories/SchoolRepository';
import School from '../models/School';

export default class SchoolService {
  private schoolRepository: SchoolRepository;

  constructor(schoolRepository: SchoolRepository) {
    this.schoolRepository = schoolRepository;
  }

  async createOneSchool(school: SchoolCreationAttributes) {
    return (await this.schoolRepository.createOne(school)) as School;
  }

  async getAllSchools() {
    return (await this.schoolRepository.getAll()) as School[];
  }

  async getOneSchoolById(id: number) {
    return (await this.schoolRepository.getWithFilters({id}))[0] as School;
  }

  async updateOneSchoolById(id: number, attrs: SchoolAttributes) {
    return (await this.schoolRepository.updateOne(attrs, {id})) as School;
  }

  async deleteOneSchoolById(id: number) {
    return this.schoolRepository.deleteOne({id});
  }
}
