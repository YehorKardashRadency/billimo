import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(readonly router:Router) { }

  ngOnInit(): void {
  }

  scrollIntoSection(sectionId:string){
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({
      behavior:'smooth',
    });
  }

}
