import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatchScoutingL2 } from 'src/app/matchScoutingL2';
import { ApiService } from 'src/app/services/api.service';
import { MatchScoutingL1 } from '../../matchScoutingL1';



export interface MemoryTypes {
  memoryTypeID: string;
  memoryType: string
}

export interface MatchHeader {
  matchScoutingID: number;
  eventID: number;
  matchID: number;
  matchNum: number;
  allianceStationID: number;
  team: string;
  scoutingStatus: number;
  scouterID: number;
}



@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

  apiLevel1: MatchScoutingL1[] = [];
  apiMatchL1: MatchScoutingL1[] = [];
  apiLevel2: MatchScoutingL2[] = [];
  apiMatchL2: MatchScoutingL2[] = [];
  apiFilter1: MatchHeader[] = [];

  dumpMemory: string = '';
  memoryType: string = '';

  memoryTypes: MemoryTypes[] = [{memoryTypeID:"MatchL1",memoryType:"Match Records-Level 1"},
                                {memoryTypeID:"MatchL2",memoryType:"Match Records-Level 2"},
                                {memoryTypeID:"Level1",memoryType:"Stored Records-Level 1"},
                                {memoryTypeID:"Level2",memoryType:"Stored Records-Level 2"}];

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) { 

    this.apiLevel1 = [];
    this.apiMatchL1 = [];
    this.apiLevel2 = [];
    this.apiMatchL2 = [];
    this.apiFilter1 = [];
    
    this.apiService.MatchL1Replay.subscribe(match => {
      this.apiMatchL1 = match;
    });

    this.apiService.StoredL1Replay.subscribe(match => {
      this.apiLevel1 = match;
    });

    this.apiService.MatchL2Replay.subscribe(match => {
      this.apiMatchL2 = match;
    });

    this.apiService.StoredL2Replay.subscribe(match => {
      this.apiLevel2 = match;
    });
    

    this.regenerateFilter();

  }

  ngOnInit(): void {
    // this.regenerateFilter();
  }

  select(type: string) {
    this.memoryType = type;
    this.dumpMemory = (localStorage.getItem(this.memoryType)) || "<empty>";

    this.regenerateFilter();
  }


  regenerateFilter() {
    console.log("regenerateFilter: Start: ");

    if (this.memoryType == "Level1" && this.apiLevel1) {

      this.apiFilter1 = [];
      
      // Filter
      for (const m of this.apiLevel1) {
        this.apiFilter1.push({matchScoutingID:m.matchScoutingID,
                              eventID:m.eventID,
                              matchID:m.matchID,
                              matchNum:m.matchNum,
                              allianceStationID:m.allianceStationID,
                              team:m.team,
                              scoutingStatus:m.scoutingStatus,
                              scouterID:m.scouterID});
      } 
    } else if (this.memoryType == "MatchL1" && this.apiMatchL1) {

      this.apiFilter1 = [];
      
      // Filter
      for (const m of this.apiMatchL1) {
        this.apiFilter1.push({matchScoutingID:m.matchScoutingID,
                              eventID:m.eventID,
                              matchID:m.matchID,
                              matchNum:m.matchNum,
                              allianceStationID:m.allianceStationID,
                              team:m.team,
                              scoutingStatus:m.scoutingStatus,
                              scouterID:m.scouterID});
      } 
    } else     if (this.memoryType == "Level2" && this.apiLevel2) {

      this.apiFilter1 = [];
      
      // Filter
      for (const m of this.apiLevel2) {
        this.apiFilter1.push({matchScoutingID:m.matchScoutingL2ID,
                              eventID:m.eventID,
                              matchID:m.matchID,
                              matchNum:m.matchNum,
                              allianceStationID:m.allianceStationID,
                              team:m.team,
                              scoutingStatus:m.scoutingStatus,
                              scouterID:m.scouterID});
      } 
    } else if (this.memoryType == "MatchL2" && this.apiMatchL2) {

      this.apiFilter1 = [];
      
      // Filter
      for (const m of this.apiMatchL2) {
        this.apiFilter1.push({matchScoutingID:m.matchScoutingL2ID,
                              eventID:m.eventID,
                              matchID:m.matchID,
                              matchNum:m.matchNum,
                              allianceStationID:m.allianceStationID,
                              team:m.team,
                              scoutingStatus:m.scoutingStatus,
                              scouterID:m.scouterID});
      } 
    } else {
      this.apiFilter1 = [];
    }
  }




  

}
