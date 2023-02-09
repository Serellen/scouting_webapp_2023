import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatchScoutingL2 } from '../../matchScoutingL2';
import { Scouters } from '../../scouters';

@Component({
  selector: 'app-level2',
  templateUrl: './level2.component.html',
  styleUrls: ['./level2.component.scss']
})
export class Level2Component implements OnInit {

  apiScouters: Scouters[] = [];
  apiMatchL2: MatchScoutingL2[] = [];
  apiMatchL2_filter: MatchScoutingL2[] = [];
  scouter: number = 0;
  display: number = 1;
  effort: number = 0;
  

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private changeDetector: ChangeDetectorRef) {

    this.apiMatchL2_filter = [];
    this.apiMatchL2 = [];
    
    this.apiService.MatchL2Replay.subscribe(match => {
      this.apiMatchL2 = match;
      this.regenerateFilter();
    });

    this.apiService.ScouterReplay.subscribe(types => {
      this.apiScouters = types;
    });


   }

  ngOnInit(): void {
  }

  changeDisplay(d_value: number, scouter: number) {
    this.display = this.display + d_value;  

    if(this.display > 1 && scouter === null) {
      alert("Please select a Scouter Name");
      this.display = 1;
    }


    if(this.display > 4) {
      this.display = 1;
    }
  }

  getClass(value: number, b_type: number) {

    if(value == b_type) {
      return 'button_green';
    } else {
      return 'button_rank';
    }

  }

  getClass2(value: number, b_type: number) {

    if(value == b_type && value == 1) {
      return 'button_green';
    } else if (value == b_type && value == 0) {
      return 'button_red';
    } else {
      return 'button_rank';
    }

  }

  getClass3(value: number) {

    if(value > 3) {
      return 'blue_all';
    } else {
      return 'red_all';
    }

  }


  regenerateFilter() {
    console.log("regenerateFilter: Start: ");

    if (this.apiMatchL2) {

      this.apiMatchL2_filter = [];

      // Sort Matches by MatchNum
      this.apiMatchL2.sort((a, b) => a.matchNum - b.matchNum);
      
      // Filter
      for (const m of this.apiMatchL2) {

        if (m.scoutingStatus === null ) { 
          //Break out of for loop once the first unscouted record is found
          this.apiMatchL2_filter.push(m);
          break;
        }
       } 
    } else {
      this.apiMatchL2_filter = [];
    }
  }


}
