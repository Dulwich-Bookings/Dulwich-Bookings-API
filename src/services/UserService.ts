import {UserAttributes, UserCreationAttributes} from '../models/User';
import UserRepository from '../repositories/UserRepository';
import User from '../models/User';

export type DeleteOptions = {
  id: number[];
};

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.getAll();
  }

  async getOneUserById(id: number, showPassword = false) {
    return (
      await (showPassword
        ? this.userRepository.getScopeWithFilters({id}, 'withPassword')
        : this.userRepository.getWithFilters({id}))
    )[0] as User;
  }

  async getOneUserByEmail(email: string, showPassword = false) {
    return (
      await (showPassword
        ? this.userRepository.getScopeWithFilters({email}, 'withPassword')
        : this.userRepository.getWithFilters({email}))
    )[0] as User;
  }

  async createOneUser(user: UserCreationAttributes) {
    return this.userRepository.createOne(user);
  }

  async bulkCreateUser(users: UserCreationAttributes[]) {
    return this.userRepository.bulkCreate(users);
  }

  async bulkDeleteUser(users: DeleteOptions) {
    return this.userRepository.bulkDelete(users);
  }

  async updateOneUserById(id: number, attrs: UserAttributes) {
    return this.userRepository.updateOne(attrs, {id});
  }

  async deleteOneUserById(id: number) {
    return this.userRepository.deleteOne({id});
  }
}
