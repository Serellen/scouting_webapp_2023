import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { DriveBaseTypes } from 'src/app/drivebasetypes';
import { DriveMotorTypes } from 'src/app/drivemotortypes';
import { ManipulatorTypes } from 'src/app/manipulatortypes';
import { ApiService } from 'src/app/services/api.service';
import { PitScouting } from '../../pitScouting';
import { Scouters } from '../../scouters';
import { BuildTypes } from '../../buildTypes'
import { SuperClimbTypes } from '../../superClimbTypes'
import { CenterGravityTypes } from '../../centerGravityTypes'

@Component({
  selector: 'app-pit',
  templateUrl: './pit.component.html',
  styleUrls: ['./pit.component.scss']
})
export class PitComponent implements OnInit {

  apiPit: PitScouting[] = []
  apiPit_filter: PitScouting[] = [];
  apiScouters: Scouters[] = [];
  scouter: number = -1;
  display: number = 1;
  team: string = '';
  apiDriveBaseTypes: DriveBaseTypes[] = [];
  apiDriveMotorTypes: DriveMotorTypes[] = [];
  apiManipulatorTypes: ManipulatorTypes[] = [];
  apiBuildTypes: BuildTypes[] = [];
  apiSuperClimbTypes: SuperClimbTypes[] = [];
  apiCenterGravityTypes: CenterGravityTypes[] = [];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private route: ActivatedRoute) {

    this.apiPit = [];
    this.apiPit_filter = [];
    
    this.apiService.PitReplay.subscribe(team => {
      this.apiPit = team;
      this.regenerateFilter();
    });

    this.apiService.ScouterReplay.subscribe(types => {
      this.apiScouters = types;
    });

    this.apiService.DriveBaseTypesReplay.subscribe(types => {
      this.apiDriveBaseTypes = types;
    });

    this.apiService.DriveMotorTypesReplay.subscribe(types => {
      this.apiDriveMotorTypes = types;
    });

    this.apiService.ManipulatorTypesReplay.subscribe(types => {
      this.apiManipulatorTypes = types;
    });

    this.apiService.BuildTypesReplay.subscribe(types => {
      this.apiBuildTypes = types;
    });

    this.apiService.SuperClimbTypesReplay.subscribe(types => {
      this.apiSuperClimbTypes = types;
    });

    this.apiService.CenterGravityTypesReplay.subscribe(types => {
      this.apiCenterGravityTypes = types;
    });

   }


  ngOnInit(): void {
    //this.team = this.route.snapshot.paramMap.get('team') || '';
    this.route.params.subscribe((params: Params) => {
      this.team = params['team'];
      this.scouter = params['scouter'];
    });
    console.log("team: [" + this.team + "] scouter: [" + this.scouter + "]");

    this.regenerateFilter();

  }

  select(scouter: number) {
    // Sets Scouter to be passed to next record
    this.scouter = scouter;

  }


  changeDisplay(d_value: number, scouter: number) {
    this.display = this.display + d_value;  

    if(this.display > 1 && scouter < 1) {
      alert("Please select a Scouter Name");
      this.display = 1;
    }

    if(this.display > 5) {
      this.display = 1;
    }
  }

  save(status: number) {

    for (const x of this.apiPit) {
 
      if (x.team == this.team ) { 
        // Set scouter to existing scouter value
        x.scoutingStatus = status;
      }
    } 

    this.apiService.savePitData(this.apiPit_filter);

  }

  cancel(team: string) {
    for (const x of this.apiPit) {
 
      if (x.team == team ) { 
        // Set scouter to 0 - available to work
        x.scoutingStatus = 0;
        //console.log("Team: " + team + " Status: " + x.scoutingStatus);
      }
    } 

    this.apiService.updatePitStatus(this.apiPit_filter);

  }

  getClass(value: number, b_type: number) {

    if(value == b_type) {
      return 'button_green';
    } else {
      return 'button_rank';
    }

  }


  regenerateFilter() {
    console.log("regenerateFilter: Start: ");

    if (this.apiPit) {

      this.apiPit_filter = [];

      // Filter
      for (const p of this.apiPit) {
 
        if (p.team == this.team ) { 
          // Set scouter to existing scouter value
          p.scouterID = this.scouter;

          // Set scouting status to 1 - checked out
          p.scoutingStatus = 1;

          this.apiPit_filter.push(p);
          //Break out of for loop once the first unscouted record is found
          break;
        }
       } 
    } else {
      this.apiPit_filter = [];
    }

    this.apiService.updatePitStatus(this.apiPit_filter);
  }

}
