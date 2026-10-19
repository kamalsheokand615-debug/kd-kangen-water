declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: any[]): any;
    exec(sql: string): any[];
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  export interface Statement {
    bind(params: any[]): this;
    step(): boolean;
    getAsObject(): Record<string, any>;
    get(): any[];
    free(): void;
    run(params?: any[]): any;
    columns: string[];
    values: any[][];
  }

  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => Database;
    locateFile: (file: string) => string;
  }

  export default function initSqlJs(config?: { locateFile?: (file: string) => string }): Promise<SqlJsStatic>;
}