import {RRule} from 'rrule';

class RRuleUtils {
  /**
   * Checks if given RRule is recurring using count option
   * @param rRule RRule to check
   * @returns true, if RRule is recurring using count. False otherwise.
   */
  public static isRecurringUsingCount(rRule: RRule): boolean {
    if (rRule.options.count) {
      return true;
    }
    return false;
  }
}

export default RRuleUtils;
