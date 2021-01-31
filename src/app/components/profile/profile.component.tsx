import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { App } from 'src/react/containers/App';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('app', { static: false }) container!: ElementRef;
  ngOnInit(){}
  ngAfterViewInit(){
    this.render();
  }
  ngOnDestroy(){
    unmountComponentAtNode(this.container.nativeElement);
  }
  render(){
    render(<App />, this.container.nativeElement);
  }
}
