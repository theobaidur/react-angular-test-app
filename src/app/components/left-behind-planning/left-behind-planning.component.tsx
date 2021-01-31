import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { App } from 'src/react/containers/App';

@Component({
  selector: 'app-left-behind-planning',
  templateUrl: './left-behind-planning.component.html',
  styleUrls: ['./left-behind-planning.component.scss']
})
export class LeftBehindPlanningComponent implements OnInit, OnDestroy, AfterViewInit{
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
