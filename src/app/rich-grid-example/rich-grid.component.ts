import { Component, ViewEncapsulation } from '@angular/core';
// for enterprise features
import { GridApi, Module, ColDef, ColGroupDef, GridReadyEvent, CellClickedEvent, CellDoubleClickedEvent, CellContextMenuEvent, ICellRendererParams } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';

import { ProficiencyFilter } from '../filters/proficiency.component.filter';
//import { SkillFilter } from '../filters/skill.component.filter';
import RefData from '../data/refData';
import { HeaderGroupComponent } from '../header-group-component/header-group.component';
//import { DateComponent } from '../date-component/date.component';
import { SortableHeaderComponent } from '../header-component/sortable-header.component';
import { RendererComponent } from '../renderer-component/renderer.component';
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { GridDataService, GridRow } from './grid-data.service';

// set your key here
// import {LicenseManager} from "@ag-grid-enterprise/core";
// LicenseManager.setLicenseKey(<your key>);

@Component({
  selector: 'rich-grid',
  templateUrl: 'rich-grid.component.html',
  styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {
  //gridData: GridRow[] = []; // Initialize the gridData property

  public rowData: any[];
  public columnDefs!: (ColDef | ColGroupDef)[];
  public rowCount!: string;

  public defaultColDef: ColDef;
  public components: any;
  public sideBar!: boolean;

  public modules: Module[] = [
    ClientSideRowModelModule,
    MenuModule,
    SideBarModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    StatusBarModule,
    GridChartsModule,
    RowGroupingModule,
    SetFilterModule,
    RangeSelectionModule
  ];

  public api!: GridApi;

  constructor(private gridDataService: GridDataService) {
    this.rowData = [];
    this.defaultColDef = {
      filter: true,
      floatingFilter: true,
      headerComponent: 'sortableHeaderComponent',
      headerComponentParams: {
        menuIcon: 'fa-bars'
      },
      cellDataType: false,
    };

    this.components = {
      sortableHeaderComponent: SortableHeaderComponent,
      //agDaeInput: DateComponent,
      headerGroupComponent: HeaderGroupComponent,
      rendererComponent: RendererComponent
    };
    //this.gridDataService.getGridData().subscribe(
    //  (data: GridRow[]) => {
    //    this.rowData = data;
    //    // Perform any additional operations with the data
    //  },
    //  (error: any) => {
    //    // Handle the error here
    //    console.error('An error occurred while fetching data:', error);
    //  }
    //);

    this.createRowData();
    this.createColumnDefs();
  }

  public createRowData() {
    //alert('hello')
    const rowData: GridRow[] = [];

    this.gridDataService.getGridData().subscribe(
      (data: GridRow[]) => {
        this.rowData = data;
      },
      (error: any) => {
        // Handle the error here
        console.error('An error occurred while fetching data:', error);
      }
    );



    //for (let i = 0; i < 200; i++) {
    //    const countryData = RefData.countries[i % RefData.countries.length];
    //    rowData.push({
    //        name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
    //        skills: {
    //            android: Math.random() < 0.4,
    //            html5: Math.random() < 0.4,
    //            mac: Math.random() < 0.4,
    //            windows: Math.random() < 0.4,
    //            css: Math.random() < 0.4
    //        },
    //        dob: RefData.DOBs[i % RefData.DOBs.length],
    //        address: RefData.addresses[i % RefData.addresses.length],
    //        years: Math.round(Math.random() * 100),
    //        proficiency: Math.round(Math.random() * 100),
    //        country: countryData.country,
    //        continent: countryData.continent,
    //        language: countryData.language,
    //        mobile: createRandomPhoneNumber()
    //    });
    //}

    // this.rowData = rowData;
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: '#',
        width: 40,
        checkboxSelection: true,
        filter: false,
        sortable: false,
        suppressMenu: true,
        pinned: true
      },
      {
        headerName: 'Call Id',
        headerGroupComponent: 'headerGroupComponent',
        children: [
          {
            field: 'callId',
            width: 150,
            pinned: true,
            enableRowGroup: true,
            enablePivot: true
          }
        ]
      },
      {
        headerName: 'Call Phases',
        children: [
          {
            field: 'recordingState',
            width: 160,
            sortable: false,
            cellRenderer: percentCellRenderer,
            menuTabs: ['filterMenuTab'],
            //filter: SkillFilter,
            enableRowGroup: true,
            enablePivot: true
          },
          {
            field: 'transcodingState',
            width: 160,
            cellRenderer: percentCellRenderer,
            menuTabs: ['filterMenuTab'],
            filter: ProficiencyFilter
          },
          {
            field: 'archivalState',
            width: 160,
            cellRenderer: percentCellRenderer,
            menuTabs: ['filterMenuTab'],
            filter: ProficiencyFilter
          },
          {
            field: 'reconciliationState',
            width: 160,
            cellRenderer: percentCellRenderer,
            menuTabs: ['filterMenuTab'],
            filter: ProficiencyFilter
          },
        ]
      },
      //{
      //    headerName: 'Contact',
      //    children: [
      //        {
      //            field: 'mobile',
      //            cellRenderer: RendererComponent,
      //            minWidth: 150,
      //            filter: 'agTextColumnFilter'
      //        },
      //        {
      //            field: 'address',
      //            minWidth: 500,
      //            filter: 'agTextColumnFilter'
      //        }
      //    ]
      //}
    ];
  }

  private calculateRowCount() {
    if (this.api && this.rowData) {
      const model = this.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  public onModelUpdated() {
    console.log('onModelUpdated');
    this.calculateRowCount();
  }

  public onGridReady(params: GridReadyEvent) {
    console.log('onGridReady');

    this.api = params.api;
    this.api.sizeColumnsToFit();

    this.calculateRowCount();
  }

  public onCellClicked($event: CellClickedEvent) {
    console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellDoubleClicked($event: CellDoubleClickedEvent) {
    console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellContextMenu($event: CellContextMenuEvent) {
    console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onQuickFilterChanged($event: any) {
    this.api.setQuickFilter($event.target.value);
  }

  //public invokeSkillsFilterMethod() {
  //    this.api.getFilterInstance('skills', (instance) => {
  //        (instance as any).helloFromSkillsFilter();
  //    });
  //}

  //public dobFilter() {
  //    this.api.getFilterInstance('dob', (dateFilterComponent: any) => {
  //        dateFilterComponent.setModel({
  //            type: 'equals',
  //            dateFrom: '2000-01-01'
  //        });

  //        this.api.onFilterChanged();
  //    });
  //}

  //public toggleSidebar($event: any) {
  //    this.sideBar = $event.target.checked;
  //}
}

function skillsCellRenderer(params: ICellRendererParams) {
  const data = params.data;
  const skills: string[] = [];
  RefData.IT_SKILLS.forEach(function (skill) {
    if (data && data.skills && data.skills[skill]) {
      skills.push(`<img src="images/skills/${skill}.png" width="16px" title="${skill}" />`);
    }
  });
  return skills.join(' ');
}

//function countryCellRenderer(params: ICellRendererParams) {
//    return `<img border='0' width='15' height='10' style='margin-bottom: 2px' src='images/flags/${RefData.COUNTRY_CODES[params.value]}.png'>${params.value}`;
//}

//function createRandomPhoneNumber() {
//  let result = '+';
//  for (let i = 0; i < 12; i++) {
//    result += Math.round(Math.random() * 10);
//    if (i === 2 || i === 5 || i === 8) {
//      result += ' ';
//    }
//  }
//  return result;
//}

function percentCellRenderer(params: ICellRendererParams) {
  const value = params.value;

  const eDivPercentBar = document.createElement('div');
  eDivPercentBar.className = 'div-percent-bar';
  eDivPercentBar.style.width = '100%';
  if (value === "Pass") {
    eDivPercentBar.style.backgroundColor = '#7beda9';
  } else if (value === "InProgress") {
    eDivPercentBar.style.backgroundColor = '#f7f259';
  } else if (value === "Unknown") {
    eDivPercentBar.style.backgroundColor = '#d4d3cd';
  }
  else {
    eDivPercentBar.style.backgroundColor = '#fa4d4d';
  }

  eDivPercentBar.textContent = value;

  const eOuterDiv = document.createElement('div');
  eOuterDiv.className = 'div-outer-div';
  eOuterDiv.appendChild(eDivPercentBar);

  return eOuterDiv;
}

// Utility function used to pad the date formatting.
//function pad(num: number, totalStringSize: number) {
//    let asString = num + '';
//    while (asString.length < totalStringSize) { asString = '0' + asString; }
//    return asString;
//}

