import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { MatSliderChange } from '@angular/material/slider';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }

  ngOnInit() {
    this.onReset();
  }

  title = 'ShouldYouWaitForABoy';
  numCouples: number;
  pMale: number;
  familySizeLimit: boolean;
  maxFamilySize: number;
  timeSteps = 20;

  simulationStatus = false;

  onCoupleChange(coupleEvent: MatSliderChange) {
    this.numCouples = coupleEvent.value;
  }
  onProbabilityChange(probabilityEvent: MatSliderChange) {
    this.pMale = probabilityEvent.value;
  }
  onFamilyLimitChange(familyLimitEvent: MatSlideToggleChange) {
    this.familySizeLimit = familyLimitEvent.checked;
  }
  onFamilySizeChange(familySizeEvent: MatSliderChange) {
    this.maxFamilySize = familySizeEvent.value;
  }
  resetGraph() {
    this.lineChartLabels = [];
    this.lineChartData.forEach(dataset => dataset.data = []);
  }
  onReset() {
    if(!this.simulationStatus) {
      this.numCouples = 1000;
      this.pMale = 0.5;
      this.familySizeLimit = false;
      this.maxFamilySize = 4;
      this.resetGraph();
    }
  }
  onSimulate() {
    if(!this.simulationStatus) {
      this.resetGraph();
      this.simulationStatus = true;
      var familyState = Array(this.numCouples).fill(0);
      var familyHasNoMale = Array(this.numCouples).fill(true);
      this.lineChartData.forEach(dataset => dataset.data = []);
      var initialTime = 2021;
      for (let i=initialTime; i<initialTime+this.timeSteps; i++) { 
        setTimeout(() => {
          this.lineChartLabels.push(i.toString());
          var childCount = [0, 0];
          familyState.forEach((state, idx) => {
            if(((!this.familySizeLimit) || state<this.maxFamilySize) && (familyHasNoMale[idx])) {
              if(Math.random()<this.pMale) {
                childCount[0] = childCount[0] + 1;
                familyHasNoMale[idx] = false;
              }
              else {
                childCount[1] = childCount[1] + 1;
              }
              familyState[idx] = state+1;
            }
          });
          childCount = childCount.map((count, genidx) => (i==initialTime?0:Number(this.lineChartData[genidx].data[i-initialTime-1]))+count);
          this.lineChartData.forEach((dataset, dataidx) => dataset.data.push(childCount[dataidx]));
        }, 300*(i-initialTime))
      }
      setTimeout(() => {
        this.simulationStatus = false;
      }, 300*this.timeSteps);
    }
  }

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Male' },
    { data: [], label: 'Female' }
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true
  };

  lineChartColors: Color[] = [
    {
      borderColor: '#3aaecf',
      backgroundColor: 'rgba(58, 174, 207,0.28)',
    },
    {
      borderColor: '#c546d4',
      backgroundColor: 'rgba(197, 70, 212,0.28)',
    }
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

}
