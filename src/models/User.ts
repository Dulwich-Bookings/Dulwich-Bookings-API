import {Model, DataTypes, Optional, Sequelize} from 'sequelize';
import bcrypt from 'bcrypt';
import enviroment from '../consts/enviroment';
import userFriendlyMessages from '../consts/userFriendlyMessages';
import {Models} from '../types';

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

// Attributes for parsing CSV when doing bulk sign up
export interface BulkSignUpAttributes {
  email: string;
  role: Role;
  class?: number;
}

// Payload Interface for the JWT Token
export interface Payload {
  id: number;
}

// Some attributes are optional in `User.build` and `User.create` calls
export type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class InvalidUserClassError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.invalidClass);
  }
}

export class InvalidUserPasswordError extends Error {
  constructor() {
    super(userFriendlyMessages.failure.invalidPassword);
  }
}

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

  public isClassValid = () => {
    // regex expression to allow valid years from 1000 - 2999
    const isYear = new RegExp('^(19|20)[\\d]{2,2}$');
    if (this.class && !isYear.test(this.class.toString())) {
      throw new InvalidUserClassError();
    }
  };

  public isPasswordValid = () => {
    // regex expression to allow valid passwords with at least 6 characters and
    // at least 1 special character
    const isPassword = new RegExp('^(?=.*[@$!%*#?&])(?=.{6,})');
    if (this.password && !isPassword.test(this.password)) {
      throw new InvalidUserPasswordError();
    }
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
            isLowercase: true,
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
          // hash password and fix email to lowercase before creating the user
          beforeCreate: async (user: User) => {
            user.isClassValid();
            user.isPasswordValid();

            const {password, email} = user;
            const hashedPassword = await User.passwordHasher(password);
            user.password = hashedPassword;

            const lowercaseEmail = email.toLowerCase();
            user.email = lowercaseEmail;
          },
          beforeUpdate: async (user: User) => {
            user.isClassValid();

            const isPasswordChange = user.changed()
              ? (user.changed() as string[]).includes('password')
              : false;
            const isEmailChange = user.changed()
              ? (user.changed() as string[]).includes('email')
              : false;

            if (isPasswordChange) {
              user.isPasswordValid();
              const hashedPassword = await User.passwordHasher(user.password);
              user.password = hashedPassword;
            }
            if (isEmailChange) {
              const lowercaseEmail = user.email.toLowerCase();
              user.email = lowercaseEmail;
            }
          },
          beforeBulkCreate: async (users: User[]) => {
            for (const user of users) {
              user.isClassValid();
              user.isPasswordValid();

              const {password, email} = user;
              const hashedPassword = await User.passwordHasher(password);
              user.password = hashedPassword;

              const lowercaseEmail = email.toLowerCase();
              user.email = lowercaseEmail;
            }
          },
        },
      }
    );
  }

  public static associate(models: Models) {
    User.belongsTo(models.School, {
      foreignKey: 'schoolId',
    });
    User.hasMany(models.Bookmark, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
    });
    User.hasMany(models.RecentlyVisited, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
    });
    User.hasMany(models.ResourceMap, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
    });
    User.hasMany(models.ResourceBooking, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
    });
  }
}

export default User;
