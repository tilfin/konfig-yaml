declare module 'konfig-yaml' {
  export interface Options {
    /**
     * config directory path resolved from the process current one ( default NODE_CONFIG_DIR value or config )
     */
    path?: string

    /**
     * Run environment ( default NODE_ENV value or development )
     */
    env?: string

    /** 
     * whether using cache ( default true )
     */
    useCache?: boolean
  }

  /**
   * Load tconfiguration object-yaml loader
   * @param name specifys the name of config/<name>.yml ( default app )
   * @param opts Options
   */
  export default function (name?: string, opts?: Options): any;

  /**
	 * Clear cache
	 */
  export function clear(): void;
}
