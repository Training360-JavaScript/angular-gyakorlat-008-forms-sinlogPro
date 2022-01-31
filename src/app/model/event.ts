// import { Location } from './location';

export class Event {
  [key: string]: any;
  id: number = 0;
  name: string = '';
  date: string = '';
  time: string = '';
  location: string = '';

  // constructor(options?: Event) {
  //   if (!options) return;
  //   for (const key of Object.keys(options)){
  //     this[key] = options[key];
  //   }
  // }
}
