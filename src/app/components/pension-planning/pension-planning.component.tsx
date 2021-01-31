import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import { App } from 'src/react/containers/App';

@Component({
  selector: 'app-pension-planning',
  templateUrl: './pension-planning.component.html',
  styleUrls: ['./pension-planning.component.scss']
})
export class PensionPlanningComponent implements OnInit, OnDestroy, AfterViewInit{
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
