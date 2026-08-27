/**
 * Declares a repository's SQL columns from its DTO type, with compile-time
 * exhaustiveness: passing an object literal that's missing a DTO field, or
 * that names a key `T` doesn't have, is a type error. The `-?` strips
 * optionality so an optional DTO field (e.g. `AuthenticatorDTO.transports`)
 * still has to be listed explicitly instead of silently omittable.
 *
 * Column names are assumed to equal DTO property names (see BaseRepository).
 */
export function defineColumns<T>(columns: { [K in keyof T]-?: true }): (keyof T & string)[] {
  return Object.keys(columns) as (keyof T & string)[];
}
