import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import bcrypt from 'bcrypt';
import enviroment from '../consts/enviroment';

export type Role = 'Student' | 'Teacher' | 'Admin';

// These are all the attributes in the User model
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: Role;
  schoolId: number;
  isConfirmed: boolean;
  isTemporary: boolean;
  class?: number;
}

// Payload Interface for the JWT Token
export interface Payload {
  id: number;
  isConfirmed: boolean;
  isTemporary: boolean;
  role: Role;
}

// Some attributes are optional in `User.build` and `User.create` calls
export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public email!: string;
  public password!: string;
  public role!: Role;
  public schoolId!: number;
  public isConfirmed!: boolean;
  public isTemporary!: boolean;
  public class?: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static tableName = 'users';

  //access table name
  public static getTableName = (): string => {
    return User.tableName;
  };

  public static passwordHasher = async (password: string) => {
    const salt = await bcrypt.genSalt(enviroment.saltRounds);
    return await bcrypt.hash(password, salt);
  };

  public isPasswordMatch = async (password: string): Promise<boolean> => {
    return bcrypt.compare(password, this.password);
  };

  public static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: new DataTypes.STRING(128),
          unique: true,
          allowNull: false,
          validate: {
            isEmail: true,
            notEmpty: true,
          },
        },
        password: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        role: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        schoolId: {
          type: DataTypes.INTEGER,
          unique: false,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        isConfirmed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        isTemporary: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        class: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            is: /^[12][0-9]{3}$/i, // regex expression to allow valid years from 1000 - 2999
            notEmpty: false,
          },
        },
      },
      {
        tableName: User.getTableName()!,
        sequelize, // passing the `sequelize` instance is required
        defaultScope: {attributes: {exclude: ['password']}}, // by default the password will not be included
        scopes: {
          withPassword: {
            attributes: {include: ['password']}, // use special scope in order to get user with password
          },
        },
        hooks: {
          // hash password before creating the user
          beforeCreate: async (user: User) => {
            const hashedPassword = await User.passwordHasher(user.password);
            user.password = hashedPassword;
          },
          beforeUpdate: async (user: User) => {
            const hashedPassword = await User.passwordHasher(
              user.password as string
            );
            user.password = hashedPassword;
          },
        },
      }
    );
  }
}

export default User;
