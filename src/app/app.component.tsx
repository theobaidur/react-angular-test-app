import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import App from 'src/react/containers/App';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('app', { static: false }) container!: ElementRef;
  title = 'test-app';
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
