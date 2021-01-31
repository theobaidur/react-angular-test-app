import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { App } from 'src/react/containers/App';

@Component({
  selector: 'app-disability-planning',
  templateUrl: './disability-planning.component.html',
  styleUrls: ['./disability-planning.component.scss']
})
export class DisabilityPlanningComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('app', { static: false }) container!: ElementRef;
  ngOnInit(){}
  ngAfterViewInit(){
    this.render();
  }
  ngOnDestroy(){
    unmountComponentAtNode(this.container.nativeElement);
  }
  render(){
    render(<App form='disability-planning' />, this.container.nativeElement);
  }
}
