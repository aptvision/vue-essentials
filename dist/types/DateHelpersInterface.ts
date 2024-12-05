interface IUserDateFormat {
    date: string;
    dateTime:string;
    dateTimeSec:string;
    time:string
  } 

export interface IDateHelpersConfig {
  localeCode?: string;
  $_t?:any;
  userDateFormat?:IUserDateFormat;
  cos?:string
}