import { roles } from './auth';
/**
 * Element UI use async validator in its form validation
 * See docs:
 * https://github.com/yiminghe/async-validator
 *
 * https://github.com/tmpfs/async-validate
 */
export const availableRules = {
    required: { required: true, message: 'validate.required' },
    /**
     * Type validate
     */
    string: { type: 'string', message: 'validate.string' },
    number: { type: 'number', message: 'validate.number' },
    array: { type: 'array', message: 'validate.array' },
    boolean: { type: 'boolean', message: 'validate.boolean' },
    integer: { type: 'integer', message: 'validate.integer' },
    double: { type: 'double', message: 'validate.double' },
    float: { type: 'float', message: 'validate.float' },
    object: { type: 'object', message: 'validate.object' },
    /**
     * Enum validation example
     */
    role: {
        type: 'enum',
        enum: roles,
        message: 'validate.role'
    },
    date: { type: 'date', message: 'validate.date' },
    url: { type: 'url', message: 'validate.url' },
    email: { type: 'email', message: 'validate.email' },
    hex: { type: 'hex', message: 'validate.hex' },
    any: { type: 'any', message: 'validate.any' },
    /**
     * Extra rules that require passing param and advanced rule
     */
    max: (val: string | number) => ({
        validator: (rule: any, value: string | number, callback: (arg0: Error) => void) => {
            /**
             * Firstlt, it's must be a number
             */
            if (isNaN(value)) {
                callback(new Error('validate.number'));
            } else if (+value.trim() > val) {
                callback(new Error('validate.max:' + val));
            }
        }
    }),
    min: (val: string | number) => ({
        validator: (rule: any, value: string | number, callback: (arg0: Error) => void) => {
            /**
             * Firstlt, it's must be a number
             */
            if (isNaN(value)) {
                callback(new Error('validate.number'));
            } else if (+value.trim() < val) {
                callback(new Error('validate.min:' + val));
            }
        }
    }),
    length: (val: string | any[]) => ({
        validator: (rule: any, value: string | any[], callback: (arg0: Error) => void) => {
            if (value.length !== val.length) {
                callback(new Error('validate.length:' + val));
            }
        }
    }),
    alpha: {
        validator: (rule: any, value: string, callback: (arg0: Error) => void) => {
            if (!/[a-zA-Z]+/.test(value)) {
                callback(new Error('validate.alpha'));
            }
        }
    },
    alpha_dash: {
        validator: (rule: any, value: string, callback: (arg0: Error) => void) => {
            if (!/[A-Za-z_]+/.test(value)) {
                callback(new Error('validate.alpha_dash'));
            }
        }
    },
    alpha_num: {
        validator: (rule: any, value: string, callback: (arg0: Error) => void) => {
            if (!/[A-Za-z0-9]+/.test(value)) {
                callback(new Error('validate.alpha_num'));
            }
        }
    },
    alpha_spaces: {
        validator: (rule: any, value: string, callback: (arg0: Error) => void) => {
            if (!/[a-zA-Z ]+/.test(value)) {
                callback(new Error('validate.alpha_spaces'));
            }
        }
    },
    no_special: {
        validator: (rule: any, value: string, callback: (arg0: Error) => void) => {
            if (!/[A-Za-z0-9_ ]+/.test(value)) {
                callback(new Error('validate.alpha_spaces'));
            }
        }
    },
    digits: (val: string) => ({
        validator: (rule: any, value: string | number | any[], callback: (arg0: Error) => void) => {
            if (isNaN(value) && value.length !== val) {
                callback(new Error('validate.digits:' + val));
            }
        }
    }),
    excluded: (val: string) => ({
        validator: (rule: any, value: string | any[], callback: (arg0: Error) => any) => {
            val.split(';').forEach((item: string) => {
                if (value.includes(item)) {
                    return callback(new Error('validate.excluded:' + item));
                }
            });
        }
    }),
    is: (val: string) => ({
        validator: (rule: any, value: any, callback: (arg0: Error) => any) => {
            if (val !== value) {
                return callback(new Error('validate.is:' + val));
            }
        }
    }),
    is_not: (val: string) => ({
        validator: (rule: any, value: any, callback: (arg0: Error) => any) => {
            if (val === value) {
                return callback(new Error('validate.is:' + val));
            }
        }
    }),
    credit_card_number: {
        validator: (rule: any, value: string, callback: (arg0: Error) => any) => {
            if (!/\d{4} \d{4} \d{4} \d{4}/.test(value)) {
                return callback(new Error('validate.credit_card'));
            }
        }
    },
    credit_card_expire: {
        validator: (rule: any, value: string, callback: (arg0: Error) => any) => {
            if (!/\d{2}\/\d{2}/.test(value)) {
                return callback(new Error('validate.credit_card_expire'));
            }
        }
    },
    credit_card_cvv: {
        validator: (rule: any, value: string, callback: (arg0: Error) => any) => {
            if (!/\d{3}/.test(value)) {
                return callback(new Error('validate.credit_card_cvv'));
            }
        }
    }
    // confirmed: {},
};
