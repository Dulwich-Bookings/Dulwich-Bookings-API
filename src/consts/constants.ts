import {Timezone} from '../types/timezone';
import {Role} from '../models/User';
import {WeekProfile} from '../models/Resource';

export const timezone = {
  SHANGHAI: 'Asia/Shanghai' as Timezone,
  SEOUL: 'Asia/Seoul' as Timezone,
  SINGAPORE: 'Asia/Singapore' as Timezone,
  LONDON: 'Europe/London' as Timezone,
};

export const role = {
  ADMIN: 'Admin' as Role,
  STUDENT: 'Student' as Role,
  TEACHER: 'Teacher' as Role,
};

export const weekProfile = {
  WEEKLY: 'Weekly' as WeekProfile,
  BIWEEKLY: 'BiWeekly' as WeekProfile,
};
