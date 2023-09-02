/**
 * Collection of available roles
 *
 * You must use these roles for your <auth> wrapper or v-auth directive
 * @readonly Do not modify
 */
const roles = ['SUPERADMIN', 'ADMIN', 'COLABORATOR', 'EDITOR', 'ALL', 'SELF']
/**
 * SUPERADMIN permission
 * @readonly Do not modify
 */
const SUPERADMIN = ['SUPERADMIN']
/**
 * ADMIN permission
 * @readonly Do not modify
 */
const ADMIN = ['ADMIN']
/**
 * EDITOR permission
 * @readonly Do not modify
 */
const EDITOR = ['EDITOR']
/**
 * COLABORATOR permission
 *
 * Including EDITOR permission
 * @readonly Do not modify
 */
const COLABORATOR = ['COLABORATOR', 'EDITOR']
/**
 * Normal user permission
 * @readonly Do not modify
 */
const ALL = ['ALL']
/**
 * Only if user is the author of item
 * @readonly Do not modify
 */
const SELF = ['SELF']

export { roles, SUPERADMIN, ADMIN, COLABORATOR, EDITOR, ALL, SELF }
