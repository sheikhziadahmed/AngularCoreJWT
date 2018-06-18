import { Component, OnInit,Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserRegistration } from '../../shared/models/user.registration.interface';
import { UserService } from '../../shared/services/user.service';
import { slideInOutAnimation,fadeInAnimation } from '../../shared/animations/index';
import { Observable } from 'rxjs/Observable';
import {startWith, map} from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
  animations: [fadeInAnimation],
 
  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' }
  
})


export class RegistrationFormComponent implements OnInit,OnDestroy {
  location:any="";
  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;
  options = [];
  private alive: boolean = true;
  genders:string[] = ["male","female","other"];
  hide = true;

  // myGroup:FormGroup =this.fb.group({
  //   countryGroup: '',
  // });


  // countyNames:any;
  // countryGroups: countryGroup[] = [{
  //   letter: 'A',
  //   names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  // }, {
  //   letter: 'C',
  //   names: ['California', 'Colorado', 'Connecticut']
  // }, {
  //   letter: 'D',
  //   names: ['Delaware']
  // }, {
  //   letter: 'F',
  //   names: ['Florida']
  // }, {
  //   letter: 'G',
  //   names: ['Georgia']
  // }, {
  //   letter: 'H',
  //   names: ['Hawaii']
  // }, {
  //   letter: 'I',
  //   names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
  // }, {
  //   letter: 'K',
  //   names: ['Kansas', 'Kentucky']
  // }, {
  //   letter: 'L',
  //   names: ['Louisiana']
  // }, {
  //   letter: 'M',
  //   names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
  //     'Minnesota', 'Mississippi', 'Missouri', 'Montana']
  // }, {
  //   letter: 'N',
  //   names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  //     'New Mexico', 'New York', 'North Carolina', 'North Dakota']
  // }, {
  //   letter: 'O',
  //   names: ['Ohio', 'Oklahoma', 'Oregon']
  // }, {
  //   letter: 'P',
  //   names: ['Pennsylvania']
  // }, {
  //   letter: 'R',
  //   names: ['Rhode Island']
  // }, {
  //   letter: 'S',
  //   names: ['South Carolina', 'South Dakota']
  // }, {
  //   letter: 'T',
  //   names: ['Tennessee', 'Texas']
  // }, {
  //   letter: 'U',
  //   names: ['Utah']
  // }, {
  //   letter: 'V',
  //   names: ['Vermont', 'Virginia']
  // }, {
  //   letter: 'W',
  //   names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  // }];
 
  // countryGroupOptions: Observable<countryGroup[]>;
  // myControl = new FormControl();
  
  // filteredOptions: Observable<countryNaming[]>;

  constructor(private userService: UserService,private router: Router,private fb: FormBuilder) {
    
   }
   ngOnDestroy() {
    this.alive = false;
  }

  ngOnInit() {
    
    this.userService.getCountries().takeWhile(() => this.alive).subscribe(result=> 
      this.options =result
     );
    
    
    // this.countryGroupOptions = this.myGroup.get('countryGroup')!.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(val => this.filterGroup(val))
    //   );
    //   this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith<string | countryNaming>(''),
    //     map(value => typeof value === 'string' ? value : value.name),
    //     map(name => name ? this.filter(name) : this.options.slice())
    //   );


      
      
  }
  // filter(name: string): countryNaming[] {
  //   return this.options.filter(option =>
  //     option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  // }

  // displayFn(user?: countryNaming): string | undefined {
  //   return user ? user.name : undefined;
  // }

  

  // filterGroup(val: any): countryGroup[] {
  //   if (val) {
  //     return this.countryGroups
  //       .map(group => ({ letter: group.letter, names: this._filter(group.names, val) }))
  //       .filter(group => group.names.length > 0);
  //   }

  //   return this.countryGroups;
  // }

  // private _filter(opt: string[], val: string) {
  //   const filterValue = val.toLowerCase();
  //   return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  // }

  registerUser({ value, valid }: { value: UserRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors='';
    if(valid)
    console.log(value);
    {
        this.userService.register(value.email,value.password,value.firstName,value.lastName,value.location,value.gender,value.birthDate)
                  .finally(() => this.isRequesting = false)
                  .subscribe(
                    result  => {if(result){
                        this.router.navigate(['/login'],{queryParams: {brandNew: true,email:value.email}});                         
                    }},
                    errors =>  this.errors = errors);
    }      
 } 

 

   

}
// export interface countryGroup {
//   letter: string;
//   names: string[];
// }

// export class countryNaming {
//   constructor(public name: string) { }
// }
