import { Component } from '@angular/core';
import { fadeInAnimation } from '../shared/animations/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInAnimation],
 
  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' }
  
})
export class HomeComponent {
 
  constructor() { }   
}
